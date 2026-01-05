'use client';

import { useEffect, useRef, useState } from 'react';

export default function Tasks() {
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
    <section ref={sectionRef} className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-4">
            <svg className="w-5 h-5 text-[#3B82F6]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-[#3B82F6] font-semibold uppercase tracking-wide">Tasks & Participation</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C2B28] mb-6">
            Contribute & Earn
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            DAG ARMY members may receive periodic tasks to support ecosystem growth
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div 
            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-[#3B82F6] cursor-pointer relative overflow-hidden group"
            style={{
              animation: isVisible ? 'flip-in 0.8s ease-out' : 'none',
              animationDelay: '0s',
              animationFillMode: 'both'
            }}
          >
            <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
            <h3 className="text-xl font-bold text-[#2C2B28] mb-3">Platform Engagement</h3>
            <p className="text-gray-600 leading-relaxed">
              Active participation in DAGCHAIN and DAGGPT platforms, testing features, and providing valuable feedback
            </p>
            </div>
          </div>

          <div 
            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-[#3B82F6] cursor-pointer relative overflow-hidden group"
            style={{
              animation: isVisible ? 'flip-in 0.8s ease-out' : 'none',
              animationDelay: '0.2s',
              animationFillMode: 'both'
            }}
          >
            <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
            <h3 className="text-xl font-bold text-[#2C2B28] mb-3">Community Support</h3>
            <p className="text-gray-600 leading-relaxed">
              Helping new members, answering questions, and fostering a positive community environment
            </p>
            </div>
          </div>

          <div 
            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-[#3B82F6] cursor-pointer relative overflow-hidden group"
            style={{
              animation: isVisible ? 'flip-in 0.8s ease-out' : 'none',
              animationDelay: '0.4s',
              animationFillMode: 'both'
            }}
          >
            <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
            <h3 className="text-xl font-bold text-[#2C2B28] mb-3">Content Amplification</h3>
            <p className="text-gray-600 leading-relaxed">
              Sharing official announcements, creating content, and spreading awareness about DAGCHAIN
            </p>
            </div>
          </div>

          <div 
            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-[#3B82F6] cursor-pointer relative overflow-hidden group"
            style={{
              animation: isVisible ? 'flip-in 0.8s ease-out' : 'none',
              animationDelay: '0.6s',
              animationFillMode: 'both'
            }}
          >
            <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
            <h3 className="text-xl font-bold text-[#2C2B28] mb-3">Ecosystem Growth</h3>
            <p className="text-gray-600 leading-relaxed">
              Activities that directly contribute to expanding the DAGCHAIN ecosystem and user base
            </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 p-8 md:p-12 rounded-3xl border-2 border-blue-100">
          <h3 className="text-3xl font-bold mb-6 text-center text-[#2C2B28]">Task Characteristics</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-2 text-[#2C2B28]">Simple</h4>
              <p className="text-gray-600">Easy to understand and complete</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-2 text-[#2C2B28]">Time-bound</h4>
              <p className="text-gray-600">Clear deadlines for completion</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-2 text-[#2C2B28]">Measurable</h4>
              <p className="text-gray-600">Clearly defined success criteria</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-2 text-[#2C2B28]">Impactful</h4>
              <p className="text-gray-600">Designed to create real value</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
