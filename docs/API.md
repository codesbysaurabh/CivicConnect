# Target REST API

The service layer mirrors this contract, so each method maps to one endpoint. This is the intended
shape for the backend; it is not implemented yet.

| Method | Endpoint                      | Service method        | Notes                                   |
| ------ | ----------------------------- | --------------------- | --------------------------------------- |
| GET    | `/complaints`                 | `getComplaints`       | Newest first, paginated                 |
| GET    | `/complaints/:id`             | `getComplaint`        | 404 when missing                        |
| POST   | `/complaints`                 | `createComplaint`     | Body: category, description, location, photo |
| PATCH  | `/complaints/:id`             | `updateStatus`        | Body: status, assignedTo (admin only)   |
| POST   | `/complaints/:id/feedback`    | `submitFeedback`      | Body: rating (1-5), resolved complaints only |

## Complaint

```json
{
  "id": "CC-1042",
  "category": "pothole",
  "description": "Large pothole near the bus stop.",
  "status": "submitted | progress | resolved",
  "createdAt": "2026-10-14T09:12:00Z",
  "resolvedAt": null,
  "location": "MG Road, near Sector 14 bus stop",
  "photo": "https://.../photo.jpg",
  "rating": null,
  "assignedTo": "Ramesh K.",
  "timeline": [{ "label": "Submitted", "time": "Oct 14, 9:12 AM", "done": true }]
}
```

Categories: `pothole`, `garbage`, `streetlight`, `water`, `road`, `sanitation`.
