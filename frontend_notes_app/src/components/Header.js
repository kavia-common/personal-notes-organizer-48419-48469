import React from "react";
import { isApiEnabled } from "../storage";

// PUBLIC_INTERFACE
export default function Header({ onAdd }) {
  /** App top header with brand and actions. */
  return (
    <header className="header" role="banner">
      <div className="brand" aria-label="App brand">
        <div className="brand-logo" aria-hidden="true" />
        <div className="brand-title">Ocean Notes</div>
      </div>
      <div className="header-actions">
        <span className="badge" title={isApiEnabled() ? "Using Backend API" : "Using Local Storage"}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3l7 4v10l-7 4-7-4V7l7-4z" stroke="#2563EB" strokeWidth="2" />
          </svg>
          {isApiEnabled() ? "API" : "Local"}
        </span>
        <button className="btn secondary" onClick={onAdd} aria-label="Create new note">
          + New Note
        </button>
      </div>
    </header>
  );
}
