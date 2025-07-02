const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const Resource = require('../models/Resource');
const router = express.Router();

// JWT secret from environment
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';

// JWT authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Utility function to generate proper base URL
const getBaseUrl = (req) => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.PUBLIC_URL || process.env.BACKEND_URL || 'https://pr-book.onrender.com';
  } else {
    // For development, use the request host
    const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const host = req.get('host') || 'localhost:5000';
    return `${protocol}://${host}`;
  }
};

// Utility function to generate SEO description within character limits
const generateSeoDescription = (seoDescription, excerpt, content) => {
  let desc = '';

  if (seoDescription && seoDescription.trim()) {
    desc = seoDescription.trim();
  } else if (excerpt && excerpt.trim()) {
    desc = excerpt.trim();
  } else if (content) {
    // Remove HTML tags and get plain text
    desc = content.replace(/<[^>]*>/g, '').trim();
    desc = desc.substring(0, 150);
  }

  // Ensure description is within SEO limits (160 characters)
  if (desc.length > 160) {
    desc = desc.substring(0, 157) + '...';
  }

  return desc;
};

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
router.post('/posts', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    console.log('Creating new resource post...');
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);

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
      console.log('Missing required fields - title:', !!title, 'content:', !!content);
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Handle image - either uploaded file or URL (optional)
    let image = imageUrl || '';
    if (req.file) {
      const baseUrl = getBaseUrl(req);
      image = `${baseUrl}/uploads/resources/${req.file.filename}`;
      console.log('Resource creation - environment:', process.env.NODE_ENV);
      console.log('Resource creation - base URL:', baseUrl);
      console.log('Resource creation - generated image URL:', image);
    }

    // Image is now optional
    console.log('Final image URL:', image || 'No image provided');

    // Generate unique slug
    let baseSlug = (slug && slug.trim()) || title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
    let uniqueSlug = baseSlug;
    let counter = 1;

    // Check if slug already exists and make it unique
    while (await Resource.findOne({ 'seo.slug': uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Generate proper SEO description using utility function
    const seoDesc = generateSeoDescription(seoDescription, excerpt, content);

    // Prepare resource data
    const resourceData = {
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
        description: seoDesc,
        slug: uniqueSlug
      },
      source: 'manual',
      linkedinUrl: 'https://www.linkedin.com/in/philipodiakose/'
    };

    console.log('Resource data to save:', JSON.stringify(resourceData, null, 2));

    // Create new resource in database
    const newResource = new Resource(resourceData);

    // Check database connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      console.error('Database not connected. Connection state:', mongoose.connection.readyState);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Save to database
    console.log('Attempting to save resource to database...');
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

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      // Duplicate key error (likely slug)
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        error: `A resource with this ${field} already exists. Please use a different ${field}.`,
        field: field
      });
    }

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors
      });
    }

    res.status(500).json({
      error: 'Failed to create resource post',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update resource post
router.put('/posts/:id', authenticateToken, upload.single('image'), async (req, res) => {
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

    // Find the resource in database
    const existingResource = await Resource.findById(id);
    if (!existingResource) {
      return res.status(404).json({ error: 'Resource post not found' });
    }

    // Handle image - either uploaded file or URL
    let image = imageUrl || existingResource.image;
    if (req.file) {
      // Delete old image if it exists and is a local upload
      if (existingResource.image && existingResource.image.includes('/uploads/')) {
        const oldImagePath = path.join(__dirname, '../uploads/resources', path.basename(existingResource.image));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log('Deleted old image:', oldImagePath);
        }
      }
      const baseUrl = getBaseUrl(req);
      image = `${baseUrl}/uploads/resources/${req.file.filename}`;
      console.log('Resource update - environment:', process.env.NODE_ENV);
      console.log('Resource update - base URL:', baseUrl);
      console.log('Resource update - updated image URL:', image);
    }

    // Generate proper SEO description for update using utility function
    const updatedSeoDesc = seoDescription ?
      generateSeoDescription(seoDescription, excerpt, content) :
      existingResource.seo.description;

    // Update the resource
    const updateData = {
      title: (title && title.trim()) || existingResource.title,
      excerpt: (excerpt && excerpt.trim()) || existingResource.excerpt,
      content: (content && content.trim()) || existingResource.content,
      category: category || existingResource.category,
      image: image,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : existingResource.tags,
      author: author || existingResource.author,
      status: status || existingResource.status,
      readTime: readTime ? parseInt(readTime) : existingResource.readTime,
      'seo.title': (seoTitle && seoTitle.trim()) || existingResource.seo.title,
      'seo.description': updatedSeoDesc,
      'seo.slug': (slug && slug.trim()) || existingResource.seo.slug
    };

    const updatedResource = await Resource.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    console.log('Updated resource in database with ID:', updatedResource._id);

    // Format response to match frontend expectations
    const responsePost = {
      id: updatedResource._id.toString(),
      title: updatedResource.title,
      excerpt: updatedResource.excerpt,
      content: updatedResource.content,
      category: updatedResource.category,
      image: updatedResource.image,
      tags: updatedResource.tags,
      author: updatedResource.author,
      date: updatedResource.formattedDate,
      readTime: updatedResource.readTime,
      engagement: updatedResource.engagement,
      status: updatedResource.status,
      linkedinUrl: updatedResource.linkedinUrl,
      publishedAt: updatedResource.publishedAt,
      isManual: true,
      seoTitle: updatedResource.seo.title,
      seoDescription: updatedResource.seo.description,
      slug: updatedResource.seo.slug
    };

    res.json({
      message: 'Resource post updated successfully',
      post: responsePost
    });

  } catch (error) {
    console.error('Error updating resource post:', error);
    res.status(500).json({ error: 'Failed to update resource post' });
  }
});

