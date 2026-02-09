"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Bell, Send, Users, User, Globe, AlertCircle, CheckCircle, 
  Info, AlertTriangle, Megaphone, Trash2, Eye, EyeOff, Calendar,
  Clock, Target, TrendingUp
} from 'lucide-react';

export default function NotificationManagement() {
  const { userProfile, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('send'); // send, history
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);

  // Wait for auth to load and get email
  useEffect(() => {
    // Try to get email from userProfile first
    if (userProfile?.email) {
      setUserEmail(userProfile.email);
      setAuthLoading(false);
    } 
    // Fallback to localStorage
    else if (isAuthenticated) {
      try {
        const storedUser = localStorage.getItem('dagarmy_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log('📦 Loaded user from localStorage:', userData);
          if (userData.email) {
            setUserEmail(userData.email);
            setAuthLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error('Error reading localStorage:', error);
      }
      // If still no email after 2 seconds, stop loading
      setTimeout(() => setAuthLoading(false), 2000);
    } else {
      setAuthLoading(false);
    }
  }, [userProfile, isAuthenticated]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    priority: 'normal',
    targetType: 'global', // global, role, individual
    target_role: '',
    target_user_email: '',
    action_url: '',
    action_label: '',
    expires_in_days: ''
  });

  useEffect(() => {
    if (activeTab === 'history') {
      fetchNotifications();
    }
  }, [activeTab]);

  const fetchNotifications = async () => {
    if (!userEmail) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/notifications/admin?adminEmail=${encodeURIComponent(userEmail)}&status=all`);
      const data = await response.json();
      if (data.success) {
        setNotifications(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();

    // Validating user authentication

    if (!userEmail) {
      alert('Authentication error: Please refresh the page and try again. Your session may have expired.');
      return;
    }

    setSending(true);
    try {
      const payload = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        priority: formData.priority,
        sender_email: userEmail,
        action_url: formData.action_url || null,
        action_label: formData.action_label || null
      };

      console.log('Sending notification with payload:', payload);

      // Set targeting based on targetType
      if (formData.targetType === 'global') {
        payload.is_global = true;
      } else if (formData.targetType === 'role') {
        payload.target_role = formData.target_role;
      } else if (formData.targetType === 'individual') {
        // Get user ID from email
        payload.target_user_email = formData.target_user_email;
      }

      // Set expiration
      if (formData.expires_in_days) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + parseInt(formData.expires_in_days));
        payload.expires_at = expiresAt.toISOString();
      }

      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message || 'Notification sent successfully!');
        // Reset form
        setFormData({
          title: '',
          message: '',
          type: 'info',
          priority: 'normal',
          targetType: 'global',
          target_role: '',
          target_user_email: '',
          action_url: '',
          action_label: '',
          expires_in_days: ''
        });
        // Refresh history
        if (activeTab === 'history') {
          fetchNotifications();
        }
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;

    try {
      const response = await fetch(`/api/notifications/admin?id=${notificationId}&adminEmail=${encodeURIComponent(userEmail)}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        alert('Notification deleted');
        fetchNotifications();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      alert('Failed to delete notification');
    }
  };

  const handleToggleActive = async (notificationId, currentStatus) => {
    try {
      const response = await fetch('/api/notifications/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notification_id: notificationId,
          is_active: !currentStatus,
          admin_email: userEmail
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchNotifications();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error toggling notification:', error);
      alert('Failed to update notification');
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'success': return <CheckCircle size={20} />;
      case 'warning': return <AlertTriangle size={20} />;
      case 'error': return <AlertCircle size={20} />;
      case 'announcement': return <Megaphone size={20} />;
      default: return <Info size={20} />;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      case 'announcement': return '#8b5cf6';
      default: return '#3b82f6';
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      urgent: { bg: '#fee2e2', color: '#991b1b' },
      high: { bg: '#fed7aa', color: '#9a3412' },
      normal: { bg: '#dbeafe', color: '#1e40af' },
      low: { bg: '#e5e7eb', color: '#374151' }
    };
    const style = colors[priority] || colors.normal;
    return (
      <span style={{
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: '600',
        background: style.bg,
        color: style.color,
        textTransform: 'uppercase'
      }}>
        {priority}
      </span>
    );
  };

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div style={{ padding: '40px', background: '#f9fafb', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', color: '#6b7280', marginBottom: '8px' }}>Loading...</div>
          <div style={{ fontSize: '14px', color: '#9ca3af' }}>Authenticating user</div>
        </div>
      </div>
    );
  }

  // Show error if not authenticated
  if (!userEmail) {
    return (
      <div style={{ padding: '40px', background: '#f9fafb', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ 
          textAlign: 'center',
          padding: '40px',
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e5e7eb'
        }}>
          <AlertCircle size={48} style={{ color: '#ef4444', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
            Authentication Required
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
            Please log in to access notification management.
          </p>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '16px' }}>
            Debug: userProfile={userProfile ? 'exists' : 'null'}, isAuthenticated={isAuthenticated ? 'true' : 'false'}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', background: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '800', 
          color: '#111827',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Bell size={36} style={{ color: '#6366f1' }} />
          Notification Management
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280' }}>
          Send notifications to students globally or individually
        </p>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '32px',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '12px'
      }}>
        {[
          { id: 'send', label: 'Send Notification', icon: <Send size={18} /> },
          { id: 'history', label: 'Notification History', icon: <Clock size={18} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === tab.id 
                ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' 
                : '#fff',
              color: activeTab === tab.id ? '#fff' : '#6b7280',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTab === tab.id 
                ? '0 4px 12px rgba(99, 102, 241, 0.25)' 
                : 'none'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Send Notification Tab */}
      {activeTab === 'send' && (
        <div style={{ 
          background: '#fff', 
          borderRadius: '16px', 
          padding: '32px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e5e7eb'
        }}>
          <form onSubmit={handleSendNotification}>
            {/* Target Type Selection */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#111827',
                marginBottom: '12px'
              }}>
                Send To *
              </label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[
                  { value: 'global', label: 'All Users', icon: <Globe size={18} /> },
                  { value: 'role', label: 'Specific Role', icon: <Users size={18} /> },
                  { value: 'individual', label: 'Individual User', icon: <User size={18} /> }
                ].map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, targetType: option.value })}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '10px',
                      border: '2px solid',
                      borderColor: formData.targetType === option.value ? '#6366f1' : '#e5e7eb',
                      background: formData.targetType === option.value ? '#f0f9ff' : '#fff',
                      color: formData.targetType === option.value ? '#6366f1' : '#6b7280',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Role Selection (if role is selected) */}
            {formData.targetType === 'role' && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#111827',
                  marginBottom: '8px'
                }}>
                  Select Role *
                </label>
                <select
                  value={formData.target_role}
                  onChange={(e) => setFormData({ ...formData, target_role: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                >
                  <option value="">-- Select a role --</option>
                  <option value="student">Students</option>
                  <option value="trainer">Trainers</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            )}

            {/* Individual User Email (if individual is selected) */}
            {formData.targetType === 'individual' && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#111827',
                  marginBottom: '8px'
                }}>
                  User Email *
                </label>
                <input
                  type="email"
                  value={formData.target_user_email}
                  onChange={(e) => setFormData({ ...formData, target_user_email: e.target.value })}
                  required
                  placeholder="user@example.com"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
            )}

            {/* Notification Type & Priority */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#111827',
                  marginBottom: '8px'
                }}>
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="announcement">Announcement</option>
                </select>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#111827',
                  marginBottom: '8px'
                }}>
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Title */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#111827',
                marginBottom: '8px'
              }}>
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g., New Assignment Posted"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Message */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#111827',
                marginBottom: '8px'
              }}>
                Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={4}
                placeholder="Enter your notification message..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Action URL & Label (Optional) */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#111827',
                  marginBottom: '8px'
                }}>
                  Action URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.action_url}
                  onChange={(e) => setFormData({ ...formData, action_url: e.target.value })}
                  placeholder="/student-assignments"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#111827',
                  marginBottom: '8px'
                }}>
                  Action Label (Optional)
                </label>
                <input
                  type="text"
                  value={formData.action_label}
                  onChange={(e) => setFormData({ ...formData, action_label: e.target.value })}
                  placeholder="View Assignment"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Expiration */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#111827',
                marginBottom: '8px'
              }}>
                Expires In (Days) - Optional
              </label>
              <input
                type="number"
                value={formData.expires_in_days}
                onChange={(e) => setFormData({ ...formData, expires_in_days: e.target.value })}
                min="1"
                placeholder="Leave empty for no expiration"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={sending}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: 'none',
                background: sending 
                  ? '#d1d5db' 
                  : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '700',
                cursor: sending ? 'not-allowed' : 'pointer',
                boxShadow: sending ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.3)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Send size={20} />
              {sending ? 'Sending Notification...' : 'Send Notification'}
            </button>
          </form>
        </div>
      )}

      {/* Notification History Tab */}
      {activeTab === 'history' && (
        <div style={{ 
          background: '#fff', 
          borderRadius: '16px', 
          padding: '32px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e5e7eb'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '16px', color: '#6b7280' }}>Loading notifications...</div>
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Bell size={64} style={{ color: '#d1d5db', margin: '0 auto 24px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                No Notifications Yet
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                Send your first notification to get started
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  style={{
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    background: notif.is_active ? '#fff' : '#f9fafb',
                    opacity: notif.is_active ? 1 : 0.6
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ color: getTypeColor(notif.type) }}>
                          {getTypeIcon(notif.type)}
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: 0 }}>
                          {notif.title}
                        </h3>
                        {getPriorityBadge(notif.priority)}
                      </div>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 12px 0' }}>
                        {notif.message}
                      </p>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#9ca3af' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Target size={14} />
                          {notif.is_global ? 'Global' : notif.target_role ? `Role: ${notif.target_role}` : 'Individual'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Users size={14} />
                          {notif.total_recipients} recipients
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <TrendingUp size={14} />
                          {notif.total_read} read
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={14} />
                          {new Date(notif.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleToggleActive(notif.id, notif.is_active)}
                        style={{
                          padding: '8px',
                          borderRadius: '8px',
                          border: 'none',
                          background: '#f3f4f6',
                          color: '#6b7280',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title={notif.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {notif.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => handleDeleteNotification(notif.id)}
                        style={{
                          padding: '8px',
                          borderRadius: '8px',
                          border: 'none',
                          background: '#fee2e2',
                          color: '#ef4444',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
