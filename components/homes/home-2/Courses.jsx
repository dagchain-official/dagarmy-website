"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const ProgressiveInfoCards = () => {
  const [activeCard, setActiveCard] = useState(0);

  const cards = [
    {
      id: 0,
      label: 'Understanding',
      heading: 'What Learners Build Understanding In',
      items: [
        'AI-driven interfaces and natural language systems',
        'Full-stack product logic and deployment fundamentals',
        'Autonomous agents and workflow automation',
        'Blockchain mechanics, wallets, and trust verification',
        'Smart contracts, token systems, and security principles',
        'Ethical and career-ready application of emerging technologies',
        'Data engineering, visual storytelling, and dashboards',
        'Business intelligence and cloud-based decision systems'
      ]
    },
    {
      id: 1,
      label: "Who It's For",
      heading: 'Who This Program Is For',
      items: [
        'Students preparing beyond placements',
        'Professionals upgrading relevance and confidence',
        'Creators and freelancers building independent capability',
        'Business owners understanding modern digital systems',
        'Non-technical learners seeking structured fluency'
      ]
    },
    {
      id: 2,
      label: 'Outcomes',
      heading: 'Outcome Focus',
      items: [
        'Practical understanding instead of surface familiarity',
        'Portfolio-backed credibility',
        'Clear connection between skills and real-world use',
        'Confidence to operate across modern tech environments'
      ]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % cards.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ marginTop: '-48px' }}>
      {/* Main Heading */}
      <h3 style={{
        fontSize: '32px',
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: '16px',
        lineHeight: '1.3',
        marginTop: '0'
      }}>
        A Unified Program Designed Around Real Capability
      </h3>

      {/* Body Text */}
      <p style={{
        fontSize: '16px',
        lineHeight: '1.65',
        color: '#4b5563',
        marginBottom: '24px'
      }}>
        Instead of scattered courses and disconnected tools, DAG Army offers one integrated learning journey that brings together modern technology skills into a single, structured experience. This program is built for learners who want clarity, relevance, and confidence in how systems actually work together in real environments.
      </p>

      {/* Navigation Indicators - Moved Above Card */}
      <div style={{
        display: 'flex',
        gap: '32px',
        marginBottom: '20px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => setActiveCard(card.id)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '12px 0',
              fontSize: '14px',
              fontWeight: activeCard === card.id ? '600' : '500',
              color: activeCard === card.id ? '#1f2937' : '#6b7280',
              borderBottom: activeCard === card.id ? '2px solid #1f2937' : '2px solid transparent',
              marginBottom: '-1px',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap'
            }}
          >
            {card.label}
          </button>
        ))}
      </div>

      {/* Card Container - Fixed Height */}
      <div style={{
        position: 'relative',
        minHeight: '460px',
        marginBottom: '0'
      }}>
        {cards.map((card) => (
          <div
            key={card.id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              background: '#fff',
              borderRadius: '16px',
              padding: '36px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e5e7eb',
              opacity: activeCard === card.id ? 1 : 0,
              transform: activeCard === card.id ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out',
              pointerEvents: activeCard === card.id ? 'auto' : 'none'
            }}
          >
            {/* Card Heading */}
            <h4 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '14px'
            }}>
              {card.heading}
            </h4>

            {/* Divider */}
            <div style={{
              width: '60px',
              height: '3px',
              background: '#1f2937',
              marginBottom: '24px'
            }} />

            {/* Bullet List */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              {card.items.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#1f2937',
                    marginTop: '8px',
                    flexShrink: 0
                  }} />
                  <span style={{
                    fontSize: '15px',
                    color: '#4b5563',
                    lineHeight: '1.6'
                  }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default function Courses() {

  return (
    <section className="section-popular-program" style={{ 
      padding: '80px 0 80px',
      background: '#fff'
    }}>
      <style jsx>{`
        @media (min-width: 992px) {
          .program-grid {
            grid-template-columns: 40% 60% !important;
          }
        }
      `}</style>
      <div className="tf-container">
        {/* Section Title - Left Aligned */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '42px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '0',
            letterSpacing: '-0.02em'
          }}>
            Popular Program
          </h2>
        </div>

        {/* Two Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '40px',
          alignItems: 'start'
        }}
        className="program-grid">

          {/* LEFT SIDE: Flagship Program Card */}
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '0',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb',
            transition: 'box-shadow 0.3s ease',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.12)'}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)'}>
            
            {/* Image Placeholder */}
            <div style={{
              width: '100%',
              height: '180px',
              background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div style={{
                textAlign: 'center',
                color: '#9ca3af'
              }}>
                <div style={{
                  fontSize: '48px',
                  marginBottom: '8px'
                }}>
                  📐
                </div>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '500'
                }}>
                  Program Visual
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div style={{ padding: '28px' }}>
              {/* Program Name */}
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '12px',
                lineHeight: '1.3'
              }}>
                The Next-Gen Tech Architect Program
              </h3>

              {/* Subtitle */}
              <p style={{
                fontSize: '15px',
                color: '#6b7280',
                marginBottom: '18px',
                lineHeight: '1.5'
              }}>
                One Unified Journey Across AI, Blockchain, and Data Visualisation
              </p>

              {/* Divider */}
              <div style={{
                height: '1px',
                background: '#e5e7eb',
                marginBottom: '18px'
              }} />

              {/* Program Meta */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '24px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Duration:</span>
                  <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600' }}>32 Hours</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Structure:</span>
                  <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600' }}>8 Integrated Modules</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Format:</span>
                  <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600', textAlign: 'right' }}>Guided learning, applied drills, live sessions</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '8px',
                  borderTop: '1px solid #f3f4f6'
                }}>
                  <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Rating:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#1f2937', fontSize: '14px' }}>★★★★★</span>
                    <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600' }}>4.9</span>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>(3,000+ reviews)</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                href="#"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '16px 24px',
                  background: '#1f2937',
                  color: '#fff',
                  textAlign: 'center',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
                }}
              >
                Enrol in the Next-Gen Tech Architect Program
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE: Progressive Information Cards */}
          <ProgressiveInfoCards />
        </div>
      </div>
    </section>
  );
}
