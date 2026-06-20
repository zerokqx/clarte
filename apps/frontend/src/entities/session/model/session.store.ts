import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SessionUser {
  sub: string;
  login: string;
  avatarUrl?: string;
}

interface SessionState {
  user: SessionUser | null;
  isAuthenticated: boolean;
  setUser: (user: SessionUser) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      clearSession: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'clarte-session' },
  ),
);
