import mongoose from 'mongoose';

/**
 * Question Schema
 * Defines each individual question inside a quiz
 */
const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  options: {
    type: [String],
    required: [true, 'Options array is required'],
    validate: {
      validator: function (v) {
        return Array.isArray(v) && v.length >= 2;
      },
      message: 'A question must have at least 2 options.'
    }
  },
  correctOptionIndex: {
    type: Number,
    required: [true, 'Correct option index is required'],
    min: 0
  },
  explanation: {
    type: String,
    default: ''
  }
});

/**
 * Quiz Schema
 * Represents a complete quiz containing multiple questions
 */
const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'General'
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    },
    timeLimit: {
      type: Number,
      default: 5, // in minutes
      min: [1, 'Time limit must be at least 1 minute']
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    creatorName: {
      type: String,
      default: 'Faculty'
    },
    questions: {
      type: [questionSchema],
      required: [true, 'At least one question is required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A quiz must contain at least 1 question.'
      }
    }
  },
  {
    timestamps: true
  }
);

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;
