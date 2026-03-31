"use client";
import { useState } from "react";
import { Navigation, Thumbs, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// Builder testimonials data
const builders = [
  {
    id: 1,
    name: "Arjun Mehta",
    role: "AI Startup Builder",
    testimonial: "UDAAN didn't just teach me—it forced me to ship. I went from concept to working AI prototype in 6 weeks. The structured feedback from mentors and the accountability within the cohort made execution inevitable."
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Founder Track Member",
    testimonial: "I validated my AI product with 12 real users before Demo Day. The mentor review sessions were brutal but necessary. UDAAN teaches you that ideas mean nothing without execution proof."
  },
  {
    id: 3,
    name: "Rohan Desai",
    role: "Prototype Builder",
    testimonial: "The difference between UDAAN and other programs? Here, you build or you're out. I shipped my first AI workflow in week 3. By week 8, I had paying beta users. This ecosystem rewards action."
  },
  {
    id: 4,
    name: "Ananya Iyer",
    role: "Lieutenant Rank",
    testimonial: "UDAAN gave me what I needed most: a disciplined cohort and structured execution checkpoints. I transitioned from consuming AI content to building real startup systems. My MVP is live and generating revenue."
  },
  {
    id: 5,
    name: "Vikram Singh",
    role: "Demo Day Finalist",
    testimonial: "The selection process is tough, but that's the point. By the time I reached Demo Day Finals, I had a functional prototype, documented market testing, and 10 validation conversations. Investors noticed."
  },
  {
    id: 6,
    name: "Neha Kapoor",
    role: "AI Product Validator",
    testimonial: "UDAAN forced me to test my assumptions. The mentor feedback was direct: prove it or pivot. I ran 15 user interviews, iterated 3 times, and found real product-market signals. That clarity is priceless."
  },
  {
    id: 7,
    name: "Aditya Rao",
    role: "Soldier to Lieutenant",
    testimonial: "I entered as a Soldier with just an idea. The structured preparation phase taught me to build, not just plan. Six months later, I'm a Lieutenant with a working AI product and early traction."
  },
  {
    id: 8,
    name: "Ishita Gupta",
    role: "Cohort Founder",
    testimonial: "The cohort accountability is real. You see other builders shipping, and it pushes you to execute faster. I launched my AI SaaS prototype in 8 weeks because I couldn't afford to fall behind."
  },
  {
    id: 9,
    name: "Karan Malhotra",
    role: "Pre-Seed Grant Recipient",
    testimonial: "UDAAN doesn't hand out participation trophies. I earned my Pre-Seed Grant by demonstrating execution: functional prototype, user validation, and scalability logic. The filtration process works."
  },
  {
    id: 10,
    name: "Sneha Reddy",
    role: "AI Startup Founder",
    testimonial: "The mentorship here isn't about motivation—it's about execution guidance. My mentor helped me refine my AI workflow, identify real use cases, and build investor-grade clarity. I'm now fundraising."
  },
  {
    id: 11,
    name: "Rahul Verma",
    role: "Builder Track Member",
    testimonial: "UDAAN taught me that building in public creates accountability. I shared my progress weekly, received feedback from other founders, and iterated faster than I ever could alone. The ecosystem works."
  },
  {
    id: 12,
    name: "Divya Nair",
    role: "Validation Stage Builder",
    testimonial: "I came in with an AI idea. UDAAN made me prove it. I built a prototype, tested it with real users, documented feedback, and iterated. Now I have a validated product, not just a concept."
  }
];

export default function BuilderTestimonialsSection() {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  const swiperOptions = {
    slidesPerView: 1,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    speed: 800,
    effect: 'slide' as const,
  };

  const swiperOptions2 = {
    spaceBetween: 80,
    slidesPerView: 5,
    centeredSlides: true,
    loop: true,
    slideToClickedSlide: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    speed: 800,
    breakpoints: {
      0: {
        slidesPerView: 3,
        spaceBetween: 15,
      },
      450: {
        slidesPerView: 3,
        spaceBetween: 15,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 15,
      },
      868: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      1400: {
        slidesPerView: 5,
      },
    },
    navigation: {
      nextEl: ".builder-swiper-button-next",
      prevEl: ".builder-swiper-button-prev",
    },
  };

  return (
    <section style={{ background: '#ffffff', paddingTop: 80, paddingBottom: 80 }}>
      <div className="udaan-testimonials-wrap" style={{ margin: '0 auto', padding: '0 20px' }}>
        
        {/* Section Header */}
        <div style={{ marginBottom: 60, textAlign: 'center' }}>
          <h2
            style={{
              fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
              fontWeight: 700,
              fontSize: 'clamp(32px, 4vw, 42px)',
              color: '#0c0c14',
              marginBottom: 12,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
            }}
          >
            Builder Execution Stories
          </h2>
          <p
            style={{
              fontSize: 16,
              color: '#5a5a72',
              maxWidth: 700,
              margin: '0 auto',
              lineHeight: 1.6,
              fontWeight: 500,
            }}
          >
            Real outcomes from founders who chose action over observation inside the UDAAN ecosystem.
          </p>
        </div>

        {/* Carousel Gallery */}
        <div style={{ position: 'relative' }}>
          {/* Navigation Arrows */}
          <div className="builder-swiper-button-prev" style={{ 
            position: 'absolute',
            left: -60,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            cursor: 'pointer',
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}>
            <svg width={35} height={34} viewBox="0 0 35 34" fill="none">
              <path d="M35 16.9832H2.02708" stroke="#0c0c14" />
              <path d="M8.96808 24.7926C7.02916 20.5253 5.49308 18.7339 1.66599 16.9949C5.57849 15.0692 7.09716 13.2712 8.96808 9.17383" stroke="#0c0c14" />
            </svg>
          </div>

          <div className="builder-swiper-button-next" style={{ 
            position: 'absolute',
            right: -60,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            cursor: 'pointer',
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}>
            <svg width={35} height={34} viewBox="0 0 35 34" fill="none">
              <path d="M0 16.9832H32.9729" stroke="#0c0c14" />
              <path d="M26.0319 24.7926C27.9708 20.5253 29.5069 18.7339 33.334 16.9949C29.4215 15.0692 27.9028 13.2712 26.0319 9.17383" stroke="#0c0c14" />
            </svg>
          </div>

          {/* Profile Thumbnails Swiper */
          /* udaan-testimonials-nav wraps arrows + swipers */}
          <Swiper
            {...swiperOptions2}
            modules={[Navigation, Thumbs, Autoplay]}
            className="builder-gallery-thumbs"
            onSwiper={setThumbsSwiper}
            style={{ marginBottom: 40 }}
          >
            {builders.map((builder) => (
              <SwiperSlide key={builder.id}>
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: '10px',
                    background: `linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 32,
                    fontWeight: 700,
                    color: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {builder.name.charAt(0)}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Testimonial Content Swiper */}
          <Swiper
            {...swiperOptions}
            modules={[Thumbs, Autoplay]}
            thumbs={{ swiper: thumbsSwiper }}
            allowTouchMove={false}
            loopAdditionalSlides={7}
            className="builder-gallery-slider"
          >
            {builders.map((builder) => (
              <SwiperSlide key={builder.id}>
                <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
                  {/* Builder Info */}
                  <div style={{ marginBottom: 20 }}>
                    <h4 style={{ 
                      fontSize: 22,
                      fontWeight: 700,
                      color: '#0c0c14',
                      marginBottom: 6,
                    }}>
                      {builder.name}
                    </h4>
                    <p style={{ 
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#6366f1',
                      marginBottom: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      {builder.role}
                    </p>
                    {/* Star Rating */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 12 }}>
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#0c0c14">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                    </div>
                  </div>

                  {/* Testimonial Text */}
                  <div style={{
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: 12,
                    padding: '32px 40px',
                    position: 'relative',
                  }}>
                    <p style={{
                      fontSize: 17,
                      lineHeight: 1.7,
                      color: '#374151',
                      fontWeight: 500,
                      marginBottom: 0,
                    }}>
                      {builder.testimonial}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
