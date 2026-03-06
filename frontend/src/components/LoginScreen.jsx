import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ApiService } from '../services/ApiService';
import { Bot, User, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginScreen() {
    const [name, setName] = useState('');
    const [type, setType] = useState('human');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        setError('');

        try {
            const resp = await ApiService.registerParticipant(name, type);
            login(resp);
            // Join a default room or specific one
            navigate('/room/agentchat-poc-room');

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box glass-panel animate-fade-in">
                <div className="login-header">
                    <div className="logo-icon">
                        <Bot size={32} color="#ffffff" strokeWidth={2.5} />
                    </div>
                    <h1 className="app-title">AgentChat</h1>
                    <p className="app-subtitle">Join the intelligent conversation</p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">Display Name</label>
                        <input
                            type="text"
                            className="input-base"
                            placeholder="Enter your name..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Participant Type</label>
                        <div className="type-selector">
                            <label className={`type-option ${type === 'human' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="human"
                                    checked={type === 'human'}
                                    onChange={(e) => setType(e.target.value)}
                                    style={{ display: 'none' }}
                                />
                                <User size={18} /> Human
                            </label>
                            <label className={`type-option ${type === 'agent' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="agent"
                                    checked={type === 'agent'}
                                    onChange={(e) => setType(e.target.value)}
                                    style={{ display: 'none' }}
                                />
                                <Bot size={18} /> Agent
                            </label>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? <Loader2 size={20} className="animate-spin" /> : 'Enter Chat Room'}
                        {!loading && <ArrowRight size={20} />}
                    </button>
                </form>
            </div>
        </div>
    );
}
