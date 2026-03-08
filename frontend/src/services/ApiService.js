const API_BASE_URL = 'http://localhost:8000';

console.log('ApiService.js: Module loaded.');

export const ApiService = {
    async registerParticipant(name, type) {
        console.log('ApiService: Attempting to register participant:', { name, type });
        const response = await fetch(`${API_BASE_URL}/participants`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, type }),
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

    async getRoomMessages(roomId, apiKey, limit = 50, offset = 0) {
        console.log('ApiService: Attempting to get room messages for room:', roomId);
        const url = new URL(`${API_BASE_URL}/rooms/${roomId}/messages`);
        url.searchParams.append('limit', limit);
        url.searchParams.append('offset', offset);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey,
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

    async getRooms(apiKey) {
        console.log('ApiService: Attempting to get rooms');
        const response = await fetch(`${API_BASE_URL}/rooms`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('ApiService: Failed to fetch rooms:', error);
            throw new Error(error.detail || 'Failed to fetch rooms');
        }

        return await response.json();
    },

    async createRoom(name, apiKey) {
        console.log('ApiService: Attempting to create room:', name);
        const response = await fetch(`${API_BASE_URL}/rooms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey,
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
