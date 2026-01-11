"use client";
import { brandLogos } from "@/data/brands";
import React, { useState } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import ModalVideo from "react-modal-video";
export default function Hero() {
  const [isOpen, setOpen] = useState(false);
  
  // Add global style override for swiper backgrounds
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .page-title-home2,
      .page-title-home2 *:not(.tf-btn):not(span):not(i),
      .wrap-brand,
      .wrap-brand *,
      .slide-brand,
      .slide-brand *,
      .swiper-container,
      .swiper-wrapper,
      .swiper-slide,
      .slogan-logo {
        background: #fff !important;
        background-color: #fff !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  
  const options = {
    spaceBetween: 30,
    slidesPerView: 2,
    observer: true,
    observeParents: true,
    loop: true,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    speed: 10000,
    breakpoints: {
      450: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      768: {
        slidesPerView: 4,
        spaceBetween: 30,
      },
      868: {
        slidesPerView: 5,
        spaceBetween: 30,
      },
      1400: {
        slidesPerView: 6,
        spaceBetween: 90,
      },
    },
  };
  return (
    <>
      <div className="page-title-home2" style={{ background: '#fff !important', backgroundColor: '#fff' }}>
        <div className="tf-container" style={{ background: '#fff' }}>
          <div className="row items-center">
            <div className="col-lg-6">
              <div className="content">
                <h1 className="fw-7 wow fadeInUp" data-wow-delay="0.2s" style={{ 
                  fontSize: '64px', 
                  lineHeight: '1.2', 
                  marginBottom: '24px',
                  color: '#1f2937'
                }}>
                  Get <span style={{ 
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: '700'
                  }}>250+</span> Best Online Training From <span style={{ fontFamily: 'Nasalization, sans-serif' }}>DAGARMY</span>
                </h1>
                <h6 className="wow fadeInUp" data-wow-delay="0.3s" style={{
                  fontSize: '18px',
                  lineHeight: '1.6',
                  color: '#4b5563',
                  marginBottom: '32px',
                  fontWeight: '400'
                }}>
                  Start, switch, or advance your career with tech focussed courses, Professional Certificates, as we Build a Global Army of Future-Ready Tech Leaders.
                </h6>
                <div className="bottom-btns" style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap', marginTop: '80px' }}>
                  <a
                    href="#"
                    className="tf-btn wow fadeInUp"
                    data-wow-delay="0.4s"
                    style={{
                      padding: '14px 32px',
                      background: '#1e293b',
                      color: '#fff !important',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span style={{ color: '#fff' }}>Get Started</span>
                    <i className="icon-arrow-top-right" style={{ color: '#fff' }} />
                  </a>
                  <a
                    href="#"
                    style={{
                      padding: '14px 32px',
                      background: '#fff',
                      color: '#8b5cf6',
                      border: '2px solid #8b5cf6',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    Explore courses
                    <i className="icon-arrow-top-right" />
                  </a>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} style={{ color: '#8b5cf6', fontSize: '16px' }}>★</span>
                      ))}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', whiteSpace: 'nowrap' }}>
                      35k+ happy students
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div style={{
                width: '100%',
                height: '500px',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid #e5e7eb',
                position: 'relative'
              }}>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                >
                  <source src="/images/courses/hero.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
          <div className="wrap-brand" style={{ background: '#fff !important', backgroundColor: '#fff', padding: '40px 0' }}>
            <Swiper
              {...options}
              modules={[Autoplay]}
              className="slide-brand style-2 swiper-container"
              style={{ background: '#fff' }}
            >
              {brandLogos.map((elm, i) => (
                <SwiperSlide key={i} className="swiper-slide" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="slogan-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60px' }}>
                    <Image
                      className="lazyload"
                      src={elm.imgSrc}
                      data-=""
                      alt={elm.alt}
                      width={elm.width}
                      height={elm.height}
                      style={{ objectFit: 'contain', maxHeight: '50px', width: 'auto' }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
      <ModalVideo
        channel="youtube"
        youtube={{ mute: 0, autoplay: 0 }}
        isOpen={isOpen}
        videoId="MLpWrANjFbI"
        onClose={() => setOpen(false)}
      />{" "}
    </>
  );
}
