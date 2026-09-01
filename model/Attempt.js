const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    selectedOptionIndex: {
      type: Number,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  },
  { _id: false }
);

const attemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true
    },
    answers: {
      type: [answerSchema],
      default: []
    },
    score: {
      type: Number,
      required: true
    },
    correctAnswers: {
      type: Number,
      required: true
    },
    wrongAnswers: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Prevent the same student from having duplicate in-progress records for the same quiz
attemptSchema.index({ student: 1, quiz: 1, submittedAt: 1 });

module.exports = mongoose.model('Attempt', attemptSchema);
