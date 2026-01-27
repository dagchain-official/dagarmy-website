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
                      background: 'rgba(0, 0, 0, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid rgba(0, 0, 0, 0.1)'
                    }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="8" r="6" stroke="#000000" strokeWidth="2" />
                        <path d="M12 14v8m-4 0h8" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
                        <path d="M9 8l1.5 1.5L13 7" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span style={{ fontWeight: '700', fontSize: '18px', color: '#1f2937' }}>Join Elite Trainers</span>
                  </div>
                </div>
              </div>
              <h2
                className="fw-7 letter-spacing-1 wow fadeInUp"
                data-wow-delay="0.1s"
                style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  marginBottom: '20px',
                  lineHeight: '1.3'
                }}
              >
                Become A Trainer
              </h2>
              <p className="fz-15 wow fadeInUp" data-wow-delay="0.2s" style={{
                fontSize: '16px',
                color: '#6b7280',
                lineHeight: '1.7',
                marginBottom: '28px'
              }}>
                Share expertise with a global learner base. DAG Army supports professionals who want to teach, guide and build credibility through structured content and learner engagement.
              </p>
              <div className="wow fadeInUp" data-wow-delay="0.25s" style={{ marginTop: '20px', marginBottom: '32px' }}>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '16px', display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#000000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.6' }}>Create and publish skill based programs</span>
                  </li>
                  <li style={{ marginBottom: '16px', display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#000000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.6' }}>Access course creation support</span>
                  </li>
                  <li style={{ marginBottom: '16px', display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#000000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.6' }}>Build a professional identity</span>
                  </li>
                  <li style={{ marginBottom: '16px', display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#000000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.6' }}>Earn revenue through content contribution</span>
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
