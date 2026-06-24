const rateLimit = require("express-rate-limit");

// General API Rate Limiter
// Limits general API requests to 200 requests per 15 minutes per IP.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
});

// Authentication and Sensitive Action Rate Limiter
// Protects registration, login, changing passwords, and deleting accounts.
// Limits requests to 15 attempts per 15 minutes per IP.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many attempts from this IP, please try again after 15 minutes.",
  },
});

// Reels Upload Rate Limiter
// Protects upload endpoints to prevent spamming video file uploads.
// Limits requests to 20 uploads per hour per IP.
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many reel upload attempts, please try again after an hour.",
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
  uploadLimiter,
};
