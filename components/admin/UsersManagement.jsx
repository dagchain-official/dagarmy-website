"use client";
import React, { useState } from "react";

export default function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
<<<<<<< HEAD
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
=======
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@email.com",
      role: "Student",
      status: "Active",
      courses: 5,
      joined: "2024-01-15",
<<<<<<< HEAD
      avatar: "JD",
      lastActive: "2 hours ago"
=======
      avatar: "JD"
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      role: "Instructor",
      status: "Active",
      courses: 12,
      joined: "2023-11-20",
<<<<<<< HEAD
      avatar: "SJ",
      lastActive: "1 day ago"
=======
      avatar: "SJ"
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "m.chen@email.com",
      role: "Instructor",
      status: "Active",
      courses: 8,
      joined: "2023-09-10",
<<<<<<< HEAD
      avatar: "MC",
      lastActive: "3 hours ago"
=======
      avatar: "MC"
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      email: "emily.r@email.com",
      role: "Student",
      status: "Active",
      courses: 3,
      joined: "2024-02-01",
<<<<<<< HEAD
      avatar: "ER",
      lastActive: "5 minutes ago"
=======
      avatar: "ER"
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
    },
    {
      id: 5,
      name: "David Wilson",
      email: "d.wilson@email.com",
      role: "Student",
      status: "Inactive",
      courses: 1,
      joined: "2023-12-05",
<<<<<<< HEAD
      avatar: "DW",
      lastActive: "2 weeks ago"
=======
      avatar: "DW"
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
    }
  ];

  const roles = ["All", "Student", "Instructor", "Admin"];
  const statuses = ["All", "Active", "Inactive", "Suspended"];

<<<<<<< HEAD
  const handleSelectUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(u => u.id));
    }
  };

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
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* Header */}
      <div className="mb-4" style={{ animation: 'slideUp 0.5s ease-out' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              👥
            </div>
            <div>
              <h1 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#111827',
                margin: 0,
                letterSpacing: '-0.02em'
              }}>
                User Management
              </h1>
              <p style={{ fontSize: '15px', color: '#6b7280', margin: 0 }}>
                Manage all users and their roles on the platform
              </p>
            </div>
          </div>
          <button
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: '#1f2937',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#111827';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#1f2937';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span style={{ fontSize: '16px' }}>+</span>
            Add New User
          </button>
        </div>
=======
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
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
<<<<<<< HEAD
        {[
          { title: "Total Users", value: "2,547", icon: "👥", color: "#1f2937", change: "+12%" },
          { title: "Active Users", value: "2,234", icon: "✓", color: "#10b981", change: "+8%" },
          { title: "Instructors", value: "45", icon: "🎓", color: "#1f2937", change: "+3" },
          { title: "New This Month", value: "156", icon: "📈", color: "#f59e0b", change: "+24%" }
        ].map((stat, index) => (
          <div
            key={index}
            className="col-md-3"
            style={{ animation: `slideUp 0.5s ease-out ${index * 0.1}s backwards` }}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                height: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.04)';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: `${stat.color}08`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                marginBottom: '12px'
              }}>
                {stat.icon}
              </div>
              <div style={{
                fontSize: '13px',
                color: '#6b7280',
                marginBottom: '6px',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {stat.title}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <div style={{
                  fontSize: '28px',
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
                  color: '#10b981'
                }}>
                  {stat.change}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Actions Bar */}
      {selectedUsers.length > 0 && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(109, 40, 217, 0.05) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            animation: 'slideDown 0.3s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
              {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                fontSize: '13px',
                fontWeight: '600',
                color: '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
            >
              Export
            </button>
            <button
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                fontSize: '13px',
                fontWeight: '600',
                color: '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
            >
              Change Role
            </button>
            <button
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                fontSize: '13px',
                fontWeight: '600',
                color: '#dc2626',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
            >
              Delete
            </button>
          </div>
        </div>
      )}
=======
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
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937' }}>45</div>
          </div>
        </div>
        <div className="col-md-3">
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>New This Month</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#f59e0b' }}>156</div>
          </div>
        </div>
      </div>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696

      {/* Filters */}
      <div
        style={{
<<<<<<< HEAD
          background: '#ffffff',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #e5e7eb',
          marginBottom: '20px',
          animation: 'slideUp 0.6s ease-out 0.2s backwards'
        }}
      >
        <div className="row g-3">
          <div className="col-md-5">
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
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 40px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#1f2937';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
=======
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
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
          </div>
          <div className="col-md-3">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              style={{
                width: '100%',
<<<<<<< HEAD
                padding: '10px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {roles.map((role) => (
                <option key={role} value={role}>Role: {role}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
=======
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
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                width: '100%',
<<<<<<< HEAD
                padding: '10px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>Status: {status}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterRole("All");
                setFilterStatus("All");
              }}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
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
=======
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
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
        </div>
      </div>

      {/* Users Table */}
      <div
        style={{
<<<<<<< HEAD
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          animation: 'slideUp 0.6s ease-out 0.3s backwards'
=======
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
<<<<<<< HEAD
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '14px 20px', textAlign: 'left', width: '40px' }}>
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length}
                  onChange={handleSelectAll}
                  style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                />
              </th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                User
              </th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Role
              </th>
              <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Courses
              </th>
              <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Status
              </th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Last Active
              </th>
              <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
=======
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
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
<<<<<<< HEAD
            {users.map((user, index) => (
              <tr
                key={user.id}
                style={{
                  borderBottom: '1px solid #f3f4f6',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '14px 20px' }}>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                    style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                  />
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '15px',
                        fontWeight: '700',
                        color: '#ffffff',
                        flexShrink: 0
=======
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
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                      }}
                    >
                      {user.avatar}
                    </div>
                    <div>
<<<<<<< HEAD
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '2px' }}>
=======
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                        {user.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
<<<<<<< HEAD
                <td style={{ padding: '14px 20px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: user.role === 'Instructor' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
=======
                <td style={{ padding: '16px 24px' }}>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: user.role === 'Instructor' ? '#ede9fe' : '#dbeafe',
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                      color: user.role === 'Instructor' ? '#111827' : '#2563eb'
                    }}
                  >
                    {user.role}
                  </span>
                </td>
<<<<<<< HEAD
                <td style={{ padding: '14px 20px', textAlign: 'center' }}>
=======
                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                    {user.courses}
                  </span>
                </td>
<<<<<<< HEAD
                <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: user.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: user.status === 'Active' ? '#10b981' : '#ef4444'
=======
                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: user.status === 'Active' ? '#dcfce7' : '#fee2e2',
                      color: user.status === 'Active' ? '#16a34a' : '#dc2626'
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                    }}
                  >
                    {user.status}
                  </span>
                </td>
<<<<<<< HEAD
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>
                    {user.lastActive}
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
=======
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ fontSize: '14px', color: '#4b5563' }}>
                    {new Date(user.joined).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
<<<<<<< HEAD
                        background: '#ffffff',
                        fontSize: '12px',
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
=======
                        background: '#fff',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6b7280',
                        cursor: 'pointer'
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                      }}
                    >
                      View
                    </button>
                    <button
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
<<<<<<< HEAD
                        background: '#ffffff',
                        fontSize: '12px',
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
=======
                        background: '#fff',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6b7280',
                        cursor: 'pointer'
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
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
