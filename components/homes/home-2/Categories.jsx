"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Categories.module.css";
import "./Categories.global.css";

const dagarmyCategories = [
  // Row 1: 1, 4, 7
  {
    title: "Intelligent Systems and No Code Development",
    description: "Master the shift from syntax to semantics by using natural language to build world-class applications. Use AI tools like v0.dev, DAGGPT, and Replit Agent to generate responsive web interfaces and full-stack products without traditional manual coding.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
        <rect x="9" y="9" width="6" height="6"></rect>
        <line x1="9" y1="1" x2="9" y2="4"></line>
        <line x1="15" y1="1" x2="15" y2="4"></line>
        <line x1="9" y1="20" x2="9" y2="23"></line>
        <line x1="15" y1="20" x2="15" y2="23"></line>
        <line x1="20" y1="9" x2="23" y2="9"></line>
        <line x1="20" y1="14" x2="23" y2="14"></line>
        <line x1="1" y1="9" x2="4" y2="9"></line>
        <line x1="1" y1="14" x2="4" y2="14"></line>
      </svg>
    ),
  },
  {
    title: "Distributed Ledger Foundations",
    description: "Explore the Ledger Revolution and the core mechanics of the decentralized internet. This section covers the fundamental differences between ecosystems like Ethereum and Solana, while teaching advanced wallet security and on-chain forensics to verify 'truth.'",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
    ),
  },
  {
    title: "Excel and Data Analysis",
    description: "Transform raw data into high-level business intelligence. Learn to use Power Query to clean and structure messy datasets for 'Executive Grade' reports, creating a solid foundation for automated, live, cloud-synced data storytelling.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="3" y1="15" x2="21" y2="15"></line>
        <line x1="9" y1="3" x2="9" y2="21"></line>
        <line x1="15" y1="3" x2="15" y2="21"></line>
      </svg>
    ),
  },
  // Row 2: 2, 5, 8
  {
    title: "Creative Tools",
    description: "Unlock the power of visual branding and cinematic production. Harness professional AI tools such as Midjourney, Leonardo AI, and Runway Gen-3 to create consistent brand identities and high-end marketing media through advanced prompting.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
        <path d="M2 2l7.586 7.586"></path>
        <circle cx="11" cy="11" r="2"></circle>
      </svg>
    ),
  },
  {
    title: "Decentralized Finance Markets",
    description: "Dive into tokenization mastery and the 'code is law' philosophy. Learn how to mint custom tokens, design sustainable tokenomics, and deploy secure smart contracts using Thirdweb and OpenZeppelin without writing Solidity.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    ),
  },
  {
    title: "Power BI and Tableau",
    description: "Master technical artistry and visual storytelling to make complex data instantly readable. Build interactive dashboards and map-based visuals to track critical startup metrics like CAC, LTV, and Burn Rate for strategic decision-making.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
      </svg>
    ),
  },
  // Row 3: 3, 6, 9
  {
    title: "Automation and Agent Systems",
    description: "Move beyond basic chatbots to the AI Agent Economy. Build autonomous workflows with n8n and Zapier that connect AI to real-world business tools, enabling the 'One-Person Agency' model for rapid automation.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
    ),
  },
  {
    title: "Web3 Growth Strategies",
    description: "Learn the strategic deployment of decentralized value and community-driven growth. Focus on token-based growth, DAO integration, and on-chain analytics to build trust and scale projects within the decentralized ecosystem.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
    ),
  },
  {
    title: "Dashboard Design",
    description: "Design self-sustaining 'War Rooms' that utilize AI-Data Fusion. Create interactive narratives and 'drill-down' flows that allow stakeholders to move past static files into live, cloud-synced predictive intelligence for future trends.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9"></rect>
        <rect x="14" y="3" width="7" height="5"></rect>
        <rect x="14" y="12" width="7" height="9"></rect>
        <rect x="3" y="16" width="7" height="5"></rect>
      </svg>
    ),
  },
];

