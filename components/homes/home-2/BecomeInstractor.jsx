import React from "react";
import Image from "next/image";
import PremiumButton from "./PremiumButton";

export default function BecomeInstractor() {
  return (
    <section className="section-become-instructor tf-spacing-4 pb-0" style={{ paddingTop: '60px' }}>
      <div className="tf-container">
        <div className="row justify-center">
          <div className="col-md-5">
            <div className="image-left">
              <Image
                className="lazyload"
                data-src="/images/Become A Trainer/Trainer.png"
                alt="Become a Trainer - Share Your Expertise in AI, Blockchain, and Data Visualisation"
                src="/images/Become A Trainer/Trainer.png"
                width={841}
                height={1003}
                style={{ objectFit: 'cover', borderRadius: '12px' }}
              />
            </div>
          </div>
          <div className="col-md-5">
            <div className="content-right">
              <div className="content-user wow fadeInUp" data-wow-delay="0s">
                <div className="box-agent style2">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(109, 40, 217, 0.1) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid rgba(139, 92, 246, 0.2)'
                    }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="8" r="6" stroke="#8b5cf6" strokeWidth="2" />
                        <path d="M12 14v8m-4 0h8" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
                        <path d="M9 8l1.5 1.5L13 7" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span style={{ fontWeight: '700', fontSize: '18px', color: '#1f2937' }}>Join Elite Trainers</span>
                  </div>
                </div>
              </div>
              <h2
                className="fw-7 letter-spacing-1 wow fadeInUp"
                data-wow-delay="0.1s"
              >
                Become A Trainer
              </h2>
              <p className="fz-15 wow fadeInUp" data-wow-delay="0.2s">
                Share your expertise in AI, Blockchain, or Data Visualisation with thousands of eager learners worldwide. Join DAGARMY's elite community of industry professionals and thought leaders who are shaping the future of tech education.
              </p>
              <div className="wow fadeInUp" data-wow-delay="0.25s" style={{ marginTop: '20px', marginBottom: '20px' }}>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#8b5cf6', marginRight: '10px', fontSize: '20px' }}>✓</span>
                    <span>Create and monetize your courses on cutting-edge technologies</span>
                  </li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#8b5cf6', marginRight: '10px', fontSize: '20px' }}>✓</span>
                    <span>Access our professional course creation tools and support</span>
                  </li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#8b5cf6', marginRight: '10px', fontSize: '20px' }}>✓</span>
                    <span>Build your personal brand as an industry expert</span>
                  </li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#8b5cf6', marginRight: '10px', fontSize: '20px' }}>✓</span>
                    <span>Earn competitive revenue share from your content</span>
                  </li>
                </ul>
              </div>
              <PremiumButton
                text="Start Teaching Today"
                href="#"
                className="wow fadeInUp"
                data-wow-delay="0.3s"
                style={{ height: '52px', minWidth: '220px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
