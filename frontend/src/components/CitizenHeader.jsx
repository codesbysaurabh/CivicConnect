import { useEffect, useMemo, useState } from 'react';
import { Icon } from './Icon.jsx';
import { SCREENS } from '../constants/screens.js';
import { categoryMeta } from '../constants/categories.js';

function loadReadIds() {
  try {
    const saved = JSON.parse(localStorage.getItem('civicconnect_read_notifications') || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function CitizenHeader({
  screen,
  user,
  myReports = [],
  complaints = [],
  onNavigate,
  onOpen,
  onOpenAdmin,
  onLogout,
}) {
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState(loadReadIds);
  const isAdmin = user?.role === 'admin';
  const source = isAdmin ? complaints : myReports;
  const notifications = useMemo(
    () =>
      source
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
        .sort((a, b) => new Date(b.at) - new Date(a.at)),
    [isAdmin, source]
  );
  const unreadCount = notifications.filter((item) => !readIds.includes(item.id)).length;

  useEffect(() => {
    localStorage.setItem('civicconnect_read_notifications', JSON.stringify(readIds));
  }, [readIds]);

  const navigate = (next) => {
    setOpen(false);
    onNavigate(next);
  };

  return (
    <>
      <header className="citizen-header">
        <button
          className="brand-lockup"
          onClick={() => navigate(SCREENS.HOME)}
          aria-label="CivicConnect home"
        >
          <span className="brand-symbol">
            <Icon name="pin" size={21} />
          </span>
          <span>
            <strong>CivicConnect</strong>
            <small>{isAdmin ? 'Municipal administration' : 'Resident portal'}</small>
          </span>
        </button>
        <nav className="citizen-header-nav" aria-label="Main navigation">
          <button
            className={screen === SCREENS.HOME ? 'active' : ''}
            onClick={() => navigate(SCREENS.HOME)}
          >
            Home
          </button>
          {!isAdmin && (
            <button
              className={screen === SCREENS.REPORTS ? 'active' : ''}
              onClick={() => navigate(SCREENS.REPORTS)}
            >
              My reports
            </button>
          )}
          {!isAdmin && (
            <button className="nav-primary" onClick={() => navigate(SCREENS.REPORT)}>
              <Icon name="plus" size={17} /> Submit issue
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => {
                setOpen(false);
                onOpenAdmin();
              }}
            >
              Admin dashboard
            </button>
          )}
        </nav>
        <div className="citizen-header-actions">
          <div className="notification-anchor">
            <button
              className="header-icon-button"
              aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              <Icon name="bell" size={19} />
              {unreadCount > 0 && (
                <span className="header-notification-count">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {open && (
              <section className="header-notification-panel" aria-label="Notifications">
                <div className="row-between notification-heading">
                  <h2>Notifications</h2>
                  <div className="flex-gap">
                    {unreadCount > 0 && (
                      <button
                        className="notification-mark-read"
                        onClick={() => setReadIds(notifications.map((item) => item.id))}
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      className="notification-close"
                      onClick={() => setOpen(false)}
                      aria-label="Close notifications"
                    >
                      <Icon name="close" size={17} />
                    </button>
                  </div>
                </div>
                {notifications.length === 0 ? (
                  <div className="empty-state notification-empty">
                    <strong>No notifications yet</strong>
                    <p className="muted">Report updates will appear here.</p>
                  </div>
                ) : (
                  <div className="notification-list">
                    {notifications.map((item) => {
                      const unread = !readIds.includes(item.id);
                      return (
                        <button
                          className={`notification-item ${unread ? 'unread' : ''}`}
                          key={item.id}
                          onClick={() => {
                            setReadIds((current) => [...new Set([...current, item.id])]);
                            setOpen(false);
                            onOpen(item.complaintId);
                          }}
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
            )}
          </div>
          <span className="header-user">{user?.name || user?.email}</span>
          <button className="header-signout" onClick={onLogout}>
            <Icon name="logout" size={17} />
            <span>Sign out</span>
          </button>
        </div>
      </header>
      {open && (
        <button
          className="notification-dismiss"
          aria-label="Close notifications"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
