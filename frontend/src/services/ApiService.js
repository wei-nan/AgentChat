const API_BASE_URL = 'http://localhost:8000';

console.log('ApiService.js: Module loaded.');

export const ApiService = {
    async registerParticipant(name, password, type) {
        console.log('ApiService: Attempting to register participant:', { name, type });
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, password, type }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('ApiService: Registration failed:', error);
            throw new Error(error.detail || 'Registration failed');
        }

        const data = await response.json();
        console.log('ApiService: Registration successful:', data);
        return data;
    },

    async loginParticipant(username, password) {
        console.log('ApiService: Attempting to login participant:', username);
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params,
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('ApiService: Login failed:', error);
            throw new Error(error.detail || 'Login failed');
        }

        const data = await response.json();
        console.log('ApiService: Login successful.');
        return data;
    },

    async getRoomMessages(roomId, token, limit = 50, offset = 0) {
        console.log('ApiService: Attempting to get room messages for room:', roomId);
        const url = new URL(`${API_BASE_URL}/rooms/${roomId}/messages`);
        url.searchParams.append('limit', limit);
        url.searchParams.append('offset', offset);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('ApiService: Failed to fetch messages:', error);
            throw new Error(error.detail || 'Failed to fetch messages');
        }

        const data = await response.json();
        console.log('ApiService: Successfully fetched messages.');
        return data;
    },

    async getRooms(token) {
        console.log('ApiService: Attempting to get rooms');
        const response = await fetch(`${API_BASE_URL}/rooms`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('ApiService: Failed to fetch rooms:', error);
            throw new Error(error.detail || 'Failed to fetch rooms');
        }

        return await response.json();
    },

    async createRoom(name, token) {
        console.log('ApiService: Attempting to create room:', name);
        const response = await fetch(`${API_BASE_URL}/rooms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ name }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('ApiService: Failed to create room:', error);
            throw new Error(error.detail || 'Failed to create room');
        }

        return await response.json();
    }
};
