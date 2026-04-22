import { create } from 'zustand';

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
  addEntry: (userId: string, data: { value: number; stressor: string; impact: string }) => Promise<void>;
}

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/stress`;

export const useStressStore = create<StressState>((set) => ({
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
}));
