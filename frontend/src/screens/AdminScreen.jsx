import { useState } from 'react';
import { Icon } from '../components';
import { categoryMeta } from '../constants/categories.js';
import { STATUS_OPTIONS } from '../constants/status.js';
import { timeAgo } from '../utils/time.js';

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
  const [workerName, setWorkerName] = useState('');
  const [workerArea, setWorkerArea] = useState('');
  const [workerPhone, setWorkerPhone] = useState('');
  const [savingWorker, setSavingWorker] = useState(false);
  const filtered = filter === 'all' ? complaints : complaints.filter((c) => c.status === filter);
  const resolvedComplaints = complaints.filter((complaint) => complaint.status === 'resolved');
  const ratedComplaints = complaints.filter(
    (complaint) => complaint.rating !== null && complaint.rating !== undefined
  );
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

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="brand-mark" style={{ marginBottom: '2rem' }}>
          <div className="brand-pin" style={{ width: 28, height: 28 }}></div>
          <span className="brand-name" style={{ fontSize: 14 }}>
            CIVICCONNECT
          </span>
        </div>
        <button
          className={`sidebar-link ${section === 'complaints' ? 'active' : ''}`}
          type="button"
          onClick={() => setSection('complaints')}
        >
          <Icon name="clipboard" size={16} /> All complaints
        </button>
        <button
          className={`sidebar-link ${section === 'workers' ? 'active' : ''}`}
          type="button"
          onClick={() => setSection('workers')}
        >
          <Icon name="worker" size={16} /> Field workers
        </button>
        <button
          className={`sidebar-link ${section === 'reports' ? 'active' : ''}`}
          type="button"
          onClick={() => setSection('reports')}
        >
          <Icon name="chart" size={16} /> Reports
        </button>
        <div
          className="sidebar-link"
          onClick={onExitAdmin}
          style={{ marginTop: '2rem', borderTop: '1px solid #3A4E76', paddingTop: '1rem' }}
        >
          ← Exit admin view
        </div>
        <button
          className="sidebar-link"
          type="button"
          onClick={onLogout}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            font: 'inherit',
            textAlign: 'left',
          }}
        >
          <Icon name="logout" size={16} /> Sign out
        </button>
      </div>

      <div className="admin-main">
        {section === 'workers' ? (
          <>
            <div className="row-between" style={{ marginBottom: '1.5rem' }}>
              <div>
                <h1>Field workers</h1>
                <p className="muted">{workers.length} active workers</p>
              </div>
            </div>

            <form className="card" onSubmit={handleCreateWorker}>
              <h2>Add a field worker</h2>
              <label className="field-label" htmlFor="worker-name">
                Name
              </label>
              <input
                className="field-input"
                id="worker-name"
                value={workerName}
                onChange={(event) => setWorkerName(event.target.value)}
                maxLength={80}
                required
              />
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
              <button
                className="btn btn-primary"
                type="submit"
                disabled={savingWorker || !workerName.trim()}
              >
                {savingWorker ? 'Adding worker…' : 'Add worker'}
              </button>
            </form>

            <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Area</th>
                    <th>Phone</th>
                    <th>Open assignments</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((worker) => (
                    <tr key={worker._id}>
                      <td style={{ fontWeight: 600 }}>{worker.name}</td>
                      <td>{worker.area || '—'}</td>
                      <td>{worker.phone || '—'}</td>
                      <td>
                        {
                          complaints.filter(
                            (complaint) =>
                              complaint.assigneeId === worker._id && complaint.status !== 'resolved'
                          ).length
                        }
                      </td>
                    </tr>
                  ))}
                  {workers.length === 0 && (
                    <tr>
                      <td className="muted" colSpan={4}>
                        No active field workers yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : section === 'reports' ? (
          <>
            <div className="row-between" style={{ marginBottom: '1.5rem' }}>
              <div>
                <h1>Reports overview</h1>
                <p className="muted">Summary of submitted civic issues and resolutions</p>
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
        ) : (
          <>
            <div className="row-between" style={{ marginBottom: '1.5rem' }}>
              <div>
                <h1>Complaints</h1>
                <p className="muted">
                  {complaints.length} total ·{' '}
                  {complaints.filter((c) => c.status !== 'resolved').length} open
                </p>
              </div>
            </div>

            <div className="flex-gap" style={{ marginBottom: '1.2rem' }}>
              {['all', 'submitted', 'progress', 'resolved'].map((value) => (
                <button
                  key={value}
                  className="btn btn-sm"
                  style={{
                    background: filter === value ? 'var(--teal)' : 'var(--white)',
                    color: filter === value ? 'white' : 'var(--navy)',
                    border: filter === value ? 'none' : '1.5px solid var(--line)',
                  }}
                  onClick={() => setFilter(value)}
                >
                  {value === 'all' ? 'All' : value === 'progress' ? 'In progress' : value}
                </button>
              ))}
            </div>

            <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Assigned to</th>
                    <th>Reported</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((complaint) => (
                    <tr key={complaint.id}>
                      <td style={{ fontWeight: 600 }}>{complaint.ticketId || complaint.id}</td>
                      <td>
                        <Icon name={categoryMeta(complaint.category).icon} size={16} />{' '}
                        {categoryMeta(complaint.category).label}
                      </td>
                      <td style={{ maxWidth: 220 }}>{complaint.location}</td>
                      <td>
                        <select
                          className="inline-select"
                          value={complaint.status}
                          onChange={(event) =>
                            onUpdateStatus(complaint.id, event.target.value, complaint.assigneeId)
                          }
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status.id} value={status.id}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          className="inline-select"
                          value={complaint.assigneeId || ''}
                          onChange={(event) =>
                            onUpdateStatus(
                              complaint.id,
                              complaint.status,
                              event.target.value || null
                            )
                          }
                        >
                          <option value="">Unassigned</option>
                          {workers.map((worker) => (
                            <option key={worker._id} value={worker._id}>
                              {worker.name}
                              {worker.area ? ` · ${worker.area}` : ''}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="muted">{timeAgo(complaint.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
