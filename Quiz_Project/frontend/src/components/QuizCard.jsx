import React from 'react';
import { PlayIcon, TimerIcon, BookOpenIcon, TrashIcon } from './Icons';

export default function QuizCard({ quiz, onStart, onDelete, currentUser }) {
  const difficultyMap = {
    Easy: { class: 'badge-easy', dotClass: 'easy' },
    Medium: { class: 'badge-medium', dotClass: 'medium' },
    Hard: { class: 'badge-hard', dotClass: 'hard' }
  };

  const diffConfig = difficultyMap[quiz.difficulty] || difficultyMap.Medium;
  const isTeacher = currentUser && currentUser.role === 'teacher';

  return (
    <div className="quiz-card">
      <div className="card-top">
        <span className="badge badge-category">{quiz.category}</span>
        <span className={`badge ${diffConfig.class}`}>
          <span className={`diff-dot ${diffConfig.dotClass}`}></span>
          <span>{quiz.difficulty}</span>
        </span>
      </div>

      <h3 className="quiz-card-title">{quiz.title}</h3>
      <p className="quiz-card-desc">
        {quiz.description || 'Test your understanding and reinforce key concepts with this interactive challenge.'}
      </p>

      <div className="card-meta">
        <div className="meta-item">
          <BookOpenIcon size={15} className="text-muted" />
          <span>{quiz.questionCount} {quiz.questionCount === 1 ? 'Question' : 'Questions'}</span>
        </div>
        <div className="meta-item">
          <TimerIcon size={15} className="text-muted" />
          <span>{quiz.timeLimit} Mins</span>
        </div>
      </div>

      <div className="card-actions">
        <button className="btn-primary" onClick={() => onStart(quiz._id)}>
          <PlayIcon size={13} />
          <span>Start Quiz</span>
        </button>

        {isTeacher && (
          <button
            className="btn-delete"
            onClick={() => onDelete(quiz._id, quiz.title)}
            title="Delete quiz (Teacher role)"
          >
            <TrashIcon size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
