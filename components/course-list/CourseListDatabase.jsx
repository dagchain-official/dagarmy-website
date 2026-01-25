"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function CourseListDatabase() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCourse, setExpandedCourse] = useState(null);

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
      // Auto-expand first course
      if (data.courses && data.courses.length > 0) {
        setExpandedCourse(data.courses[0].id);
      }
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
    <div className="main-content pt-0">
      <div className="page-inner tf-spacing-1 pt-0">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div className="wrap-courses">
                <div className="sort-by-wrap mb-30">
                  <div className="sort-wrap">
                    <p className="text text-1 flex-grow wow fadeInUp">
                      Showing {courses.length} Course{courses.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="flex flex-column">
                  <div className="wrap-courses last-no-border">
                    {courses.map((course, index) => (
                      <div
                        key={course.id}
                        className="course-item style-row hover-img wow fadeInUp"
                        data-wow-delay={`${index * 0.1}s`}
                        style={{ marginBottom: '30px' }}
                      >
                        <div className="features image-wrap" style={{ width: '380px', height: '280px', position: 'relative' }}>
                          {course.thumbnail_url ? (
                            <Image
                              className="lazyload"
                              alt={course.title}
                              src={course.thumbnail_url}
                              width={380}
                              height={280}
                              style={{ objectFit: 'cover', borderRadius: '12px' }}
                            />
                          ) : (
                            <div style={{
                              width: '100%',
                              height: '100%',
                              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#ffffff',
                              fontSize: '48px',
                              fontWeight: '700'
                            }}>
                              {course.title.charAt(0)}
                            </div>
                          )}
                          {course.is_featured && (
                            <div style={{
                              position: 'absolute',
                              top: '12px',
                              right: '12px',
                              background: '#fbbf24',
                              color: '#78350f',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              Featured
                            </div>
                          )}
                        </div>

                        <div className="content" style={{ flex: 1, padding: '0 30px' }}>
                          <div className="top" style={{ marginBottom: '16px' }}>
                            <div className="meta mb-0" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                              <div className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <i className="flaticon-calendar" style={{ color: '#8b5cf6' }} />
                                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                                  {course.stats?.totalModules || 0} Modules
                                </p>
                              </div>
                              <div className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <i className="flaticon-play" style={{ color: '#8b5cf6' }} />
                                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                                  {course.stats?.totalLessons || 0} Lessons
                                </p>
                              </div>
                              <div className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <i className="flaticon-user" style={{ color: '#8b5cf6' }} />
                                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                                  {course.stats?.enrolledStudents || 0} Students
                                </p>
                              </div>
                              {course.total_duration && (
                                <div className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <i className="flaticon-clock" style={{ color: '#8b5cf6' }} />
                                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                                    {course.total_duration}
                                  </p>
                                </div>
                              )}
                            </div>
                            <div className="h5 fw-5" style={{ color: course.is_free ? '#10b981' : '#8b5cf6', margin: 0 }}>
                              {course.is_free ? 'FREE' : `${course.currency} ${course.price}`}
                            </div>
                          </div>

                          <h5 className="fw-5" style={{ marginBottom: '12px', fontSize: '20px' }}>
                            <Link href={`/course-single-v1/${course.id}`} style={{ color: '#1f2937', textDecoration: 'none' }}>
                              {course.title}
                            </Link>
                          </h5>

                          {course.subtitle && (
                            <p style={{ 
                              color: '#6b7280', 
                              fontSize: '14px', 
                              marginBottom: '12px',
                              lineHeight: '1.6'
                            }}>
                              {course.subtitle}
                            </p>
                          )}

                          {course.category && (
                            <div style={{ marginBottom: '12px' }}>
                              <span style={{
                                display: 'inline-block',
                                padding: '4px 12px',
                                background: '#f3f4f6',
                                color: '#6b7280',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '500'
                              }}>
                                {course.category}
                              </span>
                            </div>
                          )}

                          {course.modules && course.modules.length > 0 && (
                            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                              <p style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563', marginBottom: '8px' }}>
                                Course Modules:
                              </p>
                              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {course.modules.slice(0, 3).map((module, idx) => (
                                  <li key={module.id} style={{ 
                                    fontSize: '13px', 
                                    color: '#6b7280',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                  }}>
                                    <span style={{ 
                                      width: '20px', 
                                      height: '20px', 
                                      background: '#f3f4f6', 
                                      borderRadius: '4px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '11px',
                                      fontWeight: '600',
                                      color: '#8b5cf6'
                                    }}>
                                      {idx + 1}
                                    </span>
                                    {module.title}
                                    {module.lessons && (
                                      <span style={{ color: '#9ca3af', fontSize: '12px' }}>
                                        ({module.lessons.length} lessons)
                                      </span>
                                    )}
                                  </li>
                                ))}
                                {course.modules.length > 3 && (
                                  <li style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: '500', marginTop: '4px' }}>
                                    +{course.modules.length - 3} more modules
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}

                          {course.creator && (
                            <div className="author" style={{ marginTop: '16px', fontSize: '13px', color: '#6b7280' }}>
                              By:{" "}
                              <span className="author" style={{ color: '#8b5cf6', fontWeight: '500' }}>
                                {course.creator.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
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
