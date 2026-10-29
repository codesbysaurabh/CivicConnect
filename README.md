# CivicConnect

CivicConnect is a civic issue reporting project with a React/Vite web client and an Express/MongoDB API. The repository contains both applications, their configuration, API and architecture documentation, and CI workflow.

## Project status

The frontend is an MVP prototype and currently uses in-memory demo data (or the Claude artifact database when available). The Express API is implemented separately under `civicconnect-backend/`, but the frontend has not yet been wired to it. Production deployment therefore requires completing frontend/API integration and configuring a real SMS OTP provider, in addition to supplying the backend services below.

## Requirements

- Node.js 20 or newer (see `.nvmrc`)
- npm
- MongoDB and ImageKit credentials to run the API

## Install and run

Install dependencies for both apps from the repository root:

```bash
npm ci
```

Create the backend environment file from the safe example, then fill in the service credentials:

```powershell
Copy-Item civicconnect-backend/.env.example civicconnect-backend/.env
```

Start each application in its own terminal:

```bash
npm run dev
npm run backend:dev
```

The web app runs at `http://localhost:5173`; the API health endpoint is `http://localhost:5000/api/health`. For production, build the frontend with `npm run build` and start the API with `npm run backend:start`. Deploy the frontend static `frontend/dist/` directory and API as separately configured services.

## Scripts

| Command                 | Purpose                                     |
| ----------------------- | ------------------------------------------- |
| `npm run dev`           | Start the frontend development server       |
| `npm run build`         | Build frontend assets into `frontend/dist/` |
| `npm run preview`       | Preview the frontend production build       |
| `npm run lint`          | Lint the frontend source                    |
| `npm test`              | Run frontend unit tests                     |
| `npm run backend:dev`   | Start the API in watch mode                 |
| `npm run backend:start` | Start the API                               |
| `npm run backend:seed`  | Seed sample field workers                   |

Run `npm install` after changing dependencies in either workspace to update the shared lockfile. A fresh setup uses `npm ci` from the repository root.

## Structure

```text
civicconnect/
├── .github/workflows/       CI workflow
├── civicconnect-backend/    Express API, MongoDB models, routes, middleware
├── docs/                    API contract and architecture notes
├── frontend/                React app, static assets, Vite config, dependencies
├── package.json             Workspace scripts and shared tooling
└── package-lock.json        Reproducible dependency lock for both apps
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/API.md](docs/API.md), and [civicconnect-backend/README.md](civicconnect-backend/README.md) for details.

## Deployment configuration

Never commit `.env` files or production credentials. Configure `MONGODB_URI`, ImageKit keys, a strong `JWT_SECRET` (32+ characters), `CLIENT_ORIGIN`, and an SMS provider before deploying the API. The current API's OTP utility only logs codes to the server console; a production SMS integration is still required. The frontend currently uses mock/persistent artifact storage and does not call this API yet.
