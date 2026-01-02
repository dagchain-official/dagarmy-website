'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-[#2C2B28]">DAG ARMY</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="#about" className="text-[#2C2B28] hover:text-[#3B82F6] transition-colors font-medium">
              About
            </Link>
            <Link href="#how-it-works" className="text-[#2C2B28] hover:text-[#3B82F6] transition-colors font-medium">
              How It Works
            </Link>
            <Link href="#ranks" className="text-[#2C2B28] hover:text-[#3B82F6] transition-colors font-medium">
              Ranks
            </Link>
            <Link href="#join" className="text-[#2C2B28] hover:text-[#3B82F6] transition-colors font-medium">
              Join
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link 
              href="http://localhost:4028"
              className="bg-[#3B82F6] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2C2B28] transition-all shadow-lg hover:shadow-xl"
            >
              Launch Dashboard
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
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

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <Link href="#about" className="text-[#2C2B28] hover:text-[#3B82F6] transition-colors font-medium">
                About
              </Link>
              <Link href="#how-it-works" className="text-[#2C2B28] hover:text-[#3B82F6] transition-colors font-medium">
                How It Works
              </Link>
              <Link href="#ranks" className="text-[#2C2B28] hover:text-[#3B82F6] transition-colors font-medium">
                Ranks
              </Link>
              <Link href="#join" className="text-[#2C2B28] hover:text-[#3B82F6] transition-colors font-medium">
                Join
              </Link>
              <Link 
                href="http://localhost:4028"
                className="bg-[#3B82F6] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2C2B28] transition-all text-center"
              >
                Launch Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
