"use client";
import React, { useState } from "react";

export default function CertificationsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [verifyCode, setVerifyCode] = useState("");

  const certifications = [
    {
      id: "CERT-2024-001",
      verificationCode: "ML-2024-JD-001",
      studentName: "John Doe",
      courseName: "Machine Learning Fundamentals",
      score: 95,
      issueDate: "2024-01-20",
      status: "Issued"
    },
    {
      id: "CERT-2024-002",
      verificationCode: "AI-2024-SJ-002",
      studentName: "Sarah Johnson",
      courseName: "Advanced AI Techniques",
      score: 88,
      issueDate: "2024-01-18",
      status: "Issued"
    },
    {
      id: "CERT-2024-003",
      verificationCode: "BC-2024-MC-003",
      studentName: "Michael Chen",
      courseName: "Blockchain Development",
      score: 92,
      issueDate: "2024-01-15",
      status: "Issued"
    },
    {
      id: "CERT-2024-004",
      verificationCode: "DV-2024-ER-004",
      studentName: "Emily Rodriguez",
      courseName: "Data Visualization Mastery",
      score: 87,
      issueDate: "2024-01-12",
      status: "Pending"
    }
  ];

  const stats = {
    totalIssued: 1234,
    thisMonth: 156,
    pending: 23,
    verifiedToday: 45
  };

  const statuses = ["All", "Issued", "Pending", "Revoked"];

  const filteredCertifications = certifications.filter(cert => {
    const matchesSearch = searchQuery === "" ||
      cert.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "All" || cert.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-in' }}>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '32px', animation: 'slideUp 0.5s ease-out' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)'
            }}>
              🎓
            </div>
            <div>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#111827',
                margin: 0,
                letterSpacing: '-0.02em'
              }}>
                Certification Management
              </h1>
              <p style={{ fontSize: '15px', color: '#6b7280', margin: 0 }}>
                Issue, track, and verify certificates
              </p>
            </div>
          </div>
          <button
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(139, 92, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
            }}
          >
            <span style={{ fontSize: '18px' }}>+</span>
            Issue Certificate
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { title: "Total Issued", value: stats.totalIssued.toLocaleString(), icon: "📜", color: "#8b5cf6", change: "+12%" },
          { title: "This Month", value: stats.thisMonth, icon: "📅", color: "#10b981", change: "+24%" },
          { title: "Pending", value: stats.pending, icon: "⏳", color: "#f59e0b", change: "-3" },
          { title: "Verified Today", value: stats.verifiedToday, icon: "✓", color: "#6d28d9", change: "+8" }
        ].map((stat, index) => (
          <div
            key={index}
            className="col-xl-3 col-md-6"
            style={{ animation: `slideUp 0.5s ease-out ${index * 0.1}s backwards` }}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.borderColor = `${stat.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '120px',
                height: '120px',
                background: `radial-gradient(circle, ${stat.color}08 0%, transparent 70%)`,
                pointerEvents: 'none'
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: `${stat.color}10`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  marginBottom: '16px'
                }}>
                  {stat.icon}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  marginBottom: '8px',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {stat.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <div style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#111827',
                    letterSpacing: '-0.02em',
                    lineHeight: 1
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: stat.change.startsWith('+') ? '#10b981' : '#ef4444'
                  }}>
                    {stat.change}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Verification Tool */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(109, 40, 217, 0.05) 100%)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px',
          border: '1px solid rgba(139, 92, 246, 0.15)',
          position: 'relative',
          overflow: 'hidden',
          animation: 'slideUp 0.6s ease-out 0.2s backwards'
        }}
      >
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              🔍
            </div>
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                margin: 0,
                color: '#111827',
                letterSpacing: '-0.01em'
              }}>
                Verify Certificate
              </h3>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                Enter the verification code to validate certificate authenticity
              </p>
            </div>
          </div>
          <div className="row g-3 align-items-end">
            <div className="col-md-8">
              <input
                type="text"
                placeholder="Enter verification code (e.g., ML-2024-JD-001)"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  background: '#ffffff',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#8b5cf6';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
            <div className="col-md-4">
              <button
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  background: '#8b5cf6',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#7c3aed';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#8b5cf6';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Verify Certificate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #e5e7eb',
          marginBottom: '20px',
          animation: 'slideUp 0.6s ease-out 0.3s backwards'
        }}
      >
        <div className="row g-3">
          <div className="col-md-8">
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '16px',
                color: '#9ca3af'
              }}>
                🔍
              </span>
              <input
                type="text"
                placeholder="Search by student name, course, or certificate ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#8b5cf6';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
          <div className="col-md-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '14px',
                cursor: 'pointer',
                outline: 'none',
                background: '#ffffff'
              }}
            >
              {statuses.map(status => (
                <option key={status} value={status}>Status: {status}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterStatus("All");
              }}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '14px',
                background: '#ffffff',
                cursor: 'pointer',
                fontWeight: '600',
                color: '#6b7280',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: '16px', animation: 'slideUp 0.6s ease-out 0.4s backwards' }}>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
          Showing <span style={{ fontWeight: '600', color: '#111827' }}>{filteredCertifications.length}</span> of <span style={{ fontWeight: '600', color: '#111827' }}>{certifications.length}</span> certificates
        </p>
      </div>

      {/* Certifications Grid */}
      <div className="row g-4" style={{ animation: 'slideUp 0.6s ease-out 0.5s backwards' }}>
        {filteredCertifications.map((cert, index) => (
          <div key={cert.id} className="col-12">
            <div
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(139, 92, 246, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <div className="row align-items-center">
                <div className="col-md-3">
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
                      Certificate ID
                    </span>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                    {cert.id}
                  </div>
                  <code style={{
                    fontSize: '11px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: '#f3f4f6',
                    color: '#6b7280',
                    fontFamily: 'monospace'
                  }}>
                    {cert.verificationCode}
                  </code>
                </div>

                <div className="col-md-3">
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
                      Student & Course
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '2px' }}>
                    {cert.studentName}
                  </div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>
                    {cert.courseName}
                  </div>
                </div>

                <div className="col-md-2 text-center">
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
                      Score
                    </span>
                  </div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    background: cert.score >= 90 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    border: `2px solid ${cert.score >= 90 ? '#10b981' : '#f59e0b'}`,
                    fontSize: '18px',
                    fontWeight: '700',
                    color: cert.score >= 90 ? '#10b981' : '#f59e0b'
                  }}>
                    {cert.score}%
                  </div>
                </div>

                <div className="col-md-2">
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
                      Issue Date
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#111827', marginBottom: '6px' }}>
                    {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: cert.status === 'Issued' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: cert.status === 'Issued' ? '#10b981' : '#f59e0b',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {cert.status}
                  </span>
                </div>

                <div className="col-md-2">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        background: '#ffffff',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#6b7280',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f9fafb';
                        e.currentTarget.style.color = '#111827';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#ffffff';
                        e.currentTarget.style.color = '#6b7280';
                      }}
                    >
                      View
                    </button>
                    <button
                      style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#8b5cf6',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#7c3aed'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#8b5cf6'}
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
