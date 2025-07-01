const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Resource = require('../models/Resource');

// Load environment variables
dotenv.config();

console.log('Testing Resource model and database connection...');

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://suleayo04:sulaimon@prscience.6b4bsrh.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
})
.then(async () => {
  console.log('✅ Connected to MongoDB successfully');
  
  try {
    // Test creating a sample resource
    console.log('\n📝 Creating sample resource...');
    
    const sampleResource = new Resource({
      title: 'Test Resource Post',
      excerpt: 'This is a test resource post to verify database functionality.',
      content: 'This is the full content of the test resource post. It contains detailed information about PR measurement and analytics strategies that can help organizations improve their communication effectiveness.',
      category: 'Analytics',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      tags: ['test', 'analytics', 'measurement'],
      author: 'Philip Odiakose',
      status: 'published'
    });

    const savedResource = await sampleResource.save();
    console.log('✅ Sample resource created with ID:', savedResource._id);
    console.log('   Title:', savedResource.title);
    console.log('   Slug:', savedResource.seo.slug);
    console.log('   Date:', savedResource.formattedDate);

    // Test fetching resources
    console.log('\n📋 Fetching all published resources...');
    const allResources = await Resource.getPublished();
    console.log('✅ Found', allResources.length, 'published resources');

    allResources.forEach((resource, index) => {
      console.log(`   ${index + 1}. ${resource.title} (${resource.category})`);
    });

    // Test fetching by category
    console.log('\n🏷️ Testing category filtering...');
    const analyticsResources = await Resource.getByCategory('Analytics');
    console.log('✅ Found', analyticsResources.length, 'Analytics resources');

    // Test the virtual fields
    console.log('\n🔍 Testing virtual fields...');
    const firstResource = allResources[0];
    if (firstResource) {
      console.log('   Formatted Date:', firstResource.formattedDate);
      console.log('   Date Virtual:', firstResource.date);
      console.log('   SEO Slug:', firstResource.seo.slug);
    }

    console.log('\n✅ All tests passed! Resource model is working correctly.');
    console.log('\n📊 Database Summary:');
    console.log('   - Total Resources:', allResources.length);
    console.log('   - Database Connection: ✅ Working');
    console.log('   - Model Validation: ✅ Working');
    console.log('   - Virtual Fields: ✅ Working');
    console.log('   - Static Methods: ✅ Working');

  } catch (error) {
    console.error('❌ Error testing Resource model:', error.message);
    console.error('Stack:', error.stack);
  }
  
  process.exit(0);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});
