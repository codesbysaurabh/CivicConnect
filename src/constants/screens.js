/** Screen identifiers used by the state-based router in App.jsx. */
export const SCREENS = Object.freeze({
  HOME: 'home',
  REPORT: 'report',
  REPORTS: 'reports',
  DETAIL: 'detail',
  RATE: 'rate',
});

/** Screens that show the bottom navigation bar. */
export const SCREENS_WITH_NAV = [SCREENS.HOME, SCREENS.REPORTS];
