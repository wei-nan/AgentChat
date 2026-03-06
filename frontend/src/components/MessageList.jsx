import React, { useEffect, useRef } from 'react';
import { User, Bot } from 'lucide-react';

export default function MessageList({ messages, currentUserId }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (messages.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon-wrapper">
                    <Bot size={48} className="empty-icon text-indigo-400" color="#818cf8" />
                </div>
                <h3>No messages yet</h3>
                <p>Be the first to say hello!</p>
            </div>
        );
    }

    return (
        <div className="message-list">
            {messages.map((msg) => {
                const isMine = msg.author_id === currentUserId;
                const isAgent = msg.author_name.toLowerCase().includes('agent') || msg.author_name.toLowerCase().includes('bot');

                return (
                    <div key={msg.message_id} className={`message-wrapper animate-fade-in ${isMine ? 'mine' : 'theirs'}`}>
                        {!isMine && (
                            <div className={`message-avatar ${isAgent ? 'agent' : 'human'}`}>
                                {isAgent ? <Bot size={16} /> : <User size={16} />}
                            </div>
                        )}

                        <div className={`message-bubble ${isMine ? 'mine' : 'theirs'}`}>
                            {!isMine && <div className="message-author">{msg.author_name}</div>}
                            <div className="message-content">{msg.content}</div>
                            <div className="message-time">
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                );
            })}
            <div ref={bottomRef} />
        </div>
    );
}
