import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ApiService } from '../services/ApiService';
import { wsService } from '../services/WebSocketService';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ParticipantList from './ParticipantList';
import { LogOut, Users, User, Bot, Loader2 } from 'lucide-react';

export default function ChatRoom() {
    const { roomId } = useParams();
    const { participant, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!participant) return;

        const loadHistory = async () => {
            try {
                const history = await ApiService.getRoomMessages(roomId, participant.api_key);
                setMessages(history);
            } catch (err) {
                console.error("Failed to load history:", err);
            } finally {
                setLoading(false);
            }
        };

        loadHistory();

        wsService.connect(roomId, participant.api_key);

        const handleSystemConnected = (payload) => {
            if (payload.participants) {
                setParticipants(payload.participants);
            }
        };

        const handleParticipantJoined = (payload) => {
            setParticipants(prev => {
                if (!prev.find(p => p.participant_id === payload.participant_id)) {
                    return [...prev, payload];
                }
                return prev;
            });
        };

        const handleParticipantLeft = (payload) => {
            setParticipants(prev => prev.filter(p => p.participant_id !== payload.participant_id));
        };

        const handleMessageCreated = (payload) => {
            setMessages(prev => [...prev, payload]);
        };

        wsService.on('system.connected', handleSystemConnected);
        wsService.on('participant.joined', handleParticipantJoined);
        wsService.on('participant.left', handleParticipantLeft);
        wsService.on('message.created', handleMessageCreated);

        return () => {
            wsService.off('system.connected', handleSystemConnected);
            wsService.off('participant.joined', handleParticipantJoined);
            wsService.off('participant.left', handleParticipantLeft);
            wsService.off('message.created', handleMessageCreated);
            wsService.disconnect();
        };
    }, [roomId, participant]);

    const handleLogout = () => {
        wsService.disconnect();
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="login-container">
                <Loader2 size={48} className="animate-spin text-primary" color="#6366f1" />
            </div>
        );
    }

    return (
        <div className="chat-layout animate-fade-in">
            {/* Sidebar */}
            <div className="chat-sidebar glass-panel">
                <div className="sidebar-header">
                    <div className="logo-icon-small">
                        <Bot size={20} color="#fff" strokeWidth={2.5} />
                    </div>
                    <h2 className="app-title-small">AgentChat</h2>
                </div>

                <div className="sidebar-content">
                    <ParticipantList participants={participants} currentUserId={participant?.participant_id} />
                </div>

                <div className="sidebar-footer">
                    <div className="current-user">
                        <div className={`user-avatar-small ${participant?.type === 'agent' ? 'agent' : 'human'}`}>
                            {participant?.type === 'agent' ? <Bot size={14} /> : <User size={14} />}
                        </div>
                        <span className="user-name">{participant?.name}</span>
                    </div>
                    <button onClick={handleLogout} className="btn-logout" title="Leave">
                        <LogOut size={16} />
                    </button>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="chat-main">
                <div className="chat-header glass-panel">
                    <div className="room-info">
                        <h3>{roomId}</h3>
                        <span className="room-status">Active</span>
                    </div>
                    <div className="participants-count">
                        <Users size={16} />
                        <span>{participants.length} online</span>
                    </div>
                </div>

                <div className="messages-area">
                    <MessageList messages={messages} currentUserId={participant?.participant_id} />
                </div>

                <div className="input-area glass-panel">
                    <MessageInput onSend={(content) => wsService.sendMessage(content)} />
                </div>
            </div>
        </div>
    );
}
