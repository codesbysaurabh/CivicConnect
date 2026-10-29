import { useEffect, useState } from 'react';
import { resolveComplaintsApi } from '../services/complaints/index.js';

/**
 * Resolves the complaints API once and keeps `complaints` in sync through a
 * live subscription.
 *
 * @returns {{ api: import('../services/complaints/types.js').ComplaintsApi | null,
 *             complaints: import('../services/complaints/types.js').Complaint[],
 *             status: 'connecting' | 'ready' | 'offline' }}
 */
export function useComplaints() {
  const [api, setApi] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [status, setStatus] = useState('connecting');

  useEffect(() => {
    let cancelled = false;
    let unsubscribe = null;

    (async () => {
      const { api: resolved, mode } = await resolveComplaintsApi();
      if (cancelled) return;
      setApi(resolved);
      setStatus(mode);
      unsubscribe = resolved.subscribeComplaints(setComplaints, () => {
        if (!cancelled) setStatus('offline');
      });
    })();

    return () => {
      cancelled = true;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return { api, complaints, status };
}
