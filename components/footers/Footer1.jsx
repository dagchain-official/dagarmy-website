"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import emailjs from "@emailjs/browser";
import { useRef, useState } from "react";
import { menuItems, socialLinks } from "@/data/footerLinks";

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
      <footer style={{
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
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '60px',
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
              
              {/* Phone Numbers */}
              <div style={{ marginBottom: '16px' }}>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  lineHeight: '1.7',
                  marginBottom: '4px'
                }}>
                  +1 (555) 789-0123
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  lineHeight: '1.7'
                }}>
                  +44 (20) 7946-0958
                </p>
              </div>

              {/* Address */}
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.7',
                marginBottom: '16px'
              }}>
                Meydan Grandstand, 6th Floor, Meydan Road<br />
                Nad Al Sheba, United Arab Emirates
              </p>

              {/* Email */}
              <a href="mailto:" style={{
                fontSize: '14px',
                color: '#4b5563',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#4b5563'}>
                careers@dagchain.network
              </a>
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
                    <Link href={link.href} style={{
                      fontSize: '14px',
                      color: '#4b5563',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#4b5563'}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Advance Links */}
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
                {menuItems[1].links.map((link, index) => (
                  <li key={index} style={{ marginBottom: '12px' }}>
                    <Link href={link.href} style={{
                      fontSize: '14px',
                      color: '#4b5563',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#4b5563'}>
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
                      fontSize: '14px',
                      color: '#4b5563',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#4b5563'}>
                      {link.name}
                    </Link>
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
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000000',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#000000';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f3f4f6';
                    e.currentTarget.style.color = '#000000';
                  }}
                >
                  <i className={link.icon} style={{ fontSize: '16px' }} />
                </a>
              ))}
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
