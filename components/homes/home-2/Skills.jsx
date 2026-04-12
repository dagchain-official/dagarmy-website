"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Skills.module.css";
import "./Skills.global.css";

const skills = [
  "Intelligent Systems and Decision Tools",
  "Distributed Ledger Technology",
  "Cyber Security",
  "Data Visualisation",
  "Predictive Modeling Concepts",
  "Smart Contracts",
  "Cloud Computing",
  "Web3 Development",
  "Python Programming",
];

export default function Skills() {
  const [currentCycle, setCurrentCycle] = useState(0);

  // Auto-rotate through cycles every 2 seconds on mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCycle((prev) => (prev + 1) % 3); // 3 cycles: 0, 1, 2
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <section className="section-search-tags tf-spacing-11" style={{ background: '#ffffff', paddingTop: '40px', paddingBottom: '40px' }}>
      <style>{`
        .skills-heading { font-size: clamp(24px, 5vw, 36px); }
      `}</style>
      <div className="tf-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div className="row">
          <div className="col-12">
            <div className="heading-section text-center" style={{ marginBottom: '48px' }}>
              <h2 
                className="font-outfit wow fadeInUp skills-heading" 
                data-wow-delay="0.1s"
                style={{
                  fontWeight: '700',
                  color: '#1a1a1a',
                  marginBottom: '20px',
                  lineHeight: '1.3'
                }}
              >
                <span className={styles['heading-line-1']}>Build Skills That Stay Relevant</span>
                <br />
                <span className={styles['heading-line-2']}>Build Your Army</span>
              </h2>
              <div className="sub fs-15 wow fadeInUp" data-wow-delay="0.2s" style={{
                fontSize: '16px',
                color: '#6b7280',
                maxWidth: '800px',
                margin: '0 auto 16px',
                lineHeight: '1.7'
              }}>
                Learning matters when it connects to outcomes. DAG Army focuses on skills that are practiced, refined and strengthened through regular participation. Members learn how systems, data and platforms operate together in real working environments.
              </div>
              <div className="sub fs-15 wow fadeInUp" data-wow-delay="0.25s" style={{
                fontSize: '16px',
                color: '#6b7280',
                maxWidth: '800px',
                margin: '0 auto',
                lineHeight: '1.7'
              }}>
                This is a space for learners who want steady progress, clarity and confidence while building skills that remain useful through 2026 and beyond.
              </div>
            </div>
            <div
              className={`${styles['skills-grid']} wow fadeInUp`}
              data-wow-delay="0.3s"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px'
              }}
            >
              <div className={styles['skills-slider-track']}>
                {skills.map((skill, index) => {
                  const cardCycle = Math.floor(index / 3);
                  const isVisible = cardCycle === currentCycle;
                  return (
                <div
                  key={index}
                  className={`${styles['skill-card']} ${isVisible ? styles['visible'] : ''}`}
                  data-cycle={cardCycle}
                  data-visible={isVisible}
                  style={{
                    background: '#fafafa',
                    borderRadius: '12px',
                    padding: '20px 24px',
                    border: '1px solid #f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.03) 100%)';
                    e.currentTarget.style.borderColor = '#000000';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#fafafa';
                    e.currentTarget.style.borderColor = '#f0f0f0';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#000000',
                    flexShrink: 0
                  }} />
                  <span style={{
                    fontSize: '15px',
                    fontWeight: '500',
                    color: '#1a1a1a'
                  }}>
                    {skill}
                  </span>
                </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
