import { Icon, StatusBadge } from '../components';
import { SCREENS } from '../constants/screens.js';
import { categoryMeta } from '../constants/categories.js';
import { timeAgo } from '../utils/time.js';

export function HomeScreen({
  complaints,
  myReports = [],
  onOpen,
  onNavigate,
  user,
  canCreateReports = true,
}) {
  const recent = complaints.slice(0, 6);
  const displayName = user?.name || user?.email?.split('@')[0] || 'there';
  const isAdmin = user?.role === 'admin';
  const overview = isAdmin ? complaints : myReports;
  const activeCount = overview.filter((item) => item.status !== 'resolved').length;
  const resolvedCount = overview.filter((item) => item.status === 'resolved').length;
  return (
    <>
      <main className="content home-content">
        <div className="page-intro">
          <div>
            <p className="eyebrow">{isAdmin ? 'Municipal overview' : 'Your community'}</p>
            <h1>Welcome back, {displayName}</h1>
            <p className="page-subtitle">
              {isAdmin
                ? 'Recent reports shared with CivicConnect.'
                : 'See local reports and follow the issues you have submitted.'}
            </p>
          </div>
          {canCreateReports && (
            <button
              className="btn btn-primary home-report-cta"
              onClick={() => onNavigate(SCREENS.REPORT)}
            >
              <Icon name="plus" size={18} /> Report an issue
            </button>
          )}
        </div>
        <div className="home-summary-grid" aria-label="Report summary">
          <div className="home-summary-card">
            <span>{isAdmin ? 'Reports in feed' : 'My reports'}</span>
            <strong>{overview.length}</strong>
          </div>
          <div className="home-summary-card">
            <span>Open reports</span>
            <strong>{activeCount}</strong>
          </div>
          <div className="home-summary-card">
            <span>Resolved</span>
            <strong>{resolvedCount}</strong>
          </div>
        </div>
        {canCreateReports && (
          <div className="home-report-prompt">
            <span className="home-prompt-icon">
              <Icon name="camera" size={22} />
            </span>
            <div>
              <strong>Something needs attention?</strong>
              <span>Share a photo and a short description to submit a report.</span>
            </div>
            <button className="btn btn-outline" onClick={() => onNavigate(SCREENS.REPORT)}>
              Start a report <Icon name="arrow" size={16} />
            </button>
          </div>
        )}

        <div className="section-heading">
          <div>
            <h2>Recent reports</h2>
            <p className="muted">Latest issues reported in your community</p>
          </div>
        </div>

        {recent.length === 0 ? (
          <div className="empty-state card">
            <div className="big-icon">
              <Icon name="inbox" size={40} />
            </div>
            <strong>No reports to show yet</strong>
            <p className="muted">New community reports will appear here.</p>
          </div>
        ) : (
          <div className="report-card-list">
            {recent.map((c) => (
              <button
                type="button"
                key={c.id}
                className="card report-card report-card-button"
                onClick={() => onOpen(c.id)}
              >
                {c.photo && <img className="report-card-photo" src={c.photo} alt="" />}
                <div className="report-card-body">
                  <div className="row-between" style={{ marginBottom: 8 }}>
                    <div className="flex-gap">
                      <span className="report-category-icon">
                        <Icon name={categoryMeta(c.category).icon} size={22} />
                      </span>
                      <div>
                        <div className="report-card-title">{categoryMeta(c.category).label}</div>
                        <div className="report-card-meta">
                          {c.ticketId || c.id} · {timeAgo(c.createdAt)}
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                  <div className="muted report-location">{c.location || c.description}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
