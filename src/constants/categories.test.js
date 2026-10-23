import { describe, expect, it } from 'vitest';
import { CATEGORIES, categoryMeta } from './categories.js';

describe('categoryMeta', () => {
  it('finds a known category', () => {
    expect(categoryMeta('pothole')).toEqual(CATEGORIES[0]);
  });

  it('falls back safely for unknown ids', () => {
    expect(categoryMeta('mystery')).toEqual({ label: 'mystery', icon: 'pin' });
  });
});
