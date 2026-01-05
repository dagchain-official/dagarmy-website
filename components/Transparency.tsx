'use client';

import { useEffect, useRef, useState } from 'react';

export default function Transparency() {
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
            <span className="text-[#3B82F6] font-semibold uppercase tracking-wide">Transparency & Fairness</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C2B28] mb-6">
            Built on Trust
          </h2>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-200 mb-12">
          <h3 className="text-2xl font-bold text-[#2C2B28] mb-8 text-center">Core Principles</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div 
              className="bg-white p-8 rounded-2xl shadow-md border-l-4 border-[#3B82F6] transition-all duration-300 hover:shadow-2xl cursor-pointer"
              style={{
                animation: isVisible ? 'zoom-in-rotate 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
                animationDelay: '0s',
                animationFillMode: 'both'
              }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{
                    animation: isVisible ? 'glow-pulse 2s ease-in-out infinite' : 'none',
                    animationDelay: '0.8s'
                  }}
                >
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#2C2B28] mb-2">No Hidden Mechanics</h4>
                  <p className="text-gray-600">Everything is transparent and clearly explained. No surprises, no fine print.</p>
                </div>
              </div>
            </div>

            <div 
              className="bg-white p-8 rounded-2xl shadow-md border-l-4 border-[#3B82F6] transition-all duration-300 hover:shadow-2xl cursor-pointer"
              style={{
                animation: isVisible ? 'zoom-in-rotate 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
                animationDelay: '0.15s',
                animationFillMode: 'both'
              }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{
                    animation: isVisible ? 'glow-pulse 2s ease-in-out infinite' : 'none',
                    animationDelay: '0.8s'
                  }}
                >
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#2C2B28] mb-2">No Guaranteed Returns</h4>
                  <p className="text-gray-600">We don't make false promises. Rewards are based on contribution and ecosystem health.</p>
                </div>
              </div>
            </div>

            <div 
              className="bg-white p-8 rounded-2xl shadow-md border-l-4 border-[#3B82F6] transition-all duration-300 hover:shadow-2xl cursor-pointer"
              style={{
                animation: isVisible ? 'zoom-in-rotate 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
                animationDelay: '0.3s',
                animationFillMode: 'both'
              }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{
                    animation: isVisible ? 'glow-pulse 2s ease-in-out infinite' : 'none',
                    animationDelay: '1s'
                  }}
                >
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#2C2B28] mb-2">No Pay-to-Win</h4>
                  <p className="text-gray-600">Merit and contribution matter most. You can't buy your way to the top.</p>
                </div>
              </div>
            </div>

            <div 
              className="bg-white p-8 rounded-2xl shadow-md border-l-4 border-[#3B82F6] transition-all duration-300 hover:shadow-2xl cursor-pointer"
              style={{
                animation: isVisible ? 'zoom-in-rotate 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
                animationDelay: '0.45s',
                animationFillMode: 'both'
              }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{
                    animation: isVisible ? 'glow-pulse 2s ease-in-out infinite' : 'none',
                    animationDelay: '1.2s'
                  }}
                >
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#2C2B28] mb-2">No Inflationary Promises</h4>
                  <p className="text-gray-600">Sustainable rewards from real ecosystem allocations, not artificial token printing.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 p-8 md:p-12 rounded-3xl border-2 border-blue-100 text-center">
          <h3 className="text-3xl font-bold mb-4 text-[#2C2B28]">Sustainable Rewards</h3>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Rewards come from ecosystem allocations, not artificial token printing. We're building for the long term.
          </p>
        </div>
      </div>
    </section>
  );
}
