const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  excerpt: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['PR Measurement', 'Digital PR', 'Strategy', 'Industry Trends', 'Case Studies', 'Analytics', 'Insights'],
    default: 'Insights'
  },
  image: {
    type: String,
    required: false,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  author: {
    type: String,
    default: 'Philip Odiakose',
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  readTime: {
    type: Number,
    default: 5
  },
  engagement: {
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    }
  },
  seo: {
    title: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 160
    },
    slug: {
      type: String,
      trim: true,
      unique: true
    }
  },
  source: {
    type: String,
    enum: ['manual', 'linkedin'],
    default: 'manual'
  },
  linkedinUrl: {
    type: String,
    trim: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update the updatedAt field
resourceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Generate slug if not provided
  if (!this.seo.slug) {
    this.seo.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Generate SEO title if not provided
  if (!this.seo.title) {
    this.seo.title = this.title;
  }
  
  // Generate SEO description if not provided
  if (!this.seo.description) {
    this.seo.description = this.excerpt.substring(0, 160);
  }
  
  next();
});

// Virtual for formatted date
resourceSchema.virtual('formattedDate').get(function() {
  return this.publishedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for date string (for compatibility)
resourceSchema.virtual('date').get(function() {
  return this.formattedDate;
});

// Static method to get published resources
resourceSchema.statics.getPublished = function() {
  return this.find({ status: 'published' })
    .sort({ publishedAt: -1 });
};

// Static method to get resources by category
resourceSchema.statics.getByCategory = function(category) {
  const query = { status: 'published' };
  if (category && category !== 'All') {
    query.category = category;
  }
  return this.find(query).sort({ publishedAt: -1 });
};

// Instance method to increment engagement
resourceSchema.methods.incrementEngagement = function(type) {
  if (this.engagement[type] !== undefined) {
    this.engagement[type]++;
    return this.save();
  }
  throw new Error('Invalid engagement type');
};

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
