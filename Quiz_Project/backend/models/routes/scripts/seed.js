import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Quiz from '../models/Quiz.js';
import { sampleQuizzes } from '../data/sampleQuizzes.js';

// Load environment variables from .env
dotenv.config();

const seedDatabase = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/quiz_portal';

  try {
    console.log(`Connecting to MongoDB at: ${uri} ...`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✔ Connected to MongoDB!');

    // Clean existing sample quizzes
    console.log('Clearing existing quizzes...');
    await Quiz.deleteMany({});

    // Insert sample quizzes
    console.log(`Inserting ${sampleQuizzes.length} sample quizzes...`);
    const inserted = await Quiz.insertMany(sampleQuizzes);

    console.log(`\x1b[32m✔ Successfully seeded ${inserted.length} quizzes into MongoDB!\x1b[0m`);
    inserted.forEach((q, idx) => {
      console.log(`   ${idx + 1}. [${q.category}] ${q.title} (${q.questions.length} questions, ${q.difficulty})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('\x1b[31m✖ Failed to seed database:\x1b[0m', error.message);
    console.log('\nMake sure MongoDB is running or update MONGODB_URI in server/.env');
    process.exit(1);
  }
};

seedDatabase();
