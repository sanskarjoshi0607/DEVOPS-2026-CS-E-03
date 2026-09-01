const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const authorize = require('../middleware/role');
const {
  submitAttempt,
  getAttemptResult,
  getMyAttempts,
  getAttemptsForQuiz
} = require('../controllers/attemptController');

// Student routes
router.post('/:quizId', protect, authorize('student'), submitAttempt);
router.get('/my', protect, authorize('student'), getMyAttempts);
router.get('/:id', protect, authorize('student'), getAttemptResult);

// Teacher route - view all attempts/results for a quiz they own
router.get('/quiz/:quizId', protect, authorize('teacher'), getAttemptsForQuiz);

module.exports = router;
