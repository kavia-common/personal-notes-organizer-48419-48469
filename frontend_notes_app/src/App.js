import React from "react";
import "./theme.css";
import "./App.css";
import Header from "./components/Header";
import NotesList from "./components/NotesList";
import NoteEditor from "./components/NoteEditor";
import { useNotes } from "./hooks/useNotes";

// PUBLIC_INTERFACE
function App() {
  /** Main application component: layout and orchestration. */
  const {
    filteredNotes,
    selectedId,
    selectedNote,
    query,
    setQuery,
    select,
    addNew,
    save,
    remove,
    error,
    loading,
  } = useNotes();

  return (
    <div className="app">
      <Header onAdd={addNew} />
      {error ? (
        <div style={{ padding: 12 }}>
          <div
            role="alert"
            style={{
              background: "#FEF2F2",
              color: "#991B1B",
              border: "1px solid #FECACA",
              borderRadius: 12,
              padding: "10px 12px",
            }}
          >
            {error}
          </div>
        </div>
      ) : null}
      <main className="main" role="main">
        <NotesList
          notes={filteredNotes}
          activeId={selectedId}
          query={query}
          onQuery={setQuery}
          onSelect={select}
        />
        {loading ? (
          <section className="panel editor-panel" aria-busy="true">
            <div className="editor-body">
              <div className="empty-state">
                <h3>Loading...</h3>
                <p>Please wait while we fetch your notes.</p>
              </div>
            </div>
          </section>
        ) : (
          <NoteEditor note={selectedNote} onSave={save} onDelete={remove} />
        )}
      </main>

      <button className="fab" onClick={addNew} aria-label="Add note">＋</button>
    </div>
  );
}

export default App;
