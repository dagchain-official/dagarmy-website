"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

/* ── Neumorphic tokens (same as Jobs/Careers pages) ── */
const nm = {
  bg: '#ffffff',
  shadow: '6px 6px 16px rgba(0,0,0,0.09), -4px -4px 12px rgba(255,255,255,0.9)',
  shadowSm: '4px 4px 10px rgba(0,0,0,0.07), -3px -3px 8px rgba(255,255,255,0.9)',
  shadowInset: 'inset 3px 3px 8px rgba(0,0,0,0.07), inset -2px -2px 6px rgba(255,255,255,0.9)',
  shadowHover: '10px 10px 24px rgba(0,0,0,0.12), -6px -6px 16px rgba(255,255,255,0.95)',
};

const NmCard = ({ children, style = {}, hover = true, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: nm.bg,
      borderRadius: '18px',
      boxShadow: nm.shadow,
      transition: 'box-shadow 0.25s, transform 0.25s',
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}
    onMouseEnter={hover ? e => {
      e.currentTarget.style.boxShadow = nm.shadowHover;
      e.currentTarget.style.transform = 'translateY(-2px)';
    } : undefined}
    onMouseLeave={hover ? e => {
      e.currentTarget.style.boxShadow = nm.shadow;
      e.currentTarget.style.transform = 'translateY(0)';
    } : undefined}
  >
    {children}
  </div>
);

const Chip = ({ children }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    padding: '5px 13px', borderRadius: '20px',
    background: nm.bg, boxShadow: nm.shadowSm,
    fontSize: '12px', fontWeight: '600', color: '#475569',
  }}>
    {children}
  </span>
);

const renderCourseTitle = (title) => {
  if (title && title.includes('Next-Gen Tech')) {
    const parts = title.split('Next-Gen Tech');
    return (
      <>{parts[0]}<span style={{ fontFamily: 'Nasalization, sans-serif' }}>Next-Gen Tech</span>{parts[1]}</>
    );
  }
  return title;
};

