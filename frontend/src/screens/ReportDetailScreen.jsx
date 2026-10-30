import { Icon, StatusBadge } from '../components';
import { categoryMeta } from '../constants/categories.js';
import { timeAgo } from '../utils/time.js';

export function ReportDetailScreen({ complaint, onBack, onRate, canRate = true }) {
  if (!complaint)
    return (
      <main className="content page-content">
        <div className="empty-state card">
          <strong>Report not found</strong>
          <button className="btn btn-outline" onClick={onBack}>
            Back to reports
          </button>
        </div>
      </main>
    );
  const cat = categoryMeta(complaint.category);

  return (
    <main className="content page-content detail-content">
      <div className="page-back-row">
        <button className="text-back" onClick={onBack}>
          <span aria-hidden="true">←</span> Back to my reports
        </button>
        <div className="detail-status">
          <span className="ticket-label">Ticket #{complaint.ticketId || complaint.id}</span>
          <StatusBadge status={complaint.status} />
        </div>
      </div>
      <section className="detail-overview card">
        <div className="detail-meta">
          <span>
            <Icon name="calendar" size={15} /> Submitted {timeAgo(complaint.createdAt)}
          </span>
          {complaint.location && (
            <span>
              <Icon name="pin" size={15} /> {complaint.location}
            </span>
          )}
        </div>
        <h1>{cat.label}</h1>
        <p className="page-subtitle">
          {complaint.description || 'No description was added to this report.'}
        </p>
        <div className="progress-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Report progress</p>
              <h2>Current status</h2>
            </div>
            <StatusBadge status={complaint.status} />
          </div>
          <div className="progress-steps">
            {(complaint.timeline || []).map((event, index) => (
              <div
                className={`progress-step ${event.done ? 'complete' : ''}`}
                key={`${event.status || event.label}-${index}`}
              >
                <span className="progress-step-marker">{event.done ? '✓' : index + 1}</span>
                <span className="progress-step-copy">
                  <strong>{event.label}</strong>
                  <small>{event.time}</small>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="detail-grid">
        <section className="card detail-evidence">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Submitted evidence</p>
              <h2>Issue photo</h2>
            </div>
          </div>
          {complaint.photo ? (
            <img
              className="detail-photo"
              src={complaint.photo}
              alt={`Submitted photo for ${cat.label.toLowerCase()} report`}
            />
          ) : (
            <div className="detail-photo-placeholder">
              <Icon name={cat.icon} size={42} />
            </div>
          )}
        </section>
        <aside className="detail-side">
          <section className="card detail-facts">
            <p className="eyebrow">Report details</p>
            <dl>
              <div>
                <dt>Category</dt>
                <dd>{cat.label}</dd>
              </div>
              <div>
                <dt>Ticket</dt>
                <dd>{complaint.ticketId || complaint.id}</dd>
              </div>
              <div>
                <dt>Submitted</dt>
                <dd>{new Date(complaint.createdAt).toLocaleDateString()}</dd>
              </div>
              {complaint.location && (
                <div>
                  <dt>Location</dt>
                  <dd>{complaint.location}</dd>
                </div>
              )}
              {complaint.assignedTo && (
                <div>
                  <dt>Assigned worker</dt>
                  <dd>{complaint.assignedTo}</dd>
                </div>
              )}
            </dl>
          </section>
          {canRate && complaint.status === 'resolved' && complaint.rating == null && (
            <section className="card rating-callout">
              <Icon name="star" size={20} />
              <div>
                <strong>How was the resolution?</strong>
                <p className="muted">Share feedback after reviewing the completed work.</p>
                <button className="btn btn-primary" onClick={() => onRate(complaint.id)}>
                  Rate this resolution
                </button>
              </div>
            </section>
          )}
          {complaint.status === 'resolved' && complaint.rating != null && (
            <section className="card rating-callout">
              <Icon name="star" size={20} />
              <div>
                <strong>Your rating</strong>
                <p className="rating-display" aria-label={`${complaint.rating} out of 5 stars`}>
                  {'★'.repeat(complaint.rating)}
                  {'☆'.repeat(5 - complaint.rating)}
                </p>
                {complaint.ratingComment && <p className="muted">{complaint.ratingComment}</p>}
              </div>
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}
