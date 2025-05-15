const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const https = require('https');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://thescienceofpublicrelations.vercel.app'],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Order Schema
const orderSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  amount: {
    type: Number,
    required: true
  },
  reference: {
    type: String,
    required: true,
    unique: true
  },
  productName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: Object
  }
});

// Create Order model
const Order = mongoose.model('Order', orderSchema);

// Configure email transporter
let transporter;
try {
  // Only create transporter if email credentials are provided
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    console.log('Email transporter configured successfully');
  } else {
    console.log('Email credentials not provided, email functionality disabled');
  }
} catch (error) {
  console.error('Error configuring email transporter:', error);
}

// Function to send confirmation email
const sendConfirmationEmail = async (order) => {
  try {
    // If transporter is not configured, log a message and return
    if (!transporter) {
      console.log('Email transporter not configured. Skipping confirmation email for order:', order.reference);
      return true;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"The Science of PR" <noreply@thescienceofpr.com>',
      to: order.email,
      subject: 'Your Pre-order Confirmation - The Science of Public Relations',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1e3a8a; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Thank You for Your Pre-order!</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
            <p>Dear Customer,</p>
            <p>Thank you for pre-ordering "The Science of Public Relations". Your payment has been successfully processed.</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Order Details:</h3>
              <p><strong>Product:</strong> ${order.productName}</p>
              <p><strong>Amount:</strong> ₦${(order.amount / 100).toLocaleString()}</p>
              <p><strong>Reference:</strong> ${order.reference}</p>
              <p><strong>Date:</strong> ${new Date(order.paymentDate).toLocaleString()}</p>
            </div>
            <p>We will notify you when the book is available for download or shipping. In the meantime, you'll receive a confirmation mail shortly.</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>The Science of PR Team</p>
          </div>
          <div style="background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 12px; color: #6b7280;">
            <p>© ${new Date().getFullYear()} The Science of Public Relations. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Initialize payment endpoint
app.post('/api/initialize-payment', async (req, res) => {
  try {
    const { email, amount, productName } = req.body;
    
    const params = JSON.stringify({
      email,
      amount: parseFloat(amount) * 100,
      callback_url: 'https://thescienceofpublicrelations.vercel.app/payment/verify',
      metadata: {
        product_name: productName
      }
    });

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: '/transaction/initialize',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const paystackReq = https.request(options, (paystackRes) => {
      let data = '';

      paystackRes.on('data', (chunk) => {
        data += chunk;
      });

      paystackRes.on('end', () => {
        console.log('Paystack response:', data);
        res.status(200).json(JSON.parse(data));
      });
    });

    paystackReq.on('error', (error) => {
      console.error('Paystack API Error:', error);
      res.status(500).json({ error: 'Payment initialization failed' });
    });

    paystackReq.write(params);
    paystackReq.end();
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
