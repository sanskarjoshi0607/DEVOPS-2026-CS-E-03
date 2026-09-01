const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');

// @desc    Submit answers for a quiz; backend grades and stores the result
// @route   POST /api/attempts/:quizId
// @access  Private/Student
// Expected body: { answers: [{ questionId, selectedOptionIndex }, ...] }
const submitAttempt = async (req, res, next) => {
  try {
    const { answers } = req.body;
    const { quizId } = req.params;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: 'answers array is required' });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz || quiz.status !== 'published') {
      return res.status(404).json({ message: 'Quiz not found or not published' });
    }

    // Build a lookup of correct answers from the authoritative quiz document.
    // The correct answers never leave the server until this point.
    const correctAnswerMap = new Map();
    quiz.questions.forEach((q) => {
      correctAnswerMap.set(q._id.toString(), q.correctAnswerIndex);
    });

    let correctCount = 0;
    const gradedAnswers = answers.map((a) => {
      const correctIndex = correctAnswerMap.get(a.questionId?.toString());
      const isCorrect =
        correctIndex !== undefined && correctIndex === a.selectedOptionIndex;
      if (isCorrect) correctCount += 1;

      return {
        questionId: a.questionId,
        selectedOptionIndex: a.selectedOptionIndex,
        isCorrect
      };
    });

    const totalQuestions = quiz.questions.length;
    const wrongCount = totalQuestions - correctCount;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 10000) / 100 : 0;

    const attempt = await Attempt.create({
      student: req.user._id,
      quiz: quiz._id,
      answers: gradedAnswers,
      score: correctCount,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      percentage,
      submittedAt: new Date()
    });

    res.status(201).json({
      attemptId: attempt._id,
      quizTitle: quiz.title,
      score: correctCount,
      totalQuestions,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      percentage,
      submittedAt: attempt.submittedAt
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single attempt's detailed result (owner student only)
// @route   GET /api/attempts/:id
// @access  Private/Student (owner only)
const getAttemptResult = async (req, res, next) => {
  try {
    const attempt = await Attempt.findById(req.params.id).populate('quiz', 'title');
    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    if (attempt.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this attempt' });
    }

    res.status(200).json(attempt);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all attempts by the logged-in student
// @route   GET /api/attempts/my
// @access  Private/Student
const getMyAttempts = async (req, res, next) => {
  try {
    const attempts = await Attempt.find({ student: req.user._id })
      .populate('quiz', 'title category difficulty')
      .sort({ submittedAt: -1 });

    res.status(200).json(attempts);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all attempts for a specific quiz (teacher owner only)
// @route   GET /api/attempts/quiz/:quizId
// @access  Private/Teacher (owner only)
const getAttemptsForQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these results' });
    }

    const attempts = await Attempt.find({ quiz: quiz._id })
      .populate('student', 'name email')
      .sort({ submittedAt: -1 });

    res.status(200).json(attempts);
  } catch (error) {
    next(error);
  }
};

module.exports = { submitAttempt, getAttemptResult, getMyAttempts, getAttemptsForQuiz };
