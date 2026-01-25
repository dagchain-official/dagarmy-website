"use client";
import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Clock, 
  Users, 
  GraduationCap, 
  Edit3, 
  Trash2, 
  Plus, 
  ChevronDown,
  FileText,
  Zap,
  Target,
  Award,
  Save,
  X,
  Layers
} from "lucide-react";

export default function ProgramManagement2() {
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
      <div style={{ 
        padding: '48px', 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div className="spinner" style={{
          width: '48px',
          height: '48px',
          border: '4px solid #f3f4f6',
          borderTop: '4px solid #8b5cf6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <div style={{ fontSize: '16px', color: '#6b7280', fontWeight: '500' }}>Loading program data...</div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const program = programData?.programs?.[0];

  if (!program) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <BookOpen size={48} style={{ color: '#9ca3af', margin: '0 auto 16px' }} />
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
    <div style={{ padding: '32px', width: '100%' }}>
      {/* Header Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '40px',
        marginBottom: '32px',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          filter: 'blur(40px)'
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
            <div>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '700',
                marginBottom: '12px',
                letterSpacing: '-0.02em'
              }}>
                {program.title}
              </h1>
              <p style={{ fontSize: '16px', opacity: 0.95, marginBottom: '8px', lineHeight: '1.6' }}>
                {program.subtitle}
              </p>
              <p style={{ fontSize: '14px', opacity: 0.9, lineHeight: '1.6' }}>
                {program.mission}
              </p>
            </div>
            <button
              onClick={handleAddModule}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Plus size={18} />
              Add Module
            </button>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {[
              { label: 'Duration', value: program.total_duration, icon: Clock },
              { label: 'Modules', value: program.stats.totalModules, icon: Layers },
              { label: 'Lessons', value: program.stats.totalLessons, icon: BookOpen },
              { label: 'Students', value: program.enrolled_students, icon: Users }
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
      </div>

      {/* Modules List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {program.modules?.map((module, index) => {
          const colors = trackColors[module.track] || { bg: '#f3f4f6', text: '#374151', border: '#9ca3af', light: '#fafafa' };
          const isExpanded = expandedModules[module.id];

          return (
            <div key={module.id} style={{
              background: '#fff',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
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
                    flexShrink: 0,
                    boxShadow: `0 4px 12px ${colors.border}40`
                  }}>
                    {module.module_number}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#111827',
                      marginBottom: '6px'
                    }}>
                      {module.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '10px', lineHeight: '1.5' }}>
                      {module.focus}
                    </p>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        background: colors.bg,
                        color: colors.text,
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors.border }} />
                        {module.track} Track
                      </span>
                      <span style={{ 
                        fontSize: '13px', 
                        color: '#6b7280',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <BookOpen size={14} />
                        {module.lessons?.length || 0} lessons
                      </span>
                      <span style={{ 
                        fontSize: '13px', 
                        color: '#6b7280',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <Clock size={14} />
                        {module.duration}
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
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        background: '#fff',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#6b7280',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f9fafb';
                        e.currentTarget.style.color = '#111827';
                        e.currentTarget.style.borderColor = '#d1d5db';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.color = '#6b7280';
                        e.currentTarget.style.borderColor = '#e5e7eb';
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
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: '1px solid #fee2e2',
                        background: '#fff',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#dc2626',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fef2f2';
                        e.currentTarget.style.borderColor = '#fecaca';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.borderColor = '#fee2e2';
                      }}
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
              {isExpanded && (
                <div style={{ padding: '24px', background: '#fafafa' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {module.lessons?.map((lesson, lessonIndex) => {
                      const LessonIcon = lessonTypeConfig[lesson.type]?.icon || FileText;
                      const lessonColor = lessonTypeConfig[lesson.type]?.color || '#6b7280';
                      
                      return (
                        <div key={lesson.id} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          padding: '16px',
                          borderRadius: '10px',
                          background: '#fff',
                          border: '1px solid #e5e7eb',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#d1d5db';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
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
                                background: `${lessonColor}10`,
                                padding: '3px 10px',
                                borderRadius: '4px',
                                fontFamily: 'monospace'
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
                              padding: '6px 12px',
                              borderRadius: '6px',
                              background: '#f3f4f6',
                              color: '#6b7280',
                              fontSize: '12px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}>
                              <Clock size={12} />
                              {lesson.duration}
                            </span>
                            <button
                              onClick={() => handleEditLesson(lesson, module)}
                              style={{
                                padding: '8px 14px',
                                borderRadius: '6px',
                                border: '1px solid #e5e7eb',
                                background: '#fff',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#6b7280',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
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
                              <Edit3 size={12} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteLesson(lesson.id)}
                              style={{
                                padding: '8px 14px',
                                borderRadius: '6px',
                                border: '1px solid #fee2e2',
                                background: '#fff',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#dc2626',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
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

                  {/* Add Lesson Button */}
                  <button
                    onClick={() => handleAddLesson(module)}
                    style={{
                      width: '100%',
                      marginTop: '16px',
                      padding: '14px',
                      borderRadius: '10px',
                      border: '2px dashed #d1d5db',
                      background: '#fff',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#6b7280',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f9fafb';
                      e.currentTarget.style.borderColor = '#8b5cf6';
                      e.currentTarget.style.color = '#8b5cf6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fff';
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.color = '#6b7280';
                    }}
                  >
                    <Plus size={18} />
                    Add Lesson to Module {module.module_number}
                  </button>
                </div>
              )}
            </div>
          );
        })}
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
              <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>
                {editingModule ? 'Edit Module' : 'Add New Module'}
              </h2>
              <button
                onClick={() => setShowModuleModal(false)}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#f3f4f6',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} style={{ color: '#6b7280' }} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block', color: '#374151' }}>
                  Module Number
                </label>
                <input 
                  type="number" 
                  value={moduleForm.module_number} 
                  onChange={(e) => setModuleForm({...moduleForm, module_number: parseInt(e.target.value)})}
                  style={{ 
                    width: '100%', 
                    padding: '12px 14px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }} 
                  onFocus={(e) => e.currentTarget.style.borderColor = '#8b5cf6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                />
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block', color: '#374151' }}>
                  Title
                </label>
                <input 
                  type="text" 
                  value={moduleForm.title} 
                  onChange={(e) => setModuleForm({...moduleForm, title: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '12px 14px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }} 
                  onFocus={(e) => e.currentTarget.style.borderColor = '#8b5cf6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                />
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block', color: '#374151' }}>
                  Duration
                </label>
                <input 
                  type="text" 
                  value={moduleForm.duration} 
                  onChange={(e) => setModuleForm({...moduleForm, duration: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '12px 14px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }} 
                  onFocus={(e) => e.currentTarget.style.borderColor = '#8b5cf6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                />
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block', color: '#374151' }}>
                  Track
                </label>
                <select 
                  value={moduleForm.track} 
                  onChange={(e) => setModuleForm({...moduleForm, track: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '12px 14px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer',
                    background: '#fff'
                  }}
                >
                  <option value="Yellow">Yellow</option>
                  <option value="Green">Green</option>
                  <option value="Blue">Blue</option>
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block', color: '#374151' }}>
                  Focus
                </label>
                <input 
                  type="text" 
                  value={moduleForm.focus} 
                  onChange={(e) => setModuleForm({...moduleForm, focus: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '12px 14px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }} 
                  onFocus={(e) => e.currentTarget.style.borderColor = '#8b5cf6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                />
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block', color: '#374151' }}>
                  Description
                </label>
                <textarea 
                  value={moduleForm.description} 
                  onChange={(e) => setModuleForm({...moduleForm, description: e.target.value})}
                  rows={3} 
                  style={{ 
                    width: '100%', 
                    padding: '12px 14px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }} 
                  onFocus={(e) => e.currentTarget.style.borderColor = '#8b5cf6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
              <button 
                onClick={() => setShowModuleModal(false)}
                style={{ 
                  flex: 1, 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #d1d5db', 
                  background: '#fff', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  color: '#6b7280',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveModule}
                style={{ 
                  flex: 1, 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: 'none', 
                  background: '#8b5cf6', 
                  color: '#fff', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#7c3aed'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#8b5cf6'}
              >
                <Save size={16} />
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
              <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>
                {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
              </h2>
              <button
                onClick={() => setShowLessonModal(false)}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#f3f4f6',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} style={{ color: '#6b7280' }} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block', color: '#374151' }}>
                  Lesson Number
                </label>
                <input 
                  type="text" 
                  value={lessonForm.lesson_number} 
                  onChange={(e) => setLessonForm({...lessonForm, lesson_number: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '12px 14px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }} 
                  onFocus={(e) => e.currentTarget.style.borderColor = '#8b5cf6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                />
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block', color: '#374151' }}>
                  Title
                </label>
                <input 
                  type="text" 
                  value={lessonForm.title} 
                  onChange={(e) => setLessonForm({...lessonForm, title: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '12px 14px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }} 
                  onFocus={(e) => e.currentTarget.style.borderColor = '#8b5cf6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                />
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block', color: '#374151' }}>
                  Type
                </label>
                <select 
                  value={lessonForm.type} 
                  onChange={(e) => setLessonForm({...lessonForm, type: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '12px 14px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer',
                    background: '#fff'
                  }}
                >
                  <option value="theory">Theory</option>
                  <option value="drill">Drill</option>
                  <option value="strategy">Strategy</option>
                  <option value="graduation">Graduation</option>
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block', color: '#374151' }}>
                  Duration
                </label>
                <input 
                  type="text" 
                  value={lessonForm.duration} 
                  onChange={(e) => setLessonForm({...lessonForm, duration: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '12px 14px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }} 
                  onFocus={(e) => e.currentTarget.style.borderColor = '#8b5cf6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                />
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block', color: '#374151' }}>
                  Description
                </label>
                <textarea 
                  value={lessonForm.description} 
                  onChange={(e) => setLessonForm({...lessonForm, description: e.target.value})}
                  rows={3} 
                  style={{ 
                    width: '100%', 
                    padding: '12px 14px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }} 
                  onFocus={(e) => e.currentTarget.style.borderColor = '#8b5cf6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                />
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block', color: '#374151' }}>
                  Video URL <span style={{ color: '#9ca3af', fontWeight: '400' }}>(Optional)</span>
                </label>
                <input 
                  type="text" 
                  value={lessonForm.video_url} 
                  onChange={(e) => setLessonForm({...lessonForm, video_url: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '12px 14px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }} 
                  onFocus={(e) => e.currentTarget.style.borderColor = '#8b5cf6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
              <button 
                onClick={() => setShowLessonModal(false)}
                style={{ 
                  flex: 1, 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #d1d5db', 
                  background: '#fff', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  color: '#6b7280',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveLesson}
                style={{ 
                  flex: 1, 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: 'none', 
                  background: '#8b5cf6', 
                  color: '#fff', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#7c3aed'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#8b5cf6'}
              >
                <Save size={16} />
                Save Lesson
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
