/** Issue categories a citizen can report. `icon` is a key into components/Icon. */
export const CATEGORIES = [
  { id: 'pothole', label: 'Pothole', icon: 'pothole' },
  { id: 'garbage', label: 'Garbage', icon: 'garbage' },
  { id: 'streetlight', label: 'Streetlight', icon: 'streetlight' },
  { id: 'water', label: 'Water Leak', icon: 'water' },
  { id: 'drainage', label: 'Drainage', icon: 'water' },
  { id: 'other', label: 'Other civic issue', icon: 'pin' },
];

/** Look up a category by id, with a safe fallback for unknown ids. */
export function categoryMeta(id) {
  return CATEGORIES.find((c) => c.id === id) || { label: id, icon: 'pin' };
}
