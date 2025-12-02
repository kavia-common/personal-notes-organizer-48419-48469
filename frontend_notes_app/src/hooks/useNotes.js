import { useCallback, useEffect, useMemo, useState } from "react";
import { listNotes, createNote, updateNote, deleteNote } from "../storage";

// PUBLIC_INTERFACE
export function useNotes() {
  /**
   * Manage notes state: load, create, update, remove, filter, and selection.
   * Returns shape:
   * {
   *   notes, filteredNotes, selectedId, selectedNote, query,
   *   setQuery, select, load, addNew, save, remove, error, loading
   * }
   */
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listNotes();
      setNotes(data || []);
      if (data && data.length && !selectedId) {
        setSelectedId(data[0].id);
      }
    } catch (e) {
      setError(e?.message || "Failed to load notes.");
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredNotes = useMemo(() => {
    if (!query) return notes;
    const q = query.toLowerCase();
    return notes.filter(
      (n) =>
        (n.title || "").toLowerCase().includes(q) ||
        (n.content || "").toLowerCase().includes(q)
    );
  }, [notes, query]);

  const selectedNote = useMemo(() => {
    return notes.find((n) => n.id === selectedId) || null;
  }, [notes, selectedId]);

  const select = useCallback((id) => setSelectedId(id), []);

  const addNew = useCallback(async () => {
    setError("");
    try {
      const created = await createNote({ title: "Untitled", content: "" });
      setNotes((prev) => [created, ...prev]);
      setSelectedId(created.id);
    } catch (e) {
      setError(e?.message || "Failed to create note.");
    }
  }, []);

  const save = useCallback(async (id, updates) => {
    setError("");
    try {
      const updated = await updateNote(id, updates);
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    } catch (e) {
      setError(e?.message || "Failed to save note.");
    }
  }, []);

  const remove = useCallback(async (id) => {
    setError("");
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      setSelectedId((prev) => (prev === id ? null : prev));
    } catch (e) {
      setError(e?.message || "Failed to delete note.");
    }
  }, []);

  return {
    notes,
    filteredNotes,
    selectedId,
    selectedNote,
    query,
    setQuery,
    select,
    load,
    addNew,
    save,
    remove,
    error,
    loading,
  };
}
