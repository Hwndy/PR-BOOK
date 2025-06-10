const express = require('express');
const axios = require('axios');
const router = express.Router();

// LinkedIn configuration
const LINKEDIN_ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const LINKEDIN_PROFILE_ID = process.env.LINKEDIN_PROFILE_ID || 'philipodiakose';

// Cache for LinkedIn posts
let linkedinPosts = null;
let cacheExpiry = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Get LinkedIn posts (requires LinkedIn API access)
const getLinkedInPosts = async () => {
  try {
    // Check cache first
    if (linkedinPosts && cacheExpiry && Date.now() < cacheExpiry) {
      return linkedinPosts;
    }

    if (!LINKEDIN_ACCESS_TOKEN) {
      console.log('LinkedIn access token not configured, using mock data');
      return getMockBlogPosts();
    }

    // LinkedIn API call (requires proper authentication)
    const response = await axios.get('https://api.linkedin.com/v2/shares', {
      headers: {
        'Authorization': `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      params: {
        q: 'owners',
        owners: `urn:li:person:${LINKEDIN_PROFILE_ID}`,
        count: 20,
        sortBy: 'LAST_MODIFIED'
      }
    });

    // Process LinkedIn posts
    const posts = response.data.elements.map(post => ({
      id: post.id,
      title: extractTitle(post.text?.text || ''),
      content: post.text?.text || '',
      publishedAt: new Date(post.lastModified).toISOString(),
      category: categorizePost(post.text?.text || ''),
      linkedinUrl: `https://www.linkedin.com/feed/update/${post.id}`,
      engagement: {
        likes: post.totalSocialActivityCounts?.numLikes || 0,
        comments: post.totalSocialActivityCounts?.numComments || 0,
        shares: post.totalSocialActivityCounts?.numShares || 0
      }
    }));

    linkedinPosts = posts;
    cacheExpiry = Date.now() + CACHE_DURATION;

    return posts;
  } catch (error) {
    console.error('Error fetching LinkedIn posts:', error.message);
    return getMockBlogPosts();
  }
};

// Extract title from LinkedIn post content
const extractTitle = (content) => {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length > 0) {
    let title = lines[0].trim();
    // Remove hashtags and clean up
    title = title.replace(/#\w+/g, '').trim();
    // Limit length
    if (title.length > 80) {
      title = title.substring(0, 77) + '...';
    }
    return title || 'LinkedIn Post';
  }
  return 'LinkedIn Post';
};

// Categorize post based on content
const categorizePost = (content) => {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('measurement') || lowerContent.includes('metrics') || lowerContent.includes('analytics')) {
    return 'PR Measurement';
  } else if (lowerContent.includes('digital') || lowerContent.includes('social media') || lowerContent.includes('online')) {
    return 'Digital PR';
  } else if (lowerContent.includes('strategy') || lowerContent.includes('planning') || lowerContent.includes('campaign')) {
    return 'Strategy';
  } else if (lowerContent.includes('trend') || lowerContent.includes('future') || lowerContent.includes('industry')) {
    return 'Industry Trends';
  } else if (lowerContent.includes('case study') || lowerContent.includes('example') || lowerContent.includes('success')) {
    return 'Case Studies';
  } else {
    return 'Insights';
  }
};

