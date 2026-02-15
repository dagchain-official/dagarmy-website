"use client";
import React from 'react';

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
        padding: '120px 0',
        background: '#FFFFFF'
      }}>
        <div className="tf-container">
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
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
                lineHeight: '1.1',
                letterSpacing: '-0.03em',
                marginBottom: '16px'
              }}>
                PROOF OF WORK.
              </h1>
              <h2 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '72px',
                fontWeight: '700',
                lineHeight: '1.1',
                letterSpacing: '-0.03em',
                marginBottom: '32px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                NOT PROOF OF HYPE.
              </h2>
              
              <p style={{
                fontSize: '20px',
                lineHeight: '1.7',
                color: '#4b5563',
                marginBottom: '40px',
                fontWeight: '400'
              }}>
                A reward system that values what you actually contribute—not just when you joined.
              </p>

              <button
                onClick={scrollToDocs}
                style={{
                  padding: '16px 40px',
                  background: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                View Full Documentation
              </button>
            </div>

            {/* Right: Merit Shield Visual */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '24px',
              padding: '40px',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '500px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4)'
            }}>
              <div style={{
                position: 'absolute',
                top: '-100px',
                right: '-100px',
                width: '300px',
                height: '300px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                filter: 'blur(80px)'
              }} />
              
              <div style={{ 
                position: 'relative', 
                zIndex: 1,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img 
                  src="/finalendingframe.png" 
                  alt="Merit Shield - Earned Through Contribution"
                  style={{ 
                    width: '100%',
                    maxWidth: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                    margin: '0 auto'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section - 3 Cards */}
      <section style={{ padding: '100px 0', background: '#F5F7FA' }}>
        <div className="tf-container">
          <div style={{ textAlign: 'center', marginBottom: '70px', maxWidth: '900px', margin: '0 auto 70px' }}>
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
              fontSize: '20px',
              lineHeight: '1.6',
              color: '#4b5563',
              marginBottom: '16px'
            }}>
              Most tech communities promise "easy rewards" just for being early. We don't.
            </p>
            <p style={{
              fontSize: '20px',
              lineHeight: '1.6',
              color: '#000000',
              fontWeight: '600'
            }}>
              At DAG Army, we operate on Merit.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* Card 1 - No Free Rides */}
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '48px 40px',
              border: 'none',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                background: 'transparent',
                border: '3px solid #6366f1',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '28px',
                fontSize: '36px'
              }}>
                ⛰️
              </div>
              <h3 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '24px',
                fontWeight: '700',
                color: '#000000',
                marginBottom: '16px'
              }}>
                No Free Rides
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.7',
                color: '#6b7280'
              }}>
                You don't get rewarded just for signing up. You get recognized for learning, building, and leading.
              </p>
            </div>

            {/* Card 2 - Equal Ground */}
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '48px 40px',
              border: 'none',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                background: 'transparent',
                border: '3px solid #6366f1',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '28px',
                fontSize: '36px'
              }}>
                ⚖️
              </div>
              <h3 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '24px',
                fontWeight: '700',
                color: '#000000',
                marginBottom: '16px'
              }}>
                Equal Ground
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.7',
                color: '#6b7280'
              }}>
                It doesn't matter who you know. Everyone starts at the exact same rank: DAG Soldier.
              </p>
            </div>

            {/* Card 3 - Real Value */}
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '48px 40px',
              border: 'none',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                background: 'transparent',
                border: '3px solid #6366f1',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '28px',
                fontSize: '36px'
              }}>
                �
              </div>
              <h3 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '24px',
                fontWeight: '700',
                color: '#000000',
                marginBottom: '16px'
              }}>
                Real Value
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.7',
                color: '#6b7280'
              }}>
                Our rewards come from actual ecosystem growth, not speculative bubbles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mechanics Section - Dashboard Visualization */}
      <section style={{ padding: '100px 0', background: '#FFFFFF' }}>
        <div className="tf-container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'center',
            maxWidth: '1300px',
            margin: '0 auto'
          }}>
            {/* Left: Text */}
            <div>
              <h2 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '48px',
                fontWeight: '700',
                color: '#000000',
                marginBottom: '24px',
                letterSpacing: '-0.02em'
              }}>
                How You Earn
              </h2>
              
              <p style={{
                fontSize: '18px',
                lineHeight: '1.7',
                color: '#4b5563',
                marginBottom: '32px'
              }}>
                We quantify your impact using <strong style={{ color: '#000000' }}>DAG Points</strong>. Think of these as your "Reputation Score".
              </p>
              
              <p style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#6b7280',
                marginBottom: '24px'
              }}>
                You earn them by doing the work:
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: '#6366f1',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '20px', fontWeight: '700', color: '#000000', marginBottom: '8px' }}>Learning</h4>
                    <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: '1.6' }}>Mastering the ecosystem tools.</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: '#6366f1',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '20px', fontWeight: '700', color: '#000000', marginBottom: '8px' }}>Sharing</h4>
                    <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: '1.6' }}>Referring quality members (not spamming).</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: '#6366f1',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '20px', fontWeight: '700', color: '#000000', marginBottom: '8px' }}>Creating</h4>
                    <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: '1.6' }}>Making videos, content, and meaningful comments.</p>
                  </div>
                </div>
              </div>
              
              <div style={{
                marginTop: '32px',
                padding: '20px 24px',
                background: 'rgba(99, 102, 241, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid rgba(99, 102, 241, 0.2)'
              }}>
                <p style={{ fontSize: '14px', color: '#4b5563', margin: 0 }}>
                  <strong style={{ color: '#6366f1' }}>Important:</strong> These points are yours alone. They are non-transferable and cannot be traded. You can't buy a reputation here; you have to earn it.
                </p>
              </div>
            </div>
            
            {/* Right: Dashboard Mockup */}
            <div style={{
              background: '#F5F7FA',
              borderRadius: '24px',
              padding: '48px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
              }}>
                <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Your Reputation Score</p>
                  <h3 style={{ fontSize: '36px', fontWeight: '700', color: '#000000', marginBottom: '16px' }}>847 / 1000</h3>
                  <div style={{
                    width: '100%',
                    height: '12px',
                    background: '#e5e7eb',
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: '84.7%',
                      height: '100%',
                      background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                      borderRadius: '6px'
                    }} />
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Courses Completed</span>
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#000000' }}>12</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Community Contributions</span>
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#000000' }}>28</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Projects Built</span>
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#000000' }}>5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Burn to Rise Timeline */}
      <section style={{ padding: '100px 0', background: '#F5F7FA' }}>
        <div className="tf-container">
          <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '48px',
              fontWeight: '700',
              color: '#000000',
              marginBottom: '32px',
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
              marginBottom: '16px',
              maxWidth: '800px',
              margin: '0 auto 16px'
            }}>
              Collecting points is good, but <span style={{ fontWeight: '600', color: '#000000' }}>Rank</span> is better. To move up the ladder—from Initiator to Mythic—you must make a choice.
            </p>
            
            <p style={{
              fontSize: '18px',
              lineHeight: '1.7',
              color: '#000000',
              fontWeight: '600',
              marginBottom: '60px'
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
              marginBottom: '80px'
            }}>
              {/* Initiator Rank */}
              <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                <div style={{
                  width: '160px',
                  height: '160px',
                  margin: '0 auto 20px',
                  filter: 'drop-shadow(0 4px 20px rgba(0, 0, 0, 0.1))'
                }}>
                  <img 
                    src="/images/ranks svgs/INITIATOR.svg" 
                    alt="Initiator Rank"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <h4 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#000000',
                  marginBottom: '8px'
                }}>
                  Initiator
                </h4>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Starting Point</p>
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
                  width: '160px',
                  height: '160px',
                  margin: '0 auto 20px',
                  filter: 'drop-shadow(0 8px 32px rgba(139, 92, 246, 0.3))'
                }}>
                  <img 
                    src="/images/ranks svgs/MYTHIC RANK.svg" 
                    alt="Mythic Rank"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <h4 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#000000',
                  marginBottom: '8px'
                }}>
                  Mythic
                </h4>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Elite Status</p>
              </div>
            </div>
            
            {/* Information Blocks */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '32px',
              marginBottom: '40px'
            }}>
              <div style={{
                background: '#ffffff',
                padding: '32px 24px',
                borderRadius: '12px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                textAlign: 'left'
              }}>
                <h5 style={{ 
                  fontSize: '18px', 
                  fontWeight: '700', 
                  color: '#000000', 
                  marginBottom: '12px'
                }}>
                  The Commitment
                </h5>
                <p style={{ 
                  fontSize: '15px', 
                  color: '#6b7280', 
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  Burning wipes your point balance to zero.
                </p>
              </div>
              
              <div style={{
                background: '#ffffff',
                padding: '32px 24px',
                borderRadius: '12px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                textAlign: 'left'
              }}>
                <h5 style={{ 
                  fontSize: '18px', 
                  fontWeight: '700', 
                  color: '#000000', 
                  marginBottom: '12px'
                }}>
                  The Reward
                </h5>
                <p style={{ 
                  fontSize: '15px', 
                  color: '#6b7280', 
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  In exchange, you permanently unlock a <span style={{ fontWeight: '600', color: '#000000' }}>higher Rank</span>.
                </p>
              </div>
              
              <div style={{
                background: '#ffffff',
                padding: '32px 24px',
                borderRadius: '12px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                textAlign: 'left'
              }}>
                <h5 style={{ 
                  fontSize: '18px', 
                  fontWeight: '700', 
                  color: '#000000', 
                  marginBottom: '12px'
                }}>
                  The Benefit
                </h5>
                <p style={{ 
                  fontSize: '15px', 
                  color: '#6b7280', 
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  Higher ranks unlock significantly higher privileges and reward efficiency.
                </p>
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
      <section style={{ padding: '100px 0', background: '#FFFFFF' }}>
        <div className="tf-container">
          <div style={{ textAlign: 'center', marginBottom: '70px', maxWidth: '900px', margin: '0 auto 70px' }}>
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
              fontSize: '20px',
              lineHeight: '1.6',
              color: '#4b5563'
            }}>
              You can enter the ecosystem at a pace that matches your goals. We offer two distinct operational modes.
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            maxWidth: '1100px',
            margin: '0 auto'
          }}>
            {/* Standard Protocol */}
            <div style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '48px',
              border: '2px solid #e5e7eb',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <h3 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '32px',
                fontWeight: '700',
                color: '#000000',
                marginBottom: '12px'
              }}>
                The Standard Protocol
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', fontWeight: '600' }}>
                (DAG Soldier)
              </p>
              <p style={{ fontSize: '16px', color: '#000000', marginBottom: '16px', lineHeight: '1.6', fontWeight: '600' }}>
                Focus: Skill Acquisition.
              </p>
              <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.7' }}>
                This is the foundational entry point. You enter on equal footing with full access to educational resources and the ability to earn reputation points through standard community tasks. It is free and designed for students focusing primarily on learning.
              </p>
            </div>
            
            {/* Leadership Protocol */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
              borderRadius: '24px',
              padding: '48px',
              border: '3px solid transparent',
              backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
              position: 'relative',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                padding: '6px 16px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '700',
                color: '#ffffff'
              }}>
                RECOMMENDED
              </div>
              <h3 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '32px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '12px'
              }}>
                The Leadership Protocol
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', fontWeight: '600' }}>
                (DAG Lieutenant)
              </p>
              <p style={{ fontSize: '16px', color: '#000000', marginBottom: '16px', lineHeight: '1.6', fontWeight: '600' }}>
                Focus: Community Stewardship.
              </p>
              <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.7' }}>
                Designed for serious builders ready to take on immediate responsibility. This status signals a higher level of commitment, granting you Accelerated Progression Status from Day One. It is the preferred route for those aiming for "Campus Ambassador" roles and faster rank advancement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Grants & Fellowships */}
      <section style={{ padding: '100px 0', background: '#F5F7FA' }}>
        <div className="tf-container">
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '48px',
              fontWeight: '700',
              color: '#000000',
              marginBottom: '32px',
              letterSpacing: '-0.02em',
              textAlign: 'center'
            }}>
              Ecosystem Grants & Fellowships
            </h2>
            
            <p style={{
              fontSize: '18px',
              lineHeight: '1.7',
              color: '#4b5563',
              marginBottom: '60px',
              textAlign: 'center',
              maxWidth: '900px',
              margin: '0 auto 60px'
            }}>
              We view our top contributors as partners. The ecosystem is structured to provide merit-based resource allocation, operating similar to a research grant or corporate fellowship.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Grant 1 */}
              <div style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '40px',
                display: 'flex',
                alignItems: 'center',
                gap: '32px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(8px)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  flexShrink: 0
                }}>
                  🏆
                </div>
                <div>
                  <h4 style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#000000',
                    marginBottom: '12px'
                  }}>
                    Meritocratic Efficiency
                  </h4>
                  <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
                    Your rank dictates your resource access. As you progress from Initiator to Mythic, the ecosystem unlocks higher "efficiency tiers," ensuring that long-term contributors receive a larger share of the value they generate.
                  </p>
                </div>
              </div>
              
              {/* Grant 2 */}
              <div style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '40px',
                display: 'flex',
                alignItems: 'center',
                gap: '32px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(8px)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  flexShrink: 0
                }}>
                  🤝
                </div>
                <div>
                  <h4 style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#000000',
                    marginBottom: '12px'
                  }}>
                    Performance Fellowships
                  </h4>
                  <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
                    Consistency is the primary metric we reward. Contributors who demonstrate sustained, monthly impact are eligible for the Discretionary Excellence Fund—a resource pool reserved specifically for those actively driving ecosystem stability.
                  </p>
                </div>
              </div>
              
              {/* Grant 3 */}
              <div style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '40px',
                display: 'flex',
                alignItems: 'center',
                gap: '32px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(8px)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  flexShrink: 0
                }}>
                  ✈️
                </div>
                <div>
                  <h4 style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#000000',
                    marginBottom: '12px'
                  }}>
                    Ambassador Logistics Program
                  </h4>
                  <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
                    For our most dedicated leaders, support extends beyond the digital platform. High-impact contributors can qualify for the Lifestyle Support Tier, which provides assistance for real-world logistical needs—such as travel and operational costs—to facilitate their leadership duties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA Section */}
      <section style={{ padding: '120px 0', background: '#FFFFFF' }}>
        <div className="tf-container">
          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '56px',
              fontWeight: '700',
              color: '#000000',
              marginBottom: '24px',
              letterSpacing: '-0.02em',
              lineHeight: '1.2'
            }}>
              Ready to See the Full Blueprint?
            </h2>
            <p style={{
              fontSize: '20px',
              lineHeight: '1.6',
              color: '#4b5563',
              marginBottom: '48px'
            }}>
              Dive deep into every detail of the DAGARMY reward system
            </p>
            <button
              onClick={scrollToDocs}
              style={{
                padding: '20px 60px',
                background: '#000000',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50px',
                fontSize: '18px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 16px 32px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              DOWNLOAD OFFICIAL BLUEPRINT
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
