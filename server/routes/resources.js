const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Resource = require('../models/Resource');
const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/resources');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resource-' + uniqueSuffix + path.extname(file.originalname));
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

// Database storage is now used for resource posts

// LinkedIn configuration
const LINKEDIN_ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const LINKEDIN_PROFILE_ID = process.env.LINKEDIN_PROFILE_ID || 'philipodiakose';

// Cache for LinkedIn posts
let linkedinPosts = null;
let cacheExpiry = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Helper function to generate unique ID
const generateId = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Helper function to categorize posts based on content
const categorizePost = (content) => {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('measurement') || lowerContent.includes('metric') || lowerContent.includes('analytics') || lowerContent.includes('evaluation')) {
    return 'PR Measurement';
  } else if (lowerContent.includes('digital') || lowerContent.includes('social media') || lowerContent.includes('online')) {
    return 'Digital PR';
  } else if (lowerContent.includes('strategy') || lowerContent.includes('planning') || lowerContent.includes('campaign')) {
    return 'Strategy';
  } else if (lowerContent.includes('future') || lowerContent.includes('trend') || lowerContent.includes('emerging') || lowerContent.includes('technology')) {
    return 'Industry Trends';
  } else if (lowerContent.includes('case study') || lowerContent.includes('example') || lowerContent.includes('success')) {
    return 'Case Studies';
  } else {
    return 'Insights';
  }
};

// Function to get LinkedIn posts
const getLinkedInPosts = async () => {
  // Check cache first
  if (linkedinPosts && cacheExpiry && Date.now() < cacheExpiry) {
    return linkedinPosts;
  }

  if (!LINKEDIN_ACCESS_TOKEN) {
    console.log('LinkedIn access token not configured, using mock data');
    return []; // Return empty array instead of mock data
  }

  try {
    // Fetch posts from LinkedIn API
    const response = await axios.get(`https://api.linkedin.com/v2/shares`, {
      headers: {
        'Authorization': `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
        'X-Restli-Protocol-Version': '2.0.0'
      },
      params: {
        q: 'owners',
        owners: `urn:li:person:${LINKEDIN_PROFILE_ID}`,
        count: 20,
        sortBy: 'LAST_MODIFIED'
      }
    });

    const posts = response.data.elements || [];
    
    // Process and format posts
    const formattedPosts = posts.map(post => {
      const content = post.text?.text || '';
      const category = categorizePost(content);
      
      return {
        id: post.id || generateId(),
        title: content.split('\n')[0].substring(0, 100) + (content.length > 100 ? '...' : ''),
        content: content,
        publishedAt: new Date(post.lastModified?.time || Date.now()).toISOString(),
        category: category,
        linkedinUrl: `https://www.linkedin.com/feed/update/${post.id}/`,
        image: post.content?.contentEntities?.[0]?.thumbnails?.[0]?.resolvedUrl || 
               `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg`,
        engagement: {
          likes: Math.floor(Math.random() * 100) + 10,
          comments: Math.floor(Math.random() * 20) + 2,
          shares: Math.floor(Math.random() * 15) + 1
        }
      };
    });

    // Cache the results
    linkedinPosts = formattedPosts;
    cacheExpiry = Date.now() + CACHE_DURATION;
    
    return formattedPosts;
  } catch (error) {
    console.error('Error fetching LinkedIn posts:', error.response?.data || error.message);
    return []; // Return empty array on error
  }
};

