// components/Login.jsx
import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import Input from './Input';
import Button from './Button';
import { AuthContext } from '../context/AuthContext';
import React from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for token from Google redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setToken(token);
        setUser({ _id: payload.id, email: payload.email, role: payload.role });
        navigate('/dashboard', { replace: true }); // Use replace to avoid history stack issues
      } catch (err) {
        setError('Invalid token received. Please try again.');
        console.error('Token parsing error:', err);
      }
    }
  }, [location.search, setToken, setUser, navigate]);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, { email, password });
      if (response.data.success) {
        setUser(response.data.user);
        setToken(response.data.token);
        navigate('/dashboard', { replace: true });
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/users/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
      <motion.div
        className="w-full max-w-md glassmorphism rounded-2xl shadow-xl p-6 sm:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl text-black font-extrabold text-center mb-6">Welcome Back, Student</h2>
        {error && (
          <motion.p
            className="text-red-300 text-center mb-4 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}
        <Input
          icon={FaEnvelope}
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <Input
          icon={FaLock}
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        <Button onClick={handleLogin} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        <Button onClick={handleGoogleLogin} variant="secondary" disabled={loading}>
          <FcGoogle className="inline mr-2 text-xl" /><span className="text-black">Continue With Google</span>
        </Button>
        <p className="text-center text-black text-sm mt-4">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-600 hover:underline font-medium">
            Sign Up
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;