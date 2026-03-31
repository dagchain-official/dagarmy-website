import React from "react";
import { certifications } from "@/data/bootcamp";

export default function CertificationBadges() {
  return (
    <section className="bootcamp-section" style={{ background: '#f9fafb', paddingTop: '100px', paddingBottom: '100px' }}>
      <div className="tf-container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <h2 className="font-cardo wow fadeInUp" style={{ fontSize: '40px', marginBottom: '16px', color: '#1f2937', fontWeight: '700' }}>
              Certification Levels
            </h2>
            <p className="wow fadeInUp" data-wow-delay="0.1s" style={{ fontSize: '18px', color: '#6b7280', marginBottom: '60px', lineHeight: '1.6' }}>
              Progress through three levels of mastery—each unlocking new opportunities and recognition
            </p>
          </div>
        </div>

        <div className="row" style={{ gap: '24px 0' }}>
          {certifications.map((cert, index) => (
            <div key={index} className="col-lg-4">
              <div 
                className="wow fadeInUp"
                data-wow-delay={`${index * 0.1}s`}
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '40px',
                  height: '100%',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  width: '32px',
                  height: '32px',
                  background: '#1f2937',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '16px'
                }}>
                  {cert.level}
                </div>

                <div style={{
                  width: '64px',
                  height: '64px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 0 24px',
                  color: '#1f2937'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>

                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  marginBottom: '12px',
                  color: '#1f2937'
                }}>
                  {cert.title}
                </h3>

                <p style={{
                  fontSize: '15px',
                  color: '#6b7280',
                  marginBottom: '24px',
                  lineHeight: '1.6'
                }}>
                  {cert.description}
                </p>

                <div style={{
                  background: '#f9fafb',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h4 style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    marginBottom: '12px',
                    color: '#1f2937',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Requirements
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {cert.requirements.map((req, i) => (
                      <li key={i} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        marginBottom: '8px',
                        fontSize: '14px',
                        color: '#4b5563',
                        lineHeight: '1.5'
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2" style={{ marginRight: '8px', marginTop: '2px', flexShrink: 0 }}>
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
