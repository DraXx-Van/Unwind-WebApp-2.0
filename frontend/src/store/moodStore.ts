import { create } from 'zustand';

interface MoodState {
    todayMood: any | null;
    history: any[];
    isLoading: boolean;
    error: string | null;

    setTodayMood: (mood: string) => Promise<void>;
    fetchTodayMood: () => Promise<void>;
    fetchHistory: () => Promise<void>;
}

const API_BASE_URL = 'http://localhost:4000'; // Adjust if needed

export const useMoodStore = create<MoodState>((set) => ({
    todayMood: null,
    history: [],
    isLoading: false,
    error: null,

    setTodayMood: async (mood: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`${API_BASE_URL}/mood`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mood }),
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
            const response = await fetch(`${API_BASE_URL}/mood/today`);
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
            const response = await fetch(`${API_BASE_URL}/mood/history`);
            if (!response.ok) throw new Error('Failed to fetch history');
            const data = await response.json();
            set({ history: data, isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },
}));
