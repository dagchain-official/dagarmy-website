"use client";
import React, { useState, useEffect } from "react";
import ModalVideo from "react-modal-video";
import PremiumButton from "./PremiumButton";

const AnimatedNoText = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const phrases = [
    'background filters.',
    'location limits.',
    'shortcuts promised.'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px',
      height: '50px',
      overflow: 'hidden'
    }}>
      <style jsx>{`
        @keyframes slideUp {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          10% {
            transform: translateY(0);
            opacity: 1;
          }
          90% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-100%);
            opacity: 0;
          }
        }
        .animated-text {
          animation: slideUp 3s ease-in-out;
        }
      `}</style>
      <span style={{
        fontSize: '42px',
        fontWeight: '800',
        color: '#1f2937',
        letterSpacing: '-0.02em',
        lineHeight: '1'
      }}>
        NO
      </span>
      
      <div style={{
        position: 'relative',
        flex: 1,
        height: '50px',
        display: 'flex',
        alignItems: 'center'
      }}>
        {phrases.map((phrase, index) => (
          <span
            key={index}
            className={index === currentIndex ? 'animated-text' : ''}
            style={{
              position: 'absolute',
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              opacity: index === currentIndex ? 1 : 0,
              transform: index === currentIndex ? 'translateY(0)' : 'translateY(100%)',
              transition: 'none',
              whiteSpace: 'nowrap'
            }}
          >
            {phrase}
          </span>
        ))}
      </div>
    </div>
  );
};

export default function Hero() {
  const [isOpen, setOpen] = useState(false);


  return (
    <>
      <div className="page-title-home2" style={{ background: '#fff !important', backgroundColor: '#fff', paddingTop: '80px', paddingBottom: '0' }}>
        <div className="tf-container" style={{ background: '#fff' }}>
          <div className="row items-center" style={{ alignItems: 'center', minHeight: 'auto' }}>
            <div className="col-lg-6">
              <div className="content" style={{ paddingTop: '0', paddingBottom: '0', marginBottom: '0' }}>
                <h1 className="fw-7 wow fadeInUp" data-wow-delay="0.2s" style={{
                  fontSize: '58px',
                  lineHeight: '1.2',
                  marginBottom: '24px',
                  color: '#1f2937'
                }}>
                  <span style={{ whiteSpace: 'nowrap' }}>Join the <span style={{
                    color: '#1f2937',
                    fontWeight: '700',
                    fontFamily: 'Nasalization, sans-serif'
                  }}>GLOBAL ARMY</span></span>
                  <br />
                  of Skill Builders and
                  <br />
                  Technology Creators
                </h1>
                <div className="wow fadeInUp" data-wow-delay="0.3s" style={{ marginBottom: '32px' }}>
                  {/* Animated "NO" statement */}
                  <AnimatedNoText />
                  
                  {/* Main description paragraph */}
                  <p style={{
                    fontSize: '17px',
                    lineHeight: '1.7',
                    color: '#4b5563',
                    marginBottom: '0',
                    fontWeight: '400',
                    maxWidth: '540px'
                  }}>
                    DAG Army brings together learners, builders, and professionals who want skills that lead to real outcomes. From early learners in Tier 3 cities to teams collaborating across continents, this is a place where capability grows through steady effort and structured learning.
                  </p>
                </div>
                <div className="bottom-btns" style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap', marginTop: '32px' }}>
                  <PremiumButton
                    text="Get Started"
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.modal) {
                        window.modal.open();
                      }
                    }}
                    className="wow fadeInUp"
                    data-wow-delay="0.4s"
                    style={{ fontSize: '16px', height: '52px', minWidth: '160px' }}
                  />
                  <a
                    href="/courses"
                    className="custom-explore-btn relative flex items-center gap-1 bg-[#1f2937] px-8 border-2 border-[#1f2937] text-base rounded-xl font-semibold text-white cursor-pointer overflow-hidden transition-all duration-600 ease-in-out hover:text-white hover:rounded-3xl group hover:transition-all hover:duration-700"
                    style={{ textDecoration: 'none', height: '52px', minWidth: '200px', justifyContent: 'center' }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="absolute w-6 fill-white z-[20] transition-all duration-700 ease-in-out -left-1/4 group-hover:left-4 group-hover:fill-white"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                      ></path>
                    </svg>
                    <span
                      className="relative z-[10] transition-all duration-700 ease-in-out -translate-x-3 group-hover:translate-x-3"
                    >
                      Explore the Program
                    </span>
                    <span
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-[#131836] rounded-full opacity-0 transition-all duration-700 ease-in-out group-hover:w-[270px] group-hover:h-[270px] group-hover:opacity-100 z-[0]"
                    ></span>
                    <svg
                      viewBox="0 0 24 24"
                      className="absolute w-6 fill-white z-[20] transition-all duration-700 ease-in-out right-4 group-hover:-right-1/4 group-hover:fill-white"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                      ></path>
                    </svg>
                  </a>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} style={{ color: '#1f2937', fontSize: '16px' }}>★</span>
                      ))}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', whiteSpace: 'nowrap' }}>
                      35,000+ verified learners worldwide
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div style={{
                width: '100%',
                height: '500px',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid #e5e7eb',
                position: 'relative'
              }}>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                >
                  <source src="/images/courses/hero.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalVideo
        channel="youtube"
        youtube={{ mute: 0, autoplay: 0 }}
        isOpen={isOpen}
        videoId="MLpWrANjFbI"
        onClose={() => setOpen(false)}
      />{" "}
    </>
  );
}
