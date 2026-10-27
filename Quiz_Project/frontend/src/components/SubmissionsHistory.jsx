import React, { useEffect, useState } from 'react';
import { TrophyIcon, RefreshIcon, TimerIcon, UserIcon } from './Icons';
import { fetchSubmissions } from '../services/api';

export default function SubmissionsHistory({ currentUser }) {
  const isTeacher = currentUser?.role === 'teacher';
  const [submissions, setSubmissions] = useState([]);
  const [viewMode, setViewMode] = useState('mine'); // 'mine' | 'all' (only teacher can switch to 'all')
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSubmissions = async (mode = viewMode) => {
    try {
      setLoading(true);
      // Students ALWAYS fetch only their own respective submissions
      const activeMode = isTeacher ? mode : 'mine';
      const res = await fetchSubmissions({
        mine: activeMode === 'mine',
        view: activeMode
      });
      setSubmissions(res.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch your quiz submissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions(viewMode);
  }, [viewMode, currentUser]);

  const handleTabChange = (mode) => {
    if (!isTeacher && mode !== 'mine') return;
    setViewMode(mode);
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateString) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto 5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            {viewMode === 'mine'
              ? (isTeacher ? 'My Quiz Attempts' : 'My Quiz Results & History')
              : 'Class Student Submissions'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {viewMode === 'mine'
              ? `Personal quiz attempts for ${currentUser?.name || 'your account'}.`
              : 'All completed student quizzes across classes.'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Teachers can toggle between their own attempts and class-wide student submissions */}
          {isTeacher && (
            <div style={{ display: 'flex', background: 'var(--bg-muted)', padding: '0.25rem', borderRadius: 'var(--radius-full)' }}>
              <button
                className={`chip-btn ${viewMode === 'mine' ? 'active' : ''}`}
                onClick={() => handleTabChange('mine')}
                style={{ fontSize: '0.82rem' }}
              >
                My Attempts
              </button>
              <button
                className={`chip-btn ${viewMode === 'all' ? 'active' : ''}`}
                onClick={() => handleTabChange('all')}
                style={{ fontSize: '0.82rem' }}
              >
                Class Submissions
              </button>
            </div>
          )}

          <button className="btn-secondary" onClick={() => loadSubmissions(viewMode)} style={{ fontSize: '0.88rem' }}>
            <RefreshIcon size={15} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <div className="status-dot" style={{ margin: '0 auto 1rem', width: '10px', height: '10px', background: 'var(--primary)' }}></div>
          <p style={{ fontWeight: 600 }}>Loading your personal quiz history...</p>
        </div>
      ) : error ? (
        <div style={{ color: 'var(--danger)', padding: '1.5rem', textAlign: 'center', fontWeight: 700 }}>
          {error}
        </div>
      ) : submissions.length === 0 ? (
        <div className="empty-state">
          <TrophyIcon size={54} className="empty-icon" />
          <h3 className="empty-title">
            {viewMode === 'mine'
              ? `No Quiz Attempts Recorded for ${currentUser?.name || 'You'}`
              : 'No Student Attempts Recorded Yet'}
          </h3>
          <p className="empty-desc">
            {viewMode === 'mine'
              ? 'You have not submitted any quizzes yet. Head over to the Explore tab to take a quiz and your score will be saved here!'
              : 'No students have completed any tests yet.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
          {submissions.map((sub, idx) => {
            const isGood = sub.percentage >= 70;
            return (
              <div
                key={sub._id || idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem 1.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-main)' }}>
                      {sub.quizTitle}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      • {formatDate(sub.createdAt)}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', display: 'flex', gap: '1.25rem', fontWeight: 500, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <UserIcon size={14} />
                      <span>{sub.userName} {sub.userRole === 'teacher' && '(Teacher)'}</span>
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <TimerIcon size={14} />
                      <span>{formatTime(sub.timeSpentSeconds)}</span>
                    </span>
                    <span>Score: {sub.score} / {sub.totalQuestions}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: '1.45rem',
                      fontWeight: 800,
                      fontFamily: 'JetBrains Mono, monospace',
                      color: isGood ? 'var(--success)' : 'var(--warning)'
                    }}
                  >
                    {sub.percentage}%
                  </div>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: isGood ? 'var(--success)' : 'var(--text-muted)'
                    }}
                  >
                    {isGood ? 'Passed' : 'Completed'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
