import { create } from 'zustand';
import { authFetch } from '@/lib/api';

export interface StressEntry {
  id: string;
  userId: string;
  value: number;
  stressor: string;
  impact: string;
  createdAt: string;
}

interface StressState {
  latestEntry: StressEntry | null;
  history: StressEntry[];
  isLoading: boolean;
  error: string | null;

  fetchLatest: (userId?: string) => Promise<void>;
  fetchHistory: (userId?: string) => Promise<void>;
  addEntry: (data: { value: number; stressor: string; impact: string }) => Promise<void>;
}

export const useStressStore = create<StressState>((set) => ({
  latestEntry: null,
  history: [],
  isLoading: false,
  error: null,

  fetchLatest: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const url = userId ? `/stress/latest?userId=${userId}` : '/stress/latest';
      const response = await authFetch(url);
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

  fetchHistory: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const url = userId ? `/stress/history?userId=${userId}` : '/stress/history';
      const response = await authFetch(url);
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
      const response = await authFetch('/stress', {
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
}));
