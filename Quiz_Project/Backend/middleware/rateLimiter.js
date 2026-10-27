/**
 * Lightweight in-memory rate limiter middleware for authentication routes.
 * Mitigates brute-force credential stuffing and DoS attacks.
 */

const ipRequests = new Map();

// Clean up stale IP records every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipRequests.entries()) {
    if (now - data.startTime > 60000) {
      ipRequests.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export const authRateLimiter = (maxRequests = 10, windowMs = 60000) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();

    const record = ipRequests.get(ip) || { count: 0, startTime: now };

    if (now - record.startTime > windowMs) {
      // Reset window
      record.count = 1;
      record.startTime = now;
      ipRequests.set(ip, record);
      return next();
    }

    record.count += 1;
    ipRequests.set(ip, record);

    if (record.count > maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please wait a minute before trying again.'
      });
    }

    next();
  };
};
