import React from "react";

export default function ProblemSolution() {
  return (
    <section className="bootcamp-section" style={{ background: '#f9fafb', paddingTop: '100px', paddingBottom: '100px' }}>
      <div className="tf-container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <h2 className="font-cardo wow fadeInUp" style={{ fontSize: '40px', marginBottom: '16px', color: '#1f2937', fontWeight: '700' }}>
              Why Traditional Education Isn't Enough
            </h2>
            <p className="wow fadeInUp" data-wow-delay="0.1s" style={{ fontSize: '18px', color: '#6b7280', marginBottom: '60px', lineHeight: '1.6' }}>
              The gap between what colleges teach and what the market needs is growing. We bridge that gap with practical AI skills.
            </p>
          </div>
        </div>

        <div className="row" style={{ gap: '24px 0' }}>
          <div className="col-lg-6">
            <div 
              className="wow fadeInLeft"
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '40px',
                height: '100%',
                border: '1px solid #e5e7eb'
              }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#1f2937' }}>
                Traditional Approach
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  'Years of expensive education',
                  'Theoretical knowledge, no practical skills',
                  'Limited to local job market',
                  'Waiting for placement opportunities',
                  'Dependent on employers',
                  'No income during learning'
                ].map((item, index) => (
                  <li key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    marginBottom: '14px',
                    color: '#6b7280',
                    fontSize: '15px',
                    lineHeight: '1.5'
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" style={{ marginRight: '12px', marginTop: '2px', flexShrink: 0 }}>
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-lg-6">
            <div 
              className="wow fadeInRight"
              style={{
                background: '#1f2937',
                borderRadius: '12px',
                padding: '40px',
                height: '100%',
                color: '#ffffff'
              }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>
                DAGARMY Bootcamp
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  'Just 4 weeks to launch',
                  '100% practical, build real products',
                  'Work with global clients remotely',
                  'Create your own opportunities',
                  'Be your own boss',
                  'Start earning while learning'
                ].map((item, index) => (
                  <li key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    marginBottom: '14px',
                    fontSize: '15px',
                    lineHeight: '1.5',
                    opacity: 0.95
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" style={{ marginRight: '12px', marginTop: '2px', flexShrink: 0 }}>
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="row justify-content-center" style={{ marginTop: '60px' }}>
          <div className="col-lg-10">
            <div 
              className="wow fadeInUp"
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '48px',
                textAlign: 'center',
                border: '1px solid #e5e7eb'
              }}
            >
              <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px', color: '#1f2937' }}>
                Perfect for Tier 2/3 City Students
              </h3>
              <p style={{ fontSize: '16px', color: '#6b7280', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
                Limited local opportunities? No problem. Learn AI skills that work anywhere, serve clients globally, and create impact in your community-all from your laptop.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
