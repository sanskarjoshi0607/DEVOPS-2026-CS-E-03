import React, { useState, useEffect, useRef } from 'react';
import { TimerIcon, ArrowLeftIcon, ArrowRightIcon, CheckIcon, UserIcon } from './Icons';

export default function QuizPlayer({ quiz, onSubmit, onCancel, currentUser }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState((quiz.timeLimit || 5) * 60);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerRef = useRef(null);
  const initialTime = (quiz.timeLimit || 5) * 60;
  const questions = quiz.questions || [];
  const currentQuestion = questions[currentIndex] || {};

  // Protection: Intercept Browser Back Button ("donot back from any page")
  useEffect(() => {
    window.history.pushState({ quizActive: true }, '', window.location.href);

    const handlePopState = () => {
      window.history.pushState({ quizActive: true }, '', window.location.href);
      setShowExitModal(true);
    };

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'You have a quiz in progress. Are you sure you want to leave?';
      return e.returnValue;
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  const handleAutoSubmit = () => {
    triggerSubmit(true);
  };

  const handleSelectOption = (optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex
    }));
  };

  const handleClearOption = () => {
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentIndex];
      return copy;
    });
  };

  // Keyboard navigation & shortcuts (1-4, A-D, Left/Right arrows)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const key = e.key.toUpperCase();
      if (['1', 'A'].includes(key) && currentQuestion.options?.[0]) handleSelectOption(0);
      else if (['2', 'B'].includes(key) && currentQuestion.options?.[1]) handleSelectOption(1);
      else if (['3', 'C'].includes(key) && currentQuestion.options?.[2]) handleSelectOption(2);
      else if (['4', 'D'].includes(key) && currentQuestion.options?.[3]) handleSelectOption(3);
      else if (e.key === 'ArrowRight' && currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentQuestion]);

  const triggerSubmit = async (isTimeout = false) => {
    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const timeSpent = initialTime - timeLeft;
    await onSubmit({
      userName: currentUser?.name || 'Student',
      answers: selectedAnswers,
      timeSpentSeconds: timeSpent
    });
  };

  const handleSubmitClick = () => {
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < questions.length) {
      setShowConfirmModal(true);
    } else {
      triggerSubmit();
    }
  };

  // Format MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);
  const isTimeCritical = timeLeft < 60;
  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="player-container">
      {/* Top Header */}
      <div className="player-header">
        <div className="player-header-left">
          <button
            onClick={() => setShowExitModal(true)}
            className="player-exit-btn"
            title="Leave this quiz"
          >
            <ArrowLeftIcon size={15} />
            <span>Exit Quiz</span>
          </button>
          <h2 className="player-quiz-title">{quiz.title}</h2>
          {currentUser && (
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                background: 'var(--bg-muted)',
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <UserIcon size={13} />
              <span>{currentUser.name}</span>
            </span>
          )}
        </div>

        {/* Floating Timer Box */}
        <div className={`timer-box ${isTimeCritical ? 'warning' : ''}`}>
          <TimerIcon size={18} />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress Section */}
      <div className="player-progress-section">
        <div className="progress-info-row">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{answeredCount} of {questions.length} Answered ({progressPercent}%)</span>
        </div>
        <div className="progress-track">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {/* Question Quick-jump Palette Map */}
      <div className="palette-row">
        <span className="palette-label">Jump to:</span>
        {questions.map((_, i) => {
          const isAnswered = selectedAnswers[i] !== undefined;
          const isCurrent = i === currentIndex;
          return (
            <button
              key={i}
              className={`palette-btn ${isCurrent ? 'current' : ''} ${isAnswered ? 'answered' : ''}`}
              onClick={() => setCurrentIndex(i)}
              title={`Question ${i + 1} ${isAnswered ? '(Answered)' : '(Unanswered)'}`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Active Question Card */}
      <div className="question-card">
        <div className="question-badge-row">
          <span className="question-badge">
            Question #{currentIndex + 1}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {selectedAnswers[currentIndex] !== undefined ? '✓ Option Selected' : 'Not yet answered'}
          </span>
        </div>

        <h3 className="question-text">{currentQuestion.questionText}</h3>

        {/* Options */}
        <div className="options-list">
          {currentQuestion.options?.map((optionText, optIdx) => {
            const isSelected = selectedAnswers[currentIndex] === optIdx;
            return (
              <button
                key={optIdx}
                className={`option-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelectOption(optIdx)}
              >
                <div className="option-letter">{optionLetters[optIdx] || optIdx + 1}</div>
                <span style={{ flexGrow: 1 }}>{optionText}</span>
                {isSelected && <CheckIcon size={18} className="text-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Player Navigation Controls */}
      <div className="player-footer">
        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button
            className="btn-secondary"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
          >
            <ArrowLeftIcon size={16} />
            <span>Previous</span>
          </button>

          {selectedAnswers[currentIndex] !== undefined && (
            <button
              className="btn-secondary"
              style={{ fontSize: '0.85rem' }}
              onClick={handleClearOption}
            >
              Clear Choice
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {currentIndex < questions.length - 1 ? (
            <button
              className="btn-primary"
              onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))}
            >
              <span>Next Question</span>
              <ArrowRightIcon size={16} />
            </button>
          ) : (
            <button
              className="btn-primary btn-submit"
              disabled={isSubmitting}
              onClick={handleSubmitClick}
            >
              <CheckIcon size={16} />
              <span>{isSubmitting ? 'Submitting...' : 'Finish & Submit Test'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="keyboard-hint">
        💡 Pro-tip: Press keys 1-4 or A-D to select options, and arrow keys to navigate questions.
      </div>

      {/* Exit Quiz Confirmation Safeguard Modal ("donot back from any page") */}
      {showExitModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '460px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'var(--danger-light)',
                  color: 'var(--danger)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  flexShrink: 0
                }}
              >
                ⚠️
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Exit Quiz in Progress?</h3>
            </div>
            
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              You are currently in an active quiz. If you leave now, your answers and timer progress will be discarded.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                className="btn-primary"
                onClick={() => setShowExitModal(false)}
              >
                Continue Taking Quiz
              </button>
              <button
                className="btn-secondary"
                style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
                onClick={() => {
                  setShowExitModal(false);
                  onCancel();
                }}
              >
                Yes, Exit Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal when Submitting with Unanswered Questions */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '460px' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Ready to Submit?
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              You have answered <strong>{answeredCount}</strong> out of{' '}
              <strong>{questions.length}</strong> questions. Unanswered questions will receive 0 points.
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.45rem' }}>
                Your Name on Certificate (Optional):
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Alex Johnson"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                className="btn-secondary"
                onClick={() => setShowConfirmModal(false)}
              >
                Review Answers
              </button>
              <button
                className="btn-primary btn-submit"
                disabled={isSubmitting}
                onClick={() => {
                  setShowConfirmModal(false);
                  triggerSubmit();
                }}
              >
                {isSubmitting ? 'Evaluating...' : 'Confirm & Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
