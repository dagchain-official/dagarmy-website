"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  BookOpen, 
  Clock, 
  Users, 
  ArrowLeft,
  Plus,
  Edit3,
  Trash2,
  Layers,
  ChevronDown,
  FileText,
  Zap,
  Target,
  Award,
  X,
  Save
} from "lucide-react";
import Link from "next/link";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id;
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});
  
  // Modal states
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  
  // Form states
  const [moduleForm, setModuleForm] = useState({
    module_number: '',
    title: '',
    duration: '',
    track: 'Yellow',
    focus: '',
    description: ''
  });
  
  const [lessonForm, setLessonForm] = useState({
    lesson_number: '',
    title: '',
    type: 'theory',
    description: '',
    duration: '',
    content: '',
    video_url: ''
  });

  useEffect(() => {
    if (courseId) {
      fetchCourseDetail();
    }
  }, [courseId]);

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/courses/all?id=${courseId}`);
      const data = await response.json();
      
      if (response.ok && data.courses && data.courses.length > 0) {
        setCourse(data.courses[0]);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Module handlers
  const handleEditModule = (module) => {
    setEditingModule(module);
    setModuleForm({
      module_number: module.module_number,
      title: module.title,
      duration: module.duration,
      track: module.track,
      focus: module.focus,
      description: module.description || ''
    });
    setShowModuleModal(true);
  };

  const handleSaveModule = async () => {
    try {
      const payload = {
        ...moduleForm,
        id: editingModule.id,
        course_id: course.id,
        order_index: editingModule.order_index,
        is_published: true
      };

      const response = await fetch('/api/admin/modules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowModuleModal(false);
        fetchCourseDetail();
      }
    } catch (error) {
      console.error('Error saving module:', error);
      alert('Error saving module: ' + error.message);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!confirm('Delete this module and all its lessons?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/modules?id=${moduleId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchCourseDetail();
      } else {
        alert('Error deleting module');
      }
    } catch (error) {
      console.error('Error deleting module:', error);
      alert('Error deleting module: ' + error.message);
    }
  };

  // Lesson handlers
  const handleEditLesson = (lesson, module) => {
    setEditingLesson(lesson);
    setLessonForm({
      lesson_number: lesson.lesson_number,
      title: lesson.title,
      type: lesson.type,
      description: lesson.description,
      duration: lesson.duration,
      content: lesson.content || '',
      video_url: lesson.video_url || ''
    });
    setShowLessonModal(true);
  };

  const handleSaveLesson = async () => {
    try {
      const payload = {
        ...lessonForm,
        id: editingLesson.id,
        module_id: editingLesson.module_id,
        order_index: editingLesson.order_index,
        is_published: true
      };

      const response = await fetch('/api/admin/lessons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowLessonModal(false);
        fetchCourseDetail();
      }
    } catch (error) {
      console.error('Error saving lesson:', error);
      alert('Error saving lesson: ' + error.message);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm('Delete this lesson?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/lessons?id=${lessonId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchCourseDetail();
      } else {
        alert('Error deleting lesson');
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
      alert('Error deleting lesson: ' + error.message);
    }
  };

  const trackColors = {
    'Yellow': { bg: '#fef3c7', text: '#92400e', border: '#fbbf24', light: '#fffbeb' },
    'Green': { bg: '#d1fae5', text: '#065f46', border: '#10b981', light: '#f0fdf4' },
    'Blue': { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6', light: '#eff6ff' }
  };

  const lessonTypeConfig = {
    'theory': { icon: FileText, label: 'Theory', color: '#3b82f6' },
    'drill': { icon: Zap, label: 'Drill', color: '#f59e0b' },
    'strategy': { icon: Target, label: 'Strategy', color: '#8b5cf6' },
    'graduation': { icon: Award, label: 'Graduation', color: '#10b981' }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: '48px', textAlign: 'center' }}>
          <div className="spinner" style={{
            width: '48px',
            height: '48px',
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #8b5cf6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </AdminLayout>
    );
  }

  if (!course) {
    return (
      <AdminLayout>
        <div style={{ padding: '48px', textAlign: 'center' }}>
          <BookOpen size={48} style={{ color: '#9ca3af', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
            Course Not Found
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
            The course you're looking for doesn't exist.
          </p>
          <Link href="/admin/courses">
            <button style={{
              padding: '12px 24px',
              borderRadius: '8px',
              background: '#8b5cf6',
              color: '#fff',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Back to Courses
            </button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ padding: '32px', width: '100%' }}>
        {/* Back Button */}
        <Link href="/admin/courses">
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            background: '#fff',
            fontSize: '14px',
            fontWeight: '600',
            color: '#6b7280',
            cursor: 'pointer',
            marginBottom: '24px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
          >
            <ArrowLeft size={16} />
            Back to Courses
          </button>
        </Link>

        {/* Course Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          padding: '40px',
          marginBottom: '32px',
          color: '#fff'
        }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '12px' }}>
            {course.title}
          </h1>
          <p style={{ fontSize: '16px', opacity: 0.95, marginBottom: '8px' }}>
            {course.subtitle}
          </p>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>
            {course.mission}
          </p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '24px' }}>
            {[
              { label: 'Duration', value: course.total_duration, icon: Clock },
              { label: 'Modules', value: course.total_modules || 0, icon: Layers },
              { label: 'Lessons', value: course.total_lessons || 0, icon: BookOpen },
              { label: 'Students', value: course.enrolled_students || 0, icon: Users }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <Icon size={24} style={{ marginBottom: '12px', opacity: 0.9 }} />
                  <div style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '13px', opacity: 0.9, fontWeight: '500' }}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modules List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {course.modules && course.modules.length > 0 ? (
            course.modules.map((module) => {
              const colors = trackColors[module.track] || { bg: '#f3f4f6', text: '#374151', border: '#9ca3af', light: '#fafafa' };
              const isExpanded = expandedModules[module.id];

              return (
                <div key={module.id} style={{
                  background: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                  {/* Module Header */}
                  <div
                    onClick={() => toggleModule(module.id)}
                    style={{
                      padding: '24px',
                      cursor: 'pointer',
                      background: colors.light,
                      borderBottom: isExpanded ? `1px solid ${colors.border}20` : 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = colors.bg}
                    onMouseLeave={(e) => e.currentTarget.style.background = colors.light}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '12px',
                        background: `linear-gradient(135deg, ${colors.border} 0%, ${colors.text} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: '20px',
                        flexShrink: 0
                      }}>
                        {module.module_number}
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '6px' }}>
                          {module.title}
                        </h3>
                        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '10px' }}>
                          {module.focus}
                        </p>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <span style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            background: colors.bg,
                            color: colors.text,
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {module.track} Track
                          </span>
                          <span style={{ fontSize: '13px', color: '#6b7280' }}>
                            {module.duration}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditModule(module);
                          }}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            background: '#fff',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#6b7280',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f9fafb';
                            e.currentTarget.style.color = '#111827';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#fff';
                            e.currentTarget.style.color = '#6b7280';
                          }}
                        >
                          <Edit3 size={14} />
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteModule(module.id);
                          }}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '8px',
                            border: '1px solid #fee2e2',
                            background: '#fff',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#dc2626',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                        <ChevronDown 
                          size={20} 
                          style={{
                            color: '#6b7280',
                            transition: 'transform 0.3s ease',
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            marginLeft: '8px'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Lessons List */}
                  {isExpanded && module.lessons && module.lessons.length > 0 && (
                    <div style={{ padding: '24px', background: '#fafafa' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {module.lessons.map((lesson, lessonIndex) => {
                          const LessonIcon = lessonTypeConfig[lesson.type]?.icon || FileText;
                          const lessonColor = lessonTypeConfig[lesson.type]?.color || '#6b7280';
                          
                          return (
                            <div key={lesson.id || `lesson-${module.id}-${lessonIndex}`} style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px',
                              padding: '16px',
                              borderRadius: '10px',
                              background: '#fff',
                              border: '1px solid #e5e7eb',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}
                            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                            >
                              <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '10px',
                                background: `${lessonColor}10`,
                                border: `2px solid ${lessonColor}20`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                <LessonIcon size={20} style={{ color: lessonColor }} />
                              </div>

                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                  <span style={{
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    color: lessonColor,
                                    fontFamily: 'monospace'
                                  }}>
                                    {lesson.lesson_number}
                                  </span>
                                  <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#111827', margin: 0 }}>
                                    {lesson.title}
                                  </h4>
                                </div>
                                <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
                                  {lesson.description}
                                </p>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  background: '#f3f4f6',
                                  color: '#6b7280',
                                  fontSize: '12px',
                                  fontWeight: '600'
                                }}>
                                  {lesson.duration}
                                </span>
                                <button
                                  onClick={() => handleEditLesson(lesson, module)}
                                  style={{
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #e5e7eb',
                                    background: '#fff',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: '#6b7280',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#f9fafb';
                                    e.currentTarget.style.color = '#111827';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#fff';
                                    e.currentTarget.style.color = '#6b7280';
                                  }}
                                >
                                  <Edit3 size={12} />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteLesson(lesson.id)}
                                  style={{
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #fee2e2',
                                    background: '#fff',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: '#dc2626',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                                >
                                  <Trash2 size={12} />
                                  Delete
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ 
              background: '#fff', 
              borderRadius: '12px', 
              padding: '60px', 
              textAlign: 'center',
              border: '1px solid #e5e7eb'
            }}>
              <Layers size={48} style={{ color: '#9ca3af', margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                No modules yet
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                This course doesn't have any modules yet.
              </p>
            </div>
          )}
        </div>

        {/* Module Edit Modal */}
        {showModuleModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }} onClick={() => setShowModuleModal(false)}>
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Edit Module</h2>
                <button onClick={() => setShowModuleModal(false)} style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#f3f4f6',
                  cursor: 'pointer'
                }}>
                  <X size={20} style={{ color: '#6b7280' }} />
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Module Number</label>
                  <input type="number" value={moduleForm.module_number} onChange={(e) => setModuleForm({...moduleForm, module_number: parseInt(e.target.value)})}
                    style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                </div>
                
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Title</label>
                  <input type="text" value={moduleForm.title} onChange={(e) => setModuleForm({...moduleForm, title: e.target.value})}
                    style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                </div>
                
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Duration</label>
                  <input type="text" value={moduleForm.duration} onChange={(e) => setModuleForm({...moduleForm, duration: e.target.value})}
                    style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                </div>
                
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Track</label>
                  <select value={moduleForm.track} onChange={(e) => setModuleForm({...moduleForm, track: e.target.value})}
                    style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', background: '#fff' }}>
                    <option value="Yellow">Yellow</option>
                    <option value="Green">Green</option>
                    <option value="Blue">Blue</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Focus</label>
                  <input type="text" value={moduleForm.focus} onChange={(e) => setModuleForm({...moduleForm, focus: e.target.value})}
                    style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                </div>
                
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Description</label>
                  <textarea value={moduleForm.description} onChange={(e) => setModuleForm({...moduleForm, description: e.target.value})}
                    rows={3} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                <button onClick={() => setShowModuleModal(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#6b7280' }}>
                  Cancel
                </button>
                <button onClick={handleSaveModule}
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#8b5cf6', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                  Save Module
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lesson Edit Modal */}
        {showLessonModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }} onClick={() => setShowLessonModal(false)}>
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Edit Lesson</h2>
                <button onClick={() => setShowLessonModal(false)} style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#f3f4f6',
                  cursor: 'pointer'
                }}>
                  <X size={20} style={{ color: '#6b7280' }} />
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Lesson Number</label>
                  <input type="text" value={lessonForm.lesson_number} onChange={(e) => setLessonForm({...lessonForm, lesson_number: e.target.value})}
                    style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                </div>
                
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Title</label>
                  <input type="text" value={lessonForm.title} onChange={(e) => setLessonForm({...lessonForm, title: e.target.value})}
                    style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                </div>
                
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Type</label>
                  <select value={lessonForm.type} onChange={(e) => setLessonForm({...lessonForm, type: e.target.value})}
                    style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', background: '#fff' }}>
                    <option value="theory">Theory</option>
                    <option value="drill">Drill</option>
                    <option value="strategy">Strategy</option>
                    <option value="graduation">Graduation</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Duration</label>
                  <input type="text" value={lessonForm.duration} onChange={(e) => setLessonForm({...lessonForm, duration: e.target.value})}
                    style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                </div>
                
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Description</label>
                  <textarea value={lessonForm.description} onChange={(e) => setLessonForm({...lessonForm, description: e.target.value})}
                    rows={3} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
                </div>
                
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Video URL (Optional)</label>
                  <input type="text" value={lessonForm.video_url} onChange={(e) => setLessonForm({...lessonForm, video_url: e.target.value})}
                    style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                <button onClick={() => setShowLessonModal(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#6b7280' }}>
                  Cancel
                </button>
                <button onClick={handleSaveLesson}
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#8b5cf6', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                  Save Lesson
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
