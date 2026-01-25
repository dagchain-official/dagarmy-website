"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function ProgramManagement() {
  const [programData, setProgramData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});
  
  // Modal states
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [selectedModuleForLesson, setSelectedModuleForLesson] = useState(null);
  
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
    fetchProgramData();
  }, []);

  const fetchProgramData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/programs');
      const data = await response.json();
      
      if (response.ok) {
        setProgramData(data);
      } else {
        console.error('Failed to fetch program data:', data.error);
      }
    } catch (error) {
      console.error('Error fetching program data:', error);
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

  // Module CRUD operations
  const handleAddModule = () => {
    setEditingModule(null);
    setModuleForm({
      module_number: programData?.programs?.[0]?.modules?.length + 1 || 1,
      title: '',
      duration: '4 Hours',
      track: 'Yellow',
      focus: '',
      description: ''
    });
    setShowModuleModal(true);
  };

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
      const program = programData?.programs?.[0];
      if (!program) return;

      const payload = {
        ...moduleForm,
        program_id: program.id,
        order_index: editingModule?.order_index || programData.programs[0].modules.length + 1,
        is_published: true
      };

      const url = '/api/admin/modules';
      const method = editingModule ? 'PUT' : 'POST';
      
      if (editingModule) {
        payload.id = editingModule.id;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowModuleModal(false);
        fetchProgramData();
      }
    } catch (error) {
      console.error('Error saving module:', error);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!confirm('Are you sure you want to delete this module? All lessons will be deleted as well.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/modules?id=${moduleId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchProgramData();
      }
    } catch (error) {
      console.error('Error deleting module:', error);
    }
  };

  // Lesson CRUD operations
  const handleAddLesson = (module) => {
    setEditingLesson(null);
    setSelectedModuleForLesson(module);
    const lessonCount = module.lessons?.length || 0;
    setLessonForm({
      lesson_number: `${module.module_number}.${lessonCount + 1}`,
      title: '',
      type: 'theory',
      description: '',
      duration: '1 Hour',
      content: '',
      video_url: ''
    });
    setShowLessonModal(true);
  };

  const handleEditLesson = (lesson, module) => {
    setEditingLesson(lesson);
    setSelectedModuleForLesson(module);
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
      if (!selectedModuleForLesson) return;

      const payload = {
        ...lessonForm,
        module_id: selectedModuleForLesson.id,
        order_index: editingLesson?.order_index || (selectedModuleForLesson.lessons?.length || 0) + 1,
        is_published: true
      };

      const url = '/api/admin/lessons';
      const method = editingLesson ? 'PUT' : 'POST';
      
      if (editingLesson) {
        payload.id = editingLesson.id;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowLessonModal(false);
        fetchProgramData();
      }
    } catch (error) {
      console.error('Error saving lesson:', error);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm('Are you sure you want to delete this lesson?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/lessons?id=${lessonId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchProgramData();
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  };

  const trackColors = {
    'Yellow': { bg: '#fef3c7', text: '#92400e', border: '#fbbf24' },
    'Green': { bg: '#d1fae5', text: '#065f46', border: '#10b981' },
    'Blue': { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' }
  };

  const lessonTypeIcons = {
    'theory': '📖',
    'drill': '⚡',
    'strategy': '🎯',
    'graduation': '🎓'
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '48px', 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{ 
          fontSize: '48px',
          animation: 'spin 1s linear infinite'
        }}>⏳</div>
        <div style={{ fontSize: '16px', color: '#6b7280' }}>Loading program data...</div>
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const program = programData?.programs?.[0];

  if (!program) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
          No Program Found
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          The Next-Gen Tech Architect Program hasn't been created yet.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '8px',
              letterSpacing: '-0.02em'
            }}>
              {program.title}
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '8px' }}>
              {program.subtitle}
            </p>
            <p style={{ fontSize: '14px', color: '#8b5cf6', fontWeight: '600' }}>
              {program.mission}
            </p>
          </div>
          <button
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(139, 92, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
            }}
          >
            Edit Program Details
          </button>
        </div>

        {/* Program Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '24px' }}>
          {[
            { label: 'Total Duration', value: program.total_duration, icon: '⏱️' },
            { label: 'Total Modules', value: program.stats.totalModules, icon: '📚' },
            { label: 'Total Lessons', value: program.stats.totalLessons, icon: '📝' },
            { label: 'Enrolled Students', value: program.enrolled_students, icon: '👥' }
          ].map((stat, index) => (
            <div key={index} style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modules List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {program.modules?.map((module, index) => {
          const colors = trackColors[module.track] || { bg: '#f3f4f6', text: '#374151', border: '#9ca3af' };
          const isExpanded = expandedModules[module.id];

          return (
            <div key={module.id} style={{
              background: '#fff',
              borderRadius: '12px',
              border: `2px solid ${colors.border}20`,
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}>
              {/* Module Header */}
              <div
                onClick={() => toggleModule(module.id)}
                style={{
                  padding: '24px',
                  cursor: 'pointer',
                  background: `${colors.bg}40`,
                  borderBottom: isExpanded ? `1px solid ${colors.border}20` : 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = `${colors.bg}60`}
                onMouseLeave={(e) => e.currentTarget.style.background = `${colors.bg}40`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${colors.border} 0%, ${colors.text} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '18px',
                    flexShrink: 0
                  }}>
                    M{module.module_number}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#111827',
                      marginBottom: '4px'
                    }}>
                      {module.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                      {module.focus}
                    </p>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: colors.bg,
                        color: colors.text,
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {module.track} Track
                      </span>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>
                        {module.lessons?.length || 0} lessons • {module.duration}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center'
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditModule(module);
                      }}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        background: '#fff',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#6b7280',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
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
                      Edit Module
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteModule(module.id);
                      }}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1px solid #fee2e2',
                        background: '#fff',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#dc2626',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fef2f2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff';
                      }}
                    >
                      Delete
                    </button>
                    <div style={{
                      fontSize: '20px',
                      color: '#6b7280',
                      transition: 'transform 0.3s ease',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}>
                      ▼
                    </div>
                  </div>
                </div>
              </div>

              {/* Lessons List */}
              {isExpanded && (
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {module.lessons?.map((lesson, lessonIndex) => (
                      <div key={lesson.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '16px',
                        borderRadius: '8px',
                        background: '#fafafa',
                        border: '1px solid #e5e7eb',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#fafafa'}
                      >
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          background: '#fff',
                          border: '2px solid #e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          flexShrink: 0
                        }}>
                          {lessonTypeIcons[lesson.type] || '📄'}
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{
                              fontSize: '12px',
                              fontWeight: '700',
                              color: '#8b5cf6',
                              background: 'rgba(139, 92, 246, 0.1)',
                              padding: '2px 8px',
                              borderRadius: '4px'
                            }}>
                              {lesson.lesson_number}
                            </span>
                            <h4 style={{
                              fontSize: '15px',
                              fontWeight: '600',
                              color: '#111827',
                              margin: 0
                            }}>
                              {lesson.title}
                            </h4>
                          </div>
                          <p style={{
                            fontSize: '13px',
                            color: '#6b7280',
                            margin: 0,
                            lineHeight: '1.5'
                          }}>
                            {lesson.description}
                          </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{
                            padding: '4px 10px',
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
                              transition: 'all 0.2s ease'
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
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Lesson Button */}
                  <button
                    onClick={() => handleAddLesson(module)}
                    style={{
                      width: '100%',
                      marginTop: '16px',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px dashed #e5e7eb',
                      background: '#fafafa',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#6b7280',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f3f4f6';
                      e.currentTarget.style.borderColor = '#8b5cf6';
                      e.currentTarget.style.color = '#8b5cf6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fafafa';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.color = '#6b7280';
                    }}
                  >
                    + Add New Lesson to Module {module.module_number}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Module Button */}
      <button
        onClick={handleAddModule}
        style={{
          width: '100%',
          marginTop: '24px',
          padding: '16px',
          borderRadius: '12px',
          border: '2px dashed #e5e7eb',
          background: '#fafafa',
          fontSize: '16px',
          fontWeight: '600',
          color: '#6b7280',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#f3f4f6';
          e.currentTarget.style.borderColor = '#8b5cf6';
          e.currentTarget.style.color = '#8b5cf6';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#fafafa';
          e.currentTarget.style.borderColor = '#e5e7eb';
          e.currentTarget.style.color = '#6b7280';
        }}
      >
        + Add New Module to Program
      </button>

      {/* Module Edit Modal */}
      {showModuleModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowModuleModal(false)}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>
              {editingModule ? 'Edit Module' : 'Add New Module'}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Module Number</label>
                <input type="number" value={moduleForm.module_number} onChange={(e) => setModuleForm({...moduleForm, module_number: parseInt(e.target.value)})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Title</label>
                <input type="text" value={moduleForm.title} onChange={(e) => setModuleForm({...moduleForm, title: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Duration</label>
                <input type="text" value={moduleForm.duration} onChange={(e) => setModuleForm({...moduleForm, duration: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Track</label>
                <select value={moduleForm.track} onChange={(e) => setModuleForm({...moduleForm, track: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}>
                  <option value="Yellow">Yellow</option>
                  <option value="Green">Green</option>
                  <option value="Blue">Blue</option>
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Focus</label>
                <input type="text" value={moduleForm.focus} onChange={(e) => setModuleForm({...moduleForm, focus: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Description</label>
                <textarea value={moduleForm.description} onChange={(e) => setModuleForm({...moduleForm, description: e.target.value})}
                  rows={3} style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => setShowModuleModal(false)}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
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
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowLessonModal(false)}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>
              {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Lesson Number</label>
                <input type="text" value={lessonForm.lesson_number} onChange={(e) => setLessonForm({...lessonForm, lesson_number: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Title</label>
                <input type="text" value={lessonForm.title} onChange={(e) => setLessonForm({...lessonForm, title: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Type</label>
                <select value={lessonForm.type} onChange={(e) => setLessonForm({...lessonForm, type: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}>
                  <option value="theory">Theory</option>
                  <option value="drill">Drill</option>
                  <option value="strategy">Strategy</option>
                  <option value="graduation">Graduation</option>
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Duration</label>
                <input type="text" value={lessonForm.duration} onChange={(e) => setLessonForm({...lessonForm, duration: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Description</label>
                <textarea value={lessonForm.description} onChange={(e) => setLessonForm({...lessonForm, description: e.target.value})}
                  rows={3} style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Video URL (Optional)</label>
                <input type="text" value={lessonForm.video_url} onChange={(e) => setLessonForm({...lessonForm, video_url: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => setShowLessonModal(false)}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
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
  );
}
