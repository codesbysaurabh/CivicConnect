# CivicConnect Backend

Express + MongoDB (Mongoose) + ImageKit. Mirrors the front-end `ComplaintsApi` service layer.

## Setup

1. From the repository root, run `npm ci` to install both workspaces.
2. Copy `.env.example` to `.env` and set `MONGODB_URI`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_PUBLIC_KEY`, and `IMAGEKIT_URL_ENDPOINT`.
3. Run `npm run backend:seed` from the repository root to add sample field workers, then `npm run backend:dev` to start the API at http://localhost:5000/api/health.

In MongoDB Atlas, allow your IP under Network Access, and put the database name in the URI (`.../civicconnect?...`).

## Auth

- `POST /api/auth/request-otp` `{ phone }` — OTP is printed in the server console (OTP_MODE=console).
- `POST /api/auth/verify-otp` `{ phone, code }` → `{ token, user }`. In dev, `DEV_FIXED_OTP=1234` always works.
- Send `Authorization: Bearer <token>` on everything below. Phones listed in `ADMIN_PHONES` become admins.
- `GET /api/auth/me`, `PATCH /api/auth/me` `{ name }`

## Complaints (citizen)

- `POST /api/complaints` — multipart: `photo` (file), `category`, `description`, `lat`, `lng`, `address`
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

Set `NODE_ENV=production`, a 32+ character `JWT_SECRET`, and the production `CLIENT_ORIGIN`. Implement and configure an SMS provider in `src/utils/otp.js` before enabling production authentication (the fixed dev OTP is disabled in production). The frontend currently does not call this API; configure the client/API integration before deploying a connected application.
