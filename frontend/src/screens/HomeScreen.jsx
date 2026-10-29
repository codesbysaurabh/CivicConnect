import { Icon, StatusBadge } from '../components';
import { SCREENS } from '../constants/screens.js';
import { categoryMeta } from '../constants/categories.js';
import { DEMO_USER } from '../config/app.js';
import { timeAgo } from '../utils/time.js';

export function HomeScreen({ complaints, onOpen, onNavigate }) {
  const recent = complaints.slice(0, 6);
  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Good afternoon, {DEMO_USER.name}</div>
          <div className="topbar-sub">{DEMO_USER.area}</div>
        </div>
        <button className="icon-btn" aria-label="Notifications">
          <Icon name="bell" size={18} />
        </button>
      </div>
      <div className="content">
        <div className="card" style={{ background: 'var(--navy)', color: 'white', border: 'none' }}>
          <div className="row-between">
            <div>
              <div style={{ fontSize: 13, color: '#9FB3C8', marginBottom: 4 }}>
                Reported something?
              </div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>
                Snap a photo, we'll handle the rest
              </div>
            </div>
          </div>
          <button
            className="btn btn-gold"
            style={{ marginTop: '0.9rem' }}
            onClick={() => onNavigate(SCREENS.REPORT)}
          >
            + New report
          </button>
        </div>

        <div className="row-between section-gap" style={{ marginBottom: '0.6rem' }}>
          <h2 style={{ marginBottom: 0 }}>Recent reports nearby</h2>
        </div>

        {recent.map((c) => (
          <div
            key={c.id}
            className="card"
            onClick={() => onOpen(c.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="row-between" style={{ marginBottom: 8 }}>
              <div className="flex-gap">
                <span style={{ fontSize: 20, display: 'inline-flex' }}>
                  <Icon name={categoryMeta(c.category).icon} size={22} />
                </span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    {categoryMeta(c.category).label}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--slate-light)' }}>
                    {c.id} · {timeAgo(c.createdAt)}
                  </div>
                </div>
              </div>
              <StatusBadge status={c.status} />
            </div>
            <div className="muted">{c.location}</div>
          </div>
        ))}
      </div>
    </>
  );
}
