'use client';

import { useEffect, useRef, useState } from 'react';

export default function WhoShouldJoin() {
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
            <span className="text-[#3B82F6] font-semibold uppercase tracking-wide">Who Should Join</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C2B28] mb-6">
            Is DAG ARMY Right for You?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div 
            className="bg-white p-6 rounded-2xl shadow-lg border-2 border-[#3B82F6] transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer"
            style={{
              animation: isVisible ? 'ripple-expand 1s ease-out' : 'none',
              animationDelay: '0s',
              animationFillMode: 'both'
            }}
          >
            <h3 className="text-xl font-bold text-[#2C2B28] mb-3">You believe in AI + Blockchain convergence</h3>
            <p className="text-gray-600 leading-relaxed">
              You see the potential of combining artificial intelligence with blockchain technology and want to be part of this revolution.
            </p>
          </div>

          <div 
            className="bg-white p-6 rounded-2xl shadow-lg border-2 border-[#3B82F6] transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer"
            style={{
              animation: isVisible ? 'ripple-expand 1s ease-out' : 'none',
              animationDelay: '0.2s',
              animationFillMode: 'both'
            }}
          >
            <h3 className="text-xl font-bold text-[#2C2B28] mb-3">You want to participate beyond speculation</h3>
            <p className="text-gray-600 leading-relaxed">
              You're not just looking for quick gains - you want to actively contribute to building something meaningful.
            </p>
          </div>

          <div 
            className="bg-white p-6 rounded-2xl shadow-lg border-2 border-[#3B82F6] transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer"
            style={{
              animation: isVisible ? 'ripple-expand 1s ease-out' : 'none',
              animationDelay: '0.4s',
              animationFillMode: 'both'
            }}
          >
            <h3 className="text-xl font-bold text-[#2C2B28] mb-3">You're building or using Web3 & AI tools</h3>
            <p className="text-gray-600 leading-relaxed">
              You're already engaged with Web3 technologies or AI applications and want to leverage DAGCHAIN's infrastructure.
            </p>
          </div>

          <div 
            className="bg-white p-6 rounded-2xl shadow-lg border-2 border-[#3B82F6] transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer"
            style={{
              animation: isVisible ? 'ripple-expand 1s ease-out' : 'none',
              animationDelay: '0.6s',
              animationFillMode: 'both'
            }}
          >
            <h3 className="text-xl font-bold text-[#2C2B28] mb-3">You prefer contribution-based rewards</h3>
            <p className="text-gray-600 leading-relaxed">
              You value merit-based systems where your effort and contribution directly impact your rewards.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 p-8 md:p-12 rounded-3xl border-2 border-blue-100 text-center shadow-xl">
          <h3 className="text-3xl font-bold mb-4 text-[#2C2B28]">Ready to Make an Impact?</h3>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of contributors building the future of decentralized AI infrastructure
          </p>
          <a 
            href="#join" 
            className="inline-block bg-[#3B82F6] text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-[#2C2B28] hover:text-white transition-all transform hover:scale-105 shadow-lg"
          >
            Join DAG ARMY Now
          </a>
        </div>
      </div>
    </section>
  );
}
