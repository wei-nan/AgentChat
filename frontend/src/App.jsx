import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import ChatRoom from './components/ChatRoom';
import RoomList from './components/RoomList';
import './index.css';
import './chat.css';

console.log('App.jsx: App component is being initialized.');

const ProtectedRoute = ({ children }) => {
  const { participant } = React.useContext(AuthContext);
  if (!participant) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/rooms" element={
            <ProtectedRoute>
              <RoomList />
            </ProtectedRoute>
          } />
          <Route path="/room/:roomId" element={
            <ProtectedRoute>
              <ChatRoom />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
