"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { dagarmyCourses } from "@/data/dagarmy-courses";

export default function CoursesManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
<<<<<<< HEAD
  const [viewMode, setViewMode] = useState("grid"); // grid or list

=======

  // Transform DAGARMY courses to admin format
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
  const courses = useMemo(() => {
    return dagarmyCourses.map(course => ({
      id: course.id,
      title: course.title,
      category: course.filterCategories[0],
      instructor: course.author,
      students: course.students,
<<<<<<< HEAD
      status: "Published",
=======
      status: "Published", // All current courses are published
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
      rating: course.rating,
      price: course.price === 0 ? "FREE" : `$${course.price}`,
      thumbnail: course.imgSrc,
      lessons: course.lessons,
      hours: course.hours,
      accessLevel: course.accessLevel
    }));
  }, []);

<<<<<<< HEAD
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = searchQuery === "" ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = filterCategory === "All" || course.category === filterCategory;
      const matchesStatus = filterStatus === "All" || course.status === filterStatus;

=======
  // Filter courses
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = searchQuery === "" || 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = filterCategory === "All" || course.category === filterCategory;
      const matchesStatus = filterStatus === "All" || course.status === filterStatus;
      
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [courses, searchQuery, filterCategory, filterStatus]);

<<<<<<< HEAD
=======
  // Calculate stats
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
  const stats = useMemo(() => {
    const totalStudents = courses.reduce((sum, course) => sum + course.students, 0);
    const published = courses.filter(c => c.status === "Published").length;
    const drafts = courses.filter(c => c.status === "Draft").length;
<<<<<<< HEAD

=======
    
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
    return {
      total: courses.length,
      published,
      drafts,
      totalStudents
    };
  }, [courses]);

  const categories = ["All", "Artificial Intelligence", "Blockchain", "Data Visualisation"];
  const statuses = ["All", "Published", "Draft", "Archived"];

  return (
<<<<<<< HEAD
    <div style={{ animation: 'fadeIn 0.4s ease-in' }}>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '32px', animation: 'slideUp 0.5s ease-out' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)'
            }}>
              📚
            </div>
            <div>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#111827',
                margin: 0,
                letterSpacing: '-0.02em'
              }}>
                Course Management
              </h1>
              <p style={{ fontSize: '15px', color: '#6b7280', margin: 0 }}>
                Manage all courses on the DAGARMY platform
              </p>
            </div>
          </div>
          <Link
            href="/admin/courses/add"
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              border: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
            <span style={{ fontSize: '18px' }}>+</span>
            Add New Course
          </Link>
        </div>
=======
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
            Course Management
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
            Manage all courses on the DAGARMY platform
          </p>
        </div>
        <Link
          href="/admin/courses/add"
          style={{
            padding: '12px 24px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
          }}
        >
          <span style={{ fontSize: '18px' }}>+</span>
          Add New Course
        </Link>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
