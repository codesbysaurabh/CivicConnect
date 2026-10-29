import { useCallback, useEffect, useState } from 'react';
import { resolveComplaintsApi } from '../services/complaints/index.js';

/**
 * Resolves the complaints API once and keeps `complaints` in sync through a
 * live subscription.
 *
 * @returns {{ api: import('../services/complaints/types.js').ComplaintsApi | null,
 *             complaints: import('../services/complaints/types.js').Complaint[],
 *             status: 'connecting' | 'ready' | 'offline' }}
 */
export function useComplaints(authenticated = false) {
  const [api, setApi] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [myComplaints, setMyComplaints] = useState([]);
  const [adminComplaints, setAdminComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [status, setStatus] = useState('connecting');

  const refreshMine = useCallback(async () => {
    if (!api?.getMyComplaints) return [];
    const reports = await api.getMyComplaints();
    setMyComplaints(reports);
    return reports;
  }, [api]);

  const loadAdminData = useCallback(async () => {
    if (!api?.getAdminComplaints) return;
    const [reports, roster] = await Promise.all([api.getAdminComplaints(), api.getWorkers()]);
    setAdminComplaints(reports);
    setWorkers(roster);
  }, [api]);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe = null;
    setApi(null);
    setStatus('connecting');

    (async () => {
      const { api: resolved, mode } = await resolveComplaintsApi({ authenticated });
      if (cancelled) return;
      setApi(resolved);
      setStatus(mode);
      if (resolved.getMyComplaints) {
        resolved.getMyComplaints().then((reports) => {
          if (!cancelled) setMyComplaints(reports);
        }).catch(() => {});
      }
      unsubscribe = resolved.subscribeComplaints((items) => {
        if (cancelled) return;
        setComplaints(items);
        setStatus(mode === 'ready' ? 'ready' : 'offline');
      }, () => {
        if (!cancelled) setStatus('offline');
      });
    })();

    return () => {
      cancelled = true;
      if (unsubscribe) unsubscribe();
    };
  }, [authenticated]);

  return {
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
  };
}
