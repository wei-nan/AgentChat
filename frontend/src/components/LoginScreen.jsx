import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ApiService } from '../services/ApiService';
import { Bot, LogIn, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginScreen() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!name.trim() || !password.trim()) return;

        setLoading(true);
        setError('');

        try {
            const resp = await ApiService.loginParticipant(name, password);
            // jwt token decode is skipped, we store minimal info since we don't have user type here
            // We just store the token and fake the rest if needed, or extract from JWT payload
            let payload = {};
            try {
                const base64Url = resp.access_token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                payload = JSON.parse(window.atob(base64));
            } catch (e) {
                console.error("JWT Decode error");
            }

            login({
                token: resp.access_token,
                participant_id: payload.sub,
                name: name, // Using inputted name
                type: payload.type || 'human' // Fallback
            });
            navigate('/rooms');

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
                    <p className="app-subtitle">Log in to your account</p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="input-base"
                            placeholder="Enter your username..."
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
                            placeholder="Enter your password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? <Loader2 size={20} className="animate-spin" /> : 'Log In'}
                        {!loading && <ArrowRight size={20} />}
                    </button>

                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <span style={{ color: '#aaa' }}>Don't have an account? </span>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }} style={{ color: '#6366f1', textDecoration: 'none' }}>Register</a>
                    </div>
                </form>
            </div>
        </div>
    );
}
