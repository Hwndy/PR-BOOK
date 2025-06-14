const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const adminRoutes = require('./routes/admin');
const podcastRoutes = require('./routes/podcast');
const blogRoutes = require('./routes/blog');
const ebookRoutes = require('./routes/ebook');

// Load environment variables
dotenv.config();

const PRODUCT_PRICES = {
  'The Science of Public Relations (E-Book)': 1000000, // 10,000 NGN in Kobo
  'The Science of Public Relations (Paperback)': 1500000, // 15,000 NGN in Kobo
  // Fallback or default product name from frontend if it's slightly different
  'The Science of Public Relations (Digital Edition)': 1000000, // Alias for E-Book
};

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/podcast', podcastRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/ebook', ebookRoutes);

// Paystack secret key from environment variables
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

if (!PAYSTACK_SECRET_KEY) {
  console.error('FATAL ERROR: Paystack secret key is not defined in environment variables (PAYSTACK_SECRET_KEY). Paystack functionality will be disabled or fail.');
  // Consider process.exit(1) in a production setup if this key is absolutely essential at startup.
}

// Connect to MongoDB
// let isMongoConnected = false; // Flag removed

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://suleayo04:sulaimon@prscience.6b4bsrh.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
})
.then(() => {
  console.log('Initial Mongoose connection successful.');
  // isMongoConnected = true; // Flag assignment removed
})
.catch(err => {
  console.error('Initial MongoDB connection failed. Subsequent database operations may also fail until connection is re-established.', err);
  // console.log('Running in memory-only mode. Orders will not be persisted.'); // Log message changed
});

// Mongoose connection event listeners
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from DB');
});

mongoose.connection.on('reconnected', () => {
  console.log('Mongoose reconnected to DB');
});

// Optional: Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection closed due to app termination');
  process.exit(0);
});

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

// Function to generate reading URL for e-books
const generateReadingURL = async (order) => {
  try {
    if (!order.productName || (!order.productName.toLowerCase().includes('digital') && !order.productName.toLowerCase().includes('e-book'))) {
      return null; // Not an e-book order
    }

    const axios = require('axios');
    const response = await axios.post('http://localhost:5000/api/ebook/generate-reading-url', {
      email: order.email,
      orderReference: order.reference,
      productName: order.productName
    });

    return response.data.readingUrl;
  } catch (error) {
    console.error('Error generating reading URL:', error);
    return null;
  }
};

