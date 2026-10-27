import React, { useState } from 'react';
import { RefreshIcon, ArrowLeftIcon, CheckIcon, CrossIcon, InfoIcon } from './Icons';

export default function QuizResults({ results, onRetake, onBackToBrowse }) {
  const { quizTitle, userName, score, totalQuestions, percentage, timeSpentSeconds, breakdown = [] } = results;
  const [filterType, setFilterType] = useState('all');

  const isPass = percentage >= 60;

  const getFeedback = () => {
    if (percentage === 100) return { title: 'Perfect Score', subtitle: 'All questions answered correctly. Excellent grasp of this topic.' };
    if (percentage >= 80) return { title: 'Assessment Passed', subtitle: 'Strong performance. Review the answer explanations below for additional context.' };
    if (percentage >= 60) return { title: 'Assessment Passed', subtitle: 'Passing score achieved. Review any missed questions to solidify understanding.' };
    return { title: 'Review Required', subtitle: 'Scored below the 60% passing threshold. Take time to read through the answer explanations and retake the test.' };
  };

  const feedback = getFeedback();

  const formatTime = (seconds) => {
    if (!seconds) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  const incorrectCount = totalQuestions - score;

  const filteredBreakdown = breakdown.filter((item) => {
    if (filterType === 'wrong') return !item.isCorrect;
    if (filterType === 'correct') return item.isCorrect;
    return true;
  });

  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div style={{ maxWidth: '860px', margin: '2rem auto 5rem' }}>
      {/* Top Banner & Overview Card */}
      <div className="results-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '3.5rem', fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', color: isPass ? 'var(--success)' : 'var(--danger)', lineHeight: 1 }}>
            {percentage}%
          </div>
          <div style={{ textAlign: 'left' }}>
            <span
              style={{
                display: 'inline-block',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-xs)',
                background: isPass ? 'var(--success-light)' : 'var(--danger-light)',
                color: isPass ? '#065f46' : '#991b1b',
                border: `1px solid ${isPass ? 'var(--success-border)' : 'var(--danger-border)'}`,
                marginBottom: '0.25rem'
              }}
            >
              {isPass ? 'Passed' : 'Needs Review'}
            </span>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {score} of {totalQuestions} answered correctly
            </div>
          </div>
        </div>

        <h2 className="results-headline">{feedback.title}</h2>
        <p className="results-subheadline">{feedback.subtitle}</p>

        {/* 4-Item Performance Metrics Grid */}
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-val" style={{ color: 'var(--success)' }}>{score}</div>
            <div className="stat-title">Correct</div>
          </div>
          <div className="stat-box">
            <div className="stat-val" style={{ color: 'var(--danger)' }}>{incorrectCount}</div>
            <div className="stat-title">Incorrect</div>
          </div>
          <div className="stat-box">
            <div className="stat-val">{formatTime(timeSpentSeconds)}</div>
            <div className="stat-title">Time Spent</div>
          </div>
          <div className="stat-box">
            <div className="stat-val" style={{ color: isPass ? 'var(--success)' : 'var(--danger)' }}>
              {isPass ? 'Passed' : 'Review'}
            </div>
            <div className="stat-title">Status</div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn-secondary" onClick={onRetake}>
            <RefreshIcon size={15} />
            <span>Retake quiz</span>
          </button>
          <button className="btn-primary" onClick={onBackToBrowse}>
            <ArrowLeftIcon size={15} />
            <span>Back to quizzes</span>
          </button>
        </div>
      </div>

      {/* Review Section Header & Filtering */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Answer Breakdown</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Review your answers with concept explanations.
          </p>
        </div>

        {/* Review Filter Chips */}
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button
            className={`chip-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All ({breakdown.length})
          </button>
          <button
            className={`chip-btn ${filterType === 'wrong' ? 'active' : ''}`}
            onClick={() => setFilterType('wrong')}
          >
            Incorrect ({incorrectCount})
          </button>
          <button
            className={`chip-btn ${filterType === 'correct' ? 'active' : ''}`}
            onClick={() => setFilterType('correct')}
          >
            Correct ({score})
          </button>
        </div>
      </div>

      {/* Breakdown Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredBreakdown.length === 0 ? (
          <div className="empty-state" style={{ padding: '3rem 1rem' }}>
            <h4 style={{ fontWeight: 800 }}>No questions match this filter</h4>
          </div>
        ) : (
          filteredBreakdown.map((item, index) => {
            const isCorrect = item.isCorrect;
            return (
              <div key={index} className={`review-card ${isCorrect ? 'correct' : 'wrong'}`}>
                <div className="review-header">
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Question #{item.questionIndex !== undefined ? item.questionIndex + 1 : index + 1}
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      background: isCorrect ? 'var(--success-light)' : 'var(--danger-light)',
                      color: isCorrect ? '#065f46' : '#991b1b',
                      border: `1px solid ${isCorrect ? 'var(--success-border)' : 'var(--danger-border)'}`
                    }}
                  >
                    {isCorrect ? (
                      <>
                        <CheckIcon size={14} />
                        <span>Correct Answer</span>
                      </>
                    ) : (
                      <>
                        <CrossIcon size={14} />
                        <span>Incorrect</span>
                      </>
                    )}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.15rem', color: 'var(--text-main)' }}>
                  {item.questionText}
                </h4>

                {/* Options List Review */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {item.options.map((opt, optIdx) => {
                    const isUserSelection = item.selectedOptionIndex === optIdx;
                    const isCorrectAnswer = item.correctOptionIndex === optIdx;

                    let rowBorder = '1.5px solid var(--border)';
                    let rowBg = '#ffffff';
                    let badgeColor = '#64748b';
                    let badgeBg = 'var(--bg-muted)';

                    if (isCorrectAnswer) {
                      rowBorder = '2px solid #10b981';
                      rowBg = '#ecfdf5';
                      badgeBg = '#10b981';
                      badgeColor = '#ffffff';
                    } else if (isUserSelection && !isCorrect) {
                      rowBorder = '2px solid #f43f5e';
                      rowBg = '#fff1f2';
                      badgeBg = '#f43f5e';
                      badgeColor = '#ffffff';
                    }

                    return (
                      <div
                        key={optIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.85rem',
                          padding: '0.85rem 1.15rem',
                          borderRadius: 'var(--radius-md)',
                          border: rowBorder,
                          background: rowBg,
                          fontSize: '0.96rem',
                          fontWeight: isCorrectAnswer || isUserSelection ? 700 : 500,
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            background: badgeBg,
                            color: badgeColor,
                            flexShrink: 0
                          }}
                        >
                          {optionLetters[optIdx]}
                        </span>
                        
                        <span style={{ flexGrow: 1 }}>{opt}</span>

                        {isCorrectAnswer && (
                          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#047857', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            ✓ Correct Choice
                          </span>
                        )}

                        {isUserSelection && !isCorrect && (
                          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            ✗ Your Selection
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Callout */}
                {item.explanation && (
                  <div className="review-explanation">
                    <InfoIcon size={18} className="text-primary" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--text-main)', fontSize: '0.88rem' }}>
                        Pedagogical Concept Explanation:
                      </strong>
                      <span>{item.explanation}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
