const express = require('express');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// In-memory storage for active reading sessions (use Redis in production)
const activeSessions = new Map();
const readingTokens = new Map();

// Configuration
const EBOOK_PATH = path.join(__dirname, '../../private/E-book.pdf');
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const SESSION_EXPIRY = 2 * 60 * 60 * 1000; // 2 hours
const MAX_CONCURRENT_SESSIONS = 1; // Only 1 active session per purchase

// Generate secure reading token
const generateReadingToken = (email, orderReference) => {
  const tokenData = {
    email,
    orderReference,
    createdAt: Date.now(),
    expiresAt: Date.now() + TOKEN_EXPIRY,
    sessionId: crypto.randomUUID(),
    deviceFingerprint: null
  };
  
  const token = crypto.randomBytes(32).toString('hex');
  readingTokens.set(token, tokenData);
  
  return token;
};

// Validate reading token
const validateReadingToken = (token, deviceFingerprint, userAgent, ip) => {
  const tokenData = readingTokens.get(token);
  
  if (!tokenData) {
    return { valid: false, reason: 'Invalid token' };
  }
  
  if (Date.now() > tokenData.expiresAt) {
    readingTokens.delete(token);
    return { valid: false, reason: 'Token expired' };
  }
  
  // Check if this is the first access (set device fingerprint)
  if (!tokenData.deviceFingerprint) {
    tokenData.deviceFingerprint = deviceFingerprint;
    tokenData.userAgent = userAgent;
    tokenData.ip = ip;
  } else {
    // Validate device fingerprint for anti-sharing
    if (tokenData.deviceFingerprint !== deviceFingerprint) {
      return { valid: false, reason: 'Device mismatch - link sharing detected' };
    }
  }
  
  // Check for concurrent sessions
  const existingSessions = Array.from(activeSessions.values())
    .filter(session => session.email === tokenData.email && session.orderReference === tokenData.orderReference);
  
  if (existingSessions.length >= MAX_CONCURRENT_SESSIONS) {
    const activeSession = existingSessions[0];
    if (activeSession.sessionId !== tokenData.sessionId) {
      return { valid: false, reason: 'Maximum concurrent sessions reached' };
    }
  }
  
  return { valid: true, tokenData };
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
    
    if (!email || !orderReference) {
      return res.status(400).json({ error: 'Email and order reference required' });
    }
    
    // Verify this is for an e-book order (you might want to check your database)
    if (!productName || !productName.toLowerCase().includes('digital') && !productName.toLowerCase().includes('e-book')) {
      return res.status(400).json({ error: 'This order is not for a digital product' });
    }
    
    // Generate secure token
    const token = generateReadingToken(email, orderReference);
    
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
    
    const validation = validateReadingToken(token, deviceFingerprint, userAgent, ip);
    
    if (!validation.valid) {
      return res.status(403).json({ 
        error: validation.reason,
        code: validation.reason.includes('sharing') ? 'SHARING_DETECTED' : 
              validation.reason.includes('concurrent') ? 'CONCURRENT_SESSION' :
              validation.reason.includes('expired') ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN'
      });
    }
    
    // Create or update session
    const sessionId = validation.tokenData.sessionId;
    activeSessions.set(sessionId, {
      ...validation.tokenData,
      lastAccess: Date.now(),
      deviceFingerprint,
      userAgent,
      ip
    });
    
    // Clean up expired sessions
    setTimeout(() => {
      activeSessions.delete(sessionId);
    }, SESSION_EXPIRY);
    
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
    
    const validation = validateReadingToken(token, deviceFingerprint, userAgent, ip);
    
    if (!validation.valid) {
      return res.status(403).json({ error: validation.reason });
    }
    
    // Check if file exists
    if (!fs.existsSync(EBOOK_PATH)) {
      return res.status(404).json({ error: 'E-book not found' });
    }
    
    // Update session activity
    const sessionId = validation.tokenData.sessionId;
    if (activeSessions.has(sessionId)) {
      activeSessions.get(sessionId).lastAccess = Date.now();
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
    
    const validation = validateReadingToken(token, deviceFingerprint);
    
    if (!validation.valid) {
      return res.status(403).json({ error: validation.reason });
    }
    
    // Update session
    const sessionId = validation.tokenData.sessionId;
    if (activeSessions.has(sessionId)) {
      activeSessions.get(sessionId).lastAccess = Date.now();
      res.json({ success: true });
    } else {
      res.status(403).json({ error: 'Session not found' });
    }
    
  } catch (error) {
    console.error('Error in heartbeat:', error);
    res.status(500).json({ error: 'Heartbeat failed' });
  }
});

// Get reading statistics (for admin)
router.get('/stats', (req, res) => {
  try {
    const now = Date.now();
    const activeSessionsCount = Array.from(activeSessions.values())
      .filter(session => (now - session.lastAccess) < SESSION_EXPIRY).length;
    
    const totalTokens = readingTokens.size;
    const expiredTokens = Array.from(readingTokens.values())
      .filter(token => now > token.expiresAt).length;
    
    res.json({
      activeSessions: activeSessionsCount,
      totalTokens,
      expiredTokens,
      validTokens: totalTokens - expiredTokens
    });
    
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// Cleanup expired tokens (run periodically)
setInterval(() => {
  const now = Date.now();
  
  // Clean expired tokens
  for (const [token, tokenData] of readingTokens.entries()) {
    if (now > tokenData.expiresAt) {
      readingTokens.delete(token);
    }
  }
  
  // Clean expired sessions
  for (const [sessionId, session] of activeSessions.entries()) {
    if ((now - session.lastAccess) > SESSION_EXPIRY) {
      activeSessions.delete(sessionId);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes

module.exports = router;
