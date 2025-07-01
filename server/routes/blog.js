const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/blog');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'blog-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// In-memory storage for manual blog posts (use database in production)
let manualBlogPosts = [];
let nextPostId = 1;

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
    excerpt: 'Modern PR measurement has evolved beyond traditional metrics like AVE. Discover sophisticated frameworks that capture true communication impact across multiple channels and demonstrate real business value.',
    content: `In today's digital landscape, PR measurement has evolved far beyond simple media mentions and advertising value equivalents (AVE). Modern PR professionals need sophisticated measurement frameworks that capture the true impact of communications efforts across multiple channels and touchpoints.

The traditional approach to PR measurement often relied on vanity metrics that failed to demonstrate real business value. Today's measurement professionals understand that effective PR evaluation requires a multi-dimensional approach that considers:

**1. Audience Engagement Quality**
Rather than simply counting impressions, we now analyze engagement depth, sentiment, and behavioral outcomes. This includes measuring how audiences interact with content, share it within their networks, and take desired actions.

**2. Business Impact Alignment**
Modern PR measurement directly connects communication activities to business objectives. Whether it's brand awareness, lead generation, or reputation management, every metric should tie back to organizational goals.

**3. Multi-Channel Attribution**
With audiences consuming content across multiple platforms, attribution modeling helps us understand the customer journey and the role of PR in driving conversions and brand affinity.

**4. Real-Time Optimization**
Advanced analytics platforms enable real-time campaign optimization, allowing PR professionals to adjust strategies based on performance data and emerging trends.

The future of PR measurement lies in predictive analytics, AI-powered insights, and integrated measurement frameworks that provide a holistic view of communication effectiveness. Organizations that embrace these advanced measurement approaches will have a significant competitive advantage in demonstrating PR's strategic value.`,
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    category: 'PR Measurement',
    linkedinUrl: 'https://www.linkedin.com/in/philipodiakose/',
    image: 'https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg',
    engagement: { likes: 45, comments: 12, shares: 8 }
  },
  {
    id: '2',
    title: 'Data-Driven PR: How Analytics Transform Communication Strategy',
    excerpt: 'Analytics integration in PR is now essential for success. Learn how data insights enable informed decisions, real-time optimization, and clear ROI demonstration to stakeholders.',
    content: `The integration of data analytics into PR strategy is no longer optional—it's essential. By leveraging data insights, PR professionals can make informed decisions, optimize campaigns in real-time, and demonstrate clear ROI to stakeholders.

**The Analytics Revolution in PR**

The shift toward data-driven PR represents a fundamental transformation in how we approach communication strategy. Traditional PR relied heavily on intuition and experience, but today's environment demands evidence-based decision making.

**Key Analytics Applications:**

**1. Audience Intelligence**
Advanced analytics help identify and understand target audiences with unprecedented precision. By analyzing demographic data, behavioral patterns, and content preferences, PR professionals can craft messages that resonate with specific audience segments.

**2. Content Performance Optimization**
Real-time analytics reveal which content formats, topics, and distribution channels generate the highest engagement. This enables continuous optimization of content strategies and resource allocation.

**3. Competitive Intelligence**
Analytics platforms provide insights into competitor activities, share of voice, and market positioning, enabling more strategic communication planning.

**4. Crisis Prevention and Management**
Predictive analytics can identify potential issues before they escalate, while real-time monitoring enables rapid response during crisis situations.

**Implementation Best Practices:**

- Start with clear objectives and KPIs
- Invest in integrated analytics platforms
- Train teams on data interpretation
- Create regular reporting cadences
- Use insights to inform strategic decisions

The organizations that successfully integrate analytics into their PR operations will be better positioned to demonstrate value, optimize performance, and drive business results through strategic communication.`,
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    category: 'Strategy',
    linkedinUrl: 'https://www.linkedin.com/in/philipodiakose/',
    image: 'https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg',
    engagement: { likes: 67, comments: 18, shares: 15 }
  },
  {
    id: '3',
    title: 'Sentiment Analysis in PR: Understanding Emotional Impact',
    excerpt: 'AI-powered sentiment analysis provides deep insights into audience emotions beyond simple positive/negative classifications. Discover how to leverage advanced sentiment tools for better PR outcomes.',
    content: 'Modern sentiment analysis tools powered by AI and machine learning provide unprecedented insights into how audiences truly feel about your brand, campaigns, and messaging. This goes far beyond simple positive/negative classifications.',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    category: 'Digital PR',
    linkedinUrl: 'https://www.linkedin.com/in/philipodiakose/',
    image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg',
    engagement: { likes: 89, comments: 24, shares: 19 }
  },
  {
    id: '4',
    title: 'Building Effective PR Dashboards: Visualization That Drives Action',
    excerpt: 'Effective PR dashboards go beyond pretty charts to drive strategic decisions. Learn design principles and measurement frameworks that demonstrate clear business value to stakeholders.',
    content: 'Creating PR dashboards that stakeholders actually use requires more than just pretty charts. Learn how to design measurement frameworks and visualizations that drive strategic decision-making and demonstrate clear business value.',
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    category: 'PR Measurement',
    linkedinUrl: 'https://www.linkedin.com/in/philipodiakose/',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    engagement: { likes: 52, comments: 16, shares: 11 }
  },
  {
    id: '5',
    title: 'The Future of PR Evaluation: Emerging Trends and Technologies',
    excerpt: 'Emerging technologies like AI and machine learning are reshaping PR measurement. Explore the future trends and technologies that will define communication effectiveness evaluation.',
    content: 'As we look toward the future of PR measurement, emerging technologies like AI, machine learning, and advanced analytics are reshaping how we evaluate communication effectiveness. Here\'s what PR professionals need to know.',
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    category: 'Industry Trends',
    linkedinUrl: 'https://www.linkedin.com/in/philipodiakose/',
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
    engagement: { likes: 73, comments: 21, shares: 17 }
  },
  {
    id: '6',
    title: 'Crisis Communication Measurement: Tracking Recovery and Impact',
    excerpt: 'Crisis measurement is critical for understanding impact and tracking recovery. Discover key metrics and methodologies for evaluating crisis communication effectiveness.',
    content: 'When crisis strikes, measurement becomes critical for understanding impact, tracking recovery, and demonstrating the effectiveness of crisis communication efforts. Learn the key metrics and methodologies for crisis PR evaluation.',
    publishedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), // 18 days ago
    date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    category: 'Case Studies',
    linkedinUrl: 'https://www.linkedin.com/in/philipodiakose/',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
    engagement: { likes: 94, comments: 28, shares: 22 }
  }
];

