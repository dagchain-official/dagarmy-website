"use client";
import React, { useState } from "react";
import DashboardNav2 from "@/components/dashboard/DashboardNav2";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import { FileText, Clock, CheckCircle, AlertCircle, Calendar, Download } from "lucide-react";

export default function StudentAssignmentsPage() {
  const [filter, setFilter] = useState('all');

  const assignments = [
    {
      id: 1,
      title: "Build a Neural Network from Scratch",
      course: "AI & Machine Learning",
      dueDate: "2026-02-10",
      status: "pending",
      priority: "high",
      points: 100,
      description: "Create a basic neural network using Python and NumPy",
      submitted: false,
    },
    {
      id: 2,
      title: "Smart Contract Development",
      course: "Blockchain Basics",
      dueDate: "2026-02-08",
      status: "in-progress",
      priority: "medium",
      points: 80,
      description: "Develop and deploy a simple smart contract on Ethereum testnet",
      submitted: false,
    },
    {
      id: 3,
      title: "Data Visualization Dashboard",
      course: "Data Visualization",
      dueDate: "2026-02-15",
      status: "pending",
      priority: "low",
      points: 60,
      description: "Create an interactive dashboard using D3.js or Chart.js",
      submitted: false,
    },
    {
      id: 4,
      title: "Machine Learning Model Evaluation",
      course: "AI & Machine Learning",
      dueDate: "2026-01-28",
      status: "completed",
      priority: "high",
      points: 100,
      description: "Evaluate different ML models and compare their performance",
      submitted: true,
      grade: 95,
    },
  ];

  const filteredAssignments = filter === 'all' 
    ? assignments 
    : assignments.filter(a => a.status === filter);

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#f59e0b';
      case 'pending': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
                  <FileText size={36} style={{ color: '#6366f1' }} />
                  My Assignments
                </h1>
                <p style={{ fontSize: '16px', color: '#6b7280' }}>
                  Track and manage your course assignments
                </p>
              </div>

              {/* Stats Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '32px'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  borderRadius: '16px',
                  padding: '24px',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                }}>
                  <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Total Assignments</div>
                  <div style={{ fontSize: '36px', fontWeight: '800' }}>{assignments.length}</div>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  borderRadius: '16px',
                  padding: '24px',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                }}>
                  <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>In Progress</div>
                  <div style={{ fontSize: '36px', fontWeight: '800' }}>
                    {assignments.filter(a => a.status === 'in-progress').length}
                  </div>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '16px',
                  padding: '24px',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}>
                  <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Completed</div>
                  <div style={{ fontSize: '36px', fontWeight: '800' }}>
                    {assignments.filter(a => a.status === 'completed').length}
                  </div>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  borderRadius: '16px',
                  padding: '24px',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                }}>
                  <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Pending</div>
                  <div style={{ fontSize: '36px', fontWeight: '800' }}>
                    {assignments.filter(a => a.status === 'pending').length}
                  </div>
                </div>
              </div>

              {/* Filter Tabs */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '24px',
                borderBottom: '2px solid #e5e7eb',
                paddingBottom: '12px'
              }}>
                {['all', 'pending', 'in-progress', 'completed'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: 'none',
                      background: filter === tab ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : '#fff',
                      color: filter === tab ? '#fff' : '#6b7280',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textTransform: 'capitalize',
                      boxShadow: filter === tab ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none'
                    }}
                  >
                    {tab.replace('-', ' ')}
                  </button>
                ))}
              </div>

              {/* Assignments List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredAssignments.map((assignment) => {
                  const daysRemaining = getDaysRemaining(assignment.dueDate);
                  const isOverdue = daysRemaining < 0 && assignment.status !== 'completed';
                  
                  return (
                    <div
                      key={assignment.id}
                      style={{
                        background: '#fff',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        border: '1px solid #e5e7eb',
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: 0 }}>
                              {assignment.title}
                            </h3>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '11px',
                              fontWeight: '600',
                              background: `${getPriorityColor(assignment.priority)}20`,
                              color: getPriorityColor(assignment.priority),
                              textTransform: 'uppercase'
                            }}>
                              {assignment.priority}
                            </span>
                          </div>
                          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 12px 0' }}>
                            {assignment.description}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#6b7280' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <FileText size={16} />
                              {assignment.course}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Calendar size={16} />
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </span>
                            {assignment.status !== 'completed' && (
                              <span style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '6px',
                                color: isOverdue ? '#ef4444' : daysRemaining <= 3 ? '#f59e0b' : '#10b981',
                                fontWeight: '600'
                              }}>
                                <Clock size={16} />
                                {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days left`}
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                          <div style={{
                            padding: '8px 16px',
                            borderRadius: '10px',
                            background: `${getStatusColor(assignment.status)}20`,
                            color: getStatusColor(assignment.status),
                            fontSize: '13px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            textTransform: 'capitalize'
                          }}>
                            {assignment.status === 'completed' && <CheckCircle size={16} />}
                            {assignment.status === 'in-progress' && <Clock size={16} />}
                            {assignment.status === 'pending' && <AlertCircle size={16} />}
                            {assignment.status.replace('-', ' ')}
                          </div>
                          <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>
                            {assignment.points} Points
                          </div>
                          {assignment.submitted && assignment.grade && (
                            <div style={{
                              padding: '8px 16px',
                              borderRadius: '10px',
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              color: '#fff',
                              fontSize: '16px',
                              fontWeight: '700'
                            }}>
                              Grade: {assignment.grade}%
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                        {assignment.status !== 'completed' && (
                          <>
                            <button style={{
                              flex: 1,
                              padding: '12px',
                              borderRadius: '10px',
                              border: '1px solid #e5e7eb',
                              background: '#fff',
                              color: '#6b7280',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px'
                            }}>
                              <Download size={16} />
                              Download Materials
                            </button>
                            <button style={{
                              flex: 1,
                              padding: '12px',
                              borderRadius: '10px',
                              border: 'none',
                              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                              color: '#fff',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
                            }}>
                              {assignment.status === 'in-progress' ? 'Continue Working' : 'Start Assignment'}
                            </button>
                          </>
                        )}
                        {assignment.status === 'completed' && (
                          <button style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '10px',
                            border: 'none',
                            background: '#f3f4f6',
                            color: '#6b7280',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                          }}>
                            <CheckCircle size={16} />
                            View Submission
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer1 />
    </div>
  );
}
