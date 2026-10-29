/**
 * @typedef {'submitted' | 'progress' | 'resolved'} ComplaintStatus
 *
 * @typedef {Object} TimelineEntry
 * @property {string} label
 * @property {string} time
 * @property {boolean} done
 *
 * @typedef {Object} Complaint
 * @property {string} id
 * @property {string} ticketId
 * @property {string} category
 * @property {string} description
 * @property {ComplaintStatus} status
 * @property {string} createdAt            ISO 8601
 * @property {string | null} resolvedAt    ISO 8601
 * @property {string} location
 * @property {string | null} photo         data URL (mock) / URL (real API)
 * @property {number | null} rating        1-5
 * @property {string | null} assignedTo
 * @property {string | null} assigneeId
 * @property {TimelineEntry[]} timeline
 *
 * @typedef {Object} ComplaintsApi
 * @property {() => Promise<Complaint[]>} getComplaints
 * @property {(onChange: (list: Complaint[]) => void, onError?: (err: unknown) => void) => () => void} subscribeComplaints
 * @property {(id: string) => Promise<Complaint | null>} getComplaint
 * @property {() => Promise<Complaint[]>} [getMyComplaints]
 * @property {() => Promise<Complaint[]>} [getAdminComplaints]
 * @property {() => Promise<Array<{_id: string, name: string, area?: string}>>} [getWorkers]
 * @property {(worker: {name: string, area?: string, phone?: string}) => Promise<{_id: string, name: string, area?: string, phone?: string}>} [createWorker]
 * @property {(data: {category: string, description: string, location: string, address: string, lat: number, lng: number, photo: string}) => Promise<Complaint>} createComplaint
 * @property {(id: string, status: ComplaintStatus, assigneeId?: string | null) => Promise<Complaint | null>} updateStatus
 * @property {(id: string, rating: number, comment?: string) => Promise<Complaint | null>} submitFeedback
 * @property {() => Promise<void>} seedIfEmpty
 */
export {};