// Delete resource post
router.delete('/posts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Find the resource in database
    const existingResource = await Resource.findById(id);
    if (!existingResource) {
      return res.status(404).json({ error: 'Resource post not found' });
    }

    // Delete associated image if it exists and is a local upload
    if (existingResource.image && existingResource.image.includes('/uploads/')) {
      const imagePath = path.join(__dirname, '../uploads/resources', path.basename(existingResource.image));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log('Deleted image file:', imagePath);
      }
    }

    // Delete the resource from database
    await Resource.findByIdAndDelete(id);
    console.log('Deleted resource from database with ID:', id);

    res.json({
      message: 'Resource post deleted successfully',
      deletedId: id
    });

  } catch (error) {
    console.error('Error deleting resource post:', error);
    res.status(500).json({ error: 'Failed to delete resource post' });
  }
});

// Get single resource post (by ID or slug)
router.get('/posts/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;

    // Check database first - try by slug, then by ID
    try {
      let dbPost = null;

      // First try to find by slug
      dbPost = await Resource.findOne({ 'seo.slug': identifier, status: 'published' });

      // If not found by slug, try by ID (for backward compatibility)
      if (!dbPost) {
        dbPost = await Resource.findById(identifier);
      }

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
      console.log('Database lookup failed for identifier:', identifier, dbError.message);
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
router.post('/upload-image', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const baseUrl = getBaseUrl(req);
    const imageUrl = `${baseUrl}/uploads/resources/${req.file.filename}`;
    console.log('Upload endpoint - environment:', process.env.NODE_ENV);
    console.log('Upload endpoint - base URL:', baseUrl);
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

// Upload inline image endpoint (for rich text editor)
router.post('/upload-inline-image', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const baseUrl = getBaseUrl(req);
    const imageUrl = `${baseUrl}/uploads/resources/${req.file.filename}`;
    console.log('Inline image upload - environment:', process.env.NODE_ENV);
    console.log('Inline image upload - base URL:', baseUrl);
    console.log('Inline image upload - generated image URL:', imageUrl);

    res.json({
      success: true,
      message: 'Inline image uploaded successfully',
      imageUrl: imageUrl,
      url: imageUrl, // Alternative key for compatibility
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      baseUrl: baseUrl,
      fullPath: `/uploads/resources/${req.file.filename}`
    });
  } catch (error) {
    console.error('Error uploading inline image:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload inline image'
    });
  }
});

// Test endpoint to verify image serving
router.get('/test-image-serving', (req, res) => {
  const fs = require('fs');
  const path = require('path');

  const uploadsDir = path.join(__dirname, '../uploads/resources');
  const baseUrl = getBaseUrl(req);

  try {
    let files = [];
    if (fs.existsSync(uploadsDir)) {
      files = fs.readdirSync(uploadsDir).map(file => ({
        filename: file,
        url: `${baseUrl}/uploads/resources/${file}`,
        path: path.join(uploadsDir, file),
        exists: fs.existsSync(path.join(uploadsDir, file))
      }));
    }

    res.json({
      uploadsDir,
      baseUrl,
      filesCount: files.length,
      files: files.slice(0, 5), // Show first 5 files
      staticServing: {
        endpoint: '/uploads',
        fullPath: `${baseUrl}/uploads/resources/`
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
