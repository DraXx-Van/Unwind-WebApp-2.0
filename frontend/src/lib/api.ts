const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Authenticated fetch helper that automatically attaches the JWT token.
 * If the token is expired/invalid (401), it clears auth and redirects to login.
 */
export async function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
    // Get token from localStorage (persisted by authStore)
    let token: string | null = null;
    try {
        const stored = localStorage.getItem('auth-storage');
        if (stored) {
            const parsed = JSON.parse(stored);
            token = parsed?.state?.token || null;
        }
    } catch {
        // ignore parse errors
    }

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

    // If unauthorized, clear auth and redirect
    if (response.status === 401) {
        try {
            localStorage.removeItem('auth-storage');
        } catch { /* ignore */ }
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
            window.location.href = '/login';
        }
    }

    return response;
}

export { API_BASE_URL };