// Get resource posts endpoint
router.get('/posts', async (req, res) => {
  try {
    console.log('Fetching resource posts from database...');

    // Get manual posts from database
    const dbPosts = await Resource.getPublished();
    console.log('Database posts fetched:', dbPosts.length);

    // Convert database posts to the expected format
    const manualPosts = dbPosts.map(post => ({
      id: post._id.toString(),
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      image: post.image,
      tags: post.tags,
      author: post.author,
      date: post.formattedDate,
      readTime: post.readTime,
      engagement: post.engagement,
      status: post.status,
      linkedinUrl: post.linkedinUrl || 'https://www.linkedin.com/in/philipodiakose/',
      publishedAt: post.publishedAt,
      isManual: true,
      seoTitle: post.seo.title,
      seoDescription: post.seo.description,
      slug: post.seo.slug
    }));

    // Get LinkedIn posts
    let formattedLinkedInPosts = [];
    try {
      const linkedinPosts = await getLinkedInPosts();

      // Format LinkedIn posts to match our interface
      formattedLinkedInPosts = linkedinPosts.map(post => ({
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

      console.log('LinkedIn posts fetched:', formattedLinkedInPosts.length);
    } catch (linkedinError) {
      console.log('LinkedIn fetch failed:', linkedinError.message);
    }

    // Combine manual posts with LinkedIn posts (manual posts first)
    const allPosts = [...manualPosts, ...formattedLinkedInPosts];
    console.log('Total posts (database + LinkedIn):', allPosts.length);

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
        manualPosts: manualPosts.length,
        linkedinPosts: formattedLinkedInPosts.length,
        lastUpdated: new Date().toISOString(),
        linkedinConnected: !!LINKEDIN_ACCESS_TOKEN
      }
    });

  } catch (error) {
    console.error('Error in resource posts endpoint:', error);
    res.status(500).json({
      error: 'Failed to fetch resource posts',
      posts: [], // Return empty array on database error
      meta: {
        totalPosts: 0,
        manualPosts: 0,
        linkedinPosts: 0,
        lastUpdated: new Date().toISOString(),
        linkedinConnected: !!LINKEDIN_ACCESS_TOKEN
      }
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

// Create new resource post
router.post('/posts', upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      category,
      imageUrl,
      tags,
      author,
      status,
      readTime,
      seoTitle,
      seoDescription,
      slug
    } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Handle image - either uploaded file or URL
    let image = imageUrl || '';
    if (req.file) {
      // Generate full URL for production
      const baseUrl = process.env.PUBLIC_URL || process.env.BACKEND_URL || 'https://pr-book.onrender.com';
      image = `${baseUrl}/uploads/resources/${req.file.filename}`;
      console.log('Generated image URL:', image);
    }

    // Create new resource in database
    const newResource = new Resource({
      title: title.trim(),
      excerpt: excerpt?.trim() || content.substring(0, 150) + '...',
      content: content.trim(),
      category: category || 'Insights',
      image: image,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      author: author || 'Philip Odiakose',
      status: status || 'published',
      readTime: readTime ? parseInt(readTime) : Math.ceil(content.split(/\s+/).length / 200),
      seo: {
        title: (seoTitle && seoTitle.trim()) || title.trim(),
        description: (seoDescription && seoDescription.trim()) || (excerpt && excerpt.trim()) || content.substring(0, 160) + '...',
        slug: (slug && slug.trim()) || title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
      },
      source: 'manual',
      linkedinUrl: 'https://www.linkedin.com/in/philipodiakose/'
    });

    // Save to database
    const savedResource = await newResource.save();
    console.log('Created new resource in database with ID:', savedResource._id);
    console.log('Image URL:', savedResource.image);

    // Format response to match frontend expectations
    const responsePost = {
      id: savedResource._id.toString(),
      title: savedResource.title,
      excerpt: savedResource.excerpt,
      content: savedResource.content,
      category: savedResource.category,
      image: savedResource.image,
      tags: savedResource.tags,
      author: savedResource.author,
      date: savedResource.formattedDate,
      readTime: savedResource.readTime,
      engagement: savedResource.engagement,
      status: savedResource.status,
      linkedinUrl: savedResource.linkedinUrl,
      publishedAt: savedResource.publishedAt,
      isManual: true,
      seoTitle: savedResource.seo.title,
      seoDescription: savedResource.seo.description,
      slug: savedResource.seo.slug
    };

    res.status(201).json({
      message: 'Resource post created successfully',
      post: responsePost
    });

  } catch (error) {
    console.error('Error creating resource post:', error);
    res.status(500).json({ error: 'Failed to create resource post' });
  }
});

// Update resource post
router.put('/posts/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      excerpt,
      content,
      category,
      imageUrl,
      tags,
      author,
      status,
      readTime,
      seoTitle,
      seoDescription,
      slug
    } = req.body;

    const postIndex = manualResourcePosts.findIndex(post => post.id === id);
    if (postIndex === -1) {
      return res.status(404).json({ error: 'Resource post not found' });
    }

    const existingPost = manualResourcePosts[postIndex];

    // Handle image - either uploaded file or URL
    let image = imageUrl || existingPost.image;
    if (req.file) {
      // Delete old image if it exists
      if (existingPost.image && (existingPost.image.includes('/uploads/') || existingPost.image.startsWith('/uploads/'))) {
        const oldImagePath = path.join(__dirname, '../uploads/resources', path.basename(existingPost.image));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      // Generate full URL for production
      const baseUrl = process.env.PUBLIC_URL || process.env.BACKEND_URL || 'https://pr-book.onrender.com';
      image = `${baseUrl}/uploads/resources/${req.file.filename}`;
      console.log('Updated image URL:', image);
    }

    const updatedPost = {
      ...existingPost,
      title: (title && title.trim()) || existingPost.title,
      excerpt: (excerpt && excerpt.trim()) || existingPost.excerpt,
      content: (content && content.trim()) || existingPost.content,
      category: category || existingPost.category,
      image: image,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : existingPost.tags,
      author: author || existingPost.author,
      status: status || existingPost.status,
      readTime: readTime ? parseInt(readTime) : existingPost.readTime,
      seoTitle: (seoTitle && seoTitle.trim()) || existingPost.seoTitle,
      seoDescription: (seoDescription && seoDescription.trim()) || existingPost.seoDescription,
      slug: (slug && slug.trim()) || existingPost.slug,
      updatedAt: new Date().toISOString()
    };

    manualResourcePosts[postIndex] = updatedPost;

    res.json({
      message: 'Resource post updated successfully',
      post: updatedPost
    });

  } catch (error) {
    console.error('Error updating resource post:', error);
    res.status(500).json({ error: 'Failed to update resource post' });
  }
});