// Function to send confirmation email
const sendConfirmationEmail = async (order) => {
  try {
    // If transporter is not configured, log a message and return
    if (!transporter) {
      console.log('Email transporter not configured. Skipping confirmation email for order:', order.reference);
      return true;
    }

    // Generate reading URL for e-books
    const readingUrl = await generateReadingURL(order);

    // Create email content based on product type
    const isEbook = readingUrl !== null;

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"The Science of PR" <noreply@thescienceofpr.com>',
      to: order.email,
      subject: isEbook ? 'Your E-book is Ready to Read! - The Science of Public Relations' : 'Your Order Confirmation - The Science of Public Relations',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1e3a8a; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">${isEbook ? 'Your E-book is Ready!' : 'Thank You for Your Order!'}</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
            <p>Dear Customer,</p>
            <p>Thank you for purchasing "The Science of Public Relations". Your payment has been successfully processed.</p>

            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Order Details:</h3>
              <p><strong>Product:</strong> ${order.productName}</p>
              <p><strong>Amount:</strong> ₦${(order.amount / 100).toLocaleString()}</p>
              <p><strong>Reference:</strong> ${order.reference}</p>
              <p><strong>Date:</strong> ${new Date(order.paymentDate).toLocaleString()}</p>
            </div>

            ${isEbook ? `
              <div style="background-color: #dbeafe; border: 2px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e40af; margin-top: 0;">🔒 Secure Reading Access</h3>
                <p style="margin-bottom: 15px;">Your e-book is ready to read online! Click the button below to start reading:</p>
                <div style="text-align: center; margin: 20px 0;">
                  <a href="${readingUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                    📖 Read Your E-book Now
                  </a>
                </div>
                <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 12px; border-radius: 4px; margin-top: 15px;">
                  <h4 style="color: #92400e; margin: 0 0 8px 0; font-size: 14px;">🛡️ Important Security Information:</h4>
                  <ul style="color: #92400e; font-size: 13px; margin: 0; padding-left: 20px;">
                    <li>This reading link is personal and expires in 24 hours</li>
                    <li>Do not share this link - it will stop working if accessed from multiple devices</li>
                    <li>Only one active reading session is allowed at a time</li>
                    <li>The book cannot be downloaded or copied for security</li>
                  </ul>
                </div>
              </div>
            ` : `
              <p>We will notify you when the book is available for download or shipping. In the meantime, you'll receive updates on your order status.</p>
            `}

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
    const { email, amount, productName } = req.body; // 'amount' from client is now clientAttemptedAmount

    if (!email || !productName) { // Amount from client is no longer strictly required here for price determination
      return res.status(400).json({
        status: false,
        message: 'Email and product name are required'
      });
    }

    const serverSidePriceKobo = PRODUCT_PRICES[productName];

    if (serverSidePriceKobo === undefined) {
      console.error(`Invalid product name received: ${productName}`);
      return res.status(400).json({
        status: false,
        message: 'Invalid product selected. Please check the product name.'
      });
    }

    // Generate a reference
    const reference = `PRE_ORDER_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
    // const amountInKobo = parseInt(amount) * 100; // Convert to kobo - THIS IS NOW SERVER_SIDE_PRICE_KOBO

    // Initialize transaction with Paystack to get access code
    let accessCode = null;
    let paystackReference = reference;

    try {
      // Call Paystack API to initialize transaction and get access code
      const paystackResponse = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email,
          amount: serverSidePriceKobo, // USE SERVER-SIDE PRICE
          reference,
          callback_url: `${req.protocol}://${req.get('host')}/payment-success`,
          metadata: {
            product_name: productName,
            is_order: true
          }
        },
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (paystackResponse.data.status) {
        accessCode = paystackResponse.data.data.access_code;
        paystackReference = paystackResponse.data.data.reference;
        console.log('Paystack transaction initialized successfully. Access code:', accessCode);
      } else {
        console.error('Paystack initialization failed:', paystackResponse.data);
        throw new Error('Failed to initialize Paystack transaction');
      }
    } catch (paystackError) {
      console.error('Error initializing Paystack transaction:', paystackError.response?.data || paystackError.message);
      // Continue with local reference if Paystack initialization fails
      // We'll handle the payment popup on the client side
    }

    // Attempt to save the order, regardless of a manual flag.
    // Mongoose will handle queuing or erroring if disconnected.
    try {
      // Create a new order in the database
      const order = new Order({
        email,
        amount: serverSidePriceKobo, // USE SERVER-SIDE PRICE
        reference: paystackReference, // Use Paystack reference if available
        productName,
        status: 'pending',
        metadata: {
          access_code: accessCode,
          original_reference: reference,
          client_attempted_amount: parseInt(amount) * 100 // Optionally store client-sent amount
        }
      });

      await order.save();
      console.log('Order saved to database:', paystackReference);
    } catch (dbError) {
      console.error('Error saving order to database during initialization:', dbError);
      // Continue with the payment process even if saving to DB fails here.
      // Paystack is already initialized; webhook or verify can reconcile later if DB is back.
    }
    // Removed 'else { console.log("MongoDB not connected...") }' block

    return res.status(200).json({
      status: true,
      message: 'Payment initialized successfully',
      data: {
        reference: paystackReference,
        amount: serverSidePriceKobo, // USE SERVER-SIDE PRICE
        email,
        access_code: accessCode
      }
    });
  } catch (error) {
    console.error('Error initializing payment:', error);
    return res.status(500).json({
      status: false,
      message: 'An error occurred while initializing payment',
      error: error.message
    });
  }
});

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

    let order = null;

    // Attempt to find the order, Mongoose handles connection state.
    try {
      // Find the order in the database
      order = await Order.findOne({ reference });
    } catch (dbError) {
      console.error('Error finding order in database during verification:', dbError);
      // If DB is down, Paystack verification proceeds, but order update fails.
      // Webhook might reconcile later if DB recovers.
    }
    // Removed 'else { console.log("MongoDB not connected...") }' block for finding order

    // Call Paystack's verify endpoint
    let response;
    try {
      response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
          }
        }
      );
    } catch (verifyError) {
      console.error('Error verifying transaction with reference:', verifyError.response?.data || verifyError.message);

      // If the order exists and has an access_code in metadata, try verifying with that
      if (order && order.metadata && order.metadata.access_code) {
        try {
          console.log('Trying to verify with access code:', order.metadata.access_code);
          response = await axios.get(
            `https://api.paystack.co/transaction/verify_access_code/${order.metadata.access_code}`,
            {
              headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
              }
            }
          );
        } catch (accessCodeError) {
          console.error('Error verifying with access code:', accessCodeError.response?.data || accessCodeError.message);
          throw new Error('Failed to verify payment with both reference and access code');
        }
      } else {
        throw verifyError;
      }
    }

    const { data } = response.data;

    // Check if payment was successful
    if (data.status === 'success') {
      // Attempt to update or create the order in DB.
      try {
        // If order doesn't exist, create it
        if (!order) {
          console.log(`Order with reference ${reference} not found during verify, creating new one.`);
          order = new Order({
            email: data.customer.email,
            amount: data.amount, // This is Paystack's amount
            reference,
            productName: data.metadata?.product_name || 'The Science of Public Relations',
            status: 'pending' // Will be updated to success
          });
        }

        // Update order details from Paystack response
        order.email = data.customer.email;
        order.amount = data.amount;
        order.status = 'success';
        order.metadata = data;

        // If productName is in metadata, use it
        if (data.metadata && data.metadata.product_name) {
          order.productName = data.metadata.product_name;
        }

        await order.save();
        console.log('Order updated in database to success:', reference);
      } catch (dbError) {
        console.error('Error updating order in database during verification success:', dbError);
        // Email will still be sent below. DB inconsistency might occur if this fails.
      }
      // Removed 'else { console.log("MongoDB not connected...") }' block

      // Send confirmation email
      await sendConfirmationEmail(order || {
        email: data.customer.email,
        amount: data.amount,
        reference: data.reference,
        productName: data.metadata?.product_name || 'The Science of Public Relations',
        status: 'success',
        paymentDate: new Date()
      });

      return res.status(200).json({
        status: true,
        message: 'Payment verified successfully',
        data: {
          amount: data.amount / 100, // Convert from kobo to naira
          email: data.customer.email,
          reference: data.reference,
          status: 'success'
        }
      });
    } else {
      // Payment failed according to Paystack. Attempt to update DB.
      if (order) { // Only if order was found initially
        try {
          order.status = 'failed';
          order.metadata = data; // Store Paystack failure data
          await order.save();
          console.log('Order status updated to failed in database:', reference);
        } catch (dbError) {
          console.error('Error updating order status to failed in database:', dbError);
        }
      } else {
         console.log(`Order with reference ${reference} not found during verify (payment failed state). No DB update for failure.`);
      }
      // Removed 'else { console.log("MongoDB not connected...") }' block

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
app.post('/api/webhook', async (req, res) => {
  try {
    // Verify that the request is from Paystack
    const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(401).send('Invalid signature');
    }

    const event = req.body;

    // Attempt to process DB operations. Mongoose handles connection state.
    switch(event.event) {
      case 'charge.success':
        try {
          const reference = event.data.reference;
          let order = await Order.findOne({ reference });

          if (!order) {
            console.log(`Order with reference ${reference} not found via webhook, creating new one.`);
            order = new Order({
              email: event.data.customer.email,
              amount: event.data.amount, // Amount from Paystack
              reference,
              productName: event.data.metadata?.product_name || 'The Science of Public Relations',
              status: 'pending' // Will be updated to success
            });
          }

          order.status = 'success';
          order.metadata = event.data; // Store full Paystack event data
          await order.save();
          console.log('Order updated to success via webhook:', reference);

          await sendConfirmationEmail(order);
        } catch (dbError) {
          console.error('Error processing charge.success webhook for DB:', dbError);
          // Attempt to send email even if DB save failed, using data from webhook
          const tempOrderData = {
            email: event.data.customer.email,
            amount: event.data.amount,
            reference: event.data.reference,
            productName: event.data.metadata?.product_name || 'The Science of Public Relations',
            status: 'success',
            paymentDate: new Date(event.data.paid_at || Date.now())
          };
          await sendConfirmationEmail(tempOrderData);
        }
        break;

      case 'charge.failed':
        try {
          const reference = event.data.reference;
          let order = await Order.findOne({ reference });

          if (!order) {
            console.log(`Order with reference ${reference} not found via webhook (charge.failed), creating new one if desired for tracking.`);
            // Optionally create a new order for failed attempts for audit, or skip.
            // For now, let's assume we only update if it was previously 'pending'.
            // If you want to create, uncomment below:
            /*
            order = new Order({
              email: event.data.customer.email,
              amount: event.data.amount,
              reference,
              productName: event.data.metadata?.product_name || 'The Science of Public Relations',
              status: 'pending' // Will be updated to failed
            });
            */
          }

          if (order) { // Only update if order exists
            order.status = 'failed';
            order.metadata = event.data; // Store Paystack failure event data
            await order.save();
            console.log('Order marked as failed via webhook:', reference);
          } else {
            console.log('No existing order to mark as failed via webhook for reference:', reference);
          }
        } catch (dbError) {
          console.error('Error processing charge.failed webhook for DB:', dbError);
        }
        break;
      default:
        console.log(`Received unhandled Paystack event: ${event.event}`);
    }
    // Removed 'else { console.log("MongoDB not connected...") }' block
    // Logic for sending email even if DB is not connected for charge.success is now part of the catch block above.

    // This specific check and log for sending email despite DB connection status during webhook
    // is now better handled within the try/catch of the 'charge.success' case.
    // If mongoose.connection.readyState !== 1, the .save() would fail and fall into catch.
    if (event.event === 'charge.success' && mongoose.connection.readyState !== 1) {
        console.warn(`Attempting to send email for ${event.data.reference} as DB was not connected during webhook processing (handled in catch).`);
        const orderData = {
          email: event.data.customer.email,
          amount: event.data.amount,
          reference: event.data.reference,
          productName: event.data.metadata?.product_name || 'The Science of Public Relations',
          status: 'success',
          paymentDate: new Date()
        };

        await sendConfirmationEmail(orderData);
      }
    }

    return res.status(200).send('Webhook received');
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).send('Error processing webhook');
  }
});

