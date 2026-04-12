"use client";
import React, { useState, useEffect, useRef } from "react";
import { detectUserCountry, getDisplayCountry } from "@/lib/geoLocation";
import styles from "./Features.module.css";
import "./Features.global.css";

export default function Features() {
  const [userCountry, setUserCountry] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sliderRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const totalCards = 4;

  useEffect(() => {
    const detectCountry = async () => {
      const result = await detectUserCountry();
      setUserCountry(result.country);
    };
    detectCountry();
  }, []);

  // Auto-slide every 2 seconds on mobile
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalCards);
    }, 2000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Touch/swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsAutoPlaying(false);
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next card
        setCurrentSlide((prev) => (prev + 1) % totalCards);
      } else {
        // Swipe right - previous card
        setCurrentSlide((prev) => (prev - 1 + totalCards) % totalCards);
      }
    }

    // Resume autoplay after 3 seconds
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 3000);
  };
  const features = [
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      title: "Courses guided by experienced professionals",
      description: "Learn from industry experts with real-world experience"
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
          <line x1="12" y1="18" x2="12.01" y2="18"></line>
        </svg>
      ),
      title: "Flexible access on mobile and desktop",
      description: "Learn anywhere, anytime on any device"
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      ),
      title: "Progress built around consistency and revision",
      description: "Structured learning path designed for long-term retention"
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      ),
      title: `Learners from ${getDisplayCountry(userCountry)} continue learning through 2026 with full access`,
      description: "Join thousands of active learners building their future"
    }
  ];

  return (
    <section 
      className={styles['features-section'] || ''}
      style={{
        padding: '80px 0',
        background: '#fafafa',
        position: 'relative'
      }}
    >
      <div className={`tf-container ${styles['features-container'] || ''}`} style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 
            className={styles['section-heading'] || ''}
            style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#1a1a1a',
              marginBottom: '16px',
              lineHeight: '1.3'
            }}
          >
            Learning Experience
          </h2>
          <p 
            className={styles['section-description'] || ''}
            style={{
              fontSize: '18px',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            Designed for real growth with practical tools and continuous support
          </p>
        </div>

        <div 
          ref={sliderRef}
          className={styles['features-grid'] || ''}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            marginTop: '40px'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div style={{
            display: 'contents',
            transform: `translateX(-${currentSlide * 100}%)`,
            transition: 'transform 0.5s ease-in-out'
          }}>
          {features.map((feature, index) => (
            <div
              key={index}
              className={`wow fadeInUp ${styles['feature-card'] || ''} ${currentSlide === index ? 'active' : ''}`}
              data-wow-delay={`${0.1 * (index + 1)}s`}
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '24px 18px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                border: '1px solid #f0f0f0',
                cursor: 'default',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                height: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.borderColor = '#000000';
                const icon = e.currentTarget.querySelector('.feature-icon');
                if (icon) {
                  icon.style.background = '#000000';
                  icon.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.borderColor = '#f0f0f0';
                const icon = e.currentTarget.querySelector('.feature-icon');
                if (icon) {
                  icon.style.background = '#f3f4f6';
                  icon.style.color = '#000000';
                }
              }}
            >
              <div
                className={`feature-icon ${styles['feature-icon'] || ''}`}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  color: '#000000',
                  transition: 'all 0.3s ease'
                }}
              >
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '10px',
                lineHeight: '1.4'
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.6',
                margin: '0'
              }}>
                {feature.description}
              </p>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