export default function Categories() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [currentCycle, setCurrentCycle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCycle((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="section-categories tf-spacing-1 pt-0" style={{ paddingBottom: '60px' }}>
      <div className="tf-container">
        <div className="heading-section">
          <h2 className="letter-spacing-1 wow fadeInUp" data-wow-delay="0s">
            Top Categories
          </h2>
          <div className="flex items-center justify-between flex-wrap gap-10">
            <div className="sub fs-15 wow fadeInUp" data-wow-delay="0.2s">
              Choose a Direction That Matches Your Goals
            </div>
          </div>
        </div>
        <div className={`row ${styles.categoriesGrid}`}>
          {dagarmyCategories.map((elm, globalIndex) => {
            const isHovered = hoveredIndex === globalIndex;
            const currentCycleIndex = currentCycle * 3;
            const isVisibleInCycle = globalIndex >= currentCycleIndex && globalIndex < currentCycleIndex + 3;
            
            // Position in cycle: 0, 1, 2 (card 1, card 2, card 3)
            // Only card 3 (position 2) in each cycle opens up
            const positionInCycle = globalIndex % 3;
            const shouldPopUp = positionInCycle === 2;
            
            return (
              <div className={`col-lg-4 ${styles.categoryCol} ${!isVisibleInCycle ? styles.hiddenMobile : ''}`} key={globalIndex}>
                <div className="wrap-icon-box" style={{ gap: '20px', display: 'flex', flexDirection: 'column' }}>
                  <div
                    className={`icon-box-link wow fadeInUp ${styles.categoryCard}`}
                    data-wow-delay="0.1s"
                    style={{ textDecoration: 'none', display: 'block', position: 'relative' }}
                    onMouseEnter={() => setHoveredIndex(globalIndex)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div
                      className="icons-box style-2"
                      style={{
                        padding: '24px 28px',
                        borderRadius: '12px',
                        background: '#fff',
                        border: isHovered ? '2px solid #000000' : '1px solid #f3f4f6',
                        boxShadow: isHovered ? '0 12px 24px -5px rgba(0, 0, 0, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                        transition: 'border 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '18px',
                        cursor: 'default',
                        overflow: 'visible',
                        minHeight: '88px',
                        width: '100%'
                      }}
                    >
                      <div className="icon-wrapper" style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: isHovered ? '#000000' : 'rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.4s ease',
                        flexShrink: 0
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.4s ease' }}>
                          {React.cloneElement(elm.icon, {
                            style: { stroke: isHovered ? '#ffffff' : '#6b7280', transition: 'stroke 0.4s ease' }
                          })}
                        </div>
                      </div>
                      <div className={`content ${styles.categoryTitle}`} style={{ flex: 1 }}>
                        <h5 style={{
                          margin: 0,
                          fontSize: '15px',
                          fontWeight: '600',
                          color: isHovered ? '#000000' : '#1f2937',
                          transition: 'color 0.4s ease',
                          lineHeight: '1.5',
                          whiteSpace: 'normal',
                          wordBreak: 'break-word'
                        }}>
                          {elm.title}
                        </h5>
                      </div>
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        ...(shouldPopUp ? { bottom: '100%', marginBottom: '8px' } : { top: '100%', marginTop: '8px' }),
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(135deg, #000000 0%, #1f2937 100%)',
                        borderRadius: '16px',
                        padding: isHovered ? '20px 24px' : '0 24px',
                        maxHeight: isHovered ? '500px' : '0',
                        opacity: isHovered ? 1 : 0,
                        overflow: 'hidden',
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isHovered ? (shouldPopUp ? '0 -20px 40px -10px rgba(0, 0, 0, 0.3)' : '0 20px 40px -10px rgba(0, 0, 0, 0.3)') : 'none',
                        zIndex: 10,
                        pointerEvents: isHovered ? 'auto' : 'none',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <div style={{
                        transform: isHovered ? 'translateY(0)' : (shouldPopUp ? 'translateY(10px)' : 'translateY(-10px)'),
                        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s',
                        opacity: isHovered ? 1 : 0
                      }}>
                        <div style={{
                          width: '40px',
                          height: '3px',
                          background: 'linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0.3) 100%)',
                          borderRadius: '2px',
                          marginBottom: '16px'
                        }} />
                        <p style={{
                          margin: 0,
                          fontSize: '14px',
                          lineHeight: '1.7',
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontWeight: '400',
                          letterSpacing: '0.2px'
                        }}>
                          {elm.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
