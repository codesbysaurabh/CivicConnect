import { useState } from 'react';
import { Icon } from '../components';
import { categoryMeta } from '../constants/categories.js';
import { timeAgo } from '../utils/time.js';

export function RateScreen({ complaint, onBack, onSubmitRating }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  if (!complaint) return null;

  const handleSubmit = () => {
    if (rating === 0) {
      setError('Select a star rating before submitting');
      return;
    }
    setError('');
    onSubmitRating(complaint.id, rating);
  };

  return (
    <>
      <div className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          ←
        </button>
        <div className="topbar-title">Rate resolution</div>
        <div style={{ width: 34 }}></div>
      </div>
      <div className="content">
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>
            <Icon name={categoryMeta(complaint.category).icon} size={36} />
          </div>
          <h2 style={{ marginBottom: 2 }}>{categoryMeta(complaint.category).label}</h2>
          <p className="muted" style={{ marginBottom: '1.2rem' }}>
            {complaint.id} · marked resolved{' '}
            {complaint.resolvedAt ? timeAgo(complaint.resolvedAt) : ''}
          </p>
          <p style={{ fontSize: 14, marginBottom: 0 }}>How was the resolution handled?</p>
          <div className="star-row">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className={`star-btn ${n <= rating ? 'filled' : ''}`}
                onClick={() => setRating(n)}
                aria-label={`${n} star`}
              >
                ★
              </button>
            ))}
          </div>
          {error && (
            <div className="error-text" style={{ marginTop: -8 }}>
              {error}
            </div>
          )}
          <textarea
            className="field-textarea"
            placeholder="Any comments about how it was resolved? (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit rating
          </button>
        </div>
      </div>
    </>
  );
}
