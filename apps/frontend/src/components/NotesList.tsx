import React from "react";
import { Note } from "../types/note";
import "./NotesList.css";

interface NotesListProps {
  notes: Note[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
}

const NotesList: React.FC<NotesListProps> = ({ notes, selectedId, onSelect, onCreate }) => {
  return (
    <div className="notes-list">
      <div className="notes-header">
        <div className="notes-header-left">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-6-6z"/>
            <polyline points="12 2 12 8 18 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          <h2>Заметки</h2>
          <span className="notes-count">{notes.length}</span>
        </div>
      </div>

      <div className="notes-footer">
        <div className="notes-footer-divider"></div>
        <button className="create-btn-bottom" onClick={onCreate}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#898989" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Новая заметка
        </button>
      </div>
      
      <div className="notes-container">
        {notes.length === 0 ? (
          <div className="empty-state">
            <p>Заметок пока нет.</p>
            <p>Создайте первую.</p>
          </div>
        ) : (
          notes.map((note) => (
            <div 
              key={note.id}
              className={`note-item ${selectedId === note.id ? "selected" : ""}`}
              onClick={() => onSelect(note.id)}
            >
              <div className="note-item-title">{note.title}</div>
              <div className="note-item-date">
                {new Date(note.createdAt).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesList;
