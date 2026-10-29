# Architecture

## Layers

```
screens / components   presentational React, no data fetching
        |
      App.jsx          owns navigation + UI state, calls API methods
        |
 hooks/useComplaints   resolves the API once, subscribes to live data
        |
services/complaints    ComplaintsApi implementations (memory, claudeDb, future REST)
```

## The ComplaintsApi contract

Defined as JSDoc typedefs in `frontend/src/services/complaints/types.js`:

`getComplaints`, `subscribeComplaints`, `getComplaint`, `createComplaint`, `updateStatus`,
`submitFeedback`, `seedIfEmpty`.

Implementations:

| File             | When it is used                                                            |
| ---------------- | -------------------------------------------------------------------------- |
| `memoryApi.js`   | Default for local dev and tests. Data resets on reload.                    |
| `claudeDbApi.js` | Only when running as a published Claude artifact with the `db` capability. |

`frontend/src/services/complaints/index.js` (`resolveComplaintsApi`) chooses between them.

## Express API

The repository includes an Express/MongoDB API in `civicconnect-backend/`. Its endpoints and authentication are documented in `docs/API.md`. The frontend is not connected to this service yet.

To integrate it, implement `frontend/src/services/complaints/restApi.js` with a `buildRestApi(baseUrl)` adapter that maps its model and methods to the REST endpoints. Select it from `resolveComplaintsApi` when `import.meta.env.VITE_API_BASE_URL` is set. The adapter must handle authentication, multipart photo upload, and update notifications (polling or SSE/WebSocket).

No screen or component should need to change.

## Routing

Navigation is a plain state machine (`SCREENS` in `frontend/src/constants/screens.js`). It was kept deliberately
simple for the MVP; adopt `react-router` when deep links are needed.

## Styling

Plain CSS with design tokens in `frontend/src/styles/variables.css` (including dark-mode overrides). Files are
imported in order from `frontend/src/styles/index.css`.
