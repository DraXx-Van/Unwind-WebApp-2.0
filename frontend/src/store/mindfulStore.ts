import { create } from 'zustand';
import { authFetch } from '@/lib/api';

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

  fetchLatest: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  addEntry: (data: { activity: string; duration: number; plannedDuration: number; category: string; timeOfDay: string }) => Promise<void>;
  updateEntry: (id: string, additionalDuration: number) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
}

export const useMindfulStore = create<MindfulState>((set) => ({
  latestEntry: null,
  history: [],
  isLoading: false,
  error: null,

  fetchLatest: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await authFetch('/mindful/latest');
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

  fetchHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await authFetch('/mindful/history');
      if (!response.ok) throw new Error('Failed to fetch history');
      const data = await response.json();
      set({ history: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addEntry: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authFetch('/mindful', {
        method: 'POST',
        body: JSON.stringify(data),
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
      const response = await authFetch(`/mindful/${id}`, {
        method: 'PUT',
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
  },

  deleteEntry: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authFetch(`/mindful/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete entry');
      
      set((state) => ({
        latestEntry: state.latestEntry?.id === id ? null : state.latestEntry,
        history: state.history.filter(entry => entry.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  }
}));
