'use client';

import { useEffect, useRef, useState } from 'react';

export default function RankBadges() {
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

  const ranks = [
    { sl: 1, rank: 'INITIATOR', target: 1000, reward: 'MYSTERY BOX 100$' },
    { sl: 2, rank: 'VANGUARD', target: 2000, reward: 'MYSTERY BOX 200$' },
    { sl: 3, rank: 'GUARDIAN', target: 5000, reward: 'MYSTERY BOX 500$' },
    { sl: 4, rank: 'STRIKER', target: 7500, reward: 'MYSTERY BOX 750$' },
    { sl: 5, rank: 'INVOKER', target: 10000, reward: 'MYSTERY BOX 1000$' },
    { sl: 6, rank: 'COMMANDER', target: 15000, reward: 'MYSTERY BOX 1500$' },
    { sl: 7, rank: 'CHAMPION', target: 20000, reward: 'MYSTERY BOX 2000$' },
    { sl: 8, rank: 'CONQUEROR', target: 30000, reward: 'MYSTERY BOX 3000$' },
    { sl: 9, rank: 'PARAGON', target: 40000, reward: 'MYSTERY BOX 4000$' },
    { sl: 10, rank: 'MYTHIC', target: 50000, reward: 'MYSTERY BOX 5000$' },
  ];

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-4">
            <svg className="w-5 h-5 text-[#3B82F6]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-[#3B82F6] font-semibold uppercase tracking-wide">Achievement System</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C2B28] mb-6">
            Rank & Badges
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Progress through 10 exclusive ranks and unlock valuable mystery box rewards
          </p>
        </div>

        <div className="neuro-card">
          <div className="overflow-x-auto">
            <div className="grid gap-6">
              {/* Header Row */}
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="neuro-header text-center">
                  <span className="text-gray-900">RANK</span>
                </div>
                <div className="neuro-header text-center">
                  <span className="text-gray-900">TARGET* $</span>
                </div>
                <div className="neuro-header text-center">
                  <span className="text-gray-900">REWARD</span>
                </div>
              </div>

              {/* Data Rows */}
              {ranks.map((rank, index) => (
                <div
                  key={rank.sl}
                  className="grid grid-cols-3 gap-6"
                  style={{
                    animation: isVisible ? 'slide-in-left 0.6s ease-out' : 'none',
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: 'both'
                  }}
                >
                  <div className="neuro-cell text-center font-semibold text-[#2C2B28]">
                    {rank.rank}
                  </div>
                  <div className="neuro-cell text-center font-semibold text-gray-900">
                    ${rank.target.toLocaleString()}
                  </div>
                  <div className="neuro-cell text-center font-medium text-[#3B82F6]">
                    {rank.reward}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 neuro-note">
            <p className="text-sm text-gray-700 italic">
              <strong>*Note:</strong> Target amounts are cumulative contribution values. Mystery boxes contain exclusive rewards and benefits based on your rank achievement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
