"use client";
import React from "react";
import Link from "next/link";

export default function NextPhase() {
  return (
    <section style={{
      background: '#000000',
      paddingTop: '80px',
      paddingBottom: '80px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="tf-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 1 }}>
        <div className="row">
          <div className="col-12">
            <div style={{ textAlign: 'center' }}>
              <div 
                className="wow fadeInUp" 
                data-wow-delay="0.1s"
                style={{
                  display: 'inline-block',
                  padding: '8px 20px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  marginBottom: '24px'
                }}
              >
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffffff',
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}>
                  STEP INTO YOUR NEXT PHASE
                </span>
              </div>
              
              <h2 
                className="wow fadeInUp" 
                data-wow-delay="0.2s"
                style={{
                  fontSize: '42px',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '24px',
                  lineHeight: '1.3'
                }}
              >
                Your Next Move Starts Here
              </h2>
              
              <p 
                className="wow fadeInUp" 
                data-wow-delay="0.3s"
                style={{
                  fontSize: '18px',
                  color: 'rgba(255, 255, 255, 0.95)',
                  maxWidth: '700px',
                  margin: '0 auto 32px',
                  lineHeight: '1.8',
                  fontWeight: '500'
                }}
              >
                Waiting does not create progress. Choosing to act does.
              </p>

              <div 
                className="wow fadeInUp" 
                data-wow-delay="0.35s"
                style={{
                  maxWidth: '900px',
                  margin: '0 auto 40px',
                  padding: '32px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <p style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.8',
                  marginBottom: '16px'
                }}>
                  People from <strong>India</strong> are already building skills with intention. Professionals across <strong>India</strong> are giving new definition to their direction. Learners from <strong>India</strong> securing steady growth commitment through <strong>2026</strong> and beyond.
                </p>
                <p style={{
                  fontSize: '17px',
                  color: '#ffffff',
                  lineHeight: '1.8',
                  margin: 0,
                  fontWeight: '600'
                }}>
                  DAG Army is where effort is respected, learning stays practical and consistency leads somewhere real.
                </p>
              </div>

              <Link
                href="#"
                className="wow fadeInUp"
                data-wow-delay="0.4s"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '16px 40px',
                  background: '#ffffff',
                  color: '#000000',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '17px',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  textDecoration: 'none',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.2)';
                  e.currentTarget.style.background = '#f5f3ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                  e.currentTarget.style.background = '#ffffff';
                }}
              >
                Join DAG Army in India
                <i className="icon-arrow-top-right" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          right: '-5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)'
        }} />
      </div>
    </section>
  );
}
