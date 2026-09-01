const mongoose = require('mongoose');
const { questionSchema } = require('./Question');

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    questions: {
      type: [questionSchema],
      default: []
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    },
    category: {
      type: String,
      trim: true,
      default: 'General'
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    timeLimit: {
      // in minutes
      type: Number,
      default: 10,
      min: 1
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
