'use client';

import { useEffect, useState } from 'react';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-blue-50/30 to-white pt-32 pb-20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center">
          {/* Badge */}
          <div 
            className={`inline-flex items-center space-x-3 bg-blue-50 border border-blue-200 rounded-full px-6 py-3 mb-8 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse"></span>
            <span className="text-[#3B82F6] font-semibold text-sm uppercase tracking-wide">
              Join the Movement
            </span>
            <span className="text-gray-600">→</span>
            <span className="text-gray-700 font-medium">Build the Future</span>
          </div>

          {/* Main Heading */}
          <h1 
            className={`text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#2C2B28] mb-6 leading-tight transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Build with <span className="text-[#3B82F6]">DAG ARMY</span>
            <br />
            <span className="italic">Shape the Future</span>
          </h1>

          {/* Subtitle */}
          <p 
            className={`text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            DAG ARMY is the official community growth program of{' '}
            <strong className="text-[#2C2B28]">DAGCHAIN</strong> and{' '}
            <strong className="text-[#2C2B28]">DAGGPT</strong>.
            <br />
            Earn rewards for building, promoting, and scaling the AI-powered decentralized ecosystem.
          </p>

          {/* CTA Buttons */}
          <div 
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <a
              href="#join"
              className="group relative bg-[#3B82F6] text-white px-10 py-5 rounded-xl text-lg font-bold hover:bg-[#2C2B28] transition-all shadow-2xl hover:shadow-blue-500/50 hover:scale-105 inline-flex items-center space-x-2"
            >
              <span>Join as Soldier</span>
              <svg 
                className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="http://localhost:4028"
              className="border-2 border-[#2C2B28] text-[#2C2B28] px-10 py-5 rounded-xl text-lg font-bold hover:bg-[#2C2B28] hover:text-white transition-all inline-flex items-center space-x-2"
            >
              <span>Launch Dashboard</span>
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* Hero Image/Dashboard Preview */}
          <div 
            className={`relative max-w-6xl mx-auto transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8">
              <div className="aspect-video bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-[#3B82F6] rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-[#2C2B28]">DAG ARMY Dashboard</div>
                  <div className="text-gray-600">Track your progress, earn rewards, climb ranks</div>
                </div>
              </div>
            </div>
            {/* Shadow effect */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gradient-to-b from-gray-300/50 to-transparent blur-2xl rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
