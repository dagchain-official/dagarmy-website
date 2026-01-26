"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const dagarmyCategories = [
  {
    title: "Intelligent Systems and No Code Development",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
        <rect x="9" y="9" width="6" height="6"></rect>
        <line x1="9" y1="1" x2="9" y2="4"></line>
        <line x1="15" y1="1" x2="15" y2="4"></line>
        <line x1="9" y1="20" x2="9" y2="23"></line>
        <line x1="15" y1="20" x2="15" y2="23"></line>
        <line x1="20" y1="9" x2="23" y2="9"></line>
        <line x1="20" y1="14" x2="23" y2="14"></line>
        <line x1="1" y1="9" x2="4" y2="9"></line>
        <line x1="1" y1="14" x2="4" y2="14"></line>
      </svg>
    ),
  },
  {
    title: "Creative Tools",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
        <path d="M2 2l7.586 7.586"></path>
        <circle cx="11" cy="11" r="2"></circle>
      </svg>
    ),
  },
  {
    title: "Automation and Agent Systems",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
    ),
  },
  {
    title: "Distributed Ledger Foundations",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
    ),
  },
  {
    title: "Decentralized Finance Markets",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    ),
  },
  {
    title: "Web3 Growth Strategies",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
    ),
  },
  {
    title: "Excel and Data Analysis",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="3" y1="15" x2="21" y2="15"></line>
        <line x1="9" y1="3" x2="9" y2="21"></line>
        <line x1="15" y1="3" x2="15" y2="21"></line>
      </svg>
    ),
  },
  {
    title: "Power BI and Tableau",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
      </svg>
    ),
  },
  {
    title: "Dashboard Design",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9"></rect>
        <rect x="14" y="3" width="7" height="5"></rect>
        <rect x="14" y="12" width="7" height="9"></rect>
        <rect x="3" y="16" width="7" height="5"></rect>
      </svg>
    ),
  },
];

export default function Categories() {
  return (
    <section className="section-categories tf-spacing-1 pt-0" style={{ paddingBottom: '60px' }}>
      <div className="tf-container">
        <div className="heading-section">
          <h2 className="letter-spacing-1 wow fadeInUp" data-wow-delay="0s">
            Top Categories
          </h2>
          <div className="flex items-center justify-between flex-wrap gap-10">
            <div className="sub fs-15 wow fadeInUp" data-wow-delay="0.2s">
              Choose a Direction That Matches Your Goals
            </div>
            <Link
              href={`/categories`}
              className="tf-btn-arrow wow fadeInUp"
              data-wow-delay="0.3s"
            >
              Show More Categories
              <i className="icon-arrow-top-right" />
            </Link>
          </div>
        </div>
        <div className="row">
          {/* Create columns dynamically */}
          {[0, 1, 2].map((colIndex) => (
            <div className="col-lg-4" key={colIndex}>
              <div className="wrap-icon-box" style={{ gap: '20px', display: 'flex', flexDirection: 'column' }}>
                {dagarmyCategories.slice(colIndex * 3, colIndex * 3 + 3).map((elm, i) => (
                  <Link
                    key={i}
                    href={`/categories`}
                    className="icon-box-link wow fadeInUp"
                    data-wow-delay="0.1s"
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <div
                      className="icons-box style-2"
                      style={{
                        padding: '24px',
                        borderRadius: '16px',
                        background: '#fff',
                        border: '1px solid #f3f4f6',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        cursor: 'pointer',
                        transform: 'translateY(0)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#1f2937';
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 12px 20px -5px rgba(31, 41, 55, 0.15)';
                        const h5 = e.currentTarget.querySelector('h5');
                        if (h5) h5.style.color = '#1f2937';
                        const wrap = e.currentTarget.querySelector('.icon-wrapper');
                        if (wrap) wrap.style.background = '#f3f4f6';
                        const svg = e.currentTarget.querySelector('svg');
                        if (svg) svg.style.stroke = '#1f2937';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#f3f4f6';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                        const h5 = e.currentTarget.querySelector('h5');
                        if (h5) h5.style.color = '#1f2937';
                        const wrap = e.currentTarget.querySelector('.icon-wrapper');
                        if (wrap) wrap.style.background = 'rgba(139, 92, 246, 0.05)';
                        const svg = e.currentTarget.querySelector('svg');
                        if (svg) svg.style.stroke = '#6b7280';
                      }}
                    >
                      <div className="icon-wrapper" style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: 'rgba(139, 92, 246, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        flexShrink: 0
                      }}>
                        {elm.icon}
                      </div>
                      <div className="content">
                        <h5 style={{
                          margin: 0,
                          fontSize: '17px',
                          fontWeight: '600',
                          color: '#1f2937',
                          transition: 'color 0.3s ease',
                          lineHeight: '1.4'
                        }}>
                          {elm.title}
                        </h5>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
