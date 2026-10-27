import express from 'express';
import {
  getQuizzes,
  getQuizById,
  submitQuiz,
  createQuiz,
  deleteQuiz,
  getSubmissions,
  getStatus
} from '../controllers/quizController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Quizzes exploration
router.get('/quizzes', optionalAuth, getQuizzes);
router.get('/quizzes/:id', optionalAuth, getQuizById);
router.post('/quizzes', protect, createQuiz);
router.delete('/quizzes/:id', protect, deleteQuiz);

// Quiz Evaluation (Must be logged in to submit and save score)
router.post('/quizzes/:id/submit', protect, submitQuiz);

// Submissions History (Must be logged in to retrieve scores)
router.get('/submissions', protect, getSubmissions);

// System Status (MongoDB check)
router.get('/status', getStatus);

export default router;
