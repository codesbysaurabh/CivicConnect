import { Icon } from './Icon.jsx';
import { SCREENS } from '../constants/screens.js';

export function BottomNav({ screen, onNavigate, onOpenAdmin }) {
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
      <button className="nav-item" onClick={() => onNavigate(SCREENS.REPORT)}>
        <span className="nav-icon">
          <Icon name="plus" size={22} />
        </span>
        Report
      </button>
      <button
        className={`nav-item ${screen === SCREENS.REPORTS ? 'active' : ''}`}
        onClick={() => onNavigate(SCREENS.REPORTS)}
      >
        <span className="nav-icon">
          <Icon name="clipboard" size={22} />
        </span>
        My Reports
      </button>
      <button className="nav-item" onClick={onOpenAdmin}>
        <span className="nav-icon">
          <Icon name="settings" size={22} />
        </span>
        Admin
      </button>
    </div>
  );
}
