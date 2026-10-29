# CivicConnect API

The Express API lives in `civicconnect-backend/`. All routes below are prefixed with `/api`. Routes under `/complaints` and `/admin` require `Authorization: Bearer <token>`; auth routes issue and inspect tokens. Responses use JSON except complaint creation, which accepts `multipart/form-data`.

## Authentication

| Method | Endpoint            | Body / response                       |
| ------ | ------------------- | ------------------------------------- |
| POST   | `/auth/request-otp` | `{ phone }`                           |
| POST   | `/auth/verify-otp`  | `{ phone, code }` → `{ token, user }` |
| GET    | `/auth/me`          | Current user                          |
| PATCH  | `/auth/me`          | `{ name }` → updated user             |

The current OTP utility logs the code to the API console. A real SMS provider is needed before production use.

## Citizen complaints

| Method | Endpoint                 | Details                                                                                         |
| ------ | ------------------------ | ----------------------------------------------------------------------------------------------- |
| POST   | `/complaints`            | Multipart fields: required `photo`, `category`, `lat`, `lng`; optional `description`, `address` |
| GET    | `/complaints`            | Feed; optional `category`, `page`, `limit`                                                      |
| GET    | `/complaints/mine`       | Current user's complaints                                                                       |
| GET    | `/complaints/:id`        | One complaint                                                                                   |
| POST   | `/complaints/:id/rating` | `{ stars: 1..5, comment? }`; reporter only, resolved complaints only, once                      |

Categories are `pothole`, `garbage`, `streetlight`, `water`, `drainage`, and `other`. Statuses are `submitted`, `assigned`, `in_progress`, and `resolved`.

## Administration

Admin routes require a user whose phone is listed in `ADMIN_PHONES`.

| Method | Endpoint                | Details                                                                    |
| ------ | ----------------------- | -------------------------------------------------------------------------- |
| GET    | `/admin/complaints`     | Optional `status`, `category`, `assignee`, `page`, `limit`                 |
| PATCH  | `/admin/complaints/:id` | `{ status?, assignee?, note? }`; assigning a new complaint sets `assigned` |
| GET    | `/admin/workers`        | List active workers                                                        |
| POST   | `/admin/workers`        | `{ name, phone?, area? }`                                                  |

`GET /health` is public and returns API and database health state.

## Frontend integration status

The frontend currently uses an in-memory demo adapter or the Claude artifact database adapter. A REST adapter that maps the frontend's complaint model to these endpoints has not been implemented yet.
