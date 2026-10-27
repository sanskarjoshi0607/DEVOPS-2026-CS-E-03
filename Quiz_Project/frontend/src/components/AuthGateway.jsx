import React, { useState } from 'react';
import { loginApi, registerApi } from '../services/api';
import { LogoIcon, AcademicCapIcon, TeacherIcon } from './Icons';

export default function AuthGateway({ onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState('student'); // 'student' | 'teacher'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

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

      onLoginSuccess(res.user);
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
        // Register demo user on the fly if not in database yet
        const demoData = demoRole === 'teacher'
          ? { name: 'Prof. Sarah Smith', email: 'teacher@demo.com', password: 'teacher123', role: 'teacher' }
          : { name: 'Alex Johnson', email: 'student@demo.com', password: 'student123', role: 'student' };
        res = await registerApi(demoData);
      }

      onLoginSuccess(res.user);
    } catch (err) {
      setErrorMsg(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '4rem auto 6rem', padding: '0 1rem' }}>
      {/* Gateway Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div
          className="logo-badge"
          style={{ width: '44px', height: '44px', margin: '0 auto 1rem', borderRadius: 'var(--radius-sm)' }}
        >
          <LogoIcon size={22} />
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
          QuizPortal
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.5 }}>
          {mode === 'login'
            ? 'Sign in to access your quizzes and score history.'
            : 'Create an account to start taking or creating quizzes.'}
        </p>
      </div>

      {/* Main Authentication Card */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-muted)',
            padding: '3px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
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
              padding: '0.55rem',
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
              padding: '0.55rem',
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

        {/* Authentication Form */}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              {/* Role Selection */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Account type</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  {/* Student Option */}
                  <div
                    onClick={() => setRole('student')}
                    style={{
                      border: `1.5px solid ${role === 'student' ? 'var(--primary)' : 'var(--border)'}`,
                      background: role === 'student' ? 'var(--primary-light)' : '#ffffff',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.85rem 0.65rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem',
                      textAlign: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <AcademicCapIcon size={20} className={role === 'student' ? 'text-primary' : 'text-muted'} />
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: role === 'student' ? 'var(--primary)' : 'var(--text-main)' }}>
                      Student
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Take tests & practice
                    </div>
                  </div>

                  {/* Teacher Option */}
                  <div
                    onClick={() => setRole('teacher')}
                    style={{
                      border: `1.5px solid ${role === 'teacher' ? 'var(--primary)' : 'var(--border)'}`,
                      background: role === 'teacher' ? 'var(--primary-light)' : '#ffffff',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.85rem 0.65rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem',
                      textAlign: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <TeacherIcon size={20} className={role === 'teacher' ? 'text-primary' : 'text-muted'} />
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: role === 'teacher' ? 'var(--primary)' : 'var(--text-main)' }}>
                      Teacher
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Author & manage quizzes
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
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.75rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
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
