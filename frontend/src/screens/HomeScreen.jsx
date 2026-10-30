import { useEffect, useState } from 'react';
import { Icon, StatusBadge } from '../components';
import { SCREENS } from '../constants/screens.js';
import { categoryMeta } from '../constants/categories.js';
import { timeAgo } from '../utils/time.js';

function getSavedReadIds() {
  try {
    const saved = JSON.parse(localStorage.getItem('civicconnect_read_notifications') || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function HomeScreen({
  complaints,
  myReports = [],
  adminReportFeed = complaints,
  onOpen,
  onNavigate,
  user,
  canCreateReports = true,
}) {
  const recent = complaints.slice(0, 6);
  const displayName = user?.name || user?.email?.split('@')[0] || 'there';
  const isAdmin = user?.role === 'admin';
  const notificationComplaints = isAdmin ? adminReportFeed : myReports;
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState(getSavedReadIds);
  const notifications = notificationComplaints
    .flatMap((complaint) =>
      (complaint.timeline || [])
        .map((event, index) => ({ complaint, event, index }))
        .filter(
          ({ event }) =>
            (event.recorded ?? event.done) &&
            (isAdmin ? event.label === 'Submitted' : event.label !== 'Submitted')
        )
        .map(({ complaint, event, index }) => ({
          id: `${complaint.id}:${index}:${event.at || event.time}`,
          complaintId: complaint.id,
          ticketId: complaint.ticketId || complaint.id,
          category: categoryMeta(complaint.category).label,
          label: isAdmin ? 'New report submitted' : `Status updated: ${event.label}`,
          at: event.at || complaint.createdAt,
        }))
    )
    .sort((a, b) => new Date(b.at) - new Date(a.at));
  const unreadCount = notifications.filter((item) => !readNotificationIds.includes(item.id)).length;

  useEffect(() => {
    localStorage.setItem('civicconnect_read_notifications', JSON.stringify(readNotificationIds));
  }, [readNotificationIds]);

  const markAllRead = () => setReadNotificationIds(notifications.map((item) => item.id));
  const openNotification = (item) => {
    setReadNotificationIds((current) => [...new Set([...current, item.id])]);
    setNotificationsOpen(false);
    onOpen(item.complaintId);
  };

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Good afternoon, {displayName}</div>
          <div className="topbar-sub">
            {user?.role === 'admin' ? 'CivicConnect administrator' : 'CivicConnect citizen'}
          </div>
        </div>
        <button
          className="icon-btn notification-trigger"
          aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
          aria-expanded={notificationsOpen}
          onClick={() => setNotificationsOpen((open) => !open)}
        >
          <Icon name="bell" size={18} />
          {unreadCount > 0 && (
            <span className="notification-count">{unreadCount > 9 ? '9+' : unreadCount}</span>
          )}
        </button>
      </div>
      {notificationsOpen && (
        <div className="notification-backdrop" onClick={() => setNotificationsOpen(false)}>
          <section
            className="notification-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="notification-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="row-between notification-heading">
              <h2 id="notification-title">Notifications</h2>
              <div className="flex-gap">
                {unreadCount > 0 && (
                  <button className="notification-mark-read" onClick={markAllRead}>
                    Mark all read
                  </button>
                )}
                <button
                  className="notification-close"
                  onClick={() => setNotificationsOpen(false)}
                  aria-label="Close notifications"
                >
                  <Icon name="close" size={17} />
                </button>
              </div>
            </div>
            {notifications.length === 0 ? (
              <div className="empty-state notification-empty">
                <div style={{ fontWeight: 600, marginBottom: 4 }}>No notifications yet</div>
                <div className="muted">Report updates will appear here.</div>
              </div>
            ) : (
              <div className="notification-list">
                {notifications.map((item) => {
                  const unread = !readNotificationIds.includes(item.id);
                  return (
                    <button
                      className={`notification-item ${unread ? 'unread' : ''}`}
                      key={item.id}
                      onClick={() => openNotification(item)}
                    >
                      <span className="notification-dot" aria-hidden="true" />
                      <span className="notification-copy">
                        <strong>
                          {item.category} · {item.ticketId}
                        </strong>
                        <span>{item.label}</span>
                        <time dateTime={new Date(item.at).toISOString()}>
                          {new Date(item.at).toLocaleString()}
                        </time>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}
      <div className="content">
        {canCreateReports && (
          <div
            className="card"
            style={{ background: 'var(--navy)', color: 'white', border: 'none' }}
          >
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
        )}

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
                    {c.ticketId || c.id} · {timeAgo(c.createdAt)}
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
