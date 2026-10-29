import { Icon } from './Icon.jsx';
import { SCREENS } from '../constants/screens.js';

export function BottomNav({
  screen,
  onNavigate,
  onOpenAdmin,
  onLogout,
  showAdmin = false,
  showReport = true,
  showMyReports = true,
}) {
  return (
    <div className="bottomnav">
      <button
        className={`nav-item ${screen === SCREENS.HOME ? 'active' : ''}`}
        onClick={() => onNavigate(SCREENS.HOME)}
      >
        <span className="nav-icon">
          <Icon name="home" size={22} />
        </span>
        Home
      </button>
      {showReport && (
        <button className="nav-item" onClick={() => onNavigate(SCREENS.REPORT)}>
          <span className="nav-icon">
            <Icon name="plus" size={22} />
          </span>
          Report
        </button>
      )}
      {showMyReports && (
        <button
          className={`nav-item ${screen === SCREENS.REPORTS ? 'active' : ''}`}
          onClick={() => onNavigate(SCREENS.REPORTS)}
        >
          <span className="nav-icon">
            <Icon name="clipboard" size={22} />
          </span>
          My Reports
        </button>
      )}
      {showAdmin && (
        <button className="nav-item" onClick={onOpenAdmin}>
          <span className="nav-icon">
            <Icon name="settings" size={22} />
          </span>
          Admin
        </button>
      )}
      <button className="nav-item" onClick={onLogout} aria-label="Sign out">
        <span className="nav-icon">
          <Icon name="logout" size={22} />
        </span>
        Sign out
      </button>
    </div>
  );
}
