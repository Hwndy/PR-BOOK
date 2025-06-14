const mongoose = require('mongoose');

const EbookTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true
  },
  orderReference: {
    type: String,
    required: true
  },
  productName: { // Added for context
    type: String
  },
  sessionId: { // For tracking active session, could be same as token if 1 session per token
    type: String,
    required: true,
    unique: true
  },
  deviceFingerprint: {
    type: String,
    default: null
  },
  userAgent: { // Store user agent
    type: String,
    default: null
  },
  ip: { // Store IP
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: { // For token expiry
    type: Date,
    required: true
  },
  lastAccess: { // For session expiry & heartbeat
    type: Date,
    default: Date.now
  }
});

// TTL Index for automatic cleanup of expired tokens by MongoDB
EbookTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('EbookToken', EbookTokenSchema);
