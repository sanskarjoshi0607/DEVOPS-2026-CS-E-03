import Quiz from '../models/Quiz.js';
import Submission from '../models/Submission.js';
import { dbState, memoryStorage } from '../config/db.js';

/**
 * GET /api/quizzes
 * Retrieve all quizzes with optional filtering by category, difficulty, or search term.
 * Omits answer keys from summary for efficiency and cleanliness.
 */
export const getQuizzes = async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;

    if (dbState.isConnected) {
      const filter = {};
      if (category && category !== 'All') {
        filter.category = category;
      }
      if (difficulty && difficulty !== 'All') {
        filter.difficulty = difficulty;
      }
      if (search && typeof search === 'string') {
        const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (escapedSearch) {
          filter.$or = [
            { title: { $regex: escapedSearch, $options: 'i' } },
            { description: { $regex: escapedSearch, $options: 'i' } }
          ];
        }
      }

      const quizzes = await Quiz.find(filter).sort({ createdAt: -1 });

      const mapped = quizzes.map((q) => ({
        _id: q._id,
        title: q.title,
        description: q.description,
        category: q.category,
        difficulty: q.difficulty,
        timeLimit: q.timeLimit,
        questionCount: q.questions.length,
        createdAt: q.createdAt
      }));

      return res.json({ success: true, count: mapped.length, data: mapped });
    } else {
      // Graceful fallback to memory storage
      let list = [...memoryStorage.quizzes];

      if (category && category !== 'All') {
        list = list.filter((q) => q.category.toLowerCase() === category.toLowerCase());
      }
      if (difficulty && difficulty !== 'All') {
        list = list.filter((q) => q.difficulty.toLowerCase() === difficulty.toLowerCase());
      }
      if (search) {
        const query = search.toLowerCase();
        list = list.filter(
          (q) =>
            q.title.toLowerCase().includes(query) ||
            (q.description && q.description.toLowerCase().includes(query))
        );
      }

      const mapped = list.map((q) => ({
        _id: q._id,
        title: q.title,
        description: q.description,
        category: q.category,
        difficulty: q.difficulty,
        timeLimit: q.timeLimit,
        questionCount: q.questions.length,
        createdAt: q.createdAt
      }));

      return res.json({ success: true, count: mapped.length, data: mapped });
    }
  } catch (err) {
    console.error('Error fetching quizzes:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching quizzes.' });
  }
};

/**
 * GET /api/quizzes/:id
 * Retrieve a single quiz to play.
 * Note: Does NOT send correct answers to prevent cheating in the browser DevTools!
 */
export const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    let quiz = null;

    if (dbState.isConnected) {
      quiz = await Quiz.findById(id);
    } else {
      quiz = memoryStorage.quizzes.find((q) => String(q._id) === String(id));
    }

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    // Hide correct answers and explanations while taking the quiz
    const sanitizedQuestions = quiz.questions.map((q, index) => ({
      index,
      _id: q._id,
      questionText: q.questionText,
      options: q.options
    }));

    res.json({
      success: true,
      data: {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        category: quiz.category,
        difficulty: quiz.difficulty,
        timeLimit: quiz.timeLimit,
        questions: sanitizedQuestions
      }
    });
  } catch (err) {
    console.error('Error fetching quiz by ID:', err);
    res.status(500).json({ success: false, message: 'Server error fetching quiz.' });
  }
};

/**
 * POST /api/quizzes/:id/submit
 * Evaluates the submitted answers on the server, calculates the score,
 * generates a question breakdown, and saves the submission.
 */
export const submitQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers = {}, timeSpentSeconds = 0 } = req.body;

    // Verify user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'You must be logged in to submit a quiz.'
      });
    }

    let quiz = null;
    if (dbState.isConnected) {
      quiz = await Quiz.findById(id);
    } else {
      quiz = memoryStorage.quizzes.find((q) => String(q._id) === String(id));
    }

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;

    // answers format: { 0: 2, 1: 0, 2: 3 } or array of chosen indices
    const breakdown = quiz.questions.map((q, idx) => {
      const selectedIndex = answers[idx] !== undefined ? Number(answers[idx]) : -1;
      const isCorrect = selectedIndex === q.correctOptionIndex;

      if (isCorrect) correctCount++;

      return {
        questionIndex: idx,
        questionText: q.questionText,
        options: q.options,
        selectedOptionIndex: selectedIndex,
        correctOptionIndex: q.correctOptionIndex,
        isCorrect,
        explanation: q.explanation || 'No explanation provided.'
      };
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);

    const submissionData = {
      quizId: quiz._id,
      quizTitle: quiz.title,
      userId: req.user._id,
      userEmail: req.user.email,
      userName: req.user.name,
      userRole: req.user.role || 'student',
      score: correctCount,
      totalQuestions,
      percentage,
      timeSpentSeconds,
      answers: breakdown,
      createdAt: new Date().toISOString()
    };

    if (dbState.isConnected) {
      await Submission.create(submissionData);
    } else {
      memoryStorage.submissions.unshift({
        ...submissionData,
        _id: `sub_${Date.now()}`
      });
    }

    res.json({
      success: true,
      message: 'Quiz submitted successfully!',
      results: {
        quizTitle: quiz.title,
        userName: submissionData.userName,
        score: correctCount,
        totalQuestions,
        percentage,
        timeSpentSeconds,
        breakdown
      }
    });
  } catch (err) {
    console.error('Error submitting quiz:', err);
    res.status(500).json({ success: false, message: 'Server error during quiz submission.' });
  }
};

