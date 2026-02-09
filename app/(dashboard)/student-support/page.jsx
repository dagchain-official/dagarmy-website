"use client";
import React, { useState } from "react";
import DashboardNav2 from "@/components/dashboard/DashboardNav2";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import { HelpCircle, MessageCircle, Mail, Phone, Book, Video, FileText, Send, Search, ChevronRight } from "lucide-react";

export default function StudentSupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const supportCategories = [
    {
      id: 1,
      icon: Book,
      title: "Getting Started",
      description: "Learn the basics and set up your account",
      color: "#6366f1",
      articles: 12
    },
    {
      id: 2,
      icon: Video,
      title: "Course Access",
      description: "Issues with accessing courses and materials",
      color: "#10b981",
      articles: 8
    },
    {
      id: 3,
      icon: FileText,
      title: "Assignments & Grades",
      description: "Help with submissions and grading",
      color: "#f59e0b",
      articles: 15
    },
    {
      id: 4,
      icon: MessageCircle,
      title: "Technical Issues",
      description: "Troubleshoot platform problems",
      color: "#ef4444",
      articles: 10
    },
  ];

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "Go to Settings > Security and click 'Change Password'. You'll receive a verification email.",
      category: "Getting Started"
    },
    {
      question: "Can I download course materials?",
      answer: "Yes! Click the download icon next to any course material to save it for offline viewing.",
      category: "Course Access"
    },
    {
      question: "How are assignments graded?",
      answer: "Assignments are graded by instructors within 5-7 business days. You'll receive a notification when your grade is posted.",
      category: "Assignments & Grades"
    },
    {
      question: "What if I miss a deadline?",
      answer: "Contact your instructor immediately. Late submissions may be accepted with a valid reason.",
      category: "Assignments & Grades"
    },
    {
      question: "How do I earn DAG Points?",
      answer: "Complete courses, assignments, participate in discussions, and refer friends to earn points.",
      category: "Getting Started"
    },
  ];

  const recentTickets = [
    {
      id: "TKT-1234",
      subject: "Cannot access Week 5 materials",
      status: "In Progress",
      date: "2 hours ago",
      priority: "High"
    },
    {
      id: "TKT-1233",
      subject: "Grade inquiry for ML assignment",
      status: "Resolved",
      date: "1 day ago",
      priority: "Medium"
    },
  ];

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
              overflowY: "auto",
              background: "#fff"
            }}>
              <DashboardNav2 />
            </div>
            
            <div style={{ flex: 1, padding: "40px", background: "#f9fafb" }}>
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
                  <HelpCircle size={36} style={{ color: '#6366f1' }} />
                  Support Center
                </h1>
                <p style={{ fontSize: '16px', color: '#6b7280' }}>
                  Get help and find answers to your questions
                </p>
              </div>

              {/* Search Bar */}
              <div style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '32px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: '1px solid #e5e7eb'
              }}>
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
                    placeholder="Search for help articles, FAQs, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '16px 16px 16px 48px',
                      borderRadius: '12px',
                      border: '2px solid #e5e7eb',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#6366f1';
                      e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Quick Contact Options */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                marginBottom: '32px'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  borderRadius: '16px',
                  padding: '24px',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(99, 102, 241, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
                }}
                >
                  <MessageCircle size={32} style={{ marginBottom: '12px' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Live Chat</h3>
                  <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '12px' }}>
                    Chat with our support team in real-time
                  </p>
                  <div style={{ fontSize: '13px', opacity: 0.8 }}>Available 24/7</div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '16px',
                  padding: '24px',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                }}
                >
                  <Mail size={32} style={{ marginBottom: '12px' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Email Support</h3>
                  <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '12px' }}>
                    Send us an email and we'll respond within 24 hours
                  </p>
                  <div style={{ fontSize: '13px', opacity: 0.8 }}>support@dagarmy.network</div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  borderRadius: '16px',
                  padding: '24px',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(245, 158, 11, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
                }}
                >
                  <Phone size={32} style={{ marginBottom: '12px' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Phone Support</h3>
                  <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '12px' }}>
                    Call us for urgent issues
                  </p>
                  <div style={{ fontSize: '13px', opacity: 0.8 }}>Mon-Fri, 9AM-6PM EST</div>
                </div>
              </div>

              {/* Support Categories */}
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                  Browse by Category
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '16px'
                }}>
                  {supportCategories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <div
                        key={category.id}
                        style={{
                          background: '#fff',
                          borderRadius: '16px',
                          padding: '24px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                          border: '1px solid #e5e7eb',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                          e.currentTarget.style.transform = 'translateY(-4px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: `${category.color}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '16px'
                        }}>
                          <Icon size={24} style={{ color: category.color }} />
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                          {category.title}
                        </h3>
                        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                          {category.description}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '13px', color: '#9ca3af' }}>
                            {category.articles} articles
                          </span>
                          <ChevronRight size={20} style={{ color: category.color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FAQs */}
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                  Frequently Asked Questions
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      style={{
                        background: '#fff',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        border: '1px solid #e5e7eb',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                        <HelpCircle size={20} style={{ color: '#6366f1', marginTop: '2px', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                            {faq.question}
                          </h3>
                          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', lineHeight: '1.6' }}>
                            {faq.answer}
                          </p>
                          <span style={{
                            fontSize: '12px',
                            color: '#9ca3af',
                            fontWeight: '600'
                          }}>
                            Category: {faq.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Tickets */}
              <div style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: 0 }}>
                    Your Recent Tickets
                  </h2>
                  <button style={{
                    padding: '10px 20px',
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
                  }}>
                    <Send size={16} />
                    New Ticket
                  </button>
                </div>
                
                {recentTickets.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>No support tickets yet</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {recentTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        style={{
                          padding: '16px',
                          borderRadius: '12px',
                          background: '#f9fafb',
                          border: '1px solid #e5e7eb',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f3f4f6';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#f9fafb';
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                            {ticket.subject}
                          </div>
                          <div style={{ fontSize: '13px', color: '#6b7280' }}>
                            {ticket.id} • {ticket.date}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: ticket.priority === 'High' ? '#fee2e2' : '#fef3c7',
                            color: ticket.priority === 'High' ? '#dc2626' : '#d97706'
                          }}>
                            {ticket.priority}
                          </span>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: ticket.status === 'Resolved' ? '#dcfce7' : '#dbeafe',
                            color: ticket.status === 'Resolved' ? '#16a34a' : '#2563eb'
                          }}>
                            {ticket.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer1 />
    </div>
  );
}
