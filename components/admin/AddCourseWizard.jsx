"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  BookOpen, ArrowRight, ArrowLeft, Plus, Trash2, Edit3, Save, 
  CheckCircle, Layers, FileText, Video, Clock, Target, Award, X
} from "lucide-react";

export default function AddCourseWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  // Course Basic Info
  const [courseData, setCourseData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    mission: '',
    category: 'Technology',
    level: 'intermediate',
    language: 'English',
    total_duration: '',
    banner_url: '',
    is_free: true,
    status: 'draft',
    is_featured: false,
    tags: []
  });

  const [bannerFile, setBannerFile] = useState(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  // Modules
  const [modules, setModules] = useState([]);
  const [currentModule, setCurrentModule] = useState({
    module_number: 1,
    title: '',
    description: '',
    duration: '',
    track: 'Yellow',
    focus: ''
  });

  // Lessons for current module
  const [currentLessons, setCurrentLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState({
    lesson_number: 1,
    title: '',
    type: 'Theory',
    duration: '',
    description: '',
    video_url: ''
  });

  const handleCourseChange = (field, value) => {
    setCourseData({ ...courseData, [field]: value });
    if (field === 'title') {
      // Auto-generate slug
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setCourseData(prev => ({ ...prev, slug }));
    }
  };

  const handleImageUpload = async (file) => {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setNotification({ type: 'error', message: 'Image size must be less than 5MB' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setNotification({ type: 'error', message: 'Please upload a valid image file' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    // Create preview URL and validate aspect ratio
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = (img.width / img.height).toFixed(2);
        const recommendedRatio = (16 / 9).toFixed(2);
        
        // Show warning if aspect ratio is not ideal
        if (Math.abs(aspectRatio - recommendedRatio) > 0.2) {
          setNotification({ 
            type: 'error', 
            message: `Image aspect ratio is ${aspectRatio}:1. Recommended is 16:9 (1.78:1) for best display` 
          });
          setTimeout(() => setNotification(null), 5000);
        }
        
        // Store file and preview URL
        setBannerFile(file);
        setCourseData(prev => ({ ...prev, banner_url: e.target.result }));
        setNotification({ type: 'success', message: 'Banner image ready to upload!' });
        setTimeout(() => setNotification(null), 3000);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const addModule = () => {
    if (!currentModule.title) {
      alert('Please enter module title');
      return;
    }
    
    const newModule = {
      ...currentModule,
      lessons: [...currentLessons],
      order_index: modules.length + 1
    };
    
    setModules([...modules, newModule]);
    setCurrentModule({
      module_number: modules.length + 2,
      title: '',
      description: '',
      duration: '',
      track: 'Yellow',
      focus: ''
    });
    setCurrentLessons([]);
    setNotification({ type: 'success', message: 'Module added successfully!' });
    setTimeout(() => setNotification(null), 3000);
  };

  const addLesson = () => {
    if (!currentLesson.title) {
      alert('Please enter lesson title');
      return;
    }
    
    const newLesson = {
      ...currentLesson,
      order_index: currentLessons.length + 1
    };
    
    setCurrentLessons([...currentLessons, newLesson]);
    setCurrentLesson({
      lesson_number: currentLessons.length + 2,
      title: '',
      type: 'Theory',
      duration: '',
      description: '',
      video_url: ''
    });
    setNotification({ type: 'success', message: 'Lesson added to module!' });
    setTimeout(() => setNotification(null), 3000);
  };

  const removeModule = (index) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const removeLesson = (index) => {
    setCurrentLessons(currentLessons.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Add current module if it has content
    let finalModules = [...modules];
    if (currentModule.title && currentLessons.length > 0) {
      finalModules.push({
        ...currentModule,
        lessons: currentLessons,
        order_index: modules.length + 1
      });
    }

    if (finalModules.length === 0) {
      alert('Please add at least one module with lessons');
      return;
    }

    try {
      setSaving(true);
      
      // Upload banner image if exists
      let bannerUrl = courseData.banner_url;
      if (bannerFile) {
        setUploadingBanner(true);
        const formData = new FormData();
        formData.append('file', bannerFile);
        formData.append('folder', 'course-banners');
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        const uploadData = await uploadResponse.json();
        if (uploadResponse.ok && uploadData.url) {
          bannerUrl = uploadData.url;
        } else {
          setNotification({ type: 'error', message: 'Failed to upload banner image' });
          setUploadingBanner(false);
          setSaving(false);
          setTimeout(() => setNotification(null), 3000);
          return;
        }
        setUploadingBanner(false);
      }
      
      const response = await fetch('/api/admin/courses/create-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course: { ...courseData, banner_url: bannerUrl },
          modules: finalModules
        })
      });

      const data = await response.json();

      if (response.ok) {
        setNotification({ type: 'success', message: 'Course created successfully!' });
        setTimeout(() => router.push('/admin/courses'), 2000);
      } else {
        setNotification({ type: 'error', message: data.error || 'Failed to create course' });
      }
    } catch (error) {
      console.error('Error creating course:', error);
      setNotification({ type: 'error', message: 'An error occurred' });
    } finally {
      setSaving(false);
      setUploadingBanner(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const steps = [
    { number: 1, title: 'Course Info', icon: BookOpen },
    { number: 2, title: 'Add Modules', icon: Layers },
    { number: 3, title: 'Review & Submit', icon: CheckCircle }
  ];

  return (
    <div style={{ padding: '32px', width: '100%', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          padding: '16px 24px',
          borderRadius: '12px',
          background: notification.type === 'success' 
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
            : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '600',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {notification.type === 'success' ? '✓' : '✕'} {notification.message}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
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
            <Plus size={24} style={{ color: '#fff' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', margin: 0, lineHeight: 1 }}>
              Create New Course
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0, marginTop: '4px' }}>
              Add complete course with modules and lessons
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <div key={step.number} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  flex: 1,
                  padding: '20px',
                  borderRadius: '16px',
                  background: isActive ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' : '#fff',
                  border: `2px solid ${isActive ? '#1f2937' : isCompleted ? '#10b981' : '#e2e8f0'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onClick={() => setCurrentStep(step.number)}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: isActive ? 'rgba(255,255,255,0.2)' : isCompleted ? '#d1fae5' : '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {isCompleted ? (
                      <CheckCircle size={20} style={{ color: '#10b981' }} />
                    ) : (
                      <Icon size={20} style={{ color: isActive ? '#fff' : '#64748b' }} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: isActive ? 'rgba(255,255,255,0.8)' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Step {step.number}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: isActive ? '#fff' : '#0f172a' }}>
                      {step.title}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight size={20} style={{ color: '#cbd5e1', flexShrink: 0 }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '32px',
        border: '2px solid #e2e8f0',
        marginBottom: '24px'
      }}>
        {/* Step 1: Course Info */}
        {currentStep === 1 && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '24px' }}>
              Basic Course Information
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                  Course Title <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={courseData.title}
                  onChange={(e) => handleCourseChange('title', e.target.value)}
                  placeholder="e.g., The Next-Gen Tech Architect Program"
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#1f2937'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                  Subtitle
                </label>
                <input
                  type="text"
                  value={courseData.subtitle}
                  onChange={(e) => handleCourseChange('subtitle', e.target.value)}
                  placeholder="One Unified Journey: AI + Blockchain + Data Visualization"
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#1f2937'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                  Description
                </label>
                <textarea
                  value={courseData.description}
                  onChange={(e) => handleCourseChange('description', e.target.value)}
                  rows={4}
                  placeholder="Describe what students will learn in this course..."
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#1f2937'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                  Banner Image <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>(Recommended: 16:9 aspect ratio, max 5MB)</span>
                </label>
                <div style={{
                  width: '100%',
                  padding: '24px',
                  border: '2px dashed #cbd5e1',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: '#f8fafc',
                  position: 'relative'
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = '#1f2937';
                  e.currentTarget.style.background = '#faf5ff';
                }}
                onDragLeave={(e) => {
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.background = '#f8fafc';
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.background = '#f8fafc';
                  const file = e.dataTransfer.files[0];
                  if (file && file.type.startsWith('image/')) {
                    handleImageUpload(file);
                  }
                }}
                onClick={() => document.getElementById('banner-upload').click()}>
                  <input
                    id="banner-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleImageUpload(file);
                    }}
                    style={{ display: 'none' }}
                  />
                  {!courseData.banner_url ? (
                    <div>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 12px',
                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)'
                      }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>
                        Click to upload or drag and drop
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                        PNG, JPG, WEBP up to 5MB
                      </div>
                    </div>
                  ) : (
                    <div style={{ position: 'relative' }}>
                      <img
                        src={courseData.banner_url}
                        alt="Banner preview"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '300px',
                          borderRadius: '10px',
                          objectFit: 'contain'
                        }}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCourseChange('banner_url', '');
                          setBannerFile(null);
                        }}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          padding: '8px',
                          borderRadius: '8px',
                          background: 'rgba(239, 68, 68, 0.9)',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}>
                        <X size={16} style={{ color: '#fff' }} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                  Category
                </label>
                <select
                  value={courseData.category}
                  onChange={(e) => handleCourseChange('category', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    background: '#fff',
                    cursor: 'pointer'
                  }}>
                  <option value="Technology">Technology</option>
                  <option value="AI">AI</option>
                  <option value="Blockchain">Blockchain</option>
                  <option value="Data Science">Data Science</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                  Level
                </label>
                <select
                  value={courseData.level}
                  onChange={(e) => handleCourseChange('level', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    background: '#fff',
                    cursor: 'pointer'
                  }}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                  Total Duration
                </label>
                <input
                  type="text"
                  value={courseData.total_duration}
                  onChange={(e) => handleCourseChange('total_duration', e.target.value)}
                  placeholder="e.g., 32 Hours"
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#1f2937'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                  Language
                </label>
                <input
                  type="text"
                  value={courseData.language}
                  onChange={(e) => handleCourseChange('language', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#1f2937'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={courseData.is_free}
                    onChange={(e) => handleCourseChange('is_free', e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#1f2937' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Free Course</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={courseData.is_featured}
                    onChange={(e) => handleCourseChange('is_featured', e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#1f2937' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Featured Course</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Add Modules & Lessons */}
        {currentStep === 2 && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
              Add Modules & Lessons
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
              Create modules and add lessons to each module
            </p>

            {/* Current Module Form */}
            <div style={{
              padding: '24px',
              background: '#f8fafc',
              borderRadius: '16px',
              border: '2px solid #e2e8f0',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={20} style={{ color: '#1f2937' }} />
                Module #{currentModule.module_number}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                    Module Title <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={currentModule.title}
                    onChange={(e) => setCurrentModule({ ...currentModule, title: e.target.value })}
                    placeholder="e.g., The AI Briefing & Vibe Coding Philosophy"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      background: '#fff'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#1f2937'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                    Duration
                  </label>
                  <input
                    type="text"
                    value={currentModule.duration}
                    onChange={(e) => setCurrentModule({ ...currentModule, duration: e.target.value })}
                    placeholder="e.g., 4 Hours"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      background: '#fff'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#1f2937'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                    Track
                  </label>
                  <select
                    value={currentModule.track}
                    onChange={(e) => setCurrentModule({ ...currentModule, track: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      background: '#fff',
                      cursor: 'pointer'
                    }}>
                    <option value="Yellow">Yellow</option>
                    <option value="Green">Green</option>
                    <option value="Blue">Blue</option>
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                    Description
                  </label>
                  <textarea
                    value={currentModule.description}
                    onChange={(e) => setCurrentModule({ ...currentModule, description: e.target.value })}
                    rows={3}
                    placeholder="Module description..."
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      background: '#fff',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#1f2937'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>
              </div>

              {/* Add Lesson to Current Module */}
              <div style={{
                padding: '20px',
                background: '#fff',
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                marginBottom: '16px'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={18} style={{ color: '#10b981' }} />
                  Add Lesson #{currentLesson.lesson_number}
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <input
                      type="text"
                      value={currentLesson.title}
                      onChange={(e) => setCurrentLesson({ ...currentLesson, title: e.target.value })}
                      placeholder="Lesson title..."
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                    />
                  </div>

                  <div>
                    <select
                      value={currentLesson.type}
                      onChange={(e) => setCurrentLesson({ ...currentLesson, type: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '13px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}>
                      <option value="Theory">Theory</option>
                      <option value="Drill">Drill</option>
                      <option value="Strategy">Strategy</option>
                      <option value="Graduation">Graduation</option>
                    </select>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={currentLesson.duration}
                      onChange={(e) => setCurrentLesson({ ...currentLesson, duration: e.target.value })}
                      placeholder="Duration (e.g., 30 min)"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <input
                      type="text"
                      value={currentLesson.video_url}
                      onChange={(e) => setCurrentLesson({ ...currentLesson, video_url: e.target.value })}
                      placeholder="Video URL (optional)"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <button
                      onClick={addLesson}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#fff',
                        border: 'none',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}>
                      <Plus size={16} />
                      Add Lesson to Module
                    </button>
                  </div>
                </div>
              </div>

              {/* Current Module Lessons List */}
              {currentLessons.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                    Lessons in this module ({currentLessons.length}):
                  </div>
                  {currentLessons.map((lesson, index) => (
                    <div key={index} style={{
                      padding: '12px',
                      background: '#fff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      marginBottom: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>
                          {lesson.lesson_number}. {lesson.title}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          {lesson.type} • {lesson.duration}
                        </div>
                      </div>
                      <button
                        onClick={() => removeLesson(index)}
                        style={{
                          padding: '6px',
                          borderRadius: '6px',
                          background: '#fee2e2',
                          border: 'none',
                          cursor: 'pointer'
                        }}>
                        <Trash2 size={14} style={{ color: '#dc2626' }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={addModule}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                }}>
                <Plus size={18} />
                Save Module & Start Next
              </button>
            </div>

            {/* Added Modules List */}
            {modules.length > 0 && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>
                  Added Modules ({modules.length})
                </h3>
                {modules.map((module, index) => (
                  <div key={index} style={{
                    padding: '20px',
                    background: '#fff',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    marginBottom: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
                          Module {module.module_number}: {module.title}
                        </div>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>
                          {module.lessons.length} lessons • {module.duration} • {module.track} Track
                        </div>
                      </div>
                      <button
                        onClick={() => removeModule(index)}
                        style={{
                          padding: '8px',
                          borderRadius: '8px',
                          background: '#fee2e2',
                          border: 'none',
                          cursor: 'pointer'
                        }}>
                        <Trash2 size={16} style={{ color: '#dc2626' }} />
                      </button>
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                      Lessons: {module.lessons.map(l => l.title).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {currentStep === 3 && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '24px' }}>
              Review & Submit
            </h2>

            {/* Course Summary */}
            <div style={{
              padding: '24px',
              background: '#f8fafc',
              borderRadius: '16px',
              border: '2px solid #e2e8f0',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>
                {courseData.title}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>
                    Modules
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#1f2937' }}>
                    {modules.length + (currentModule.title && currentLessons.length > 0 ? 1 : 0)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>
                    Total Lessons
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#10b981' }}>
                    {modules.reduce((sum, m) => sum + m.lessons.length, 0) + currentLessons.length}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>
                    Duration
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#f59e0b' }}>
                    {courseData.total_duration}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>
                {courseData.description}
              </div>
            </div>

            {/* Modules Preview */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>
                Course Structure
              </h3>
              {modules.map((module, mIndex) => (
                <div key={mIndex} style={{
                  padding: '16px',
                  background: '#fff',
                  borderRadius: '12px',
                  border: '2px solid #e2e8f0',
                  marginBottom: '12px'
                }}>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
                    Module {module.module_number}: {module.title}
                  </div>
                  <div style={{ paddingLeft: '16px' }}>
                    {module.lessons.map((lesson, lIndex) => (
                      <div key={lIndex} style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>
                        • {lesson.title} ({lesson.type}, {lesson.duration})
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
        <button
          onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
          disabled={currentStep === 1}
          style={{
            padding: '14px 24px',
            borderRadius: '12px',
            background: currentStep === 1 ? '#f1f5f9' : '#fff',
            border: '2px solid #e2e8f0',
            fontSize: '14px',
            fontWeight: '600',
            color: currentStep === 1 ? '#cbd5e1' : '#475569',
            cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
          <ArrowLeft size={18} />
          Previous
        </button>

        {currentStep < 3 ? (
          <button
            onClick={() => {
              if (currentStep === 1 && !courseData.title) {
                alert('Please enter course title');
                return;
              }
              setCurrentStep(currentStep + 1);
            }}
            style={{
              padding: '14px 24px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}>
            Next
            <ArrowRight size={18} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              padding: '14px 32px',
              borderRadius: '12px',
              background: saving ? '#cbd5e1' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              color: '#fff',
              cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: saving ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}>
            <Save size={18} />
            {uploadingBanner ? 'Uploading Banner...' : saving ? 'Creating Course...' : 'Create Course'}
          </button>
        )}
      </div>
    </div>
  );
}
