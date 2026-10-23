export function StatusBadge({ status }) {
  const map = {
    submitted: { cls: "badge-submitted", label: "Submitted" },
    progress: { cls: "badge-progress", label: "In progress" },
    resolved: { cls: "badge-resolved", label: "Resolved" },
  };
  const s = map[status] || map.submitted;
  return <span className={`badge ${s.cls}`}><span className="dot"></span>{s.label}</span>;
}
