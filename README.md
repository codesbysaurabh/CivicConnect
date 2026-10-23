# CivicConnect

Phase 1 MVP of CivicConnect: citizens report civic issues (potholes, garbage, broken streetlights and
so on) with a photo and location, track them through to resolution, and rate the outcome. Admins triage
complaints and assign them to field workers.

> Status: front-end prototype running on mock data. There is no real backend or authentication yet.

## Quick start

```bash
nvm use            # Node 20 (see .nvmrc)
npm install
npm run dev        # http://localhost:5173
```

| Script                 | Purpose                          |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Start the Vite dev server        |
| `npm run build`        | Production build into `dist/`    |
| `npm run preview`      | Serve the production build       |
| `npm run lint`         | ESLint                           |
| `npm run format`       | Prettier (write). Run once after install, then add `npm run format:check` to CI |
| `npm test`             | Unit tests (Vitest)              |

## Using the prototype

- **Login:** any 10-digit phone number, then any 4-digit code.
- **Report an issue:** Report tab, take or upload a photo, pick a category, add a description.
- **Admin view:** Admin tab in the bottom nav (wide table layout for changing status and assignee).
- Without a backend, data lives in memory and resets on reload (the app shows a "Demo mode" banner).

## Project structure

```
civicconnect/
├── public/                  Static assets (favicon)
├── docs/
│   ├── ARCHITECTURE.md      How the app is layered, and how to swap in a real backend
│   └── API.md               Target REST contract that the service layer mirrors
├── src/
│   ├── main.jsx             Entry point
│   ├── App.jsx              Root component and state-based router
│   ├── components/          Reusable UI (Icon, StatusBadge, CameraCapture, BottomNav, ...)
│   ├── screens/             One file per screen (Login, Home, Report, MyReports, Detail, Rate, Admin)
│   ├── hooks/               useComplaints: resolves the API and subscribes to live data
│   ├── services/            Data access
│   │   ├── photo.js         Client-side photo compression
│   │   └── complaints/      ComplaintsApi implementations + factory + JSDoc types
│   ├── constants/           Categories, statuses, screens, field workers
│   ├── data/                Seed / demo data
│   ├── config/              App-level config (demo user)
│   ├── utils/               Pure helpers (time, ids)
│   └── styles/              CSS split into tokens, base, layout, components, screens
├── .github/workflows/ci.yml Lint, format check, test, build on every PR
└── eslint.config.js, .prettierrc, .editorconfig, vite.config.js, package.json
```

## Architecture in one paragraph

Screens never talk to storage directly. They receive data and callbacks from `App.jsx`, which gets a
`ComplaintsApi` from the `useComplaints` hook. The hook asks `services/complaints/index.js` for the best
available implementation (in-memory today). Every implementation exposes the same method signatures, so
moving to a real REST backend means adding one file and changing one line. See
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/API.md](docs/API.md).

## Roadmap

- Real authentication (phone OTP provider) replacing the mock login
- REST `ComplaintsApi` implementation and image upload to object storage
- Real map and reverse geocoding for the location card
- Notifications, router (react-router) and role-based admin access
- Component tests (Testing Library) and end-to-end tests (Playwright)
