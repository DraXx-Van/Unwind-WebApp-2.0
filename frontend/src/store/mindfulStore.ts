import { create } from 'zustand';

export interface MindfulSession {
  id: string;
  userId: string;
  activity: string;
  duration: number;
  plannedDuration: number;
  category: string;
  timeOfDay: string;
  createdAt: string;
}

interface MindfulState {
  latestEntry: MindfulSession | null;
  history: MindfulSession[];
  isLoading: boolean;
  error: string | null;

  fetchLatest: (userId?: string) => Promise<void>;
  fetchHistory: (userId?: string) => Promise<void>;
  addEntry: (userId: string, data: { activity: string; duration: number; plannedDuration: number; category: string; timeOfDay: string }) => Promise<void>;
  updateEntry: (id: string, additionalDuration: number) => Promise<void>;
}

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/mindful`;

export const useMindfulStore = create<MindfulState>((set) => ({
  latestEntry: null,
  history: [],
  isLoading: false,
  error: null,

  fetchLatest: async (userId = 'user-1') => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/latest?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        set({ latestEntry: data, isLoading: false });
      } else {
        set({ latestEntry: null, isLoading: false });
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchHistory: async (userId = 'user-1') => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/history?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch history');
      const data = await response.json();
      set({ history: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addEntry: async (userId: string, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...data }),
      });
      if (!response.ok) throw new Error('Failed to add entry');
      const newEntry = await response.json();
      set((state) => ({
        latestEntry: newEntry,
        history: [newEntry, ...state.history],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateEntry: async (id: string, additionalDuration: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ additionalDuration }),
      });
      if (!response.ok) throw new Error('Failed to update entry');
      const updatedEntry = await response.json();
      set((state) => ({
        latestEntry: state.latestEntry?.id === id ? updatedEntry : state.latestEntry,
        history: state.history.map(entry => entry.id === id ? updatedEntry : entry),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  }
}));
