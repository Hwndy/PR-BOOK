const express = require('express');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const EbookToken = require('../models/EbookToken'); // Import Mongoose model

// Configuration
const EBOOK_PATH = path.join(__dirname, '../../private/E-book.pdf'); // Consider making this configurable
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const SESSION_EXPIRY = 2 * 60 * 60 * 1000; // 2 hours - for determining 'active' stats
const MAX_CONCURRENT_SESSIONS = 1; // Only 1 active session per purchase (primarily enforced by device fingerprint)

// Generate secure reading token (now async)
const generateReadingToken = async (email, orderReference, productName) => {
  const tokenString = crypto.randomBytes(32).toString('hex');
  const sessionId = crypto.randomUUID(); // Unique session identifier

  const newTokenDoc = new EbookToken({
    token: tokenString,
    email,
    orderReference,
    productName, // Store productName
    sessionId,
    expiresAt: new Date(Date.now() + TOKEN_EXPIRY),
    // deviceFingerprint, userAgent, ip will be set on first access
  });
  
  await newTokenDoc.save();
  return tokenString;
};

// Validate reading token (now async)
const validateReadingToken = async (token, deviceFingerprint, userAgent, ip) => {
  const tokenData = await EbookToken.findOne({ token: token });
  
  if (!tokenData) {
    return { valid: false, reason: 'Invalid token' };
  }
  
  if (Date.now() > tokenData.expiresAt.getTime()) {
    // TTL index in MongoDB should handle deletion, but good to check
    // await EbookToken.deleteOne({ token: token }); // Optionally explicitly delete
    return { valid: false, reason: 'Token expired' };
  }
  
  // Check if this is the first access (set device fingerprint)
  if (!tokenData.deviceFingerprint) {
    tokenData.deviceFingerprint = deviceFingerprint;
    tokenData.userAgent = userAgent;
    tokenData.ip = ip;
    // lastAccess is already set to Date.now() by default or by heartbeat/content access
    await tokenData.save();
  } else {
    // Validate device fingerprint for anti-sharing
    if (tokenData.deviceFingerprint !== deviceFingerprint) {
      return { valid: false, reason: 'Device mismatch - link sharing detected' };
    }
  }
  
  // Concurrent session check with MAX_CONCURRENT_SESSIONS = 1 is largely handled by
  // the deviceFingerprint lock-in. If a token is tied to one device, it can't be
  // concurrently used on another. If the meaning of "concurrent session" is broader
  // (e.g., same user, same order, different token for a re-purchase), that logic would be different.
  // For now, the device lock is the primary mechanism for this constraint.
  
  return { valid: true, tokenData }; // tokenData is a Mongoose document
};

// Create device fingerprint from request
const createDeviceFingerprint = (req) => {
  const components = [
    req.headers['user-agent'] || '',
    req.headers['accept-language'] || '',
    req.headers['accept-encoding'] || '',
    req.ip || req.connection.remoteAddress || '',
    req.headers['x-forwarded-for'] || ''
  ];
  
  return crypto.createHash('sha256').update(components.join('|')).digest('hex');
};

// Generate reading URL for order
router.post('/generate-reading-url', async (req, res) => {
  try {
    const { email, orderReference, productName } = req.body;
    
    if (!email || !orderReference || !productName) { // Added productName as required
      return res.status(400).json({ error: 'Email, order reference, and product name required' });
    }
    
    // Verify this is for an e-book order (productName check is good)
    if (!productName.toLowerCase().includes('digital') && !productName.toLowerCase().includes('e-book')) {
      return res.status(400).json({ error: 'This order is not for a an e-book product' });
    }
    
    // Generate secure token (now async)
    const token = await generateReadingToken(email, orderReference, productName);
    
    // Create reading URL
    const readingUrl = `${req.protocol}://${req.get('host')}/read-book/${token}`;
    
    res.json({
      success: true,
      readingUrl,
      expiresIn: '24 hours',
      instructions: 'This link is personal and expires in 24 hours. Do not share this link as it will stop working if accessed from multiple devices.'
    });
    
  } catch (error) {
    console.error('Error generating reading URL:', error);
    res.status(500).json({ error: 'Failed to generate reading URL' });
  }
});

