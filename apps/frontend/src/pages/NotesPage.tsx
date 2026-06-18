import React, { useState } from "react";
import NotesList from "../components/NotesList";
import NoteEditor from "../components/NoteEditor";
import { useNotes } from "../hooks/useNotes";
import { useAuth } from "../hooks/useAuth";
import "./NotesPage.css";

export const NotesPage = () => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { notes, createNote, updateNote, deleteNote, isLoading, isError } =
    useNotes();
  const { logout } = useAuth();

  const handleCreateNote = () => {
    setIsCreating(true);
    setSelectedNoteId(null);
  };

  const handleSaveNote = async (title: string, content: string) => {
    if (isCreating) {
      const newNote = await createNote({ title, content });
      setSelectedNoteId(newNote.id);
      setIsCreating(false);
    } else if (selectedNoteId) {
      await updateNote({ id: selectedNoteId, data: { title, content } });
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (window.confirm("Удалить заметку?")) {
      await deleteNote(id);
      if (selectedNoteId === id) {
        setSelectedNoteId(null);
      }
    }
  };

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (isError) {
    return <div className="error">Ошибка загрузки заметок</div>;
  }

  return (
    <div className="notes-page">
      <div className="notes-page-header">
        <button className="logout-btn" onClick={logout}>
          Выйти
        </button>
      </div>
      <div className="notes-page-content">
        <NotesList
          notes={notes}
          selectedId={selectedNoteId}
          onSelect={setSelectedNoteId}
          onCreate={handleCreateNote}
        />
        <NoteEditor
          note={selectedNote}
          isCreating={isCreating}
          onSave={handleSaveNote}
          onCancel={() => setIsCreating(false)}
          onDelete={handleDeleteNote}
        />
      </div>
    </div>
  );
};
