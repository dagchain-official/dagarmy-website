"use client";
import { dagarmyCourses } from "@/data/dagarmy-courses";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useContextElement } from "@/context/Context";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
const categories = [
  "Artificial Intelligence",
  "Blockchain",
  "Data Visualisation",
];
export default function Courses() {
  const { toggleWishlist, isAddedtoWishlist } = useContextElement();
  const [allProducts, setallProducts] = useState(dagarmyCourses);
  const [currentCategory, setCurrentCategory] = useState(categories[0]);
  const [filtered, setFiltered] = useState(allProducts);
  useEffect(() => {
    setFiltered(
      allProducts.filter((elm) =>
        elm.filterCategories.includes(currentCategory)
      )
    );
  }, [currentCategory, allProducts]);

  return (
    <section className="section-popular-course tf-spacing-6 pt-0" style={{ paddingTop: '0 !important' }}>
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            <div className="tabs-with-filter style-small">
              <div className="heading-section">
                <h2
                  className="letter-spacing-1 wow fadeInUp"
                  data-wow-delay="0s"
                >
                  Popular Courses
                </h2>
                <div className="flex items-center justify-between flex-wrap gap-10">
                  <div className="sub fs-15 wow fadeInUp" data-wow-delay="0.2s">
                    Explore our industry-focused training programs
                  </div>
                  <ul
                    className="widget-menu-tab overflow-x-auto wow fadeInUp no-tab"
                    data-wow-delay="0.3s"
                  >
                    {categories.map((category, index) => (
                      <li
                        key={index}
                        onClick={() => setCurrentCategory(category)}
                        className={`item-title ${currentCategory === category ? "active" : ""
                          }`}
                      >
                        {category}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div
                className="widget-content-tab wow fadeInUp"
                data-wow-delay="0.4s"
              >
                <div className="widget-content-inner active">
                  <div style={{ position: 'relative', paddingLeft: '60px', paddingRight: '60px' }}>
                    <Swiper
                      modules={[Navigation, Pagination]}
                      spaceBetween={30}
                      slidesPerView={5}
                      navigation={{
                        prevEl: '.courses-prev',
                        nextEl: '.courses-next',
                      }}
                      pagination={{ clickable: true }}
                      breakpoints={{
                        0: {
                          slidesPerView: 1,
                        },
                        768: {
                          slidesPerView: 2,
                        },
                        1024: {
                          slidesPerView: 3,
                        },
                        1200: {
                          slidesPerView: 4,
                        },
                        1400: {
                          slidesPerView: 5,
                        },
                      }}
                    >
                      {filtered.map((elm, i) => (
                        <SwiperSlide key={i}>
                          <div className="course-item h240 hover-img">
                        <div className="features image-wrap">
                          <Image
                            className="lazyload"
                            alt=""
                            src={elm.imgSrc}
                            width={520}
                            height={380}
                          />
                          <div
                            className={`box-wishlist tf-action-btns ${isAddedtoWishlist(elm.id) ? "active" : ""
                              } `}
                            onClick={() => toggleWishlist(elm.id)}
                          >
                            <i className="flaticon-heart" />
                          </div>
                        </div>
                        <div className="content">
                          <div className="meta">
                            <div className="meta-item">
                              <i className="flaticon-calendar" />
                              <p>{elm.lessons}</p>
                            </div>
                            <a href="#" className="meta-item">
                              <i className="flaticon-user" />
                              <p>{elm.students}</p>
                            </a>
                            <div className="meta-item">
                              <i className="flaticon-clock" />
                              <p>{elm.duration}</p>
                            </div>
                          </div>
                          <h5 className="fw-5 line-clamp-2">
                            <Link href={`/course-single-v1/${elm.id}`}>
                              {elm.title}
                            </Link>
                          </h5>
                          <div className="ratings pb-30">
                            <div className="number">{elm.rating}</div>
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
                            <div className="total">({elm.reviews})</div>
                          </div>
                          <div className="author">
                            By:
                            <a href="#" className="author">
                              {" "}
                              {elm.author}
                            </a>
                          </div>
                          <div className="bottom">
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
                            `}</style>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              {elm.badges && elm.badges.map((badge, idx) => (
                                <div
                                  key={idx}
                                  className="badge-container"
                                >
                                  <Image
                                    src={`/images/badges/${badge}.svg`}
                                    alt={badge}
                                    width={60}
                                    height={60}
                                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                                  />
                                  <span className="tooltip-text">
                                    {badge === 'dag-soldier' ? 'DAG Soldier' : 'DAG Lieutenant'}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <Link
                              href={`/course-single-v1/${elm.id}`}
                              className="tf-btn-arrow"
                            >
                              <span className="fw-5 h6">Enroll Course</span>
                              <i className="icon-arrow-top-right" />
                            </Link>
                          </div>
                        </div>
                      </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    <div className="courses-prev swiper-button-prev" style={{
                      position: 'absolute',
                      left: '0',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '50px',
                      height: '50px',
                      background: '#8b5cf6',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 10,
                      color: '#fff',
                      fontSize: '20px',
                      transition: 'all 0.3s',
                    }}>
                      <i className="icon-arrow-left" />
                    </div>
                    <div className="courses-next swiper-button-next" style={{
                      position: 'absolute',
                      right: '0',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '50px',
                      height: '50px',
                      background: '#8b5cf6',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 10,
                      color: '#fff',
                      fontSize: '20px',
                      transition: 'all 0.3s',
                    }}>
                      <i className="icon-arrow-right" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
