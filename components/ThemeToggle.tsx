'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <label className="relative inline-block w-14 h-8 cursor-pointer" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
      <input 
        type="checkbox" 
        checked={theme === 'dark'} 
        onChange={toggleTheme}
        className="sr-only peer"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#08162f] via-[#1e293b] to-[#4f7cff] rounded-full transition-all duration-500 peer-checked:bg-gradient-to-l shadow-inner"></div>
      <div className="absolute left-1 top-1 w-6 h-6 bg-gradient-to-br from-white to-slate-200 rounded-full transition-all duration-400 peer-checked:translate-x-6 peer-checked:bg-gradient-to-br peer-checked:from-[#4f7cff] peer-checked:to-[#3b82f6] shadow-lg"></div>
    </label>
  );
}
