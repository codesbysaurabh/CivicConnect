import { useState } from 'react';
import { BottomNav, OfflineBanner, Toast } from './components';
import { SCREENS, SCREENS_WITH_NAV } from './constants/screens.js';
import { useComplaints } from './hooks/useComplaints.js';
import {
  AdminScreen,
  HomeScreen,
  LoginScreen,
  MyReportsScreen,
  RateScreen,
  ReportDetailScreen,
  ReportScreen,
} from './screens';

/** Root component: state-based router (maps 1:1 onto future react-router routes). */
export default function App() {
  const [authed, setAuthed] = useState(false);
  const [screen, setScreen] = useState(SCREENS.HOME);
  const [activeId, setActiveId] = useState(null);
  const [toast, setToast] = useState('');
  const [adminMode, setAdminMode] = useState(false);
  const { api, complaints, status } = useComplaints();

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  const openComplaint = (id) => {
    setActiveId(id);
    setScreen(SCREENS.DETAIL);
  };

  const handleCreate = (data) => {
    if (!api) return;
    api.createComplaint(data).then(() => {
      showToast('Report submitted');
      setScreen(SCREENS.REPORTS);
    });
  };

  const handleUpdateStatus = (id, newStatus, assignedTo) => {
    if (!api) return;
    api.updateStatus(id, newStatus, assignedTo);
  };

  const handleRate = (id, rating) => {
    if (!api) return;
    api.submitFeedback(id, rating).then(() => {
      showToast('Thanks for your feedback');
      setScreen(SCREENS.DETAIL);
    });
  };

  const activeComplaint = complaints.find((c) => c.id === activeId);

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  if (status === 'connecting') {
    return (
      <div className="app-shell" style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
        <div className="muted">Loading your reports…</div>
      </div>
    );
  }

  const banner = status === 'offline' ? <OfflineBanner /> : null;

  if (adminMode) {
    return (
      <div className="app-shell admin-shell">
        {banner}
        <AdminScreen
          complaints={complaints}
          onUpdateStatus={handleUpdateStatus}
          onExitAdmin={() => setAdminMode(false)}
        />
      </div>
    );
  }

  let body = null;
  if (screen === SCREENS.HOME) {
    body = <HomeScreen complaints={complaints} onOpen={openComplaint} onNavigate={setScreen} />;
  } else if (screen === SCREENS.REPORT) {
    body = <ReportScreen onSubmit={handleCreate} onBack={() => setScreen(SCREENS.HOME)} />;
  } else if (screen === SCREENS.REPORTS) {
    body = <MyReportsScreen complaints={complaints} onOpen={openComplaint} />;
  } else if (screen === SCREENS.DETAIL) {
    body = (
      <ReportDetailScreen
        complaint={activeComplaint}
        onBack={() => setScreen(SCREENS.REPORTS)}
        onRate={(id) => {
          setActiveId(id);
          setScreen(SCREENS.RATE);
        }}
      />
    );
  } else if (screen === SCREENS.RATE) {
    body = (
      <RateScreen
        complaint={activeComplaint}
        onBack={() => setScreen(SCREENS.DETAIL)}
        onSubmitRating={handleRate}
      />
    );
  }

  return (
    <div className="app-shell">
      {banner}
      {body}
      {SCREENS_WITH_NAV.includes(screen) && (
        <BottomNav screen={screen} onNavigate={setScreen} onOpenAdmin={() => setAdminMode(true)} />
      )}
      <Toast message={toast} />
    </div>
  );
}
