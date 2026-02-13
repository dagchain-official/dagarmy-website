"use client";
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Set up the worker using local node_modules
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function PDFViewer() {
  const [pageWidth, setPageWidth] = useState(null);

  // PDF files are numbered 02.pdf through 30.pdf (28 files total)
  const totalPages = 28;
  const pdfFiles = Array.from({ length: totalPages }, (_, i) => {
    const pageNum = i + 2; // Start from 02
    return `/pdfs/rewards/${pageNum.toString().padStart(2, '0')}.pdf`;
  });

  React.useEffect(() => {
    // Set initial width based on container
    const updateWidth = () => {
      const container = document.getElementById('pdf-container');
      if (container) {
        setPageWidth(Math.min(container.offsetWidth - 30, 1050));
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh', padding: '60px 0' }}>
      <div className="tf-container">
        {/* Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '50px'
        }}>
          <h1 style={{
            fontSize: '58px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '16px',
            lineHeight: '1.2',
            letterSpacing: '-0.02em'
          }}>
             <span style={{
              fontFamily: 'Nasalization, sans-serif',
              fontWeight: '700',
              color: '#1f2937'
            }}>DAGARMY REWARD </span> System
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#4b5563',
            margin: 0,
            lineHeight: '1.7',
            fontWeight: '400',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Complete Documentation & Framework
          </p>
        </div>

        {/* Single Seamless PDF Container */}
        <div 
          id="pdf-container"
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e5e7eb',
            padding: '40px 0'
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            {pdfFiles.map((pdfUrl, index) => (
              <div 
                key={index}
                id={`section-${index + 1}`}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '0',
                  borderBottom: index < pdfFiles.length - 1 ? '1px solid #f3f4f6' : 'none'
                }}
              >
                <Document
                  file={pdfUrl}
                  loading={
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '80px 40px',
                      color: '#9ca3af',
                      minHeight: '500px',
                      width: '100%'
                    }}>
                      <svg 
                        width="40" 
                        height="40" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        style={{ animation: 'spin 1s linear infinite' }}
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                      </svg>
                      <p style={{ marginTop: '16px', fontSize: '15px', fontWeight: '500' }}>
                        Loading content...
                      </p>
                    </div>
                  }
                  error={
                    <div style={{
                      padding: '80px 40px',
                      textAlign: 'center',
                      color: '#ef4444',
                      minHeight: '500px',
                      width: '100%'
                    }}>
                      <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                        Failed to load content
                      </p>
                      <p style={{ fontSize: '14px', color: '#9ca3af' }}>
                        Please refresh the page
                      </p>
                    </div>
                  }
                >
                  <Page 
                    pageNumber={1} 
                    width={pageWidth}
                    scale={1.25}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll to Top Button */}
        <div style={{
          marginTop: '50px',
          textAlign: 'center'
        }}>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="back-to-top-btn"
            style={{
              padding: '16px 32px',
              background: '#1f2937',
              color: '#ffffff',
              border: '2px solid #1f2937',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.4s ease',
              boxShadow: '0 4px 12px rgba(31, 41, 55, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(31, 41, 55, 0.3)';
              e.currentTarget.style.background = '#111827';
              e.currentTarget.style.borderColor = '#111827';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(31, 41, 55, 0.2)';
              e.currentTarget.style.background = '#1f2937';
              e.currentTarget.style.borderColor = '#1f2937';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
            <span style={{ letterSpacing: '0.02em' }}>Back to Top</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
