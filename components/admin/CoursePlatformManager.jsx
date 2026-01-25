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
  Layers,
  Filter,
  Search,
  Star,
  TrendingUp,
  DollarSign,
  Eye,
  EyeOff,
  UserCheck,
  Package
} from "lucide-react";

export default function CoursePlatformManager() {
  const [courses, setCourses] = useState([]);
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedCourses, setExpandedCourses] = useState({});
  
  // Filters
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCreator, setFilterCreator] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingModule, setEditingModule] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [selectedModuleForLesson, setSelectedModuleForLesson] = useState(null);
  
  // Form states
  const [courseForm, setCourseForm] = useState({
    creator_id: '',
    title: '',
    subtitle: '',
    description: '',
    mission: '',
    category: 'Technology',
    level: 'intermediate',
    language: 'English',
    total_duration: '',
    price: 0,
    is_free: true,
    status: 'draft',
    is_featured: false,
    tags: []
  });

  const [creatorForm, setCreatorForm] = useState({
    name: '',
    email: '',
    bio: '',
    role: 'trainer',
    expertise: [],
    is_verified: false
  });

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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch courses
      const coursesRes = await fetch('/api/admin/courses/all');
      const coursesData = await coursesRes.json();
      
      // Fetch creators
      const creatorsRes = await fetch('/api/admin/creators');
      const creatorsData = await creatorsRes.json();
      
      if (coursesRes.ok) setCourses(coursesData.courses || []);
      if (creatorsRes.ok) setCreators(creatorsData.creators || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCourse = (courseId) => {
    setExpandedCourses(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  // Course CRUD
  const handleAddCourse = () => {
    setEditingCourse(null);
    setCourseForm({
      creator_id: creators[0]?.id || '',
      title: '',
      subtitle: '',
      description: '',
      mission: '',
      category: 'Technology',
      level: 'intermediate',
      language: 'English',
      total_duration: '',
      price: 0,
      is_free: true,
      status: 'draft',
      is_featured: false,
      tags: []
    });
    setShowCourseModal(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setCourseForm({
      creator_id: course.creator_id,
      title: course.title,
      subtitle: course.subtitle || '',
      description: course.description || '',
      mission: course.mission || '',
      category: course.category || 'Technology',
      level: course.level || 'intermediate',
      language: course.language || 'English',
      total_duration: course.total_duration || '',
      price: course.price || 0,
      is_free: course.is_free || false,
      status: course.status || 'draft',
      is_featured: course.is_featured || false,
      tags: course.tags || []
    });
    setShowCourseModal(true);
  };

  const handleSaveCourse = async () => {
    try {
      const url = '/api/admin/courses/all';
      const method = editingCourse ? 'PUT' : 'POST';
      
      const payload = {
        ...courseForm,
        slug: courseForm.title.toLowerCase().replace(/\s+/g, '-')
      };
      
      if (editingCourse) {
        payload.id = editingCourse.id;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowCourseModal(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course? All modules and lessons will be deleted.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/courses/all?id=${courseId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  // Creator CRUD
  const handleAddCreator = () => {
    setCreatorForm({
      name: '',
      email: '',
      bio: '',
      role: 'trainer',
      expertise: [],
      is_verified: false
    });
    setShowCreatorModal(true);
  };

  const handleSaveCreator = async () => {
    try {
      const response = await fetch('/api/admin/creators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creatorForm)
      });

      if (response.ok) {
        setShowCreatorModal(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error saving creator:', error);
    }
  };

  // Module CRUD
  const handleAddModule = (course) => {
    setSelectedCourse(course);
    setEditingModule(null);
    setModuleForm({
      module_number: (course.modules?.length || 0) + 1,
      title: '',
      duration: '4 Hours',
      track: 'Yellow',
      focus: '',
      description: ''
    });
    setShowModuleModal(true);
  };

  const handleEditModule = (module, course) => {
    setSelectedCourse(course);
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
      if (!selectedCourse) return;

      const payload = {
        ...moduleForm,
        course_id: selectedCourse.id,
        order_index: editingModule?.order_index || (selectedCourse.modules?.length || 0) + 1,
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
        fetchData();
      }
    } catch (error) {
      console.error('Error saving module:', error);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!confirm('Are you sure you want to delete this module? All lessons will be deleted.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/modules?id=${moduleId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting module:', error);
    }
  };

  // Lesson CRUD
  const handleAddLesson = (module, course) => {
    setEditingLesson(null);
    setSelectedModuleForLesson(module);
    setSelectedCourse(course);
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

  const handleEditLesson = (lesson, module, course) => {
    setEditingLesson(lesson);
    setSelectedModuleForLesson(module);
    setSelectedCourse(course);
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
        fetchData();
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
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  };

  // Filter courses
  const filteredCourses = courses.filter(course => {
    if (filterStatus !== 'all' && course.status !== filterStatus) return false;
    if (filterCreator !== 'all' && course.creator_id !== filterCreator) return false;
    if (filterCategory !== 'all' && course.category !== filterCategory) return false;
    if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const trackColors = {
    'Yellow': { bg: '#fef3c7', text: '#92400e', border: '#fbbf24', light: '#fffbeb' },
    'Green': { bg: '#d1fae5', text: '#065f46', border: '#10b981', light: '#f0fdf4' },
    'Blue': { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6', light: '#eff6ff' }
  };

  const lessonTypeConfig = {
    'theory': { icon: FileText, label: 'Theory', color: '#3b82f6' },
    'drill': { icon: Zap, label: 'Drill', color: '#f59e0b' },
    'strategy': { icon: Target, label: 'Strategy', color: '#8b5cf6' },
    'graduation': { icon: Award, label: 'Graduation', color: '#10b981' },
    'video': { icon: FileText, label: 'Video', color: '#ec4899' },
    'quiz': { icon: Target, label: 'Quiz', color: '#14b8a6' },
    'assignment': { icon: FileText, label: 'Assignment', color: '#f97316' },
    'live': { icon: Users, label: 'Live', color: '#ef4444' }
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
          borderTop: '4px solid #8b5cf6',
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
                Course Platform Manager
              </h1>
              <p style={{ fontSize: '16px', opacity: 0.95, marginBottom: '8px', lineHeight: '1.6' }}>
                Manage all courses, creators, modules, and lessons across the platform
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleAddCreator}
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
                <UserCheck size={18} />
                Add Creator
              </button>
              <button
                onClick={handleAddCourse}
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
            </div>
          </div>

          {/* Platform Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px' }}>
            {[
              { label: 'Total Courses', value: courses.length, icon: Package },
              { label: 'Published', value: courses.filter(c => c.status === 'published').length, icon: Eye },
              { label: 'Creators', value: creators.length, icon: Users },
              { label: 'Total Students', value: courses.reduce((sum, c) => sum + (c.enrolled_students || 0), 0), icon: GraduationCap },
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

      {/* Filters */}
      <div style={{ 
        background: '#fff', 
        borderRadius: '12px', 
        padding: '24px', 
        marginBottom: '24px',
        border: '1px solid #e5e7eb',
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 44px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '12px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            background: '#fff'
          }}
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>

        <select
          value={filterCreator}
          onChange={(e) => setFilterCreator(e.target.value)}
          style={{
            padding: '12px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            background: '#fff'
          }}
        >
          <option value="all">All Creators</option>
          {creators.map(creator => (
            <option key={creator.id} value={creator.id}>{creator.name}</option>
          ))}
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{
            padding: '12px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            background: '#fff'
          }}
        >
          <option value="all">All Categories</option>
          <option value="Technology">Technology</option>
          <option value="Business">Business</option>
          <option value="Design">Design</option>
          <option value="Marketing">Marketing</option>
        </select>
      </div>

      {/* Courses List */}
      {filteredCourses.length === 0 ? (
        <div style={{ 
          background: '#fff', 
          borderRadius: '12px', 
          padding: '60px', 
          textAlign: 'center',
          border: '1px solid #e5e7eb'
        }}>
          <BookOpen size={48} style={{ color: '#9ca3af', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
            No courses found
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
            {searchQuery || filterStatus !== 'all' || filterCreator !== 'all' || filterCategory !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by creating your first course'}
          </p>
          <button
            onClick={handleAddCourse}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              background: '#8b5cf6',
              color: '#fff',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Plus size={18} />
            Create Course
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredCourses.map((course) => {
            const isExpanded = expandedCourses[course.id];
            const statusColor = statusColors[course.status] || statusColors.draft;

            return (
              <div key={course.id} style={{
                background: '#fff',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                {/* Course Header */}
                <div
                  onClick={() => toggleCourse(course.id)}
                  style={{
                    padding: '24px',
                    cursor: 'pointer',
                    background: '#fafafa',
                    borderBottom: isExpanded ? '1px solid #e5e7eb' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#fafafa'}
                >
                  <div style={{ display: 'flex', alignItems: 'start', gap: '20px' }}>
                    {/* Course Thumbnail */}
                    <div style={{
                      width: '120px',
                      height: '80px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '32px',
                      fontWeight: '700'
                    }}>
                      <BookOpen size={40} />
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'start', gap: '12px', marginBottom: '8px' }}>
                        <h3 style={{
                          fontSize: '20px',
                          fontWeight: '700',
                          color: '#111827',
                          margin: 0,
                          flex: 1
                        }}>
                          {course.title}
                        </h3>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '6px',
                          background: statusColor.bg,
                          color: statusColor.text,
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'capitalize'
                        }}>
                          {course.status}
                        </span>
                        {course.is_featured && (
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '6px',
                            background: '#fef3c7',
                            color: '#92400e',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <Star size={12} fill="#92400e" />
                            Featured
                          </span>
                        )}
                      </div>
                      
                      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px', lineHeight: '1.5' }}>
                        {course.subtitle || course.description}
                      </p>
                      
                      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ 
                          fontSize: '13px', 
                          color: '#6b7280',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <UserCheck size={14} />
                          {course.creator?.name || 'Unknown'}
                        </span>
                        <span style={{ 
                          fontSize: '13px', 
                          color: '#6b7280',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <Layers size={14} />
                          {course.stats?.totalModules || 0} modules
                        </span>
                        <span style={{ 
                          fontSize: '13px', 
                          color: '#6b7280',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <BookOpen size={14} />
                          {course.stats?.totalLessons || 0} lessons
                        </span>
                        <span style={{ 
                          fontSize: '13px', 
                          color: '#6b7280',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <Users size={14} />
                          {course.enrolled_students || 0} students
                        </span>
                        <span style={{ 
                          fontSize: '13px', 
                          color: '#6b7280',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <Clock size={14} />
                          {course.total_duration || 'N/A'}
                        </span>
                        {!course.is_free && (
                          <span style={{ 
                            fontSize: '13px', 
                            color: '#10b981',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontWeight: '600'
                          }}>
                            <DollarSign size={14} />
                            {course.price} {course.currency}
                          </span>
                        )}
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
                          handleAddModule(course);
                        }}
                        style={{
                          padding: '10px 16px',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                          background: '#fff',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#8b5cf6',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f3f4f6';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#fff';
                        }}
                      >
                        <Plus size={14} />
                        Module
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCourse(course);
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
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#fff';
                          e.currentTarget.style.color = '#6b7280';
                        }}
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCourse(course.id);
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
                        onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
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

                {/* Modules List */}
                {isExpanded && course.modules && course.modules.length > 0 && (
                  <div style={{ padding: '24px', background: '#fafafa' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {course.modules.map((module) => {
                        const colors = trackColors[module.track] || { bg: '#f3f4f6', text: '#374151', border: '#9ca3af', light: '#fafafa' };
                        
                        return (
                          <div key={module.id} style={{
                            background: '#fff',
                            borderRadius: '10px',
                            border: `2px solid ${colors.border}20`,
                            padding: '20px',
                            transition: 'all 0.2s ease'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '10px',
                                background: `linear-gradient(135deg, ${colors.border} 0%, ${colors.text} 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontWeight: '700',
                                fontSize: '18px',
                                flexShrink: 0
                              }}>
                                {module.module_number}
                              </div>
                              
                              <div style={{ flex: 1 }}>
                                <h4 style={{
                                  fontSize: '16px',
                                  fontWeight: '600',
                                  color: '#111827',
                                  marginBottom: '4px'
                                }}>
                                  {module.title}
                                </h4>
                                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                                  {module.focus}
                                </p>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                  <span style={{
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    background: colors.bg,
                                    color: colors.text,
                                    fontSize: '11px',
                                    fontWeight: '600'
                                  }}>
                                    {module.track} Track
                                  </span>
                                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                    {module.duration}
                                  </span>
                                </div>
                              </div>

                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  onClick={() => handleAddLesson(module, course)}
                                  style={{
                                    padding: '8px 14px',
                                    borderRadius: '6px',
                                    border: '1px solid #e5e7eb',
                                    background: '#fff',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: '#8b5cf6',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                  }}
                                >
                                  <Plus size={12} />
                                  Lesson
                                </button>
                                <button
                                  onClick={() => handleEditModule(module, course)}
                                  style={{
                                    padding: '8px 14px',
                                    borderRadius: '6px',
                                    border: '1px solid #e5e7eb',
                                    background: '#fff',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: '#6b7280',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                  }}
                                >
                                  <Edit3 size={12} />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteModule(module.id)}
                                  style={{
                                    padding: '8px 14px',
                                    borderRadius: '6px',
                                    border: '1px solid #fee2e2',
                                    background: '#fff',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: '#dc2626',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                  }}
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>

                            {/* Lessons */}
                            {module.lessons && module.lessons.length > 0 && (
                              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  {module.lessons.map((lesson) => {
                                    const LessonIcon = lessonTypeConfig[lesson.type]?.icon || FileText;
                                    const lessonColor = lessonTypeConfig[lesson.type]?.color || '#6b7280';
                                    
                                    return (
                                      <div key={lesson.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        background: '#fafafa',
                                        border: '1px solid #f3f4f6'
                                      }}>
                                        <div style={{
                                          width: '36px',
                                          height: '36px',
                                          borderRadius: '8px',
                                          background: `${lessonColor}10`,
                                          border: `2px solid ${lessonColor}20`,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          flexShrink: 0
                                        }}>
                                          <LessonIcon size={16} style={{ color: lessonColor }} />
                                        </div>

                                        <div style={{ flex: 1 }}>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                                            <span style={{
                                              fontSize: '11px',
                                              fontWeight: '700',
                                              color: lessonColor,
                                              fontFamily: 'monospace'
                                            }}>
                                              {lesson.lesson_number}
                                            </span>
                                            <span style={{
                                              fontSize: '14px',
                                              fontWeight: '600',
                                              color: '#111827'
                                            }}>
                                              {lesson.title}
                                            </span>
                                          </div>
                                          <p style={{
                                            fontSize: '12px',
                                            color: '#6b7280',
                                            margin: 0
                                          }}>
                                            {lesson.description}
                                          </p>
                                        </div>

                                        <span style={{
                                          padding: '4px 8px',
                                          borderRadius: '4px',
                                          background: '#f3f4f6',
                                          color: '#6b7280',
                                          fontSize: '11px',
                                          fontWeight: '600'
                                        }}>
                                          {lesson.duration}
                                        </span>

                                        <button
                                          onClick={() => handleEditLesson(lesson, module, course)}
                                          style={{
                                            padding: '6px 10px',
                                            borderRadius: '6px',
                                            border: '1px solid #e5e7eb',
                                            background: '#fff',
                                            fontSize: '11px',
                                            fontWeight: '600',
                                            color: '#6b7280',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                          }}
                                        >
                                          <Edit3 size={10} />
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => handleDeleteLesson(lesson.id)}
                                          style={{
                                            padding: '6px 10px',
                                            borderRadius: '6px',
                                            border: '1px solid #fee2e2',
                                            background: '#fff',
                                            fontSize: '11px',
                                            fontWeight: '600',
                                            color: '#dc2626',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                          }}
                                        >
                                          <Trash2 size={10} />
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {isExpanded && (!course.modules || course.modules.length === 0) && (
                  <div style={{ padding: '40px', textAlign: 'center', background: '#fafafa' }}>
                    <Layers size={40} style={{ color: '#d1d5db', margin: '0 auto 12px' }} />
                    <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
                      No modules yet. Add your first module to get started.
                    </p>
                    <button
                      onClick={() => handleAddModule(course)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        background: '#8b5cf6',
                        color: '#fff',
                        border: 'none',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <Plus size={16} />
                      Add First Module
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Course Modal - Will add this in next part due to length */}
      {/* Creator Modal - Will add this in next part due to length */}
      {/* Module Modal - Will add this in next part due to length */}
      {/* Lesson Modal - Will add this in next part due to length */}
    </div>
  );
}
