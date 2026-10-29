import { Icon, StatusBadge } from '../components';
import { categoryMeta } from '../constants/categories.js';

export function ReportDetailScreen({ complaint, onBack, onRate }) {
  if (!complaint) return null;
  const cat = categoryMeta(complaint.category);

  return (
    <>
      <div className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          ←
        </button>
        <div className="topbar-title">{complaint.id}</div>
        <div style={{ width: 34 }}></div>
      </div>
      <div className="content">
        {complaint.photo && complaint.photo.startsWith('data:') ? (
          <img
            src={complaint.photo}
            alt={`Photo of ${cat.label.toLowerCase()} issue`}
            style={{
              width: '100%',
              aspectRatio: '4/3',
              objectFit: 'cover',
              borderRadius: 14,
              marginBottom: '1rem',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              aspectRatio: '4/3',
              background: 'linear-gradient(135deg, #3A5068, #1B2A4A)',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 50,
              marginBottom: '1rem',
            }}
          >
            <Icon name={cat.icon} size={56} style={{ color: 'white' }} />
          </div>
        )}

        <div className="row-between" style={{ marginBottom: 6 }}>
          <h1 style={{ fontSize: 18 }}>{cat.label}</h1>
          <StatusBadge status={complaint.status} />
        </div>
        <p className="muted" style={{ marginBottom: '1rem' }}>
          {complaint.description}
        </p>

        <div className="map-mock">
          <div className="map-pin">
            <Icon name="pin" size={32} style={{ color: 'var(--teal)' }} />
          </div>
        </div>
        <div className="muted" style={{ marginBottom: '1.2rem' }}>
          {complaint.location}
        </div>

        {complaint.assignedTo && (
          <div className="card" style={{ marginBottom: '1.2rem' }}>
            <div style={{ fontSize: 12, color: 'var(--slate)', marginBottom: 2 }}>Assigned to</div>
            <div style={{ fontWeight: 600 }}>{complaint.assignedTo}</div>
          </div>
        )}

        <h2>Timeline</h2>
        <div className="section-gap">
          {complaint.timeline.map((t, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-dot-col">
                <div className={`timeline-dot ${!t.done ? 'pending' : ''}`}></div>
                {i < complaint.timeline.length - 1 && <div className="timeline-line"></div>}
              </div>
              <div>
                <div
                  className="timeline-label"
                  style={{ color: t.done ? 'var(--navy)' : 'var(--slate-light)' }}
                >
                  {t.label}
                </div>
                <div className="timeline-time">{t.time}</div>
              </div>
            </div>
          ))}
        </div>

        {complaint.status === 'resolved' && complaint.rating === null && (
          <button className="btn btn-gold section-gap" onClick={() => onRate(complaint.id)}>
            ★ Rate this resolution
          </button>
        )}
        {complaint.status === 'resolved' && complaint.rating !== null && (
          <div className="card" style={{ marginTop: '1.2rem' }}>
            <div style={{ fontSize: 12, color: 'var(--slate)', marginBottom: 4 }}>Your rating</div>
            <div style={{ color: 'var(--gold)', fontSize: 18 }}>
              {'★'.repeat(complaint.rating)}
              {'☆'.repeat(5 - complaint.rating)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
