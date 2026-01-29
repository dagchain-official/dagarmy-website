"use client";
import React from "react";

export default function Features() {
  return (
    <section className="section-why tf-spacing-3 pt-0 page-about" style={{ background: '#fafafa', paddingTop: '80px', paddingBottom: '80px' }}>
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            <div className="heading-section text-center" style={{ marginBottom: '60px' }}>
              <h2 className="fw-7 font-cardo wow fadeInUp" style={{ fontSize: '42px', color: '#1f2937', marginBottom: '20px' }}>
                Bridging the Three Gaps
              </h2>
              <div className="sub fs-15 wow fadeInUp" data-wow-delay="0.1s" style={{ color: '#6b7280', maxWidth: '700px', margin: '0 auto', fontSize: '16px', lineHeight: '1.6' }}>
                The world is changing faster than the classroom. We exist to solve three critical failures of the modern tech landscape.
              </div>
            </div>
          </div>
        </div>
        <div className="row" style={{ gap: '30px 0' }}>
          <div className="col-lg-4">
            <div
              className="icons-box wow fadeInUp"
              style={{
                textAlign: 'center',
                padding: '40px 30px',
                background: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 2px 20px rgba(0, 0, 0, 0.06)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                height: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.08)';
              }}
            >
              <div className="icons" style={{ marginBottom: '25px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.05) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                  </svg>
                </div>
              </div>
              <div className="content">
                <h4 style={{ fontSize: '22px', fontWeight: '600', color: '#1f2937', marginBottom: '15px', fontFamily: 'Cardo, serif' }}>
                  The Skill Gap
                </h4>
                <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.7', margin: 0 }}>
                  Universities teach theory, but the industry demands practitioners. We train "Vibe Coders" who can build, not just memorize.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div
              className="icons-box wow fadeInUp"
              data-wow-delay="0.1s"
              style={{
                textAlign: 'center',
                padding: '40px 30px',
                background: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 2px 20px rgba(0, 0, 0, 0.06)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                height: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.08)';
              }}
            >
              <div className="icons" style={{ marginBottom: '25px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.05) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
              </div>
              <div className="content">
                <h4 style={{ fontSize: '22px', fontWeight: '600', color: '#1f2937', marginBottom: '15px', fontFamily: 'Cardo, serif' }}>
                  The Penetration Gap
                </h4>
                <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.7', margin: 0 }}>
                  Global companies want to hire from Tier 2 and Tier 3 cities but don't know where to look. We are their "boots on the ground," vetting the world's most loyal and skilled talent.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div
              className="icons-box wow fadeInUp"
              data-wow-delay="0.2s"
              style={{
                textAlign: 'center',
                padding: '40px 30px',
                background: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 2px 20px rgba(0, 0, 0, 0.06)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                height: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.08)';
              }}
            >
              <div className="icons" style={{ marginBottom: '25px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.05) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                </div>
              </div>
              <div className="content">
                <h4 style={{ fontSize: '22px', fontWeight: '600', color: '#1f2937', marginBottom: '15px', fontFamily: 'Cardo, serif' }}>
                  The Founder Gap
                </h4>
                <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.7', margin: 0 }}>
                  Many students have world-changing ideas but no roadmap. We provide the mentorship to turn those ideas into sustainable startups.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
