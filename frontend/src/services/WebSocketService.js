const WS_BASE_URL = 'ws://localhost:8000/ws';

export class WebSocketService {
    constructor() {
        this.ws = null;
        this.listeners = {};
    }

    connect(roomId, apiKey) {
        this.disconnect();

        const url = `${WS_BASE_URL}/${roomId}?api_key=${encodeURIComponent(apiKey)}`;
        this.ws = new WebSocket(url);

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const callbacks = this.listeners[data.event] || [];
            callbacks.forEach(cb => cb(data.payload));
        };

        this.ws.onclose = () => {
            console.log('WebSocket disconnected');
        };
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }

    sendMessage(content) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                event: 'message.create',
                payload: { content }
            }));
        } else {
            console.error('WebSocket is not connected');
        }
    }
}

export const wsService = new WebSocketService();
