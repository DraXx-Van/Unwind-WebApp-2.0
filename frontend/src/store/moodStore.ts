import { create } from 'zustand';
import { authFetch } from '@/lib/api';

interface MoodState {
    todayMood: any | null;
    history: any[];
    isLoading: boolean;
    error: string | null;

    setTodayMood: (mood: string) => Promise<void>;
    fetchTodayMood: () => Promise<void>;
    fetchHistory: () => Promise<void>;
}

export const useMoodStore = create<MoodState>((set) => ({
    todayMood: null,
    history: [],
    isLoading: false,
    error: null,

    setTodayMood: async (mood: string) => {
        set({ isLoading: true, error: null });
        try {
            const localDate = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
            const response = await authFetch('/mood', {
                method: 'POST',
                body: JSON.stringify({ mood, date: localDate }),
            });
            if (!response.ok) throw new Error('Failed to save mood');
            const data = await response.json();
            set({ todayMood: data, isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    fetchTodayMood: async () => {
        set({ isLoading: true, error: null });
        try {
            const localDate = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
            const response = await authFetch(`/mood/today?date=${localDate}`);
            if (response.ok) {
                const data = await response.json();
                set({ todayMood: data, isLoading: false });
            } else {
                set({ todayMood: null, isLoading: false });
            }
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    fetchHistory: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await authFetch('/mood/history');
            if (!response.ok) throw new Error('Failed to fetch history');
            const data = await response.json();
            set({ history: data, isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },
}));
