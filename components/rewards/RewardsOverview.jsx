"use client";
import React from 'react';
import AnimatedDownloadButton from './AnimatedDownloadButton';

export default function RewardsOverview() {
  const scrollToDocs = () => {
    const docsSection = document.getElementById('rewards-documentation');
    if (docsSection) {
      docsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ background: '#ffffff' }}>
      {/* Hero Section - Editorial Style */}
      <section style={{ 
        padding: '40px 0',
        background: '#FFFFFF'
      }}>
        <div className="tf-container">
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
            alignItems: 'center',
            maxWidth: '1300px',
            margin: '0 auto'
          }}>
            {/* Left: Content */}
            <div>
              <h1 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '72px',
                fontWeight: '700',
                color: '#000000',
                lineHeight: '1.0',
                letterSpacing: '-0.03em',
                marginBottom: '4px'
              }}>
                PROOF OF WORK.
              </h1>
              <h2 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '72px',
                fontWeight: '700',
                lineHeight: '1.0',
                letterSpacing: '-0.03em',
                marginBottom: '16px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                NOT PROOF OF HYPE.
              </h2>
              
              <p style={{
                fontSize: '20px',
                lineHeight: '1.55',
                color: '#374151',
                marginBottom: '20px',
                fontWeight: '400',
                maxWidth: '540px'
              }}>
                A reward system that values what you actually contribute—not just when you joined.
              </p>

              {/* Dual Button Layout */}
              <div style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'center'
              }}>
                {/* Primary Button - View Documentation */}
                <button
                  onClick={scrollToDocs}
                  style={{
                    padding: '14px 32px',
                    background: '#000000',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.background = '#1a1a1a';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.background = '#000000';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  View Full Documentation
                </button>

                {/* Animated Download Button */}
                <AnimatedDownloadButton />
              </div>
            </div>

            {/* Right: Merit Shield Visual */}
            <div style={{
              background: 'rgba(249, 250, 251, 0.5)',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              padding: '32px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)'
            }}>
              <img 
                src="/finalendingframe.png" 
                alt="Merit Shield - Earned Through Contribution"
                style={{ 
                  width: '100%',
                  maxWidth: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section style={{ padding: '80px 0', background: '#F5F7FA' }}>
        <div className="tf-container">
          <div style={{ textAlign: 'center', marginBottom: '48px', maxWidth: '900px', margin: '0 auto 48px' }}>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '48px',
              fontWeight: '700',
              color: '#000000',
              marginBottom: '20px',
              letterSpacing: '-0.02em'
            }}>
              The Philosophy
            </h2>
            <p style={{
              fontSize: '18px',
              lineHeight: '1.7',
              color: '#4b5563',
              marginBottom: '16px'
            }}>
              Most tech communities promise "easy rewards" just for being early. We don't.
            </p>
            <p style={{
              fontSize: '20px',
              lineHeight: '1.6',
              color: '#000000',
              fontWeight: '700',
              position: 'relative',
              display: 'inline-block'
            }}>
              At DAG Army, we operate on Merit.
              <span style={{
                position: 'absolute',
                bottom: '-4px',
                left: '0',
                width: '100%',
                height: '2px',
                background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)'
              }} />
            </p>
          </div>

          {/* Master Manifesto Panel */}
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.85)',
              border: '1px solid #d1d5db',
              borderRadius: '12px',
              padding: '44px 48px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0'
              }}>
                {/* Column 1: No Free Rides */}
                <div style={{
                  paddingRight: '44px',
                  borderRight: '1px solid #d1d5db',
                  textAlign: 'left'
                }}>
                  <p style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    color: '#6366f1',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    marginBottom: '12px'
                  }}>
                    MERIT PRINCIPLE
                  </p>
                  <h3 style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#000000',
                    marginBottom: '14px',
                    letterSpacing: '-0.01em',
                    lineHeight: '1.15'
                  }}>
                    No Free Rides
                  </h3>
                  <div style={{
                    width: '48px',
                    height: '2px',
                    background: '#6366f1',
                    marginBottom: '14px'
                  }} />
                  <p style={{
                    fontSize: '15px',
                    color: '#4b5563',
                    lineHeight: '1.6',
                    margin: 0,
                    maxWidth: '340px'
                  }}>
                    You don't get rewarded just for signing up. You get recognized for <span style={{ fontWeight: '600', color: '#374151' }}>learning, building, and leading</span>.
                  </p>
                </div>
                
                {/* Column 2: Equal Ground */}
                <div style={{
                  paddingLeft: '44px',
                  paddingRight: '44px',
                  borderRight: '1px solid #d1d5db',
                  textAlign: 'left'
                }}>
                  <p style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    color: '#6366f1',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    marginBottom: '12px'
                  }}>
                    EQUAL ENTRY FRAMEWORK
                  </p>
                  <h3 style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#000000',
                    marginBottom: '14px',
                    letterSpacing: '-0.01em',
                    lineHeight: '1.15'
                  }}>
                    Equal Ground
                  </h3>
                  <div style={{
                    width: '48px',
                    height: '2px',
                    background: '#6366f1',
                    marginBottom: '14px'
                  }} />
                  <p style={{
                    fontSize: '15px',
                    color: '#4b5563',
                    lineHeight: '1.6',
                    margin: 0,
                    maxWidth: '340px'
                  }}>
                    It doesn't matter who you know. Everyone starts at the exact same rank: <span style={{ fontWeight: '600', color: '#374151' }}>DAG Soldier</span>.
                  </p>
                </div>
                
                {/* Column 3: Real Value */}
                <div style={{
                  paddingLeft: '44px',
                  textAlign: 'left'
                }}>
                  <p style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    color: '#6366f1',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    marginBottom: '12px'
                  }}>
                    SUSTAINABLE VALUE MODEL
                  </p>
                  <h3 style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#000000',
                    marginBottom: '14px',
                    letterSpacing: '-0.01em',
                    lineHeight: '1.15'
                  }}>
                    Real Value
                  </h3>
                  <div style={{
                    width: '48px',
                    height: '2px',
                    background: '#6366f1',
                    marginBottom: '14px'
                  }} />
                  <p style={{
                    fontSize: '15px',
                    color: '#4b5563',
                    lineHeight: '1.6',
                    margin: 0,
                    maxWidth: '340px'
                  }}>
                    Our rewards come from <span style={{ fontWeight: '600', color: '#374151' }}>actual ecosystem growth</span>, not speculative bubbles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How You Earn Section */}
      <section style={{ padding: '80px 0', background: '#FFFFFF' }}>
        <div className="tf-container">
          <div style={{ maxWidth: '1350px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '48px',
              fontWeight: '700',
              color: '#000000',
              marginBottom: '20px',
              letterSpacing: '-0.02em'
            }}>
              How You Earn
            </h2>
            
            <p style={{
              fontSize: '18px',
              lineHeight: '1.7',
              color: '#4b5563',
              marginBottom: '40px',
              maxWidth: '800px',
              margin: '0 auto 40px'
            }}>
              We quantify your impact using <strong style={{ color: '#000000' }}>DAG Points</strong>. Think of these as your "Reputation Score".
            </p>
            
            {/* Professional Master Panel */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.85)',
              border: '1px solid #d1d5db',
              borderRadius: '12px',
              padding: '44px 48px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '48px',
                alignItems: 'start',
                textAlign: 'left'
              }}>
                {/* Left: Contribution Pillars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingRight: '24px', borderRight: '1px solid #e5e7eb' }}>
                  {/* Learning */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'rgba(99, 102, 241, 0.08)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ 
                          fontSize: '18px', 
                          fontWeight: '700', 
                          color: '#000000', 
                          marginBottom: '6px'
                        }}>
                          Learning
                        </h4>
                        <p style={{ 
                          fontSize: '15px', 
                          color: '#4b5563', 
                          lineHeight: '1.6',
                          margin: 0
                        }}>
                          Mastering the ecosystem tools.
                        </p>
                      </div>
                    </div>
                  </div>
                
                  {/* Sharing */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'rgba(99, 102, 241, 0.08)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ 
                          fontSize: '18px', 
                          fontWeight: '700', 
                          color: '#000000', 
                          marginBottom: '6px'
                        }}>
                          Sharing
                        </h4>
                        <p style={{ 
                          fontSize: '15px', 
                          color: '#4b5563', 
                          lineHeight: '1.6',
                          margin: 0
                        }}>
                          Referring quality members (not spamming).
                        </p>
                      </div>
                    </div>
                  </div>
                
                  {/* Creating */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'rgba(99, 102, 241, 0.08)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ 
                          fontSize: '18px', 
                          fontWeight: '700', 
                          color: '#000000', 
                          marginBottom: '6px'
                        }}>
                          Creating
                        </h4>
                        <p style={{ 
                          fontSize: '15px', 
                          color: '#4b5563', 
                          lineHeight: '1.6',
                          margin: 0
                        }}>
                          Making videos, content, and meaningful comments.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              
                {/* Right: Reputation Score Dashboard */}
                <div style={{ paddingLeft: '24px' }}>
                  <div style={{ marginBottom: '28px' }}>
                    <p style={{ 
                      fontSize: '11px', 
                      color: '#6366f1', 
                      marginBottom: '12px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '1.5px'
                    }}>
                      YOUR REPUTATION SCORE
                    </p>
                    <h3 style={{ 
                      fontSize: '48px', 
                      fontWeight: '700', 
                      color: '#000000', 
                      marginBottom: '16px',
                      lineHeight: '1'
                    }}>
                      847 <span style={{ fontSize: '32px', color: '#9ca3af' }}>/ 1000</span>
                    </h3>
                    
                    {/* Progress Bar */}
                    <div style={{
                      width: '100%',
                      height: '6px',
                      background: '#e5e7eb',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: '84.7%',
                        height: '100%',
                        background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                        borderRadius: '3px'
                      }} />
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '16px',
                    paddingTop: '20px',
                    borderTop: '1px solid #e5e7eb'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '15px', color: '#4b5563' }}>Courses Completed</span>
                      <span style={{ fontSize: '18px', fontWeight: '700', color: '#000000' }}>12</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '15px', color: '#4b5563' }}>Community Contributions</span>
                      <span style={{ fontSize: '18px', fontWeight: '700', color: '#000000' }}>28</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '15px', color: '#4b5563' }}>Projects Built</span>
                      <span style={{ fontSize: '18px', fontWeight: '700', color: '#000000' }}>5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Important Notice Block */}
            <div style={{
              marginTop: '40px',
              padding: '20px 28px',
              background: 'rgba(99, 102, 241, 0.04)',
              borderRadius: '10px',
              borderLeft: '3px solid #6366f1',
              textAlign: 'left'
            }}>
              <p style={{ 
                fontSize: '15px', 
                color: '#4b5563', 
                lineHeight: '1.65',
                margin: 0
              }}>
                <strong style={{ 
                  color: '#6366f1',
                  fontSize: '15px',
                  fontWeight: '700',
                  display: 'block',
                  marginBottom: '6px'
                }}>Important:</strong>
                These points are yours alone. They are non-transferable and cannot be traded. You can't buy a reputation here; you have to earn it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Burn to Rise Timeline */}
      <section style={{ padding: '80px 0', background: '#F5F7FA' }}>
        <div className="tf-container">
          <div style={{ maxWidth: '1300px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '48px',
              fontWeight: '700',
              color: '#000000',
              marginBottom: '20px',
              letterSpacing: '-0.02em'
            }}>
              The <span style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Burn</span> To Rise
            </h2>
            
            <p style={{
              fontSize: '18px',
              lineHeight: '1.7',
              color: '#4b5563',
              marginBottom: '12px',
              maxWidth: '800px',
              margin: '0 auto 12px'
            }}>
              Collecting points is good, but <span style={{ fontWeight: '600', color: '#000000' }}>Rank</span> is better. To move up the ladder—from Initiator to Mythic—you must make a choice.
            </p>
            
            <p style={{
              fontSize: '18px',
              lineHeight: '1.7',
              color: '#000000',
              fontWeight: '600',
              marginBottom: '40px'
            }}>
              You have to "<span style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Burn</span>" your points.
            </p>
            
            {/* Rank Progression Visual */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '60px',
              position: 'relative',
              marginBottom: '40px'
            }}>
              {/* Initiator Rank */}
              <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                <div style={{
                  width: '140px',
                  height: '140px',
                  margin: '0 auto 16px',
                  filter: 'drop-shadow(0 4px 16px rgba(0, 0, 0, 0.08))'
                }}>
                  <img 
                    src="/images/ranks svgs/INITIATOR.svg" 
                    alt="Initiator Rank"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#000000',
                  marginBottom: '6px'
                }}>
                  Initiator
                </h4>
                <p style={{ fontSize: '13px', color: '#9ca3af' }}>Starting Point</p>
              </div>
              
              {/* Progress Line with Burn Button */}
              <div style={{ 
                position: 'relative',
                flex: '0 0 300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* Animated Gradient Line */}
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '3px',
                  background: 'linear-gradient(90deg, #9ca3af 0%, #6366f1 50%, #8b5cf6 100%)',
                  borderRadius: '2px',
                  opacity: 0.6
                }} />
                
                {/* Burn Button */}
                <button
                  style={{
                    position: 'relative',
                    zIndex: 3,
                    padding: '12px 32px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(239, 68, 68, 0.3)';
                  }}
                >
                  BURN
                </button>
              </div>
              
              {/* Mythic Rank */}
              <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                <div style={{
                  width: '140px',
                  height: '140px',
                  margin: '0 auto 16px',
                  filter: 'drop-shadow(0 6px 24px rgba(99, 102, 241, 0.25))'
                }}>
                  <img 
                    src="/images/ranks svgs/MYTHIC RANK.svg" 
                    alt="Mythic Rank"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#000000',
                  marginBottom: '6px'
                }}>
                  Mythic
                </h4>
                <p style={{ fontSize: '13px', color: '#9ca3af' }}>Elite Status</p>
              </div>
            </div>
            
            {/* Professional Master Card with 3 Columns */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.7)',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '40px 36px',
              backdropFilter: 'blur(10px)',
              marginBottom: '32px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0'
              }}>
                {/* Column 1: The Commitment */}
                <div style={{
                  paddingRight: '32px',
                  borderRight: '1px solid #e5e7eb',
                  textAlign: 'left'
                }}>
                  <div style={{
                    width: '40px',
                    height: '3px',
                    background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                    marginBottom: '16px'
                  }} />
                  <h5 style={{ 
                    fontSize: '20px', 
                    fontWeight: '700', 
                    color: '#000000', 
                    marginBottom: '12px',
                    letterSpacing: '-0.01em'
                  }}>
                    The Commitment
                  </h5>
                  <p style={{ 
                    fontSize: '15px', 
                    color: '#6b7280', 
                    lineHeight: '1.65',
                    margin: 0
                  }}>
                    Burning wipes your point balance to zero.
                  </p>
                </div>
                
                {/* Column 2: The Reward */}
                <div style={{
                  paddingLeft: '32px',
                  paddingRight: '32px',
                  borderRight: '1px solid #e5e7eb',
                  textAlign: 'left'
                }}>
                  <div style={{
                    width: '40px',
                    height: '3px',
                    background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                    marginBottom: '16px'
                  }} />
                  <h5 style={{ 
                    fontSize: '20px', 
                    fontWeight: '700', 
                    color: '#000000', 
                    marginBottom: '12px',
                    letterSpacing: '-0.01em'
                  }}>
                    The Reward
                  </h5>
                  <p style={{ 
                    fontSize: '15px', 
                    color: '#6b7280', 
                    lineHeight: '1.65',
                    margin: 0
                  }}>
                    In exchange, you permanently unlock a <span style={{ fontWeight: '600', color: '#6366f1' }}>higher Rank</span>.
                  </p>
                </div>
                
                {/* Column 3: The Benefit */}
                <div style={{
                  paddingLeft: '32px',
                  textAlign: 'left'
                }}>
                  <div style={{
                    width: '40px',
                    height: '3px',
                    background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                    marginBottom: '16px'
                  }} />
                  <h5 style={{ 
                    fontSize: '20px', 
                    fontWeight: '700', 
                    color: '#000000', 
                    marginBottom: '12px',
                    letterSpacing: '-0.01em'
                  }}>
                    The Benefit
                  </h5>
                  <p style={{ 
                    fontSize: '15px', 
                    color: '#6b7280', 
                    lineHeight: '1.65',
                    margin: 0
                  }}>
                    Higher ranks unlock significantly higher privileges and reward efficiency.
                  </p>
                </div>
              </div>
            </div>
            
            <p style={{ 
              fontSize: '16px', 
              color: '#000000', 
              fontWeight: '600', 
              fontStyle: 'italic',
              marginTop: '24px'
            }}>
              It's a system designed for people playing the <span style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>long game</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Protocol Selection Cards */}
      <section style={{ padding: '80px 0', background: '#FFFFFF' }}>
        <div className="tf-container">
          <div style={{ maxWidth: '1350px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '48px',
              fontWeight: '700',
              color: '#000000',
              marginBottom: '20px',
              letterSpacing: '-0.02em'
            }}>
              Choose Your Protocol
            </h2>
            
            <p style={{
              fontSize: '18px',
              lineHeight: '1.7',
              color: '#4b5563',
              marginBottom: '48px',
              maxWidth: '800px',
              margin: '0 auto 48px'
            }}>
              You can enter the ecosystem at a pace that matches your goals. We offer two distinct operational modes.
            </p>
            
            {/* Horizontal Progression Layout */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '40px'
            }}>
              {/* DAG Soldier */}
              <div style={{
                flex: '0 0 600px',
                background: '#ffffff',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
              }}>
                {/* SVG Container */}
                <div style={{
                  width: '120px',
                  height: '120px',
                  margin: '0 auto 20px',
                  background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)'
                }}>
                  <img 
                    src="/images/dagbadges/DAG SOLDIER.svg" 
                    alt="DAG Soldier"
                    style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                  />
                </div>
                
                <h3 style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#000000',
                  marginBottom: '10px',
                  letterSpacing: '-0.01em',
                  lineHeight: '1.2'
                }}>
                  The Standard Protocol
                </h3>
                
                <p style={{ 
                  fontSize: '11px', 
                  color: '#9ca3af', 
                  marginBottom: '20px', 
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px'
                }}>
                  DAG SOLDIER
                </p>
                
                <div style={{
                  width: '60px',
                  height: '1px',
                  background: '#e5e7eb',
                  margin: '0 auto 16px'
                }} />
                
                <p style={{ 
                  fontSize: '15px', 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontWeight: '600'
                }}>
                  Focus: <span style={{ color: '#6366f1', fontWeight: '600' }}>Skill Acquisition.</span>
                </p>
                
                <p style={{ 
                  fontSize: '15px', 
                  color: '#6b7280', 
                  lineHeight: '1.6',
                  textAlign: 'left',
                  maxWidth: '520px',
                  margin: '0 auto'
                }}>
                  This is the foundational entry point. You enter on equal footing with full access to educational resources and the ability to earn reputation points through standard community tasks. It is free and designed for students focusing primarily on learning.
                </p>
              </div>
              
              {/* Progression Indicator */}
              <div style={{ 
                position: 'relative',
                flex: '0 0 100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '100%',
                  height: '2px',
                  background: 'linear-gradient(90deg, #e5e7eb 0%, #6366f1 100%)',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    right: '-6px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '0',
                    height: '0',
                    borderLeft: '8px solid #6366f1',
                    borderTop: '6px solid transparent',
                    borderBottom: '6px solid transparent'
                  }} />
                </div>
              </div>
              
              {/* DAG Lieutenant */}
              <div style={{
                flex: '0 0 600px',
                background: '#ffffff',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid #6366f1',
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.08)',
                position: 'relative',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(99, 102, 241, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(99, 102, 241, 0.08)';
              }}>
                
                
                {/* SVG Container */}
                <div style={{
                  width: '120px',
                  height: '120px',
                  margin: '0 auto 20px',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(99, 102, 241, 0.12)'
                }}>
                  <img 
                    src="/images/dagbadges/DAG LIEUTENANT.svg" 
                    alt="DAG Lieutenant"
                    style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                  />
                </div>
                
                <h3 style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#000000',
                  marginBottom: '10px',
                  letterSpacing: '-0.01em',
                  lineHeight: '1.2'
                }}>
                  The Leadership Protocol
                </h3>
                
                <p style={{ 
                  fontSize: '11px', 
                  color: '#9ca3af', 
                  marginBottom: '20px', 
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px'
                }}>
                  DAG LIEUTENANT
                </p>
                
                <div style={{
                  width: '60px',
                  height: '1px',
                  background: '#6366f1',
                  margin: '0 auto 16px'
                }} />
                
                <p style={{ 
                  fontSize: '15px', 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontWeight: '600'
                }}>
                  Focus: <span style={{ color: '#6366f1', fontWeight: '600' }}>Community Stewardship.</span>
                </p>
                
                <p style={{ 
                  fontSize: '15px', 
                  color: '#6b7280', 
                  lineHeight: '1.6',
                  textAlign: 'left',
                  maxWidth: '520px',
                  margin: '0 auto'
                }}>
                  Designed for serious builders ready to take on immediate responsibility. This status signals a higher level of commitment, granting you Accelerated Progression Status from Day One. It is the preferred route for those aiming for "Campus Ambassador" roles and faster rank advancement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grants & Fellowships */}
      <section style={{ padding: '80px 0', background: '#F5F7FA' }}>
        <div className="tf-container">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '48px',
              fontWeight: '700',
              color: '#000000',
              marginBottom: '20px',
              letterSpacing: '-0.02em',
              textAlign: 'center'
            }}>
              Ecosystem Grants & Fellowships
            </h2>
            
            <p style={{
              fontSize: '18px',
              lineHeight: '1.7',
              color: '#4b5563',
              marginBottom: '48px',
              textAlign: 'center',
              maxWidth: '800px',
              margin: '0 auto 48px'
            }}>
              We view our top contributors as partners. The ecosystem is structured to provide merit-based resource allocation, operating similar to a research grant or corporate fellowship.
            </p>
            
            {/* Institutional Master Panel */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.6)',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '56px 48px',
              backdropFilter: 'blur(10px)'
            }}>
              {/* 3-Column Grid Layout with Vertical Separators */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0',
                position: 'relative'
              }}>
                {/* Column 1: Meritocratic Efficiency */}
                <div style={{
                  paddingRight: '36px',
                  borderRight: '1px solid #e5e7eb'
                }}>
                  <p style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    color: '#6366f1',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    marginBottom: '10px'
                  }}>
                    RESOURCE ACCESS FRAMEWORK
                  </p>
                  <h3 style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '26px',
                    fontWeight: '700',
                    color: '#000000',
                    marginBottom: '14px',
                    letterSpacing: '-0.01em',
                    lineHeight: '1.2'
                  }}>
                    Meritocratic Efficiency
                  </h3>
                  <div style={{
                    width: '48px',
                    height: '2px',
                    background: '#d1d5db',
                    marginBottom: '14px'
                  }} />
                  <p style={{
                    fontSize: '15px',
                    color: '#6b7280',
                    lineHeight: '1.65',
                    margin: 0,
                    maxWidth: '320px'
                  }}>
                    Your rank dictates your resource access. As you progress from Initiator to Mythic, the ecosystem unlocks higher efficiency tiers, ensuring that long-term contributors receive a larger share of the value they generate.
                  </p>
                </div>
                
                {/* Column 2: Performance Fellowships */}
                <div style={{
                  paddingLeft: '36px',
                  paddingRight: '36px',
                  borderRight: '1px solid #e5e7eb'
                }}>
                  <p style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    color: '#6366f1',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    marginBottom: '10px'
                  }}>
                    IMPACT RECOGNITION SYSTEM
                  </p>
                  <h3 style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '26px',
                    fontWeight: '700',
                    color: '#000000',
                    marginBottom: '14px',
                    letterSpacing: '-0.01em',
                    lineHeight: '1.2'
                  }}>
                    Performance Fellowships
                  </h3>
                  <div style={{
                    width: '48px',
                    height: '2px',
                    background: '#d1d5db',
                    marginBottom: '14px'
                  }} />
                  <p style={{
                    fontSize: '15px',
                    color: '#6b7280',
                    lineHeight: '1.65',
                    margin: 0,
                    maxWidth: '320px'
                  }}>
                    Consistency is the primary metric we reward. Contributors who demonstrate sustained, monthly impact are eligible for the Discretionary Excellence Fund—a resource pool reserved specifically for those actively driving ecosystem stability.
                  </p>
                </div>
                
                {/* Column 3: Ambassador Logistics Program */}
                <div style={{
                  paddingLeft: '36px'
                }}>
                  <p style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    color: '#6366f1',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    marginBottom: '10px'
                  }}>
                    LEADERSHIP SUPPORT INFRASTRUCTURE
                  </p>
                  <h3 style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '26px',
                    fontWeight: '700',
                    color: '#000000',
                    marginBottom: '14px',
                    letterSpacing: '-0.01em',
                    lineHeight: '1.2'
                  }}>
                    Ambassador Logistics Program
                  </h3>
                  <div style={{
                    width: '48px',
                    height: '2px',
                    background: '#d1d5db',
                    marginBottom: '14px'
                  }} />
                  <p style={{
                    fontSize: '15px',
                    color: '#6b7280',
                    lineHeight: '1.65',
                    margin: 0,
                    maxWidth: '320px'
                  }}>
                    For our most dedicated leaders, support extends beyond the digital platform. High-impact contributors can qualify for the Lifestyle Support Tier, which provides assistance for real-world logistical needs—such as travel and operational costs—to facilitate their leadership duties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
