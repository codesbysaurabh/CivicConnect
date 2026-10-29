import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { timeAgo } from './time.js';

describe('timeAgo', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-23T12:00:00Z'));
  });
  afterEach(() => vi.useRealTimers());

  it('returns "just now" for under an hour', () => {
    expect(timeAgo('2026-10-23T11:30:00Z')).toBe('just now');
  });

  it('returns hours under a day', () => {
    expect(timeAgo('2026-10-23T07:00:00Z')).toBe('5h ago');
  });

  it('returns days after 24 hours', () => {
    expect(timeAgo('2026-10-20T12:00:00Z')).toBe('3d ago');
  });
});
