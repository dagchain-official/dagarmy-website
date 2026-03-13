import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import redis from '@/lib/redis';

const CACHE_TTL = 3600; // 1 hour

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const keywords = searchParams.get('keywords') || 'Python';
  const location = searchParams.get('location') || 'United States';
  const maxPages = parseInt(searchParams.get('pages') || '2');

  const cacheKey = `jobs:${keywords.toLowerCase()}:${location.toLowerCase()}`;

  try {
    // Serve from Redis cache if available
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json({ success: true, count: cached.length, jobs: cached, keywords, location, fromCache: true });
    }

    const jobs = [];
    const jobIds = [];
    const logoMap = {};    // jobId -> logo URL from listing page
    const companyMap = {}; // jobId -> company name from listing page
    const titleMap = {};   // jobId -> clean job title from listing page

    // Step 1: Scrape job IDs + logos from listing pages
    const baseUrl = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${encodeURIComponent(keywords)}&location=${encodeURIComponent(location)}&start={}`;
    
    for (let page = 0; page < maxPages; page++) {
      const url = baseUrl.replace('{}', page * 25);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      if (!response.ok) {
        console.error(`Failed to fetch page ${page}: ${response.status}`);
        continue;
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      $('li').each((index, element) => {
        const baseCard = $(element).find('div.base-card');
        const dataUrn = baseCard.attr('data-entity-urn');
        
        if (dataUrn) {
          const jobId = dataUrn.split(':')[3];
          if (jobId) {
            jobIds.push(jobId);
            // Logo lives in the listing card, not the detail page
            const logoImg = $(element).find('div.search-entity-media img, img.artdeco-entity-image').first();
            const logoUrl = logoImg.attr('data-delayed-url') || logoImg.attr('src');
            if (logoUrl && logoUrl.includes('media.licdn.com')) {
              logoMap[jobId] = logoUrl;
            }
            // Company name is cleanly in the listing card subtitle
            const companyName = $(element).find('h4.base-search-card__subtitle a').text().trim() ||
                                $(element).find('h4.base-search-card__subtitle').text().trim();
            if (companyName) companyMap[jobId] = companyName;
            // Job title is cleanly in the listing card h3
            const jobTitle = $(element).find('h3.base-search-card__title').text().trim();
            if (jobTitle) titleMap[jobId] = jobTitle;
          }
        }
      });

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Step 2: Fetch detailed information for each job
    for (const jobId of jobIds.slice(0, 50)) { // Limit to 50 jobs per request
      try {
        const jobUrl = `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${jobId}`;
        
        const jobResponse = await fetch(jobUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });

        if (!jobResponse.ok) {
          console.error(`Failed to fetch job ${jobId}: ${jobResponse.status}`);
          continue;
        }

        const jobHtml = await jobResponse.text();
        const $job = cheerio.load(jobHtml);

        const job = {
          id: jobId,
          company: null,
          companyLogo: logoMap[jobId] || null, // from listing page — media.licdn.com URLs are public
          jobTitle: null,
          level: null,
          location: null,
          description: null,
          postedDate: null,
          jobUrl: `https://www.linkedin.com/jobs/view/${jobId}`,
          scrapedAt: new Date().toISOString()
        };

        // Company name from listing page (reliable); fall back to detail page selectors
        try {
          job.company = companyMap[jobId] ||
                        $job('.topcard__org-name-link').text().trim() ||
                        $job('.top-card-layout__company-url').text().trim() || null;
        } catch (e) {
          console.error(`Error extracting company for job ${jobId}:`, e.message);
        }

        // Extract job title — use listing page value (clean) first
        try {
          job.jobTitle = titleMap[jobId] ||
                         $job('h1.top-card-layout__title').text().trim() ||
                         $job('div.top-card-layout__entity-info').find('a').text().trim();
        } catch (e) {
          console.error(`Error extracting job title for job ${jobId}:`, e.message);
        }

        // Extract seniority level
        try {
          const criteriaList = $job('ul.description__job-criteria-list').find('li').first();
          job.level = criteriaList.text().replace('Seniority level', '').trim();
        } catch (e) {
          console.error(`Error extracting level for job ${jobId}:`, e.message);
        }

        // Extract location
        try {
          job.location = $job('span.topcard__flavor--bullet').text().trim();
        } catch (e) {
          console.error(`Error extracting location for job ${jobId}:`, e.message);
        }

        // Extract full description
        try {
          job.description = $job('div.show-more-less-html__markup').html() || 
                           $job('div.description__text').html() ||
                           $job('div.show-more-less-html__markup').text().trim();
        } catch (e) {
          console.error(`Error extracting description for job ${jobId}:`, e.message);
        }

        // Extract posted date
        try {
          job.postedDate = $job('span.posted-time-ago__text').text().trim();
        } catch (e) {
          console.error(`Error extracting posted date for job ${jobId}:`, e.message);
        }

        // Only add jobs with at least company and title
        if (job.company && job.jobTitle) {
          jobs.push(job);
        }

        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error processing job ${jobId}:`, error.message);
      }
    }

    // Save to Redis cache for next request
    if (jobs.length > 0) {
      await redis.set(cacheKey, jobs, { ex: CACHE_TTL });
    }

    return NextResponse.json({
      success: true,
      count: jobs.length,
      jobs: jobs,
      keywords: keywords,
      location: location
    });

  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        jobs: []
      },
      { status: 500 }
    );
  }
}

// DELETE /api/scrape-jobs — flush all cached job results so next search re-scrapes fresh data
export async function DELETE() {
  try {
    const keys = await redis.keys('jobs:*');
    if (keys.length > 0) {
      await Promise.all(keys.map(k => redis.del(k)));
    }
    return NextResponse.json({ success: true, flushed: keys.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
