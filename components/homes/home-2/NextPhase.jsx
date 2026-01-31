"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function NextPhase() {
  const [userCountry, setUserCountry] = useState("your country");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Detect user's country using IP geolocation
    const detectCountry = async () => {
      try {
        // Try primary API: ipapi.co
        const response = await fetch('https://ipapi.co/json/', {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Geolocation API response:', data);
        
        if (data && data.country_name) {
          setUserCountry(data.country_name);
          setIsLoading(false);
          return;
        }
        
        // If country_name not found, try alternative API
        throw new Error('Country name not found in response');
        
      } catch (error) {
        console.error('Primary geolocation failed:', error);
        
        // Try fallback API: geolocation-db.com
        try {
          const fallbackResponse = await fetch('https://geolocation-db.com/json/');
          const fallbackData = await fallbackResponse.json();
          console.log('Fallback API response:', fallbackData);
          
          if (fallbackData && fallbackData.country_name) {
            setUserCountry(fallbackData.country_name);
            setIsLoading(false);
            return;
          }
        } catch (fallbackError) {
          console.error('Fallback geolocation also failed:', fallbackError);
        }
        
        // If both APIs fail, use India as default (most common user base)
        console.log('Using default country: India');
        setUserCountry("India");
      } finally {
        setIsLoading(false);
      }
    };

    detectCountry();
  }, []);
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
                  {isLoading ? (
                    "People from around the world are already building skills with intention. Professionals globally are giving new definition to their direction. Learners securing steady growth commitment through 2026 and beyond."
                  ) : (
                    <>
                      People from <strong>{userCountry}</strong> are already building skills with intention. Professionals across <strong>{userCountry}</strong> are giving new definition to their direction. Learners from <strong>{userCountry}</strong> securing steady growth commitment through <strong>2026</strong> and beyond.
                    </>
                  )}
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

              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && window.modal) {
                    window.modal.open();
                  }
                }}
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
                  cursor: 'pointer',
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
                {isLoading ? "Join DAG Army" : `Join DAG Army in ${userCountry}`}
                <i className="icon-arrow-top-right" />
              </button>
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
