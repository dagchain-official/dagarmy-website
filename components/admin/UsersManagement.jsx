"use client";
import React, { useState } from "react";

export default function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@email.com",
      role: "Student",
      status: "Active",
      courses: 5,
      joined: "2024-01-15",
      avatar: "JD"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      role: "Instructor",
      status: "Active",
      courses: 12,
      joined: "2023-11-20",
      avatar: "SJ"
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "m.chen@email.com",
      role: "Instructor",
      status: "Active",
      courses: 8,
      joined: "2023-09-10",
      avatar: "MC"
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      email: "emily.r@email.com",
      role: "Student",
      status: "Active",
      courses: 3,
      joined: "2024-02-01",
      avatar: "ER"
    },
    {
      id: 5,
      name: "David Wilson",
      email: "d.wilson@email.com",
      role: "Student",
      status: "Inactive",
      courses: 1,
      joined: "2023-12-05",
      avatar: "DW"
    }
  ];

  const roles = ["All", "Student", "Instructor", "Admin"];
  const statuses = ["All", "Active", "Inactive", "Suspended"];

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
          User Management
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
          Manage all users and their roles on the platform
        </p>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Total Users</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#111827' }}>2,547</div>
          </div>
        </div>
        <div className="col-md-3">
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Active Users</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>2,234</div>
          </div>
        </div>
        <div className="col-md-3">
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Instructors</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#8b5cf6' }}>45</div>
          </div>
        </div>
        <div className="col-md-3">
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>New This Month</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#f59e0b' }}>156</div>
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
          <div className="col-md-6">
            <input
              type="text"
              placeholder="Search users by name or email..."
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
          <div className="col-md-3">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
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

      {/* Users Table */}
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
                User
              </th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Role
              </th>
              <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Courses
              </th>
              <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Status
              </th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Joined
              </th>
              <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#fff'
                      }}
                    >
                      {user.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: user.role === 'Instructor' ? '#ede9fe' : '#dbeafe',
                      color: user.role === 'Instructor' ? '#7c3aed' : '#2563eb'
                    }}
                  >
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                    {user.courses}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: user.status === 'Active' ? '#dcfce7' : '#fee2e2',
                      color: user.status === 'Active' ? '#16a34a' : '#dc2626'
                    }}
                  >
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ fontSize: '14px', color: '#4b5563' }}>
                    {new Date(user.joined).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
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
                      Edit
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
