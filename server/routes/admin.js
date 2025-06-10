const express = require('express');
const router = express.Router();

// Admin authentication middleware
const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Simple token validation (in production, use proper JWT)
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

// Dashboard stats endpoint
router.get('/dashboard-stats', adminAuth, async (req, res) => {
  try {
    // Mock dashboard stats for now
    res.json({
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      conversionRate: 0.0,
      recentOrders: []
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

module.exports = router;