"use client";
import React, { useState } from "react";

export default function CertificationsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const certifications = [
    {
      id: "CERT-2024-001",
      studentName: "John Doe",
      courseName: "Machine Learning Fundamentals",
      issueDate: "2024-01-20",
      status: "Issued",
      verificationCode: "ML-2024-JD-001",
      score: 95
    },
    {
      id: "CERT-2024-002",
      studentName: "Sarah Johnson",
      courseName: "Blockchain Development",
      issueDate: "2024-01-18",
      status: "Issued",
      verificationCode: "BC-2024-SJ-002",
      score: 92
    },
    {
      id: "CERT-2024-003",
      studentName: "Michael Chen",
      courseName: "Data Visualization",
      issueDate: "2024-01-15",
      status: "Issued",
      verificationCode: "DV-2024-MC-003",
      score: 88
    },
    {
      id: "CERT-2024-004",
      studentName: "Emily Rodriguez",
      courseName: "Advanced Neural Networks",
      issueDate: "2024-01-22",
      status: "Pending",
      verificationCode: "NN-2024-ER-004",
      score: 91
    }
  ];

  const statuses = ["All", "Issued", "Pending", "Revoked"];

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '6px',
            letterSpacing: '-0.02em'
          }}>
            Certification Management
          </h1>
          <p style={{ fontSize: '15px', color: '#6b7280', margin: 0 }}>
            Issue, track, and verify certificates
          </p>
        </div>
        <button
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            background: '#8b5cf6',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#7c3aed';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#8b5cf6';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span style={{ fontSize: '16px' }}>+</span>
          Issue Certificate
        </button>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div style={{ background: '#ffffff', borderRadius: '10px', padding: '16px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Total Issued</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827', letterSpacing: '-0.02em' }}>1,234</div>
          </div>
        </div>
        <div className="col-md-3">
          <div style={{ background: '#ffffff', borderRadius: '10px', padding: '16px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>This Month</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981', letterSpacing: '-0.02em' }}>156</div>
          </div>
        </div>
        <div className="col-md-3">
          <div style={{ background: '#ffffff', borderRadius: '10px', padding: '16px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Pending</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b', letterSpacing: '-0.02em' }}>23</div>
          </div>
        </div>
        <div className="col-md-3">
          <div style={{ background: '#ffffff', borderRadius: '10px', padding: '16px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Verified Today</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#8b5cf6', letterSpacing: '-0.02em' }}>45</div>
          </div>
        </div>
      </div>

      {/* Certificate Verification Tool */}
      <div
        style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
          borderRadius: '10px',
          padding: '28px',
          marginBottom: '20px',
          color: '#ffffff',
          border: '1px solid rgba(139, 92, 246, 0.2)'
        }}
      >
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '14px', letterSpacing: '-0.01em' }}>
          🔍 Verify Certificate
        </h3>
        <div className="row g-3 align-items-end">
          <div className="col-md-8">
            <input
              type="text"
              placeholder="Enter verification code (e.g., ML-2024-JD-001)"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'rgba(255,255,255,0.95)',
                outline: 'none'
              }}
            />
          </div>
          <div className="col-md-4">
            <button
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                background: '#ffffff',
                color: '#8b5cf6',
                fontSize: '14px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
              }}
            >
              Verify Certificate
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '10px',
          padding: '20px',
          border: '1px solid #e5e7eb',
          marginBottom: '20px'
        }}
      >
        <div className="row g-3">
          <div className="col-md-8">
            <input
              type="text"
              placeholder="Search by student name, course, or certificate ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          <div className="col-md-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Certifications Table - Card Style */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {certifications.map((cert) => (
          <div
            key={cert.id}
            style={{
              background: '#ffffff',
              borderRadius: '10px',
              border: '1px solid #e5e7eb',
              padding: '20px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <div className="row align-items-center">
              {/* Certificate ID & Code */}
              <div className="col-md-3">
                <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
                  Certificate ID
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                  {cert.id}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#6b7280',
                  fontFamily: 'monospace',
                  background: '#f9fafb',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  display: 'inline-block'
                }}>
                  {cert.verificationCode}
                </div>
              </div>

              {/* Student & Course */}
              <div className="col-md-4">
                <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
                  Student & Course
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '2px' }}>
                  {cert.studentName}
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  {cert.courseName}
                </div>
              </div>

              {/* Score */}
              <div className="col-md-2 text-center">
                <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
                  Score
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    background: cert.score >= 90 ? '#dcfce7' : '#fef3c7',
                    color: cert.score >= 90 ? '#16a34a' : '#ca8a04',
                    fontSize: '14px',
                    fontWeight: '700'
                  }}
                >
                  {cert.score}%
                </div>
              </div>

              {/* Issue Date & Status */}
              <div className="col-md-2 text-center">
                <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
                  Issued
                </div>
                <div style={{ fontSize: '13px', color: '#4b5563', marginBottom: '6px', fontWeight: '500' }}>
                  {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: cert.status === 'Issued' ? '#dcfce7' : '#fef3c7',
                    color: cert.status === 'Issued' ? '#16a34a' : '#ca8a04'
                  }}
                >
                  {cert.status}
                </span>
              </div>

              {/* Actions */}
              <div className="col-md-1 text-end">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid #e5e7eb',
                      background: '#ffffff',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6b7280',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      width: '100%'
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
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid #e5e7eb',
                      background: '#ffffff',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6b7280',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      width: '100%'
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
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
