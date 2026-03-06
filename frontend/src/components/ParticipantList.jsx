import React from 'react';
import { User, Bot, Circle } from 'lucide-react';

export default function ParticipantList({ participants, currentUserId }) {
    return (
        <div className="participant-list">
            <h4 className="section-title">Online Participants ({participants.length})</h4>
            <div className="participant-items">
                {participants.length === 0 ? (
                    <p className="no-participants">Waiting for others...</p>
                ) : (
                    participants.map(p => {
                        const isAgent = p.name.toLowerCase().includes('agent') || p.name.toLowerCase().includes('bot');

                        return (
                            <div key={p.participant_id} className="participant-item animate-fade-in">
                                <div className={`participant-avatar ${isAgent ? 'agent' : 'human'}`}>
                                    {isAgent ? <Bot size={14} /> : <User size={14} />}
                                </div>
                                <span className="participant-name">
                                    {p.name} {p.participant_id === currentUserId && <span className="text-you">(You)</span>}
                                </span>
                                <Circle size={8} className="online-indicator" fill="#10b981" color="#10b981" />
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    );
}
