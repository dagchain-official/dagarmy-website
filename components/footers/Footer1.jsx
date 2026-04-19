"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import emailjs from "@emailjs/browser";
import { useRef, useState } from "react";
import { menuItems, socialLinks } from "@/data/footerLinks";
import "./Footer1.css";

export default function Footer1({ parentClass = "footer" }) {
  const formRef = useRef();
  const [success, setSuccess] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };

  const sendMail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm("service_noj8796", "template_fs3xchn", formRef.current, {
        publicKey: "iG4SCmR-YtJagQ4gV",
      })
      .then((res) => {
        if (res.status === 200) {
          setSuccess(true);
          handleShowMessage();
          formRef.current.reset();
        } else {
          setSuccess(false);
          handleShowMessage();
        }
      });
  };
  return (
    <>
      <footer className="footer-section" style={{
        background: '#ffffff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Main Footer Container */}
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '60px 40px 40px 40px'
        }}>
          {/* Top Section: Logo + Contact Info on Left, Link Columns on Right */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '40px',
            marginBottom: '48px'
          }}>
            {/* Logo and Contact Info Section */}
            <div>
              <Link href="/" style={{ display: 'inline-block', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Image
                    alt="DAGARMY"
                    src="/images/logo/logo.png"
                    width={48}
                    height={48}
                  />
                  <span style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#000000',
                    fontFamily: 'Nasalization, sans-serif',
                    letterSpacing: '0.5px'
                  }}>
                    DAGARMY
                  </span>
                </div>
              </Link>
              
              {/* Tagline */}
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.7',
                marginTop: '16px',
                marginBottom: '20px',
                maxWidth: '280px'
              }}>
                DAG Army brings together learners, builders, and professionals who want skills that lead to real outcomes.
              </p>

              {/* Email */}
              <a href="mailto:careers@dagchain.network" style={{
                fontSize: '15px',
                fontWeight: '500',
                color: '#374151',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'mailBounce 2s ease-in-out infinite'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                careers@dagchain.network
              </a>
              <style>{`
                @keyframes mailBounce {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-3px); }
                }
              `}</style>
            </div>

            {/* Company Links */}
            <div>
              <h5 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#000000',
                marginBottom: '20px',
                letterSpacing: '-0.01em'
              }}>
                Company
              </h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {menuItems[0].links.map((link, index) => (
                  <li key={index} style={{ marginBottom: '12px' }}>
                    {link.soon ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', opacity: 0.45, cursor: 'default' }}>
                        <span style={{ fontSize: '15px', fontWeight: '500', color: '#374151' }}>{link.name}</span>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#6366f1', background: 'rgba(99,102,241,0.1)', borderRadius: '5px', padding: '2px 6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Soon</span>
                      </span>
                    ) : (
                      <Link href={link.href} style={{
                        fontSize: '15px', fontWeight: '500', color: '#374151',
                        textDecoration: 'none', transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Advance Links — active links only */}
            <div>
              <h5 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#000000',
                marginBottom: '20px',
                letterSpacing: '-0.01em'
              }}>
                Advance
              </h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {menuItems[1].links.filter(l => !l.soon).map((link, index) => (
                  <li key={index} style={{ marginBottom: '12px' }}>
                    <Link href={link.href} style={{
                      fontSize: '15px', fontWeight: '500', color: '#374151',
                      textDecoration: 'none', transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h5 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#000000',
                marginBottom: '20px',
                letterSpacing: '-0.01em'
              }}>
                Legal
              </h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {menuItems[2].links.map((link, index) => (
                  <li key={index} style={{ marginBottom: '12px' }}>
                    <Link href={link.href} style={{
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#374151',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Coming Soon Column */}
            <div>
              <h5 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#000000',
                marginBottom: '20px',
                letterSpacing: '-0.01em'
              }}>
                Coming Soon
              </h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  { name: 'Courses', href: '/courses' },
                  { name: 'Mentorship', href: '/mentorship' },
                  { name: 'Hackathons', href: '/hackathons' },
                  { name: 'Events', href: '/events' },
                  { name: 'Become a Trainer', href: '/trainer' },
                ].map((item, i) => (
                  <li key={i} style={{ marginBottom: '12px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      opacity: 0.45,
                      cursor: 'default',
                    }}>
                      <span style={{ fontSize: '15px', fontWeight: '500', color: '#374151' }}>
                        {item.name}
                      </span>
                      <span style={{
                        fontSize: '12px', fontWeight: '700',
                        color: '#6366f1',
                        background: 'rgba(99,102,241,0.1)',
                        borderRadius: '5px',
                        padding: '2px 6px',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                      }}>Soon</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section: Social Icons and Newsletter */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '40px'
          }}>
            {/* Social Media Icons */}
            <div style={{
              display: 'flex',
              gap: '16px'
            }}>
              {socialLinks.map((link, index) => {
                const getSocialIcon = (name) => {
                  switch(name) {
                    case 'Facebook':
                      return (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                      );
                    case 'X':
                      return (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                          <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
                        </svg>
                      );
                    case 'Instagram':
                      return (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      );
                    case 'LinkedIn':
                      return (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                          <rect x="2" y="9" width="4" height="12"></rect>
                          <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                      );
                    case 'YouTube':
                      return (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                        </svg>
                      );
                    case 'TikTok':
                      return (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                        </svg>
                      );
                    default:
                      return null;
                  }
                };

                return (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.name}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#000000',
                      transition: 'all 0.3s ease',
                      textDecoration: 'none',
                      transform: 'translateY(0)',
                      boxShadow: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 92, 255, 0.3)';
                      e.currentTarget.style.background = '#f3f4f6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.background = '#f3f4f6';
                    }}
                  >
                    {getSocialIcon(link.name)}
                  </a>
                );
              })}
            </div>

            {/* Newsletter Subscribe */}
            <div style={{ flex: 1, maxWidth: '400px' }}>
              <form
                onSubmit={sendMail}
                ref={formRef}
                style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center'
                }}
              >
                <input
                  type="email"
                  placeholder="Subscribe to newsletter"
                  name="email"
                  required
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    fontSize: '14px',
                    color: '#1f2937',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = '1px solid #000000';
                    e.currentTarget.style.background = '#ffffff';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = '1px solid #e5e7eb';
                    e.currentTarget.style.background = '#f9fafb';
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#ffffff',
                    background: '#000000',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#1f2937'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#000000'}
                >
                  Subscribe
                </button>
              </form>
              {showMessage && (
                <p style={{
                  fontSize: '12px',
                  marginTop: '8px',
                  color: success ? '#10b981' : '#ef4444'
                }}>
                  {success ? 'Successfully subscribed!' : 'Something went wrong'}
                </p>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* Backdrop DAGARMY Text */}
      <div style={{
        background: '#ffffff',
        padding: '40px 0',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        <div style={{
          fontSize: 'clamp(80px, 15vw, 180px)',
          fontWeight: '900',
          color: '#f3f4f6',
          fontFamily: 'Nasalization, sans-serif',
          letterSpacing: '0.05em',
          lineHeight: '1',
          userSelect: 'none',
          pointerEvents: 'none'
        }}>
          DAGARMY
        </div>
      </div>
    </>
  );
}
