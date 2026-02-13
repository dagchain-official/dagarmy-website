"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const allStories = [
  {
    id: 1,
    title: "From Self Doubt to Clear Direction",
    description: "Small-town learner who stopped waiting and started building skills with clarity.",
    category: "Career Reset",
    videoUrl: "https://dagarmy1.b-cdn.net/From%20Self%20Doubt%20to%20Clear%20Direction.mp4"
  },
  {
    id: 2,
    title: "When Career Experience Needed a Reset",
    description: "Working professional who chose learning over stagnation.",
    category: "Professional Growth",
    videoUrl: "https://dagarmy1.b-cdn.net/When%20Career%20Experience%20Needed%20a%20Reset.mp4"
  },
  {
    id: 3,
    title: "Teaching Story was Missing out on Growth",
    description: "Educator who transformed herself to become more relevant and valuable.",
    category: "Education Evolution",
    videoUrl: "https://dagarmy1.b-cdn.net/Teaching%20Story%20was%20Missing%20out%20on%20Growth.mp4"
  },
  {
    id: 4,
    title: "Finding Independence Without Changing Responsibilities",
    description: "Homemaker who built confidence and income on her own schedule.",
    category: "Personal Independence",
    videoUrl: "https://dagarmy1.b-cdn.net/Finding%20Independence%20Without%20Changing%20Responsibilities.mp4"
  },
  {
    id: 5,
    title: "College Life Was Clear but the Future Was Not",
    description: "Student who prepared early instead of depending only on placements.",
    category: "Student Journey",
    videoUrl: "https://dagarmy1.b-cdn.net/College%20Life%20Was%20Clear%20but%20the%20Future%20Was%20Not.mp4"
  },
  {
    id: 6,
    title: "A Local Business Facing Slow Decline",
    description: "Shop owner who learned smarter ways to reach customers.",
    category: "Business Revival",
    videoUrl: "https://dagarmy1.b-cdn.net/A%20Local%20Business%20Facing%20Slow%20Decline.mp4"
  },
  {
    id: 7,
    title: "Busy Days with No Personal Time Left",
    description: "Freelancer who reduced chaos and gained control over work hours.",
    category: "Work-Life Balance",
    videoUrl: "https://dagarmy1.b-cdn.net/Busy%20Days%20with%20No%20Personal%20Time%20Left.mp4"
  },
  {
    id: 8,
    title: "Rejections That Forced a Skill Upgrade",
    description: "Job seeker who replaced uncertainty with preparation.",
    category: "Job Preparation",
    videoUrl: "https://dagarmy1.b-cdn.net/Rejections%20That%20Forced%20a%20Skill%20Upgrade.mp4"
  },
  {
    id: 9,
    title: "Small City Limiting My Bigger Ambitions",
    description: "Learner no longer limited by birthplace through proper skill building.",
    category: "Breaking Barriers",
    videoUrl: "https://dagarmy1.b-cdn.net/Small%20City%20Limiting%20My%20Bigger%20Ambitions.mp4"
  },
  {
    id: 10,
    title: "Experience Was Strong but Confidence Was Shaking",
    description: "Professional who proved growth does not depend on age.",
    category: "Age-Defying Growth",
    videoUrl: "https://dagarmy1.b-cdn.net/Experience%20Was%20Strong%20but%20Confidence%20Was%20Shaking.mp4"
  },
  {
    id: 11,
    title: "When the Idea Was Ready but the Tech Was Not",
    description: "Innovator who bridged the gap between concept and execution through shared expertise.",
    category: "Innovation Journey",
    videoUrl: "https://dagarmy1.b-cdn.net/Dagarmy%20Website%20Video%2011.mp4"
  },
  {
    id: 12,
    title: "Turning Contribution into Career Growth",
    description: "Professional who realized that helping others was the fastest way to help himself.",
    category: "Career Development",
    videoUrl: "https://dagarmy1.b-cdn.net/Dagarmy%20Website%20Video%2012.mp4"
  }
];

const StoryCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);
  const [popupVideoUrl, setPopupVideoUrl] = useState('');

  // Define slide groups - each slide shows only complete cards
  const slideGroups = [
    [0, 1, 2],     // Cards 1, 2, 3
    [3, 4, 5],     // Cards 4, 5, 6
    [6, 7, 8],     // Cards 7, 8, 9
    [9, 10, 11]    // Cards 10, 11, 12
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
                    onClick={() => {
                      if (story.videoUrl && !story.isComingSoon) {
                        setPopupVideoUrl(story.videoUrl);
                        setIsVideoPopupOpen(true);
                      }
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
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      {/* Video Thumbnail Preview */}
                      {story.videoUrl && !story.isComingSoon && (
                        <video
                          src={story.videoUrl}
                          muted
                          playsInline
                          preload="metadata"
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            pointerEvents: 'none'
                          }}
                        />
                      )}
                      
                      {/* Coming Soon Icon */}
                      {story.isComingSoon && (
                        <div style={{
                          fontSize: '48px',
                          color: '#9ca3af',
                          zIndex: 2
                        }}>
                          ⏳
                        </div>
                      )}
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

      {/* Video Popup Modal */}
      {isVideoPopupOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setIsVideoPopupOpen(false)}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '900px',
              aspectRatio: '16 / 9',
              background: '#000'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={popupVideoUrl}
              controls
              autoPlay
              controlsList="nodownload nofullscreen"
              disablePictureInPicture
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
        </div>
      )}
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
