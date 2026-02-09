"use client";
import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, CheckCircle, XCircle, Award, 
  Eye, MessageSquare, User, Calendar, Clock, File,
  Star, TrendingUp, AlertCircle
} from 'lucide-react';

export default function SubmissionReview({ trainerEmail }) {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, submitted, graded, accepted, rejected
  
  const [gradeForm, setGradeForm] = useState({
    score: '',
    feedback: '',
    status: 'graded',
    certificate_granted: false
  });

  useEffect(() => {
    if (trainerEmail) {
      fetchSubmissions();
    }
  }, [trainerEmail]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/assignments/trainer/submissions?email=${encodeURIComponent(trainerEmail)}`);
      const data = await response.json();
      
      if (data.success) {
        setSubmissions(data.data);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSubmission = async (e) => {
    e.preventDefault();
    
    if (!selectedSubmission) return;

    setGrading(true);
    try {
      const response = await fetch('/api/assignments/trainer/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_id: selectedSubmission.id,
          trainer_email: trainerEmail,
          score: parseInt(gradeForm.score),
          feedback: gradeForm.feedback,
          status: gradeForm.status,
          certificate_granted: gradeForm.certificate_granted
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Submission graded successfully!');
        setSelectedSubmission(null);
        setGradeForm({
          score: '',
          feedback: '',
          status: 'graded',
          certificate_granted: false
        });
        fetchSubmissions(); // Refresh list
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error grading submission:', error);
      alert('Failed to grade submission');
    } finally {
      setGrading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'submitted': return '#3b82f6';
      case 'under_review': return '#f59e0b';
      case 'graded': return '#8b5cf6';
      case 'accepted': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'resubmit_required': return '#f97316';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'accepted': return <CheckCircle size={20} />;
      case 'rejected': return <XCircle size={20} />;
      case 'graded': return <Star size={20} />;
      default: return <Clock size={20} />;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const filteredSubmissions = filter === 'all' 
    ? submissions 
    : submissions.filter(s => s.status === filter);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '60px',
        background: '#fff',
        borderRadius: '16px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            border: '4px solid #e5e7eb',
            borderTopColor: '#6366f1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#6b7280' }}>Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Filter Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '24px',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '12px',
        overflowX: 'auto'
      }}>
        {[
          { id: 'all', label: 'All Submissions' },
          { id: 'submitted', label: 'New' },
          { id: 'graded', label: 'Graded' },
          { id: 'accepted', label: 'Accepted' },
          { id: 'rejected', label: 'Rejected' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              background: filter === tab.id 
                ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' 
                : '#fff',
              color: filter === tab.id ? '#fff' : '#6b7280',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              boxShadow: filter === tab.id 
                ? '0 4px 12px rgba(99, 102, 241, 0.25)' 
                : 'none'
            }}
          >
            {tab.label}
            {tab.id !== 'all' && (
              <span style={{ 
                marginLeft: '8px',
                padding: '2px 8px',
                borderRadius: '10px',
                background: filter === tab.id ? 'rgba(255,255,255,0.2)' : '#f3f4f6',
                fontSize: '12px'
              }}>
                {submissions.filter(s => s.status === tab.id).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Submissions List */}
      {filteredSubmissions.length === 0 ? (
        <div style={{ 
          padding: '60px 20px',
          background: '#fff',
          borderRadius: '16px',
          border: '2px dashed #d1d5db',
          textAlign: 'center'
        }}>
          <FileText size={64} style={{ color: '#d1d5db', margin: '0 auto 24px' }} />
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
            No Submissions Yet
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            {filter === 'all' 
              ? 'No students have submitted assignments yet.'
              : `No ${filter} submissions found.`}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredSubmissions.map((submission) => (
            <div
              key={submission.id}
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                border: '1px solid #e5e7eb',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedSubmission(submission)}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: 0 }}>
                      {submission.assignments?.title || 'Assignment'}
                    </h3>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: `${getStatusColor(submission.status)}20`,
                      color: getStatusColor(submission.status),
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      textTransform: 'capitalize'
                    }}>
                      {getStatusIcon(submission.status)}
                      {submission.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={16} />
                      {submission.users?.full_name || submission.users?.email || 'Student'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={16} />
                      Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                    </span>
                    {submission.file_names && submission.file_names.length > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <File size={16} />
                        {submission.file_names.length} file(s)
                      </span>
                    )}
                  </div>

                  {submission.submission_notes && (
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '8px 0 0 0', fontStyle: 'italic' }}>
                      "{submission.submission_notes}"
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  {submission.score !== null && submission.score !== undefined && (
                    <div style={{
                      padding: '12px 20px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      color: '#fff',
                      fontSize: '20px',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Star size={20} fill="#fff" />
                      {submission.score}/{submission.assignments?.total_points || 100}
                    </div>
                  )}
                  
                  {submission.certificate_granted && (
                    <div style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: '#dcfce7',
                      color: '#166534',
                      fontSize: '12px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Award size={14} />
                      Certificate Granted
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grading Modal */}
      {selectedSubmission && (
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
        onClick={() => setSelectedSubmission(null)}
        >
          <div 
            style={{
              background: '#fff',
              borderRadius: '20px',
              maxWidth: '900px',
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
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>
                Review Submission
              </h2>
              <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
                {selectedSubmission.assignments?.title}
              </p>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '32px' }}>
              {/* Student Info */}
              <div style={{ 
                marginBottom: '24px',
                padding: '20px',
                background: '#f9fafb',
                borderRadius: '12px'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                  Student Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '14px' }}>
                  <div>
                    <span style={{ color: '#6b7280' }}>Name:</span>
                    <span style={{ marginLeft: '8px', fontWeight: '600', color: '#111827' }}>
                      {selectedSubmission.users?.full_name || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280' }}>Email:</span>
                    <span style={{ marginLeft: '8px', fontWeight: '600', color: '#111827' }}>
                      {selectedSubmission.users?.email}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280' }}>Submitted:</span>
                    <span style={{ marginLeft: '8px', fontWeight: '600', color: '#111827' }}>
                      {new Date(selectedSubmission.submitted_at).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280' }}>Batch:</span>
                    <span style={{ marginLeft: '8px', fontWeight: '600', color: '#111827' }}>
                      {selectedSubmission.assignments?.batches?.batch_name || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submission Notes */}
              {selectedSubmission.submission_notes && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                    Student Notes
                  </h3>
                  <div style={{ 
                    padding: '16px',
                    background: '#f9fafb',
                    borderRadius: '12px',
                    fontSize: '14px',
                    color: '#6b7280',
                    fontStyle: 'italic'
                  }}>
                    {selectedSubmission.submission_notes}
                  </div>
                </div>
              )}

              {/* Submitted Files */}
              {selectedSubmission.file_names && selectedSubmission.file_names.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                    Submitted Files ({selectedSubmission.file_names.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {selectedSubmission.file_names.map((fileName, index) => (
                      <div
                        key={index}
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
                              {fileName}
                            </p>
                            <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                              {formatFileSize(selectedSubmission.file_sizes?.[index])}
                            </p>
                          </div>
                        </div>
                        <a
                          href={selectedSubmission.file_urls?.[index]}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            background: '#6366f1',
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: '600',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Download size={16} />
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grading Form */}
              <form onSubmit={handleGradeSubmission}>
                <div style={{ 
                  padding: '24px',
                  background: '#f9fafb',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
                    Grade Submission
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: '#111827',
                        marginBottom: '8px'
                      }}>
                        Score (out of {selectedSubmission.assignments?.total_points || 100})
                      </label>
                      <input
                        type="number"
                        value={gradeForm.score}
                        onChange={(e) => setGradeForm({ ...gradeForm, score: e.target.value })}
                        min="0"
                        max={selectedSubmission.assignments?.total_points || 100}
                        required
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid #d1d5db',
                          fontSize: '14px',
                          outline: 'none',
                          background: '#fff'
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
                        Status
                      </label>
                      <select
                        value={gradeForm.status}
                        onChange={(e) => setGradeForm({ ...gradeForm, status: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid #d1d5db',
                          fontSize: '14px',
                          outline: 'none',
                          background: '#fff'
                        }}
                      >
                        <option value="graded">Graded</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                        <option value="resubmit_required">Resubmit Required</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: '#111827',
                      marginBottom: '8px'
                    }}>
                      Feedback
                    </label>
                    <textarea
                      value={gradeForm.feedback}
                      onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                      rows={4}
                      placeholder="Provide feedback to the student..."
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        outline: 'none',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        background: '#fff'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={gradeForm.certificate_granted}
                        onChange={(e) => setGradeForm({ ...gradeForm, certificate_granted: e.target.checked })}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                        Grant Certificate
                      </span>
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedSubmission(null)}
                    style={{
                      flex: 1,
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid #d1d5db',
                      background: '#fff',
                      color: '#6b7280',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={grading}
                    style={{
                      flex: 2,
                      padding: '16px',
                      borderRadius: '12px',
                      border: 'none',
                      background: grading 
                        ? '#d1d5db' 
                        : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      color: '#fff',
                      fontSize: '15px',
                      fontWeight: '700',
                      cursor: grading ? 'not-allowed' : 'pointer',
                      boxShadow: grading ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.3)'
                    }}
                  >
                    {grading ? 'Submitting Grade...' : 'Submit Grade'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
