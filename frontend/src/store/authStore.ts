import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE_URL = 'http://localhost:4000';

export interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    token: string | null;
    user: User | null;
    isLoading: boolean;
    error: string | null;

    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    clearError: () => void;
    updateProfile: (data: { name?: string; email?: string }) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            isLoading: false,
            error: null,

            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_BASE_URL}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password }),
                    });

                    if (!response.ok) {
                        const data = await response.json().catch(() => ({}));
                        throw new Error(data.message || 'Invalid email or password');
                    }

                    const data = await response.json();
                    set({
                        token: data.accessToken,
                        user: data.user,
                        isLoading: false,
                    });
                    return true;
                } catch (error) {
                    set({ error: (error as Error).message, isLoading: false });
                    return false;
                }
            },

            register: async (name: string, email: string, password: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_BASE_URL}/auth/register`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, email, password }),
                    });

                    if (!response.ok) {
                        const data = await response.json().catch(() => ({}));
                        throw new Error(data.message || 'Registration failed');
                    }

                    const data = await response.json();
                    set({
                        token: data.accessToken,
                        user: data.user,
                        isLoading: false,
                    });
                    return true;
                } catch (error) {
                    set({ error: (error as Error).message, isLoading: false });
                    return false;
                }
            },

            logout: () => {
                set({ token: null, user: null, error: null });
                // Also clear assessment storage so next user starts fresh
                try {
                    localStorage.removeItem('assessment-storage');
                } catch { /* ignore */ }
            },

            clearError: () => set({ error: null }),

            updateProfile: async (data: { name?: string; email?: string }) => {
                const { token, user } = get() as AuthState;
                if (!token) return false;

                try {
                    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                        method: 'PATCH',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(data),
                    });

                    if (!response.ok) throw new Error('Update failed');

                    const updatedUser = await response.json();
                    set({ user: { ...user!, ...updatedUser } });
                    return true;
                } catch (error) {
                    console.error('Update error:', error);
                    return false;
                }
            },
        }),
        {
            name: 'auth-storage',
        },
    ),
);
