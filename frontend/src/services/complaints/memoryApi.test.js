import { describe, expect, it, vi } from 'vitest';
import { INITIAL_COMPLAINTS } from '../../data/seedComplaints.js';
import { buildMemoryApi } from './memoryApi.js';

const draft = {
  category: 'garbage',
  description: 'Overflowing bin',
  location: 'Gate 2',
  photo: null,
};

describe('memory complaints API', () => {
  it('starts with the seed data', async () => {
    const api = buildMemoryApi();
    expect(await api.getComplaints()).toHaveLength(INITIAL_COMPLAINTS.length);
  });

  it('creates a complaint at the top of the list with a pending timeline', async () => {
    const api = buildMemoryApi([]);
    const created = await api.createComplaint(draft);
    expect(created.status).toBe('submitted');
    expect(created.id).toMatch(/^CC-\d{4}$/);
    expect(created.timeline.filter((t) => t.done)).toHaveLength(1);
    expect((await api.getComplaints())[0].id).toBe(created.id);
  });

  it('stamps resolvedAt once when a complaint is resolved', async () => {
    const api = buildMemoryApi([]);
    const { id } = await api.createComplaint(draft);
    const first = await api.updateStatus(id, 'resolved', 'Ramesh K.');
    expect(first.assignedTo).toBe('Ramesh K.');
    expect(first.resolvedAt).toBeTruthy();
    const second = await api.updateStatus(id, 'resolved');
    expect(second.resolvedAt).toBe(first.resolvedAt);
  });

  it('stores feedback ratings', async () => {
    const api = buildMemoryApi([]);
    const { id } = await api.createComplaint(draft);
    expect((await api.submitFeedback(id, 5)).rating).toBe(5);
  });

  it('notifies subscribers and supports unsubscribe', async () => {
    const api = buildMemoryApi([]);
    const listener = vi.fn();
    const unsubscribe = api.subscribeComplaints(listener);
    expect(listener).toHaveBeenCalledTimes(1);
    await api.createComplaint(draft);
    expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe();
    await api.createComplaint(draft);
    expect(listener).toHaveBeenCalledTimes(2);
  });
});
