# CivicConnect

CivicConnect is a civic issue reporting web app. Citizens can submit a photo and description of a local issue, follow its status, and rate a resolution. Administrators can assign reports to field workers and update their status.

The project contains a React/Vite frontend and an Express/MongoDB API. Email/password authentication and the complaint screens use the API; complaint photo uploads are stored with ImageKit. GPS coordinates are optional.

## Requirements

- Node.js 20 or newer (see `.nvmrc`)
- npm
- MongoDB and ImageKit accounts

## Install and run locally

From the repository root, install dependencies:

```bash
npm ci
```

Create `backend/.env` from the example and fill in the credentials:

```powershell
Copy-Item backend/.env.example backend/.env
```

Set `MONGODB_URI`, the three ImageKit values, a long random `JWT_SECRET`, and the admin email address or addresses in `ADMIN_EMAILS`. Never commit `backend/.env` or share its secrets.

Run the frontend and backend in separate terminals:

```bash
npm run dev
npm run backend:dev
```

The frontend is at `http://localhost:5173`; the API health endpoint is `http://localhost:5000/api/health`. The frontend defaults to that API URL. Set `VITE_API_URL` at frontend build time if the API runs elsewhere.

Register an account using an email in `ADMIN_EMAILS` to get the admin role. Registering another email creates a citizen account. Demo data is optional and disabled by default. To intentionally load the sample workers and reports, set `SEED_DEMO_DATA=true` in `backend/.env`, then run:

```bash
npm run backend:seed
```

The seed command adds four field workers and four sample reports across the workflow statuses. Run it after registering an account so it can attach reports to a user. Delete sample reports by their `CC-DEMO` ticket IDs when cleaning the database; the script does not restore a partially deleted set while any seeded reports remain.

## Scripts

| Command                 | Purpose                                     |
| ----------------------- | ------------------------------------------- |
| `npm run dev`           | Start the frontend development server       |
| `npm run build`         | Build frontend assets into `frontend/dist/` |
| `npm run preview`       | Preview the frontend production build       |
| `npm run lint`          | Lint frontend and backend source            |
| `npm test`              | Run frontend unit tests                     |
| `npm run backend:dev`   | Start the API in watch mode                 |
| `npm run backend:start` | Start the API                               |
| `npm run backend:seed`  | Seed demo workers and reports               |

## Project structure

```text
civicconnect/
├── .github/workflows/  CI workflow
├── backend/            Express API, MongoDB models, routes, middleware
├── docs/               API contract and architecture notes
├── frontend/           React app, static assets, Vite configuration
├── package.json        npm workspace scripts
└── package-lock.json   reproducible dependency lockfile
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/API.md](docs/API.md), and [backend/README.md](backend/README.md) for more detail.

## Current limitations

- Password reset and email verification are not implemented.
- The admin email role is applied when the account is registered. Adding an email to `ADMIN_EMAILS` later does not promote an existing account automatically.
- The UI refreshes complaint lists by polling the API every 15 seconds; it does not use push updates.
- The detail screen shows a location marker mock rather than an interactive map.

For deployment, configure production MongoDB and ImageKit credentials, a strong `JWT_SECRET`, the frontend origin in `CLIENT_ORIGIN`, and `VITE_API_URL` for the deployed API. Use HTTPS.
