"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function CourseListCompact() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModule, setSelectedModule] = useState({});

  // Function to render course title with Nasalization font for 'Next-Gen Tech'
  const renderCourseTitle = (title) => {
    if (title && title.includes('Next-Gen Tech')) {
      const parts = title.split('Next-Gen Tech');
      return (
        <>
          {parts[0]}<span style={{ fontFamily: 'Nasalization, sans-serif' }}>Next-Gen Tech</span>{parts[1]}
        </>
      );
    }
    return title;
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/courses/all?status=published');
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      
      const data = await response.json();
      setCourses(data.courses || []);
      
      // Auto-select first module for each course
      const selected = {};
      data.courses?.forEach(course => {
        if (course.modules && course.modules.length > 0) {
          selected[course.id] = course.modules[0].id;
        }
      });
      setSelectedModule(selected);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="main-content pt-0">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #1f2937',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading courses...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content pt-0">
        <div style={{ 
          padding: '40px', 
          textAlign: 'center',
          background: '#fef2f2',
          borderRadius: '12px',
          border: '1px solid #fecaca',
          margin: '40px'
        }}>
          <p style={{ color: '#dc2626', fontSize: '16px', marginBottom: '10px' }}>
            Error loading courses
          </p>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!courses.length) {
    return (
      <div className="main-content pt-0">
        <div style={{ 
          padding: '60px 40px', 
          textAlign: 'center',
          background: '#f9fafb',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          margin: '40px'
        }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" style={{ margin: '0 auto 20px' }}>
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3 style={{ color: '#1f2937', fontSize: '20px', marginBottom: '10px' }}>
            No Courses Available Yet
          </h3>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            We're working on bringing you amazing courses. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content pt-0" style={{ background: '#f8f9fa' }}>
      {courses.map((course, index) => {
        const currentModule = course.modules?.find(m => m.id === selectedModule[course.id]) || course.modules?.[0];
        
        return (
          <div key={course.id} style={{ background: '#ffffff' }}>
            {/* Hero Section - Compact */}
            <div style={{
              background: '#ffffff',
              padding: '40px 0',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '0 40px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  {course.is_featured && (
                    <span style={{
                      background: '#000000',
                      color: '#ffffff',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      Featured
                    </span>
                  )}
                  {course.category && (
                    <span style={{
                      background: '#f3f4f6',
                      color: '#4b5563',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}>
                      {course.category}
                    </span>
                  )}
                </div>

                <h1 style={{
                  fontSize: '42px',
                  fontWeight: '700',
                  color: '#1f2937',
                  marginBottom: '16px',
                  lineHeight: '1.2'
                }}>
                  {renderCourseTitle(course.title)}
                </h1>

                {course.subtitle && (
                  <p style={{
                    fontSize: '18px',
                    color: '#4b5563',
                    marginBottom: '24px',
                    maxWidth: '900px',
                    lineHeight: '1.6'
                  }}>
                    {course.subtitle}
                  </p>
                )}

                <div style={{
                  display: 'flex',
                  gap: '32px',
                  flexWrap: 'wrap',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span style={{ fontSize: '15px', fontWeight: '500', color: '#1f2937' }}>{course.stats?.totalModules || 0} Modules</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                    <span style={{ fontSize: '15px', fontWeight: '500', color: '#1f2937' }}>{course.stats?.totalLessons || 0} Lessons</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <span style={{ fontSize: '15px', fontWeight: '500', color: '#1f2937' }}>{course.stats?.enrolledStudents || 0} Students</span>
                  </div>

                  {course.total_duration && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <span style={{ fontSize: '15px', fontWeight: '500', color: '#1f2937' }}>{course.total_duration}</span>
                    </div>
                  )}

                  <div style={{
                    marginLeft: 'auto',
                    background: course.is_free ? '#000000' : '#1f2937',
                    color: '#ffffff',
                    padding: '12px 28px',
                    borderRadius: '8px',
                    fontSize: '18px',
                    fontWeight: '700'
                  }}>
                    {course.is_free ? 'FREE' : `${course.currency} ${course.price}`}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - 2 Column Layout */}
            <div style={{
              maxWidth: '1400px',
              margin: '0 auto',
              padding: '40px',
              display: 'grid',
              gridTemplateColumns: '380px 1fr',
              gap: '40px'
            }}>
              {/* Left Sidebar - Course Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Quick Info Card */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '16px'
                  }}>
                    Course Details
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {course.level && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>Level</span>
                        <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500', textTransform: 'capitalize' }}>
                          {course.level}
                        </span>
                      </div>
                    )}
                    
                    {course.language && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>Language</span>
                        <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>
                          {course.language}
                        </span>
                      </div>
                    )}
                    
                    {course.creator && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>Instructor</span>
                        <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>
                          {course.creator.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      // Clear logged out flag
                      sessionStorage.removeItem('dagarmy_logged_out');
                      // Open Reown modal for sign in
                      if (typeof window !== 'undefined' && window.modal) {
                        window.modal.open();
                      }
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      marginTop: '20px',
                      background: '#1f2937',
                      color: '#ffffff',
                      padding: '14px 24px',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: '600',
                      textAlign: 'center',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.4)';
                      e.currentTarget.style.background = '#111827';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.3)';
                      e.currentTarget.style.background = '#1f2937';
                    }}
                  >
                    {course.is_free ? 'Enroll Now - FREE' : `Enroll - ${course.currency} ${course.price}`}
                  </button>
                </div>

                {/* About Course */}
                {course.description && (
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '12px'
                    }}>
                      About This Course
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      lineHeight: '1.6',
                      color: '#4b5563',
                      margin: 0
                    }}>
                      {course.description}
                    </p>
                  </div>
                )}

                {/* Mission */}
                {course.mission && (
                  <div style={{
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px'
                  }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'start' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '6px' }}>
                          Mission
                        </h4>
                        <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#4b5563', margin: 0 }}>
                          {course.mission}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Content - Curriculum */}
              <div>
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    padding: '24px',
                    borderBottom: '1px solid #e5e7eb',
                    background: '#f9fafb'
                  }}>
                    <h2 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#1f2937',
                      margin: 0
                    }}>
                      Course Curriculum
                    </h2>
                  </div>

                  {course.modules && course.modules.length > 0 && (
                    <div style={{ display: 'flex', height: '600px' }}>
                      {/* Module List */}
                      <div style={{
                        width: '320px',
                        borderRight: '1px solid #e5e7eb',
                        overflowY: 'auto',
                        background: '#f9fafb'
                      }}>
                        {course.modules.map((module, idx) => (
                          <div
                            key={module.id}
                            onClick={() => setSelectedModule(prev => ({ ...prev, [course.id]: module.id }))}
                            style={{
                              padding: '16px 20px',
                              borderBottom: '1px solid #e5e7eb',
                              cursor: 'pointer',
                              background: selectedModule[course.id] === module.id ? '#ffffff' : 'transparent',
                              borderLeft: selectedModule[course.id] === module.id ? '3px solid #1f2937' : '3px solid transparent',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              if (selectedModule[course.id] !== module.id) {
                                e.currentTarget.style.background = '#ffffff';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (selectedModule[course.id] !== module.id) {
                                e.currentTarget.style.background = 'transparent';
                              }
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                              <div style={{
                                width: '32px',
                                height: '32px',
                                background: selectedModule[course.id] === module.id ? '#1f2937' : '#e5e7eb',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: selectedModule[course.id] === module.id ? '#ffffff' : '#6b7280',
                                fontSize: '14px',
                                fontWeight: '600',
                                flexShrink: 0
                              }}>
                                {idx + 1}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  color: selectedModule[course.id] === module.id ? '#1f2937' : '#4b5563',
                                  marginBottom: '4px',
                                  lineHeight: '1.3'
                                }}>
                                  {module.title}
                                </div>
                                <div style={{
                                  fontSize: '12px',
                                  color: '#6b7280',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polygon points="5 3 19 12 5 21 5 3"/>
                                  </svg>
                                  {module.lessons?.length || 0} lessons
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Lesson Details */}
                      <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '24px'
                      }}>
                        {currentModule && (
                          <>
                            <div style={{ marginBottom: '24px' }}>
                              <h3 style={{
                                fontSize: '18px',
                                fontWeight: '600',
                                color: '#1f2937',
                                marginBottom: '8px'
                              }}>
                                {currentModule.title}
                              </h3>
                              {currentModule.description && (
                                <p style={{
                                  fontSize: '14px',
                                  color: '#6b7280',
                                  lineHeight: '1.5',
                                  margin: 0
                                }}>
                                  {currentModule.description}
                                </p>
                              )}
                            </div>

                            {currentModule.lessons && currentModule.lessons.length > 0 ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {currentModule.lessons.map((lesson, lessonIdx) => (
                                  <div
                                    key={lesson.id}
                                    style={{
                                      padding: '16px',
                                      background: '#f9fafb',
                                      borderRadius: '8px',
                                      border: '1px solid #e5e7eb',
                                      transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background = '#f3f4f6';
                                      e.currentTarget.style.borderColor = '#d1d5db';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background = '#f9fafb';
                                      e.currentTarget.style.borderColor = '#e5e7eb';
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                                      <div style={{
                                        width: '28px',
                                        height: '28px',
                                        background: '#ffffff',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '6px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: '#6b7280',
                                        flexShrink: 0
                                      }}>
                                        {lessonIdx + 1}
                                      </div>
                                      <div style={{ flex: 1 }}>
                                        <div style={{
                                          fontSize: '15px',
                                          fontWeight: '500',
                                          color: '#1f2937',
                                          marginBottom: '4px'
                                        }}>
                                          {lesson.title}
                                        </div>
                                        {lesson.description && (
                                          <div style={{
                                            fontSize: '13px',
                                            color: '#6b7280',
                                            lineHeight: '1.4',
                                            marginBottom: '8px'
                                          }}>
                                            {lesson.description}
                                          </div>
                                        )}
                                        <div style={{
                                          display: 'flex',
                                          gap: '12px',
                                          alignItems: 'center',
                                          flexWrap: 'wrap'
                                        }}>
                                          {lesson.duration && (
                                            <div style={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: '4px',
                                              color: '#6b7280',
                                              fontSize: '12px'
                                            }}>
                                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10"/>
                                                <polyline points="12 6 12 12 16 14"/>
                                              </svg>
                                              {lesson.duration}
                                            </div>
                                          )}
                                          {lesson.lesson_type && (
                                            <div style={{
                                              padding: '2px 8px',
                                              background: '#ffffff',
                                              border: '1px solid #e5e7eb',
                                              borderRadius: '4px',
                                              fontSize: '11px',
                                              color: '#6b7280',
                                              textTransform: 'capitalize',
                                              fontWeight: '500'
                                            }}>
                                              {lesson.lesson_type}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p style={{ fontSize: '14px', color: '#9ca3af', textAlign: 'center', padding: '40px 0' }}>
                                No lessons available for this module
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
