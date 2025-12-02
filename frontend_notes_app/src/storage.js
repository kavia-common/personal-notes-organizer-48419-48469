const API_BASE =
  (process.env.REACT_APP_API_BASE && process.env.REACT_APP_API_BASE.trim()) ||
  (process.env.REACT_APP_BACKEND_URL && process.env.REACT_APP_BACKEND_URL.trim()) ||
  "";

const hasApi = !!API_BASE;

// Basic helper for fetch with JSON
async function jsonFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed (${res.status}): ${text || res.statusText}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

const localKey = "notes-app-items-v1";

// PUBLIC_INTERFACE
export function isApiEnabled() {
  /** Returns true if an API base URL is configured via env. */
  return hasApi;
}

// PUBLIC_INTERFACE
export async function listNotes() {
  /** List all notes. Uses API if configured, else localStorage. */
  if (hasApi) {
    return jsonFetch(`${API_BASE}/notes`, { method: "GET" });
  }
  const raw = localStorage.getItem(localKey);
  const arr = raw ? JSON.parse(raw) : [];
  return arr.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

// PUBLIC_INTERFACE
export async function getNote(id) {
  /** Get a single note by id. */
  if (hasApi) {
    return jsonFetch(`${API_BASE}/notes/${encodeURIComponent(id)}`, { method: "GET" });
  }
  const raw = localStorage.getItem(localKey);
  const arr = raw ? JSON.parse(raw) : [];
  return arr.find((n) => n.id === id) || null;
}

// PUBLIC_INTERFACE
export async function createNote(partial) {
  /** Create a new note. partial: {title, content} */
  if (hasApi) {
    return jsonFetch(`${API_BASE}/notes`, {
      method: "POST",
      body: JSON.stringify(partial),
    });
  }
  const now = Date.now();
  const note = {
    id: crypto.randomUUID(),
    title: partial.title || "Untitled",
    content: partial.content || "",
    createdAt: now,
    updatedAt: now,
  };
  const raw = localStorage.getItem(localKey);
  const arr = raw ? JSON.parse(raw) : [];
  arr.push(note);
  localStorage.setItem(localKey, JSON.stringify(arr));
  return note;
}

// PUBLIC_INTERFACE
export async function updateNote(id, updates) {
  /** Update an existing note by id. updates: {title?, content?} */
  if (hasApi) {
    return jsonFetch(`${API_BASE}/notes/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }
  const raw = localStorage.getItem(localKey);
  const arr = raw ? JSON.parse(raw) : [];
  const idx = arr.findIndex((n) => n.id === id);
  if (idx === -1) throw new Error("Note not found");
  const updated = { ...arr[idx], ...updates, updatedAt: Date.now() };
  arr[idx] = updated;
  localStorage.setItem(localKey, JSON.stringify(arr));
  return updated;
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note by id. */
  if (hasApi) {
    await jsonFetch(`${API_BASE}/notes/${encodeURIComponent(id)}`, { method: "DELETE" });
    return true;
  }
  const raw = localStorage.getItem(localKey);
  const arr = raw ? JSON.parse(raw) : [];
  const next = arr.filter((n) => n.id !== id);
  localStorage.setItem(localKey, JSON.stringify(next));
  return true;
}
