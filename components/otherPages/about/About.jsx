import React from "react";
import Image from "next/image";
export default function About() {
  return (
    <section className="flat-about" style={{ background: '#ffffff', paddingTop: '80px', paddingBottom: '60px' }}>
      <div className="tf-container">
        <div className="row">
          <div className="col-lg-7">
            <div className="heading-content">
              <h2 className="font-cardo wow fadeInUp" style={{ marginTop: 0 }}>
                We Are Building a Global Army of "Vibe Coders," Technical Experts, and Visionary Entrepreneurs
              </h2>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="content-right wow fadeInUp" data-wow-delay="0.1s">
              <p>
                At DAGARMY, we believe that brilliance is universal, but opportunity is not. We are not just another EdTech platform—we are a Talent Engagement and Incubation Engine, bridging the gap between hidden talent and global tech giants.
              </p>
            </div>
          </div>
        </div>

        {/* Professional Grid Layout */}
        <div className="row" style={{ marginTop: '50px' }}>
          <div className="col-12">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gridTemplateRows: 'repeat(6, 120px)',
              gap: '20px',
              width: '100%'
            }}>

              {/* Position 1: Top-left wide rectangle (Image 1) */}
              <div
                className="wow fadeInUp"
                data-wow-delay="0.1s"
                style={{
                  gridColumn: '1 / 6',
                  gridRow: '1 / 3',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 20px rgba(0, 0, 0, 0.06)',
                  background: '#f8f9fa'
                }}
              >
                <Image
                  src="/images/about  us/image1.png"
                  alt="DAGARMY Team Collaboration"
                  width={600}
                  height={400}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Position M: Center largest tile (Main Image) */}
              <div
                className="wow fadeInUp"
                data-wow-delay="0.2s"
                style={{
                  gridColumn: '6 / 13',
                  gridRow: '1 / 5',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.08)',
                  background: '#f8f9fa',
                  border: '1px solid rgba(0, 0, 0, 0.05)'
                }}
              >
                <Image
                  src="/images/about  us/herosectionimages/main image .png"
                  alt="DAGARMY Main Vision"
                  width={800}
                  height={600}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Position 2: Bottom-left small square (Image 2) */}
              <div
                className="wow fadeInUp"
                data-wow-delay="0.3s"
                style={{
                  gridColumn: '1 / 4',
                  gridRow: '3 / 5',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 20px rgba(0, 0, 0, 0.06)',
                  background: '#f8f9fa'
                }}
              >
                <Image
                  src="/images/about  us/herosectionimages/image 2.png"
                  alt="DAGARMY Innovation"
                  width={400}
                  height={400}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Position 3: Bottom-left next to Image 2 (Image 3 - using image 5) */}
              <div
                className="wow fadeInUp"
                data-wow-delay="0.4s"
                style={{
                  gridColumn: '4 / 6',
                  gridRow: '3 / 5',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 20px rgba(0, 0, 0, 0.06)',
                  background: '#f8f9fa'
                }}
              >
                <Image
                  src="/images/about  us/herosectionimages/iamge 5.png"
                  alt="DAGARMY Technology"
                  width={400}
                  height={400}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Position 4: Bottom section spanning (Image 4) */}
              <div
                className="wow fadeInUp"
                data-wow-delay="0.5s"
                style={{
                  gridColumn: '1 / 7',
                  gridRow: '5 / 7',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 20px rgba(0, 0, 0, 0.06)',
                  background: '#f8f9fa'
                }}
              >
                <Image
                  src="/images/about  us/herosectionimages/image 4.png"
                  alt="DAGARMY Growth"
                  width={700}
                  height={300}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Position 5: Right bottom section with professional quote card */}
              <div
                className="wow fadeInUp"
                data-wow-delay="0.6s"
                style={{
                  gridColumn: '7 / 13',
                  gridRow: '5 / 7',
                  borderRadius: '16px',
                  background: '#ffffff',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.08)',
                  border: '2px solid rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '50px 40px',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Subtle background pattern */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.01) 100%)',
                  zIndex: 0
                }} />

                {/* Quote icon */}
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.06) 0%, rgba(0, 0, 0, 0.03) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                  </svg>
                </div>

                <p style={{
                  color: '#1f2937',
                  fontSize: '22px',
                  fontWeight: '600',
                  margin: 0,
                  lineHeight: '1.5',
                  fontFamily: 'Cardo, serif',
                  position: 'relative',
                  zIndex: 1
                }}>
                  "No Talent Left Behind.<br />No Territory Left Unreached."
                </p>

                {/* Decorative element */}
                <div style={{
                  width: '60px',
                  height: '3px',
                  background: '#1f2937',
                  borderRadius: '2px',
                  marginTop: '20px',
                  position: 'relative',
                  zIndex: 1
                }} />
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
