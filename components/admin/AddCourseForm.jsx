"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCourseForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
    <div>
      {/* Header */}
      <div className="mb-4">
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '6px',
          letterSpacing: '-0.02em'
        }}>
          Add New Course
        </h1>
        <p style={{ fontSize: '15px', color: '#6b7280', margin: 0 }}>
          Create a new course for the DAGARMY platform
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div
          style={{
            background: '#dcfce7',
            border: '1px solid #86efac',
            borderRadius: '10px',
            padding: '14px 18px',
            marginBottom: '20px',
            color: '#166534',
            fontSize: '14px'
          }}
        >
          <strong>✓ Success!</strong> Course created successfully. Redirecting...
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          style={{
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '10px',
            padding: '14px 18px',
            marginBottom: '20px',
            color: '#991b1b',
            fontSize: '14px'
          }}
        >
          <strong>✗ Error:</strong> {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div
          style={{
            background: '#ffffff',
            borderRadius: '10px',
            padding: '28px',
            border: '1px solid #e5e7eb'
          }}
        >
          <div className="row g-4">
            {/* Course Title */}
            <div className="col-12">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px', display: 'block' }}>
                Course Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Advanced Machine Learning Techniques"
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

            {/* Category */}
            <div className="col-md-6">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px', display: 'block' }}>
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
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
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Instructor */}
            <div className="col-md-6">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px', display: 'block' }}>
                Instructor Name *
              </label>
              <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                required
                placeholder="e.g., Dr. Sarah Johnson"
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

            {/* Level */}
            <div className="col-md-4">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px', display: 'block' }}>
                Level
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
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
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div className="col-md-4">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px', display: 'block' }}>
                Language
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
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
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            {/* Access Level */}
            <div className="col-md-4">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px', display: 'block' }}>
                Access Level
              </label>
              <select
                name="accessLevel"
                value={formData.accessLevel}
                onChange={handleChange}
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
                {accessLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="col-md-4">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px', display: 'block' }}>
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
                  padding: '10px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <small style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                Set to 0 for free courses
              </small>
            </div>

            {/* Lessons */}
            <div className="col-md-4">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px', display: 'block' }}>
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
                  padding: '10px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Duration (Hours) */}
            <div className="col-md-4">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px', display: 'block' }}>
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
                  padding: '10px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Image URL */}
            <div className="col-12">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px', display: 'block' }}>
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
                  padding: '10px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <small style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                Upload image to /public/images/courses/ folder first
              </small>
            </div>

            {/* Description */}
            <div className="col-12">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px', display: 'block' }}>
                Course Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Enter a detailed description of the course..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical',
                  outline: 'none'
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
                padding: '10px 28px',
                borderRadius: '8px',
                background: isSubmitting ? '#9ca3af' : '#8b5cf6',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.background = '#7c3aed';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.background = '#8b5cf6';
                }
              }}
            >
              {isSubmitting ? 'Creating Course...' : 'Create Course'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/courses')}
              disabled={isSubmitting}
              style={{
                padding: '10px 28px',
                borderRadius: '8px',
                background: '#ffffff',
                color: '#6b7280',
                fontSize: '14px',
                fontWeight: '600',
                border: '1px solid #e5e7eb',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.background = '#f9fafb';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.background = '#ffffff';
                }
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
