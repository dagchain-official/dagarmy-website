import React from "react";

export default function Features() {
  return (
    <section className="section-why tf-spacing-3 pt-0 page-about" style={{ background: '#ffffff', paddingTop: '60px', paddingBottom: '60px' }}>
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            <div className="heading-section text-center" style={{ marginBottom: '50px' }}>
              <h2 className="fw-7 font-cardo wow fadeInUp" style={{ fontSize: '42px', color: '#1f2937', marginBottom: '15px' }}>
                Bridging the Three Gaps
              </h2>
              <div className="sub fs-15 wow fadeInUp" style={{ color: '#6b7280', maxWidth: '700px', margin: '0 auto' }}>
                The world is changing faster than the classroom. We exist to solve three critical failures of the modern tech landscape.
              </div>
            </div>
          </div>
        </div>
        <div className="row" style={{ gap: '30px 0' }}>
          <div className="col-lg-4">
            <div className="icons-box wow fadeInUp" style={{ textAlign: 'center', padding: '30px 20px' }}>
              <div className="icons" style={{ marginBottom: '25px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto',
                  borderRadius: '50%',
                  background: 'rgba(139, 92, 246, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>
              <div className="content">
                <h4 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '15px' }}>
                  The Skill Gap
                </h4>
                <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
                  Universities teach theory, but the industry demands practitioners. We train "Vibe Coders" who can build, not just memorize.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="icons-box wow fadeInUp" data-wow-delay="0.1s" style={{ textAlign: 'center', padding: '30px 20px' }}>
              <div className="icons" style={{ marginBottom: '25px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto',
                  borderRadius: '50%',
                  background: 'rgba(139, 92, 246, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M2 12h20"></path>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
              </div>
              <div className="content">
                <h4 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '15px' }}>
                  The Penetration Gap
                </h4>
                <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
                  Global companies want to hire from Tier 2 and Tier 3 cities but don't know where to look. We are their "boots on the ground," vetting the world's most loyal and skilled talent.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="icons-box wow fadeInUp" data-wow-delay="0.2s" style={{ textAlign: 'center', padding: '30px 20px' }}>
              <div className="icons" style={{ marginBottom: '25px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto',
                  borderRadius: '50%',
                  background: 'rgba(139, 92, 246, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M2 12h20"></path>
                    <path d="m19 9-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              <div className="content">
                <h4 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '15px' }}>
                  The Founder Gap
                </h4>
                <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
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
