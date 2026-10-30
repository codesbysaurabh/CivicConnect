# Architecture

## Frontend layers

```text
screens / components   render views and collect user input
        |
      App.jsx          owns screen navigation and invokes API methods
        |
 hooks/useComplaints   loads feed, citizen reports and admin data
        |
services/complaints    adapts app operations to the selected data source
```

The `ComplaintsApi` contract is documented in `frontend/src/services/complaints/types.js`.

| Adapter          | Use                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------ |
| `restApi.js`     | Authenticated users; sends JWTs to the Express API and polls for updates every 15 seconds. |
| `memoryApi.js`   | In-memory demo data for the unauthenticated fallback; data resets when the page reloads.   |
| `claudeDbApi.js` | Persistent Claude artifact database when that runtime is available.                        |

`services/complaints/index.js` selects the REST adapter after authentication or when `VITE_API_URL` is configured. The REST adapter translates the backend's status names and MongoDB records into the view model, converts captured photos to multipart uploads, and handles reports with or without GPS coordinates.

## Backend

The Express API is in `backend/`. MongoDB models live in `backend/src/models/`; routes are grouped by authentication, citizen complaints, and administration. JWT authentication protects complaint and admin endpoints. ImageKit stores photos uploaded with new reports.

The REST API contract is documented in [API.md](API.md). The frontend uses `/complaints` for the recent feed, `/complaints/mine` for the signed-in user's reports, and `/admin/*` for administrator views and updates.

## Navigation and styling

Navigation is a plain state machine (`SCREENS` in `frontend/src/constants/screens.js`). Adopt React Router if deep links become necessary.

Styling uses plain CSS with design tokens in `frontend/src/styles/variables.css`. Styles are imported in order from `frontend/src/styles/index.css`.
