"use client";
import React from "react";
import Image from "next/image";
import PremiumButton from "./PremiumButton";
export default function DownloadApp() {
  return (
    <section className="section-mobile-app" style={{ background: '#ffffff' }}>
      <div className="tf-container">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="content-left">
              <div className="box-sub-tag wow fadeInUp" data-wow-delay="0.1s">
                <div className="sub-tag-icon">
                  <i className="icon-flash" />
                </div>
                <div className="sub-tag-title">
                  <p>Join Our Community</p>
                </div>
              </div>
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
                marginBottom: '28px'
              }}>
                Thousands of learners continue building credibility through structured programs, guided sessions and shared learning across India.
              </p>
              <div className="wow fadeInUp" data-wow-delay="0.35s" style={{ marginTop: '25px', marginBottom: '25px' }}>
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
              <div style={{ display: 'flex', gap: '15px' }}>
                <PremiumButton
                  text="Start Learning Now"
                  href="#"
                  className="wow fadeInUp"
                  data-wow-delay="0.4s"
                  style={{ fontSize: '16px', height: '52px', minWidth: '200px' }}
                />
                <a
                  href="#"
                  className="wow fadeInUp relative flex items-center gap-1 bg-[#000000] px-8 border-2 border-[#000000] text-base rounded-xl font-semibold text-white cursor-pointer overflow-hidden transition-all duration-600 ease-in-out hover:text-white hover:rounded-3xl group hover:transition-all hover:duration-700"
                  data-wow-delay="0.45s"
                  style={{ textDecoration: 'none', height: '52px', minWidth: '220px', justifyContent: 'center' }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="absolute w-6 fill-white z-[20] transition-all duration-700 ease-in-out -left-1/4 group-hover:left-4 group-hover:fill-white"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                    ></path>
                  </svg>
                  <span
                    className="relative z-[10] transition-all duration-700 ease-in-out -translate-x-3 group-hover:translate-x-3"
                  >
                    View All Courses
                  </span>
                  <span
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-[#1f2937] rounded-full opacity-0 transition-all duration-700 ease-in-out group-hover:w-[270px] group-hover:h-[270px] group-hover:opacity-100 z-[0]"
                  ></span>
                  <svg
                    viewBox="0 0 24 24"
                    className="absolute w-6 fill-white z-[20] transition-all duration-700 ease-in-out right-4 group-hover:-right-1/4 group-hover:fill-white"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="wow fadeInUp" data-wow-delay="0.3s" style={{ padding: '40px' }}>
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
