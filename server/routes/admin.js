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

// Orders endpoints
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const { page = 1, search = '', status = 'all' } = req.query;

    // Mock orders data
    const mockOrders = [
      {
        id: 'ORD-001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        product: 'PR Measurement Guide',
        amount: 29.99,
        status: 'completed',
        paymentMethod: 'Credit Card',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'ORD-002',
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        product: 'Digital PR Strategies',
        amount: 39.99,
        status: 'pending',
        paymentMethod: 'PayPal',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'ORD-003',
        customerName: 'Mike Johnson',
        customerEmail: 'mike@example.com',
        product: 'Analytics Masterclass',
        amount: 49.99,
        status: 'completed',
        paymentMethod: 'Credit Card',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Filter orders based on search and status
    let filteredOrders = mockOrders;

    if (search) {
      filteredOrders = filteredOrders.filter(order =>
        order.customerName.toLowerCase().includes(search.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
        order.id.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }

    // Pagination
    const pageSize = 10;
    const startIndex = (parseInt(page) - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    res.json({
      orders: paginatedOrders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredOrders.length / pageSize),
        totalOrders: filteredOrders.length,
        pageSize
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/orders/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Mock order data
    const mockOrder = {
      id: id,
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      product: 'PR Measurement Guide',
      amount: 29.99,
      status: 'completed',
      paymentMethod: 'Credit Card',
      billingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    };

    res.json(mockOrder);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status
router.put('/orders/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // In a real app, update the order in the database
    res.json({
      message: 'Order updated successfully',
      orderId: id,
      newStatus: status
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Customers endpoints
router.get('/customers', adminAuth, async (req, res) => {
  try {
    const { page = 1, search = '' } = req.query;

    // Mock customers data
    const mockCustomers = [
      {
        id: 'CUST-001',
        name: 'John Doe',
        email: 'john@example.com',
        totalOrders: 3,
        totalSpent: 89.97,
        lastOrderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'CUST-002',
        name: 'Jane Smith',
        email: 'jane@example.com',
        totalOrders: 1,
        totalSpent: 39.99,
        lastOrderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'CUST-003',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        totalOrders: 2,
        totalSpent: 79.98,
        lastOrderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Filter customers based on search
    let filteredCustomers = mockCustomers;

    if (search) {
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase()) ||
        customer.id.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Pagination
    const pageSize = 10;
    const startIndex = (parseInt(page) - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

    res.json({
      customers: paginatedCustomers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredCustomers.length / pageSize),
        totalCustomers: filteredCustomers.length,
        pageSize
      },
      stats: {
        totalCustomers: mockCustomers.length,
        activeCustomers: mockCustomers.filter(c => c.status === 'active').length,
        totalRevenue: mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0),
        averageOrderValue: mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0) / mockCustomers.reduce((sum, c) => sum + c.totalOrders, 0)
      }
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get single customer
router.get('/customers/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Mock customer data
    const mockCustomer = {
      id: id,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      totalOrders: 3,
      totalSpent: 89.97,
      lastOrderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      orders: [
        {
          id: 'ORD-001',
          product: 'PR Measurement Guide',
          amount: 29.99,
          status: 'completed',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'ORD-004',
          product: 'Digital PR Strategies',
          amount: 39.99,
          status: 'completed',
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'ORD-007',
          product: 'Analytics Masterclass',
          amount: 19.99,
          status: 'completed',
          date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    };

    res.json(mockCustomer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

module.exports = router;