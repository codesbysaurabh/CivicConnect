# CivicConnect Backend

Express + MongoDB (Mongoose) + ImageKit. Mirrors the front-end `ComplaintsApi` service layer.

## Setup

1. From the repository root, run `npm ci` to install both workspaces.
2. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_PUBLIC_KEY`, and `IMAGEKIT_URL_ENDPOINT`.
3. Run `npm run backend:dev` from the repository root to start the API at http://localhost:5000/api/health.
4. Register an account in the frontend. Set its email in `ADMIN_EMAILS` before registering if it should be an administrator.
5. Demo seeding is disabled by default. To intentionally create four sample workers and four sample complaints, set `SEED_DEMO_DATA=true` in `backend/.env`, register an account, then run `npm run backend:seed`.

In MongoDB Atlas, allow your IP under Network Access, and put the database name in the URI (`.../civicconnect?...`).

## Auth

- `POST /api/auth/register` `{ email, password }` → `{ token, user }` (passwords must be at least 8 characters).
- `POST /api/auth/login` `{ email, password }` → `{ token, user }`.
- Send `Authorization: Bearer <token>` on protected API routes. Emails listed in `ADMIN_EMAILS` become admins at registration.
- `GET /api/auth/me`, `PATCH /api/auth/me` `{ name }`

When upgrading an existing database from phone OTP, replace the old non-sparse phone index once in MongoDB: `db.users.dropIndex("phone_1")`, then `db.users.createIndex({ phone: 1 }, { unique: true, sparse: true })`. This allows new email accounts to omit phone numbers while preserving uniqueness for any legacy phone values.

## Complaints (citizen)

- `POST /api/complaints` — multipart: `photo` (file), `category`; optional `description`, `address`, `lat`, and `lng`. Latitude and longitude must be supplied together or both omitted.
- `GET /api/complaints?category=&page=&limit=` — feed
- `GET /api/complaints/mine`
- `GET /api/complaints/:id`
- `POST /api/complaints/:id/rating` `{ stars: 1-5, comment? }` — reporter only, after `resolved`, once

Categories: pothole, garbage, streetlight, water, drainage, other (edit `src/constants.js`).
Statuses: submitted → assigned → in_progress → resolved.

## Admin

- `GET /api/admin/complaints?status=&category=&assignee=&page=&limit=`
- `PATCH /api/admin/complaints/:id` `{ status?, assignee?, note? }` (assigning a new complaint auto-sets `assigned`)
- `GET /api/admin/workers`, `POST /api/admin/workers`

## Going to production

Set `NODE_ENV=production`, a 32+ character `JWT_SECRET`, the production `CLIENT_ORIGIN`, `ADMIN_EMAILS`, and the frontend's `VITE_API_URL`. Passwords are hashed with Node's scrypt implementation. Authentication tokens are stored by the frontend in local storage; use HTTPS in production. Email verification and password reset are not implemented.
