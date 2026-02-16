"use client";
import React, { useState } from "react";
import { faqs } from "@/data/bootcamp";

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div 
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        marginBottom: '12px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        transition: 'all 0.2s ease'
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '24px',
          background: 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#1f2937',
          margin: 0,
          paddingRight: '20px'
        }}>
          {faq.question}
        </h3>
        <div style={{
          width: '28px',
          height: '28px',
          background: isOpen ? '#1f2937' : '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.2s ease'
        }}>
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke={isOpen ? '#ffffff' : '#4b5563'} 
            strokeWidth="2"
            style={{
              transition: 'transform 0.2s ease',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </button>
      
      {isOpen && (
        <div style={{
          padding: '0 24px 24px',
          fontSize: '15px',
          color: '#6b7280',
          lineHeight: '1.6',
          borderTop: '1px solid #e5e7eb',
          paddingTop: '20px',
          marginTop: '-4px'
        }}>
          {faq.answer}
        </div>
      )}
    </div>
  );
}

export default function BootcampFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section style={{ background: '#ffffff', paddingTop: '100px', paddingBottom: '100px' }}>
      <div className="tf-container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <h2 className="font-cardo wow fadeInUp" style={{ fontSize: '40px', marginBottom: '16px', color: '#1f2937', fontWeight: '700' }}>
              Frequently Asked Questions
            </h2>
            <p className="wow fadeInUp" data-wow-delay="0.1s" style={{ fontSize: '18px', color: '#6b7280', marginBottom: '60px', lineHeight: '1.6' }}>
              Everything you need to know about the AI Entrepreneur Bootcamp
            </p>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-10">
            {faqs.map((faq, index) => (
              <div key={index} className="wow fadeInUp" data-wow-delay={`${(index % 5) * 0.05}s`}>
                <FAQItem
                  faq={faq}
                  isOpen={openIndex === index}
                  onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="row justify-content-center" style={{ marginTop: '60px' }}>
          <div className="col-lg-8 text-center">
            <div 
              className="wow fadeInUp"
              style={{
                background: '#f9fafb',
                borderRadius: '12px',
                padding: '40px',
                border: '1px solid #e5e7eb'
              }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#1f2937' }}>
                Still Have Questions?
              </h3>
              <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '24px', lineHeight: '1.6' }}>
                Our team is here to help. Reach out and we'll get back to you within 24 hours.
              </p>
              <a
                href="mailto:support@dagarmy.com"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
                  background: '#1f2937',
                  color: '#ffffff',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#111827';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#1f2937';
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
