import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import Analytics from './pages/Analytics';
import Campaigns from './pages/Campaigns';
import Billing from './pages/Billing';
import Settings from './pages/Settings';
import Login from './pages/Login';

// Simple in-memory auth state (replace with Supabase/JWT later)
function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('afp_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (userData) => {
    sessionStorage.setItem('afp_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem('afp_user');
    setUser(null);
  };

  const updateUser = (newData) => {
    const updated = { ...user, ...newData };
    sessionStorage.setItem('afp_user', JSON.stringify(updated));
    setUser(updated);
  };

  return { user, login, logout, updateUser };
}

// Guard wrapper for protected routes
function RequireAuth({ user, children }) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { user, login, logout, updateUser } = useAuth();

  return (
    <Routes>
      {/* Public: Login */}
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/" replace />
          ) : (
            <Login onLogin={login} />
          )
        }
      />

      {/* Protected: Dashboard */}
      <Route
        path="/"
        element={
          <RequireAuth user={user}>
            <DashboardLayout user={user} onLogout={logout} onUpdateUser={updateUser} />
          </RequireAuth>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="billing" element={<Billing />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
    </Routes>
  );
}
