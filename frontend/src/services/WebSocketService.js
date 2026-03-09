const WS_BASE_URL = 'ws://localhost:8000/ws';

console.log('WebSocketService.js: Module loaded.');

export class WebSocketService {
    constructor() {
        this.ws = null;
        this.listeners = {};
        console.log('WebSocketService: Instance created.');
    }

    connect(roomId, token) {
        this.disconnect();

        const url = `${WS_BASE_URL}/${roomId}?token=${token}`;
        console.log('WebSocketService: Attempting to connect to:', url);
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
            console.log('WebSocketService: Connection established.');
        };

        this.ws.onmessage = (event) => {
            console.log('WebSocketService: Message received:', event.data);
            const data = JSON.parse(event.data);
            const callbacks = this.listeners[data.event] || [];
            callbacks.forEach(cb => cb(data.payload));
        };

        this.ws.onerror = (error) => {
            console.error('WebSocketService: Error occurred:', error);
        };

        this.ws.onclose = (event) => {
            console.log('WebSocketService: Connection closed.', event);
        };
    }

    disconnect() {
        if (this.ws) {
            console.log('WebSocketService: Disconnecting...');
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
            const message = JSON.stringify({
                event: 'message.create',
                payload: { content }
            });
            console.log('WebSocketService: Sending message:', message);

            this.ws.send(message);
        } else {
            console.error('WebSocketService: WebSocket is not connected, cannot send message.');
        }
    }
}

export const wsService = new WebSocketService();
