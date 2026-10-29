import { generateComplaintId } from '../../utils/id.js';

/** Builds the full complaint record for a freshly submitted report. */
export function buildNewComplaint(data, photo) {
  return {
    id: generateComplaintId(),
    ...data,
    photo,
    status: 'submitted',
    createdAt: new Date().toISOString(),
    resolvedAt: null,
    rating: null,
    assignedTo: null,
    timeline: [
      { label: 'Submitted', time: 'Just now', done: true },
      { label: 'Assigned to field worker', time: 'Pending', done: false },
      { label: 'In progress', time: 'Pending', done: false },
      { label: 'Resolved', time: 'Pending', done: false },
    ],
  };
}

/** Computes the patch applied when an admin changes status / assignee. */
export function buildStatusPatch(current, status, assignedTo) {
  const patch = { status };
  if (assignedTo !== undefined) patch.assignedTo = assignedTo;
  if (status === 'resolved' && !current.resolvedAt) {
    patch.resolvedAt = new Date().toISOString();
  }
  return patch;
}
