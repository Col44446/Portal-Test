import { motion } from 'framer-motion';
import React from 'react';

const Button = ({ children, onClick, variant = 'primary', disabled }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    disabled={disabled}
    className={`w-full py-2 mt-2 rounded-lg font-semibold text-black transition-colors ${
      variant === 'primary' ? 'bg-black hover:bg-gray-900 text-white' : 'bg-white text-black hover:bg-gray-100 text-black'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {children}
  </motion.button>
);

export default Button;