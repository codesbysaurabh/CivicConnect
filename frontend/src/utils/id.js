/** Mock complaint id, e.g. "CC-4821". The real backend will own id generation. */
export function generateComplaintId() {
  return 'CC-' + Math.floor(1000 + Math.random() * 9000);
}
