const Quiz = require('../models/Quiz');

// Strips correct answers from a quiz's questions before sending to students.
const sanitizeQuizForStudent = (quiz) => {
  const quizObj = quiz.toObject ? quiz.toObject() : quiz;
  return {
    ...quizObj,
    questions: quizObj.questions.map((q) => ({
      _id: q._id,
      text: q.text,
      options: q.options
      // correctAnswerIndex intentionally omitted
    }))
  };
};

// @desc    Create a new quiz (starts as draft)
// @route   POST /api/quizzes
// @access  Private/Teacher
const createQuiz = async (req, res, next) => {
  try {
    const { title, description, category, difficulty, timeLimit, questions } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Quiz title is required' });
    }

    const quiz = await Quiz.create({
      title,
      description,
      category,
      difficulty,
      timeLimit,
      questions: questions || [],
      teacher: req.user._id,
      status: 'draft'
    });

    res.status(201).json(quiz);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a question to an existing quiz
// @route   POST /api/quizzes/:id/questions
// @access  Private/Teacher (owner only)
const addQuestion = async (req, res, next) => {
  try {
    const { text, options, correctAnswerIndex } = req.body;

    if (!text || !Array.isArray(options) || options.length < 2 || correctAnswerIndex === undefined) {
      return res.status(400).json({
        message: 'text, at least 2 options, and correctAnswerIndex are required'
      });
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this quiz' });
    }

    quiz.questions.push({ text, options, correctAnswerIndex });
    await quiz.save();

    res.status(201).json(quiz);
  } catch (error) {
    next(error);
  }
};

// @desc    Update quiz details (title, description, category, etc.)
// @route   PUT /api/quizzes/:id
// @access  Private/Teacher (owner only)
const updateQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this quiz' });
    }

    const allowedFields = ['title', 'description', 'category', 'difficulty', 'timeLimit'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        quiz[field] = req.body[field];
      }
    });

    await quiz.save();
    res.status(200).json(quiz);
  } catch (error) {
    next(error);
  }
};

// @desc    Publish a draft quiz (must have at least 1 question)
// @route   PATCH /api/quizzes/:id/publish
// @access  Private/Teacher (owner only)
const publishQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this quiz' });
    }

    if (quiz.questions.length === 0) {
      return res.status(400).json({ message: 'Cannot publish a quiz with no questions' });
    }

    quiz.status = 'published';
    await quiz.save();

    res.status(200).json(quiz);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a quiz
// @route   DELETE /api/quizzes/:id
// @access  Private/Teacher (owner only)
const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this quiz' });
    }

    await quiz.deleteOne();
    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all quizzes created by the logged-in teacher (full data, incl. answers)
// @route   GET /api/quizzes/my
// @access  Private/Teacher
const getMyQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({ teacher: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(quizzes);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single quiz owned by the teacher (full data, incl. answers)
// @route   GET /api/quizzes/:id/teacher-view
// @access  Private/Teacher (owner only)
const getQuizForTeacher = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this quiz' });
    }

    res.status(200).json(quiz);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all published quizzes (question list only, no correct answers)
// @route   GET /api/quizzes
// @access  Private/Student
const getPublishedQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({ status: 'published' }).sort({ createdAt: -1 });
    const sanitized = quizzes.map(sanitizeQuizForStudent);
    res.status(200).json(sanitized);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single published quiz for taking (no correct answers included)
// @route   GET /api/quizzes/:id
// @access  Private/Student
const getPublishedQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz || quiz.status !== 'published') {
      return res.status(404).json({ message: 'Quiz not found or not published' });
    }

    res.status(200).json(sanitizeQuizForStudent(quiz));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createQuiz,
  addQuestion,
  updateQuiz,
  publishQuiz,
  deleteQuiz,
  getMyQuizzes,
  getQuizForTeacher,
  getPublishedQuizzes,
  getPublishedQuizById
};
