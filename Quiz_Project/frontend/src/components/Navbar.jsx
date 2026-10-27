import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BookOpenIcon, PlusIcon, TrophyIcon, DatabaseIcon, LogoIcon } from './Icons';

export default function Navbar({
  dbStatus,
  onOpenDbModal,
  currentUser,
  onOpenAuthModal,
  onLogout
}) {
  const navigate = useNavigate();
  const isConnected = dbStatus?.status?.isConnected;

  return (
    <header className="navbar">
      <div className="container nav-container">
        {/* Brand Logo */}
        <div className="brand-logo" onClick={() => navigate(currentUser ? '/quizzes' : '/login')}>
          <div className="logo-badge">
            <LogoIcon size={18} />
          </div>
          <span className="brand-title">Quiz<span className="brand-accent">Portal</span></span>
        </div>

        {/* Navigation Tabs (Only visible when logged in) */}
        {currentUser && (
          <nav className="nav-tabs">
            <NavLink
              to="/quizzes"
              className={({ isActive }) => `nav-tab-btn ${isActive ? 'active' : ''}`}
            >
              <BookOpenIcon size={15} />
              <span>Quizzes</span>
            </NavLink>

            {currentUser.role === 'teacher' && (
              <NavLink
                to="/create"
                className={({ isActive }) => `nav-tab-btn ${isActive ? 'active' : ''}`}
              >
                <PlusIcon size={15} />
                <span>New Quiz</span>
              </NavLink>
            )}

            <NavLink
              to="/scores"
              className={({ isActive }) => `nav-tab-btn ${isActive ? 'active' : ''}`}
            >
              <TrophyIcon size={15} />
              <span>{currentUser.role === 'teacher' ? 'Submissions' : 'My History'}</span>
            </NavLink>
          </nav>
        )}

        {/* Right Section: Database Status & User Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Database Status Pill */}
          <button
            className={`status-pill ${isConnected ? 'connected' : 'fallback'}`}
            onClick={onOpenDbModal}
            title="Database status"
          >
            <span className="status-dot"></span>
            <DatabaseIcon size={13} />
            <span>{isConnected ? 'Atlas Connected' : 'Local Store'}</span>
          </button>

          {/* User Profile / Auth Button */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  padding: '0.3rem 0.75rem 0.3rem 0.45rem',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                {/* Avatar Initial Circle */}
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: currentUser.role === 'teacher' ? '#334155' : '#0f766e',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.78rem'
                  }}
                >
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', lineHeight: 1 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {currentUser.name}
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      background: 'var(--bg-muted)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: 'var(--radius-xs)',
                      textTransform: 'capitalize'
                    }}
                  >
                    {currentUser.role}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                className="btn-secondary"
                onClick={onLogout}
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
                title="Sign out of your account"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              className="btn-primary"
              onClick={onOpenAuthModal}
              style={{ padding: '0.5rem 1rem', fontSize: '0.88rem' }}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
