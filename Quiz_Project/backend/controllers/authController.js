import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { dbState, memoryStorage } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'quiz_portal_jwt_secret_key_2026';

// Helper to generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Initialize in-memory demo users if in fallback mode
if (!memoryStorage.users) {
  memoryStorage.users = [
    {
      _id: 'user_student_demo',
      name: 'Alex Johnson',
      email: 'student@demo.com',
      passwordHash: bcrypt.hashSync('student123', 10),
      role: 'student'
    },
    {
      _id: 'user_teacher_demo',
      name: 'Prof. Sarah Smith',
      email: 'teacher@demo.com',
      passwordHash: bcrypt.hashSync('teacher123', 10),
      role: 'teacher'
    }
  ];
}

/**
 * POST /api/auth/register
 * Register a new Student or Teacher
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = 'student' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanRole = role === 'teacher' ? 'teacher' : 'student';

    if (dbState.isConnected) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists. Please log in.'
        });
      }

      const user = await User.create({
        name: name.trim(),
        email: cleanEmail,
        password,
        role: cleanRole
      });

      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        message: `Registered successfully as ${cleanRole}!`,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      // Fallback in-memory storage
      const existingUser = memoryStorage.users.find((u) => u.email === cleanEmail);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists.'
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = {
        _id: `mem_user_${Date.now()}`,
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role: cleanRole
      };
      memoryStorage.users.push(newUser);

      const token = generateToken(newUser);

      return res.status(201).json({
        success: true,
        message: `Registered successfully as ${cleanRole}!`,
        token,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      });
    }
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Server error during registration.'
    });
  }
};

/**
 * POST /api/auth/login
 * Log in an existing user with email and password
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (dbState.isConnected) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      const token = generateToken(user);

      return res.json({
        success: true,
        message: 'Logged in successfully!',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      // Fallback in-memory check
      const user = memoryStorage.users.find((u) => u.email === cleanEmail);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      const token = generateToken(user);

      return res.json({
        success: true,
        message: 'Logged in successfully!',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Server error during login.'
    });
  }
};

/**
 * GET /api/auth/me
 * Get current authenticated user details
 */
export const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error retrieving user data.' });
  }
};
