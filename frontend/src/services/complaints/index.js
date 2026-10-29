import { buildClaudeDbApi } from './claudeDbApi.js';
import { buildMemoryApi } from './memoryApi.js';
import { buildRestApi } from './restApi.js';

/**
 * Picks the best available ComplaintsApi.
 *  - `ready`:   authenticated REST API or persistent Claude artifact is available
 *  - `offline`: in-memory demo data; nothing survives a reload
 */
export async function resolveComplaintsApi({ authenticated = false } = {}) {
  if (authenticated || import.meta.env.VITE_API_URL) {
    const api = buildRestApi(import.meta.env.VITE_API_URL || 'http://localhost:5000/api');
    return { api, mode: 'ready' };
  }
  const runtime = typeof window !== 'undefined' ? window.claude : undefined;
  const db = runtime && runtime.use ? await runtime.use('db') : null;
  const api = db ? buildClaudeDbApi(db) : buildMemoryApi();
  await api.seedIfEmpty();
  return { api, mode: db ? 'ready' : 'offline' };
}

export { buildMemoryApi, buildClaudeDbApi, buildRestApi };