export default function CourseListNeo() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModule, setSelectedModule] = useState({});

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/courses/all?status=published');
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      setCourses(data.courses || []);
      const selected = {};
      data.courses?.forEach(course => {
        if (course.modules?.length > 0) selected[course.id] = course.modules[0].id;
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
      <div style={{ minHeight: '60vh', background: nm.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          background: nm.bg, boxShadow: nm.shadow,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
        </div>
        <p style={{ color: '#64748b', fontSize: '15px', fontWeight: '500' }}>Loading courses...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '60vh', background: nm.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <NmCard style={{ padding: '40px', textAlign: 'center', maxWidth: '400px' }}>
          <p style={{ color: '#ef4444', fontSize: '15px', marginBottom: '8px', fontWeight: '600' }}>Error loading courses</p>
          <p style={{ color: '#94a3b8', fontSize: '13px' }}>{error}</p>
        </NmCard>
      </div>
    );
  }

  if (!courses.length) {
    return (
      <div style={{ minHeight: '60vh', background: nm.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <NmCard style={{ padding: '60px 40px', textAlign: 'center', maxWidth: '440px' }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" style={{ margin: '0 auto 20px', display: 'block' }}>
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3 style={{ color: '#0f172a', fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>No Courses Available Yet</h3>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>We're working on bringing you amazing courses. Check back soon!</p>
        </NmCard>
      </div>
    );
  }

  return (
    <div style={{ background: nm.bg, minHeight: '100vh', padding: '0 0 60px' }}>

      {/* Page header */}
      <div style={{ background: nm.bg, padding: '48px 40px 32px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>
          TECH CAREER LEARNING
        </p>
        <h1 style={{ fontSize: '38px', fontWeight: '800', color: '#0f172a', marginBottom: '12px', lineHeight: '1.2' }}>
          Explore Our Course
        </h1>
        <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '520px', margin: '0 auto' }}>
          Learn cutting-edge skills in AI, Blockchain, and Data Visualization
        </p>
      </div>

      {/* Course list */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {courses.map((course) => {
          const currentModule = course.modules?.find(m => m.id === selectedModule[course.id]) || course.modules?.[0];

          return (
            <div key={course.id}>

              {/* ── Course Hero Card ── */}
              <NmCard hover={false} style={{ padding: '32px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

                  {/* Thumbnail */}
                  {course.thumbnail_url && (
                    <div style={{
                      width: '200px', height: '140px', borderRadius: '14px',
                      overflow: 'hidden', flexShrink: 0,
                      boxShadow: nm.shadow,
                    }}>
                      <Image
                        src={course.thumbnail_url}
                        alt={course.title}
                        width={200} height={140}
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Badges */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
                      {course.is_featured && (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '5px',
                          padding: '5px 13px', borderRadius: '20px',
                          background: nm.bg, boxShadow: nm.shadowSm,
                          fontSize: '11px', fontWeight: '700', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.5px',
                        }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                          Featured
                        </span>
                      )}
                      {course.category && <Chip>{course.category}</Chip>}
                      {course.level && <Chip>{course.level}</Chip>}
                    </div>

                    {/* Title */}
                    <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', marginBottom: '10px', lineHeight: '1.25' }}>
                      {renderCourseTitle(course.title)}
                    </h2>

                    {course.subtitle && (
                      <p style={{ fontSize: '15px', color: '#64748b', marginBottom: '18px', lineHeight: '1.6', maxWidth: '700px' }}>
                        {course.subtitle}
                      </p>
                    )}

                    {/* Stats row */}
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <Chip>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        {course.stats?.totalModules || 0} Modules
                      </Chip>
                      <Chip>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        {course.stats?.totalLessons || 0} Lessons
                      </Chip>
                      <Chip>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                        {course.stats?.enrolledStudents || 0} Students
                      </Chip>
                      {course.total_duration && (
                        <Chip>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          {course.total_duration}
                        </Chip>
                      )}
                      {/* Price pill */}
                      <span style={{
                        marginLeft: 'auto',
                        padding: '6px 20px', borderRadius: '20px',
                        background: nm.bg, boxShadow: nm.shadowSm,
                        fontSize: '15px', fontWeight: '800',
                        color: course.is_free ? '#10b981' : '#0f172a',
                      }}>
                        {course.is_free ? 'FREE' : `${course.currency} ${course.price}`}
                      </span>
                    </div>
                  </div>
                </div>
              </NmCard>

              {/* ── Two-column: Sidebar + Curriculum ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>

                {/* LEFT SIDEBAR */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                  {/* Course Details */}
                  <NmCard hover={false} style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '18px' }}>
                      Course Details
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {[
                        { label: 'Level', value: course.level },
                        { label: 'Language', value: course.language },
                        { label: 'Instructor', value: course.creator?.name },
                      ].filter(r => r.value).map(row => (
                        <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid rgba(148,163,184,0.15)' }}>
                          <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>{row.label}</span>
                          <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: '600', textTransform: 'capitalize' }}>{row.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Enroll CTA */}
                    <button
                      onClick={() => {
                        sessionStorage.removeItem('dagarmy_logged_out');
                        if (typeof window !== 'undefined' && window.modal) window.modal.open();
                      }}
                      style={{
                        display: 'block', width: '100%', marginTop: '20px',
                        padding: '14px 24px', borderRadius: '12px', border: 'none',
                        background: 'linear-gradient(135deg, #60a5fa 0%, #818cf8 50%, #a78bfa 100%)',
                        boxShadow: '6px 6px 14px rgba(96,165,250,0.3), -2px -2px 8px rgba(255,255,255,0.7)',
                        fontSize: '14px', fontWeight: '700', color: '#fff',
                        cursor: 'pointer', transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '8px 8px 20px rgba(96,165,250,0.45), -2px -2px 10px rgba(255,255,255,0.8)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '6px 6px 14px rgba(96,165,250,0.3), -2px -2px 8px rgba(255,255,255,0.7)';
                      }}
                    >
                      {course.is_free ? 'Enroll Now — FREE' : `Enroll — ${course.currency} ${course.price}`}
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                    </button>
                  </NmCard>

                  {/* About */}
                  {course.description && (
                    <NmCard hover={false} style={{ padding: '24px' }}>
                      <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                        About This Course
                      </h3>
                      <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#475569', margin: 0 }}>
                        {course.description}
                      </p>
                    </NmCard>
                  )}

                  {/* Mission */}
                  {course.mission && (
                    <NmCard hover={false} style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                          background: nm.bg, boxShadow: nm.shadowSm,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                          </svg>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Mission</h4>
                          <p style={{ fontSize: '12px', lineHeight: '1.6', color: '#64748b', margin: 0 }}>{course.mission}</p>
                        </div>
                      </div>
                    </NmCard>
                  )}
                </div>

                {/* RIGHT — Curriculum */}
                <NmCard hover={false} style={{ overflow: 'hidden', padding: 0 }}>
                  {/* Header */}
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(148,163,184,0.2)' }}>
                    <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                      Course Curriculum
                      <span style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: '600', color: '#94a3b8' }}>
                        {course.modules?.length || 0} modules · {course.stats?.totalLessons || 0} lessons
                      </span>
                    </h2>
                  </div>

                  {course.modules?.length > 0 ? (
                    <div style={{ display: 'flex', height: '580px' }}>

                      {/* Module list */}
                      <div style={{
                        width: '280px', flexShrink: 0, overflowY: 'auto',
                        borderRight: '1px solid rgba(148,163,184,0.2)',
                        background: 'rgba(238,240,245,0.5)',
                      }}>
                        {course.modules.map((module, idx) => {
                          const active = selectedModule[course.id] === module.id;
                          return (
                            <div
                              key={module.id}
                              onClick={() => setSelectedModule(prev => ({ ...prev, [course.id]: module.id }))}
                              style={{
                                padding: '14px 18px',
                                borderBottom: '1px solid rgba(148,163,184,0.15)',
                                cursor: 'pointer',
                                borderLeft: `3px solid ${active ? '#818cf8' : 'transparent'}`,
                                background: active ? nm.bg : 'transparent',
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(238,240,245,0.8)'; }}
                              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                            >
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <div style={{
                                  width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                                  background: nm.bg, boxShadow: active ? nm.shadowSm : 'none',
                                  border: active ? 'none' : '1px solid rgba(148,163,184,0.3)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: '12px', fontWeight: '700',
                                  color: active ? '#818cf8' : '#94a3b8',
                                }}>
                                  {idx + 1}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: '13px', fontWeight: active ? '700' : '500', color: active ? '#0f172a' : '#475569', marginBottom: '3px', lineHeight: '1.3' }}>
                                    {module.title}
                                  </div>
                                  <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                                    {module.lessons?.length || 0} lessons
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Lesson details */}
                      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                        {currentModule ? (
                          <>
                            <div style={{ marginBottom: '20px' }}>
                              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
                                {currentModule.title}
                              </h3>
                              {currentModule.description && (
                                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                                  {currentModule.description}
                                </p>
                              )}
                            </div>

                            {currentModule.lessons?.length > 0 ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {currentModule.lessons.map((lesson, lessonIdx) => (
                                  <div
                                    key={lesson.id}
                                    style={{
                                      padding: '14px 16px', borderRadius: '12px',
                                      background: nm.bg, boxShadow: nm.shadowSm,
                                      transition: 'box-shadow 0.2s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.boxShadow = nm.shadow; }}
                                    onMouseLeave={e => { e.currentTarget.style.boxShadow = nm.shadowSm; }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                      <div style={{
                                        width: '26px', height: '26px', borderRadius: '7px', flexShrink: 0,
                                        background: nm.bg, boxShadow: nm.shadowSm,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '11px', fontWeight: '700', color: '#64748b',
                                      }}>
                                        {lessonIdx + 1}
                                      </div>
                                      <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '3px' }}>
                                          {lesson.title}
                                        </div>
                                        {lesson.description && (
                                          <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4', marginBottom: '8px' }}>
                                            {lesson.description}
                                          </div>
                                        )}
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                          {lesson.duration && (
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>
                                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                              {lesson.duration}
                                            </span>
                                          )}
                                          {lesson.lesson_type && (
                                            <span style={{
                                              padding: '2px 8px', borderRadius: '6px',
                                              background: nm.bg, boxShadow: nm.shadowSm,
                                              fontSize: '10px', fontWeight: '600', color: '#64748b', textTransform: 'capitalize',
                                            }}>
                                              {lesson.lesson_type}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', padding: '40px 0' }}>
                                No lessons available for this module
                              </p>
                            )}
                          </>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '60px', textAlign: 'center' }}>
                      <p style={{ fontSize: '14px', color: '#94a3b8' }}>No curriculum available yet</p>
                    </div>
                  )}
                </NmCard>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
