"use client";
import React, { useState } from "react";
import { businessModels } from "@/data/bootcamp";

export default function BusinessModelsGrid() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", ...new Set(businessModels.map(m => m.category))];

  const filteredModels = selectedCategory === "All" 
    ? businessModels 
    : businessModels.filter(m => m.category === selectedCategory);

  return (
    <section style={{ background: '#ffffff', paddingTop: '100px', paddingBottom: '100px' }}>
      <div className="tf-container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <h2 className="font-cardo wow fadeInUp" style={{ fontSize: '40px', marginBottom: '16px', color: '#1f2937', fontWeight: '700' }}>
              20+ AI Business Models
            </h2>
            <p className="wow fadeInUp" data-wow-delay="0.1s" style={{ fontSize: '18px', color: '#6b7280', marginBottom: '40px', lineHeight: '1.6' }}>
              Choose your path—from content creation to automation services, find the AI business model that fits your skills
            </p>
          </div>
        </div>

        <div className="row justify-content-center" style={{ marginBottom: '40px' }}>
          <div className="col-lg-10">
            <div 
              className="wow fadeInUp"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                justifyContent: 'center'
              }}
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    padding: '10px 20px',
                    background: selectedCategory === category ? '#1f2937' : '#ffffff',
                    color: selectedCategory === category ? '#ffffff' : '#4b5563',
                    border: '1px solid',
                    borderColor: selectedCategory === category ? '#1f2937' : '#e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== category) {
                      e.currentTarget.style.borderColor = '#1f2937';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== category) {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="row" style={{ gap: '20px 0' }}>
          {filteredModels.map((model, index) => (
            <div key={model.id} className="col-lg-4 col-md-6">
              <div 
                className="wow fadeInUp"
                data-wow-delay={`${(index % 6) * 0.05}s`}
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '28px',
                  height: '100%',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.borderColor = '#1f2937';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <div style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '16px'
                }}>
                  {model.category}
                </div>

                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  marginBottom: '12px',
                  color: '#1f2937'
                }}>
                  {model.title}
                </h3>

                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  marginBottom: '20px',
                  lineHeight: '1.6'
                }}>
                  {model.description}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingTop: '16px',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    padding: '4px 10px',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6b7280'
                  }}>
                    {model.difficulty}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row justify-content-center" style={{ marginTop: '40px' }}>
          <div className="col-lg-8 text-center">
            <p className="wow fadeInUp" style={{ fontSize: '14px', color: '#9ca3af' }}>
              Income ranges based on student averages. Actual earnings depend on effort, market demand, and chosen niche.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
