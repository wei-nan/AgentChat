import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
    participant: null,
    login: () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }) => {
    const [participant, setParticipant] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('agentchat_participant');
        if (saved) {
            setParticipant(JSON.parse(saved));
        }
    }, []);

    const login = (data) => {
        setParticipant(data);
        localStorage.setItem('agentchat_participant', JSON.stringify(data));
    };

    const logout = () => {
        setParticipant(null);
        localStorage.removeItem('agentchat_participant');
    };

    return (
        <AuthContext.Provider value={{ participant, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
