import { useState } from 'react';
import { Icon, StatusBadge } from '../components';
import { categoryMeta } from '../constants/categories.js';
import { timeAgo } from '../utils/time.js';

export function MyReportsScreen({ complaints, onOpen }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? complaints : complaints.filter(c => c.status === filter);
  const filters = [
    { id: "all", label: "All" },
    { id: "submitted", label: "Submitted" },
    { id: "progress", label: "In progress" },
    { id: "resolved", label: "Resolved" },
  ];

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">My reports</div>
      </div>
      <div className="content">
        <div className="flex-gap" style={{ overflowX: "auto", paddingBottom: 4, marginBottom: "1rem" }}>
          {filters.map(f => (
            <button
              key={f.id}
              className="btn btn-sm"
              style={{
                background: filter === f.id ? "var(--teal)" : "var(--white)",
                color: filter === f.id ? "white" : "var(--navy)",
                border: filter === f.id ? "none" : "1.5px solid var(--line)",
                whiteSpace: "nowrap",
              }}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="big-icon"><Icon name="inbox" size={40} /></div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>No reports here</div>
            <div className="muted">Reports matching this filter will show up here.</div>
          </div>
        ) : (
          filtered.map(c => (
            <div key={c.id} className="card" onClick={() => onOpen(c.id)} style={{ cursor: "pointer" }}>
              <div className="row-between" style={{ marginBottom: 8 }}>
                <div className="flex-gap">
                  <span style={{ fontSize: 20, display: "inline-flex" }}><Icon name={categoryMeta(c.category).icon} size={22} /></span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{categoryMeta(c.category).label}</div>
                    <div style={{ fontSize: 12, color: "var(--slate-light)" }}>{c.id} · {timeAgo(c.createdAt)}</div>
                  </div>
                </div>
                <StatusBadge status={c.status} />
              </div>
              <div className="muted">{c.description}</div>
              {c.status === "resolved" && c.rating === null && (
                <div style={{ marginTop: 10, fontSize: 12, color: "var(--gold)", fontWeight: 600 }}>
                  ★ Tap to rate this resolution
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}
