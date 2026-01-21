"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { dagarmyCourses } from "@/data/dagarmy-courses";

export default function CoursesManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const courses = useMemo(() => {
    return dagarmyCourses.map(course => ({
      id: course.id,
      title: course.title,
      category: course.filterCategories[0],
      instructor: course.author,
      students: course.students,
      status: "Published",
      rating: course.rating,
      price: course.price === 0 ? "FREE" : `$${course.price}`,
      thumbnail: course.imgSrc,
      lessons: course.lessons,
      hours: course.hours,
      accessLevel: course.accessLevel
    }));
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = searchQuery === "" ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = filterCategory === "All" || course.category === filterCategory;
      const matchesStatus = filterStatus === "All" || course.status === filterStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [courses, searchQuery, filterCategory, filterStatus]);

  const stats = useMemo(() => {
    const totalStudents = courses.reduce((sum, course) => sum + course.students, 0);
    const published = courses.filter(c => c.status === "Published").length;
    const drafts = courses.filter(c => c.status === "Draft").length;

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
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '6px',
            letterSpacing: '-0.02em'
          }}>
            Course Management
          </h1>
          <p style={{ fontSize: '15px', color: '#6b7280', margin: 0 }}>
            Manage all courses on the DAGARMY platform
          </p>
        </div>
        <Link
          href="/admin/courses/add"
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            background: '#8b5cf6',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '600',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            border: 'none',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#7c3aed';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#8b5cf6';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span style={{ fontSize: '16px' }}>+</span>
          Add New Course
        </Link>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div style={{ background: '#ffffff', borderRadius: '10px', padding: '16px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Total Courses</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827', letterSpacing: '-0.02em' }}>{stats.total}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div style={{ background: '#ffffff', borderRadius: '10px', padding: '16px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Published</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#8b5cf6', letterSpacing: '-0.02em' }}>{stats.published}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div style={{ background: '#ffffff', borderRadius: '10px', padding: '16px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Drafts</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#6b7280', letterSpacing: '-0.02em' }}>{stats.drafts}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div style={{ background: '#ffffff', borderRadius: '10px', padding: '16px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Total Students</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827', letterSpacing: '-0.02em' }}>{stats.totalStudents.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '10px',
          padding: '20px',
          border: '1px solid #e5e7eb',
          marginBottom: '20px'
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
                padding: '10px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          <div className="col-md-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterCategory("All");
                setFilterStatus("All");
              }}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                background: '#ffffff',
                cursor: 'pointer',
                fontWeight: '600',
                color: '#6b7280',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Course
              </th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Category
              </th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Instructor
              </th>
              <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Students
              </th>
              <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Status
              </th>
              <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Rating
              </th>
              <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course) => (
              <tr key={course.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '14px 20px' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '8px',
                        background: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0
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
                          e.target.parentElement.innerHTML = '<div style="font-size: 18px;">📚</div>';
                        }}
                      />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '2px' }}>
                        {course.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                        {course.price}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontSize: '13px', color: '#4b5563', fontWeight: '500' }}>
                    {course.category}
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontSize: '13px', color: '#4b5563', fontWeight: '500' }}>
                    {course.instructor}
                  </span>
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                    {course.students.toLocaleString()}
                  </span>
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: course.status === 'Published' ? '#dcfce7' : '#fef3c7',
                      color: course.status === 'Published' ? '#16a34a' : '#ca8a04'
                    }}
                  >
                    {course.status}
                  </span>
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                  {course.rating > 0 ? (
                    <div className="d-flex align-items-center justify-content-center gap-1">
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                        {course.rating}
                      </span>
                      <span style={{ color: '#f59e0b', fontSize: '14px' }}>⭐</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>No ratings</span>
                  )}
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div className="d-flex justify-content-center gap-2">
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
                        border: '1px solid #fee2e2',
                        background: '#fef2f2',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#dc2626',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fee2e2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fef2f2';
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
    </div>
  );
}
