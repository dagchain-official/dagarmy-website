import React from "react";

export default function EnrollmentCTA() {
  const benefits = [
    "4 weeks of intensive AI training",
    "20+ business models to choose from",
    "No-code tools and automation",
    "Build real MVP projects",
    "Client acquisition strategies",
    "3-tier certification system",
    "Lifetime access to alumni network",
    "Monthly office hours and support"
  ];

  return (
    <section id="enrollment" style={{ background: '#ffffff', paddingTop: '100px', paddingBottom: '100px' }}>
      <div className="tf-container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div 
              className="wow fadeInUp"
              style={{
                background: '#f9fafb',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #e5e7eb'
              }}
            >
              <div style={{
                background: '#1f2937',
                padding: '60px 40px',
                textAlign: 'center',
                color: '#ffffff'
              }}>
                <h2 className="font-cardo" style={{ fontSize: '36px', marginBottom: '16px', fontWeight: '700' }}>
                  Ready to Start Your AI Journey?
                </h2>
                <p style={{ fontSize: '18px', opacity: 0.95, maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
                  Join the next cohort and transform into an AI entrepreneur in just 4 weeks
                </p>
              </div>

              <div style={{ padding: '60px 40px' }}>
                <div className="row">
                  <div className="col-lg-6">
                    <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#1f2937' }}>
                      What's Included
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {benefits.map((benefit, index) => (
                        <li key={index} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          marginBottom: '14px',
                          fontSize: '15px',
                          color: '#4b5563',
                          lineHeight: '1.5'
                        }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2" style={{ marginRight: '12px', marginTop: '2px', flexShrink: 0 }}>
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="col-lg-6">
                    <div style={{
                      background: '#ffffff',
                      padding: '32px',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}>
                      <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: '#1f2937' }}>
                        Apply Now
                      </h3>
                      <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '28px', lineHeight: '1.6' }}>
                        Limited seats available for the next cohort. Apply now to secure your spot and start your transformation journey.
                      </p>

                      <a
                        href="mailto:admissions@dagarmy.com?subject=AI Entrepreneur Bootcamp Application"
                        style={{
                          display: 'block',
                          padding: '16px 32px',
                          background: '#1f2937',
                          color: '#ffffff',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: '600',
                          textAlign: 'center',
                          textDecoration: 'none',
                          marginBottom: '12px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#111827';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#1f2937';
                        }}
                      >
                        Submit Application
                      </a>

                      <a
                        href="mailto:info@dagarmy.com?subject=Bootcamp Syllabus Request"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '14px 32px',
                          background: 'transparent',
                          color: '#1f2937',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '15px',
                          fontWeight: '600',
                          textAlign: 'center',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#1f2937';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Download Syllabus
                      </a>

                      <div style={{
                        marginTop: '28px',
                        paddingTop: '20px',
                        borderTop: '1px solid #e5e7eb',
                        textAlign: 'center'
                      }}>
                        <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '8px' }}>
                          Have questions? We're here to help
                        </p>
                        <a
                          href="mailto:support@dagarmy.com"
                          style={{
                            fontSize: '15px',
                            color: '#1f2937',
                            fontWeight: '600',
                            textDecoration: 'none'
                          }}
                        >
                          support@dagarmy.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center" style={{ marginTop: '60px' }}>
          <div className="col-lg-10">
            <div 
              className="wow fadeInUp"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '32px',
                textAlign: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
                  4 Weeks
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  Intensive Training
                </div>
              </div>
              <div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
                  100%
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  Practical Focus
                </div>
              </div>
              <div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
                  20+
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  Business Models
                </div>
              </div>
              <div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
                  No Code
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  Required
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
