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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', background: 'rgba(31, 41, 55, 0.1)', borderRadius: '50%' }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              <div className="box-sub-tag wow fadeInUp" data-wow-delay="0.1s" style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(109, 40, 217, 0.05) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.15)',
                borderRadius: '12px',
                padding: '12px 20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(109, 40, 217, 0.1) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid rgba(31, 41, 55, 0.2)'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="sub-tag-title">
                  <p style={{ margin: 0, fontWeight: '600', fontSize: '15px', color: '#1f2937' }}>Industry-Leading Education</p>
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
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              <a
                href="#"
                className="wow fadeInUp relative flex items-center gap-1 bg-[#1f2937] px-8 border-2 border-[#1f2937] text-base rounded-xl font-semibold text-white cursor-pointer overflow-hidden transition-all duration-600 ease-in-out hover:text-white hover:rounded-3xl group hover:transition-all hover:duration-700"
                data-wow-delay="0.5s"
                style={{ textDecoration: 'none', height: '52px', width: '280px', justifyContent: 'center' }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="absolute w-6 fill-white z-[20] transition-all duration-700 ease-in-out -left-1/4 group-hover:left-4 group-hover:fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                  ></path>
                </svg>
                <span
                  className="relative z-[10] transition-all duration-700 ease-in-out -translate-x-3 group-hover:translate-x-3"
                >
                  Learn More
                </span>
                <span
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-[#131836] rounded-full opacity-0 transition-all duration-700 ease-in-out group-hover:w-[270px] group-hover:h-[270px] group-hover:opacity-100 z-[0]"
                ></span>
                <svg
                  viewBox="0 0 24 24"
                  className="absolute w-6 fill-white z-[20] transition-all duration-700 ease-in-out right-4 group-hover:-right-1/4 group-hover:fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
