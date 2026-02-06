"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Events() {
  const upcomingEvents = [
    {
      id: 1,
      format: "Online",
      date: "Feb 15",
      time: "10:00 am to 4:00 pm",
      title: "Creative Tools Workshop",
      description: "Master modern design and development tools for creative projects",
      delay: "0.1s"
    },
    {
      id: 2,
      format: "Virtual",
      date: "Feb 18",
      time: "2:00 pm to 5:00 pm",
      title: "Distributed Ledger Foundations",
      description: "Understanding blockchain technology and decentralized systems",
      delay: "0.2s"
    },
    {
      id: 3,
      format: "Online",
      date: "Feb 22",
      time: "11:00 am to 3:00 pm",
      title: "Data Visualisation Session",
      description: "Transform complex data into clear, actionable insights",
      delay: "0.3s"
    },
    {
      id: 4,
      format: "Virtual",
      date: "Feb 25",
      time: "9:00 am to 1:00 pm",
      title: "Digital Asset Strategy and Planning",
      description: "Strategic approaches to managing digital assets and portfolios",
      delay: "0.4s"
    },
    {
      id: 5,
      format: "Online",
      date: "Feb 28",
      time: "1:00 pm to 6:00 pm",
      title: "Automation Systems Summit",
      description: "Building intelligent automation for modern workflows",
      delay: "0.5s"
    }
  ];
  return (
    <section className="section-event tf-spacing-11" style={{ background: '#fafafa', paddingTop: '80px', paddingBottom: '80px' }}>
      <div className="tf-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div className="row">
          <div className="col-12">
            <div className="heading-section" style={{ marginBottom: '48px' }}>
              <h2
                className="fw-7 letter-spacing-1 wow fadeInUp"
                data-wow-delay="0.1s"
                style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  marginBottom: '16px',
                  lineHeight: '1.3'
                }}
              >
                Upcoming Events
              </h2>
              <div className="flex items-center justify-between flex-wrap gap-10">
                <div className="sub fs-15 wow fadeInUp" data-wow-delay="0.2s" style={{
                  fontSize: '18px',
                  color: '#6b7280',
                  fontWeight: '400'
                }}>
                  Workshops and Live Sessions
                </div>
              </div>
            </div>
            <div style={{
              display: 'grid',
              gap: '20px'
            }}>
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="wow fadeInUp"
                  data-wow-delay={event.delay}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'stretch',
                    gap: '0',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    overflow: 'hidden',
                    flexWrap: 'wrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
                    e.currentTarget.style.borderColor = '#000000';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                >
                  <div style={{
                    background: '#ffffff',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '100px',
                    borderRight: '1px solid #e5e7eb'
                  }}>
                    <Image
                      src="/calender.gif"
                      alt="Calendar"
                      width={60}
                      height={60}
                      style={{
                        objectFit: 'contain'
                      }}
                      unoptimized
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: '1', minWidth: '300px', padding: '24px' }}>
                    <div style={{ flex: '1' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h3 style={{
                          fontSize: '19px',
                          fontWeight: '600',
                          color: '#1a1a1a',
                          margin: 0,
                          lineHeight: '1.4'
                        }}>
                          {event.title}
                        </h3>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 10px',
                          background: 'rgba(0, 0, 0, 0.08)',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#000000'
                        }}>
                          {event.format}
                        </div>
                      </div>
                      <p style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        margin: '0',
                        lineHeight: '1.5'
                      }}>
                        {event.description}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '24px' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '14px 28px',
                      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
                      color: '#ffffff',
                      borderRadius: '10px',
                      fontWeight: '600',
                      fontSize: '15px',
                      whiteSpace: 'nowrap',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      Coming Soon
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
