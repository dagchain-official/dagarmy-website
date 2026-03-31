import React from "react";
import Image from "next/image";
import { successMetrics } from "@/data/bootcamp";

export default function BootcampHero() {
  return (
    <section 
      className="flat-title-page" 
      style={{ 
        background: '#ffffff',
        paddingTop: '140px',
        paddingBottom: '100px',
        position: 'relative'
      }}
    >
      <div className="tf-container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="content">
              <div style={{
                display: 'inline-block',
                padding: '6px 16px',
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '32px',
                color: '#1f2937',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}>
                4-Week Intensive Program
              </div>

              <h1 
                className="font-cardo wow fadeInUp bootcamp-hero-h1" 
                style={{ 
                  lineHeight: '1.15',
                  marginBottom: '24px',
                }}
              >
                AI-Driven Entrepreneur Bootcamp
              </h1>

              <p 
                className="wow fadeInUp" 
                data-wow-delay="0.1s"
                style={{ 
                  fontSize: '20px',
                  lineHeight: '1.6',
                  marginBottom: '40px',
                  color: '#4b5563',
                  maxWidth: '540px'
                }}
              >
                Transform into an AI Automation Freelancer, Micro-Startup Founder, or Tool Builder in 4 weeks. No coding required.
              </p>

              <div 
                className="wow fadeInUp" 
                data-wow-delay="0.2s"
                style={{ 
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                  marginBottom: '60px'
                }}
              >
                <a
                  href="#enrollment"
                  style={{
                    padding: '16px 32px',
                    background: '#1f2937',
                    color: '#ffffff',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#111827';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#1f2937';
                  }}
                >
                  Apply Now
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>

                <a
                  href="#curriculum"
                  style={{
                    padding: '16px 32px',
                    background: 'transparent',
                    color: '#1f2937',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#1f2937';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                >
                  View Curriculum
                </a>
              </div>

              <div 
                className="wow fadeInUp bootcamp-hero-stats" 
                data-wow-delay="0.3s"
              >
                {successMetrics.map((item, index) => (
                  <div key={index}>
                    <div style={{
                      fontSize: '28px',
                      fontWeight: '700',
                      marginBottom: '4px',
                      color: '#1f2937'
                    }}>
                      {item.metric}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      lineHeight: '1.4'
                    }}>
                      {item.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div 
              className="wow fadeInRight" 
              data-wow-delay="0.2s"
              style={{
                position: 'relative'
              }}
            >
              <div className="bootcamp-hero-image">
                [Hero Image Placeholder]
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
