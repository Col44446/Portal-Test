import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaBirthdayCake } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import Input from './Input';
import Button from './Button';
import React from 'react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/signup/request`,
        { name, email, dob, password, confirmPassword }
      );

      if (response.data.success) {
        navigate('/verify-otp', { state: { email, name, dob, password } });
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      if (err.response) {
        console.error("Signup error:", err.response.data);
        setError(err.response.data.message || "Signup failed. Please try again.");
      } else {
        setError("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/users/auth/google`;
};


  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-3">
      <motion.div
        className="w-full max-w-sm glassmorphism rounded-xl shadow-lg p-4 sm:p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold text-center text-black mb-3">Create Account</h2>

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
          icon={FaUser}
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <Input
          icon={FaEnvelope}
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <Input
          icon={FaBirthdayCake}
          label="Date of Birth"
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
        <Input
          icon={FaLock}
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        <Input
          icon={FaLock}
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
        />

        <Button onClick={handleSignup} disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </Button>

        <Button onClick={handleGoogleLogin} variant="secondary" disabled={loading}>
          <FcGoogle className="inline mr-2 text-black" />
          <span className="text-black">Continue With Google</span>
        </Button>

        <p className="text-center text-black text-xs mt-2">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
