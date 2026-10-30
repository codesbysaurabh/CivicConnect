# CivicConnect API

The Express API lives in `backend/`. Every route below is prefixed with `/api`. All routes under `/auth` except registration and login, and all routes under `/complaints` and `/admin`, require `Authorization: Bearer <token>`. Responses are JSON except complaint creation, which uses `multipart/form-data`.

## Authentication

| Method | Endpoint         | Request / response                                                              |
| ------ | ---------------- | ------------------------------------------------------------------------------- |
| POST   | `/auth/register` | `{ email, password }` → `{ token, user }`; password length is 8–128 characters. |
| POST   | `/auth/login`    | `{ email, password }` → `{ token, user }`.                                      |
| GET    | `/auth/me`       | Returns the signed-in user.                                                     |
| PATCH  | `/auth/me`       | `{ name }` → updated user.                                                      |

Passwords are hashed with Node's scrypt implementation. Authentication attempts are rate-limited. Emails listed in `ADMIN_EMAILS` receive the admin role when the account is registered. The API does not currently provide email verification or password reset.

## Citizen complaints

| Method | Endpoint                 | Details                                                                                                                                                |
| ------ | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| POST   | `/complaints`            | Multipart fields: required `photo`, `category`; optional `description`, `address`, `lat`, `lng`. Provide latitude and longitude together or omit both. |
| GET    | `/complaints`            | Recent complaint feed; optional `category`, `page`, `limit`.                                                                                           |
| GET    | `/complaints/mine`       | Complaints submitted by the signed-in user.                                                                                                            |
| GET    | `/complaints/:id`        | One complaint by MongoDB ID.                                                                                                                           |
| POST   | `/complaints/:id/rating` | `{ stars: 1..5, comment? }`; reporter only, after resolution, once.                                                                                    |

Categories: `pothole`, `garbage`, `streetlight`, `water`, `drainage`, `other`.

Statuses: `submitted`, `assigned`, `in_progress`, `resolved`. The frontend displays both `assigned` and `in_progress` as “In progress.”

## Administration

Admin routes require a user whose email was listed in `ADMIN_EMAILS` when the account was registered.

| Method | Endpoint                | Details                                                                                                                                    |
| ------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| GET    | `/admin/complaints`     | Optional `status`, `category`, `assignee`, `page`, `limit`.                                                                                |
| PATCH  | `/admin/complaints/:id` | `{ status?, assignee?, note? }`; `assignee` is a worker ID or `null`. Assigning a worker to a new complaint sets its status to `assigned`. |
| GET    | `/admin/workers`        | List active field workers.                                                                                                                 |
| POST   | `/admin/workers`        | `{ name, phone?, area? }`.                                                                                                                 |

`GET /health` is public and returns API and database health state.

## Frontend integration

The frontend uses `frontend/src/services/complaints/restApi.js` when a user is authenticated. It sends the JWT, uploads photos as multipart form data, maps server records to the screen model, and polls the feed every 15 seconds. Set `VITE_API_URL` to override the default `http://localhost:5000/api` base URL.
