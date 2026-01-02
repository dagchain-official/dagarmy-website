'use client';

import DecryptedText from './DecryptedText';

export default function About() {

  return (
    <section id="about" className="py-20 px-12 bg-white">
      <div className="w-full max-w-[1600px] mx-auto">
        <div className="mb-16">
          <div className="inline-flex items-center space-x-2 mb-4">
            <svg className="w-5 h-5 text-[#3B82F6]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-[#3B82F6] font-semibold uppercase tracking-wide">About DAG ARMY</span>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-relaxed">
            <DecryptedText
              text="DAGCHAIN & DAGGPT are building infrastructure for AI ownership, decentralized compute, storage, and intelligent applications. Our DAG ARMY Community program plays a vital role in shaping the platform's future."
              animateOn="view"
              sequential={true}
              speed={30}
              revealDirection="start"
              className="text-[#2C2B28]"
              encryptedClassName="text-gray-400"
              parentClassName="block"
            />
          </h2>
        </div>
      </div>
    </section>
  );
}
