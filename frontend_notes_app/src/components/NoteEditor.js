import React, { useEffect, useState } from "react";

// PUBLIC_INTERFACE
export default function NoteEditor({ note, onSave, onDelete }) {
  /**
   * Right panel: editor/viewer for selected note.
   * onSave(id, {title, content}), onDelete(id)
   */
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
  }, [note?.id]); // reset on selection change

  if (!note) {
    return (
      <section className="panel editor-panel" aria-label="Note editor">
        <div className="editor-body">
          <div className="empty-state">
            <h3>Select a note</h3>
            <p>Choose a note from the left, or create a new one.</p>
          </div>
        </div>
      </section>
    );
  }

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await onSave(note.id, { title: title.trim() || "Untitled", content });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this note? This action cannot be undone.")) {
      return;
    }
    await onDelete(note.id);
  };

  return (
    <section className="panel editor-panel" aria-label="Note editor">
      <div className="editor-toolbar">
        <button className="btn" onClick={handleSave} disabled={saving} aria-label="Save note">
          💾 Save
        </button>
        <button className="btn ghost" onClick={() => { setTitle(note.title || ""); setContent(note.content || ""); }} aria-label="Reset changes">
          ↩ Reset
        </button>
        <div style={{ flex: 1 }} />
        <button className="btn danger" onClick={handleDelete} aria-label="Delete note">
          🗑 Delete
        </button>
      </div>
      <div className="editor-body">
        <div style={{ display: "grid", gap: 12 }}>
          <input
            className="input"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Note title"
          />
          <textarea
            className="textarea"
            placeholder="Write your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            aria-label="Note content"
          />
        </div>
      </div>
    </section>
  );
}
