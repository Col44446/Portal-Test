import React from 'react';
import './App.css'

import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import VerifyOTP from './components/VerifyOTP';
import Dashboard from './components/Dashboard';
import GoogleLoginRedirect from './components/GoogleLoginRedirect';
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/google-login" element={<GoogleLoginRedirect />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/google-login" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;