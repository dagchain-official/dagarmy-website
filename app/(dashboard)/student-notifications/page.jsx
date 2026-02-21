"use client";
import React, { useState } from "react";
import DashboardNav2 from "@/components/dashboard/DashboardNav2";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import { Bell, CheckCircle, AlertCircle, Info, Award, BookOpen, Users, Settings, Trash2 } from "lucide-react";

export default function StudentNotificationsPage() {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Assignment Submitted Successfully',
      message: 'Your "Neural Network Project" has been submitted and is under review.',
      time: '5 minutes ago',
      read: false,
      icon: CheckCircle,
      color: '#10b981'
    },
    {
      id: 2,
      type: 'info',
      title: 'New Course Material Available',
      message: 'Week 5 materials for "Blockchain Development" are now available.',
      time: '1 hour ago',
      read: false,
      icon: BookOpen,
      color: '#6366f1'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: 'You earned the "Quick Learner" badge for completing 5 courses.',
      time: '3 hours ago',
      read: false,
      icon: Award,
      color: '#f59e0b'
    },
    {
      id: 4,
      type: 'warning',
      title: 'Assignment Due Soon',
      message: 'Your "Smart Contract Development" assignment is due in 2 days.',
      time: '5 hours ago',
      read: true,
      icon: AlertCircle,
      color: '#f59e0b'
    },
    {
      id: 5,
      type: 'info',
      title: 'New Discussion Reply',
      message: 'Sarah Johnson replied to your question in "AI Fundamentals" forum.',
      time: '1 day ago',
      read: true,
      icon: Users,
      color: '#6366f1'
    },
    {
      id: 6,
      type: 'success',
      title: 'Grade Posted',
      message: 'Your grade for "Machine Learning Model Evaluation" is now available: 95%',
      time: '2 days ago',
      read: true,
      icon: CheckCircle,
      color: '#10b981'
    },
    {
      id: 7,
      type: 'info',
      title: 'Live Session Reminder',
      message: 'Live Q&A session for "Data Visualization" starts in 30 minutes.',
      time: '3 days ago',
      read: true,
      icon: Info,
      color: '#6366f1'
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === filter);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div id="wrapper">
      <Header2 />
      <div className="main-content pt-0">
        <div className="page-inner" style={{ padding: "0" }}>
          <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
            <div style={{ 
              width: "240px", 
              flexShrink: 0,
              padding: "24px 16px",
              position: "sticky",
              top: "0",
              height: "100vh",
              overflowY: "auto"
            }}>
              <DashboardNav2 />
            </div>
            
            <div style={{ flex: 1, padding: "40px", background: "#f9fafb" }}>
              {/* Header */}
              <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
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
                    Notifications
                    {unreadCount > 0 && (
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        background: '#ef4444',
                        color: '#fff',
                        fontSize: '16px',
                        fontWeight: '700'
                      }}>
                        {unreadCount}
                      </span>
                    )}
                  </h1>
                  <p style={{ fontSize: '16px', color: '#6b7280' }}>
                    Stay updated with your learning activities
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <CheckCircle size={18} />
                    Mark All as Read
                  </button>
                )}
              </div>

              {/* Filter Tabs */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '24px',
                flexWrap: 'wrap'
              }}>
                {[
                  { key: 'all', label: 'All', count: notifications.length },
                  { key: 'unread', label: 'Unread', count: unreadCount },
                  { key: 'success', label: 'Success', count: notifications.filter(n => n.type === 'success').length },
                  { key: 'info', label: 'Info', count: notifications.filter(n => n.type === 'info').length },
                  { key: 'achievement', label: 'Achievements', count: notifications.filter(n => n.type === 'achievement').length },
                  { key: 'warning', label: 'Warnings', count: notifications.filter(n => n.type === 'warning').length },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: 'none',
                      background: filter === tab.key ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : '#fff',
                      color: filter === tab.key ? '#fff' : '#6b7280',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: filter === tab.key ? '0 4px 12px rgba(99, 102, 241, 0.25)' : '0 2px 4px rgba(0,0,0,0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {tab.label}
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: filter === tab.key ? 'rgba(255,255,255,0.2)' : '#f3f4f6',
                      fontSize: '12px',
                      fontWeight: '700'
                    }}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Notifications List */}
              {filteredNotifications.length === 0 ? (
                <div style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '60px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                  <Bell size={64} style={{ color: '#d1d5db', margin: '0 auto 16px' }} />
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                    No notifications
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    You're all caught up! Check back later for updates.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {filteredNotifications.map((notification) => {
                    const Icon = notification.icon;
                    return (
                      <div
                        key={notification.id}
                        style={{
                          background: notification.read ? '#fff' : '#f0f9ff',
                          borderRadius: '16px',
                          padding: '20px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                          border: notification.read ? '1px solid #e5e7eb' : '2px solid #6366f1',
                          transition: 'all 0.2s',
                          cursor: 'pointer',
                          position: 'relative'
                        }}
                        onClick={() => !notification.read && markAsRead(notification.id)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        {!notification.read && (
                          <div style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: '#6366f1',
                            boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.2)'
                          }} />
                        )}
                        
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: `${notification.color}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <Icon size={24} style={{ color: notification.color }} />
                          </div>
                          
                          <div style={{ flex: 1 }}>
                            <h3 style={{ 
                              fontSize: '16px', 
                              fontWeight: '700', 
                              color: '#111827', 
                              marginBottom: '4px' 
                            }}>
                              {notification.title}
                            </h3>
                            <p style={{ 
                              fontSize: '14px', 
                              color: '#6b7280', 
                              marginBottom: '8px',
                              lineHeight: '1.5'
                            }}>
                              {notification.message}
                            </p>
                            <div style={{ 
                              fontSize: '13px', 
                              color: '#9ca3af',
                              fontWeight: '500'
                            }}>
                              {notification.time}
                            </div>
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            style={{
                              padding: '8px',
                              borderRadius: '8px',
                              border: 'none',
                              background: 'transparent',
                              color: '#9ca3af',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#fee2e2';
                              e.currentTarget.style.color = '#ef4444';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = '#9ca3af';
                            }}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Notification Settings */}
              <div style={{
                marginTop: '32px',
                background: '#fff',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <Settings size={24} style={{ color: '#6366f1' }} />
                  <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: 0 }}>
                    Notification Preferences
                  </h2>
                </div>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
                  Customize how you receive notifications
                </p>
                <button style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: '1px solid #e5e7eb',
                  background: '#fff',
                  color: '#6b7280',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f9fafb';
                  e.currentTarget.style.borderColor = '#6366f1';
                  e.currentTarget.style.color = '#6366f1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.color = '#6b7280';
                }}
                >
                  Manage Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer1 />
    </div>
  );
}
