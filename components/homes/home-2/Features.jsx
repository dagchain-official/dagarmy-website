import React from "react";

export default function Features() {
  return (
    <section className="section-icon" style={{
      background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%)',
      padding: '40px 0'
    }}>
      <div className="tf-container">
        <div className="row">
          <div className="wrap-icon-box">
            <div
              className="icons-box style-3 wow fadeInUp"
              data-wow-delay="0.1s"
            >
              <div className="icons" style={{ background: 'rgba(255,255,255,0.2)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <polygon points="10 8 16 11 10 14 10 8" fill="#fff" stroke="none"></polygon>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <div className="content">
                <p style={{ color: '#fff' }}>
                  Learn in- skills with over 24,000 video <br />
                  courses
                </p>
              </div>
            </div>
            <div
              className="icons-box style-3 wow fadeInUp"
              data-wow-delay="0.2s"
            >
              <div className="icons" style={{ background: 'rgba(255,255,255,0.2)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="7"></circle>
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                </svg>
              </div>
              <div className="content">
                <p style={{ color: '#fff' }}>
                  Choose courses taught by real-world <br />
                  experts
                </p>
              </div>
            </div>
            <div
              className="icons-box style-3 wow fadeInUp"
              data-wow-delay="0.3s"
            >
              <div className="icons" style={{ background: 'rgba(255,255,255,0.2)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="14" height="10" rx="2" ry="2"></rect>
                  <rect x="16" y="11" width="6" height="10" rx="1"></rect>
                  <line x1="2" y1="17" x2="16" y2="17"></line>
                </svg>
              </div>
              <div className="content">
                <p style={{ color: '#fff' }}>
                  Learn at your own pace, with lifetime <br />
                  access on mobile and desktop
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
