import { compressPhoto } from '../photo.js';

const STATUS_TO_API = { progress: 'in_progress' };
const API_TO_STATUS = { assigned: 'progress', in_progress: 'progress' };
const STATUS_RANK = { submitted: 0, assigned: 1, in_progress: 2, resolved: 3 };

function normalizeComplaint(item) {
  const coordinates = item.location?.coordinates || [];
  const history = item.history || [];
  const status = API_TO_STATUS[item.status] || item.status;
  const currentStatusRank = STATUS_RANK[item.status] ?? -1;
  const timeline = [
    { label: 'Submitted', status: 'submitted' },
    { label: 'Assigned to field worker', status: 'assigned' },
    { label: 'In progress', status: 'in_progress' },
    { label: 'Resolved', status: 'resolved' },
  ].map((entry) => {
    const event = history.find((record) => record.status === entry.status);
    const reached = STATUS_RANK[entry.status] <= currentStatusRank;
    return {
      label: entry.label,
      time: event ? new Date(event.at).toLocaleString() : reached ? 'Completed' : 'Pending',
      at: event?.at || null,
      done: Boolean(event) || reached,
      recorded: Boolean(event),
    };
  });

  return {
    id: item._id || item.id,
    ticketId: item.ticketId || item.id,
    category: item.category,
    description: item.description || '',
    status,
    createdAt: item.createdAt,
    resolvedAt: item.resolvedAt || null,
    location: item.location?.address || (coordinates.length === 2 ? `${coordinates[1]}, ${coordinates[0]}` : ''),
    latitude: coordinates[1],
    longitude: coordinates[0],
    photo: item.photo?.url || item.photo || null,
    rating: item.rating?.stars ?? null,
    ratingComment: item.rating?.comment || '',
    assignedTo: item.assignee?.name || null,
    assigneeId: item.assignee?._id || item.assignee?.id || null,
    timeline,
  };
}

export function buildRestApi(baseUrl = 'http://localhost:5000/api') {
  const apiUrl = baseUrl.replace(/\/+$/, '');
  const listeners = new Set();
  let feed = [];
  let rawFeed = [];
  let pollTimer;

  async function request(path, options = {}) {
    const token = localStorage.getItem('civicconnect_token');
    const headers = new Headers(options.headers || {});
    if (token) headers.set('Authorization', `Bearer ${token}`);
    if (options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');

    const response = await fetch(`${apiUrl}${path}`, { ...options, headers });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(result.error || 'The server could not complete the request.');
      error.status = response.status;
      throw error;
    }
    return result;
  }

  const updateFeed = (items) => {
    rawFeed = items;
    feed = items.map(normalizeComplaint);
    listeners.forEach((listener) => listener(feed));
    return feed;
  };

  async function loadFeed() {
    const result = await request('/complaints?limit=100');
    return updateFeed(result.complaints || []);
  }

  function subscribeComplaints(onChange, onError) {
    listeners.add(onChange);
    loadFeed().catch((error) => onError?.(error));
    if (!pollTimer) {
      pollTimer = setInterval(() => loadFeed().catch((error) => onError?.(error)), 15000);
    }
    onChange(feed);
    return () => {
      listeners.delete(onChange);
      if (listeners.size === 0 && pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
    };
  }

  return {
    getComplaints: loadFeed,
    getMyComplaints: async () => {
      const result = await request('/complaints/mine');
      return (result.complaints || []).map(normalizeComplaint);
    },
    getAdminComplaints: async () => {
      const result = await request('/admin/complaints?limit=200');
      return (result.complaints || []).map(normalizeComplaint);
    },
    getWorkers: async () => {
      const result = await request('/admin/workers');
      return result.workers || [];
    },
    createWorker: async (worker) => {
      const result = await request('/admin/workers', {
        method: 'POST',
        body: JSON.stringify(worker),
      });
      return result.worker;
    },
    subscribeComplaints,
    getComplaint: async (id) => {
      const result = await request(`/complaints/${id}`);
      return result.complaint ? normalizeComplaint(result.complaint) : null;
    },
    createComplaint: async (data) => {
      const photo = await compressPhoto(data.photo);
      const imageBlob = photo instanceof Blob ? photo : await (await fetch(photo)).blob();
      const form = new FormData();
      form.append('photo', imageBlob, 'civic-report.jpg');
      form.append('category', data.category);
      form.append('description', data.description || '');
      if (Number.isFinite(data.lat) && Number.isFinite(data.lng)) {
        form.append('lat', String(data.lat));
        form.append('lng', String(data.lng));
      }
      form.append('address', data.address || data.location || '');
      const result = await request('/complaints', { method: 'POST', body: form });
      const complaint = normalizeComplaint(result.complaint);
      updateFeed([result.complaint, ...rawFeed.filter((item) => (item._id || item.id) !== complaint.id)]);
      return complaint;
    },
    updateStatus: async (id, status, assigneeId) => {
      const current = feed.find((complaint) => complaint.id === id);
      const body = {};
      const assigningFirstWorker = status === 'submitted' && assigneeId && !current?.assigneeId;
      if (status !== undefined && !assigningFirstWorker && status !== current?.status) {
        body.status = STATUS_TO_API[status] || status;
      }
      if (assigneeId !== undefined && assigneeId !== current?.assigneeId) body.assignee = assigneeId;
      if (!Object.keys(body).length) return current || null;

      const result = await request(`/admin/complaints/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
      const updated = normalizeComplaint(result.complaint);
      updateFeed(rawFeed.map((complaint) => ((complaint._id || complaint.id) === id ? result.complaint : complaint)));
      return updated;
    },
    submitFeedback: async (id, rating, comment = '') => {
      const result = await request(`/complaints/${id}/rating`, {
        method: 'POST',
        body: JSON.stringify({ stars: rating, comment }),
      });
      const updated = normalizeComplaint(result.complaint);
      updateFeed(rawFeed.map((complaint) => ((complaint._id || complaint.id) === id ? result.complaint : complaint)));
      return updated;
    },
    seedIfEmpty: async () => {},
  };
}
