"use client";
import React from "react";
import Image from "next/image";
import PremiumButton from "./PremiumButton";
export default function DownloadApp() {
  return (
    <section className="section-mobile-app" style={{ background: '#ffffff', paddingTop: '40px', paddingBottom: '40px' }}>
      <div className="tf-container">
        <div className="row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="content-left" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: '0 0 auto' }}>
                <h2
                  className="fw-7 letter-spacing-1 wow fadeInUp"
                  data-wow-delay="0.2s"
                  style={{
                    fontSize: '36px',
                    fontWeight: '700',
                    color: '#1a1a1a',
                    marginBottom: '20px',
                    lineHeight: '1.3'
                  }}
                >
                  Ready for the Next Step in <br />
                  Your Career Growth
                </h2>
                <p className="fs-15 wow fadeInUp" data-wow-delay="0.3s" style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  lineHeight: '1.7',
                  marginBottom: '40px'
                }}>
                  Thousands of learners continue building credibility through structured programs, guided sessions and shared learning across India.
                </p>
              </div>
              <div className="wow fadeInUp" data-wow-delay="0.35s" style={{ marginTop: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ padding: '20px', background: '#fafafa', borderRadius: '12px', border: '1px solid #f0f0f0', transition: 'all 0.3s ease' }}>
                    <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#000000', marginBottom: '5px' }}>2.5K+</h3>
                    <p style={{ fontSize: '14px', margin: 0, color: '#4b5563', fontWeight: '500' }}>Active Learners</p>
                  </div>
                  <div style={{ padding: '20px', background: '#fafafa', borderRadius: '12px', border: '1px solid #f0f0f0', transition: 'all 0.3s ease' }}>
                    <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#000000', marginBottom: '5px' }}>50+</h3>
                    <p style={{ fontSize: '14px', margin: 0, color: '#4b5563', fontWeight: '500' }}>Instructors</p>
                  </div>
                  <div style={{ padding: '20px', background: '#fafafa', borderRadius: '12px', border: '1px solid #f0f0f0', transition: 'all 0.3s ease', gridColumn: 'span 2' }}>
                    <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#000000', marginBottom: '5px' }}>24/7</h3>
                    <p style={{ fontSize: '14px', margin: 0, color: '#4b5563', fontWeight: '500' }}>Learning Access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div className="wow fadeInUp" data-wow-delay="0.3s" style={{ padding: '40px', width: '100%' }}>
              <div style={{ background: '#ffffff', borderRadius: '16px', padding: '40px', border: '1px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
                <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '28px', color: '#1a1a1a' }}>What You Get as a DAG Army Member</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: '24px', display: 'flex', alignItems: 'start' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'rgba(0, 0, 0, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '16px',
                      flexShrink: 0
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <div>
                      <strong style={{ fontSize: '16px', color: '#1a1a1a', display: 'block', marginBottom: '6px' }}>Lifetime Access</strong>
                      <p style={{ margin: 0, color: '#6b7280', fontSize: '14px', lineHeight: '1.6' }}>Learn without pressure and return anytime</p>
                    </div>
                  </li>
                  <li style={{ marginBottom: '24px', display: 'flex', alignItems: 'start' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'rgba(0, 0, 0, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '16px',
                      flexShrink: 0
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                    <div>
                      <strong style={{ fontSize: '16px', color: '#1a1a1a', display: 'block', marginBottom: '6px' }}>Industry Certificates</strong>
                      <p style={{ margin: 0, color: '#6b7280', fontSize: '14px', lineHeight: '1.6' }}>Complete programs and earn credentials</p>
                    </div>
                  </li>
                  <li style={{ marginBottom: '24px', display: 'flex', alignItems: 'start' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'rgba(0, 0, 0, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '16px',
                      flexShrink: 0
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"></path>
                      </svg>
                    </div>
                    <div>
                      <strong style={{ fontSize: '16px', color: '#1a1a1a', display: 'block', marginBottom: '6px' }}>Project Based Learning</strong>
                      <p style={{ margin: 0, color: '#6b7280', fontSize: '14px', lineHeight: '1.6' }}>Build practical work samples</p>
                    </div>
                  </li>
                  <li style={{ marginBottom: '24px', display: 'flex', alignItems: 'start' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'rgba(0, 0, 0, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '16px',
                      flexShrink: 0
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <div>
                      <strong style={{ fontSize: '16px', color: '#1a1a1a', display: 'block', marginBottom: '6px' }}>Community Support</strong>
                      <p style={{ margin: 0, color: '#6b7280', fontSize: '14px', lineHeight: '1.6' }}>Learn alongside peers and mentors</p>
                    </div>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'start' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'rgba(0, 0, 0, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '16px',
                      flexShrink: 0
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    </div>
                    <div>
                      <strong style={{ fontSize: '16px', color: '#1a1a1a', display: 'block', marginBottom: '6px' }}>Career Progress</strong>
                      <p style={{ margin: 0, color: '#6b7280', fontSize: '14px', lineHeight: '1.6' }}>Build skills aligned with current and emerging roles</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
