"use client";
import { instructors } from "@/data/instractors";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import Image from "next/image";
export default function Instractors() {
  const options = {
    spaceBetween: 25,
    observer: true,
    observeParents: true,
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
  };
  return (
    <section className="section-instructor tf-spacing-3 pt-0" style={{ background: '#ffffff', paddingTop: '80px', paddingBottom: '80px' }}>
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            <div className="heading-section" style={{ marginBottom: '50px' }}>
              <h2 className="fw-7 font-cardo wow fadeInUp" data-wow-delay="0s" style={{ fontSize: '42px', color: '#1f2937', marginBottom: '20px' }}>
                Learn From The Best Instructors
              </h2>
              <div className="flex items-center justify-between flex-wrap gap-10">
                <div className="sub fs-15 wow fadeInUp" data-wow-delay="0.1s" style={{ color: '#6b7280', fontSize: '16px', lineHeight: '1.6' }}>
                  Industry experts and thought leaders teaching cutting-edge tech skills
                </div>
                <Link
                  href={`/mentorship`}
                  className="wow fadeInUp"
                  data-wow-delay="0.2s"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: '#000000',
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  See All Instructors
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </Link>
              </div>
            </div>
            <Swiper
              className="swiper-container slider-courses-5 wow fadeInUp"
              data-wow-delay="0.3s"
              {...options}
              modules={[Navigation, Pagination]}
            >
              {instructors.map((instructor, index) => (
                <SwiperSlide className="swiper-slide" key={index}>
                  <div className="instructors-item hover-img style-column">
                    <div className="image-wrap" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                      <Image
                        className="lazyload"
                        data-src={instructor.imgSrc}
                        alt={instructor.alt}
                        src={instructor.imgSrc}
                        width={520}
                        height={521}
                      />
                    </div>
                    <div className="entry-content">
                      <ul className="entry-meta">
                        <li>
                          <i className="flaticon-user" />
                          {instructor.students} Students
                        </li>
                        <li>
                          <i className="flaticon-play" />
                          {instructor.courses} Course
                        </li>
                      </ul>
                      <h6 className="entry-title">
                        <Link href={`/instructor-single/${instructor.id}`}>
                          {instructor.name}
                        </Link>
                      </h6>
                      <p className="short-description">
                        {instructor.description}
                      </p>
                      <div className="ratings" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                        <div className="number" style={{ fontWeight: '600', fontSize: '15px', color: '#1f2937' }}>{instructor.rating}</div>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i
                              key={star}
                              className="icon-star-1"
                              style={{
                                color: star <= Math.floor(instructor.rating) ? '#1f2937' : '#e5e7eb',
                                fontSize: '14px'
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
