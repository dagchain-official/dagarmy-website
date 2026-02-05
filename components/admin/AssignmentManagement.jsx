"use client";
import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Users, Calendar, Clock, CheckCircle, 
  XCircle, Eye, Edit, Trash2, Upload, Download, Award,
  AlertCircle, Search, Filter, BookOpen, Code, Database, Cloud
} from 'lucide-react';
import SubmissionReview from './SubmissionReview';
import { useAuth } from '@/context/AuthContext';

export default function AssignmentManagement() {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('create'); // create, manage, review
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [modules, setModules] = useState([]);
  
  // Form state for creating assignment
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: [''],
    accepted_formats: ['.pdf', '.zip', '.docx'],
    max_file_size_mb: 50,
    total_points: 100,
    passing_score: 60,
    due_date: '',
    grace_period_hours: 24
  });

  // Load courses and modules
  useEffect(() => {
    fetchCourses();
  }, []);

  // Load modules when course is selected
  useEffect(() => {
    if (selectedCourse) {
      fetchModules(selectedCourse);
      fetchBatches(selectedCourse);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      setCoursesLoading(true);
      const response = await fetch('/api/admin/courses/all');
      const data = await response.json();
      console.log('Courses API response:', data);
      if (data.courses) {
        setCourses(data.courses || []);
      } else {
        console.error('Failed to fetch courses:', data.error);
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setCoursesLoading(false);
    }
  };

  const fetchModules = async (courseId) => {
    try {
      // Find the selected course from already-fetched courses
      const selectedCourseData = courses.find(c => c.id === courseId);
      if (selectedCourseData && selectedCourseData.modules) {
        // Sort modules by order_index or module_number
        const sortedModules = [...selectedCourseData.modules].sort((a, b) => {
          return (a.order_index || a.module_number || 0) - (b.order_index || b.module_number || 0);
        });
        setModules(sortedModules);
      } else {
        setModules([]);
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
      setModules([]);
    }
  };

  const fetchBatches = async (courseId) => {
    try {
      const response = await fetch(`/api/batches?courseId=${courseId}`);
      const data = await response.json();
      if (data.success) {
        setBatches(data.data);
      }
    } catch (error) {
      console.error('Error fetching batches:', error);
      setBatches([]);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    
    if (!selectedCourse || !selectedBatch) {
      alert('Please select a course and batch');
      return;
    }

    setLoading(true);
    try {
      // Get trainer ID from localStorage or context
      const trainerEmail = localStorage.getItem('userEmail'); // Adjust based on your auth
      
      const response = await fetch('/api/assignments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          course_id: selectedCourse,
          module_id: selectedModule || null,
          batch_id: selectedBatch,
          trainer_id: trainerEmail // You'll need to get actual trainer user ID
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Assignment created successfully!');
        // Reset form
        setFormData({
          title: '',
          description: '',
          requirements: [''],
          accepted_formats: ['.pdf', '.zip', '.docx'],
          max_file_size_mb: 50,
          total_points: 100,
          passing_score: 60,
          due_date: '',
          grace_period_hours: 24
        });
        setSelectedCourse('');
        setSelectedModule('');
        setSelectedBatch('');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, '']
    });
  };

  const updateRequirement = (index, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData({ ...formData, requirements: newRequirements });
  };

  const removeRequirement = (index) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData({ ...formData, requirements: newRequirements });
  };

  const toggleFormat = (format) => {
    const formats = formData.accepted_formats.includes(format)
      ? formData.accepted_formats.filter(f => f !== format)
      : [...formData.accepted_formats, format];
    setFormData({ ...formData, accepted_formats: formats });
  };

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
          <FileText size={36} style={{ color: '#6366f1' }} />
          Assignment Management
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280' }}>
          Create, manage, and grade student assignments
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
          { id: 'create', label: 'Create Assignment', icon: <Plus size={18} /> },
          { id: 'manage', label: 'Manage Assignments', icon: <FileText size={18} /> },
          { id: 'review', label: 'Review Submissions', icon: <CheckCircle size={18} /> }
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

      {/* Create Assignment Tab */}
      {activeTab === 'create' && (
        <div style={{ 
          background: '#fff', 
          borderRadius: '16px', 
          padding: '32px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e5e7eb'
        }}>
          <form onSubmit={handleCreateAssignment}>
            {/* Course Selection */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#111827',
                marginBottom: '8px'
              }}>
                Select Course *
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                required
                disabled={coursesLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  outline: 'none',
                  background: coursesLoading ? '#f3f4f6' : '#fff',
                  cursor: coursesLoading ? 'wait' : 'pointer'
                }}
              >
                <option value="">
                  {coursesLoading ? 'Loading courses...' : courses.length === 0 ? 'No courses available' : '-- Select a course --'}
                </option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
              {!coursesLoading && courses.length === 0 && (
                <div style={{
                  marginTop: '8px',
                  padding: '12px',
                  background: '#fef3c7',
                  border: '1px solid #fbbf24',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#92400e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={16} />
                  <span>No courses found. Please create a course first in the Courses section.</span>
                </div>
              )}
            </div>

            {/* Module Selection */}
            {selectedCourse && modules.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#111827',
                  marginBottom: '8px'
                }}>
                  Select Module (Optional)
                </label>
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                >
                  <option value="">-- General Assignment --</option>
                  {modules.map(module => (
                    <option key={module.id} value={module.id}>
                      Module {module.module_number}: {module.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Batch Selection */}
            {selectedCourse && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#111827',
                  marginBottom: '8px'
                }}>
                  Select Batch *
                </label>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
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
                  <option value="">-- Select a batch --</option>
                  {batches.map(batch => (
                    <option key={batch.id} value={batch.id}>
                      {batch.batch_name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Assignment Title */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#111827',
                marginBottom: '8px'
              }}>
                Assignment Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g., Cloud Architecture Design Project"
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

            {/* Description */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#111827',
                marginBottom: '8px'
              }}>
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                placeholder="Describe what students need to do..."
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

            {/* Requirements */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#111827',
                marginBottom: '8px'
              }}>
                Requirements
              </label>
              {formData.requirements.map((req, index) => (
                <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    placeholder={`Requirement ${index + 1}`}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#fee2e2',
                        color: '#ef4444',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addRequirement}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '1px dashed #d1d5db',
                  background: '#fff',
                  color: '#6366f1',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={16} />
                Add Requirement
              </button>
            </div>

            {/* Accepted File Formats */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#111827',
                marginBottom: '8px'
              }}>
                Accepted File Formats
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['.pdf', '.zip', '.docx', '.png', '.jpg', '.sql', '.xlsx', '.md'].map(format => (
                  <button
                    key={format}
                    type="button"
                    onClick={() => toggleFormat(format)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: '1px solid #d1d5db',
                      background: formData.accepted_formats.includes(format) 
                        ? '#6366f1' 
                        : '#fff',
                      color: formData.accepted_formats.includes(format) 
                        ? '#fff' 
                        : '#6b7280',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            {/* Points and Deadline Row */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
                  Total Points
                </label>
                <input
                  type="number"
                  value={formData.total_points}
                  onChange={(e) => setFormData({ ...formData, total_points: parseInt(e.target.value) })}
                  min="1"
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
                  Passing Score
                </label>
                <input
                  type="number"
                  value={formData.passing_score}
                  onChange={(e) => setFormData({ ...formData, passing_score: parseInt(e.target.value) })}
                  min="1"
                  max={formData.total_points}
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
                  Due Date *
                </label>
                <input
                  type="datetime-local"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  required
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
                  Grace Period (hours)
                </label>
                <input
                  type="number"
                  value={formData.grace_period_hours}
                  onChange={(e) => setFormData({ ...formData, grace_period_hours: parseInt(e.target.value) })}
                  min="0"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: 'none',
                background: loading 
                  ? '#d1d5db' 
                  : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              {loading ? 'Creating Assignment...' : 'Create Assignment'}
            </button>
          </form>
        </div>
      )}

      {/* Manage Assignments Tab */}
      {activeTab === 'manage' && (
        <div style={{ 
          background: '#fff', 
          borderRadius: '16px', 
          padding: '32px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <FileText size={64} style={{ color: '#d1d5db', margin: '0 auto 24px' }} />
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
            Manage Assignments
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            View and edit your created assignments (Coming soon)
          </p>
        </div>
      )}

      {/* Review Submissions Tab */}
      {activeTab === 'review' && (
        <div style={{ 
          background: '#fff', 
          borderRadius: '16px', 
          padding: '32px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e5e7eb'
        }}>
          <SubmissionReview trainerEmail={userProfile?.email} />
        </div>
      )}
    </div>
  );
}
