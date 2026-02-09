"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Bell, X, Check, Info, AlertCircle, CheckCircle, 
  AlertTriangle, Megaphone, ExternalLink
} from 'lucide-react';

export default function NotificationBell() {
  const { userProfile } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile?.email) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [userProfile]);

  const fetchNotifications = async () => {
    if (!userProfile?.email) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/notifications/user?email=${encodeURIComponent(userProfile.email)}`);
      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.data.notifications || []);
        setUnreadCount(data.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (recipientId) => {
    try {
      const response = await fetch('/api/notifications/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient_id: recipientId,
          action: 'read',
          user_email: userProfile.email
        })
      });

      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDismiss = async (recipientId) => {
    try {
      const response = await fetch('/api/notifications/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient_id: recipientId,
          action: 'dismiss',
          user_email: userProfile.email
        })
      });

      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error dismissing notification:', error);
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
      case 'success': return { bg: '#dcfce7', color: '#166534', border: '#86efac' };
      case 'warning': return { bg: '#fef3c7', color: '#92400e', border: '#fbbf24' };
      case 'error': return { bg: '#fee2e2', color: '#991b1b', border: '#fecaca' };
      case 'announcement': return { bg: '#f3e8ff', color: '#6b21a8', border: '#d8b4fe' };
      default: return { bg: '#dbeafe', color: '#1e40af', border: '#93c5fd' };
    }
  };

  const visibleNotifications = notifications.filter(n => !n.is_dismissed).slice(0, 5);

  return (
    <div style={{ position: 'relative' }}>
      {/* Bell Icon */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          position: 'relative',
          padding: '8px',
          borderRadius: '8px',
          border: 'none',
          background: showDropdown ? '#f3f4f6' : 'transparent',
          color: '#6b7280',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          if (!showDropdown) e.currentTarget.style.background = '#f3f4f6';
        }}
        onMouseLeave={(e) => {
          if (!showDropdown) e.currentTarget.style.background = 'transparent';
        }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: '#ef4444',
            color: '#fff',
            fontSize: '10px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowDropdown(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 998
            }}
          />

          {/* Dropdown Panel */}
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '400px',
            maxHeight: '500px',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            border: '1px solid #e5e7eb',
            zIndex: 999,
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              padding: '16px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: 0 }}>
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  background: '#dbeafe',
                  color: '#1e40af',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {unreadCount} new
                </span>
              )}
            </div>

            {/* Notifications List */}
            <div style={{
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                  Loading...
                </div>
              ) : visibleNotifications.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <Bell size={48} style={{ color: '#d1d5db', margin: '0 auto 16px' }} />
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    No notifications yet
                  </p>
                </div>
              ) : (
                visibleNotifications.map((item) => {
                  const notif = item.notification;
                  const colors = getTypeColor(notif.type);
                  
                  return (
                    <div
                      key={item.id}
                      style={{
                        padding: '16px',
                        borderBottom: '1px solid #f3f4f6',
                        background: item.is_read ? '#fff' : '#f9fafb',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                      onMouseLeave={(e) => e.currentTarget.style.background = item.is_read ? '#fff' : '#f9fafb'}
                    >
                      <div style={{ display: 'flex', gap: '12px' }}>
                        {/* Icon */}
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: colors.bg,
                          color: colors.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {getTypeIcon(notif.type)}
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '4px' }}>
                            <h4 style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#111827',
                              margin: 0
                            }}>
                              {notif.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDismiss(item.id);
                              }}
                              style={{
                                padding: '4px',
                                borderRadius: '4px',
                                border: 'none',
                                background: 'transparent',
                                color: '#9ca3af',
                                cursor: 'pointer',
                                flexShrink: 0
                              }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                          
                          <p style={{
                            fontSize: '13px',
                            color: '#6b7280',
                            margin: '0 0 8px 0',
                            lineHeight: '1.4'
                          }}>
                            {notif.message}
                          </p>

                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                              {new Date(item.created_at).toLocaleDateString()}
                            </span>
                            
                            {!item.is_read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(item.id);
                                }}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  background: '#dbeafe',
                                  color: '#1e40af',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <Check size={12} />
                                Mark as read
                              </button>
                            )}

                            {notif.action_url && notif.action_label && (
                              <a
                                href={notif.action_url}
                                onClick={() => setShowDropdown(false)}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  background: '#6366f1',
                                  color: '#fff',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  textDecoration: 'none',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                {notif.action_label}
                                <ExternalLink size={12} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {visibleNotifications.length > 0 && (
              <div style={{
                padding: '12px 16px',
                borderTop: '1px solid #e5e7eb',
                textAlign: 'center'
              }}>
                <a
                  href="/student-notifications"
                  onClick={() => setShowDropdown(false)}
                  style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#6366f1',
                    textDecoration: 'none'
                  }}
                >
                  View All Notifications
                </a>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
