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
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
            Certification Management
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
            Issue, track, and verify certificates
          </p>
        </div>
        <button
          style={{
            padding: '12px 24px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
          }}
        >
          <span style={{ fontSize: '18px' }}>+</span>
          Issue Certificate
        </button>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Total Issued</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#111827' }}>1,234</div>
          </div>
        </div>
        <div className="col-md-3">
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>This Month</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>156</div>
          </div>
        </div>
        <div className="col-md-3">
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Pending</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#f59e0b' }}>23</div>
          </div>
        </div>
        <div className="col-md-3">
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Verified Today</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#8b5cf6' }}>45</div>
          </div>
        </div>
      </div>

      {/* Certificate Verification Tool */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '24px',
          color: '#fff'
        }}
      >
        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>
          🔍 Verify Certificate
        </h3>
        <div className="row g-3 align-items-end">
          <div className="col-md-8">
            <input
              type="text"
              placeholder="Enter verification code (e.g., ML-2024-JD-001)"
              style={{
                width: '100%',
                padding: '14px 20px',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                background: 'rgba(255,255,255,0.95)'
              }}
            />
          </div>
          <div className="col-md-4">
            <button
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: '10px',
                background: '#fff',
                color: '#8b5cf6',
                fontSize: '14px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer'
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
          background: '#fff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          marginBottom: '24px'
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
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          <div className="col-md-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Certifications Table */}
      <div
        style={{
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Certificate ID
              </th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Student
              </th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Course
              </th>
              <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Score
              </th>
              <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Issue Date
              </th>
              <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Status
              </th>
              <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {certifications.map((cert) => (
              <tr key={cert.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                      {cert.id}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280', fontFamily: 'monospace' }}>
                      {cert.verificationCode}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ fontSize: '14px', color: '#4b5563' }}>
                    {cert.studentName}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ fontSize: '14px', color: '#4b5563' }}>
                    {cert.courseName}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      background: cert.score >= 90 ? '#dcfce7' : '#fef3c7',
                      color: cert.score >= 90 ? '#16a34a' : '#ca8a04',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}
                  >
                    {cert.score}%
                  </div>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#4b5563' }}>
                    {new Date(cert.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: cert.status === 'Issued' ? '#dcfce7' : '#fef3c7',
                      color: cert.status === 'Issued' ? '#16a34a' : '#ca8a04'
                    }}
                  >
                    {cert.status}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        background: '#fff',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6b7280',
                        cursor: 'pointer'
                      }}
                    >
                      View
                    </button>
                    <button
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        background: '#fff',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6b7280',
                        cursor: 'pointer'
                      }}
                    >
                      Download
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
