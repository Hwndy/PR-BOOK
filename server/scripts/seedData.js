const mongoose = require('mongoose');
const Order = require('../models/Order');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://suleayo04:sulaimon@prscience.6b4bsrh.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  seedData();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const seedData = async () => {
  try {
    // Clear existing orders
    await Order.deleteMany({});
    console.log('Cleared existing orders');

    // Create sample orders
    const sampleOrders = [
      {
        email: 'john.doe@example.com',
        amount: 1000000, // ₦10,000 in kobo
        reference: 'PRE_ORDER_1234567890_123456',
        productName: 'The Science of Public Relations (Digital Edition)',
        status: 'success',
        paymentDate: new Date('2024-01-15'),
        metadata: {
          customer: {
            country: 'Nigeria'
          }
        }
      },
      {
        email: 'jane.smith@example.com',
        amount: 1000000,
        reference: 'PRE_ORDER_1234567891_123457',
        productName: 'The Science of Public Relations (Digital Edition)',
        status: 'success',
        paymentDate: new Date('2024-01-20'),
        metadata: {
          customer: {
            country: 'Nigeria'
          }
        }
      },
      {
        email: 'mike.johnson@example.com',
        amount: 1000000,
        reference: 'PRE_ORDER_1234567892_123458',
        productName: 'The Science of Public Relations (Digital Edition)',
        status: 'success',
        paymentDate: new Date('2024-02-05'),
        metadata: {
          customer: {
            country: 'Ghana'
          }
        }
      },
      {
        email: 'sarah.wilson@example.com',
        amount: 1000000,
        reference: 'PRE_ORDER_1234567893_123459',
        productName: 'The Science of Public Relations (Digital Edition)',
        status: 'pending',
        paymentDate: new Date('2024-02-10'),
        metadata: {
          customer: {
            country: 'Nigeria'
          }
        }
      },
      {
        email: 'david.brown@example.com',
        amount: 1000000,
        reference: 'PRE_ORDER_1234567894_123460',
        productName: 'The Science of Public Relations (Digital Edition)',
        status: 'failed',
        paymentDate: new Date('2024-02-12'),
        metadata: {
          customer: {
            country: 'Kenya'
          }
        }
      },
      {
        email: 'john.doe@example.com',
        amount: 1000000,
        reference: 'PRE_ORDER_1234567895_123461',
        productName: 'The Science of Public Relations (Digital Edition)',
        status: 'success',
        paymentDate: new Date('2024-02-15'),
        metadata: {
          customer: {
            country: 'Nigeria'
          }
        }
      },
      {
        email: 'lisa.davis@example.com',
        amount: 1000000,
        reference: 'PRE_ORDER_1234567896_123462',
        productName: 'The Science of Public Relations (Digital Edition)',
        status: 'success',
        paymentDate: new Date('2024-02-20'),
        metadata: {
          customer: {
            country: 'South Africa'
          }
        }
      },
      {
        email: 'robert.taylor@example.com',
        amount: 1000000,
        reference: 'PRE_ORDER_1234567897_123463',
        productName: 'The Science of Public Relations (Digital Edition)',
        status: 'success',
        paymentDate: new Date('2024-03-01'),
        metadata: {
          customer: {
            country: 'Nigeria'
          }
        }
      }
    ];

    // Insert sample orders
    await Order.insertMany(sampleOrders);
    console.log(`Created ${sampleOrders.length} sample orders`);

    // Display summary
    const totalOrders = await Order.countDocuments();
    const successfulOrders = await Order.countDocuments({ status: 'success' });
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    console.log('\n--- Database Summary ---');
    console.log(`Total Orders: ${totalOrders}`);
    console.log(`Successful Orders: ${successfulOrders}`);
    console.log(`Total Revenue: ₦${totalRevenue.length > 0 ? (totalRevenue[0].total / 100).toLocaleString() : 0}`);
    console.log('Seed data created successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};
