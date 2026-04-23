import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface Mentor {
    id: string;
    name: string;
    email: string;
    specialization: string;
    role: 'mentor';
}

interface MentorAuthState {
    token: string | null;
    mentor: Mentor | null;
    isLoading: boolean;
    error: string | null;

    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string, specialization?: string) => Promise<boolean>;
    logout: () => void;
    clearError: () => void;
}

export const useMentorAuthStore = create<MentorAuthState>()(
    persist(
        (set) => ({
            token: null,
            mentor: null,
            isLoading: false,
            error: null,

            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_BASE_URL}/mentor/login`, {
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
                        mentor: data.user,
                        isLoading: false,
                    });
                    return true;
                } catch (error) {
                    set({ error: (error as Error).message, isLoading: false });
                    return false;
                }
            },

            register: async (name: string, email: string, password: string, specialization?: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_BASE_URL}/mentor/register`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, email, password, specialization }),
                    });

                    if (!response.ok) {
                        const data = await response.json().catch(() => ({}));
                        throw new Error(data.message || 'Registration failed');
                    }

                    const data = await response.json();
                    set({
                        token: data.accessToken,
                        mentor: data.user,
                        isLoading: false,
                    });
                    return true;
                } catch (error) {
                    set({ error: (error as Error).message, isLoading: false });
                    return false;
                }
            },

            logout: () => {
                set({ token: null, mentor: null, error: null });
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: 'mentor-auth-storage',
        },
    ),
);

/**
 * Mentor Authenticated Fetch
 */
export async function mentorAuthFetch(path: string, options: RequestInit = {}): Promise<Response> {
    let token: string | null = null;
    try {
        const stored = localStorage.getItem('mentor-auth-storage');
        if (stored) {
            const parsed = JSON.parse(stored);
            token = parsed?.state?.token || null;
        }
    } catch { }

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        try {
            localStorage.removeItem('mentor-auth-storage');
        } catch { }
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/mentor/login')) {
            window.location.href = '/mentor/login';
        }
    }

    return response;
}
