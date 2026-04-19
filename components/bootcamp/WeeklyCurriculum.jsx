"use client";
import React, { useState } from "react";
import { weeklyModules } from "@/data/bootcamp";

function WeekModule({ module, isOpen, onToggle }) {
  return (
    <div 
      className="wow fadeInUp"
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        marginBottom: '16px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        transition: 'all 0.2s ease'
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '32px',
          background: 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: '18px',
            fontWeight: '700',
            color: '#1f2937'
          }}>
            {module.week}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Week {module.week}
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px', margin: 0, color: '#1f2937' }}>
              {module.theme}
            </h3>
            <p style={{ fontSize: '15px', color: '#6b7280', margin: 0 }}>
              {module.tagline}
            </p>
          </div>
        </div>
        <div style={{
          width: '32px',
          height: '32px',
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s ease',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          flexShrink: 0
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </button>

      {isOpen && (
        <div style={{ padding: '0 32px 32px', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ paddingTop: '32px' }}>
            <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '32px', lineHeight: '1.6' }}>
              {module.description}
            </p>

            <div style={{ marginBottom: '32px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#1f2937' }}>
                Learning Objectives
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {module.objectives.map((obj, index) => (
                  <li key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    marginBottom: '12px',
                    color: '#4b5563',
                    fontSize: '15px',
                    lineHeight: '1.5'
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2" style={{ marginRight: '12px', marginTop: '2px', flexShrink: 0 }}>
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {obj}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#1f2937' }}>
                Topics Covered
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {module.topics.map((topic, index) => (
                  <div key={index} style={{
                    background: '#f9fafb',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h5 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
                      {topic.title}
                    </h5>
                    {topic.description && (
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
                        {topic.description}
                      </p>
                    )}
                    {topic.items && (
                      <ul style={{ margin: '8px 0 0 0', padding: '0 0 0 20px' }}>
                        {topic.items.map((item, i) => (
                          <li key={i} style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: '#f9fafb',
              padding: '24px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
                <h4 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: '#1f2937' }}>
                  Assignment: {module.assignment.title}
                </h4>
              </div>
              
              {module.assignment.tasks && (
                <ul style={{ margin: '0 0 16px 0', padding: '0 0 0 20px' }}>
                  {module.assignment.tasks.map((task, index) => (
                    <li key={index} style={{ fontSize: '14px', color: '#4b5563', marginBottom: '8px', lineHeight: '1.5' }}>
                      {task}
                    </li>
                  ))}
                </ul>
              )}

              {module.assignment.examples && (
                <div style={{ marginBottom: '16px' }}>
                  <strong style={{ fontSize: '14px', color: '#1f2937', display: 'block', marginBottom: '8px' }}>Examples:</strong>
                  <ul style={{ margin: '0', padding: '0 0 0 20px' }}>
                    {module.assignment.examples.map((example, index) => (
                      <li key={index} style={{ fontSize: '14px', color: '#4b5563', marginBottom: '4px' }}>
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {module.assignment.options && (
                <div style={{ marginBottom: '16px' }}>
                  <strong style={{ fontSize: '14px', color: '#1f2937', display: 'block', marginBottom: '12px' }}>
                    Choose Your Path:
                  </strong>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {module.assignment.options.map((option, index) => (
                      <div key={index} style={{
                        background: '#ffffff',
                        padding: '16px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <strong style={{ fontSize: '14px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                          Option {option.path}: {option.title}
                        </strong>
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                          {option.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Deliverable: {module.assignment.deliverable}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WeeklyCurriculum() {
  const [openWeek, setOpenWeek] = useState(1);

  return (
    <section id="curriculum" className="bootcamp-section" style={{ background: '#ffffff', paddingTop: '100px', paddingBottom: '100px' }}>
      <div className="tf-container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <h2 className="font-cardo wow fadeInUp" style={{ fontSize: '40px', marginBottom: '16px', color: '#1f2937', fontWeight: '700' }}>
              4-Week Curriculum
            </h2>
            <p className="wow fadeInUp" data-wow-delay="0.1s" style={{ fontSize: '18px', color: '#6b7280', marginBottom: '60px', lineHeight: '1.6' }}>
              From discovering opportunities to launching your AI business-everything you need in 4 intensive weeks
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {weeklyModules.map((module) => (
              <WeekModule
                key={module.week}
                module={module}
                isOpen={openWeek === module.week}
                onToggle={() => setOpenWeek(openWeek === module.week ? null : module.week)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
