"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  BookOpen, Search, Plus, Filter, Grid, List, Eye, Edit3, Trash2, 
  Users, Star, Clock, TrendingUp, Award, Target, BarChart3, 
  Download, MoreVertical, Play, CheckCircle, XCircle
} from "lucide-react";

export default function CoursesManagement2() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/courses/all');
      const data = await response.json();
      
      if (response.ok && data.courses) {
        setCourses(data.courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = searchQuery === "" ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = filterCategory === "All" || course.category === filterCategory;
      const matchesStatus = filterStatus === "All" || course.status === filterStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [courses, searchQuery, filterCategory, filterStatus]);

  const stats = useMemo(() => {
    const totalModules = courses.reduce((sum, course) => sum + (course.modules?.length || 0), 0);
    const totalLessons = courses.reduce((sum, course) => {
      return sum + (course.modules?.reduce((mSum, module) => mSum + (module.lessons?.length || 0), 0) || 0);
    }, 0);

    return {
      totalCourses: courses.length,
      totalModules,
      totalLessons,
      avgRating: courses.length > 0 ? (courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length).toFixed(1) : 0
    };
  }, [courses]);

  return (
    <div style={{ padding: '32px', width: '100%', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Enhanced Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(139, 92, 246, 0.3)'
              }}>
                <BookOpen size={24} style={{ color: '#fff' }} />
              </div>
              <div>
                <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', margin: 0, lineHeight: 1 }}>
                  Courses Management
                </h1>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0, marginTop: '4px' }}>
                  Manage all courses, modules, and lessons across the platform
                </p>
              </div>
            </div>
          </div>
          <Link href="/admin/courses/add" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '12px 24px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
              color: '#fff',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
            }}>
              <Plus size={18} />
              Add Course
            </button>
          </Link>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {[
          { 
            title: 'Total Courses', 
            value: loading ? '...' : stats.totalCourses.toString(), 
            change: `${courses.length} active`,
            icon: BookOpen,
            color: '#1f2937',
            bgGradient: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
            lightBg: '#f5f3ff'
          },
          { 
            title: 'Total Modules', 
            value: loading ? '...' : stats.totalModules.toString(),
            change: `Across all courses`,
            icon: Target,
            color: '#10b981',
            bgGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            lightBg: '#f0fdf4'
          },
          { 
            title: 'Total Lessons', 
            value: loading ? '...' : stats.totalLessons.toString(),
            change: `Content library`,
            icon: Play,
            color: '#f59e0b',
            bgGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            lightBg: '#fffbeb'
          },
          { 
            title: 'Avg Rating', 
            value: loading ? '...' : stats.avgRating.toString(),
            change: `Out of 5.0`,
            icon: Star,
            color: '#3b82f6',
            bgGradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            lightBg: '#eff6ff'
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '28px',
              border: '2px solid #e2e8f0',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = stat.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}>
              <div style={{
                position: 'absolute',
                top: '-30px',
                right: '-30px',
                width: '140px',
                height: '140px',
                background: stat.lightBg,
                borderRadius: '50%',
                opacity: 0.6
              }} />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: stat.bgGradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 8px 16px ${stat.color}40`
                  }}>
                    <Icon size={28} style={{ color: '#fff' }} />
                  </div>
                  <div style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: stat.lightBg,
                    fontSize: '11px',
                    fontWeight: '700',
                    color: stat.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Live
                  </div>
                </div>
                
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {stat.title}
                </div>
                <div style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', marginBottom: '8px', lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: stat.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={14} />
                  {stat.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '28px',
        marginBottom: '24px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto auto', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={20} style={{
              position: 'absolute',
              left: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8'
            }} />
            <input
              type="text"
              placeholder="Search courses by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 18px 14px 52px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                outline: 'none',
                transition: 'all 0.2s',
                background: '#f8fafc'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#1f2937';
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.1)';
                e.currentTarget.style.background = '#fff';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = '#f8fafc';
              }}
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              padding: '14px 18px',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              outline: 'none',
              background: '#f8fafc',
              color: '#475569',
              minWidth: '140px'
            }}>
            <option value="All">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="AI">AI</option>
            <option value="Blockchain">Blockchain</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '14px 18px',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              outline: 'none',
              background: '#f8fafc',
              color: '#475569',
              minWidth: '140px'
            }}>
            <option value="All">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <div style={{ display: 'flex', gap: '8px', background: '#f8fafc', padding: '4px', borderRadius: '10px', border: '2px solid #e2e8f0' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'grid' ? '#1f2937' : 'transparent',
                color: viewMode === 'grid' ? '#fff' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}>
              <Grid size={16} />
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'list' ? '#1f2937' : 'transparent',
                color: viewMode === 'list' ? '#fff' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}>
              <List size={16} />
              List
            </button>
          </div>
          
          <button
            onClick={() => {
              setSearchQuery("");
              setFilterCategory("All");
              setFilterStatus("All");
            }}
            style={{
              padding: '14px 24px',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              background: '#f8fafc',
              cursor: 'pointer',
              color: '#64748b',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}>
            Reset
          </button>
        </div>
      </div>

      {/* Courses Grid/List */}
      {loading ? (
        <div style={{ padding: '80px', textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #f1f5f9',
            borderTop: '4px solid #1f2937',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#64748b' }}>Loading courses...</div>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '80px',
          textAlign: 'center',
          border: '2px solid #e2e8f0'
        }}>
          <BookOpen size={64} style={{ color: '#cbd5e1', margin: '0 auto 20px' }} />
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>No courses found</div>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px' }}>Try adjusting your search or filters</div>
          <Link href="/admin/courses/add" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '12px 24px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
              color: '#fff',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Plus size={18} />
              Create Your First Course
            </button>
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
          {filteredCourses.map((course, index) => (
            <div key={course.id} style={{
              background: '#fff',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '2px solid #e2e8f0',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = '#1f2937';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}>
              {/* Course Image */}
              <div style={{ position: 'relative', paddingTop: '56.25%', background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)', overflow: 'hidden' }}>
                {course.banner_url ? (
                  <img
                    src={course.banner_url}
                    alt={course.title}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <BookOpen size={64} style={{ color: 'rgba(255,255,255,0.3)' }} />
                  </div>
                )}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: course.status === 'published' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(251, 191, 36, 0.9)',
                  backdropFilter: 'blur(8px)',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#fff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {course.status === 'published' ? <CheckCircle size={12} /> : <Clock size={12} />}
                  {course.status}
                </div>
              </div>

              {/* Course Content */}
              <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0, marginBottom: '8px', lineHeight: 1.4 }}>
                    {course.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.6 }}>
                    {course.subtitle || course.description?.substring(0, 80) + '...' || 'No description available'}
                  </p>
                </div>

                {/* Course Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                  <div style={{
                    padding: '12px',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Modules
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                      {course.modules?.length || 0}
                    </div>
                  </div>
                  <div style={{
                    padding: '12px',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Lessons
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                      {course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0}
                    </div>
                  </div>
                  <div style={{
                    padding: '12px',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Duration
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                      {course.total_duration || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link href={`/admin/courses/${course.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                    <button style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                      color: '#fff',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                      <Eye size={16} />
                      View Details
                    </button>
                  </Link>
                  <button style={{
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#f8fafc',
                    border: '2px solid #e2e8f0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.borderColor = '#1f2937';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}>
                    <MoreVertical size={16} style={{ color: '#64748b' }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          border: '2px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          {filteredCourses.map((course, index) => (
            <div key={course.id} style={{
              padding: '24px',
              borderBottom: index < filteredCourses.length - 1 ? '1px solid #f1f5f9' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#fafbfc'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                overflow: 'hidden',
                position: 'relative'
              }}>
                {course.banner_url ? (
                  <img
                    src={course.banner_url}
                    alt={course.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <BookOpen size={32} style={{ color: 'rgba(255,255,255,0.9)' }} />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0, marginBottom: '4px' }}>
                  {course.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  {course.modules?.length || 0} modules • {course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0} lessons
                </p>
              </div>

              <div style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: course.status === 'published' ? '#d1fae5' : '#fef3c7',
                fontSize: '12px',
                fontWeight: '700',
                color: course.status === 'published' ? '#065f46' : '#92400e',
                textTransform: 'uppercase'
              }}>
                {course.status}
              </div>

              <Link href={`/admin/courses/${course.id}`} style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Eye size={14} />
                  View
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
