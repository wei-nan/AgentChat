import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ApiService } from '../services/ApiService';
import { Plus, MessageSquare, Loader2 } from 'lucide-react';

export default function RoomList() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newRoomName, setNewRoomName] = useState('');
    const [creating, setCreating] = useState(false);

    const { participant } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const data = await ApiService.getRooms(participant.token);
            setRooms(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        if (!newRoomName.trim()) return;

        setCreating(true);
        setError('');

        try {
            const newRoom = await ApiService.createRoom(newRoomName, participant.token);
            // prepend to list to easily see the new room (as API returns descending order)
            setRooms([newRoom, ...rooms]);
            setNewRoomName('');
        } catch (err) {
            setError(err.message);
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return (
            <div className="login-container">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Loader2 className="animate-spin" size={32} color="#fff" />
                </div>
            </div>
        );
    }

    return (
        <div className="login-container">
            <div className="login-box glass-panel animate-fade-in" style={{ maxWidth: '600px', width: '90%' }}>
                <div className="login-header">
                    <h1 className="app-title">Chat Rooms</h1>
                    <p className="app-subtitle">Select a room to join</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleCreateRoom} className="form-group" style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexDirection: 'row', alignItems: 'center' }}>
                    <input
                        type="text"
                        className="input-base"
                        placeholder="New room name..."
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <button type="submit" disabled={creating || !newRoomName.trim()} className="btn-primary" style={{ width: 'auto', padding: '0 20px', margin: 0 }}>
                        {creating ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                        <span style={{ marginLeft: '8px' }}>Create</span>
                    </button>
                </form>

                <div className="room-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto', paddingRight: '5px' }}>
                    {rooms.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>No rooms available.</p>
                    ) : (
                        rooms.map(room => (
                            <div
                                key={room.id}
                                onClick={() => navigate(`/room/${room.id}`)}
                                style={{
                                    padding: '15px',
                                    borderRadius: '8px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                            >
                                <MessageSquare size={24} color="#888" />
                                <div>
                                    <div style={{ fontWeight: 'bold', color: '#fff' }}>{room.name || 'Unnamed Room'}</div>
                                    <div style={{ fontSize: '0.8em', color: '#888' }}>{new Date(room.created_at).toLocaleString()}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
