'use client';

import { useEffect, useRef, useState } from 'react';

export default function Ranks() {
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
    <section id="ranks" className="py-20 px-6 bg-white" ref={sectionRef}>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-4">
            <svg className="w-5 h-5 text-[#3B82F6]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-[#3B82F6] font-semibold uppercase tracking-wide">Ranks & Roles</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C2B28]">
            Your Path to Leadership
          </h2>
        </div>

        <div className="space-y-8">
          {/* Card 1 - DAG Soldier */}
          <div 
            className="transition-all duration-700 ease-out"
            style={{
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
              opacity: isVisible ? 1 : 0,
              transitionDelay: '0s'
            }}
          >
            <div className="bg-gradient-to-br from-gray-100 to-gray-50 p-8 md:p-10 rounded-3xl shadow-lg border-2 border-gray-200">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gray-400 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  1
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-[#2C2B28] mb-2">DAG Soldier</h3>
                <p className="text-lg text-gray-600 mb-4 italic">The Foundation of DAGCHAIN</p>
                
                <div className="bg-white p-6 rounded-xl mb-4">
                  <h4 className="font-bold text-[#2C2B28] mb-2">Who becomes a DAG Soldier?</h4>
                  <p className="text-gray-700">Anyone who joins DAGCHAIN or DAGGPT automatically becomes a DAG Soldier. No payment required. No approval needed.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-xl">
                    <h4 className="font-bold text-[#2C2B28] mb-2">Benefits</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-[#3B82F6] mr-2">•</span>
                        <span>Eligible for 20% of weekly airdrops</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3B82F6] mr-2">•</span>
                        <span>Access to community updates</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3B82F6] mr-2">•</span>
                        <span>Entry point into DAG ARMY</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-xl">
                    <h4 className="font-bold text-[#2C2B28] mb-2">Ideal For</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-[#3B82F6] mr-2">•</span>
                        <span>New users</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3B82F6] mr-2">•</span>
                        <span>Community members</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3B82F6] mr-2">•</span>
                        <span>Explorers of DAGCHAIN & DAGGPT</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Card 2 - DAG Lieutenant */}
          <div 
            className="transition-all duration-700 ease-out"
            style={{
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
              opacity: isVisible ? 1 : 0,
              transitionDelay: '0.2s'
            }}
          >
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 md:p-10 rounded-3xl shadow-lg border-2 border-blue-200">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  2
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-[#2C2B28] mb-2">DAG Lieutenant</h3>
                <p className="text-lg text-gray-600 mb-4 italic">The Active Contributor</p>
                
                <div className="bg-white p-6 rounded-xl mb-4">
                  <h4 className="font-bold text-[#2C2B28] mb-2">How to Become a DAG Lieutenant</h4>
                  <p className="text-gray-700 mb-3">A DAG Soldier becomes a DAG Lieutenant by purchasing any DAGCHAIN or DAGGPT service worth <strong>$149 or more</strong>, such as:</p>
                  <ul className="space-y-2 text-gray-700 ml-4">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">✓</span>
                      <span>DAG Storage Node</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">✓</span>
                      <span>DAG Validator Node</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">✓</span>
                      <span>DAGGPT Premium / Special Subscription</span>
                    </li>
                  </ul>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-xl">
                    <h4 className="font-bold text-[#2C2B28] mb-2">Benefits</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Eligible for 50% of weekly airdrops</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Higher priority in community initiatives</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Access to advanced tasks</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Gateway to DAG General</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-xl">
                    <h4 className="font-bold text-[#2C2B28] mb-2">Ideal For</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Power users</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Node operators</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Serious ecosystem participants</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Card 3 - DAG General */}
          <div 
            className="transition-all duration-700 ease-out"
            style={{
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
              opacity: isVisible ? 1 : 0,
              transitionDelay: '0.4s'
            }}
          >
            <div className="bg-gradient-to-br from-blue-500/30 to-blue-500/50 p-8 md:p-10 rounded-3xl shadow-lg border-2 border-[#3B82F6]">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-[#3B82F6] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  3
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-[#2C2B28] mb-2">DAG General</h3>
                <p className="text-lg text-gray-600 mb-4 italic">The Strategic Leaders</p>
                
                <div className="bg-white p-6 rounded-xl mb-4">
                  <h4 className="font-bold text-[#2C2B28] mb-2">Eligibility Criteria</h4>
                  <p className="text-gray-700 mb-3">To become a DAG General, a user must be an active DAG Lieutenant AND meet one of the following:</p>
                  <ul className="space-y-2 text-gray-700 ml-4">
                    <li className="flex items-start">
                      <span className="text-[#3B82F6] mr-2">✓</span>
                      <span><strong>Accumulate 50,000 DAG Points</strong>, OR</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#3B82F6] mr-2">✓</span>
                      <span><strong>Generate $1,000 in sales</strong> through self activity or direct referrals</span>
                    </li>
                  </ul>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-xl">
                    <h4 className="font-bold text-[#2C2B28] mb-2">Benefits</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-[#3B82F6] mr-2">•</span>
                        <span>Eligible for 30% of weekly airdrops</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3B82F6] mr-2">•</span>
                        <span>Highest influence tier</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3B82F6] mr-2">•</span>
                        <span>Priority access to beta features</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3B82F6] mr-2">•</span>
                        <span>Recognition as ecosystem leader</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-xl">
                    <h4 className="font-bold text-[#2C2B28] mb-2">Ideal For</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-[#3B82F6] mr-2">•</span>
                        <span>Community leaders</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3B82F6] mr-2">•</span>
                        <span>Network builders</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3B82F6] mr-2">•</span>
                        <span>Long-term ecosystem advocates</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
