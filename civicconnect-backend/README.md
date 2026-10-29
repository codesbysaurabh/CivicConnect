# CivicConnect Backend

Express + MongoDB (Mongoose) + ImageKit. Mirrors the front-end `ComplaintsApi` service layer.

## Setup
1. Copy this folder into the repo as `server/` (or keep it separate).
2. Open `.env` and fill the 4 values marked `<<< FILL ME`:
   `MONGODB_URI`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_URL_ENDPOINT`.
3. `npm install`
4. `npm run seed` (adds sample field workers), then `npm run dev` → http://localhost:5000/api/health

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
Set `NODE_ENV=production`, a 32+ char `JWT_SECRET`, real `CLIENT_ORIGIN`, and implement an SMS provider in `src/utils/otp.js` (the fixed dev OTP is disabled in production).
