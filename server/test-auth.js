const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = 5001; // Different port to avoid conflicts

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Generate JWT token
const generateToken = (userId, username, role) => {
  return jwt.sign(
    { 
      userId, 
      username, 
      role,
      type: 'admin'
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://www.thescienceofpublicrelations.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Test auth endpoint
app.post('/api/auth/admin/login', (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('Login attempt:', { username, password });

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Check credentials
    if (username === 'pr_admin' && password === 'PRScience2024!@#$Secure') {
      const token = generateToken('test-admin-id', username, 'super_admin');
      
      console.log('Login successful, token generated');
      
      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: 'test-admin-id',
          username: username,
          email: 'admin@thescienceofpublicrelations.com',
          role: 'super_admin',
          lastLogin: new Date().toISOString()
        }
      });
    }

    console.log('Invalid credentials');
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Test verify endpoint
app.get('/api/auth/admin/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    return res.json({
      success: true,
      user: {
        id: 'test-admin-id',
        username: 'pr_admin',
        email: 'admin@thescienceofpublicrelations.com',
        role: 'super_admin',
        lastLogin: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Test auth server is running' });
});

app.listen(PORT, () => {
  console.log(`Test auth server running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('- POST /api/auth/admin/login');
  console.log('- GET /api/auth/admin/verify');
  console.log('- GET /health');
  console.log('');
  console.log('Test credentials:');
  console.log('Username: pr_admin');
  console.log('Password: PRScience2024!@#$Secure');
});
