const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function req(path, opts = {}) {
  try {
    const r = await fetch(API_BASE + path, {
      headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
      ...opts
    });
    if (!r.ok) throw new Error('API ' + r.status);
    return await r.json();
  } catch (e) {
    throw e;
  }
}
export const api = {
  get: (p) => req(p),
  post: (p, body) => req(p, { method: 'POST', body: JSON.stringify(body) }),
  patch: (p, body) => req(p, { method: 'PATCH', body: JSON.stringify(body) }),
  login: (staffId, password) => req('/login', { method: 'POST', body: JSON.stringify({ staffId, password }) })
};
