"use client";
import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Clock, 
  Users, 
  GraduationCap, 
  Plus,
  Star,
  TrendingUp,
  Eye,
  Edit3,
  Trash2,
  Layers,
  DollarSign
} from "lucide-react";
import Link from "next/link";

export default function CourseTileView() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSeedData = async () => {
    if (!confirm('This will seed the Next-Gen Tech Architect Program. Continue?')) {
      return;
    }

    try {
      setSeeding(true);
      const response = await fetch('/api/admin/courses/seed-multi', {
        method: 'POST'
      });
      
      if (response.ok) {
        alert('Course data seeded successfully!');
        fetchCourses();
      } else {
        const data = await response.json();
        alert('Error seeding data: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error seeding data:', error);
      alert('Error seeding data: ' + error.message);
    } finally {
      setSeeding(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/courses/all');
      const data = await response.json();
      
      if (response.ok) {
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/courses/all?id=${courseId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchCourses();
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const statusColors = {
    'draft': { bg: '#f3f4f6', text: '#6b7280', border: '#d1d5db' },
    'published': { bg: '#d1fae5', text: '#065f46', border: '#10b981' },
    'archived': { bg: '#fee2e2', text: '#991b1b', border: '#dc2626' }
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
          borderTop: '4px solid #1f2937',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <div style={{ fontSize: '16px', color: '#6b7280', fontWeight: '500' }}>Loading courses...</div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', width: '100%' }}>
      {/* Header */}
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
                Courses Management
              </h1>
              <p style={{ fontSize: '16px', opacity: 0.95, lineHeight: '1.6' }}>
                Manage all courses, modules, and lessons across the platform
              </p>
            </div>
            <Link href="/admin/courses/create">
              <button
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
                Add Course
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {[
              { label: 'Total Courses', value: courses.length, icon: BookOpen },
              { label: 'Published', value: courses.filter(c => c.status === 'published').length, icon: Eye },
              { label: 'Total Students', value: courses.reduce((sum, c) => sum + (c.enrolled_students || 0), 0), icon: Users },
              { label: 'Avg Rating', value: (courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length || 0).toFixed(1), icon: Star }
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

      {/* Course Tiles */}
      {courses.length === 0 ? (
        <div style={{ 
          background: '#fff', 
          borderRadius: '16px', 
          padding: '80px 40px', 
          textAlign: 'center',
          border: '2px dashed #e5e7eb'
        }}>
          <BookOpen size={64} style={{ color: '#d1d5db', margin: '0 auto 24px' }} />
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
            No courses yet
          </h3>
          <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
            Get started by creating your first course or seed the existing Next-Gen Tech Architect Program.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={handleSeedData}
              disabled={seeding}
              style={{
                padding: '14px 28px',
                borderRadius: '10px',
                background: seeding ? '#d1d5db' : '#10b981',
                color: '#fff',
                border: 'none',
                fontSize: '15px',
                fontWeight: '600',
                cursor: seeding ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => !seeding && (e.currentTarget.style.background = '#059669')}
              onMouseLeave={(e) => !seeding && (e.currentTarget.style.background = '#10b981')}
            >
              {seeding ? 'Seeding...' : 'Seed Existing Course'}
            </button>
            <Link href="/admin/courses/create">
              <button
                style={{
                  padding: '14px 28px',
                  borderRadius: '10px',
                  background: '#1f2937',
                  color: '#fff',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#111827'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#1f2937'}
              >
                <Plus size={20} />
                Create New Course
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', 
          gap: '24px' 
        }}>
          {courses.map((course) => {
            const statusColor = statusColors[course.status] || statusColors.draft;

            return (
              <div key={course.id} style={{
                background: '#fff',
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                {/* Course Banner */}
                <div style={{
                  height: '180px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <BookOpen size={64} style={{ color: 'rgba(255,255,255,0.9)' }} />
                  
                  {/* Status Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    background: statusColor.bg,
                    color: statusColor.text,
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                    border: `1px solid ${statusColor.border}40`
                  }}>
                    {course.status}
                  </div>

                  {/* Featured Badge */}
                  {course.is_featured && (
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      background: 'rgba(255,255,255,0.95)',
                      color: '#f59e0b',
                      fontSize: '12px',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Star size={12} fill="#f59e0b" />
                      Featured
                    </div>
                  )}
                </div>

                {/* Course Content */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#111827',
                    marginBottom: '8px',
                    lineHeight: '1.4'
                  }}>
                    {course.title}
                  </h3>
                  
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    marginBottom: '16px',
                    lineHeight: '1.6',
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {course.subtitle || course.description}
                  </p>

                  {/* Stats Grid */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '12px',
                    marginBottom: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid #f3f4f6'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Layers size={16} style={{ color: '#1f2937' }} />
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>
                        <strong style={{ color: '#111827' }}>{course.total_modules || 0}</strong> modules
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <BookOpen size={16} style={{ color: '#1f2937' }} />
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>
                        <strong style={{ color: '#111827' }}>{course.total_lessons || 0}</strong> lessons
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Users size={16} style={{ color: '#1f2937' }} />
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>
                        <strong style={{ color: '#111827' }}>{course.enrolled_students || 0}</strong> students
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={16} style={{ color: '#1f2937' }} />
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>
                        <strong style={{ color: '#111827' }}>{course.total_duration || 'N/A'}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  {!course.is_free && (
                    <div style={{
                      padding: '12px',
                      background: '#f0fdf4',
                      borderRadius: '8px',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}>
                      <DollarSign size={18} style={{ color: '#10b981' }} />
                      <span style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>
                        {course.price} {course.currency}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link href={`/admin/courses/${course.id}`} style={{ flex: 1 }}>
                      <button
                        style={{
                          width: '100%',
                          padding: '10px',
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
                          justifyContent: 'center',
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
                        Manage
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      style={{
                        padding: '10px',
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
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Course Tile */}
          <Link href="/admin/courses/create">
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              border: '2px dashed #d1d5db',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#1f2937';
              e.currentTarget.style.background = '#faf5ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.background = '#fff';
            }}
            >
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Plus size={40} style={{ color: '#1f2937' }} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                Add New Course
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center', maxWidth: '250px' }}>
                Create a new course with modules and lessons
              </p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
