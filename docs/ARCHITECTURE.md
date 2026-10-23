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

Defined as JSDoc typedefs in `src/services/complaints/types.js`:

`getComplaints`, `subscribeComplaints`, `getComplaint`, `createComplaint`, `updateStatus`,
`submitFeedback`, `seedIfEmpty`.

Implementations:

| File             | When it is used                                                             |
| ---------------- | --------------------------------------------------------------------------- |
| `memoryApi.js`   | Default for local dev and tests. Data resets on reload.                     |
| `claudeDbApi.js` | Only when running as a published Claude artifact with the `db` capability.  |

`services/complaints/index.js` (`resolveComplaintsApi`) chooses between them.

## Adding a real backend

1. Create `src/services/complaints/restApi.js` exporting `buildRestApi(baseUrl)` that implements the
   contract using `fetch` (see `docs/API.md`). `subscribeComplaints` can poll or use SSE/WebSocket.
2. Return it from `resolveComplaintsApi` when `import.meta.env.VITE_API_BASE_URL` is set.
3. Replace the data-URL photo with an upload to object storage and store the returned URL.

No screen or component should need to change.

## Routing

Navigation is a plain state machine (`SCREENS` in `src/constants/screens.js`). It was kept deliberately
simple for the MVP; adopt `react-router` when deep links are needed.

## Styling

Plain CSS with design tokens in `styles/variables.css` (including dark-mode overrides). Files are
imported in order from `styles/index.css`.
