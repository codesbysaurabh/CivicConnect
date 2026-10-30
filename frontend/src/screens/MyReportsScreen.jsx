import { useState } from 'react';
import { Icon, StatusBadge } from '../components';
import { categoryMeta } from '../constants/categories.js';
import { timeAgo } from '../utils/time.js';

export function MyReportsScreen({ complaints, onOpen }) {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? complaints : complaints.filter((c) => c.status === filter);
  const filters = [
    { id: 'all', label: 'All reports' },
    { id: 'submitted', label: 'Submitted' },
    { id: 'progress', label: 'In progress' },
    { id: 'resolved', label: 'Resolved' },
  ];

  return (
    <main className="content page-content">
      <div className="page-intro">
        <div>
          <p className="eyebrow">Resident portal</p>
          <h1>My reports</h1>
          <p className="page-subtitle">
            Track the reports you have submitted and see their latest status.
          </p>
        </div>
        <span className="report-total">
          {complaints.length} {complaints.length === 1 ? 'report' : 'reports'}
        </span>
      </div>

      <div className="filter-row" role="group" aria-label="Filter reports by status">
        {filters.map((f) => (
          <button
            key={f.id}
            className={`filter-chip ${filter === f.id ? 'selected' : ''}`}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
            {f.id === 'all' && <span>{complaints.length}</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state card">
          <div className="big-icon">
            <Icon name="inbox" size={40} />
          </div>
          <strong>
            {complaints.length
              ? 'No reports match this filter'
              : 'You have not submitted a report yet'}
          </strong>
          <p className="muted">Your reports and their progress will appear here.</p>
        </div>
      ) : (
        <div className="report-card-list">
          {filtered.map((c) => (
            <button
              key={c.id}
              className="card report-card report-card-button"
              onClick={() => onOpen(c.id)}
            >
              {c.photo && <img className="report-card-photo" src={c.photo} alt="" />}
              <span className="report-card-body">
                <span className="row-between report-card-top">
                  <span className="report-card-heading">
                    <span className="report-category-icon">
                      <Icon name={categoryMeta(c.category).icon} size={22} />
                    </span>
                    <span>
                      <strong className="report-card-title">
                        {categoryMeta(c.category).label}
                      </strong>
                      <span className="report-card-meta">
                        {c.ticketId || c.id} · {timeAgo(c.createdAt)}
                      </span>
                    </span>
                  </span>
                  <StatusBadge status={c.status} />
                </span>
                <span className="muted report-location">{c.description || c.location}</span>
                {c.status === 'resolved' && c.rating == null && (
                  <span className="rate-reminder">
                    <Icon name="star" size={15} /> Rate this resolution
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
