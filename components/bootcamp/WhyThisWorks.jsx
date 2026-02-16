import React from "react";
import { whyThisWorks } from "@/data/bootcamp";

export default function WhyThisWorks() {
  return (
    <section style={{ background: '#f9fafb', paddingTop: '100px', paddingBottom: '100px' }}>
      <div className="tf-container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <h2 className="font-cardo wow fadeInUp" style={{ fontSize: '40px', marginBottom: '16px', color: '#1f2937', fontWeight: '700' }}>
              Why This Model Works
            </h2>
            <p className="wow fadeInUp" data-wow-delay="0.1s" style={{ fontSize: '18px', color: '#6b7280', marginBottom: '60px', lineHeight: '1.6' }}>
              Designed specifically for Tier 2/3 city students seeking practical skills and real income opportunities
            </p>
          </div>
        </div>

        <div className="row" style={{ gap: '24px 0' }}>
          {whyThisWorks.map((item, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div 
                className="wow fadeInUp"
                data-wow-delay={`${index * 0.1}s`}
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '32px',
                  height: '100%',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  color: '#1f2937'
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>

                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  marginBottom: '12px',
                  color: '#1f2937'
                }}>
                  {item.title}
                </h3>

                <p style={{
                  fontSize: '15px',
                  color: '#6b7280',
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="row justify-content-center" style={{ marginTop: '60px' }}>
          <div className="col-lg-10">
            <div 
              className="wow fadeInUp"
              style={{
                background: '#1f2937',
                borderRadius: '12px',
                padding: '48px',
                textAlign: 'center',
                color: '#ffffff'
              }}
            >
              <h3 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>
                From Job-Seeker to Problem-Solver
              </h3>
              <p style={{ fontSize: '17px', opacity: 0.95, maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
                This bootcamp doesn't just teach AI tools—it transforms your mindset. You'll learn to identify opportunities, create solutions, and build income streams that don't depend on traditional employment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
