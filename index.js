const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Paystack secret key (should be in .env file in production)
const PAYSTACK_SECRET_KEY = 'sk_test_080987042c93940525eeac69c843b0ccd59ce742';

// Verify payment endpoint
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { reference } = req.body;
    
    if (!reference) {
      return res.status(400).json({
        status: false,
        message: 'Payment reference is required'
      });
    }
    
    // Call Paystack's verify endpoint
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
        }
      }
    );
    
    const { data } = response.data;
    
    // Check if payment was successful
    if (data.status === 'success') {
      // In a real application, you would:
      // 1. Check that the amount paid matches the expected amount
      // 2. Update your database with the order details
      // 3. Send a confirmation email to the customer
      
      return res.status(200).json({
        status: true,
        message: 'Payment verified successfully',
        data: {
          amount: data.amount / 100, // Convert from kobo to naira
          email: data.customer.email,
          reference: data.reference,
          metadata: data.metadata
        }
      });
    } else {
      return res.status(400).json({
        status: false,
        message: 'Payment verification failed',
        data: null
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    
    return res.status(500).json({
      status: false,
      message: 'An error occurred while verifying payment',
      error: error.response ? error.response.data : error.message
    });
  }
});

// Webhook endpoint for Paystack
app.post('/api/webhook', (req, res) => {
  // Verify that the request is from Paystack
  const hash = req.headers['x-paystack-signature'];
  
  // In a real application, you would:
  // 1. Verify the hash using your secret key
  // 2. Process the event based on the event type
  // 3. Update your database accordingly
  
  // For now, just log the event
  console.log('Webhook received:', req.body);
  
  return res.status(200).send('Webhook received');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
