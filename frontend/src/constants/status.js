export const STATUS = Object.freeze({
  SUBMITTED: 'submitted',
  PROGRESS: 'progress',
  RESOLVED: 'resolved',
});

export const STATUS_OPTIONS = [
  { id: STATUS.SUBMITTED, label: 'Submitted' },
  { id: 'progress', label: 'In progress' },
  { id: STATUS.RESOLVED, label: 'Resolved' },
];
