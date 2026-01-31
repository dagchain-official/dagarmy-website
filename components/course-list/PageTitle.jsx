"use client";
import React from "react";
import Link from "next/link";

export default function PageTitle({
  parentClass = "page-title style-2 no-border has-bg4",
}) {
  const categories = [
    "Artificial Intelligence",
    "Blockchain",
    "Data Visualization",
    "Cyber Security",
    "Web3 Development",
    "Machine Learning",
    "Smart Contracts"
  ];

  return (
    <div className={parentClass} style={{ paddingTop: '60px', paddingBottom: '60px' }}>
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            <div className="content" style={{ maxWidth: '900px' }}>
              {/* Professional Section Badge */}
              <div
                className="wow fadeInUp"
                data-wow-delay="0s"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 18px',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(109, 40, 217, 0.05) 100%)',
                  border: '1px solid rgba(139, 92, 246, 0.15)',
                  marginBottom: '28px'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                  Career-Focused Learning
                </span>
              </div>

              {/* Main Heading */}
              <h2
                className="font-cardo fw-7 wow fadeInUp"
                data-wow-delay="0.1s"
                style={{
                  fontSize: '48px',
                  lineHeight: '1.2',
                  color: '#1f2937',
                  marginBottom: '20px',
                  maxWidth: '800px',
                  letterSpacing: '-0.02em'
                }}
              >
                Explore Our <span style={{ fontFamily: 'Nasalization, sans-serif' }}>Next-Gen Tech</span> Course
              </h2>

              {/* Supporting Description */}
              <p
                className="wow fadeInUp"
                data-wow-delay="0.2s"
                style={{
                  fontSize: '17px',
                  lineHeight: '1.7',
                  color: '#6b7280',
                  marginBottom: '48px',
                  maxWidth: '700px'
                }}
              >
                Join the global army of Vibe Coders. Master AI, Blockchain, and Data Visualization with battle-tested courses designed for the 2026 economy.
              </p>

              {/* Training Streams Navigation */}
              <div className="wow fadeInUp" data-wow-delay="0.3s">
                <h6 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '20px'
                }}>
                  Explore Training Streams
                </h6>
                <ul style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '36px',
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  {categories.map((category, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        style={{
                          color: '#6b7280',
                          fontSize: '15px',
                          fontWeight: '500',
                          textDecoration: 'none',
                          cursor: 'pointer',
                          position: 'relative',
                          paddingBottom: '8px',
                          display: 'inline-block',
                          transition: 'color 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#1f2937';
                          const underline = e.currentTarget.querySelector('.underline');
                          if (underline) {
                            underline.style.width = '100%';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#6b7280';
                          const underline = e.currentTarget.querySelector('.underline');
                          if (underline) {
                            underline.style.width = '0%';
                          }
                        }}
                      >
                        {category}
                        <span
                          className="underline"
                          style={{
                            position: 'absolute',
                            bottom: '0',
                            left: '0',
                            width: '0%',
                            height: '2px',
                            background: 'linear-gradient(90deg, #1f2937 0%, #1f2937 100%)',
                            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
