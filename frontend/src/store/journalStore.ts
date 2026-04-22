
import { create } from 'zustand';

export interface Journal {
    id: string;
    title?: string;
    content: string;
    emotion: string;
    createdAt: string;
}

interface JournalState {
    journals: Journal[];
    isLoading: boolean;
    error: string | null;
    fetchJournals: () => Promise<void>;
    addJournal: (entry: Omit<Journal, 'id' | 'createdAt'>) => Promise<void>;
    deleteJournal: (id: string) => Promise<void>;
}

const JOURNAL_API = `${process.env.NEXT_PUBLIC_API_URL}/journal`;

export const useJournalStore = create<JournalState>((set, get) => ({
    journals: [],
    isLoading: false,
    error: null,

    fetchJournals: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(JOURNAL_API);
            if (!response.ok) throw new Error('Failed to fetch journals');
            const data = await response.json();
            set({ journals: data });
        } catch (error) {
            set({ error: (error as Error).message });
        } finally {
            set({ isLoading: false });
        }
    },

    addJournal: async (entry) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(JOURNAL_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entry),
            });
            if (!response.ok) throw new Error('Failed to create journal');
            const newJournal = await response.json();
            set((state) => ({ journals: [newJournal, ...state.journals] }));
        } catch (error) {
            set({ error: (error as Error).message });
        } finally {
            set({ isLoading: false });
        }
    },

    deleteJournal: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`${JOURNAL_API}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete journal');
            set((state) => ({ journals: state.journals.filter(j => j.id !== id) }));
        } catch (error) {
            set({ error: (error as Error).message });
        } finally {
            set({ isLoading: false });
        }
    },
}));