// Get blog posts endpoint
router.get('/posts', async (req, res) => {
  try {
    const linkedinPosts = await getLinkedInPosts();

    // Format LinkedIn posts for frontend
    const formattedLinkedInPosts = linkedinPosts.map(post => ({
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
      engagement: post.engagement,
      isManual: false
    }));

    // Combine manual posts with LinkedIn posts (manual posts first)
    const allPosts = [...manualBlogPosts, ...formattedLinkedInPosts];

    res.json({
      posts: allPosts,
      profile: {
        name: 'Philip Odiakose',
        title: 'PR Measurement & Analytics Expert',
        linkedinUrl: 'https://www.linkedin.com/in/philipodiakose/',
        bio: 'Expert in PR measurement, analytics, and evaluation with extensive experience in data-driven communication strategies.'
      },
      meta: {
        totalPosts: allPosts.length,
        manualPosts: manualBlogPosts.length,
        linkedinPosts: formattedLinkedInPosts.length,
        lastUpdated: new Date().toISOString(),
        linkedinConnected: !!LINKEDIN_ACCESS_TOKEN
      }
    });

  } catch (error) {
    console.error('Error in blog posts endpoint:', error);
    res.status(500).json({
      error: 'Failed to fetch blog posts',
      posts: [...manualBlogPosts, ...getMockBlogPosts().slice(0, 3)] // Include manual posts in fallback
    });
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

// Admin authentication middleware
const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = atob(token);
    if (decoded.includes('admin')) {
      next();
    } else {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Image upload endpoint
router.post('/upload-image', adminAuth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageUrl = `/uploads/blog/${req.file.filename}`;

    res.json({
      success: true,
      url: imageUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Create new blog post (admin only)
router.post('/posts', adminAuth, async (req, res) => {
  try {
    const { title, excerpt, content, category, image, tags, author, seoTitle, seoDescription, status } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Title, content, and category are required' });
    }

    const newPost = {
      id: `manual_${nextPostId++}`,
      title,
      excerpt: excerpt || content.substring(0, 150) + '...',
      content,
      category,
      image: image || `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg`,
      tags: tags || [],
      author: author || 'Philip Odiakose',
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt,
      status: status || 'published',
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      publishedAt: new Date().toISOString(),
      linkedinUrl: 'https://www.linkedin.com/in/philipodiakose/',
      engagement: {
        likes: Math.floor(Math.random() * 100) + 10,
        comments: Math.floor(Math.random() * 30) + 5,
        shares: Math.floor(Math.random() * 20) + 2
      },
      isManual: true
    };

    manualBlogPosts.unshift(newPost); // Add to beginning of array

    res.status(201).json({
      success: true,
      post: newPost,
      message: 'Blog post created successfully'
    });

  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

// Update blog post (admin only)
router.put('/posts/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const postIndex = manualBlogPosts.findIndex(post => post.id === id);

    if (postIndex === -1) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // Update the post
    manualBlogPosts[postIndex] = {
      ...manualBlogPosts[postIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      post: manualBlogPosts[postIndex],
      message: 'Blog post updated successfully'
    });

  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

// Delete blog post (admin only)
router.delete('/posts/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const postIndex = manualBlogPosts.findIndex(post => post.id === id);

    if (postIndex === -1) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const deletedPost = manualBlogPosts.splice(postIndex, 1)[0];

    res.json({
      success: true,
      message: 'Blog post deleted successfully',
      deletedPost
    });

  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

// Get single blog post
router.get('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check manual posts first
    const manualPost = manualBlogPosts.find(post => post.id === id);
    if (manualPost) {
      return res.json(manualPost);
    }

    // Check LinkedIn posts
    const linkedinPosts = await getLinkedInPosts();
    const linkedinPost = linkedinPosts.find(post => post.id === id);

    if (linkedinPost) {
      return res.json(linkedinPost);
    }

    res.status(404).json({ error: 'Blog post not found' });

  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

module.exports = router;
