import { buildClaudeDbApi } from './claudeDbApi.js';
import { buildMemoryApi } from './memoryApi.js';

/**
 * Picks the best available ComplaintsApi.
 *  - `ready`:   persistent db capability is available (published Claude artifact)
 *  - `offline`: in-memory demo data; nothing survives a reload
 *
 * To plug in a real backend, add a `restApi.js` next to this file and return it here.
 */
export async function resolveComplaintsApi() {
  const runtime = typeof window !== 'undefined' ? window.claude : undefined;
  const db = runtime && runtime.use ? await runtime.use('db') : null;
  const api = db ? buildClaudeDbApi(db) : buildMemoryApi();
  await api.seedIfEmpty();
  return { api, mode: db ? 'ready' : 'offline' };
}

export { buildMemoryApi, buildClaudeDbApi };
