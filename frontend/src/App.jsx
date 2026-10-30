import { useEffect, useState } from 'react';
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
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [screen, setScreen] = useState(SCREENS.HOME);
  const [activeId, setActiveId] = useState(null);
  const [toast, setToast] = useState('');
  const [adminMode, setAdminMode] = useState(false);
  const {
    api,
    complaints,
    myComplaints,
    adminComplaints,
    workers,
    status,
    refreshMine,
    loadAdminData,
    setAdminComplaints,
    setWorkers,
  } = useComplaints(authed);

  useEffect(() => {
    const token = localStorage.getItem('civicconnect_token');
    if (!token) {
      setAuthChecked(true);
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('Session expired');
        const result = await response.json();
        setUser(result.user);
        setAuthed(true);
      })
      .catch(() => {
        localStorage.removeItem('civicconnect_token');
        setAuthed(false);
      })
      .finally(() => setAuthChecked(true));
  }, []);

  useEffect(() => {
    if (!authed || !api?.getMyComplaints) return undefined;
    const timer = setInterval(() => refreshMine().catch(() => {}), 15000);
    return () => clearInterval(timer);
  }, [authed, api, refreshMine]);

  useEffect(() => {
    if (!adminMode || !api?.getAdminComplaints) return undefined;
    const timer = setInterval(() => loadAdminData().catch(() => {}), 15000);
    return () => clearInterval(timer);
  }, [adminMode, api, loadAdminData]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  const handleLogout = () => {
    localStorage.removeItem('civicconnect_token');
    setUser(null);
    setAuthed(false);
    setAdminMode(false);
    setScreen(SCREENS.HOME);
    setActiveId(null);
  };

  const openComplaint = (id) => {
    setActiveId(id);
    setScreen(SCREENS.DETAIL);
  };

  const handleCreate = async (data) => {
    if (!api) return;
    try {
      await api.createComplaint(data);
      await refreshMine();
      showToast('Report submitted');
      setScreen(SCREENS.REPORTS);
    } catch (error) {
      showToast(error.message || 'Could not submit report');
    }
  };

  const handleUpdateStatus = async (id, newStatus, assigneeId) => {
    if (!api) return;
    try {
      const updated = await api.updateStatus(id, newStatus, assigneeId);
      if (updated)
        setAdminComplaints((current) =>
          current.map((complaint) => (complaint.id === id ? updated : complaint))
        );
      showToast('Report updated');
    } catch (error) {
      showToast(error.message || 'Could not update report');
    }
  };

  const handleCreateWorker = async (worker) => {
    if (!api?.createWorker) return null;
    try {
      const created = await api.createWorker(worker);
      setWorkers((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name)));
      showToast('Field worker added');
      return created;
    } catch (error) {
      showToast(error.message || 'Could not add field worker');
      return null;
    }
  };

  const handleRate = async (id, rating, comment) => {
    if (!api) return;
    try {
      await api.submitFeedback(id, rating, comment);
      await refreshMine();
      showToast('Thanks for your feedback');
      setScreen(SCREENS.DETAIL);
    } catch (error) {
      showToast(error.message || 'Could not submit rating');
    }
  };

  const activeComplaint = [...complaints, ...myComplaints, ...adminComplaints].find(
    (c) => c.id === activeId
  );

  const openAdmin = async () => {
    try {
      await loadAdminData();
      setAdminMode(true);
    } catch (error) {
      showToast(error.message || 'Could not load admin dashboard');
    }
  };

  if (!authChecked)
    return (
      <div
        className="app-shell"
        style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}
      >
        <div className="muted">Checking your session…</div>
      </div>
    );
  if (!authed)
    return (
      <LoginScreen
        onLogin={(account) => {
          setUser(account);
          setAuthed(true);
        }}
      />
    );

  if (status === 'connecting') {
    return (
      <div
        className="app-shell"
        style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}
      >
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
          complaints={adminComplaints}
          workers={workers}
          onUpdateStatus={handleUpdateStatus}
          onCreateWorker={handleCreateWorker}
          onExitAdmin={() => setAdminMode(false)}
          onLogout={handleLogout}
        />
      </div>
    );
  }

  let body = null;
  if (screen === SCREENS.HOME) {
    body = (
      <HomeScreen
        complaints={complaints}
        myReports={myComplaints}
        adminReportFeed={complaints}
        onOpen={openComplaint}
        onNavigate={setScreen}
        user={user}
        canCreateReports={user?.role !== 'admin'}
      />
    );
  } else if (screen === SCREENS.REPORT) {
    body = <ReportScreen onSubmit={handleCreate} onBack={() => setScreen(SCREENS.HOME)} />;
  } else if (screen === SCREENS.REPORTS) {
    body = <MyReportsScreen complaints={myComplaints} onOpen={openComplaint} />;
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
        <BottomNav
          screen={screen}
          onNavigate={setScreen}
          onOpenAdmin={openAdmin}
          onLogout={handleLogout}
          showAdmin={user?.role === 'admin'}
          showReport={user?.role !== 'admin'}
          showMyReports={user?.role !== 'admin'}
        />
      )}
      <Toast message={toast} />
    </div>
  );
}
