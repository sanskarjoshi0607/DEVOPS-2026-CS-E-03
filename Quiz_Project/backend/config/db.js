import mongoose from 'mongoose';
import { sampleQuizzes } from '../data/sampleQuizzes.js';

// Holds live database connection status for health checks and UI banners
export const dbState = {
  isConnected: false,
  isFallback: false,
  uri: '',
  error: null
};

// In-memory fallback storage used when MongoDB server is not running
export let memoryStorage = {
  quizzes: [],
  submissions: []
};

// Initialize in-memory store with sample quizzes (gives IDs for fallback use)
export const initMemoryStorage = () => {
  if (memoryStorage.quizzes.length === 0) {
    memoryStorage.quizzes = sampleQuizzes.map((q, idx) => ({
      ...q,
      _id: `mem_${idx + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
  }
};

/**
 * Connect to MongoDB with graceful fallback
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/quiz_portal';
  dbState.uri = uri;

  try {
    // Attempt Mongoose connection with 4-second timeout to avoid long hangs
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000
    });

    dbState.isConnected = true;
    dbState.isFallback = false;
    dbState.error = null;

    console.log(`\x1b[32m✔ MongoDB connected successfully to: ${uri}\x1b[0m`);
  } catch (err) {
    dbState.isConnected = false;
    dbState.isFallback = true;
    dbState.error = err.message;

    // Initialize fallback mock data so the portal works instantly
    initMemoryStorage();

    console.log(`\x1b[33m─────────────────────────────────────────────────────────────\x1b[0m`);
    console.log(`\x1b[33m⚠ Notice: Could not connect to MongoDB at: ${uri}\x1b[0m`);
    console.log(`\x1b[36mℹ Don't worry! Running in Graceful Fallback Mode.\x1b[0m`);
    console.log(`\x1b[90m  Pre-loaded ${memoryStorage.quizzes.length} sample quizzes in memory.\x1b[0m`);
    console.log(`\x1b[90m  To connect to MongoDB:\x1b[0m`);
    console.log(`\x1b[90m  1. Install & start MongoDB locally (mongod)\x1b[0m`);
    console.log(`\x1b[90m  2. Or set MONGODB_URI in server/.env with your free MongoDB Atlas link.\x1b[0m`);
    console.log(`\x1b[33m─────────────────────────────────────────────────────────────\x1b[0m`);
  }
};
