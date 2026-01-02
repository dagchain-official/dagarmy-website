'use client';

import { useEffect, useRef, useState } from 'react';

export default function Airdrops() {
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
    <section ref={sectionRef} id="airdrops" className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-4">
            <svg className="w-5 h-5 text-[#3B82F6]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-[#3B82F6] font-semibold uppercase tracking-wide">Weekly Airdrops</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C2B28] mb-6">
            Airdrop Distribution
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Every week, DAGCHAIN allocates a dedicated DAG ARMY Airdrop Pool
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-200 mb-12">
          <h3 className="text-2xl font-bold text-[#2C2B28] mb-8 text-center">Distribution Split</h3>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div 
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border-2 border-blue-200 text-center transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-blue-400 cursor-pointer"
              style={{
                animation: isVisible ? 'ripple-expand 0.8s ease-out' : 'none',
                animationDelay: '0s',
                animationFillMode: 'both'
              }}
            >
              <div className="text-6xl font-bold text-blue-600 mb-4">50%</div>
              <div className="text-xl font-bold text-[#2C2B28] mb-2">DAG Lieutenants</div>
              <p className="text-gray-600">Active contributors and service users</p>
            </div>

            <div 
              className="bg-gradient-to-br from-blue-500/20 to-blue-100 p-8 rounded-2xl border-2 border-[#3B82F6] text-center transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-blue-600 cursor-pointer"
              style={{
                animation: isVisible ? 'ripple-expand 0.8s ease-out' : 'none',
                animationDelay: '0.2s',
                animationFillMode: 'both'
              }}
            >
              <div className="text-6xl font-bold text-[#3B82F6] mb-4">30%</div>
              <div className="text-xl font-bold text-[#2C2B28] mb-2">DAG Generals</div>
              <p className="text-gray-600">Strategic leaders and top performers</p>
            </div>

            <div 
              className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-2xl border-2 border-gray-300 text-center transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-gray-400 cursor-pointer"
              style={{
                animation: isVisible ? 'ripple-expand 0.8s ease-out' : 'none',
                animationDelay: '0.4s',
                animationFillMode: 'both'
              }}
            >
              <div className="text-6xl font-bold text-gray-600 mb-4">20%</div>
              <div className="text-xl font-bold text-[#2C2B28] mb-2">DAG Soldiers</div>
              <p className="text-gray-600">Foundation community members</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 p-8 rounded-2xl border-2 border-blue-100">
            <h4 className="text-xl font-bold mb-4 text-[#2C2B28]">Airdrop Characteristics</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-[#3B82F6] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Performance-weighted</span>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-[#3B82F6] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Rank-based</span>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-[#3B82F6] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Transparent</span>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-[#3B82F6] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Designed to reward contribution over time</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
