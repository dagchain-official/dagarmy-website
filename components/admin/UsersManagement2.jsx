"use client";
import React, { useState, useEffect } from "react";
import { Users, Search, Filter, UserPlus, MoreVertical, Mail, Calendar, Activity, TrendingUp, Shield, GraduationCap, Download, Trash2, Edit3 } from "lucide-react";

export default function UsersManagement2() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    usersByRole: {},
    newUsersThisWeek: 0,
    growthRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      
      if (response.ok) {
        const transformedUsers = data.users.map(user => ({
          id: user.id,
          name: user.full_name || user.email?.split('@')[0] || 'Unknown User',
          email: user.email,
          role: user.role || 'student',
          status: isUserActive(user.last_sign_in_at || user.created_at) ? 'Active' : 'Inactive',
          courses: 0,
          joined: new Date(user.created_at).toLocaleDateString(),
          avatar: getInitials(user.full_name || user.email),
          lastActive: getLastActiveText(user.last_sign_in_at || user.created_at),
          rawDate: user.last_sign_in_at || user.created_at
        }));
        
        setUsers(transformedUsers);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const isUserActive = (lastActiveDate) => {
    const lastActive = new Date(lastActiveDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return lastActive > thirtyDaysAgo;
  };

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getLastActiveText = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    const filteredUserIds = filteredUsers.map(u => u.id);
    if (selectedUsers.length === filteredUserIds.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUserIds);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery === "" || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filterRole === "All" || 
      user.role.toLowerCase() === filterRole.toLowerCase();
    
    const matchesStatus = filterStatus === "All" || 
      user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role) => {
    const colors = {
      admin: { bg: '#fef3c7', text: '#92400e', icon: Shield },
      instructor: { bg: '#ddd6fe', text: '#5b21b6', icon: GraduationCap },
      student: { bg: '#dbeafe', text: '#1e40af', icon: Users }
    };
    return colors[role.toLowerCase()] || colors.student;
  };

  const getStatusColor = (status) => {
    return status === 'Active' 
      ? { bg: '#d1fae5', text: '#065f46' }
      : { bg: '#fee2e2', text: '#991b1b' };
  };

  return (
    <div style={{ padding: '32px', width: '100%', background: '#fafafa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', margin: 0, marginBottom: '4px' }}>
              Users
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              Manage and monitor all platform users
            </p>
          </div>
          <button style={{
            padding: '12px 24px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
            color: '#fff',
            border: 'none',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
          }}>
            <UserPlus size={18} />
            Add User
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {[
          { 
            title: 'Total Users', 
            value: loading ? '...' : stats.totalUsers.toLocaleString(), 
            change: `+${stats.growthRate}%`,
            icon: Users,
            color: '#1f2937',
            bgGradient: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
          },
          { 
            title: 'Active Now', 
            value: loading ? '...' : stats.activeUsers.toLocaleString(),
            change: `${stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%`,
            icon: Activity,
            color: '#10b981',
            bgGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
          },
          { 
            title: 'Instructors', 
            value: loading ? '...' : (stats.usersByRole?.instructor || 0).toString(),
            change: `${stats.usersByRole?.instructor || 0} total`,
            icon: GraduationCap,
            color: '#f59e0b',
            bgGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
          },
          { 
            title: 'New This Week', 
            value: loading ? '...' : stats.newUsersThisWeek.toString(),
            change: `+${stats.newUsersThisWeek} users`,
            icon: TrendingUp,
            color: '#3b82f6',
            bgGradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #e5e7eb',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
              e.currentTarget.style.borderColor = stat.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}>
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                background: stat.bgGradient,
                borderRadius: '50%',
                opacity: 0.1
              }} />
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: stat.bgGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 12px ${stat.color}40`
                }}>
                  <Icon size={24} style={{ color: '#fff' }} />
                </div>
              </div>
              
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {stat.title}
              </div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: stat.color }}>
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={20} style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }} />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 48px',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#1f2937';
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              outline: 'none',
              background: '#fff',
              color: '#374151'
            }}>
            <option value="All">All Roles</option>
            <option value="Student">Student</option>
            <option value="Instructor">Instructor</option>
            <option value="Admin">Admin</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              outline: 'none',
              background: '#fff',
              color: '#374151'
            }}>
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          
          <button
            onClick={() => {
              setSearchQuery("");
              setFilterRole("All");
              setFilterStatus("All");
            }}
            style={{
              padding: '12px 20px',
              border: '2px solid #e5e7eb',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              background: '#fff',
              cursor: 'pointer',
              color: '#6b7280',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f9fafb';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}>
            Reset
          </button>
        </div>
        
        {selectedUsers.length > 0 && (
          <div style={{
            marginTop: '20px',
            padding: '16px 20px',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)',
            borderRadius: '12px',
            border: '2px solid rgba(139, 92, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
              {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#fff',
                border: '1px solid #e5e7eb',
                fontSize: '13px',
                fontWeight: '600',
                color: '#374151',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}>
                <Download size={14} />
                Export
              </button>
              <button style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                fontSize: '13px',
                fontWeight: '600',
                color: '#dc2626',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}>
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Grid */}
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px 2fr 1fr 100px 100px 120px 80px',
          gap: '16px',
          padding: '16px 24px',
          background: '#fafafa',
          borderBottom: '1px solid #e5e7eb',
          alignItems: 'center'
        }}>
          <input
            type="checkbox"
            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
            onChange={handleSelectAll}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            User
          </div>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Role
          </div>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>
            Courses
          </div>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>
            Status
          </div>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Last Active
          </div>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>
            Actions
          </div>
        </div>

        {/* Table Body */}
        <div>
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}>Loading users...</div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <Users size={48} style={{ color: '#d1d5db', margin: '0 auto 16px' }} />
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>No users found</div>
              <div style={{ fontSize: '14px', color: '#9ca3af' }}>Try adjusting your search or filters</div>
            </div>
          ) : (
            filteredUsers.map((user, index) => {
              const roleConfig = getRoleColor(user.role);
              const statusConfig = getStatusColor(user.status);
              const RoleIcon = roleConfig.icon;
              
              return (
                <div
                  key={user.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 2fr 1fr 100px 100px 120px 80px',
                    gap: '16px',
                    padding: '20px 24px',
                    borderBottom: index < filteredUsers.length - 1 ? '1px solid #f3f4f6' : 'none',
                    alignItems: 'center',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#fff',
                      flexShrink: 0
                    }}>
                      {user.avatar}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: '13px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.email}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: roleConfig.bg,
                      color: roleConfig.text
                    }}>
                      <RoleIcon size={14} />
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '700',
                      background: '#f3f4f6',
                      color: '#374151'
                    }}>
                      {user.courses}
                    </span>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: statusConfig.bg,
                      color: statusConfig.text
                    }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: statusConfig.text
                      }} />
                      {user.status}
                    </span>
                  </div>
                  
                  <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>
                    {user.lastActive}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      background: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('Edit user: ' + user.name);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f9fafb';
                      e.currentTarget.style.borderColor = '#1f2937';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fff';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }}>
                      <Edit3 size={14} style={{ color: '#6b7280' }} />
                    </button>
                    <button style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      background: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('More options for: ' + user.name);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f9fafb';
                      e.currentTarget.style.borderColor = '#d1d5db';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fff';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }}>
                      <MoreVertical size={14} style={{ color: '#6b7280' }} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Results Count */}
      {!loading && filteredUsers.length > 0 && (
        <div style={{
          marginTop: '20px',
          padding: '16px 24px',
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            Showing <span style={{ fontWeight: '600', color: '#111827' }}>{filteredUsers.length}</span> of <span style={{ fontWeight: '600', color: '#111827' }}>{users.length}</span> users
          </div>
          <div style={{ fontSize: '13px', color: '#9ca3af' }}>
            {selectedUsers.length > 0 && `${selectedUsers.length} selected`}
          </div>
        </div>
      )}
    </div>
  );
}
