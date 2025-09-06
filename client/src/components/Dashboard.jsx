import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSignOutAlt } from 'react-icons/fa';
import Button from './Button';
import { AuthContext } from '../context/AuthContext';
import React from 'react';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-3">
      <motion.div
        className="w-full max-w-sm glassmorphism rounded-xl shadow-lg p-4 sm:p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold text-center text-black mb-3">Welcome, {user?.name || 'User'}</h2>
        <p className="text-center text-black text-xs mb-3">Email: {user?.email}</p>
        <Button onClick={handleLogout}>
          <FaSignOutAlt className="inline mr-2 text-base" /> Logout
        </Button>
      </motion.div>
    </div>
  );
};

export default Dashboard;