"use client";
import React from "react";
import Image from "next/image";

export default function Banner() {
  return (
    <section className="section-start-banner tf-spacing-1 pt-0" style={{ background: '#fafafa', paddingTop: '80px', paddingBottom: '80px' }}>
      <div className="tf-container">
        <div className="row">
          <div className="col-lg-12">
            <div
              className="main-section wow fadeInUp"
              style={{
                borderRadius: '20px',
                padding: '80px 60px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* Background Image */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 0
              }}>
                <Image
                  src="/images/about  us/cardbackgorund iamge .png"
                  alt="DAGARMY Background"
                  fill
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                  priority
                />
                {/* Professional gradient overlay for text readability */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(90deg, rgba(5, 8, 20, 0.88) 0%, rgba(5, 8, 20, 0.70) 45%, rgba(5, 8, 20, 0.55) 100%)',
                  zIndex: 1
                }} />
              </div>

              <div className="heading-section style-white mb-0" style={{ position: 'relative', zIndex: 1 }}>
                <h2 className="font-cardo wow fadeInUp" style={{ fontSize: '48px', color: '#ffffff', marginBottom: '25px', lineHeight: '1.3' }}>
                  Join the Army. <br /> Claim Your Future.
                </h2>
                <p className="sub wow fadeInUp" data-wow-delay="0.1s" style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  maxWidth: '800px',
                  margin: '0 auto 40px',
                  fontSize: '17px',
                  lineHeight: '1.7'
                }}>
                  Our vision is a future where "DAGARMY Certified" is the ultimate signal of technical mastery. We are building an army of 1,000,000+ pre-vetted professionals and launching 100+ soldier-led startups every year.
                </p>
              </div>

              {/* Explore Courses Button with exact hero section effect */}
              <a
                href="/course-list"
                className="wow fadeInUp relative inline-flex items-center gap-1 bg-[#1f2937] px-8 border-2 border-[#1f2937] text-base rounded-xl font-semibold text-white cursor-pointer overflow-hidden transition-all duration-600 ease-in-out hover:text-white hover:rounded-3xl group hover:transition-all hover:duration-700"
                data-wow-delay="0.2s"
                style={{
                  textDecoration: 'none',
                  height: '56px',
                  minWidth: '220px',
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 1
                }}
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
                  Join DAG CHAIN
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
