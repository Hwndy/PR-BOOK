const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('Testing database connection...');

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://suleayo04:sulaimon@prscience.6b4bsrh.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
})
.then(async () => {
  console.log('✅ Connected to MongoDB successfully');
  
  try {
    console.log('Testing AdminUser model...');
    const AdminUser = require('./models/AdminUser');
    console.log('✅ AdminUser model loaded successfully');
    
    console.log('Creating default admin user...');
    await AdminUser.createDefaultAdmin();
    console.log('✅ Default admin user created/verified successfully');
    
  } catch (error) {
    console.error('❌ Error with AdminUser:', error.message);
    console.error('Stack:', error.stack);
  }
  
  process.exit(0);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});
