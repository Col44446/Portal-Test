import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock } from 'react-icons/fa';
import axios from 'axios';
import Input from './Input';
import Button from './Button';
import { AuthContext } from '../context/AuthContext';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, name, dob, password } = location.state || {};

  const handleVerifyOTP = async () => {
    if (!email || !password) {
      setError("Signup data missing. Please restart signup.");
      return;
    }

    setLoading(true);
    setError('');
    try {
      console.log("Sending to backend:", { email, otp, name, dob, password });

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/signup/verify`,
        { email, otp, name, dob, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        setUser(response.data.user);
        setToken(response.data.token);
        navigate('/dashboard');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error("VerifyOTP Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-3">
      <motion.div
        className="w-full max-w-sm glassmorphism rounded-xl shadow-lg p-4 sm:p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold text-center text-white mb-3">Verify OTP</h2>
        {error && (
          <motion.p
            className="text-red-300 text-center mb-2 text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}
        <Input
          icon={FaLock}
          label="OTP"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
        />
        <Button onClick={handleVerifyOTP} disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Button>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
