"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header2 from "@/components/headers/Header2";

export default function MentorshipComingSoon() {
  const [email, setEmail] = useState("");

  return (
    <>
      <Header2 />
      
      <div
        style={{
          minHeight: '100vh',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          position: 'relative'
        }}
      >

        {/* Main Card */}
        <div style={{
          maxWidth: '650px',
          width: '100%',
          background: '#ffffff',
          borderRadius: '32px',
          padding: '60px 40px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e5e7eb',
          textAlign: 'center',
          position: 'relative'
        }}>
          {/* Logo Section */}
          <div style={{
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <Image
              src="/images/logo/logo.png"
              alt="DAGARMY"
              width={48}
              height={48}
              style={{ borderRadius: '12px' }}
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

          {/* Badge */}
          <div style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: '20px'
          }}>
            WE'RE STILL
          </div>

          {/* Main Heading */}
          <h1 style={{
            fontSize: 'clamp(32px, 6vw, 48px)',
            fontWeight: '800',
            color: '#000000',
            marginBottom: '24px',
            lineHeight: '1.2'
          }}>
            Launching Our <span style={{ fontFamily: 'Nasalization, sans-serif' }}>Mentorship</span> Program.
          </h1>

          {/* Supporting Subtitle */}
          <p style={{
            fontSize: '17px',
            color: '#4b5563',
            lineHeight: '1.65',
            marginBottom: '48px',
            maxWidth: '580px',
            margin: '0 auto 48px auto',
            fontWeight: '400'
          }}>
            A structured mentorship initiative designed to guide builders, professionals, and early-stage innovators through real-world problem-solving and career clarity.
          </p>

          {/* Content Sections */}
          <div style={{
            textAlign: 'left',
            marginBottom: '48px'
          }}>
            {/* Why Mentorship at DAGARMY */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#000000',
                marginBottom: '16px',
                letterSpacing: '-0.02em'
              }}>
                Why Mentorship at DAGARMY
              </h2>
              <p style={{
                fontSize: '15px',
                color: '#4b5563',
                lineHeight: '1.7',
                marginBottom: '12px'
              }}>
                DAGARMY mentorship is <span style={{ fontWeight: '600', color: '#1f2937' }}>not generic advice or motivational coaching</span>. It is a structured guidance program focused on:
              </p>
              <ul style={{
                fontSize: '15px',
                color: '#4b5563',
                lineHeight: '1.9',
                paddingLeft: '20px',
                margin: '0 0 12px 0',
                listStyleType: 'disc'
              }}>
                <li style={{ marginBottom: '6px' }}>Practical decision-making</li>
                <li style={{ marginBottom: '6px' }}>Technical clarity</li>
                <li>Career direction in modern tech ecosystems</li>
              </ul>
              <p style={{
                fontSize: '15px',
                color: '#1f2937',
                lineHeight: '1.7',
                fontWeight: '600'
              }}>
                Mentors are practitioners, not influencers.
              </p>
            </div>

            {/* What the Mentorship Covers */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#000000',
                marginBottom: '16px',
                letterSpacing: '-0.02em'
              }}>
                What the Mentorship Covers
              </h2>
              <ul style={{
                fontSize: '15px',
                color: '#4b5563',
                lineHeight: '1.9',
                paddingLeft: '20px',
                margin: '0',
                listStyleType: 'disc'
              }}>
                <li style={{ marginBottom: '6px' }}>Career roadmap alignment (tech, product, AI, Web3)</li>
                <li style={{ marginBottom: '6px' }}>Project and portfolio reviews</li>
                <li style={{ marginBottom: '6px' }}>System-level thinking and architecture guidance</li>
                <li style={{ marginBottom: '6px' }}>Transition support for students and early professionals</li>
                <li>Strategic feedback on learning paths and execution</li>
              </ul>
            </div>

            {/* Who This Is For */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#000000',
                marginBottom: '16px',
                letterSpacing: '-0.02em'
              }}>
                Who This Is For
              </h2>
              <ul style={{
                fontSize: '15px',
                color: '#4b5563',
                lineHeight: '1.9',
                paddingLeft: '20px',
                margin: '0',
                listStyleType: 'disc'
              }}>
                <li style={{ marginBottom: '6px' }}>Students preparing beyond traditional placements</li>
                <li style={{ marginBottom: '6px' }}>Early professionals stuck in execution-only roles</li>
                <li style={{ marginBottom: '6px' }}>Builders seeking architectural clarity</li>
                <li>Non-technical founders understanding digital systems</li>
              </ul>
            </div>

            {/* Program Structure */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#000000',
                marginBottom: '16px',
                letterSpacing: '-0.02em'
              }}>
                Program Structure (Preview)
              </h2>
              <ul style={{
                fontSize: '15px',
                color: '#4b5563',
                lineHeight: '1.9',
                paddingLeft: '20px',
                margin: '0',
                listStyleType: 'disc'
              }}>
                <li style={{ marginBottom: '6px' }}>1:1 and small-group mentorship sessions</li>
                <li style={{ marginBottom: '6px' }}>Fixed mentorship cycles</li>
                <li style={{ marginBottom: '6px' }}>Clear problem statements per session</li>
                <li style={{ marginBottom: '6px' }}><span style={{ fontWeight: '600', color: '#1f2937' }}>Actionable feedback, not theory</span></li>
                <li>Limited slots to maintain quality</li>
              </ul>
            </div>
          </div>

          {/* CTA Text */}
          <p style={{
            fontSize: '15px',
            color: '#4b5563',
            lineHeight: '1.7',
            marginBottom: '28px',
            textAlign: 'center'
          }}>
            Stay informed. Early access will be announced soon.
          </p>

          {/* Email Input with Notify Button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            maxWidth: '500px',
            width: '100%',
            margin: '0 auto 40px auto'
          }}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1,
                padding: '14px 20px',
                fontSize: '15px',
                color: '#1f2937',
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '50px',
                outline: 'none',
                transition: 'all 0.3s ease'
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
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 28px',
                fontSize: '15px',
                fontWeight: '700',
                color: '#ffffff',
                background: '#000000',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#333333';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#000000';
              }}
            >
              Notify Me
            </button>
          </div>

          {/* Social Links */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px'
          }}>
            {/* Facebook */}
            <a href="#" style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#333333';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#000000';
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            
            {/* Twitter/X */}
            <a href="#" style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#333333';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#000000';
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            
            {/* LinkedIn */}
            <a href="#" style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#333333';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#000000';
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
