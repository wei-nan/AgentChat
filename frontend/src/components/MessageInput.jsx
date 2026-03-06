import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function MessageInput({ onSend }) {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            onSend(text.trim());
            setText('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="message-form">
            <input
                type="text"
                className="message-input"
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                autoFocus
            />
            <button
                type="submit"
                className="btn-send"
                disabled={!text.trim()}
            >
                <Send size={18} />
            </button>
        </form>
    );
}
