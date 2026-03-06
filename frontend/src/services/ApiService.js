const API_BASE_URL = 'http://localhost:8000';

export const ApiService = {
    async registerParticipant(name, type) {
        const response = await fetch(`${API_BASE_URL}/participants`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, type }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Registration failed');
        }

        return response.json();
    },

    async getRoomMessages(roomId, apiKey, limit = 50, offset = 0) {
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
            throw new Error(error.detail || 'Failed to fetch messages');
        }

        return response.json();
    }
};
