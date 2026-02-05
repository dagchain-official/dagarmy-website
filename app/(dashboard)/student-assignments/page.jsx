"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardNav2 from "@/components/dashboard/DashboardNav2";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import { 
  FileText, Clock, CheckCircle, AlertCircle, Calendar, Download, 
  Upload, File, X, Check, BookOpen, Code, Database, Cloud, Loader
} from "lucide-react";

export default function StudentAssignmentsPage() {
  const { userProfile } = useAuth();
  const [filter, setFilter] = useState('all');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch assignments from database
  useEffect(() => {
    const fetchAssignments = async () => {
      if (!userProfile?.email) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/assignments/student?email=${encodeURIComponent(userProfile.email)}`);
        const data = await response.json();

        if (data.success && data.data.assignments) {
          // Transform assignments to match UI format
          const transformedAssignments = data.data.assignments.map(assignment => ({
            id: assignment.id,
            title: assignment.title,
            module: assignment.modules?.title || 'General',
            moduleNumber: assignment.modules?.module_number,
            track: assignment.modules?.track,
            course: assignment.courses?.title,
            batch: assignment.batches?.batch_name,
            dueDate: assignment.due_date,
            status: assignment.submission?.status || 'pending',
            priority: getDaysRemaining(assignment.due_date) <= 3 ? 'high' : getDaysRemaining(assignment.due_date) <= 7 ? 'medium' : 'low',
            points: assignment.total_points,
            description: assignment.description,
            requirements: assignment.requirements || [],
            acceptedFormats: assignment.accepted_formats || [".pdf", ".zip", ".docx"],
            submitted: assignment.has_submitted,
            submission: assignment.submission,
            icon: getModuleIcon(assignment.modules?.track)
          }));
          setAssignments(transformedAssignments);
        } else {
          setError(data.error || 'Failed to fetch assignments');
        }
      } catch (err) {
        console.error('Error fetching assignments:', err);
        setError('Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [userProfile]);

  const getModuleIcon = (track) => {
    switch(track?.toLowerCase()) {
      case 'cloud': return <Cloud size={24} />;
      case 'code': return <Code size={24} />;
      case 'database': return <Database size={24} />;
      default: return <BookOpen size={24} />;
    }
  };

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredAssignments = filter === 'all' 
    ? assignments 
    : assignments.filter(a => a.status === filter);

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return '#10b981';
      case 'submitted': return '#3b82f6';
      case 'graded': return '#8b5cf6';
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


  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    addFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const addFiles = (files) => {
    const validFiles = files.filter(file => {
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      return selectedAssignment.acceptedFormats.includes(ext);
    });

    const newFiles = validFiles.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      id: Math.random().toString(36).substr(2, 9)
    }));

    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSubmit = async () => {
    if (uploadedFiles.length === 0) {
      alert('Please upload at least one file');
      return;
    }

    if (!userProfile?.email) {
      alert('Please log in to submit assignments.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Upload files to Supabase Storage
      const uploadedFileData = [];
      
      for (const fileObj of uploadedFiles) {
        const formData = new FormData();
        formData.append('file', fileObj.file);
        formData.append('assignmentId', selectedAssignment.id);
        formData.append('studentEmail', userProfile.email);

        const uploadResponse = await fetch('/api/assignments/upload', {
          method: 'POST',
          body: formData
        });

        const uploadData = await uploadResponse.json();
        
        if (uploadData.success) {
          uploadedFileData.push(uploadData.data);
        } else {
          throw new Error(`Failed to upload ${fileObj.name}: ${uploadData.error}`);
        }
      }

      // Extract URLs, names, and sizes from uploaded files
      const fileUrls = uploadedFileData.map(f => f.url);
      const fileNames = uploadedFileData.map(f => f.fileName);
      const fileSizes = uploadedFileData.map(f => f.fileSize);

      const response = await fetch('/api/assignments/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignment_id: selectedAssignment.id,
          student_email: userProfile.email,
          submission_notes: submissionNotes,
          file_urls: fileUrls,
          file_names: fileNames,
          file_sizes: fileSizes
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Assignment submitted successfully! Your trainer will review it soon.');
        setSelectedAssignment(null);
        setUploadedFiles([]);
        setSubmissionNotes('');
        
        // Refresh assignments to show updated status
        const refreshResponse = await fetch(`/api/assignments/student?email=${encodeURIComponent(userProfile.email)}`);
        const refreshData = await refreshResponse.json();
        if (refreshData.success && refreshData.data.assignments) {
          const transformedAssignments = refreshData.data.assignments.map(assignment => ({
            id: assignment.id,
            title: assignment.title,
            module: assignment.modules?.title || 'General',
            moduleNumber: assignment.modules?.module_number,
            track: assignment.modules?.track,
            course: assignment.courses?.title,
            batch: assignment.batches?.batch_name,
            dueDate: assignment.due_date,
            status: assignment.submission?.status || 'pending',
            priority: getDaysRemaining(assignment.due_date) <= 3 ? 'high' : getDaysRemaining(assignment.due_date) <= 7 ? 'medium' : 'low',
            points: assignment.total_points,
            description: assignment.description,
            requirements: assignment.requirements || [],
            acceptedFormats: assignment.accepted_formats || [".pdf", ".zip", ".docx"],
            submitted: assignment.has_submitted,
            submission: assignment.submission,
            icon: getModuleIcon(assignment.modules?.track)
          }));
          setAssignments(transformedAssignments);
        }
      } else {
        alert(`Submission failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Failed to submit assignment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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

              {/* Loading State */}
              {loading && (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center',
                  padding: '60px 20px',
                  background: '#fff',
                  borderRadius: '16px',
                  border: '1px solid #e5e7eb'
                }}>
                  <Loader size={48} style={{ color: '#6366f1', animation: 'spin 1s linear infinite' }} />
                  <p style={{ marginTop: '16px', fontSize: '16px', color: '#6b7280' }}>Loading assignments...</p>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div style={{ 
                  padding: '40px',
                  background: '#fee2e2',
                  borderRadius: '16px',
                  border: '1px solid #fecaca',
                  textAlign: 'center'
                }}>
                  <AlertCircle size={48} style={{ color: '#ef4444', margin: '0 auto 16px' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#991b1b', marginBottom: '8px' }}>
                    Failed to Load Assignments
                  </h3>
                  <p style={{ fontSize: '14px', color: '#dc2626' }}>{error}</p>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && filteredAssignments.length === 0 && (
                <div style={{ 
                  padding: '60px 20px',
                  background: '#fff',
                  borderRadius: '16px',
                  border: '2px dashed #d1d5db',
                  textAlign: 'center'
                }}>
                  <FileText size={64} style={{ color: '#d1d5db', margin: '0 auto 24px' }} />
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                    No Assignments Yet
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    {filter === 'all' 
                      ? 'Your trainer hasn\'t assigned any assignments yet. Check back later!'
                      : `No ${filter.replace('-', ' ')} assignments found.`}
                  </p>
                </div>
              )}

              {/* Assignments List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {!loading && !error && filteredAssignments.map((assignment) => {
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
                      
                      {/* Requirements List */}
                      <div style={{ 
                        marginTop: '16px', 
                        padding: '16px', 
                        background: '#f9fafb', 
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                          Requirements:
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#6b7280' }}>
                          {assignment.requirements.map((req, idx) => (
                            <li key={idx} style={{ marginBottom: '6px' }}>{req}</li>
                          ))}
                        </ul>
                        <div style={{ marginTop: '12px', fontSize: '12px', color: '#9ca3af' }}>
                          <strong>Accepted formats:</strong> {assignment.acceptedFormats.join(', ')}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                        <button 
                          onClick={() => setSelectedAssignment(assignment)}
                          style={{
                            flex: 1,
                            padding: '14px',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            color: '#fff',
                            fontSize: '15px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
                          }}
                        >
                          <Upload size={18} />
                          Submit Assignment
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File Upload Modal */}
      {selectedAssignment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}
        onClick={() => {
          setSelectedAssignment(null);
          setUploadedFiles([]);
          setSubmissionNotes('');
        }}
        >
          <div 
            style={{
              background: '#fff',
              borderRadius: '20px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '32px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  {selectedAssignment.icon}
                  <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', margin: 0 }}>
                    Submit Assignment
                  </h2>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#6366f1', margin: '8px 0' }}>
                  {selectedAssignment.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  {selectedAssignment.description}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedAssignment(null);
                  setUploadedFiles([]);
                  setSubmissionNotes('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  color: '#6b7280',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '32px' }}>
              {/* Requirements */}
              <div style={{ 
                marginBottom: '24px',
                padding: '20px',
                background: '#f9fafb',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                  📋 Requirements:
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#6b7280', lineHeight: '1.8' }}>
                  {selectedAssignment.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
                <div style={{ 
                  marginTop: '16px', 
                  padding: '12px',
                  background: '#fff',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#6b7280'
                }}>
                  <strong style={{ color: '#111827' }}>Accepted formats:</strong> {selectedAssignment.acceptedFormats.join(', ')}
                </div>
              </div>

              {/* File Upload Area */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                  📎 Upload Files
                </h4>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{
                    border: `2px dashed ${isDragging ? '#6366f1' : '#d1d5db'}`,
                    borderRadius: '12px',
                    padding: '40px',
                    textAlign: 'center',
                    background: isDragging ? '#eef2ff' : '#f9fafb',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <Upload size={48} style={{ color: '#6366f1', margin: '0 auto 16px' }} />
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                    Drop files here or click to browse
                  </p>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    Supports: {selectedAssignment.acceptedFormats.join(', ')}
                  </p>
                  <input
                    id="fileInput"
                    type="file"
                    multiple
                    accept={selectedAssignment.acceptedFormats.join(',')}
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                    📁 Uploaded Files ({uploadedFiles.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '16px',
                          background: '#f9fafb',
                          borderRadius: '12px',
                          border: '1px solid #e5e7eb'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            background: '#6366f1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff'
                          }}>
                            <File size={20} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ 
                              fontSize: '14px', 
                              fontWeight: '600', 
                              color: '#111827', 
                              margin: 0,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {file.name}
                            </p>
                            <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(file.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '8px',
                            color: '#ef4444',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#fee2e2';
                            e.currentTarget.style.borderRadius = '8px';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'none';
                          }}
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submission Notes */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                  💬 Additional Notes (Optional)
                </h4>
                <textarea
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="Add any notes or comments about your submission..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              {/* Submit Button */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => {
                    setSelectedAssignment(null);
                    setUploadedFiles([]);
                    setSubmissionNotes('');
                  }}
                  style={{
                    flex: 1,
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid #d1d5db',
                    background: '#fff',
                    color: '#6b7280',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f9fafb';
                    e.currentTarget.style.borderColor = '#6b7280';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || uploadedFiles.length === 0}
                  style={{
                    flex: 2,
                    padding: '16px',
                    borderRadius: '12px',
                    border: 'none',
                    background: uploadedFiles.length === 0 ? '#d1d5db' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: '#fff',
                    fontSize: '15px',
                    fontWeight: '700',
                    cursor: uploadedFiles.length === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: uploadedFiles.length > 0 ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (uploadedFiles.length > 0) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (uploadedFiles.length > 0) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
                    }
                  }}
                >
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Check size={20} />
                      Submit Assignment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer1 />
    </div>
  );
}
