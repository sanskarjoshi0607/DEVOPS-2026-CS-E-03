import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import QuizCard from './components/QuizCard';
import QuizPlayer from './components/QuizPlayer';
import QuizResults from './components/QuizResults';
import QuizCreator from './components/QuizCreator';
import SubmissionsHistory from './components/SubmissionsHistory';
import DbStatusModal from './components/DbStatusModal';
import AuthModal from './components/AuthModal';
import AuthGateway from './components/AuthGateway';
import ProtectedRoute from './components/ProtectedRoute';
import { TeacherIcon, InfoIcon } from './components/Icons';
import {
  fetchQuizzes,
  fetchQuizById,
  submitQuizAnswers,
  createQuiz,
  deleteQuiz,
  fetchDbStatus,
  getStoredUser,
  setStoredUser,
  removeStoredUser,
  removeAuthToken,
  getMeApi
} from './services/api';

/**
 * QuizPlayerWrapper handles loading a quiz directly from URL parameters (/quiz/:id)
 */
function QuizPlayerRoute({ activeQuiz, setActiveQuiz, onSubmitQuiz, currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!activeQuiz || String(activeQuiz._id) !== String(id));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!activeQuiz || String(activeQuiz._id) !== String(id)) {
      loadQuiz();
    }
  }, [id]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const res = await fetchQuizById(id);
      setActiveQuiz(res.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
        <p style={{ fontWeight: 600 }}>Loading assessment...</p>
      </div>
    );
  }

  if (error || !activeQuiz) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto', textAlign: 'center' }}>
        <div style={{ background: 'var(--danger-light)', color: '#991b1b', padding: '1.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
          <p style={{ fontWeight: 700 }}>Assessment Error</p>
          <p>{error || 'Quiz not found.'}</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/quizzes')}>
          Return to Quizzes
        </button>
      </div>
    );
  }

  return (
    <QuizPlayer
      quiz={activeQuiz}
      currentUser={currentUser}
      onSubmit={onSubmitQuiz}
      onCancel={() => navigate('/quizzes')}
    />
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // User Authentication State
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState({ mode: 'login', role: 'student' });
  const [teacherRestrictedModal, setTeacherRestrictedModal] = useState(false);

  // Quizzes State
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Active Quiz (in player mode)
  const [activeQuiz, setActiveQuiz] = useState(null);

  // Results State
  const [quizResults, setQuizResults] = useState(null);

  // Database Health Status & Modal
  const [dbStatus, setDbStatus] = useState(null);
  const [showDbModal, setShowDbModal] = useState(false);

  // Safeguard modal for leaving active quiz via navigation
  const [pendingNavigation, setPendingNavigation] = useState(null);

  // Verify auth session on initial mount
  useEffect(() => {
    checkStatus();
    verifySession();
  }, []);

  const verifySession = async () => {
    try {
      const res = await getMeApi();
      if (res.user) {
        setCurrentUser(res.user);
        setStoredUser(res.user);
      }
    } catch {
      // Session expired or unauthenticated
    }
  };

  const checkStatus = async () => {
    const res = await fetchDbStatus();
    setDbStatus(res);
  };

  // Fetch Quizzes whenever on /quizzes page or filters change
  useEffect(() => {
    if (currentUser && (location.pathname === '/quizzes' || location.pathname === '/')) {
      loadQuizzes();
    }
  }, [currentUser, selectedCategory, selectedDifficulty, searchTerm, location.pathname]);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const res = await fetchQuizzes({
        category: selectedCategory,
        difficulty: selectedDifficulty,
        search: searchTerm
      });
      setQuizzes(res.data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the backend server. Make sure Express is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  // Auth Handlers
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setShowAuthModal(false);
    navigate('/quizzes');
  };

  const handleLogout = () => {
    removeAuthToken();
    removeStoredUser();
    setCurrentUser(null);
    setActiveQuiz(null);
    setQuizResults(null);
    navigate('/login');
  };

  const openAuthWithConfig = (mode = 'login', role = 'student') => {
    setAuthModalConfig({ mode, role });
    setShowAuthModal(true);
  };

  // Start taking a quiz
  const handleStartQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  // Submit answers from player
  const handleSubmitQuiz = async (submissionPayload) => {
    if (!activeQuiz) return;
    try {
      const payload = {
        ...submissionPayload,
        userName: currentUser ? currentUser.name : submissionPayload.userName
      };
      const res = await submitQuizAnswers(activeQuiz._id, payload);
      setQuizResults(res.results);
      navigate('/results');
    } catch (err) {
      alert('Error submitting answers: ' + err.message);
    }
  };

  // Create new quiz
  const handleCreateQuiz = async (quizData) => {
    await createQuiz(quizData);
    await loadQuizzes();
    navigate('/quizzes');
  };

  // Delete quiz (Teacher only)
  const handleDeleteQuiz = async (quizId, quizTitle) => {
    if (!currentUser || currentUser.role !== 'teacher') {
      alert('Only teachers are authorized to delete quizzes.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${quizTitle}"?`)) {
      try {
        await deleteQuiz(quizId);
        setQuizzes((prev) => prev.filter((q) => q._id !== quizId));
      } catch (err) {
        alert('Failed to delete quiz: ' + err.message);
      }
    }
  };

  // Retake current quiz
  const handleRetake = () => {
    if (activeQuiz) {
      navigate(`/quiz/${activeQuiz._id}`);
    } else {
      navigate('/quizzes');
    }
  };

  // Categories list
  const categoriesList = ['All', 'React', 'JavaScript', 'Web Development', 'Python', 'General Tech'];

  return (
    <div className="app-root">
      {/* Top Navbar with Auth Status & URL NavLinks */}
      <Navbar
        dbStatus={dbStatus}
        onOpenDbModal={() => setShowDbModal(true)}
        currentUser={currentUser}
        onOpenAuthModal={() => openAuthWithConfig('login', 'student')}
        onLogout={handleLogout}
      />

      <main className="container">
        <Routes>
          {/* Default redirect */}
          <Route
            path="/"
            element={
              currentUser ? <Navigate to="/quizzes" replace /> : <Navigate to="/login" replace />
            }
          />

          {/* Login / Sign Up Gateway */}
          <Route
            path="/login"
            element={
              currentUser ? (
                <Navigate to="/quizzes" replace />
              ) : (
                <AuthGateway onLoginSuccess={handleAuthSuccess} />
              )
            }
          />

          {/* Quizzes Exploration Page */}
          <Route
            path="/quizzes"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <div>
                  <div className="page-header">
                    <div>
                      <h1 className="page-title">Quizzes & Assessments</h1>
                      <p className="page-subtitle">
                        Timed technical tests with instant grading and comprehensive answer explanations.
                      </p>
                    </div>
                  </div>

                  {/* Filter Toolbar */}
                  <FilterBar
                    categories={categoriesList}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    selectedDifficulty={selectedDifficulty}
                    onSelectDifficulty={setSelectedDifficulty}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    quizCount={quizzes.length}
                  />

                  {/* Loading / Error / Empty States */}
                  {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
                      <p style={{ fontWeight: 600 }}>Loading quizzes...</p>
                    </div>
                  ) : error ? (
                    <div
                      style={{
                        background: 'var(--danger-light)',
                        color: '#991b1b',
                        padding: '1.25rem 1.5rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--danger-border)',
                        margin: '2rem 0',
                        textAlign: 'center'
                      }}
                    >
                      <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Connection Notice</p>
                      <p style={{ fontSize: '0.9rem' }}>{error}</p>
                    </div>
                  ) : quizzes.length === 0 ? (
                    <div className="empty-state">
                      <h3 className="empty-title">No Quizzes Found</h3>
                      <p className="empty-desc">
                        Try adjusting your search filters or create a new test.
                      </p>
                      {currentUser?.role === 'teacher' && (
                        <button
                          className="btn-primary"
                          onClick={() => navigate('/create')}
                        >
                          Build a Custom Quiz
                        </button>
                      )}
                    </div>
                  ) : (
                    /* Quiz Cards Grid */
                    <div className="quiz-grid">
                      {quizzes.map((quiz) => (
                        <QuizCard
                          key={quiz._id}
                          quiz={quiz}
                          currentUser={currentUser}
                          onStart={handleStartQuiz}
                          onDelete={handleDeleteQuiz}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </ProtectedRoute>
            }
          />

          {/* Active Quiz Player Route */}
          <Route
            path="/quiz/:id"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <QuizPlayerRoute
                  activeQuiz={activeQuiz}
                  setActiveQuiz={setActiveQuiz}
                  onSubmitQuiz={handleSubmitQuiz}
                  currentUser={currentUser}
                />
              </ProtectedRoute>
            }
          />

          {/* Quiz Results Route */}
          <Route
            path="/results"
            element={
              <ProtectedRoute currentUser={currentUser}>
                {quizResults ? (
                  <QuizResults
                    results={quizResults}
                    onRetake={handleRetake}
                    onBackToBrowse={() => navigate('/quizzes')}
                    onCreateQuiz={() => navigate('/create')}
                  />
                ) : (
                  <Navigate to="/quizzes" replace />
                )}
              </ProtectedRoute>
            }
          />

          {/* Create Quiz Route (Teacher Role Restricted) */}
          <Route
            path="/create"
            element={
              <ProtectedRoute currentUser={currentUser} requiredRole="teacher">
                <QuizCreator
                  onQuizCreated={handleCreateQuiz}
                  onCancel={() => navigate('/quizzes')}
                />
              </ProtectedRoute>
            }
          />

          {/* Submissions / Scoreboard Route */}
          <Route
            path="/scores"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <SubmissionsHistory currentUser={currentUser} />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Database Status & Setup Modal */}
      {showDbModal && (
        <DbStatusModal
          dbStatus={dbStatus}
          onClose={() => setShowDbModal(false)}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authModalConfig.mode}
        initialRole={authModalConfig.role}
      />
    </div>
  );
}
