'use client';

import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-[#2C2B28] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2L2 7l8 5 8-5-8-5zM2 17l8 5 8-5M2 12l8 5 8-5"/>
              </svg>
            </div>
            <span className="text-2xl font-bold text-[#2C2B28]">DAG ARMY</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-[#2C2B28] hover:text-[#3B82F6] transition-colors font-medium">About</a>
            <a href="#ranks" className="text-[#2C2B28] hover:text-[#3B82F6] transition-colors font-medium">Ranks</a>
            <a href="#airdrops" className="text-[#2C2B28] hover:text-[#3B82F6] transition-colors font-medium">Airdrops</a>
            <a href="/login" className="bg-[#2C2B28] text-white px-6 py-3 rounded-full hover:bg-[#3B82F6] transition-all font-medium">
              Login
            </a>
          </div>

          <button 
            className="md:hidden text-[#2C2B28]"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <a href="#about" className="block text-[#2C2B28] hover:text-[#3B82F6] transition-colors font-medium">About</a>
            <a href="#ranks" className="block text-[#2C2B28] hover:text-[#3B82F6] transition-colors font-medium">Ranks</a>
            <a href="#airdrops" className="block text-[#2C2B28] hover:text-[#3B82F6] transition-colors font-medium">Airdrops</a>
            <a href="/login" className="block bg-[#2C2B28] text-white px-6 py-3 rounded-full hover:bg-[#3B82F6] transition-all font-medium text-center">
              Login
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
