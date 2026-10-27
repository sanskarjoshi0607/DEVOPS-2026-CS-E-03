import React from 'react';
import { SearchIcon, CrossIcon } from './Icons';

export default function FilterBar({
  categories = [],
  selectedCategory,
  onSelectCategory,
  selectedDifficulty,
  onSelectDifficulty,
  searchTerm,
  onSearchChange,
  quizCount
}) {
  return (
    <div className="filter-card">
      {/* Search Input with Clear Button */}
      <div className="search-input-wrapper">
        <SearchIcon size={18} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search quizzes by title, topic, or keyword..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button
            className="search-clear-btn"
            onClick={() => onSearchChange('')}
            title="Clear search"
          >
            <CrossIcon size={14} />
          </button>
        )}
      </div>

      <div className="filter-row">
        {/* Category Pills */}
        <div className="category-chips">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`chip-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Difficulty Dropdown & Count Tag */}
        <div className="filter-controls-right">
          <select
            className="difficulty-select"
            value={selectedDifficulty}
            onChange={(e) => onSelectDifficulty(e.target.value)}
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <span className="quiz-counter-tag">
            {quizCount} {quizCount === 1 ? 'quiz' : 'quizzes'}
          </span>
        </div>
      </div>
    </div>
  );
}
