import React from 'react';
import { DatabaseIcon, CrossIcon } from './Icons';

export default function DbStatusModal({ dbStatus, onClose }) {
  const isConnected = dbStatus?.status?.isConnected;
  const uri = dbStatus?.status?.uri;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <DatabaseIcon size={20} className="text-primary" />
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Database Configuration</h3>
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

        {/* Current Status Pill Card */}
        <div
          style={{
            padding: '1.15rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
            background: isConnected ? 'var(--success-light)' : 'var(--warning-light)',
            border: `1px solid ${isConnected ? 'var(--success-border)' : 'var(--warning-border)'}`
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.98rem', color: isConnected ? '#065f46' : '#92400e' }}>
            <span>{isConnected ? 'Connected to MongoDB' : 'Running in In-Memory Fallback Mode'}</span>
          </div>
          <p style={{ marginTop: '0.35rem', fontSize: '0.86rem', color: isConnected ? '#047857' : '#78350f', lineHeight: 1.5 }}>
            {isConnected
              ? `Connected to database: ${uri || 'Active MongoDB URI'}. Quizzes and user submissions are persistently stored.`
              : `MongoDB was not detected at startup. The application is running using a local session store.`}
          </p>
        </div>

        {/* Guide on Connecting MongoDB */}
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Connecting MongoDB (Atlas or Local):
        </h4>

        <div style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Option A: MongoDB Atlas Cloud:</strong>
            <br />
            Set connection string in <code>server/.env</code>:
          </p>
          <div className="code-snippet">
            MONGODB_URI=mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.mongodb.net/quiz_portal
          </div>

          <p style={{ marginTop: '0.85rem', marginBottom: '0.5rem' }}>
            <strong>Option B: Local MongoDB Server:</strong>
            <br />
            In <code>server/.env</code>:
          </p>
          <div className="code-snippet">
            MONGODB_URI=mongodb://127.0.0.1:27017/quiz_portal
          </div>

          <p style={{ marginTop: '0.85rem' }}>
            <strong>Populate sample quizzes:</strong>
          </p>
          <div className="code-snippet">
            npm run seed
          </div>
        </div>

        <button className="btn-primary" style={{ width: '100%' }} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
