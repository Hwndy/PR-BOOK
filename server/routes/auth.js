const express = require('express');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const router = express.Router();

// JWT secret from environment
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';

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

// Admin login endpoint with fallback
router.post('/admin/login', async (req, res) => {
  try {
    console.log('Login attempt received:', {
      origin: req.headers.origin,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString()
    });

    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      console.log('Login failed: Missing credentials');
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Fallback credentials for immediate access
    const FALLBACK_CREDENTIALS = {
      username: 'pr_admin',
      password: 'PRScience2024!@#$Secure'
    };

    // Check fallback credentials first
    if (username === FALLBACK_CREDENTIALS.username && password === FALLBACK_CREDENTIALS.password) {
      const token = generateToken('fallback-admin-id', username, 'super_admin');

      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: 'fallback-admin-id',
          username: username,
          email: 'admin@thescienceofpublicrelations.com',
          role: 'super_admin',
          lastLogin: new Date().toISOString()
        }
      });
    }

    // Try database authentication if available
    try {
      const user = await AdminUser.findByUsernameOrEmail(username);

      if (user) {
        // Check if account is locked
        if (user.isLocked) {
          return res.status(423).json({
            success: false,
            message: 'Account is temporarily locked due to too many failed login attempts. Please try again later.'
          });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);

        if (isPasswordValid) {
          // Reset login attempts on successful login
          await user.resetLoginAttempts();

          // Generate JWT token
          const token = generateToken(user._id, user.username, user.role);

          // Return success response
          return res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
              id: user._id,
              username: user.username,
              email: user.email,
              role: user.role,
              lastLogin: user.lastLogin
            }
          });
        } else {
          // Increment failed login attempts
          await user.incLoginAttempts();
        }
      }
    } catch (dbError) {
      console.log('Database authentication failed, using fallback only:', dbError.message);
    }

    // Invalid credentials
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

// Admin logout endpoint (optional - mainly for logging purposes)
router.post('/admin/logout', (req, res) => {
  // In a stateless JWT system, logout is handled client-side by removing the token
  // This endpoint can be used for logging purposes
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// Verify token endpoint
router.get('/admin/verify', async (req, res) => {
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

    // Handle fallback admin
    if (decoded.userId === 'fallback-admin-id') {
      return res.json({
        success: true,
        user: {
          id: 'fallback-admin-id',
          username: 'pr_admin',
          email: 'admin@thescienceofpublicrelations.com',
          role: 'super_admin',
          lastLogin: new Date().toISOString()
        }
      });
    }

    // Check if user still exists and is active (database users)
    try {
      const user = await AdminUser.findById(decoded.userId);

      if (user && user.isActive) {
        return res.json({
          success: true,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            lastLogin: user.lastLogin
          }
        });
      }
    } catch (dbError) {
      console.log('Database verification failed:', dbError.message);
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid token or user not found'
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Token verification failed'
    });
  }
});

// Change password endpoint
router.post('/admin/change-password', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { currentPassword, newPassword } = req.body;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await AdminUser.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

module.exports = router;
