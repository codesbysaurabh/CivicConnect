import { useState } from 'react';
import { Icon } from '../components';
import { categoryMeta } from '../constants/categories.js';
import { FIELD_WORKERS } from '../constants/fieldWorkers.js';
import { STATUS_OPTIONS } from '../constants/status.js';
import { timeAgo } from '../utils/time.js';

export function AdminScreen({ complaints, onUpdateStatus, onExitAdmin }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? complaints : complaints.filter(c => c.status === filter);

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="brand-mark" style={{ marginBottom: "2rem" }}>
          <div className="brand-pin" style={{ width: 28, height: 28 }}></div>
          <span className="brand-name" style={{ fontSize: 14 }}>CIVICCONNECT</span>
        </div>
        <div className="sidebar-link active"><Icon name="clipboard" size={16} /> All complaints</div>
        <div className="sidebar-link"><Icon name="worker" size={16} /> Field workers</div>
        <div className="sidebar-link"><Icon name="chart" size={16} /> Reports</div>
        <div className="sidebar-link" onClick={onExitAdmin} style={{ marginTop: "2rem", borderTop: "1px solid #3A4E76", paddingTop: "1rem" }}>
          ← Exit admin view
        </div>
      </div>
      <div className="admin-main">
        <div className="row-between" style={{ marginBottom: "1.5rem" }}>
          <div>
            <h1>Complaints</h1>
            <p className="muted">{complaints.length} total · {complaints.filter(c => c.status !== "resolved").length} open</p>
          </div>
        </div>

        <div className="flex-gap" style={{ marginBottom: "1.2rem" }}>
          {["all", "submitted", "progress", "resolved"].map(f => (
            <button
              key={f}
              className="btn btn-sm"
              style={{
                background: filter === f ? "var(--teal)" : "var(--white)",
                color: filter === f ? "white" : "var(--navy)",
                border: filter === f ? "none" : "1.5px solid var(--line)",
              }}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="card" style={{ padding: 0, overflowX: "auto" }}>
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
              {filtered.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.id}</td>
                  <td><Icon name={categoryMeta(c.category).icon} size={16} /> {categoryMeta(c.category).label}</td>
                  <td style={{ maxWidth: 220 }}>{c.location}</td>
                  <td>
                    <select
                      className="inline-select"
                      value={c.status}
                      onChange={e => onUpdateStatus(c.id, e.target.value, c.assignedTo)}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                  </td>
                  <td>
                    <select
                      className="inline-select"
                      value={c.assignedTo || ""}
                      onChange={e => onUpdateStatus(c.id, c.status, e.target.value || null)}
                    >
                      <option value="">Unassigned</option>
                      {FIELD_WORKERS.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </td>
                  <td className="muted">{timeAgo(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
