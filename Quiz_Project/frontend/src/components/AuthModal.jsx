import React, { useState } from 'react';
import { CrossIcon, LogoIcon, AcademicCapIcon, TeacherIcon } from './Icons';
import { loginApi, registerApi } from '../services/api';

export default function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'login', initialRole = 'student' }) {
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      let res;
      if (mode === 'login') {
        res = await loginApi({ email, password });
      } else {
        if (!name.trim()) {
          throw new Error('Please enter your full name.');
        }
        res = await registerApi({ name, email, password, role });
      }

      onSuccess(res.user);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoRole) => {
    setErrorMsg('');
    setLoading(true);

    const credentials = demoRole === 'teacher'
      ? { email: 'teacher@demo.com', password: 'teacher123' }
      : { email: 'student@demo.com', password: 'student123' };

    try {
      let res;
      try {
        res = await loginApi(credentials);
      } catch {
        const demoData = demoRole === 'teacher'
          ? { name: 'Prof. Sarah Smith', email: 'teacher@demo.com', password: 'teacher123', role: 'teacher' }
          : { name: 'Alex Johnson', email: 'student@demo.com', password: 'student123', role: 'student' };
        res = await registerApi(demoData);
      }

      onSuccess(res.user);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="logo-badge" style={{ width: '32px', height: '32px' }}>
              <LogoIcon size={16} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              {mode === 'login' ? 'Sign in to QuizPortal' : 'Create an account'}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '0.25rem'
            }}
          >
            <CrossIcon size={16} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-muted)',
            padding: '3px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.25rem',
            border: '1px solid var(--border)'
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: 'calc(var(--radius-sm) - 2px)',
              border: 'none',
              background: mode === 'login' ? '#ffffff' : 'transparent',
              color: mode === 'login' ? 'var(--text-main)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: mode === 'login' ? 'var(--shadow-xs)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: 'calc(var(--radius-sm) - 2px)',
              border: 'none',
              background: mode === 'register' ? '#ffffff' : 'transparent',
              color: mode === 'register' ? 'var(--text-main)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: mode === 'register' ? 'var(--shadow-xs)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Create account
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              background: 'var(--danger-light)',
              color: '#991b1b',
              border: '1px solid var(--danger-border)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.25rem',
              fontSize: '0.86rem',
              fontWeight: 600
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Account type</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <div
                    onClick={() => setRole('student')}
                    style={{
                      border: `1.5px solid ${role === 'student' ? 'var(--primary)' : 'var(--border)'}`,
                      background: role === 'student' ? 'var(--primary-light)' : '#ffffff',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.75rem 0.5rem',
                      cursor: 'pointer',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.3rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <AcademicCapIcon size={18} className={role === 'student' ? 'text-primary' : 'text-muted'} />
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: role === 'student' ? 'var(--primary)' : 'var(--text-main)' }}>
                      Student
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Take tests & practice
                    </div>
                  </div>

                  <div
                    onClick={() => setRole('teacher')}
                    style={{
                      border: `1.5px solid ${role === 'teacher' ? 'var(--primary)' : 'var(--border)'}`,
                      background: role === 'teacher' ? 'var(--primary-light)' : '#ffffff',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.75rem 0.5rem',
                      cursor: 'pointer',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.3rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <TeacherIcon size={18} className={role === 'teacher' ? 'text-primary' : 'text-muted'} />
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: role === 'teacher' ? 'var(--primary)' : 'var(--text-main)' }}>
                      Teacher
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Create & manage quizzes
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.92rem' }}
            disabled={loading}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : `Create ${role === 'teacher' ? 'Teacher' : 'Student'} account`}
          </button>
        </form>

        {/* 1-Click Demo Accounts */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
            Quick demo login
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ fontSize: '0.82rem', padding: '0.55rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
              onClick={() => handleDemoLogin('student')}
              disabled={loading}
            >
              <AcademicCapIcon size={15} />
              <span>Student demo</span>
            </button>

            <button
              type="button"
              className="btn-secondary"
              style={{ fontSize: '0.82rem', padding: '0.55rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
              onClick={() => handleDemoLogin('teacher')}
              disabled={loading}
            >
              <TeacherIcon size={15} />
              <span>Teacher demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
