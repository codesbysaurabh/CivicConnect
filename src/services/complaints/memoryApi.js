import { INITIAL_COMPLAINTS } from '../../data/seedComplaints.js';
import { compressPhoto } from '../photo.js';
import { buildNewComplaint, buildStatusPatch } from './complaintFactory.js';

/**
 * In-memory ComplaintsApi. Used when no persistent backend is available
 * (local dev, tests, or a viewer without write access). Data is lost on reload.
 *
 * @param {import('./types.js').Complaint[]} [seed]
 * @returns {import('./types.js').ComplaintsApi}
 */
export function buildMemoryApi(seed = INITIAL_COMPLAINTS) {
  let complaints = [...seed];
  const listeners = new Set();
  const notify = () => listeners.forEach((fn) => fn([...complaints]));
  const find = (id) => complaints.find((c) => c.id === id) || null;

  return {
    getComplaints: () => Promise.resolve([...complaints]),
    subscribeComplaints: (onChange) => {
      listeners.add(onChange);
      onChange([...complaints]);
      return () => listeners.delete(onChange);
    },
    getComplaint: (id) => Promise.resolve(find(id)),
    createComplaint: async (data) => {
      const photo = await compressPhoto(data.photo);
      const complaint = buildNewComplaint(data, photo);
      complaints = [complaint, ...complaints];
      notify();
      return complaint;
    },
    updateStatus: (id, status, assignedTo) => {
      complaints = complaints.map((c) =>
        c.id === id ? { ...c, ...buildStatusPatch(c, status, assignedTo) } : c
      );
      notify();
      return Promise.resolve(find(id));
    },
    submitFeedback: (id, rating) => {
      complaints = complaints.map((c) => (c.id === id ? { ...c, rating } : c));
      notify();
      return Promise.resolve(find(id));
    },
    seedIfEmpty: () => Promise.resolve(),
  };
}
