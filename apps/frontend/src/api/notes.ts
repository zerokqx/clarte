import { apiClient } from "./client";
import { Note, CreateNoteDto, UpdateNoteDto } from "../types/note";

export const notesApi = {
  getAll: async (): Promise<Note[]> => {
    const response = await apiClient.get("/notes");
    return response.data;
  },

  getOne: async (id: string): Promise<Note> => {
    const response = await apiClient.get(`/notes/${id}`);
    return response.data;
  },

  create: async (data: CreateNoteDto): Promise<Note> => {
    const response = await apiClient.post("/notes", data);
    return response.data;
  },

  update: async (id: string, data: UpdateNoteDto): Promise<Note> => {
    const response = await apiClient.patch(`/notes/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/notes/${id}`);
  },
};
