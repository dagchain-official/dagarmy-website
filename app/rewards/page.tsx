"use client";
import React from "react";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";

export default function RewardsPage() {
  return (
    <>
      <div id="wrapper">
        <Header2 />
        
        <div className="main-content pt-0">
          {/* Hero Section */}
          <section style={{ 
            background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)',
            padding: '60px 0 40px',
            position: 'relative'
          }}>
            <div className="tf-container">
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 className="font-cardo" style={{
                  fontSize: 'clamp(42px, 6vw, 58px)',
                  fontWeight: '800',
                  color: '#1f2937',
                  marginBottom: '20px',
                  lineHeight: '1.2',
                  letterSpacing: '-0.02em'
                }}>
                  DAG Army Reward System
                </h1>
                <p style={{
                  fontSize: '18px',
                  color: '#6b7280',
                  maxWidth: '700px',
                  margin: '0 auto',
                  lineHeight: '1.7',
                  fontWeight: '400'
                }}>
                  An ecosystem participation program designed to reward responsible contribution rather than speculation or hype
                </p>
              </div>
            </div>
          </section>

      {/* Section 1: What is DAG Army */}
      <section style={{ padding: '60px 0', background: '#ffffff' }}>
        <div className="tf-container">
          <div className="row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
            <div>
              <div style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.04) 0%, rgba(0, 0, 0, 0.02) 100%)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                padding: '12px 20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid rgba(0, 0, 0, 0.15)'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <p style={{ margin: 0, fontWeight: '600', fontSize: '15px', color: '#1f2937' }}>Ecosystem Participation</p>
              </div>
              
              <h2 className="font-cardo" style={{
                fontSize: '48px',
                fontWeight: '800',
                color: '#1f2937',
                marginBottom: '20px',
                lineHeight: '1.2',
                letterSpacing: '-0.02em'
              }}>
                What is DAG Army?
              </h2>
              
              <p style={{
                fontSize: '16px',
                color: '#6b7280',
                lineHeight: '1.7',
                marginBottom: '24px',
                fontWeight: '400'
              }}>
                An ecosystem participation program designed to reward responsible contribution rather than speculation or hype.
              </p>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', marginBottom: '12px' }}>Structure</h3>
                <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.6' }}>
                  Participants enter at the same starting point and progress through roles, milestones, and structured paths.
                </p>
              </div>

              <div style={{
                background: '#fafafa',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #f0f0f0'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', marginBottom: '12px' }}>Core Layers</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#4b5563' }}>
                  <span style={{ fontWeight: '500' }}>Ecosystem</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                  <span style={{ fontWeight: '500' }}>Participation Roles</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                  <span style={{ fontWeight: '500' }}>Reward Rules</span>
                </div>
              </div>
            </div>

            <div style={{
              background: '#f9fafb',
              borderRadius: '16px',
              padding: '40px',
              border: '1px solid #e5e7eb',
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 16px' }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <p style={{ fontSize: '14px', fontWeight: '500' }}>Image Placeholder</p>
                <p style={{ fontSize: '12px', marginTop: '4px' }}>DAG Army Ecosystem Visual</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Why a Reward System Exists */}
      <section style={{ padding: '60px 0', background: '#fafafa' }}>
        <div className="tf-container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 className="font-cardo" style={{
              fontSize: '48px',
              fontWeight: '800',
              color: '#1f2937',
              marginBottom: '20px',
              lineHeight: '1.2',
              letterSpacing: '-0.02em'
            }}>
              Why a Reward System Exists
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Aligning individual effort with collective ecosystem growth
            </p>
          </div>

          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '60px 40px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '40px' }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '16px',
                  background: 'rgba(0, 0, 0, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  border: '2px solid rgba(0, 0, 0, 0.1)'
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>Individual Effort</h3>
                <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>Deliberate focus</p>
              </div>

              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>

              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '16px',
                  background: 'rgba(0, 0, 0, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  border: '2px solid rgba(0, 0, 0, 0.1)'
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>Measured Action</h3>
                <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>Tracked outcomes</p>
              </div>

              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>

              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '16px',
                  background: 'rgba(0, 0, 0, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  border: '2px solid rgba(0, 0, 0, 0.1)'
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>Ecosystem Growth</h3>
                <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>Sustainable value</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Contribution Over Recruitment */}
      <section style={{ padding: '60px 0', background: '#ffffff' }}>
        <div className="tf-container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 className="font-cardo" style={{
              fontSize: '48px',
              fontWeight: '800',
              color: '#1f2937',
              marginBottom: '20px',
              lineHeight: '1.2',
              letterSpacing: '-0.02em'
            }}>
              Contribution Over Recruitment
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Building trust through responsible contribution, not hype
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              borderRadius: '16px',
              padding: '40px',
              border: '2px solid #86efac',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: 'rgba(34, 197, 94, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#166534',
                marginBottom: '20px'
              }}>
                Responsible Contribution
              </h3>
              <p style={{
                fontSize: '15px',
                color: '#15803d',
                fontWeight: '600',
                marginBottom: '16px'
              }}>
                DAG Army Approach
              </p>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'start', gap: '12px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span style={{ fontSize: '15px', color: '#166534', lineHeight: '1.6' }}>Accurate understanding and guidance</span>
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'start', gap: '12px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span style={{ fontSize: '15px', color: '#166534', lineHeight: '1.6' }}>Consistent engagement</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span style={{ fontSize: '15px', color: '#166534', lineHeight: '1.6' }}>Long-term trust building</span>
                </li>
              </ul>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
              borderRadius: '16px',
              padding: '40px',
              border: '2px solid #fca5a5',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </div>
              
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#991b1b',
                marginBottom: '20px'
              }}>
                Hype-Driven Recruitment
              </h3>
              <p style={{
                fontSize: '15px',
                color: '#b91c1c',
                fontWeight: '600',
                marginBottom: '16px'
              }}>
                What We Avoid
              </p>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'start', gap: '12px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  <span style={{ fontSize: '15px', color: '#991b1b', lineHeight: '1.6' }}>Mass onboarding without context</span>
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'start', gap: '12px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  <span style={{ fontSize: '15px', color: '#991b1b', lineHeight: '1.6' }}>"Get rich quick" urgency</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  <span style={{ fontSize: '15px', color: '#991b1b', lineHeight: '1.6' }}>Speculation with no stability</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Core Design Principles */}
      <section style={{ padding: '60px 0', background: '#fafafa' }}>
        <div className="tf-container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 className="font-cardo" style={{
              fontSize: '48px',
              fontWeight: '800',
              color: '#1f2937',
              marginBottom: '20px',
              lineHeight: '1.2',
              letterSpacing: '-0.02em'
            }}>
              Core Design Principles
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              The foundation of our reward system
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '32px 24px',
              border: '1px solid #e5e7eb',
              transition: 'all 0.3s ease',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = '#000000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', marginBottom: '12px' }}>
                Transparency in Rules
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
                Clearly defined and accessible criteria for all participants
              </p>
            </div>

            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '32px 24px',
              border: '1px solid #e5e7eb',
              transition: 'all 0.3s ease',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = '#000000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', marginBottom: '12px' }}>
                Equal Starting Access
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
                Everyone begins at the same foundational point
              </p>
            </div>

            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '32px 24px',
              border: '1px solid #e5e7eb',
              transition: 'all 0.3s ease',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = '#000000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', marginBottom: '12px' }}>
                Contribution-Based Earning
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
                Rewards earned through measurable actions, not promises
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '32px 24px',
              border: '1px solid #e5e7eb',
              transition: 'all 0.3s ease',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = '#000000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <polyline points="17 11 19 13 23 9"></polyline>
                </svg>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', marginBottom: '12px' }}>
                One Individual, One Account
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
                Ensures fairness and prevents system abuse
              </p>
            </div>

            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '32px 24px',
              border: '1px solid #e5e7eb',
              transition: 'all 0.3s ease',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = '#000000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', marginBottom: '12px' }}>
                Long-Term Sustainability
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
                Focuses on enduring growth over short-term gains
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '60px 0 80px', background: '#ffffff' }}>
        <div className="tf-container">
          <div style={{
            background: 'linear-gradient(135deg, #000000 0%, #1f2937 100%)',
            borderRadius: '24px',
            padding: '60px 40px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{
                fontSize: '40px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '20px',
                lineHeight: '1.2'
              }}>
                Ready to Join DAG Army?
              </h2>
              <p style={{
                fontSize: '18px',
                color: 'rgba(255, 255, 255, 0.8)',
                maxWidth: '600px',
                margin: '0 auto 40px',
                lineHeight: '1.6'
              }}>
                Start your journey with responsible contribution and earn rewards through measurable actions
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href="/register"
                  style={{
                    padding: '16px 40px',
                    background: '#ffffff',
                    color: '#000000',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    border: '2px solid #ffffff'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Get Started
                </a>
                <a
                  href="#"
                  style={{
                    padding: '16px 40px',
                    background: 'transparent',
                    color: '#ffffff',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.borderColor = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  }}
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
        </div>
        
        <Footer1 />
      </div>
    </>
  );
}
