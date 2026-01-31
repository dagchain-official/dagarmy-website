"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function Facts() {
  const [userCountry, setUserCountry] = useState("your country");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data && data.country_name) {
          setUserCountry(data.country_name);
        }
      } catch (error) {
        console.log('Could not detect country, using default');
        setUserCountry("your country");
      } finally {
        setIsLoading(false);
      }
    };
    detectCountry();
  }, []);
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
                    width={450}
                    height={520}
                  />
                </div>
                <div className="box-agent">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', background: 'rgba(0, 0, 0, 0.1)', borderRadius: '50%' }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                    width={520}
                    height={520}
                  />
                </div>
                <div className="image">
                  <Image
                    className="lazyload"
                    data-src="/images/Master AI, Blockchain image/Data Visualisation.png"
                    alt="Data Visualisation - Analytics and Insight-Driven Intelligence"
                    src="/images/Master AI, Blockchain image/Data Visualisation.png"
                    width={450}
                    height={520}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="content-wrap">
              <div className="box-sub-tag wow fadeInUp" data-wow-delay="0.1s" style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.04) 0%, rgba(0, 0, 0, 0.02) 100%)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
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
                  background: 'rgba(0, 0, 0, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid rgba(0, 0, 0, 0.15)'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="8.5" cy="7" r="4" stroke="#000000" strokeWidth="2" />
                    <polyline points="17 11 19 13 23 9" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="sub-tag-title">
                  <p style={{ margin: 0, fontWeight: '600', fontSize: '15px', color: '#1f2937' }}>Professionals With Real Industry Experience</p>
                </div>
              </div>
              <h2
                className="title-content fw-7 letter-spacing-1 wow fadeInUp"
                data-wow-delay="0.2s"
                style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  marginBottom: '20px',
                  lineHeight: '1.3'
                }}
              >
                Master AI, Blockchain & <br />
                Data Visualisation
              </h2>
              <p className="text-content wow fadeInUp" data-wow-delay="0.3s" style={{
                fontSize: '16px',
                color: '#6b7280',
                lineHeight: '1.7',
                marginBottom: '16px'
              }}>
                {isLoading ? (
                  "Mentors supporting learners globally with practical guidance and insight. Build practical knowledge across technology and data fields through structured projects and guided programs."
                ) : (
                  `Mentors supporting learners across ${userCountry} with practical guidance and insight. Build practical knowledge across technology and data fields through structured projects and guided programs.`
                )}
              </p>
              <div className="counter style-2">
                <div
                  className="number-counter wow fadeInUp"
                  data-wow-delay="0.3s"
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  <p style={{ fontSize: '15px', color: '#4b5563', fontWeight: '500' }}>Industry Instructors</p>
                </div>
                <div
                  className="number-counter wow fadeInUp"
                  data-wow-delay="0.35s"
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                      2,500
                    </span>
                    +
                  </div>
                  <p style={{ fontSize: '15px', color: '#4b5563', fontWeight: '500' }}>Active Learners</p>
                </div>
                <div
                  className="number-counter wow fadeInUp"
                  data-wow-delay="0.45s"
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  <p style={{ fontSize: '15px', color: '#4b5563', fontWeight: '500' }}>Core Tracks</p>
                </div>
                <div
                  className="number-counter wow fadeInUp"
                  data-wow-delay="0.5s"
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                  <div className="counter-content">
                    <span
                      className="number"
                      data-speed={2500}
                      data-to={100}
                      data-inviewport="yes"
                    >
                      100
                    </span>
                    +
                  </div>
                  <p style={{ fontSize: '15px', color: '#4b5563', fontWeight: '500' }}>Hands-On Projects</p>
                </div>
              </div>
              <a
                href="/mentorship"
                className="wow fadeInUp relative flex items-center gap-1 bg-[#000000] px-8 border-2 border-[#000000] text-base rounded-xl font-semibold text-white cursor-pointer overflow-hidden transition-all duration-600 ease-in-out hover:text-white hover:rounded-3xl group hover:transition-all hover:duration-700"
                data-wow-delay="0.6s"
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
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-[#1f2937] rounded-full opacity-0 transition-all duration-700 ease-in-out group-hover:w-[270px] group-hover:h-[270px] group-hover:opacity-100 z-[0]"
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
