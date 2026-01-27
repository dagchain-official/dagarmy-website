"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const allStories = [
  {
    id: 1,
    title: "From Self Doubt to Clear Direction",
    description: "Small-town learner who stopped waiting and started building skills with clarity.",
    category: "Career Reset"
  },
  {
    id: 2,
    title: "When Career Experience Needed a Reset",
    description: "Working professional who chose learning over stagnation.",
    category: "Professional Growth"
  },
  {
    id: 3,
    title: "Teaching Story was Missing out on Growth",
    description: "Educator who transformed herself to become more relevant and valuable.",
    category: "Education Evolution"
  },
  {
    id: 4,
    title: "Finding Independence Without Changing Responsibilities",
    description: "Homemaker who built confidence and income on her own schedule.",
    category: "Personal Independence"
  },
  {
    id: 5,
    title: "College Life Was Clear but the Future Was Not",
    description: "Student who prepared early instead of depending only on placements.",
    category: "Student Journey"
  },
  {
    id: 6,
    title: "A Local Business Facing Slow Decline",
    description: "Shop owner who learned smarter ways to reach customers.",
    category: "Business Revival"
  },
  {
    id: 7,
    title: "Busy Days with No Personal Time Left",
    description: "Freelancer who reduced chaos and gained control over work hours.",
    category: "Work-Life Balance"
  },
  {
    id: 8,
    title: "Rejections That Forced a Skill Upgrade",
    description: "Job seeker who replaced uncertainty with preparation.",
    category: "Job Preparation"
  },
  {
    id: 9,
    title: "Small City Limiting My Bigger Ambitions",
    description: "Learner no longer limited by birthplace through proper skill building.",
    category: "Breaking Barriers"
  },
  {
    id: 10,
    title: "Experience Was Strong but Confidence Was Shaking",
    description: "Professional who proved growth does not depend on age.",
    category: "Age-Defying Growth"
  },
  {
    id: 11,
    title: "More Videos Coming Soon",
    description: "We're working on bringing you more inspiring stories of transformation and growth.",
    category: "Coming Soon",
    isComingSoon: true
  }
];

const StoryCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Define slide groups - each slide shows only complete cards
  const slideGroups = [
    [0, 1, 2],     // Cards 1, 2, 3
    [3, 4, 5],     // Cards 4, 5, 6
    [6, 7, 8],     // Cards 7, 8, 9
    [9],           // Card 10 (Experience Was Strong...)
    [10]           // Card 11 (Coming Soon)
  ];

  const totalSlides = slideGroups.length;

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const getCurrentCards = () => {
    return slideGroups[currentSlide].map(index => allStories[index]);
  };

  return (
    <div 
      className="story-carousel-wrapper"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      style={{
        position: 'relative',
        marginBottom: '40px',
        maxWidth: '1400px',
        margin: '0 auto 40px',
        paddingLeft: '120px',
        paddingRight: '120px',
        paddingTop: '30px',
        paddingBottom: '30px'
      }}
    >
      {/* Left Navigation Button */}
      <button
        onClick={handlePrev}
        style={{
          position: 'absolute',
          left: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: '#fff',
          border: '2px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#000000';
          e.currentTarget.style.borderColor = '#000000';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          const svg = e.currentTarget.querySelector('svg');
          if (svg) svg.style.stroke = '#fff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#fff';
          e.currentTarget.style.borderColor = '#e5e7eb';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          const svg = e.currentTarget.querySelector('svg');
          if (svg) svg.style.stroke = '#1f2937';
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2" style={{ transition: 'stroke 0.3s ease' }}>
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      {/* Right Navigation Button */}
      <button
        onClick={handleNext}
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: '#fff',
          border: '2px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#000000';
          e.currentTarget.style.borderColor = '#000000';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          const svg = e.currentTarget.querySelector('svg');
          if (svg) svg.style.stroke = '#fff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#fff';
          e.currentTarget.style.borderColor = '#e5e7eb';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          const svg = e.currentTarget.querySelector('svg');
          if (svg) svg.style.stroke = '#1f2937';
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2" style={{ transition: 'stroke 0.3s ease' }}>
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      {/* Cards Container */}
      <div 
        style={{
          width: '100%',
          maxWidth: '1092px',
          margin: '0 auto',
          position: 'relative',
          padding: '20px 0',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            minHeight: '380px'
          }}
        >
          {slideGroups.map((group, slideIndex) => {
            const cardsInSlide = group.map(index => allStories[index]);
            const isActive = slideIndex === currentSlide;
            const cardCount = cardsInSlide.length;
            
            return (
              <div
                key={slideIndex}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  display: 'flex',
                  gap: '24px',
                  justifyContent: cardCount === 1 ? 'center' : 'flex-start',
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateX(0)' : `translateX(${slideIndex > currentSlide ? '50px' : '-50px'})`,
                  transition: 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out',
                  pointerEvents: isActive ? 'auto' : 'none'
                }}
              >
                {cardsInSlide.map((story, cardIndex) => (
                  <div
                    key={`${story.id}-${cardIndex}`}
                    className="story-card"
                    style={{
                      width: cardCount === 1 ? '340px' : '340px',
                      minWidth: '340px',
                      maxWidth: '340px',
                      height: '380px',
                      background: '#fff',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                      border: '1px solid #e5e7eb',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.12)';
                      const preview = e.currentTarget.querySelector('.preview-badge');
                      if (preview) preview.style.opacity = '1';
                      if (preview) preview.style.transform = 'translateY(0)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                      const preview = e.currentTarget.querySelector('.preview-badge');
                      if (preview) preview.style.opacity = '0';
                      if (preview) preview.style.transform = 'translateY(-10px)';
                    }}
                  >

                    {/* Video View Area */}
                    <div style={{
                      width: '100%',
                      height: '55%',
                      background: story.isComingSoon 
                        ? 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)'
                        : '#000000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}>
                      {/* Play Button or Coming Soon Icon */}
                      {story.isComingSoon ? (
                        <div style={{
                          fontSize: '48px',
                          color: '#9ca3af'
                        }}>
                          ⏳
                        </div>
                      ) : (
                        <div style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.95)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                        }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000" style={{ marginLeft: '2px' }}>
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      )}

                      {/* Bottom Badges - Only show for regular videos */}
                      {!story.isComingSoon && (
                        <div style={{
                          position: 'absolute',
                          bottom: '8px',
                          right: '8px',
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center'
                        }}>
                          {/* Preview Badge */}
                          <div 
                            className="preview-badge"
                            style={{
                              background: 'rgba(0, 0, 0, 0.6)',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '600',
                              color: 'rgba(255, 255, 255, 0.9)',
                              opacity: 0,
                              transform: 'translateY(-10px)',
                              transition: 'opacity 0.3s ease, transform 0.3s ease'
                            }}
                          >
                            Preview
                          </div>
                          
                          {/* Duration Badge */}
                          <div style={{
                            background: 'rgba(0, 0, 0, 0.6)',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)'
                          }}>
                            5:30
                          </div>
                        </div>
                      )}

                      {/* Category Tag */}
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        padding: '6px 12px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#6b7280'
                      }}>
                        {story.category}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div style={{
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '45%'
                    }}>
                      <h4 style={{
                        fontSize: '15px',
                        fontWeight: '700',
                        color: '#1f2937',
                        marginBottom: '8px',
                        lineHeight: '1.4',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {story.title}
                      </h4>

                      <div>
                        <p style={{
                          fontSize: '13px',
                          lineHeight: '1.5',
                          color: '#6b7280',
                          marginBottom: '12px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {story.description}
                        </p>

                        {!story.isComingSoon && (
                          <Link
                            href="#"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              color: '#000000',
                              fontSize: '14px',
                              fontWeight: '600',
                              textDecoration: 'none',
                              transition: 'gap 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.gap = '8px';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.gap = '6px';
                            }}
                          >
                            Watch Story →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function Stories() {
  return (
    <section 
      className="section-stories" 
      style={{ 
        padding: '80px 0',
        background: '#fafafa',
        overflow: 'hidden'
      }}
    >
      <div className="tf-container">
        {/* Section Heading */}
        <div style={{ 
          marginBottom: '56px',
          maxWidth: '900px'
        }}>
          <h2 style={{
            fontSize: '42px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '16px',
            letterSpacing: '-0.02em',
            lineHeight: '1.2'
          }}>
            Stories of People Who Chose to Act and Change Direction
          </h2>
          
          <p style={{
            fontSize: '18px',
            lineHeight: '1.6',
            color: '#6b7280',
            marginBottom: '0'
          }}>
            Different lives, different challenges, shared moments where action replaced hesitation
          </p>
        </div>
      </div>

      {/* Story Carousel */}
      <StoryCarousel />
    </section>
  );
}