<<<<<<< HEAD
        {[
          { title: "Total Courses", value: stats.total, icon: "📚", color: "#1f2937", change: "+3" },
          { title: "Published", value: stats.published, icon: "✓", color: "#10b981", change: "+2" },
          { title: "Drafts", value: stats.drafts, icon: "📝", color: "#f59e0b", change: "0" },
          { title: "Total Students", value: stats.totalStudents.toLocaleString(), icon: "👥", color: "#1f2937", change: "+156" }
        ].map((stat, index) => (
          <div
            key={index}
            className="col-xl-3 col-md-6"
            style={{ animation: `slideUp 0.5s ease-out ${index * 0.1}s backwards` }}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.borderColor = `${stat.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              {/* Subtle gradient background */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '120px',
                height: '120px',
                background: `radial-gradient(circle, ${stat.color}08 0%, transparent 70%)`,
                pointerEvents: 'none'
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: `${stat.color}10`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  marginBottom: '16px'
                }}>
                  {stat.icon}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  marginBottom: '8px',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {stat.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <div style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#111827',
                    letterSpacing: '-0.02em',
                    lineHeight: 1
                  }}>
                    {stat.value}
                  </div>
                  {stat.change !== "0" && (
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#10b981'
                    }}>
                      {stat.change}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
=======
        <div className="col-md-3">
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Total Courses</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#111827' }}>{stats.total}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Published</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>{stats.published}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Drafts</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#f59e0b' }}>{stats.drafts}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Total Students</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937' }}>{stats.totalStudents.toLocaleString()}</div>
          </div>
        </div>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
      </div>

      {/* Filters */}
      <div
        style={{
<<<<<<< HEAD
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          marginBottom: '24px',
          animation: 'slideUp 0.6s ease-out 0.2s backwards',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
        }}
      >
        <div className="row g-3 align-items-end">
          <div className="col-md-4">
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
              Search Courses
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '16px',
                color: '#9ca3af'
              }}>
                🔍
              </span>
              <input
                type="text"
                placeholder="Search by title or instructor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#1f2937';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
          <div className="col-md-3">
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
              Category
            </label>
=======
          background: '#fff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          marginBottom: '24px'
        }}
      >
        <div className="row g-3">
          <div className="col-md-5">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          <div className="col-md-3">
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                width: '100%',
<<<<<<< HEAD
                padding: '12px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '14px',
                cursor: 'pointer',
                outline: 'none',
                background: '#ffffff'
              }}
            >
              {categories.map(cat => (
=======
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              {categories.map((cat) => (
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
<<<<<<< HEAD
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
              Status
            </label>
=======
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                width: '100%',
<<<<<<< HEAD
                padding: '12px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '14px',
                cursor: 'pointer',
                outline: 'none',
                background: '#ffffff'
              }}
            >
              {statuses.map(status => (
=======
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              {statuses.map((status) => (
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
<<<<<<< HEAD
          <div className="col-md-3">
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterCategory("All");
                  setFilterStatus("All");
                }}
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  background: '#ffffff',
                  cursor: 'pointer',
                  fontWeight: '600',
                  color: '#6b7280',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
              >
                Reset
              </button>
              <div style={{
                display: 'flex',
                gap: '4px',
                padding: '4px',
                background: '#f3f4f6',
                borderRadius: '8px'
              }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '6px',
                    background: viewMode === 'grid' ? '#ffffff' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '16px',
                    transition: 'all 0.2s',
                    boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  ⊞
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '6px',
                    background: viewMode === 'list' ? '#ffffff' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '16px',
                    transition: 'all 0.2s',
                    boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  ☰
                </button>
              </div>
            </div>
=======
          <div className="col-md-2">
            <button
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                background: '#fff',
                cursor: 'pointer',
                fontWeight: '600',
                color: '#6b7280'
              }}
            >
              Reset Filters
            </button>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Results Count */}
      <div style={{ marginBottom: '16px', animation: 'slideUp 0.6s ease-out 0.3s backwards' }}>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
          Showing <span style={{ fontWeight: '600', color: '#111827' }}>{filteredCourses.length}</span> of <span style={{ fontWeight: '600', color: '#111827' }}>{courses.length}</span> courses
        </p>
      </div>

      {/* Courses Grid/List */}
      {viewMode === 'grid' ? (
        <div className="row g-4" style={{ animation: 'scaleIn 0.6s ease-out 0.4s backwards' }}>
          {filteredCourses.map((course, index) => (
            <div key={course.id} className="col-xl-4 col-md-6">
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                {/* Thumbnail */}
                <div style={{
                  position: 'relative',
                  paddingTop: '56.25%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  overflow: 'hidden'
                }}>
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: course.price === 'FREE' ? '#10b981' : '#1f2937'
                  }}>
                    {course.price}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(139, 92, 246, 0.1)',
                      color: '#111827',
                      fontSize: '11px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {course.category}
                    </span>
                  </div>

                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#111827',
                    marginBottom: '8px',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {course.title}
                  </h3>

                  <p style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    marginBottom: '16px'
                  }}>
                    by {course.instructor}
                  </p>

                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    marginBottom: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid #f3f4f6'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '14px' }}>👥</span>
                      <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>
                        {course.students.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '14px' }}>⭐</span>
                      <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>
                        {course.rating}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '14px' }}>📚</span>
                      <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>
                        {course.lessons} lessons
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                    <button
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        background: '#ffffff',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#6b7280',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f9fafb';
                        e.currentTarget.style.color = '#111827';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#ffffff';
                        e.currentTarget.style.color = '#6b7280';
=======
      {/* Courses Table */}
      <div
        style={{
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Course
              </th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Category
              </th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Instructor
              </th>
              <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Students
              </th>
              <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Status
              </th>
              <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Rating
              </th>
              <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course) => (
              <tr key={course.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '10px',
                        background: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      }}
                    >
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div style="font-size: 20px;">📚</div>';
                        }}
                      />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                        {course.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {course.price}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ fontSize: '14px', color: '#4b5563' }}>
                    {course.category}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ fontSize: '14px', color: '#4b5563' }}>
                    {course.instructor}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                    {course.students.toLocaleString()}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: course.status === 'Published' ? '#dcfce7' : '#fef3c7',
                      color: course.status === 'Published' ? '#16a34a' : '#ca8a04'
                    }}
                  >
                    {course.status}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                  {course.rating > 0 ? (
                    <div className="d-flex align-items-center justify-content-center gap-1">
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                        {course.rating}
                      </span>
                      <span style={{ color: '#f59e0b' }}>⭐</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>No ratings</span>
                  )}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        background: '#fff',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6b7280',
                        cursor: 'pointer'
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                      }}
                    >
                      Edit
                    </button>
                    <button
                      style={{
<<<<<<< HEAD
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#1f2937',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#111827';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#1f2937';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ animation: 'scaleIn 0.6s ease-out 0.4s backwards' }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fafafa', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Course</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Instructor</th>
                  <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Students</th>
                  <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rating</th>
                  <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr
                    key={course.id}
                    style={{
                      borderBottom: '1px solid #f3f4f6',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          style={{
                            width: '60px',
                            height: '40px',
                            borderRadius: '8px',
                            objectFit: 'cover'
                          }}
                        />
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '2px' }}>
                            {course.title}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {course.lessons} lessons • {course.hours} hours
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'rgba(139, 92, 246, 0.1)',
                        color: '#111827',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {course.category}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '14px', color: '#6b7280' }}>
                      {course.instructor}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                      {course.students.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        <span>⭐</span>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                          {course.rating}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: '#10b981',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {course.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb',
                            background: '#ffffff',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#6b7280',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f9fafb';
                            e.currentTarget.style.color = '#111827';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#ffffff';
                            e.currentTarget.style.color = '#6b7280';
                          }}
                        >
                          Edit
                        </button>
                        <button
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            background: '#1f2937',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#ffffff',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#111827'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#1f2937'}
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
=======
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #fee2e2',
                        background: '#fef2f2',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#dc2626',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
    </div>
  );
}