// Delete resource post
router.delete('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const postIndex = manualResourcePosts.findIndex(post => post.id === id);
    if (postIndex === -1) {
      return res.status(404).json({ error: 'Resource post not found' });
    }

    const post = manualResourcePosts[postIndex];

    // Delete associated image if it exists
    if (post.image && post.image.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '../..', post.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    manualResourcePosts.splice(postIndex, 1);

    res.json({ message: 'Resource post deleted successfully' });

  } catch (error) {
    console.error('Error deleting resource post:', error);
    res.status(500).json({ error: 'Failed to delete resource post' });
  }
});

// Get single resource post
router.get('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check database first
    try {
      const dbPost = await Resource.findById(id);
      if (dbPost) {
        const responsePost = {
          id: dbPost._id.toString(),
          title: dbPost.title,
          excerpt: dbPost.excerpt,
          content: dbPost.content,
          category: dbPost.category,
          image: dbPost.image,
          tags: dbPost.tags,
          author: dbPost.author,
          date: dbPost.formattedDate,
          readTime: dbPost.readTime,
          engagement: dbPost.engagement,
          status: dbPost.status,
          linkedinUrl: dbPost.linkedinUrl,
          publishedAt: dbPost.publishedAt,
          isManual: true,
          seoTitle: dbPost.seo.title,
          seoDescription: dbPost.seo.description,
          slug: dbPost.seo.slug
        };
        return res.json(responsePost);
      }
    } catch (dbError) {
      console.log('Database lookup failed for ID:', id, dbError.message);
    }

    // Check LinkedIn posts as fallback
    try {
      const linkedinPosts = await getLinkedInPosts();
      const linkedinPost = linkedinPosts.find(post => post.id === id);

      if (linkedinPost) {
        return res.json({
          ...linkedinPost,
          excerpt: linkedinPost.content.length > 150 ? linkedinPost.content.substring(0, 147) + '...' : linkedinPost.content,
          date: new Date(linkedinPost.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        });
      }
    } catch (linkedinError) {
      console.log('LinkedIn lookup failed:', linkedinError.message);
    }

    res.status(404).json({ error: 'Resource post not found' });

  } catch (error) {
    console.error('Error fetching resource post:', error);
    res.status(500).json({ error: 'Failed to fetch resource post' });
  }
});

// Image upload endpoint
router.post('/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Generate full URL for production
    const baseUrl = process.env.PUBLIC_URL || process.env.BACKEND_URL || 'https://pr-book.onrender.com';
    const imageUrl = `${baseUrl}/uploads/resources/${req.file.filename}`;
    console.log('Upload endpoint - generated image URL:', imageUrl);
    res.json({
      message: 'Image uploaded successfully',
      imageUrl: imageUrl
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

module.exports = router;
