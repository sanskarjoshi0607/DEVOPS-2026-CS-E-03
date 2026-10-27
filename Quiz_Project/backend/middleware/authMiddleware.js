import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { dbState, memoryStorage } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'quiz_portal_jwt_secret_key_2026';

/**
 * Protect routes - Verifies JWT Token
 */
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Please log in.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (dbState.isConnected) {
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User account no longer exists.' });
      }
    } else {
      // Memory fallback mode user lookup
      req.user = memoryStorage.users?.find((u) => String(u._id) === String(decoded.id));
      if (!req.user) {
        req.user = { _id: decoded.id, name: decoded.name, email: decoded.email, role: decoded.role };
      }
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session token.' });
  }
};

/**
 * Optional Auth - attaches user if token present, but doesn't block guests
 */
export const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (dbState.isConnected) {
      req.user = await User.findById(decoded.id).select('-password');
    } else {
      req.user = memoryStorage.users?.find((u) => String(u._id) === String(decoded.id)) || {
        _id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role
      };
    }
  } catch (err) {
    // Token invalid - proceed as guest
  }

  next();
};

/**
 * Grant access to specific roles (e.g. 'teacher')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'You must be logged in to perform this action.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to perform this action. Teachers only.`
      });
    }

    next();
  };
};
