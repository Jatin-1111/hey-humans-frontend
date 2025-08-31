class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

export const api = {
    async request(endpoint, options = {}) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(endpoint, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Network error' }));
                throw new ApiError(errorData.error || `HTTP ${response.status}`, response.status);
            }

            return await response.json();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Network error', 0);
        }
    },

    async get(endpoint) {
        return this.request(endpoint);
    },

    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE',
        });
    },
};

// Auth API functions
export const authApi = {
    async login(email, password) {
        return api.post('/api/auth/login', { email, password });
    },

    async signup(userData) {
        return api.post('/api/auth/signup', userData);
    },

    async verifyEmail(token) {
        return api.get(`/api/auth/verify-email?token=${token}`);
    },

    async forgotPassword(email) {
        return api.post('/api/auth/reset-password', { email });
    },

    async resetPassword(token, newPassword) {
        return api.post('/api/auth/reset-password/confirm', { token, newPassword });
    },

    async getCurrentUser() {
        return api.get('/api/auth/me');
    },
};
