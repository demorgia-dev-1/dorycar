const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const sanitize = require('express-mongo-sanitize');

const securityMiddleware = {
  rateLimiter: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  }),
  
  sanitizeData: sanitize(),
  
  securityHeaders: helmet()
};