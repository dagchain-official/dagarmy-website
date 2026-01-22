"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCourseForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Artificial Intelligence",
    instructor: "",
    level: "Beginner",
    language: "English",
    price: 0,
    lessons: 1,
    hours: 1,
    description: "",
    features: ["Lifetime Access", "Certificate"],
    accessLevel: "FREE",
    imgSrc: "/images/courses/courses-01.jpg"
  });

  const categories = ["Artificial Intelligence", "Blockchain", "Data Visualisation"];
  const levels = ["Beginner", "Intermediate", "Advanced"];
  const languages = ["English", "Spanish", "French", "German", "Hindi"];
  const accessLevels = ["FREE", "DAG Soldier", "DAG Lieutenant"];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      if (!formData.title || !formData.instructor) {
        throw new Error("Title and Instructor are required");
      }

      const newCourse = {
        ...formData,
        id: Date.now(),
        students: 0,
        rating: 0,
        reviews: 0,
        totalReviews: 0,
        instractors: [formData.instructor],
        level: [formData.level],
        language: [formData.language],
        filterCategories: [formData.category],
        badges: formData.accessLevel === "FREE" ? ["dag-soldier", "dag-lieutenant"] : ["dag-lieutenant"],
        duration: `${formData.hours} hours`
      };

      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCourse),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create course');
      }

      setSuccess(true);

      setTimeout(() => {
        router.push('/admin/courses');
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* Header */}
      <div className="mb-4" style={{ animation: 'slideUp 0.5s ease-out' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            ➕
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#111827',
            margin: 0,
            letterSpacing: '-0.02em'
          }}>
            Add New Course
          </h1>
        </div>
        <p style={{ fontSize: '15px', color: '#6b7280', margin: 0, marginLeft: '52px' }}>
          Create a new course for the DAGARMY platform
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'slideUp 0.3s ease-out'
          }}
        >
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '700'
          }}>
            ✓
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#065f46', marginBottom: '2px' }}>
              Success!
            </div>
            <div style={{ fontSize: '13px', color: '#047857' }}>
              Course created successfully. Redirecting...
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'slideUp 0.3s ease-out'
          }}
        >
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '700'
          }}>
            ✗
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#991b1b', marginBottom: '2px' }}>
              Error
            </div>
            <div style={{ fontSize: '13px', color: '#b91c1c' }}>
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid #e5e7eb',
            animation: 'slideUp 0.6s ease-out 0.1s backwards',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
          }}
        >
          <div className="row g-4">
            {/* Course Title */}
            <div className="col-12">
              <label style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px',
                display: 'block',
                transition: 'color 0.2s ease'
              }}>
                Course Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onFocus={() => setFocusedField('title')}
                onBlur={() => setFocusedField(null)}
                required
                placeholder="e.g., Advanced Machine Learning Techniques"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `1px solid ${focusedField === 'title' ? '#8b5cf6' : '#e5e7eb'}`,
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: focusedField === 'title' ? '0 0 0 3px rgba(139, 92, 246, 0.1)' : 'none'
                }}
              />
            </div>

            {/* Category & Instructor */}
            <div className="col-md-6">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                onFocus={() => setFocusedField('category')}
                onBlur={() => setFocusedField(null)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `1px solid ${focusedField === 'category' ? '#8b5cf6' : '#e5e7eb'}`,
                  borderRadius: '10px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: focusedField === 'category' ? '0 0 0 3px rgba(139, 92, 246, 0.1)' : 'none'
                }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                Instructor Name *
              </label>
              <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                onFocus={() => setFocusedField('instructor')}
                onBlur={() => setFocusedField(null)}
                required
                placeholder="e.g., Dr. Sarah Johnson"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `1px solid ${focusedField === 'instructor' ? '#8b5cf6' : '#e5e7eb'}`,
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: focusedField === 'instructor' ? '0 0 0 3px rgba(139, 92, 246, 0.1)' : 'none'
                }}
              />
            </div>

            {/* Level, Language, Access Level */}
            <div className="col-md-4">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                Level
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                Language
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                Access Level
              </label>
              <select
                name="accessLevel"
                value={formData.accessLevel}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {accessLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Price, Lessons, Hours */}
            <div className="col-md-4">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="1"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              />
              <small style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                Set to 0 for free courses
              </small>
            </div>

            <div className="col-md-4">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                Number of Lessons
              </label>
              <input
                type="number"
                name="lessons"
                value={formData.lessons}
                onChange={handleChange}
                min="1"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              />
            </div>

            <div className="col-md-4">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                Duration (Hours)
              </label>
              <input
                type="number"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                min="1"
                step="0.5"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              />
            </div>

            {/* Image URL */}
            <div className="col-12">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                Course Image URL
              </label>
              <input
                type="text"
                name="imgSrc"
                value={formData.imgSrc}
                onChange={handleChange}
                placeholder="/images/courses/your-image.jpg"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              />
              <small style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                Upload image to /public/images/courses/ folder first
              </small>
            </div>

            {/* Description */}
            <div className="col-12">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                Course Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                onFocus={() => setFocusedField('description')}
                onBlur={() => setFocusedField(null)}
                rows="5"
                placeholder="Enter a detailed description of the course..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `1px solid ${focusedField === 'description' ? '#8b5cf6' : '#e5e7eb'}`,
                  borderRadius: '10px',
                  fontSize: '14px',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: focusedField === 'description' ? '0 0 0 3px rgba(139, 92, 246, 0.1)' : 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-3 mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '12px 32px',
                borderRadius: '10px',
                background: isSubmitting ? '#9ca3af' : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isSubmitting ? 'none' : '0 4px 12px rgba(139, 92, 246, 0.3)',
                animation: isSubmitting ? 'pulse 1.5s ease-in-out infinite' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
                }
              }}
            >
              {isSubmitting ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #ffffff',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.6s linear infinite'
                  }} />
                  Creating Course...
                </span>
              ) : 'Create Course'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/courses')}
              disabled={isSubmitting}
              style={{
                padding: '12px 32px',
                borderRadius: '10px',
                background: '#ffffff',
                color: '#6b7280',
                fontSize: '14px',
                fontWeight: '600',
                border: '1px solid #e5e7eb',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.background = '#f9fafb';
                  e.currentTarget.style.color = '#111827';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.color = '#6b7280';
                }
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
