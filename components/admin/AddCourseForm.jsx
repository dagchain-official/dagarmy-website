"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCourseForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
<<<<<<< HEAD
  const [focusedField, setFocusedField] = useState(null);
=======
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696

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
<<<<<<< HEAD
=======
      // Validate required fields
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
      if (!formData.title || !formData.instructor) {
        throw new Error("Title and Instructor are required");
      }

<<<<<<< HEAD
=======
      // Generate unique ID
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
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

<<<<<<< HEAD
=======
      // Send to API
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
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
<<<<<<< HEAD

=======
      
      // Redirect after 2 seconds
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
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
            background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
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
=======
    <div>
      {/* Header */}
      <div className="mb-4">
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
          Add New Course
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
          Create a new course for the DAGARMY platform
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div
          style={{
<<<<<<< HEAD
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
=======
            background: '#dcfce7',
            border: '1px solid #86efac',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '24px',
            color: '#166534'
          }}
        >
          <strong>✓ Success!</strong> Course created successfully. Redirecting...
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          style={{
<<<<<<< HEAD
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
=======
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '24px',
            color: '#991b1b'
          }}
        >
          <strong>✗ Error:</strong> {error}
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div
          style={{
<<<<<<< HEAD
            background: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid #e5e7eb',
            animation: 'slideUp 0.6s ease-out 0.1s backwards',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
=======
            background: '#fff',
            borderRadius: '12px',
            padding: '32px',
            border: '1px solid #e5e7eb'
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
          }}
        >
          <div className="row g-4">
            {/* Course Title */}
            <div className="col-12">
<<<<<<< HEAD
              <label style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px',
                display: 'block',
                transition: 'color 0.2s ease'
              }}>
=======
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                Course Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
<<<<<<< HEAD
                onFocus={() => setFocusedField('title')}
                onBlur={() => setFocusedField(null)}
=======
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                required
                placeholder="e.g., Advanced Machine Learning Techniques"
                style={{
                  width: '100%',
                  padding: '12px 16px',
<<<<<<< HEAD
                  border: `1px solid ${focusedField === 'title' ? '#1f2937' : '#e5e7eb'}`,
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: focusedField === 'title' ? '0 0 0 3px rgba(139, 92, 246, 0.1)' : 'none'
=======
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                }}
              />
            </div>

<<<<<<< HEAD
            {/* Category & Instructor */}
            <div className="col-md-6">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
=======
            {/* Category */}
            <div className="col-md-6">
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
<<<<<<< HEAD
                onFocus={() => setFocusedField('category')}
                onBlur={() => setFocusedField(null)}
=======
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
<<<<<<< HEAD
                  border: `1px solid ${focusedField === 'category' ? '#1f2937' : '#e5e7eb'}`,
                  borderRadius: '10px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: focusedField === 'category' ? '0 0 0 3px rgba(139, 92, 246, 0.1)' : 'none'
=======
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

<<<<<<< HEAD
            <div className="col-md-6">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
=======
            {/* Instructor */}
            <div className="col-md-6">
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                Instructor Name *
              </label>
              <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
<<<<<<< HEAD
                onFocus={() => setFocusedField('instructor')}
                onBlur={() => setFocusedField(null)}
=======
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                required
                placeholder="e.g., Dr. Sarah Johnson"
                style={{
                  width: '100%',
                  padding: '12px 16px',
<<<<<<< HEAD
                  border: `1px solid ${focusedField === 'instructor' ? '#1f2937' : '#e5e7eb'}`,
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: focusedField === 'instructor' ? '0 0 0 3px rgba(139, 92, 246, 0.1)' : 'none'
=======
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                }}
              />
            </div>

<<<<<<< HEAD
            {/* Level, Language, Access Level */}
            <div className="col-md-4">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
=======
            {/* Level */}
            <div className="col-md-4">
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
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
<<<<<<< HEAD
                  borderRadius: '10px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.2s ease'
=======
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                }}
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

<<<<<<< HEAD
            <div className="col-md-4">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
=======
            {/* Language */}
            <div className="col-md-4">
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
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
<<<<<<< HEAD
                  borderRadius: '10px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.2s ease'
=======
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                }}
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

<<<<<<< HEAD
            <div className="col-md-4">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
=======
            {/* Access Level */}
            <div className="col-md-4">
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
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
<<<<<<< HEAD
                  borderRadius: '10px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.2s ease'
=======
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                }}
              >
                {accessLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

<<<<<<< HEAD
            {/* Price, Lessons, Hours */}
            <div className="col-md-4">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
=======
            {/* Price */}
            <div className="col-md-4">
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
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
<<<<<<< HEAD
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              />
              <small style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px', display: 'block' }}>
=======
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <small style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', display: 'block' }}>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                Set to 0 for free courses
              </small>
            </div>

<<<<<<< HEAD
            <div className="col-md-4">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
=======
            {/* Lessons */}
            <div className="col-md-4">
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
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
<<<<<<< HEAD
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s ease'
=======
                  borderRadius: '8px',
                  fontSize: '14px'
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                }}
              />
            </div>

<<<<<<< HEAD
            <div className="col-md-4">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
=======
            {/* Duration (Hours) */}
            <div className="col-md-4">
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
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
<<<<<<< HEAD
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s ease'
=======
                  borderRadius: '8px',
                  fontSize: '14px'
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                }}
              />
            </div>

            {/* Image URL */}
            <div className="col-12">
<<<<<<< HEAD
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
=======
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
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
<<<<<<< HEAD
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              />
              <small style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px', display: 'block' }}>
=======
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <small style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', display: 'block' }}>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                Upload image to /public/images/courses/ folder first
              </small>
            </div>

            {/* Description */}
            <div className="col-12">
<<<<<<< HEAD
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
=======
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                Course Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
<<<<<<< HEAD
                onFocus={() => setFocusedField('description')}
                onBlur={() => setFocusedField(null)}
=======
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                rows="5"
                placeholder="Enter a detailed description of the course..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
<<<<<<< HEAD
                  border: `1px solid ${focusedField === 'description' ? '#1f2937' : '#e5e7eb'}`,
                  borderRadius: '10px',
                  fontSize: '14px',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: focusedField === 'description' ? '0 0 0 3px rgba(139, 92, 246, 0.1)' : 'none',
                  fontFamily: 'inherit'
=======
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical'
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
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
<<<<<<< HEAD
                background: isSubmitting ? '#9ca3af' : 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                color: '#ffffff',
=======
                background: isSubmitting ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                fontSize: '14px',
                fontWeight: '600',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
<<<<<<< HEAD
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
=======
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
              }}
            >
              {isSubmitting ? 'Creating Course...' : 'Create Course'}
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/courses')}
              disabled={isSubmitting}
              style={{
                padding: '12px 32px',
                borderRadius: '10px',
<<<<<<< HEAD
                background: '#ffffff',
=======
                background: '#fff',
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
                color: '#6b7280',
                fontSize: '14px',
                fontWeight: '600',
                border: '1px solid #e5e7eb',
<<<<<<< HEAD
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
=======
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
<<<<<<< HEAD

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
=======
>>>>>>> ce58dfb9a29404e0e53762f89e30f67778f4a696
    </div>
  );
}
