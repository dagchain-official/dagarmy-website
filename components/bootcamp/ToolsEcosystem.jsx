import React from "react";
import { tools } from "@/data/bootcamp";

export default function ToolsEcosystem() {
  const groupedTools = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {});

  return (
    <section className="bootcamp-section" style={{ background: '#f9fafb', paddingTop: '100px', paddingBottom: '100px' }}>
      <div className="tf-container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <h2 className="font-cardo wow fadeInUp" style={{ fontSize: '40px', marginBottom: '16px', color: '#1f2937', fontWeight: '700' }}>
              No-Code Tools Ecosystem
            </h2>
            <p className="wow fadeInUp" data-wow-delay="0.1s" style={{ fontSize: '18px', color: '#6b7280', marginBottom: '60px', lineHeight: '1.6' }}>
              Master these powerful AI and automation tools-no programming required
            </p>
          </div>
        </div>

        {Object.entries(groupedTools).map(([category, categoryTools], catIndex) => (
          <div key={category} className="row" style={{ marginBottom: catIndex < Object.keys(groupedTools).length - 1 ? '40px' : '0' }}>
            <div className="col-12">
              <div 
                className="wow fadeInUp"
                data-wow-delay={`${catIndex * 0.1}s`}
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '32px',
                  border: '1px solid #e5e7eb'
                }}
              >
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  marginBottom: '24px',
                  color: '#1f2937'
                }}>
                  {category}
                </h3>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '16px'
                }}>
                  {categoryTools.map((tool, index) => (
                    <div
                      key={index}
                      style={{
                        background: '#f9fafb',
                        padding: '20px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#ffffff';
                        e.currentTarget.style.borderColor = '#1f2937';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f9fafb';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                      }}
                    >
                      <h4 style={{
                        fontSize: '15px',
                        fontWeight: '700',
                        marginBottom: '8px',
                        color: '#1f2937'
                      }}>
                        {tool.name}
                      </h4>
                      <p style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        margin: 0,
                        lineHeight: '1.5'
                      }}>
                        {tool.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="row justify-content-center" style={{ marginTop: '60px' }}>
          <div className="col-lg-10">
            <div 
              className="wow fadeInUp"
              style={{
                background: '#1f2937',
                borderRadius: '12px',
                padding: '48px',
                textAlign: 'center',
                color: '#ffffff'
              }}
            >
              <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
                No Coding Required
              </h3>
              <p style={{ fontSize: '16px', opacity: 0.9, maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
                All these tools are designed for non-technical users. If you can use a computer, you can master these AI tools and start building your business.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
