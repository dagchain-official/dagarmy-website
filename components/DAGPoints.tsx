'use client';

import { useEffect, useRef, useState } from 'react';

export default function DAGPoints() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-4">
            <svg className="w-5 h-5 text-[#3B82F6]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-[#3B82F6] font-semibold uppercase tracking-wide">DAG Points</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C2B28] mb-6">
            What Are DAG Points?
          </h2>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-200">
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            DAG Points are internal contribution metrics earned by actively participating in the DAGCHAIN ecosystem.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div 
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:scale-110 hover:-translate-y-2 hover:border-[#3B82F6] cursor-pointer relative overflow-hidden group"
              style={{
                animation: isVisible ? 'slide-in-left 0.8s ease-out' : 'none',
                animationDelay: '0s',
                animationFillMode: 'both'
              }}
            >
              <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center mb-4 relative z-10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#2C2B28] mb-2 relative z-10">Platform Usage</h3>
              <p className="text-gray-600 relative z-10">Active engagement with DAGCHAIN and DAGGPT services</p>
            </div>

            <div 
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:scale-110 hover:-translate-y-2 hover:border-[#3B82F6] cursor-pointer relative overflow-hidden group"
              style={{
                animation: isVisible ? 'slide-in-left 0.8s ease-out' : 'none',
                animationDelay: '0.15s',
                animationFillMode: 'both'
              }}
            >
              <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center mb-4 relative z-10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#2C2B28] mb-2 relative z-10">Completing Tasks</h3>
              <p className="text-gray-600 relative z-10">Finishing assigned community and ecosystem tasks</p>
            </div>

            <div 
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:scale-110 hover:-translate-y-2 hover:border-[#3B82F6] cursor-pointer relative overflow-hidden group"
              style={{
                animation: isVisible ? 'slide-in-left 0.8s ease-out' : 'none',
                animationDelay: '0.3s',
                animationFillMode: 'both'
              }}
            >
              <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center mb-4 relative z-10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#2C2B28] mb-2 relative z-10">Sales Activity</h3>
              <p className="text-gray-600 relative z-10">Contributing to ecosystem growth through purchases</p>
            </div>

            <div 
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:scale-110 hover:-translate-y-2 hover:border-[#3B82F6] cursor-pointer relative overflow-hidden group"
              style={{
                animation: isVisible ? 'slide-in-left 0.8s ease-out' : 'none',
                animationDelay: '0.45s',
                animationFillMode: 'both'
              }}
            >
              <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center mb-4 relative z-10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#2C2B28] mb-2 relative z-10">Community Engagement</h3>
              <p className="text-gray-600 relative z-10">Participating in discussions and community building</p>
            </div>

            <div 
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:scale-110 hover:-translate-y-2 hover:border-[#3B82F6] cursor-pointer relative overflow-hidden group"
              style={{
                animation: isVisible ? 'slide-in-left 0.8s ease-out' : 'none',
                animationDelay: '0.6s',
                animationFillMode: 'both'
              }}
            >
              <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center mb-4 relative z-10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#2C2B28] mb-2 relative z-10">Referrals</h3>
              <p className="text-gray-600 relative z-10">Direct referrals that contribute to ecosystem growth</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 p-8 rounded-2xl border-2 border-blue-100">
            <h3 className="text-2xl font-bold mb-4 text-[#2C2B28]">DAG Points Purpose</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-[#3B82F6] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-lg text-gray-700">Determine rank progression</span>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-[#3B82F6] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-lg text-gray-700">Unlock DAG General eligibility</span>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-[#3B82F6] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-lg text-gray-700">Reflect long-term contribution</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-300">
              <p className="text-gray-600 italic">
                (DAG Points are not tokens and have no speculative value.)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
