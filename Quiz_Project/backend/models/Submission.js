import mongoose from 'mongoose';

/**
 * Submission Schema
 * Records a user's attempt at a quiz, their score, and answers
 */
const submissionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true
    },
    quizTitle: {
      type: String,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userEmail: {
      type: String,
      trim: true
    },
    userRole: {
      type: String,
      default: 'student'
    },
    userName: {
      type: String,
      required: true,
      trim: true
    },
    score: {
      type: Number,
      required: true
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    },
    timeSpentSeconds: {
      type: Number,
      default: 0
    },
    answers: [
      {
        questionIndex: Number,
        questionText: String,
        selectedOptionIndex: Number,
        correctOptionIndex: Number,
        isCorrect: Boolean,
        explanation: String
      }
    ]
  },
  {
    timestamps: true
  }
);

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;
