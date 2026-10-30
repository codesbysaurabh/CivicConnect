import { useState } from 'react';
import { Icon, StatusBadge } from '../components';
import { categoryMeta } from '../constants/categories.js';
import { STATUS_OPTIONS } from '../constants/status.js';
import { timeAgo } from '../utils/time.js';

const TABS = [
  { id: 'complaints', label: 'Complaints', icon: 'clipboard' },
  { id: 'workers', label: 'Field workers', icon: 'worker' },
  { id: 'reports', label: 'Reports', icon: 'chart' },
];

export function AdminScreen({
  complaints,
  workers,
  onUpdateStatus,
  onCreateWorker,
  onExitAdmin,
  onLogout,
}) {
  const [filter, setFilter] = useState('all');
  const [section, setSection] = useState('complaints');
  const [selectedId, setSelectedId] = useState(null);
  const [workerName, setWorkerName] = useState('');
  const [workerArea, setWorkerArea] = useState('');
  const [workerPhone, setWorkerPhone] = useState('');
  const [savingWorker, setSavingWorker] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('submitted');
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [savingComplaint, setSavingComplaint] = useState(false);

  const filtered = (filter === 'all' ? complaints : complaints.filter((c) => c.status === filter))
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const selected = complaints.find((complaint) => complaint.id === selectedId);
  const resolvedComplaints = complaints.filter((complaint) => complaint.status === 'resolved');
  const ratedComplaints = complaints.filter((complaint) => complaint.rating != null);
  const averageRating = ratedComplaints.length
    ? ratedComplaints.reduce((total, complaint) => total + complaint.rating, 0) /
      ratedComplaints.length
    : null;
  const resolutionRate = complaints.length
    ? Math.round((resolvedComplaints.length / complaints.length) * 100)
    : 0;
  const statusBreakdown = [
    { id: 'submitted', label: 'Submitted' },
    { id: 'progress', label: 'In progress' },
    { id: 'resolved', label: 'Resolved' },
  ].map((status) => ({
    ...status,
    count: complaints.filter((complaint) => complaint.status === status.id).length,
  }));
  const categoryBreakdown = Object.entries(
    complaints.reduce((counts, complaint) => {
      counts[complaint.category] = (counts[complaint.category] || 0) + 1;
      return counts;
    }, {})
  )
    .map(([id, count]) => ({ id, count, label: categoryMeta(id).label }))
    .sort((a, b) => b.count - a.count);
  const maxCategoryCount = Math.max(1, ...categoryBreakdown.map((category) => category.count));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weeklySubmissions = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);
    return {
      label: date.toLocaleDateString(undefined, { weekday: 'short' }),
      count: complaints.filter((complaint) => {
        const createdAt = new Date(complaint.createdAt);
        return createdAt >= date && createdAt < nextDate;
      }).length,
    };
  });
  const maxDailyCount = Math.max(1, ...weeklySubmissions.map((day) => day.count));

  const openComplaint = (complaint) => {
    setSelectedId(complaint.id);
    setSelectedStatus(
      complaint.status === 'assigned' || complaint.status === 'in_progress'
        ? 'progress'
        : complaint.status
    );
    setSelectedAssignee(complaint.assigneeId || '');
  };

  const handleCreateWorker = async (event) => {
    event.preventDefault();
    if (!workerName.trim() || savingWorker) return;
    setSavingWorker(true);
    try {
      const created = await onCreateWorker({
        name: workerName.trim(),
        ...(workerArea.trim() && { area: workerArea.trim() }),
        ...(workerPhone.trim() && { phone: workerPhone.trim() }),
      });
      if (created) {
        setWorkerName('');
        setWorkerArea('');
        setWorkerPhone('');
      }
    } finally {
      setSavingWorker(false);
    }
  };

  const saveComplaint = async () => {
    if (!selected || savingComplaint) return;
    setSavingComplaint(true);
    try {
      const nextStatus =
        selectedStatus ===
        (selected.status === 'assigned' || selected.status === 'in_progress'
          ? 'progress'
          : selected.status)
          ? undefined
          : selectedStatus;
      const updated = await onUpdateStatus(selected.id, nextStatus, selectedAssignee || null);
      if (updated) setSelectedId(null);
    } finally {
      setSavingComplaint(false);
    }
  };

  return (
    <div className="admin-app">
      <header className="admin-header">
        <button className="brand-lockup" onClick={onExitAdmin} aria-label="Return to CivicConnect">
          <span className="brand-symbol">
            <Icon name="pin" size={21} />
          </span>
          <span>
            <strong>CivicConnect</strong>
            <small>Municipal administration</small>
          </span>
        </button>
        <nav className="admin-tabs" aria-label="Administration sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={section === tab.id ? 'active' : ''}
              onClick={() => {
                setSection(tab.id);
                setSelectedId(null);
              }}
            >
              <Icon name={tab.icon} size={17} />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="admin-header-actions">
          <span className="admin-role-label">Admin portal</span>
          <button className="header-signout" onClick={onExitAdmin}>
            Resident view
          </button>
          <button className="header-signout" onClick={onLogout}>
            <Icon name="logout" size={17} />
            <span>Sign out</span>
          </button>
        </div>
      </header>

      <main className="admin-main">
        {section === 'workers' ? (
          <>
            <div className="page-intro">
              <div>
                <p className="eyebrow">Workforce operations</p>
                <h1>Field workers</h1>
                <p className="page-subtitle">
                  Manage the active worker roster and review current assignments.
                </p>
              </div>
              <span className="report-total">
                {workers.length} active {workers.length === 1 ? 'worker' : 'workers'}
              </span>
            </div>
            <section className="worker-section">
              <div className="section-heading">
                <div>
                  <h2>Field worker roster</h2>
                  <p className="muted">Contact and workload details from your active roster.</p>
                </div>
              </div>
              {workers.length ? (
                <div className="worker-grid">
                  {workers.map((worker) => {
                    const workload = complaints.filter(
                      (complaint) =>
                        complaint.assigneeId === worker._id && complaint.status !== 'resolved'
                    ).length;
                    return (
                      <article className="card worker-card" key={worker._id}>
                        <div className="worker-card-heading">
                          <span className="worker-avatar" aria-hidden="true">
                            {worker.name
                              .split(/\s+/)
                              .map((part) => part[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </span>
                          <div>
                            <h3>{worker.name}</h3>
                            <p>{worker.area || 'Area not specified'}</p>
                          </div>
                        </div>
                        <dl className="worker-info">
                          {worker.phone && (
                            <div>
                              <dt>Phone</dt>
                              <dd>{worker.phone}</dd>
                            </div>
                          )}
                          <div>
                            <dt>Open assignments</dt>
                            <dd>{workload}</dd>
                          </div>
                        </dl>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state card">
                  <Icon name="worker" size={36} />
                  <strong>No field workers yet</strong>
                  <p className="muted">Add a worker to make them available for assignment.</p>
                </div>
              )}
            </section>
            <section className="card worker-form-card">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Roster management</p>
                  <h2>Add a field worker</h2>
                  <p className="muted">
                    Only details supported by the worker roster are collected.
                  </p>
                </div>
              </div>
              <form className="worker-form" onSubmit={handleCreateWorker}>
                <div>
                  <label className="field-label" htmlFor="worker-name">
                    Full name
                  </label>
                  <input
                    className="field-input"
                    id="worker-name"
                    value={workerName}
                    onChange={(event) => setWorkerName(event.target.value)}
                    maxLength={80}
                    required
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="worker-area">
                    Area
                  </label>
                  <input
                    className="field-input"
                    id="worker-area"
                    value={workerArea}
                    onChange={(event) => setWorkerArea(event.target.value)}
                    maxLength={100}
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="worker-phone">
                    Phone
                  </label>
                  <input
                    className="field-input"
                    id="worker-phone"
                    type="tel"
                    value={workerPhone}
                    onChange={(event) => setWorkerPhone(event.target.value)}
                    maxLength={30}
                    placeholder="Optional"
                  />
                </div>
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={savingWorker || !workerName.trim()}
                >
                  <Icon name="plus" size={17} />
                  {savingWorker ? 'Adding worker…' : 'Add worker'}
                </button>
              </form>
            </section>
          </>
        ) : section === 'reports' ? (
          <>
            <div className="page-intro">
              <div>
                <p className="eyebrow">Live report data</p>
                <h1>Reports overview</h1>
                <p className="page-subtitle">
                  Summary calculated from {complaints.length} reports currently loaded from
                  CivicConnect.
                </p>
              </div>
            </div>
            <div className="report-summary-grid">
              <div className="card report-kpi">
                <div className="muted">Total reports</div>
                <div className="report-kpi-value">{complaints.length}</div>
              </div>
              <div className="card report-kpi">
                <div className="muted">Open reports</div>
                <div className="report-kpi-value">
                  {complaints.length - resolvedComplaints.length}
                </div>
              </div>
              <div className="card report-kpi">
                <div className="muted">Resolution rate</div>
                <div className="report-kpi-value">{resolutionRate}%</div>
              </div>
              <div className="card report-kpi">
                <div className="muted">Average rating</div>
                <div className="report-kpi-value">
                  {averageRating === null ? '—' : `${averageRating.toFixed(1)} / 5`}
                </div>
                <div className="muted">{ratedComplaints.length} ratings</div>
              </div>
            </div>
            <div className="report-dashboard-grid">
              <section className="card report-chart-card">
                <h2>Reports by status</h2>
                {statusBreakdown.map((status) => (
                  <div className="report-bar-row" key={status.id}>
                    <div className="row-between">
                      <span>{status.label}</span>
                      <strong>{status.count}</strong>
                    </div>
                    <div className="report-bar-track">
                      <div
                        className="report-bar-fill"
                        style={{
                          width: `${complaints.length ? (status.count / complaints.length) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </section>
              <section className="card report-chart-card">
                <h2>Reports by category</h2>
                {categoryBreakdown.length ? (
                  categoryBreakdown.map((category) => (
                    <div className="report-bar-row" key={category.id}>
                      <div className="row-between">
                        <span>{category.label}</span>
                        <strong>{category.count}</strong>
                      </div>
                      <div className="report-bar-track">
                        <div
                          className="report-bar-fill report-bar-fill-gold"
                          style={{ width: `${(category.count / maxCategoryCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="muted">No reports to summarize yet.</p>
                )}
              </section>
            </div>
            <section className="card report-chart-card">
              <h2>New submissions · last 7 days</h2>
              <div className="report-trend-chart">
                {weeklySubmissions.map((day) => (
                  <div className="report-trend-day" key={day.label}>
                    <strong>{day.count}</strong>
                    <div className="report-trend-track">
                      <div
                        className="report-trend-bar"
                        style={{
                          height: `${day.count ? Math.max(8, (day.count / maxDailyCount) * 100) : 0}%`,
                        }}
                      />
                    </div>
                    <span>{day.label}</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : selected ? (
          <>
            <div className="page-back-row">
              <button className="text-back" onClick={() => setSelectedId(null)}>
                <span aria-hidden="true">←</span> Back to complaints
              </button>
              <span className="ticket-label">Ticket #{selected.ticketId || selected.id}</span>
            </div>
            <div className="page-intro admin-detail-intro">
              <div>
                <p className="eyebrow">Complaint review</p>
                <h1>{categoryMeta(selected.category).label}</h1>
                <p className="page-subtitle">Reported {timeAgo(selected.createdAt)}</p>
              </div>
              <StatusBadge status={selected.status} />
            </div>
            <div className="admin-detail-grid">
              <section className="card">
                <h2>Issue details</h2>
                {selected.photo && (
                  <img
                    className="admin-detail-photo"
                    src={selected.photo}
                    alt={`Submitted photo for ${categoryMeta(selected.category).label.toLowerCase()} report`}
                  />
                )}
                <p className="detail-description">
                  {selected.description || 'No description was provided.'}
                </p>
                {selected.location && (
                  <p className="detail-location">
                    <Icon name="pin" size={16} />
                    {selected.location}
                  </p>
                )}
                <div className="timeline-list">
                  {(selected.timeline || []).map((event, index) => (
                    <div
                      className={`timeline-item ${event.done ? 'done' : ''}`}
                      key={`${event.status || event.label}-${index}`}
                    >
                      <span className="timeline-marker">{event.done ? '✓' : index + 1}</span>
                      <div>
                        <strong>{event.label}</strong>
                        <span>{event.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              <section className="card assignment-card">
                <p className="eyebrow">Review and assignment</p>
                <h2>Update report</h2>
                <label className="field-label" htmlFor="admin-status">
                  Status
                </label>
                <select
                  id="admin-status"
                  className="field-select"
                  value={selectedStatus}
                  onChange={(event) => setSelectedStatus(event.target.value)}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.label}
                    </option>
                  ))}
                </select>
                <label className="field-label" htmlFor="admin-assignee">
                  Field worker
                </label>
                <select
                  id="admin-assignee"
                  className="field-select"
                  value={selectedAssignee}
                  onChange={(event) => setSelectedAssignee(event.target.value)}
                >
                  <option value="">Unassigned</option>
                  {workers.map((worker) => (
                    <option key={worker._id} value={worker._id}>
                      {worker.name}
                      {worker.area ? ` · ${worker.area}` : ''}
                    </option>
                  ))}
                </select>
                <button
                  className="btn btn-primary"
                  onClick={saveComplaint}
                  disabled={savingComplaint}
                >
                  {savingComplaint ? 'Saving…' : 'Save changes'}
                </button>
                {selected.rating != null && (
                  <div className="admin-existing-rating">
                    <span>Citizen rating</span>
                    <strong>
                      {'★'.repeat(selected.rating)}
                      {'☆'.repeat(5 - selected.rating)}
                    </strong>
                    {selected.ratingComment && <p>{selected.ratingComment}</p>}
                  </div>
                )}
              </section>
            </div>
          </>
        ) : (
          <>
            <div className="page-intro">
              <div>
                <p className="eyebrow">Operations</p>
                <h1>Complaints</h1>
                <p className="page-subtitle">
                  Review reports and update their status or worker assignment.
                </p>
              </div>
              <span className="report-total">{complaints.length} loaded</span>
            </div>
            <div
              className="filter-row admin-filter-row"
              role="group"
              aria-label="Filter complaints by status"
            >
              {[
                { id: 'all', label: 'All reports' },
                ...STATUS_OPTIONS.map((item) => ({
                  ...item,
                  label: item.label === 'In progress' ? item.label : item.label,
                })),
              ].map((item) => (
                <button
                  key={item.id}
                  className={`filter-chip ${filter === item.id ? 'selected' : ''}`}
                  aria-pressed={filter === item.id}
                  onClick={() => setFilter(item.id)}
                >
                  {item.label}
                  {item.id === 'all' && <span>{complaints.length}</span>}
                </button>
              ))}
            </div>
            {filtered.length ? (
              <div className="admin-complaint-list">
                {filtered.map((complaint) => (
                  <article className="card admin-complaint-card" key={complaint.id}>
                    {complaint.photo ? (
                      <img className="admin-complaint-photo" src={complaint.photo} alt="" />
                    ) : (
                      <span className="admin-complaint-icon">
                        <Icon name={categoryMeta(complaint.category).icon} size={22} />
                      </span>
                    )}
                    <div className="admin-complaint-copy">
                      <div className="admin-complaint-top">
                        <span className="ticket-label">#{complaint.ticketId || complaint.id}</span>
                        <StatusBadge status={complaint.status} />
                      </div>
                      <h2>{categoryMeta(complaint.category).label}</h2>
                      <p>{complaint.description || 'No description provided.'}</p>
                      <span className="admin-complaint-meta">
                        {complaint.location || 'Location not provided'} ·{' '}
                        {timeAgo(complaint.createdAt)}
                      </span>
                    </div>
                    <div className="admin-complaint-controls">
                      <label className="field-label" htmlFor={`assignment-${complaint.id}`}>
                        Assigned worker
                      </label>
                      <select
                        id={`assignment-${complaint.id}`}
                        className="field-select"
                        value={complaint.assigneeId || ''}
                        onChange={(event) =>
                          onUpdateStatus(complaint.id, undefined, event.target.value || null)
                        }
                      >
                        <option value="">Unassigned</option>
                        {workers.map((worker) => (
                          <option key={worker._id} value={worker._id}>
                            {worker.name}
                          </option>
                        ))}
                      </select>
                      <button
                        className="btn btn-outline review-button"
                        onClick={() => openComplaint(complaint)}
                      >
                        Review details <Icon name="arrow" size={15} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state card">
                <Icon name="inbox" size={38} />
                <strong>No complaints in this filter</strong>
                <p className="muted">Reports will appear here as they are submitted.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
