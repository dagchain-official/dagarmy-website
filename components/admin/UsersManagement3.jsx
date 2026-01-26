"use client";
import React, { useState, useEffect } from "react";
import { 
  Users, Search, UserPlus, MoreVertical, Mail, Calendar, Activity, TrendingUp, 
  Shield, GraduationCap, Download, Trash2, Edit3, Eye, Clock, MapPin, 
  Smartphone, Globe, Award, BookOpen, Target, Filter, X, ChevronDown,
  FileText, BarChart3, UserCheck, UserX, Zap
} from "lucide-react";

export default function UsersManagement3() {
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
  const [showDatePicker, setShowDatePicker] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [showExportWarning, setShowExportWarning] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [viewUserModal, setViewUserModal] = useState(null);
  const [editUserModal, setEditUserModal] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

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
          // Keep all original Supabase fields
          ...user,
          // Add computed display fields
          name: user.full_name || user.email?.split('@')[0] || 'Unknown User',
          displayEmail: user.email || user.user_provided_email || 'N/A',
          status: isUserActive(user.last_sign_in_at || user.created_at) ? 'Active' : 'Inactive',
          courses: 0,
          joined: new Date(user.created_at).toLocaleDateString(),
          joinedRaw: user.created_at,
          avatar: getInitials(user.full_name || user.email),
          lastActive: getLastActiveText(user.last_sign_in_at || user.created_at),
          lastActiveRaw: user.last_sign_in_at || user.created_at,
          verified: user.email_confirmed_at ? true : false,
          loginCount: user.sign_in_count || 0,
          completionRate: Math.floor(Math.random() * 100),
          totalLessons: Math.floor(Math.random() * 50),
          completedLessons: Math.floor(Math.random() * 30)
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

  const getAvatarDisplay = (user) => {
    // If user has uploaded avatar, use it
    if (user.avatar_url) {
      return (
        <img 
          src={user.avatar_url} 
          alt={user.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '14px'
          }}
        />
      );
    }
    
    // Otherwise use default banner avatars
    const defaultAvatars = [
      '/images/avatar/banner/abstract-p01.jpg',
      '/images/avatar/banner/abstract-p02.jpg'
    ];
    
    // Use user ID to consistently assign same avatar
    const avatarIndex = user.id ? (user.id.charCodeAt(0) % defaultAvatars.length) : 0;
    
    return (
      <img 
        src={defaultAvatars[avatarIndex]}
        alt={user.name}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '14px'
        }}
      />
    );
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
    
    // Date range filter
    let matchesDateRange = true;
    if (dateRange.start && dateRange.end) {
      const userDate = new Date(user.joinedRaw);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      matchesDateRange = userDate >= startDate && userDate <= endDate;
    }
    
    return matchesSearch && matchesRole && matchesStatus && matchesDateRange;
  });

  const exportToCSV = () => {
    // Validate date range is selected
    if (!dateRange.start || !dateRange.end) {
      setShowExportWarning(true);
      setTimeout(() => setShowExportWarning(false), 5000);
      return;
    }

    // Filter users by date range only (ignore other filters for export)
    const usersInDateRange = users.filter(user => {
      const userDate = new Date(user.joinedRaw);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999); // Include the entire end date
      return userDate >= startDate && userDate <= endDate;
    });

    if (usersInDateRange.length === 0) {
      alert('No users found in the selected date range.');
      return;
    }
    
    const headers = [
      'ID',
      'Full Name',
      'First Name',
      'Last Name',
      'Email (Login)',
      'Email (User Provided)',
      'Wallet Address',
      'Role',
      'Status',
      'Country Code',
      'WhatsApp Number',
      'Bio',
      'Skill/Occupation',
      'Avatar URL',
      'Social Links',
      'Profile Completed',
      'Is Active',
      'Verified',
      'Login Count',
      'Courses Enrolled',
      'Total Lessons',
      'Completed Lessons',
      'Completion Rate',
      'Created At',
      'Updated At',
      'Last Login',
      'Last Sign In At',
      'Last Active'
    ];
    
    const csvData = usersInDateRange.map(user => [
      user.id || '',
      user.full_name || '',
      user.first_name || '',
      user.last_name || '',
      user.email || '',
      user.user_provided_email || '',
      user.wallet_address || '',
      user.role || '',
      user.status || '',
      user.country_code || '',
      user.whatsapp_number || '',
      user.bio || '',
      user.skill_occupation || '',
      user.avatar_url || '',
      user.social_links ? JSON.stringify(user.social_links) : '',
      user.profile_completed ? 'Yes' : 'No',
      user.is_active ? 'Yes' : 'No',
      user.verified ? 'Yes' : 'No',
      user.loginCount || 0,
      user.courses || 0,
      user.totalLessons || 0,
      user.completedLessons || 0,
      `${user.completionRate}%`,
      user.created_at || '',
      user.updated_at || '',
      user.last_login || '',
      user.last_sign_in_at || '',
      user.lastActive || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => {
        // Escape quotes and wrap in quotes
        const cellStr = String(cell).replace(/"/g, '""');
        return `"${cellStr}"`;
      }).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `users_export_${dateRange.start}_to_${dateRange.end}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: { bg: '#fef3c7', text: '#92400e', icon: Shield, gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' },
      instructor: { bg: '#ddd6fe', text: '#5b21b6', icon: GraduationCap, gradient: 'linear-gradient(135deg, #a78bfa 0%, #1f2937 100%)' },
      student: { bg: '#dbeafe', text: '#1e40af', icon: Users, gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)' }
    };
    return colors[role.toLowerCase()] || colors.student;
  };

  const getStatusColor = (status) => {
    return status === 'Active' 
      ? { bg: '#d1fae5', text: '#065f46', dot: '#10b981' }
      : { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' };
  };

  const handleViewUser = (user) => {
    setViewUserModal(user);
  };

  const handleEditUser = (user) => {
    setEditUserModal(user);
    setEditFormData({
      id: user.id,
      full_name: user.full_name || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      user_provided_email: user.user_provided_email || '',
      wallet_address: user.wallet_address || '',
      role: user.role || 'student',
      country_code: user.country_code || '',
      whatsapp_number: user.whatsapp_number || '',
      bio: user.bio || '',
      skill_occupation: user.skill_occupation || '',
      is_active: user.is_active !== undefined ? user.is_active : true
    });
  };

  const handleSaveUser = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      const data = await response.json();

      if (response.ok) {
        setNotification({ type: 'success', message: 'User updated successfully!' });
        setEditUserModal(null);
        fetchUsers(); // Refresh the user list
      } else {
        setNotification({ type: 'error', message: data.error || 'Failed to update user' });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setNotification({ type: 'error', message: 'An error occurred while updating user' });
    } finally {
      setSaving(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  return (
    <div style={{ padding: '32px', width: '100%', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Enhanced Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(139, 92, 246, 0.3)'
              }}>
                <Users size={24} style={{ color: '#fff' }} />
              </div>
              <div>
                <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', margin: 0, lineHeight: 1 }}>
                  Users Management
                </h1>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0, marginTop: '4px' }}>
                  Complete user analytics and management dashboard
                </p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button 
              onClick={() => setShowDatePicker(!showDatePicker)}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                background: showDatePicker ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' : '#fff',
                color: showDatePicker ? '#fff' : '#475569',
                border: showDatePicker ? 'none' : '2px solid #e2e8f0',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                boxShadow: showDatePicker ? '0 4px 12px rgba(139, 92, 246, 0.3)' : '0 2px 8px rgba(0,0,0,0.04)'
              }}
              onMouseEnter={(e) => {
                if (!showDatePicker) {
                  e.currentTarget.style.borderColor = '#1f2937';
                }
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = showDatePicker ? '0 6px 16px rgba(139, 92, 246, 0.4)' : '0 4px 12px rgba(139, 92, 246, 0.15)';
              }}
              onMouseLeave={(e) => {
                if (!showDatePicker) {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = showDatePicker ? '0 4px 12px rgba(139, 92, 246, 0.3)' : '0 2px 8px rgba(0,0,0,0.04)';
              }}>
              <Calendar size={18} />
              {showDatePicker ? 'Hide Date Range' : 'Show Date Range'}
            </button>
            <button 
              onClick={exportToCSV}
              disabled={!dateRange.start || !dateRange.end}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                background: (!dateRange.start || !dateRange.end) 
                  ? '#e2e8f0' 
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: (!dateRange.start || !dateRange.end) ? '#94a3b8' : '#fff',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: (!dateRange.start || !dateRange.end) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: (!dateRange.start || !dateRange.end) 
                  ? 'none' 
                  : '0 4px 12px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.2s',
                opacity: (!dateRange.start || !dateRange.end) ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (dateRange.start && dateRange.end) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (dateRange.start && dateRange.end) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                }
              }}>
              <Download size={18} />
              Export CSV
            </button>
            {showExportWarning && (
              <div style={{
                padding: '10px 16px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                border: '2px solid #fbbf24',
                fontSize: '13px',
                fontWeight: '600',
                color: '#92400e',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                animation: 'slideIn 0.3s ease-out'
              }}>
                <Calendar size={16} />
                Please select a date range first!
              </div>
            )}
            <button style={{
              padding: '12px 24px',
              borderRadius: '12px',
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

        {/* Date Range Picker */}
        {showDatePicker && (
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            border: '2px solid #1f2937',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)'
          }}>
            <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)', borderRadius: '10px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Calendar size={16} style={{ color: '#1f2937' }} />
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#111827' }}>
                  Date Range Required for CSV Export
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                Select a date range to export user data. This helps manage large datasets efficiently.
                {dateRange.start && dateRange.end && (
                  <span style={{ fontWeight: '600', color: '#10b981', marginLeft: '8px' }}>
                    ✓ {users.filter(u => {
                      const userDate = new Date(u.joinedRaw);
                      const startDate = new Date(dateRange.start);
                      const endDate = new Date(dateRange.end);
                      endDate.setHours(23, 59, 59, 999);
                      return userDate >= startDate && userDate <= endDate;
                    }).length} users in selected range
                  </span>
                )}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                  Start Date <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#1f2937'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                  End Date <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#1f2937'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                />
              </div>
              <button
                onClick={() => setDateRange({ start: '', end: '' })}
                style={{
                  marginTop: '28px',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  background: '#fff',
                  border: '2px solid #e2e8f0',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}>
                <X size={14} />
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {[
          { 
            title: 'Total Users', 
            value: loading ? '...' : stats.totalUsers.toLocaleString(), 
            change: `+${stats.growthRate}% this month`,
            icon: Users,
            color: '#1f2937',
            bgGradient: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
            lightBg: '#f8fafc'
          },
          { 
            title: 'Active Users', 
            value: loading ? '...' : stats.activeUsers.toLocaleString(),
            change: `${stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}% of total`,
            icon: Activity,
            color: '#374151',
            bgGradient: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
            lightBg: '#f8fafc'
          },
          { 
            title: 'Instructors', 
            value: loading ? '...' : (stats.usersByRole?.instructor || 0).toString(),
            change: `${stats.usersByRole?.instructor || 0} active instructors`,
            icon: GraduationCap,
            color: '#4b5563',
            bgGradient: 'linear-gradient(135deg, #4b5563 0%, #374151 100%)',
            lightBg: '#f8fafc'
          },
          { 
            title: 'New This Week', 
            value: loading ? '...' : stats.newUsersThisWeek.toString(),
            change: `+${stats.newUsersThisWeek} new registrations`,
            icon: TrendingUp,
            color: '#6b7280',
            bgGradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
            lightBg: '#f8fafc'
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '28px',
              border: '2px solid #e2e8f0',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = stat.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}>
              <div style={{
                position: 'absolute',
                top: '-30px',
                right: '-30px',
                width: '140px',
                height: '140px',
                background: stat.lightBg,
                borderRadius: '50%',
                opacity: 0.6
              }} />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: stat.bgGradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 8px 16px ${stat.color}40`
                  }}>
                    <Icon size={28} style={{ color: '#fff' }} />
                  </div>
                  <div style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: stat.lightBg,
                    fontSize: '11px',
                    fontWeight: '700',
                    color: stat.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Live
                  </div>
                </div>
                
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {stat.title}
                </div>
                <div style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', marginBottom: '8px', lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: stat.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={14} />
                  {stat.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '28px',
        marginBottom: '24px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={20} style={{
              position: 'absolute',
              left: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8'
            }} />
            <input
              type="text"
              placeholder="Search by name, email, or any user data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 18px 14px 52px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                outline: 'none',
                transition: 'all 0.2s',
                background: '#f8fafc'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#1f2937';
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.1)';
                e.currentTarget.style.background = '#fff';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = '#f8fafc';
              }}
            />
          </div>
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            style={{
              padding: '14px 18px',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              outline: 'none',
              background: '#f8fafc',
              color: '#475569',
              minWidth: '140px'
            }}>
            <option value="All">All Roles</option>
            <option value="Student">Students</option>
            <option value="Instructor">Instructors</option>
            <option value="Admin">Admins</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '14px 18px',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              outline: 'none',
              background: '#f8fafc',
              color: '#475569',
              minWidth: '140px'
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
              setDateRange({ start: '', end: '' });
            }}
            style={{
              padding: '14px 24px',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              background: '#f8fafc',
              cursor: 'pointer',
              color: '#64748b',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}>
            <X size={16} />
            Reset All
          </button>
        </div>
        
        {selectedUsers.length > 0 && (
          <div style={{
            marginTop: '24px',
            padding: '20px 24px',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(124, 58, 237, 0.04) 100%)',
            borderRadius: '14px',
            border: '2px solid rgba(139, 92, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '700'
              }}>
                {selectedUsers.length}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>
                  {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                </div>
                <div style={{ fontSize: '12px', color: '#1f2937' }}>
                  Bulk actions available
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{
                padding: '10px 18px',
                borderRadius: '10px',
                background: '#fff',
                border: '2px solid #e2e8f0',
                fontSize: '13px',
                fontWeight: '600',
                color: '#475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.borderColor = '#10b981';
                e.currentTarget.style.color = '#10b981';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.color = '#475569';
              }}>
                <Download size={16} />
                Export Selected
              </button>
              <button style={{
                padding: '10px 18px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                border: 'none',
                fontSize: '13px',
                fontWeight: '600',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
              }}>
                <Trash2 size={16} />
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Users Table */}
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        border: '2px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px 2.5fr 1.2fr 0.8fr 0.8fr 1fr 0.8fr 0.8fr 100px',
          gap: '16px',
          padding: '20px 28px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          borderBottom: '2px solid #e2e8f0',
          alignItems: 'center'
        }}>
          <input
            type="checkbox"
            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
            onChange={handleSelectAll}
            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#1f2937' }}
          />
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>
            User Details
          </div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Role & Status
          </div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>
            Courses
          </div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>
            Progress
          </div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Activity
          </div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>
            Verified
          </div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>
            Logins
          </div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>
            Actions
          </div>
        </div>

        {/* Table Body */}
        <div>
          {loading ? (
            <div style={{ padding: '80px', textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                border: '4px solid #f1f5f9',
                borderTop: '4px solid #1f2937',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px'
              }} />
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#64748b' }}>Loading user data...</div>
              <style jsx>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ padding: '80px', textAlign: 'center' }}>
              <Users size={64} style={{ color: '#cbd5e1', margin: '0 auto 20px' }} />
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>No users found</div>
              <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px' }}>Try adjusting your search or filters</div>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterRole("All");
                  setFilterStatus("All");
                  setDateRange({ start: '', end: '' });
                }}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                Clear All Filters
              </button>
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
                    gridTemplateColumns: '40px 2.5fr 1.2fr 0.8fr 0.8fr 1fr 0.8fr 0.8fr 100px',
                    gap: '16px',
                    padding: '24px 28px',
                    borderBottom: index < filteredUsers.length - 1 ? '1px solid #f1f5f9' : 'none',
                    alignItems: 'center',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fafbfc';
                    e.currentTarget.style.transform = 'scale(1.005)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#1f2937' }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  
                  {/* User Details */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      flexShrink: 0,
                      boxShadow: `0 4px 12px ${roleConfig.bg}`,
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      {getAvatarDisplay(user)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: '13px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Mail size={12} />
                        {user.displayEmail}
                      </div>
                    </div>
                  </div>
                  
                  {/* Role & Status */}
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '700',
                      background: roleConfig.bg,
                      color: roleConfig.text,
                      width: 'fit-content'
                    }}>
                      <RoleIcon size={14} />
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '700',
                      background: statusConfig.bg,
                      color: statusConfig.text,
                      width: 'fit-content'
                    }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: statusConfig.dot
                      }} />
                      {user.status}
                    </span>
                  </div>
                  
                  {/* Courses */}
                  <div style={{ textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: '#f8fafc',
                      border: '2px solid #e2e8f0',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#0f172a'
                    }}>
                      <BookOpen size={14} style={{ color: '#1f2937' }} />
                      {user.courses}
                    </span>
                  </div>
                  
                  {/* Progress */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, minWidth: '60px' }}>
                      <div style={{
                        width: '100%',
                        height: '6px',
                        background: '#f1f5f9',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${user.completionRate}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                          borderRadius: '3px',
                          transition: 'width 0.3s'
                        }} />
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#10b981', whiteSpace: 'nowrap' }}>
                      {user.completionRate}%
                    </div>
                  </div>
                  
                  {/* Activity */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={12} style={{ color: '#1f2937', flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#475569', whiteSpace: 'nowrap' }}>
                      {user.lastActive}
                    </span>
                  </div>
                  
                  {/* Verified */}
                  <div style={{ textAlign: 'center' }}>
                    {user.verified ? (
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                      }}>
                        <UserCheck size={18} style={{ color: '#fff' }} />
                      </div>
                    ) : (
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: '#fee2e2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto'
                      }}>
                        <UserX size={18} style={{ color: '#dc2626' }} />
                      </div>
                    )}
                  </div>
                  
                  {/* Logins */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      background: '#f8fafc',
                      border: '2px solid #e2e8f0'
                    }}>
                      <Zap size={14} style={{ color: '#f59e0b' }} />
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                        {user.loginCount}
                      </span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                    <button style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      background: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewUser(user);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = '#1f2937';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fff';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}>
                      <Eye size={16} style={{ color: '#64748b' }} />
                    </button>
                    <button style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      background: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditUser(user);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = '#10b981';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fff';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}>
                      <Edit3 size={16} style={{ color: '#64748b' }} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Enhanced Footer */}
      {!loading && filteredUsers.length > 0 && (
        <div style={{
          marginTop: '24px',
          padding: '24px 28px',
          background: '#fff',
          borderRadius: '16px',
          border: '2px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BarChart3 size={20} style={{ color: '#1f2937' }} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>
                Showing <span style={{ fontWeight: '800', color: '#0f172a' }}>{filteredUsers.length}</span> of <span style={{ fontWeight: '800', color: '#0f172a' }}>{users.length}</span> users
              </div>
              {selectedUsers.length > 0 && (
                <div style={{ fontSize: '12px', color: '#1f2937', marginTop: '2px' }}>
                  {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                </div>
              )}
            </div>
          </div>
          <div style={{ fontSize: '13px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} />
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          padding: '16px 24px',
          borderRadius: '12px',
          background: notification.type === 'success' 
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
            : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '600',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'slideIn 0.3s ease-out'
        }}>
          {notification.type === 'success' ? '✓' : '✕'} {notification.message}
        </div>
      )}

      {/* View User Modal */}
      {viewUserModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}
        onClick={() => setViewUserModal(null)}>
          <div style={{
            background: '#fff',
            borderRadius: '24px',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)'
          }}
          onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{
              padding: '32px',
              borderBottom: '2px solid #f1f5f9',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: getRoleColor(viewUserModal.role).gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#fff',
                    boxShadow: `0 8px 16px ${getRoleColor(viewUserModal.role).bg}`
                  }}>
                    {viewUserModal.avatar}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0, marginBottom: '4px' }}>
                      {viewUserModal.name}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={14} style={{ color: '#64748b' }} />
                      <span style={{ fontSize: '14px', color: '#64748b' }}>{viewUserModal.displayEmail}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setViewUserModal(null)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    background: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fee2e2';
                    e.currentTarget.style.borderColor = '#ef4444';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}>
                  <X size={20} style={{ color: '#64748b' }} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                {[
                  { label: 'User ID', value: viewUserModal.id, icon: FileText },
                  { label: 'Full Name', value: viewUserModal.full_name || 'N/A', icon: Users },
                  { label: 'First Name', value: viewUserModal.first_name || 'N/A', icon: Users },
                  { label: 'Last Name', value: viewUserModal.last_name || 'N/A', icon: Users },
                  { label: 'Email (Login)', value: viewUserModal.email || 'N/A', icon: Mail },
                  { label: 'Email (User Provided)', value: viewUserModal.user_provided_email || 'N/A', icon: Mail },
                  { label: 'Wallet Address', value: viewUserModal.wallet_address || 'N/A', icon: Shield },
                  { label: 'Role', value: viewUserModal.role, icon: Shield },
                  { label: 'Status', value: viewUserModal.status, icon: Activity },
                  { label: 'Country Code', value: viewUserModal.country_code || 'N/A', icon: Globe },
                  { label: 'WhatsApp Number', value: viewUserModal.whatsapp_number || 'N/A', icon: Smartphone },
                  { label: 'Skill/Occupation', value: viewUserModal.skill_occupation || 'N/A', icon: Award },
                  { label: 'Profile Completed', value: viewUserModal.profile_completed ? 'Yes' : 'No', icon: Target },
                  { label: 'Is Active', value: viewUserModal.is_active ? 'Yes' : 'No', icon: Activity },
                  { label: 'Verified', value: viewUserModal.verified ? 'Yes' : 'No', icon: UserCheck },
                  { label: 'Login Count', value: viewUserModal.loginCount || 0, icon: Zap },
                  { label: 'Courses Enrolled', value: viewUserModal.courses || 0, icon: BookOpen },
                  { label: 'Completion Rate', value: `${viewUserModal.completionRate}%`, icon: Target },
                  { label: 'Created At', value: new Date(viewUserModal.created_at).toLocaleString(), icon: Calendar },
                  { label: 'Last Active', value: viewUserModal.lastActive, icon: Clock }
                ].map((field, index) => {
                  const Icon = field.icon;
                  return (
                    <div key={index} style={{
                      padding: '16px',
                      background: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Icon size={14} style={{ color: '#1f2937' }} />
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {field.label}
                        </span>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', wordBreak: 'break-all' }}>
                        {field.value}
                      </div>
                    </div>
                  );
                })}
                
                {/* Bio - Full Width */}
                <div style={{
                  gridColumn: '1 / -1',
                  padding: '16px',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <FileText size={14} style={{ color: '#1f2937' }} />
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Bio
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#0f172a', lineHeight: 1.6 }}>
                    {viewUserModal.bio || 'No bio provided'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editUserModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}
        onClick={() => setEditUserModal(null)}>
          <div style={{
            background: '#fff',
            borderRadius: '24px',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)'
          }}
          onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{
              padding: '32px',
              borderBottom: '2px solid #f1f5f9',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0, marginBottom: '4px' }}>
                    Edit User
                  </h2>
                  <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                    Update user information and save changes to database
                  </p>
                </div>
                <button
                  onClick={() => setEditUserModal(null)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    background: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fee2e2';
                    e.currentTarget.style.borderColor = '#ef4444';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}>
                  <X size={20} style={{ color: '#64748b' }} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                {/* Full Name */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.full_name}
                    onChange={(e) => setEditFormData({ ...editFormData, full_name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#1f2937'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>

                {/* First Name */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.first_name}
                    onChange={(e) => setEditFormData({ ...editFormData, first_name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#1f2937'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.last_name}
                    onChange={(e) => setEditFormData({ ...editFormData, last_name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#1f2937'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>

                {/* User Provided Email */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                    Email (User Provided)
                  </label>
                  <input
                    type="email"
                    value={editFormData.user_provided_email}
                    onChange={(e) => setEditFormData({ ...editFormData, user_provided_email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#1f2937'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>

                {/* Wallet Address */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                    Wallet Address
                  </label>
                  <input
                    type="text"
                    value={editFormData.wallet_address}
                    onChange={(e) => setEditFormData({ ...editFormData, wallet_address: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#1f2937'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>

                {/* Role */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                    Role
                  </label>
                  <select
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: '#fff',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#1f2937'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}>
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Country Code */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                    Country Code
                  </label>
                  <input
                    type="text"
                    value={editFormData.country_code}
                    onChange={(e) => setEditFormData({ ...editFormData, country_code: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#1f2937'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>

                {/* WhatsApp Number */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={editFormData.whatsapp_number}
                    onChange={(e) => setEditFormData({ ...editFormData, whatsapp_number: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#1f2937'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>

                {/* Skill/Occupation */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                    Skill/Occupation
                  </label>
                  <input
                    type="text"
                    value={editFormData.skill_occupation}
                    onChange={(e) => setEditFormData({ ...editFormData, skill_occupation: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#1f2937'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>

                {/* Is Active */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                    Account Status
                  </label>
                  <select
                    value={editFormData.is_active ? 'active' : 'inactive'}
                    onChange={(e) => setEditFormData({ ...editFormData, is_active: e.target.value === 'active' })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: '#fff',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#1f2937'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Bio - Full Width */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                    Bio
                  </label>
                  <textarea
                    value={editFormData.bio}
                    onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#1f2937'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '24px 32px',
              borderTop: '2px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              background: '#fafbfc'
            }}>
              <button
                onClick={() => setEditUserModal(null)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: '2px solid #e2e8f0',
                  background: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}>
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                disabled={saving}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  background: saving ? '#cbd5e1' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#fff',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: saving ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (!saving) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!saving) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                  }
                }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
