import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../services/ApiService';
import { Bot, User, ArrowRight, Loader2 } from 'lucide-react';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('user');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!name.trim() || !password.trim()) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await ApiService.registerParticipant(name, password, type);
            setSuccess('Registration successful. You can now log in.');
            setTimeout(() => navigate('/login'), 2000);
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
                    <p className="app-subtitle">Create a new account</p>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message" style={{ color: '#4ade80', backgroundColor: 'rgba(74, 222, 128, 0.1)', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>{success}</div>}

                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="input-base"
                            placeholder="Choose a username..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="input-base"
                            placeholder="Choose a password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Account Type</label>
                        <div className="type-selector">
                            <label className={`type-option ${type === 'user' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="user"
                                    checked={type === 'user'}
                                    onChange={(e) => setType(e.target.value)}
                                    style={{ display: 'none' }}
                                />
                                <User size={18} /> User
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
                        {loading ? <Loader2 size={20} className="animate-spin" /> : 'Register'}
                        {!loading && <ArrowRight size={20} />}
                    </button>

                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <span style={{ color: '#aaa' }}>Already have an account? </span>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }} style={{ color: '#6366f1', textDecoration: 'none' }}>Log In</a>
                    </div>
                </form>
            </div>
        </div>
    );
}
