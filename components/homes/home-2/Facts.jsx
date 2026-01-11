import React from "react";
import Image from "next/image";
export default function Facts() {
  return (
    <section className="section-about-box tf-spacing-1 pt-0" style={{ paddingBottom: '60px' }}>
      <div className="tf-container">
        <div className="row">
          <div className="col-lg-7">
            <div className="box-img">
              <div className="wrap-image-agent">
                <div className="image">
                  <Image
                    className="lazyload"
                    data-src="/images/Master AI, Blockchain image/Master AI.png"
                    alt="Master AI - Artificial Intelligence Education and Instruction"
                    src="/images/Master AI, Blockchain image/Master AI.png"
                    width={500}
                    height={580}
                  />
                </div>
                <div className="box-agent">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '50%' }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <polyline points="17 11 19 13 23 9"></polyline>
                      </svg>
                    </div>
                  </div>
                  <div className="content">
                    <h6 className="fw-5">Expert Mentors</h6>
                    <p>Industry Leaders</p>
                  </div>
                </div>
              </div>
              <div className="wrap-images">
                <div className="image">
                  <Image
                    className="lazyload"
                    data-src="/images/Master AI, Blockchain image/blockchain image.png"
                    alt="Blockchain - Team Collaboration and Decentralized Technology"
                    src="/images/Master AI, Blockchain image/blockchain image.png"
                    width={580}
                    height={580}
                  />
                </div>
                <div className="image">
                  <Image
                    className="lazyload"
                    data-src="/images/Master AI, Blockchain image/Data Visualisation.png"
                    alt="Data Visualisation - Analytics and Insight-Driven Intelligence"
                    src="/images/Master AI, Blockchain image/Data Visualisation.png"
                    width={500}
                    height={580}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="content-wrap">
              <div className="box-sub-tag wow fadeInUp" data-wow-delay="0.1s">
                <div className="sub-tag-icon">
                  <i className="icon-flash" />
                </div>
                <div className="sub-tag-title">
                  <p>Industry-Leading Education</p>
                </div>
              </div>
              <h2
                className="title-content fw-7 letter-spacing-1 wow fadeInUp"
                data-wow-delay="0.2s"
              >
                Master AI, Blockchain & <br />
                Data Visualisation
              </h2>
              <p className="text-content wow fadeInUp" data-wow-delay="0.3s">
                Join thousands of learners transforming their careers with cutting-edge courses in the most in-demand tech fields. Learn from industry experts and build real-world projects.
              </p>
              <div className="counter style-2">
                <div
                  className="number-counter wow fadeInUp"
                  data-wow-delay="0.3s"
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <div className="counter-content">
                    <span
                      className="number"
                      data-speed={2500}
                      data-to={50}
                      data-inviewport="yes"
                    >
                      50
                    </span>
                    +
                  </div>
                  <p>Industry Expert Instructors</p>
                </div>
                <div
                  className="number-counter wow fadeInUp"
                  data-wow-delay="0.35s"
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <div className="counter-content">
                    <span
                      className="number"
                      data-speed={2500}
                      data-to={2500}
                      data-inviewport="yes"
                    >
                      2500
                    </span>
                    +
                  </div>
                  <p>Active Students</p>
                </div>
                <div
                  className="number-counter wow fadeInUp"
                  data-wow-delay="0.4s"
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  <div className="counter-content">
                    <span
                      className="number"
                      data-speed={2500}
                      data-to={36}
                      data-inviewport="yes"
                    >
                      36
                    </span>
                    +
                  </div>
                  <p>Specialized Courses</p>
                </div>
                <div
                  className="number-counter wow fadeInUp"
                  data-wow-delay="0.45s"
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                  </svg>
                  <div className="counter-content">
                    <span
                      className="number"
                      data-speed={2500}
                      data-to={3}
                      data-inviewport="yes"
                    >
                      3
                    </span>
                  </div>
                  <p>Industry Tracks</p>
                </div>
              </div>
              <a className="tf-btn wow fadeInUp" data-wow-delay="0.5s" href="#">
                Learn More
                <i className="icon-arrow-top-right" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
