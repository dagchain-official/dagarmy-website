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
              <div className="icons">
                <i className="flaticon-play" />
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
              <div className="icons">
                <i className="flaticon-medal" />
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
              <div className="icons">
                <i className="flaticon-key" />
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
