'use client';

import { useEffect, useRef, useState } from 'react';

const starRotationStyle = `
  @keyframes rotate-star {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .rotating-star {
    animation: rotate-star 8s linear infinite;
  }
`;

const features = [
  { name: 'INNOVATION', rotation: 0, position: { bottom: '15%', right: '-15%' }, align: 'right' },
  { name: 'IMAGINATION', rotation: 120, position: { top: '40%', left: '-20%' }, align: 'left' },
  { name: 'CREATIVITY', rotation: 240, position: { top: '15%', right: '-12%' }, align: 'right' }
];

export default function Hero() {
  const imageRef = useRef<HTMLImageElement>(null);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const rotationRef = useRef(0);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const targetRotation = features[currentFeatureIndex].rotation;
    
    const animate = () => {
      const diff = targetRotation - rotationRef.current;
      
      if (Math.abs(diff) > 0.5) {
        rotationRef.current += diff * 0.08;
        
        if (imageRef.current) {
          imageRef.current.style.transform = `translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(${rotationRef.current}deg) skew(0deg, 0deg)`;
          imageRef.current.style.transformStyle = 'preserve-3d';
          imageRef.current.style.willChange = 'transform';
        }
        
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        rotationRef.current = targetRotation;
        if (imageRef.current) {
          imageRef.current.style.transform = `translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(${rotationRef.current}deg) skew(0deg, 0deg)`;
        }
      }
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentFeatureIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentFeature = features[currentFeatureIndex];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: starRotationStyle }} />
      <section className="min-h-screen flex items-center justify-center py-20 bg-white relative overflow-hidden">
      <div className="w-full max-w-[1600px] mx-auto px-12">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-32 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#2C2B28] leading-none">
                  DAG ARMY
                </h1>
                <div className="w-12 h-12 flex items-center justify-center rotating-star">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#3B82F6]">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#2C2B28] leading-none">
                MEETS
              </h2>
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold italic text-[#2C2B28] leading-none">
                INNOVATION
              </h2>
            </div>

            <p className="text-xl text-gray-700 max-w-xl leading-relaxed">
              DAG ARMY is the official community growth and contribution program of <strong>DAGCHAIN</strong> and <strong>DAGGPT</strong> designed to reward users who actively participate in building, promoting, and scaling the ecosystem.
            </p>

            <div className="flex flex-wrap gap-4">
              <a 
                href="#join" 
                className="bg-[#2C2B28] text-white px-8 py-4 rounded-none text-lg font-medium hover:bg-[#3B82F6] transition-all inline-flex items-center gap-2"
              >
                <span>Join Now</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                  <path d="M9.65525 5.46747L19.2717 5.46747L19.2717 15.0839M19.0308 5.66187L5.20746 19.4852" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </a>
              <a 
                href="#about" 
                className="border-2 border-[#2C2B28] text-[#2C2B28] px-8 py-4 rounded-none text-lg font-medium hover:bg-[#2C2B28] hover:text-white transition-all inline-flex items-center gap-2"
              >
                <span>Learn More</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                  <path d="M9.65525 5.46747L19.2717 5.46747L19.2717 15.0839M19.0308 5.66187L5.20746 19.4852" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="relative flex items-center justify-center w-full" style={{ minHeight: '700px' }}>
            <div className="relative w-full max-w-[600px] aspect-square">
              <img
                ref={imageRef}
                src="https://cdn.prod.website-files.com/682b1f489ed91ac67db927ed/68383a88c38fd0d356670d0e_Paper%20Ball.webp"
                alt="3D Geometric Shape"
                className="w-full h-full object-contain transition-transform duration-700 ease-out"
              />
              
              <div 
                key={currentFeatureIndex}
                className={`absolute flex items-center gap-3 animate-fade-in z-10 ${currentFeature.align === 'left' ? 'flex-row-reverse' : ''}`}
                style={currentFeature.position}
              >
                <div className="w-3 h-3 rounded-full bg-[#3B82F6] shadow-lg shadow-blue-500/50 flex-shrink-0"></div>
                <div className="h-[2px] w-20 bg-[#2C2B28] flex-shrink-0"></div>
                <div className="text-sm font-bold text-[#2C2B28] uppercase tracking-wider whitespace-nowrap">
                  {currentFeature.name}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