// Get order status endpoint
app.get('/api/order/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    const { reference } = req.params;

    // The isMongoConnected check is removed. Mongoose handles connection internally.
    // If not connected, .findOne() will likely error out or be queued based on Mongoose config.
    try {
      console.log(`Fetching order details for reference: ${reference}`);
      let order = await Order.findOne({ reference: reference });

      if (!order) {
        console.log(`Order not found by direct reference. Trying metadata.original_reference for: ${reference}`);
        order = await Order.findOne({ 'metadata.original_reference': reference });
      }

      // Further trxref logic can be added here if necessary, but ensure it's robust.

      if (order) {
        return res.status(200).json({
          status: true,
          message: 'Order details retrieved successfully',
          data: {
            email: order.email,
            amount: order.amount,
            reference: order.reference,
            productName: order.productName,
            status: order.status,
            paymentDate: order.paymentDate
          }
        });
      } else {
        console.log(`Order not found for reference: ${reference} after all checks.`);
        return res.status(404).json({
          status: false,
          message: 'Order not found'
        });
      }
    } catch (dbError) {
      console.error(`Database error while fetching order for reference ${reference}:`, dbError);
      // Check if the error is due to Mongoose being disconnected
      if (mongoose.connection.readyState !== 1 && mongoose.connection.readyState !== 2) { // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
         return res.status(503).json({ // Service Unavailable
           status: false,
           message: 'Database service currently unavailable. Please try again later.',
           error: 'Database disconnected' // Provide a more specific error code/message if desired
         });
      }
      return res.status(500).json({
        status: false,
        message: 'An error occurred while retrieving order details.',
        error: dbError.message
      });
    }
  } catch (error) {
    console.error('Unexpected error in /api/order/:reference endpoint:', error);
    return res.status(500).json({
      status: false,
      message: 'An unexpected server error occurred.',
      error: error.message
    });
  }
});

// Payment success callback handler
app.get('/payment-success', (req, res) => {
  // Get the reference, trxref, and amount from the query parameters
  const { reference, trxref, amount, email, productName } = req.query; // Added email and productName

  console.log('Payment callback received:', { reference, trxref, amount, email, productName });

  // Redirect to the client-side payment success page with all parameters
  const redirectUrl = new URL('https://thescienceofpublicrelations.vercel.app/payment-success');

  // Prioritize Paystack's reference if available, then our trxref
  const finalReference = reference || trxref;
  if (finalReference) {
    redirectUrl.searchParams.append('reference', finalReference);
  }

  // Include other parameters if they exist
  if (amount) redirectUrl.searchParams.append('amount', amount);
  if (email) redirectUrl.searchParams.append('email', email); // Pass email
  if (productName) redirectUrl.searchParams.append('productName', productName); // Pass productName


  res.redirect(redirectUrl.toString());
});

// E-book reading route handler
app.get('/read-book/:token', (req, res) => {
  // Redirect to the frontend e-book reader
  const redirectUrl = `https://thescienceofpublicrelations.vercel.app/read-book/${req.params.token}`;
  res.redirect(redirectUrl);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
