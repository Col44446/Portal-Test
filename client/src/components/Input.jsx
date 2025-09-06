import { motion } from 'framer-motion';
import React from 'react';


const Input = ({ icon: Icon, label, type, value, onChange, placeholder }) => (
  <motion.div
    className="relative mb-4"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <label className="block text-sm font-medium text-black mb-1">{label}</label>
    <div className="flex items-center glassmorphism rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-300">
      <Icon className="text-black mr-2" />
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none text-black placeholder-black"
      />
    </div>
  </motion.div>
);

export default Input;