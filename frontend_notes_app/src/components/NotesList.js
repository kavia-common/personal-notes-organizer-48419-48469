import React from "react";

// PUBLIC_INTERFACE
export default function NotesList({
  notes,
  activeId,
  query,
  onQuery,
  onSelect,
}) {
  /** Left panel: search and notes list. */
  return (
    <aside className="panel list-panel" aria-label="Notes list">
      <div className="list-header">
        <div className="search-input" role="search">
          <span aria-hidden="true" style={{ color: "#6B7280" }}>🔎</span>
          <input
            aria-label="Search notes"
            placeholder="Search notes..."
            value={query}
            onChange={(e) => onQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="list-body">
        {notes.length === 0 ? (
          <div className="empty-state">
            <h3>No notes found</h3>
            <p>Try adjusting your search or create a new note.</p>
          </div>
        ) : (
          notes.map((n) => (
            <button
              key={n.id}
              className={`note-item ${activeId === n.id ? "active" : ""}`}
              onClick={() => onSelect(n.id)}
              aria-pressed={activeId === n.id}
            >
              <h4 className="note-item-title">{n.title || "Untitled"}</h4>
              <div className="note-item-meta">
                <span title="Last updated">
                  {n.updatedAt ? new Date(n.updatedAt).toLocaleString() : ""}
                </span>
                <span>
                  {(n.content || "").length > 0
                    ? `${(n.content || "").length} chars`
                    : "Empty"}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
