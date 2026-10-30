import { useState } from 'react';
import { Icon } from '../components';
import { categoryMeta } from '../constants/categories.js';
import { timeAgo } from '../utils/time.js';

export function RateScreen({ complaint, onBack, onSubmitRating }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  if (!complaint) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (rating === 0) {
      setError('Select a star rating before submitting');
      return;
    }
    setError('');
    onSubmitRating(complaint.id, rating, comment);
  };

  return (
    <main className="content page-content rate-content">
      <div className="page-back-row">
        <button className="text-back" onClick={onBack}>
          <span aria-hidden="true">←</span> Back to report
        </button>
      </div>
      <div className="page-intro">
        <div>
          <p className="eyebrow">Resident feedback</p>
          <h1>Rate the resolution</h1>
          <p className="page-subtitle">
            Your feedback helps the city understand how reported issues are being resolved.
          </p>
        </div>
      </div>
      <form className="card rating-form" onSubmit={handleSubmit}>
        <div className="rating-report-summary">
          <span className="report-category-icon">
            <Icon name={categoryMeta(complaint.category).icon} size={25} />
          </span>
          <div>
            <strong>{categoryMeta(complaint.category).label}</strong>
            <span>
              {complaint.ticketId || complaint.id} · resolved{' '}
              {complaint.resolvedAt ? timeAgo(complaint.resolvedAt) : ''}
            </span>
          </div>
        </div>
        {complaint.photo && (
          <img
            className="rating-photo"
            src={complaint.photo}
            alt={`Submitted photo for ${categoryMeta(complaint.category).label.toLowerCase()} report`}
          />
        )}
        <fieldset className="rating-fieldset">
          <legend>How satisfied are you with the resolution?</legend>
          <div className="star-row" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className={`star-btn ${n <= rating ? 'filled' : ''}`}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} ${n === 1 ? 'star' : 'stars'}`}
                onClick={() => {
                  setRating(n);
                  setError('');
                }}
              >
                ★
              </button>
            ))}
          </div>
          <div className="rating-caption">{rating ? `${rating} out of 5` : 'Choose a rating'}</div>
        </fieldset>
        {error && (
          <div className="error-text" role="alert">
            {error}
          </div>
        )}
        <label className="field-label" htmlFor="rating-comment">
          Additional feedback <span className="optional-label">Optional</span>
        </label>
        <textarea
          id="rating-comment"
          className="field-textarea"
          placeholder="Share anything about the resolution that you would like the city to know."
          maxLength={500}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
        <div className="field-helper">{comment.length}/500 characters</div>
        <button className="btn btn-primary" type="submit">
          <Icon name="check" size={17} /> Submit rating
        </button>
      </form>
    </main>
  );
}
