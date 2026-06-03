import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ChatScreen from './screens/ChatScreen';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { userId, username, login, logout } = useAuth();
  const isAuthenticated = !!(userId && username);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/chat" replace /> : <LoginScreen onLogin={login} />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/chat" replace /> : <RegisterScreen onLogin={login} />
          }
        />
        <Route
          path="/chat"
          element={
            isAuthenticated ? (
              <ChatScreen userId={userId!} username={username!} onLogout={logout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to={isAuthenticated ? '/chat' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
