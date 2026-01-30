import React from "react";
import Image from "next/image";
export default function OurVisions() {
  return (
    <section className="section-vison tf-spacing-8 pt-0 page-about" style={{ background: '#ffffff', paddingTop: '60px', paddingBottom: '60px' }}>
      <div className="tf-container">
        <div className="row align-items-center">
          <div className="col-lg-7">
            <div
              className="wow fadeInLeft"
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.1)',
                maxHeight: '500px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Image
                className="lazyload"
                data-src="/images/about  us/herosectionimages/imageabout.png"
                alt="DAGARMY Training Ground - Future Tech Leaders"
                src="/images/about  us/herosectionimages/imageabout.png"
                width={1372}
                height={1101}
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                  maxHeight: '500px'
                }}
              />
            </div>
          </div>
          <div className="col-lg-5">
            <div className="content">
              <div className="box-sub-tag wow fadeInUp" style={{
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
                  border: '1.5px solid rgba(139, 92, 246, 0.2)'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="#1f2937" strokeWidth="2" />
                    <circle cx="12" cy="12" r="6" stroke="#1f2937" strokeWidth="2" />
                    <circle cx="12" cy="12" r="2" fill="#1f2937" />
                  </svg>
                </div>
                <div className="sub-tag-title">
                  <p style={{ margin: 0, fontWeight: '600', fontSize: '15px', color: '#1f2937' }}>How We Operate</p>
                </div>
              </div>
              <h2 className="fw-7 font-cardo wow fadeInUp">
                The Training Ground for Future Tech Leaders
              </h2>
              <p className="text-content wow fadeInUp">
                DAGARMY is a community-driven ecosystem where rank is earned through skill. We are the direct link between hidden talent in small towns and global tech giants.
              </p>
              <ul className="list">
                <li className="item wow fadeInUp">
                  <strong>A Training Camp:</strong> We teach practical, "battle-ready" skills for the 2026 economy—from AI to Blockchain security.
                </li>
                <li className="item wow fadeInUp">
                  <strong>A Launchpad:</strong> We provide mentorship and strategic guidance to turn prototypes into products and ideas into startups.
                </li>
                <li className="item wow fadeInUp">
                  <strong>A Bridge:</strong> We vet our "Soldiers" through real-world challenges so companies hire proven excellence.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
