"use client";
import { dagarmyCourses } from "@/data/dagarmy-courses";
import React from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import Image from "next/image";
import { useContextElement } from "@/context/Context";
export default function Courses2() {
  const { toggleWishlist, isAddedtoWishlist } = useContextElement();

  const [swiperInstance, setSwiperInstance] = React.useState(null);

  const swiperOptions = {
    spaceBetween: 25,
    observer: true,
    observeParents: true,
    onSwiper: setSwiperInstance,
    breakpoints: {
      425: {
        slidesPerView: 1.5,
        spaceBetween: 15,
      },
      700: {
        slidesPerView: 2.3,
      },
      1000: {
        slidesPerView: 3,
      },
      1440: {
        slidesPerView: 5,
      },
    },
    pagination: {
      el: ".spd3",
      clickable: true,
    },
  };
  return (
    <>
      {/* Consolidated Styles */}
      <style jsx>{`
        .badge-container {
          position: relative;
          display: inline-block;
        }
        .badge-container:hover .tooltip-text {
          visibility: visible !important;
          opacity: 1 !important;
        }
        .badge-container:hover img {
          transform: scale(1.1);
        }
        .tooltip-text {
          visibility: hidden;
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%);
          color: #ffffff;
          text-align: center;
          padding: 8px 14px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
          z-index: 9999;
          opacity: 0;
          transition: opacity 0.3s, visibility 0.3s;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4), 0 0 20px rgba(168, 85, 247, 0.3);
        }
        .tooltip-text::after {
          content: "";
          position: absolute;
          top: -5px;
          left: 50%;
          margin-left: -5px;
          border-width: 0 5px 5px 5px;
          border-style: solid;
          border-color: transparent transparent #7c3aed transparent;
        }
        .spd3 {
          display: flex !important;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 48px !important;
          margin-bottom: 40px !important;
          position: relative !important;
        }
        .spd3 :global(.swiper-pagination-bullet) {
          width: 8px !important;
          height: 8px !important;
          background: #d1d5db !important;
          opacity: 1 !important;
          margin: 0 !important;
          border-radius: 50%;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .spd3 :global(.swiper-pagination-bullet:hover) {
          background: #a55fcbff !important;
          transform: scale(1.2);
        }
        .spd3 :global(.swiper-pagination-bullet-active) {
          width: 24px !important;
          border-radius: 4px !important;
          background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%) !important;
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);
        }
        /* Fix tooltip clipping in Swiper */
        :global(.slider-courses-5) {
          overflow: visible !important;
        }
        :global(.slider-courses-5 .swiper-wrapper) {
          overflow: visible !important;
        }
        :global(.slider-courses-5 .swiper-slide) {
          overflow: visible !important;
        }
      `}</style>
      <section className="tf-spacing-8 section-course">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div className="heading-section">
                <h2 className="fw-7 font-cardo wow fadeInUp" data-wow-delay="0s">
                  Learners Are Viewing
                </h2>
                <div className="flex items-center justify-between flex-wrap gap-10 ">
                  <div className="sub fs-15 wow fadeInUp" data-wow-delay="0.2s">
                    Most popular courses across AI, Blockchain, and Data Visualisation
                  </div>
                  <Link
                    href={`/course-grid-basic`}
                    className="tf-btn-arrow wow fadeInUp"
                    data-wow-delay="0.3s"
                  >
                    Show More Courses <i className="icon-arrow-top-right" />
                  </Link>
                </div>
              </div>
              <div style={{ position: 'relative', padding: '0 60px', overflow: 'visible' }}>
                <Swiper
                  className="swiper-container slider-courses-5 wow fadeInUp"
                  data-wow-delay="0.4s"
                  modules={[Pagination]}
                  {...swiperOptions}
                >
                  {dagarmyCourses.slice(0, 12).map((course, index) => (
                    <SwiperSlide key={index} className="swiper-slide">
                      <div className="course-item hover-img title-small">
                        <div className="features image-wrap">
                          <Image
                            className="lazyload"
                            data-src={course.imgSrc}
                            alt={course.alt || course.title}
                            src={course.imgSrc}
                            width={520}
                            height={380}
                          />
                          {course.tag && (
                            <div className="box-tags">
                              <a href="#" className="item best-seller">
                                {course.tag}
                              </a>
                            </div>
                          )}
                          <div
                            className={`box-wishlist tf-action-btns ${isAddedtoWishlist(course.id) ? "active" : ""
                              } `}
                            onClick={() => toggleWishlist(course.id)}
                          >
                            <i className="flaticon-heart" />
                          </div>
                        </div>
                        <div className="content">
                          <div className="meta">
                            <div className="meta-item">
                              <i className="flaticon-calendar" />
                              <p>{course.lessons}</p>
                            </div>
                            <div className="meta-item">
                              <i className="flaticon-clock" />
                              <p>{course.duration}</p>
                            </div>
                          </div>
                          <h6 className="fw-5 line-clamp-2">
                            <Link href={`/course-single-v1/${course.id}`}>
                              {course.title}
                            </Link>
                          </h6>
                          <div className="ratings pb-30">
                            <div className="number">{course.rating}</div>
                            <i className="icon-star-1" />
                            <i className="icon-star-1" />
                            <i className="icon-star-1" />
                            <i className="icon-star-1" />
                            <svg
                              width={12}
                              height={11}
                              viewBox="0 0 12 11"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3.54831 7.10382L3.58894 6.85477L3.41273 6.67416L1.16841 4.37373L4.24914 3.90314L4.51288 3.86286L4.62625 3.62134L5.99989 0.694982L7.37398 3.62182L7.48735 3.86332L7.75108 3.9036L10.8318 4.37419L8.58749 6.67462L8.41128 6.85523L8.4519 7.10428L8.98079 10.3465L6.24201 8.8325L6.00014 8.69879L5.75826 8.83247L3.01941 10.3461L3.54831 7.10382ZM11.0444 4.15626L11.0442 4.15651L11.0444 4.15626Z"
                                stroke="#131836"
                              />
                            </svg>
                            <div className="total">({course.reviews})</div>
                          </div>
                          <div className="author">
                            By:{" "}
                            <a href="#" className="author">
                              {course.author}
                            </a>
                          </div>
                          <div className="bottom">
                            <Link
                              href={`/course-single-v1/${course.id}`}
                              className="tf-btn-arrow"
                            >
                              <span className="fw-5 fs-15">Enroll Course</span>
                              <i className="icon-arrow-top-right" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>


                <div className="swiper-pagination spd3" />

                <button
                  onClick={() => swiperInstance?.slidePrev()}
                  style={{
                    position: 'absolute',
                    left: '0',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'white',
                    border: '2px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)';
                    e.currentTarget.style.borderColor = '#8b5cf6';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
                    e.currentTarget.querySelector('path').setAttribute('stroke', 'white');
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.querySelector('path').setAttribute('stroke', '#6b7280');
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15L7 10L12 5" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={() => swiperInstance?.slideNext()}
                  style={{
                    position: 'absolute',
                    right: '0',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'white',
                    border: '2px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)';
                    e.currentTarget.style.borderColor = '#8b5cf6';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
                    e.currentTarget.querySelector('path').setAttribute('stroke', 'white');
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.querySelector('path').setAttribute('stroke', '#6b7280');
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 15L13 10L8 5" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
