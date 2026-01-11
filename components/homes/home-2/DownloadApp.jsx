import React from "react";
import Image from "next/image";
export default function DownloadApp() {
  return (
    <section className="section-mobile-app bg-4">
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
              >
                Ready To Transform <br />
                Your Career?
              </h2>
              <p className="fs-15 wow fadeInUp" data-wow-delay="0.3s">
                Join 2,500+ learners who are already mastering AI, Blockchain, and Data Visualisation. Get instant access to 36+ specialized courses, live workshops, and a thriving community of tech professionals.
              </p>
              <div className="wow fadeInUp" data-wow-delay="0.35s" style={{ marginTop: '25px', marginBottom: '25px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ padding: '20px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                    <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '5px' }}>36+</h3>
                    <p style={{ fontSize: '14px', margin: 0 }}>Expert-Led Courses</p>
                  </div>
                  <div style={{ padding: '20px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                    <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '5px' }}>2.5K+</h3>
                    <p style={{ fontSize: '14px', margin: 0 }}>Active Students</p>
                  </div>
                  <div style={{ padding: '20px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                    <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '5px' }}>50+</h3>
                    <p style={{ fontSize: '14px', margin: 0 }}>Industry Experts</p>
                  </div>
                  <div style={{ padding: '20px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                    <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '5px' }}>24/7</h3>
                    <p style={{ fontSize: '14px', margin: 0 }}>Learning Access</p>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <a href="#" className="tf-btn wow fadeInUp" data-wow-delay="0.4s">
                  Start Learning Now
                  <i className="icon-arrow-top-right" />
                </a>
                <a href="#" className="tf-btn style-secondary wow fadeInUp" data-wow-delay="0.45s">
                  View All Courses
                  <i className="icon-arrow-top-right" />
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="wow fadeInUp" data-wow-delay="0.3s" style={{ padding: '40px' }}>
              <div style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)', borderRadius: '20px', padding: '40px', color: 'white' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>What You'll Get:</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'start' }}>
                    <span style={{ marginRight: '12px', fontSize: '24px' }}>🎓</span>
                    <div>
                      <strong>Lifetime Access</strong>
                      <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '14px' }}>Learn at your own pace with unlimited course access</p>
                    </div>
                  </li>
                  <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'start' }}>
                    <span style={{ marginRight: '12px', fontSize: '24px' }}>🏆</span>
                    <div>
                      <strong>Industry Certificates</strong>
                      <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '14px' }}>Earn recognized certifications upon completion</p>
                    </div>
                  </li>
                  <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'start' }}>
                    <span style={{ marginRight: '12px', fontSize: '24px' }}>💼</span>
                    <div>
                      <strong>Real-World Projects</strong>
                      <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '14px' }}>Build portfolio-ready projects with expert guidance</p>
                    </div>
                  </li>
                  <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'start' }}>
                    <span style={{ marginRight: '12px', fontSize: '24px' }}>👥</span>
                    <div>
                      <strong>Community Support</strong>
                      <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '14px' }}>Connect with peers and mentors in our active community</p>
                    </div>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'start' }}>
                    <span style={{ marginRight: '12px', fontSize: '24px' }}>🚀</span>
                    <div>
                      <strong>Career Advancement</strong>
                      <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '14px' }}>Get job-ready skills for high-demand tech roles</p>
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
