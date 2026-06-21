import { useState, useEffect, useCallback } from "react";

export interface Note {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  createdAt: string;
  updatedAt: string;
}

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem("clarte_notes");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("clarte_notes", JSON.stringify(notes));
  }, [notes]);

  const createNote = useCallback((title = "Новая заметка", customId?: string, priority: "high" | "medium" | "low" = "medium") => {
    const newNote: Note = {
      id: customId || `room-${Math.random().toString(36).substr(2, 9)}-${Date.now().toString(36)}`,
      title: title.trim() || "Без названия",
      priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setNotes((prev) => {
      if (prev.some((n) => n.id === newNote.id)) {
        return prev;
      }
      return [newNote, ...prev];
    });
    setSelectedNoteId(newNote.id);
    return newNote;
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }
  }, [selectedNoteId]);

  const updateNoteTitle = useCallback((id: string, newTitle: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, title: newTitle.trim() || "Без названия", updatedAt: new Date().toISOString() }
          : n
      )
    );
  }, []);

  const updateNotePriority = useCallback((id: string, priority: "high" | "medium" | "low") => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, priority, updatedAt: new Date().toISOString() }
          : n
      )
    );
  }, []);

  const addSharedNote = useCallback((id: string, title = "Совместная заметка", priority: "high" | "medium" | "low" = "medium") => {
    setNotes((prev) => {
      if (prev.some((n) => n.id === id)) {
        return prev;
      }
      const newNote: Note = {
        id,
        title,
        priority,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return [newNote, ...prev];
    });
    setSelectedNoteId(id);
  }, []);

  return {
    notes,
    selectedNoteId,
    setSelectedNoteId,
    createNote,
    deleteNote,
    updateNoteTitle,
    updateNotePriority,
    addSharedNote,
  };
};
