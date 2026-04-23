const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Authenticated fetch helper that automatically attaches the JWT token.
 * If the token is expired/invalid (401), it clears auth and redirects to login.
 */
export async function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
    // Get token from localStorage (persisted by authStore)
    let token: string | null = null;
    
    if (typeof window !== 'undefined') {
        try {
            const stored = localStorage.getItem('auth-storage');
            if (stored) {
                const parsed = JSON.parse(stored);
                token = parsed?.state?.token || null;
            }
        } catch {
            // ignore parse errors
        }
    }

    // If no token is found on the client side, we shouldn't make the request
    // as it will definitely 401. Just redirect to login.
    if (!token && typeof window !== 'undefined') {
        if (!window.location.pathname.startsWith('/login')) {
            window.location.href = '/login';
        }
        // Return a mock 401 response so the caller handles it gracefully
        return new Response(JSON.stringify({ message: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
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
        if (typeof window !== 'undefined') {
            try {
                localStorage.removeItem('auth-storage');
            } catch { /* ignore */ }
            if (!window.location.pathname.startsWith('/login')) {
                window.location.href = '/login';
            }
        }
    }

    return response;
}

export { API_BASE_URL };
