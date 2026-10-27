import React, { useState } from 'react';
import { PlusIcon, TrashIcon, CheckIcon, ArrowLeftIcon, InfoIcon } from './Icons';

export default function QuizCreator({ onQuizCreated, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [customCategory, setCustomCategory] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [timeLimit, setTimeLimit] = useState(5);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Initial template with 2 questions
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
      explanation: ''
    },
    {
      questionText: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
      explanation: ''
    }
  ]);

  const hasDraftContent = title.trim() || questions.some((q) => q.questionText.trim());

  const handleCancelClick = () => {
    if (hasDraftContent) {
      setShowExitConfirm(true);
    } else {
      onCancel();
    }
  };

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        questionText: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
        explanation: ''
      }
    ]);
  };

  const handleRemoveQuestion = (qIdx) => {
    if (questions.length <= 1) {
      setErrorMsg('A quiz must have at least one question.');
      return;
    }
    setQuestions((prev) => prev.filter((_, idx) => idx !== qIdx));
  };

  const handleQuestionTextChange = (qIdx, text) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIdx].questionText = text;
      return copy;
    });
  };

  const handleOptionChange = (qIdx, optIdx, val) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIdx].options[optIdx] = val;
      return copy;
    });
  };

  const handleCorrectOptionChange = (qIdx, optIdx) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIdx].correctOptionIndex = optIdx;
      return copy;
    });
  };

  const handleExplanationChange = (qIdx, text) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIdx].explanation = text;
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (!title.trim()) {
      setErrorMsg('Please enter a Quiz Title.');
      return;
    }

    const finalCategory = category === 'Custom' ? customCategory.trim() : category;
    if (!finalCategory) {
      setErrorMsg('Please select or specify a Category.');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        setErrorMsg(`Question #${i + 1} is missing the question text.`);
        return;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          setErrorMsg(`Question #${i + 1}, Option ${String.fromCharCode(65 + j)} cannot be empty.`);
          return;
        }
      }
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      category: finalCategory,
      difficulty,
      timeLimit: Number(timeLimit) || 5,
      questions
    };

    try {
      setIsSubmitting(true);
      await onQuizCreated(payload);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create quiz.');
      setIsSubmitting(false);
    }
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div style={{ maxWidth: '860px', margin: '2rem auto 5rem' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <button
            type="button"
            onClick={handleCancelClick}
            className="player-exit-btn"
            style={{ marginBottom: '0.4rem' }}
          >
            <ArrowLeftIcon size={15} />
            <span>Back to Quizzes</span>
          </button>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Build Custom Quiz
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Design your challenge, configure timer rules, and craft educational explanations.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div
          style={{
            background: 'var(--danger-light)',
            color: '#991b1b',
            border: '1px solid var(--danger-border)',
            padding: '0.85rem 1.15rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
            fontWeight: 600,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem'
          }}
        >
          <InfoIcon size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Step 1: Meta Settings */}
        <div className="creator-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
              1
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>General Information</h3>
          </div>

          <div className="form-group">
            <label className="form-label">Quiz Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Master React Hooks & Performance"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description / Summary</label>
            <textarea
              className="form-textarea"
              rows="3"
              placeholder="What core concepts or topics does this quiz test?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Web Development">Web Development</option>
                <option value="React">React</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="General Tech">General Tech</option>
                <option value="Custom">+ Custom Category</option>
              </select>

              {category === 'Custom' && (
                <input
                  type="text"
                  className="form-input"
                  style={{ marginTop: '0.65rem' }}
                  placeholder="Enter custom category name"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  required
                />
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Difficulty Level</label>
              <select
                className="form-select"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="Easy">Easy (Fundamentals)</option>
                <option value="Medium">Medium (Intermediate)</option>
                <option value="Hard">Hard (Advanced / Edge Cases)</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ maxWidth: '280px', marginBottom: 0 }}>
            <label className="form-label">Time Limit (Minutes)</label>
            <input
              type="number"
              min="1"
              max="60"
              className="form-input"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
            />
          </div>
        </div>

        {/* Step 2: Questions Builder */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
              2
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              Questions & Answer Keys ({questions.length})
            </h3>
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={handleAddQuestion}
            style={{ fontSize: '0.88rem' }}
          >
            <PlusIcon size={16} />
            <span>Add Question</span>
          </button>
        </div>

        {questions.map((q, qIdx) => (
          <div key={qIdx} className="question-block">
            <div className="question-block-header">
              <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.95rem' }}>
                Question #{qIdx + 1}
              </span>
              {questions.length > 1 && (
                <button
                  type="button"
                  className="btn-delete"
                  onClick={() => handleRemoveQuestion(qIdx)}
                  title="Remove this question"
                >
                  <TrashIcon size={16} />
                </button>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Question Text *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. What hook is used to perform side effects in React?"
                value={q.questionText}
                onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Options & Select Correct Answer (Select the radio to mark the correct choice) *
              </label>

              {q.options.map((opt, optIdx) => {
                const isCorrect = q.correctOptionIndex === optIdx;
                return (
                  <div
                    key={optIdx}
                    className="option-input-row"
                    style={{
                      background: isCorrect ? '#ecfdf5' : '#ffffff',
                      border: `1.5px solid ${isCorrect ? '#10b981' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '0.5rem 0.85rem'
                    }}
                  >
                    <input
                      type="radio"
                      name={`correct_${qIdx}`}
                      checked={isCorrect}
                      onChange={() => handleCorrectOptionChange(qIdx, optIdx)}
                      className="option-radio"
                      title="Mark as correct answer"
                    />
                    <span style={{ fontWeight: 800, width: '24px', color: isCorrect ? '#047857' : 'var(--text-muted)' }}>
                      {optionLetters[optIdx]}.
                    </span>
                    <input
                      type="text"
                      className="form-input"
                      style={{ border: 'none', background: 'transparent', padding: '0.35rem 0.5rem' }}
                      placeholder={`Enter Option ${optionLetters[optIdx]}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                      required
                    />
                    {isCorrect && (
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#047857', whiteSpace: 'nowrap' }}>
                        ✓ Correct Key
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Pedagogical Explanation (Recommended)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Explains the core reason why this is correct during review..."
                value={q.explanation}
                onChange={(e) => handleExplanationChange(qIdx, e.target.value)}
              />
            </div>
          </div>
        ))}

        {/* Submit & Cancel Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
          <button type="button" className="btn-secondary" onClick={handleCancelClick}>
            Cancel
          </button>
          <button type="submit" className="btn-primary btn-submit" disabled={isSubmitting}>
            <CheckIcon size={16} />
            <span>{isSubmitting ? 'Saving to Database...' : 'Publish Quiz'}</span>
          </button>
        </div>
      </form>

      {/* Discard Draft Confirmation Modal */}
      {showExitConfirm && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '440px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Discard Quiz Draft?
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              You have drafted questions for this quiz. If you leave now without publishing, your changes will be discarded.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button className="btn-primary" onClick={() => setShowExitConfirm(false)}>
                Keep Editing
              </button>
              <button
                className="btn-secondary"
                style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
                onClick={() => {
                  setShowExitConfirm(false);
                  onCancel();
                }}
              >
                Discard & Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
