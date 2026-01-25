"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function CourseListDatabaseNew() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});

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
      
      // Auto-expand modules for all courses
      const expanded = {};
      data.courses?.forEach(course => {
        expanded[course.id] = true;
      });
      setExpandedModules(expanded);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleModules = (courseId) => {
    setExpandedModules(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  if (loading) {
    return (
      <div className="main-content pt-0">
        <div className="page-inner tf-spacing-1 pt-0">
          <div className="tf-container">
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
                borderTop: '4px solid #8b5cf6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading courses...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content pt-0">
        <div className="page-inner tf-spacing-1 pt-0">
          <div className="tf-container">
            <div style={{ 
              padding: '40px', 
              textAlign: 'center',
              background: '#fef2f2',
              borderRadius: '12px',
              border: '1px solid #fecaca'
            }}>
              <p style={{ color: '#dc2626', fontSize: '16px', marginBottom: '10px' }}>
                Error loading courses
              </p>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!courses.length) {
    return (
      <div className="main-content pt-0">
        <div className="page-inner tf-spacing-1 pt-0">
          <div className="tf-container">
            <div style={{ 
              padding: '60px 40px', 
              textAlign: 'center',
              background: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
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
        </div>
      </div>
    );
  }

  return (
    <div className="main-content pt-0" style={{ background: '#f9fafb' }}>
      <div className="page-inner tf-spacing-1 pt-0">
        <div className="tf-container">
          {courses.map((course, index) => (
            <div
              key={course.id}
              className="wow fadeInUp"
              data-wow-delay={`${index * 0.1}s`}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                overflow: 'hidden',
                marginBottom: '40px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e5e7eb'
              }}
            >
              {/* Course Header with Banner */}
              <div style={{ position: 'relative', height: '300px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                {course.banner_url ? (
                  <Image
                    src={course.banner_url}
                    alt={course.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : course.thumbnail_url ? (
                  <Image
                    src={course.thumbnail_url}
                    alt={course.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : null}
                
                {/* Overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))'
                }} />

                {/* Course Title Overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '40px',
                  color: '#ffffff'
                }}>
                  {course.is_featured && (
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#fbbf24',
                        color: '#78350f',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        Featured Course
                      </span>
                    </div>
                  )}
                  
                  <h1 style={{
                    fontSize: '36px',
                    fontWeight: '700',
                    marginBottom: '12px',
                    lineHeight: '1.2'
                  }}>
                    {course.title}
                  </h1>
                  
                  {course.subtitle && (
                    <p style={{
                      fontSize: '18px',
                      opacity: 0.95,
                      marginBottom: '20px',
                      maxWidth: '800px'
                    }}>
                      {course.subtitle}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <span style={{ fontSize: '15px' }}>{course.stats?.totalModules || 0} Modules</span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                      <span style={{ fontSize: '15px' }}>{course.stats?.totalLessons || 0} Lessons</span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                      <span style={{ fontSize: '15px' }}>{course.stats?.enrolledStudents || 0} Students Enrolled</span>
                    </div>

                    {course.total_duration && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <span style={{ fontSize: '15px' }}>{course.total_duration}</span>
                      </div>
                    )}

                    <div style={{
                      marginLeft: 'auto',
                      background: course.is_free ? '#10b981' : '#8b5cf6',
                      padding: '10px 24px',
                      borderRadius: '8px',
                      fontSize: '18px',
                      fontWeight: '700'
                    }}>
                      {course.is_free ? 'FREE' : `${course.currency} ${course.price}`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Content */}
              <div style={{ padding: '40px' }}>
                {/* Course Description */}
                {course.description && (
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '12px'
                    }}>
                      About This Course
                    </h3>
                    <p style={{
                      fontSize: '15px',
                      lineHeight: '1.7',
                      color: '#4b5563'
                    }}>
                      {course.description}
                    </p>
                  </div>
                )}

                {/* Course Mission */}
                {course.mission && (
                  <div style={{
                    background: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    borderRadius: '12px',
                    padding: '24px',
                    marginBottom: '32px'
                  }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#0c4a6e', marginBottom: '8px' }}>
                          Course Mission
                        </h4>
                        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#075985', margin: 0 }}>
                          {course.mission}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Course Details Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '20px',
                  marginBottom: '32px'
                }}>
                  {course.category && (
                    <div style={{
                      background: '#f9fafb',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase' }}>
                        Category
                      </div>
                      <div style={{ fontSize: '15px', color: '#1f2937', fontWeight: '500' }}>
                        {course.category}
                      </div>
                    </div>
                  )}

                  {course.level && (
                    <div style={{
                      background: '#f9fafb',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase' }}>
                        Level
                      </div>
                      <div style={{ fontSize: '15px', color: '#1f2937', fontWeight: '500', textTransform: 'capitalize' }}>
                        {course.level}
                      </div>
                    </div>
                  )}

                  {course.language && (
                    <div style={{
                      background: '#f9fafb',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase' }}>
                        Language
                      </div>
                      <div style={{ fontSize: '15px', color: '#1f2937', fontWeight: '500' }}>
                        {course.language}
                      </div>
                    </div>
                  )}

                  {course.creator && (
                    <div style={{
                      background: '#f9fafb',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase' }}>
                        Instructor
                      </div>
                      <div style={{ fontSize: '15px', color: '#8b5cf6', fontWeight: '500' }}>
                        {course.creator.name}
                      </div>
                    </div>
                  )}
                </div>

                {/* Course Curriculum */}
                {course.modules && course.modules.length > 0 && (
                  <div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '20px'
                    }}>
                      <h3 style={{
                        fontSize: '22px',
                        fontWeight: '600',
                        color: '#1f2937',
                        margin: 0
                      }}>
                        Course Curriculum
                      </h3>
                      <button
                        onClick={() => toggleModules(course.id)}
                        style={{
                          background: 'transparent',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          padding: '8px 16px',
                          fontSize: '14px',
                          color: '#6b7280',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        {expandedModules[course.id] ? 'Collapse All' : 'Expand All'}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{
                          transform: expandedModules[course.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s'
                        }}>
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {course.modules.map((module, moduleIdx) => (
                        <div
                          key={module.id}
                          style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            background: '#ffffff'
                          }}
                        >
                          {/* Module Header */}
                          <div style={{
                            background: '#f9fafb',
                            padding: '20px 24px',
                            borderBottom: expandedModules[course.id] ? '1px solid #e5e7eb' : 'none'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <div style={{
                                width: '40px',
                                height: '40px',
                                background: '#8b5cf6',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#ffffff',
                                fontSize: '16px',
                                fontWeight: '700',
                                flexShrink: 0
                              }}>
                                {moduleIdx + 1}
                              </div>
                              <div style={{ flex: 1 }}>
                                <h4 style={{
                                  fontSize: '17px',
                                  fontWeight: '600',
                                  color: '#1f2937',
                                  marginBottom: '4px'
                                }}>
                                  {module.title}
                                </h4>
                                {module.description && (
                                  <p style={{
                                    fontSize: '14px',
                                    color: '#6b7280',
                                    margin: 0
                                  }}>
                                    {module.description}
                                  </p>
                                )}
                              </div>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                color: '#6b7280',
                                fontSize: '14px'
                              }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polygon points="5 3 19 12 5 21 5 3"/>
                                </svg>
                                {module.lessons?.length || 0} lessons
                              </div>
                            </div>
                          </div>

                          {/* Module Lessons */}
                          {expandedModules[course.id] && module.lessons && module.lessons.length > 0 && (
                            <div style={{ padding: '16px 24px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {module.lessons.map((lesson, lessonIdx) => (
                                  <div
                                    key={lesson.id}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '12px',
                                      padding: '12px',
                                      background: '#f9fafb',
                                      borderRadius: '8px',
                                      border: '1px solid #f3f4f6'
                                    }}
                                  >
                                    <div style={{
                                      width: '32px',
                                      height: '32px',
                                      background: '#ffffff',
                                      border: '2px solid #e5e7eb',
                                      borderRadius: '6px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '13px',
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
                                        marginBottom: '2px'
                                      }}>
                                        {lesson.title}
                                      </div>
                                      {lesson.description && (
                                        <div style={{
                                          fontSize: '13px',
                                          color: '#6b7280'
                                        }}>
                                          {lesson.description}
                                        </div>
                                      )}
                                    </div>
                                    {lesson.duration && (
                                      <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        color: '#6b7280',
                                        fontSize: '13px'
                                      }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                          <circle cx="12" cy="12" r="10"/>
                                          <polyline points="12 6 12 12 16 14"/>
                                        </svg>
                                        {lesson.duration}
                                      </div>
                                    )}
                                    {lesson.lesson_type && (
                                      <div style={{
                                        padding: '4px 10px',
                                        background: '#ffffff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        color: '#6b7280',
                                        textTransform: 'capitalize'
                                      }}>
                                        {lesson.lesson_type}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Enroll Button */}
                <div style={{
                  marginTop: '40px',
                  paddingTop: '32px',
                  borderTop: '1px solid #e5e7eb',
                  textAlign: 'center'
                }}>
                  <Link
                    href={`/course-single-v1/${course.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                      color: '#ffffff',
                      padding: '16px 48px',
                      borderRadius: '12px',
                      fontSize: '17px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.3)',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(139, 92, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(139, 92, 246, 0.3)';
                    }}
                  >
                    {course.is_free ? 'Enroll Now - FREE' : `Enroll Now - ${course.currency} ${course.price}`}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
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
