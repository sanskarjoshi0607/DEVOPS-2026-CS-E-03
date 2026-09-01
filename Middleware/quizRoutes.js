const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const authorize = require('../middleware/role');
const {
  createQuiz,
  addQuestion,
  updateQuiz,
  publishQuiz,
  deleteQuiz,
  getMyQuizzes,
  getQuizForTeacher,
  getPublishedQuizzes,
  getPublishedQuizById
} = require('../controllers/quizController');

// Teacher-only routes
router.post('/', protect, authorize('teacher'), createQuiz);
router.post('/:id/questions', protect, authorize('teacher'), addQuestion);
router.put('/:id', protect, authorize('teacher'), updateQuiz);
router.patch('/:id/publish', protect, authorize('teacher'), publishQuiz);
router.delete('/:id', protect, authorize('teacher'), deleteQuiz);
router.get('/my', protect, authorize('teacher'), getMyQuizzes);
router.get('/:id/teacher-view', protect, authorize('teacher'), getQuizForTeacher);

// Student (and general authenticated) routes - correct answers are never included
router.get('/', protect, getPublishedQuizzes);
router.get('/:id', protect, getPublishedQuizById);

module.exports = router;
