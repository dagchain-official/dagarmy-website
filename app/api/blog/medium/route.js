import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Medium RSS feed URL for @dagchain
    const mediumRSSUrl = 'https://medium.com/feed/@dagchain';
    
    // Fetch the RSS feed
    const response = await fetch(mediumRSSUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      cache: 'no-store', // Disable caching to get fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Medium RSS: ${response.status}`);
    }

    const xmlText = await response.text();
    
    // Parse XML to extract blog posts
    const posts = parseRSSFeed(xmlText);
    
    return NextResponse.json({ 
      success: true, 
      posts,
      count: posts.length 
    });
  } catch (error) {
    console.error('Error fetching Medium posts:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch Medium posts', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

function parseRSSFeed(xmlText) {
  const posts = [];
  
  // Extract all <item> elements
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const items = xmlText.match(itemRegex) || [];
  
  items.forEach((item, index) => {
    try {
      // Extract title
      const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
      const title = titleMatch ? titleMatch[1] : '';
      
      // Extract link (Medium article URL)
      const linkMatch = item.match(/<link>(.*?)<\/link>/);
      const link = linkMatch ? linkMatch[1] : '';
      
      // Extract publication date
      const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
      const pubDate = pubDateMatch ? formatDate(pubDateMatch[1]) : '';
      
      // Extract description/content
      const descriptionMatch = item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/);
      let description = '';
      let imageUrl = '';
      
      if (descriptionMatch) {
        const content = descriptionMatch[1];
        
        // Extract first image from content
        const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
        imageUrl = imgMatch ? imgMatch[1] : '/images/blog/default-blog.jpg';
        
        // Extract text content (remove HTML tags)
        const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        description = textContent.substring(0, 200) + '...';
      }
      
      // Extract categories/tags
      const categoryMatches = item.match(/<category><!\[CDATA\[(.*?)\]\]><\/category>/g) || [];
      const categories = categoryMatches.map(cat => {
        const match = cat.match(/<category><!\[CDATA\[(.*?)\]\]><\/category>/);
        return match ? match[1] : '';
      }).filter(Boolean);
      
      // Extract author
      const authorMatch = item.match(/<dc:creator><!\[CDATA\[(.*?)\]\]><\/dc:creator>/);
      const author = authorMatch ? authorMatch[1] : 'DAGChain Team';
      
      // Extract GUID for unique ID
      const guidMatch = item.match(/<guid[^>]*>(.*?)<\/guid>/);
      const guid = guidMatch ? guidMatch[1] : link;
      
      posts.push({
        id: index + 1,
        guid,
        title,
        link,
        description,
        imageUrl,
        pubDate,
        author,
        categories,
        category: categories[0] || 'Blockchain',
      });
    } catch (error) {
      console.error('Error parsing item:', error);
    }
  });
  
  return posts;
}

function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    return dateString;
  }
}
