import React, { useState, useEffect } from "react";
import { Note } from "../types/note";
import "./NoteEditor.css";

interface NoteEditorProps {
  note: Note | undefined;
  isCreating: boolean;
  onSave: (title: string, content: string) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ 
  note, 
  isCreating, 
  onSave, 
  onCancel, 
  onDelete 
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (note && !isCreating) {
      setTitle(note.title);
      setContent(note.content);
    } else if (isCreating) {
      setTitle("");
      setContent("");
    }
  }, [note, isCreating]);

  const handleSave = () => {
    onSave(title, content);
  };

  const handleDelete = () => {
    if (note && window.confirm("Удалить заметку?")) {
      onDelete(note.id);
    }
  };

  if (!note && !isCreating) {
    return (
      <div className="note-editor empty">
        <div className="empty-editor-state">
          <svg 
            className="empty-icon" 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#A4A4A4" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            onClick={() => onSave("", "")}
            style={{ cursor: "pointer" }}
          >
            <path d="M12 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-6-6z"/>
            <polyline points="12 2 12 8 18 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          <p>Нет выбранных заметок</p>
          <p className="empty-hint">Выберите заметку слева или создайте новую</p>
          <button className="create-note-btn" onClick={() => onSave("", "")}>
            + создать заметку
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="note-editor">
      <div className="editor-header">
        <div className="editor-header-left">
          <button className="burger-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div className="editor-header-divider"></div>
          {isCreating ? (
            <span className="editor-title">Новая заметка</span>
          ) : (
            <input 
              type="text"
              className="editor-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название заметки"
            />
          )}
        </div>
      </div>

      <div className="editor-body">
        {isCreating && (
          <input 
            type="text"
            className="editor-title-field"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название заметки"
          />
        )}
        
        <textarea 
          className="editor-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Описание заметки"
        />
        
        <div className="editor-date">
          {!isCreating && note && (
            <span>
              {new Date(note.createdAt).toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric"
              })}
            </span>
          )}
        </div>
      </div>

      <div className="editor-footer">
        <button className="save-btn" onClick={handleSave}>
          {isCreating ? "Создать" : "Сохранить"}
        </button>
        <button className="cancel-btn" onClick={onCancel}>
          Отмена
        </button>
        {!isCreating && note && (
          <button className="delete-btn" onClick={handleDelete}>
            Удалить заметку
          </button>
        )}
      </div>
    </div>
  );
};

export default NoteEditor;