/**
 * POST /api/quizzes
 * Create a new quiz
 */
export const createQuiz = async (req, res) => {
  try {
    const { title, description, category, difficulty, timeLimit, questions } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Quiz title is required.' });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({ success: false, message: 'Category is required.' });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'Quiz must have at least one question.' });
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText || !q.questionText.trim()) {
        return res.status(400).json({ success: false, message: `Question #${i + 1} is missing text.` });
      }
      if (!Array.isArray(q.options) || q.options.length < 2) {
        return res.status(400).json({
          success: false,
          message: `Question #${i + 1} must have at least 2 options.`
        });
      }
      if (
        q.correctOptionIndex === undefined ||
        q.correctOptionIndex < 0 ||
        q.correctOptionIndex >= q.options.length
      ) {
        return res.status(400).json({
          success: false,
          message: `Question #${i + 1} has an invalid correct option index.`
        });
      }
    }

    const quizPayload = {
      title: title.trim(),
      description: description ? description.trim() : '',
      category: category.trim(),
      difficulty: difficulty || 'Medium',
      timeLimit: Number(timeLimit) || 5,
      questions,
      createdBy: req.user ? req.user._id : null,
      creatorName: req.user ? req.user.name : 'Faculty Creator'
    };

    if (dbState.isConnected) {
      const created = await Quiz.create(quizPayload);
      return res.status(201).json({
        success: true,
        message: 'Quiz created successfully!',
        data: created
      });
    } else {
      const newQuiz = {
        ...quizPayload,
        _id: `mem_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      memoryStorage.quizzes.unshift(newQuiz);

      return res.status(201).json({
        success: true,
        message: 'Quiz created successfully (Saved in session store)!',
        data: newQuiz
      });
    }
  } catch (err) {
    console.error('Error creating quiz:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error creating quiz.' });
  }
};

/**
 * DELETE /api/quizzes/:id
 * Delete a quiz by ID
 */
export const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user && req.user.role === 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only teachers have permission to delete quizzes.'
      });
    }

    if (dbState.isConnected) {
      const deleted = await Quiz.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Quiz not found.' });
      }
    } else {
      const index = memoryStorage.quizzes.findIndex((q) => String(q._id) === String(id));
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Quiz not found.' });
      }
      memoryStorage.quizzes.splice(index, 1);
    }

    res.json({ success: true, message: 'Quiz deleted successfully.' });
  } catch (err) {
    console.error('Error deleting quiz:', err);
    res.status(500).json({ success: false, message: 'Server error deleting quiz.' });
  }
};

/**
 * GET /api/submissions
 * Get user's own submissions (Students strictly see only their own results; Teachers can toggle view=all for class results)
 */
export const getSubmissions = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'You must be logged in to view quiz scores.'
      });
    }

    const { mine, view } = req.query;

    if (dbState.isConnected) {
      const filter = {};

      // If user is a student, or if view is not 'all', strictly scope to the logged-in user
      if (req.user.role !== 'teacher' || view !== 'all' || mine === 'true') {
        filter.$or = [
          { userId: req.user._id },
          { userEmail: req.user.email }
        ];
      }

      const submissions = await Submission.find(filter)
        .sort({ createdAt: -1 })
        .limit(50)
        .select('-answers');
      return res.json({ success: true, data: submissions });
    } else {
      let list = memoryStorage.submissions;
      if (req.user.role !== 'teacher' || view !== 'all' || mine === 'true') {
        list = list.filter(
          (s) =>
            String(s.userId) === String(req.user._id) ||
            (s.userEmail && s.userEmail.toLowerCase() === req.user.email.toLowerCase())
        );
      }
      const mapped = list.slice(0, 50).map((s) => {
        const { answers, ...rest } = s;
        return rest;
      });
      return res.json({ success: true, data: mapped });
    }
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ success: false, message: 'Server error fetching submissions.' });
  }
};

/**
 * GET /api/status
 * Get connection status of the MongoDB database
 */
export const getStatus = (req, res) => {
  res.json({
    success: true,
    status: {
      isConnected: dbState.isConnected,
      isFallback: dbState.isFallback,
      uri: dbState.uri ? dbState.uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') : '',
      error: dbState.error
    }
  });
};
