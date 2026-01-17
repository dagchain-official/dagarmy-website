import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const keywords = searchParams.get('keywords') || 'Python';
  const location = searchParams.get('location') || 'United States';
  const maxPages = parseInt(searchParams.get('pages') || '2');

  try {
    const jobs = [];
    const jobIds = [];

    // Step 1: Scrape job IDs from listing pages
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
          jobTitle: null,
          level: null,
          location: null,
          description: null,
          postedDate: null,
          jobUrl: `https://www.linkedin.com/jobs/view/${jobId}`,
          scrapedAt: new Date().toISOString()
        };

        // Extract company name
        try {
          job.company = $job('div.top-card-layout__card').find('a').find('img').attr('alt') || 
                        $job('div.top-card-layout__card').find('a').text().trim();
        } catch (e) {
          console.error(`Error extracting company for job ${jobId}:`, e.message);
        }

        // Extract job title
        try {
          job.jobTitle = $job('div.top-card-layout__entity-info').find('a').text().trim() ||
                         $job('h1.top-card-layout__title').text().trim();
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

        // Extract description (first 500 chars)
        try {
          const desc = $job('div.show-more-less-html__markup').text().trim();
          job.description = desc.substring(0, 500) + (desc.length > 500 ? '...' : '');
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