// Mock blog posts based on Philip Odiakose's expertise
const getMockBlogPosts = () => [
  {
    id: '1',
    title: 'The Evolution of PR Measurement: Moving Beyond Traditional Metrics',
    content: 'In today\'s digital landscape, PR measurement has evolved far beyond simple media mentions and advertising value equivalents (AVE). Modern PR professionals need sophisticated measurement frameworks that capture the true impact of communications efforts across multiple channels and touchpoints.',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    category: 'PR Measurement',
    linkedinUrl: 'https://www.linkedin.com/in/philipodiakose/',
    image: 'https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg',
    engagement: { likes: 45, comments: 12, shares: 8 }
  },
  {
    id: '2',
    title: 'Data-Driven PR: How Analytics Transform Communication Strategy',
    content: 'The integration of data analytics into PR strategy is no longer optional—it\'s essential. By leveraging data insights, PR professionals can make informed decisions, optimize campaigns in real-time, and demonstrate clear ROI to stakeholders.',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    category: 'Strategy',
    linkedinUrl: 'https://www.linkedin.com/in/philipodiakose/',
    image: 'https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg',
    engagement: { likes: 67, comments: 18, shares: 15 }
  },
  {
    id: '3',
    title: 'Sentiment Analysis in PR: Understanding Emotional Impact',
    content: 'Modern sentiment analysis tools powered by AI and machine learning provide unprecedented insights into how audiences truly feel about your brand, campaigns, and messaging. This goes far beyond simple positive/negative classifications.',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    category: 'Digital PR',
    linkedinUrl: 'https://www.linkedin.com/in/philipodiakose/',
    image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg',
    engagement: { likes: 89, comments: 24, shares: 19 }
  },
  {
    id: '4',
    title: 'Building Effective PR Dashboards: Visualization That Drives Action',
    content: 'Creating PR dashboards that stakeholders actually use requires more than just pretty charts. Learn how to design measurement frameworks and visualizations that drive strategic decision-making and demonstrate clear business value.',
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    category: 'PR Measurement',
    linkedinUrl: 'https://www.linkedin.com/in/philipodiakose/',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    engagement: { likes: 52, comments: 16, shares: 11 }
  },
  {
    id: '5',
    title: 'The Future of PR Evaluation: Emerging Trends and Technologies',
    content: 'As we look toward the future of PR measurement, emerging technologies like AI, machine learning, and advanced analytics are reshaping how we evaluate communication effectiveness. Here\'s what PR professionals need to know.',
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
    category: 'Industry Trends',
    linkedinUrl: 'https://www.linkedin.com/in/philipodiakose/',
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
    engagement: { likes: 73, comments: 21, shares: 17 }
  },
  {
    id: '6',
    title: 'Crisis Communication Measurement: Tracking Recovery and Impact',
    content: 'When crisis strikes, measurement becomes critical for understanding impact, tracking recovery, and demonstrating the effectiveness of crisis communication efforts. Learn the key metrics and methodologies for crisis PR evaluation.',
    publishedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), // 18 days ago
    category: 'Case Studies',
    linkedinUrl: 'https://www.linkedin.com/in/philipodiakose/',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
    engagement: { likes: 94, comments: 28, shares: 22 }
  }
];

// Get blog posts endpoint
router.get('/posts', async (req, res) => {
  try {
    const posts = await getLinkedInPosts();
    
    // Format posts for frontend
    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.content.length > 150 ? post.content.substring(0, 147) + '...' : post.content,
      content: post.content,
      category: post.category,
      date: new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      publishedAt: post.publishedAt,
      linkedinUrl: post.linkedinUrl,
      image: post.image || `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg`,
      engagement: post.engagement
    }));

    res.json({
      posts: formattedPosts,
      profile: {
        name: 'Philip Odiakose',
        title: 'PR Measurement & Analytics Expert',
        linkedinUrl: 'https://www.linkedin.com/in/philipodiakose/',
        bio: 'Expert in PR measurement, analytics, and evaluation with extensive experience in data-driven communication strategies.'
      },
      meta: {
        totalPosts: formattedPosts.length,
        lastUpdated: new Date().toISOString(),
        linkedinConnected: !!LINKEDIN_ACCESS_TOKEN
      }
    });

  } catch (error) {
    console.error('Error in blog posts endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to fetch blog posts',
      posts: getMockBlogPosts().slice(0, 3) // Return limited mock data as fallback
    });
  }
});

// Get single blog post
router.get('/posts/:id', async (req, res) => {
  try {
    const posts = await getLinkedInPosts();
    const post = posts.find(p => p.id === req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error fetching single post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Refresh cache endpoint
router.post('/refresh', async (req, res) => {
  try {
    // Clear cache
    linkedinPosts = null;
    cacheExpiry = null;
    
    // Fetch fresh data
    const posts = await getLinkedInPosts();
    
    res.json({ 
      message: 'Cache refreshed successfully',
      postsCount: posts.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error refreshing cache:', error);
    res.status(500).json({ error: 'Failed to refresh cache' });
  }
});

module.exports = router;