// Validate reading access
router.get('/validate-access/:token', (req, res) => {
  try {
    const { token } = req.params;
    const deviceFingerprint = createDeviceFingerprint(req);
    const userAgent = req.headers['user-agent'];
    const ip = req.ip || req.connection.remoteAddress;
    
    const validation = await validateReadingToken(token, deviceFingerprint, userAgent, ip);
    
    if (!validation.valid) {
      return res.status(403).json({ 
        error: validation.reason,
        code: validation.reason.includes('sharing') ? 'SHARING_DETECTED' : 
              validation.reason.includes('concurrent') ? 'CONCURRENT_SESSION' :
              validation.reason.includes('expired') ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN'
      });
    }
    
    // Create or update session activity (by updating lastAccess on the token document)
    if (validation.valid && validation.tokenData) {
      validation.tokenData.lastAccess = new Date();
      await validation.tokenData.save();
    }
    // The old activeSessions map and its setTimeout cleanup are no longer needed.
    
    res.json({ 
      success: true, 
      sessionId,
      email: validation.tokenData.email,
      expiresAt: validation.tokenData.expiresAt
    });
    
  } catch (error) {
    console.error('Error validating access:', error);
    res.status(500).json({ error: 'Failed to validate access' });
  }
});

// Serve PDF content (protected)
router.get('/content/:token', (req, res) => {
  try {
    const { token } = req.params;
    const deviceFingerprint = createDeviceFingerprint(req);
    const userAgent = req.headers['user-agent'];
    const ip = req.ip || req.connection.remoteAddress;
    
    const validation = await validateReadingToken(token, deviceFingerprint, userAgent, ip);
    
    if (!validation.valid) {
      return res.status(403).json({ error: validation.reason });
    }
    
    // Check if file exists
    if (!fs.existsSync(EBOOK_PATH)) {
      return res.status(404).json({ error: 'E-book not found' });
    }
    
    // Update session activity by saving the token data (which now includes lastAccess)
    if (validation.valid && validation.tokenData) {
      validation.tokenData.lastAccess = new Date();
      await validation.tokenData.save();
    }
    
    // Set security headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="The-Science-of-Public-Relations.pdf"');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    
    // Stream the PDF
    const fileStream = fs.createReadStream(EBOOK_PATH);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Error serving PDF content:', error);
    res.status(500).json({ error: 'Failed to serve content' });
  }
});

// Heartbeat endpoint to maintain session
router.post('/heartbeat/:token', (req, res) => {
  try {
    const { token } = req.params;
    const deviceFingerprint = createDeviceFingerprint(req);
    // User agent and IP are not strictly needed for heartbeat validation if device fingerprint is primary key
    const validation = await validateReadingToken(token, deviceFingerprint, req.headers['user-agent'], req.ip);
    
    if (!validation.valid) {
      return res.status(403).json({ error: validation.reason });
    }
    
    // Update session by saving token data
    if (validation.valid && validation.tokenData) {
      validation.tokenData.lastAccess = new Date();
      await validation.tokenData.save();
      res.json({ success: true });
    } else if (!validation.valid) {
      // If validation failed, send the reason
      return res.status(403).json({ error: validation.reason });
    } else {
      // Fallback for unexpected cases where tokenData might be missing though validation.valid was true
      res.status(403).json({ error: 'Session not found or token invalid' });
    }
    
  } catch (error) {
    console.error('Error in heartbeat:', error);
    res.status(500).json({ error: 'Heartbeat failed' });
  }
});

// Get reading statistics (for admin)
router.get('/stats', (req, res) => {
  try {
    const totalTokens = await EbookToken.countDocuments();
    // Expired tokens are automatically removed by MongoDB's TTL index on 'expiresAt'
    // So, totalTokens should reflect non-expired tokens if TTL is working effectively.
    // If an explicit count of "logically expired but not yet TTL-deleted" is needed:
    // const expiredTokensCount = await EbookToken.countDocuments({ expiresAt: { $lt: new Date() } });

    const activeThreshold = new Date(Date.now() - SESSION_EXPIRY);
    const activeSessionsCount = await EbookToken.countDocuments({
      expiresAt: { $gt: new Date() }, // Token must not be expired
      lastAccess: { $gt: activeThreshold } // And was accessed recently
    });
    
    res.json({
      activeSessions: activeSessionsCount,
      totalActiveTokens: totalTokens, // This now represents all tokens in DB (ideally non-expired)
      // validTokens: totalTokens - expiredTokensCount (if calculated above)
    });
    
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// The setInterval for cleanup is no longer needed due to MongoDB TTL index.

module.exports = router;
