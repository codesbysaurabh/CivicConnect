import { INITIAL_COMPLAINTS } from '../../data/seedComplaints.js';
import { compressPhoto } from '../photo.js';
import { buildNewComplaint, buildStatusPatch } from './complaintFactory.js';

/**
 * ComplaintsApi backed by the Claude artifact `db` capability.
 * Only active when the app runs as a published Claude artifact; elsewhere the
 * factory in ./index.js falls back to the in-memory API.
 *
 * Call signatures mirror a REST client, so replacing this file with a real
 * backend client should not require changes in any screen.
 *
 * @param {any} db  namespace returned by `window.claude.use('db')`
 * @returns {import('./types.js').ComplaintsApi}
 */
export function buildClaudeDbApi(db) {
  const collection = db.collection('complaints');
  const recent = () => collection.orderBy('createdAt', 'desc').limit(200);

  return {
    getComplaints: async () => {
      const snap = await recent().get();
      return snap.docs.map((d) => d.data());
    },
    subscribeComplaints: (onChange, onError) =>
      recent().onSnapshot((snap) => onChange(snap.docs.map((d) => d.data())), onError),
    getComplaint: async (id) => {
      const snap = await collection.doc(id).get();
      return snap.exists ? snap.data() : null;
    },
    createComplaint: async (data) => {
      const photo = await compressPhoto(data.photo);
      const complaint = buildNewComplaint(data, photo);
      await collection.doc(complaint.id).set(complaint);
      return complaint;
    },
    updateStatus: async (id, status, assignedTo) => {
      const ref = collection.doc(id);
      const snap = await ref.get();
      if (!snap.exists) return null;
      await ref.update(buildStatusPatch(snap.data(), status, assignedTo));
      return (await ref.get()).data();
    },
    submitFeedback: async (id, rating) => {
      const ref = collection.doc(id);
      await ref.update({ rating });
      return (await ref.get()).data();
    },
    seedIfEmpty: async () => {
      const snap = await collection.limit(1).get();
      if (!snap.empty) return;
      await Promise.all(INITIAL_COMPLAINTS.map((c) => collection.doc(c.id).set(c)));
    },
  };
}
