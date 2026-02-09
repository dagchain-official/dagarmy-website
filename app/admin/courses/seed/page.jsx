"use client";
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function SeedCoursePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSeed = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/admin/courses/seed-multi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to seed course');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e5e7eb'
        }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#111827', marginBottom: '16px' }}>
            Seed Next-Gen Tech Architect Program
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '32px' }}>
            This will create "The Next-Gen Tech Architect Program" course with all 8 modules and their lessons in your Supabase database.
          </p>

          <div style={{
            padding: '20px',
            background: '#fef3c7',
            border: '1px solid #fbbf24',
            borderRadius: '12px',
            marginBottom: '32px'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#92400e', marginBottom: '8px' }}>
              ⚠️ Important
            </h3>
            <ul style={{ fontSize: '14px', color: '#92400e', margin: 0, paddingLeft: '20px' }}>
              <li>This will create a new course creator (DAGARMY organization)</li>
              <li>The course will be created with 8 modules (Yellow, Green, Blue tracks)</li>
              <li>All lessons will be populated for each module</li>
              <li>If the course already exists, this may create duplicates</li>
            </ul>
          </div>

          <button
            onClick={handleSeed}
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              background: loading 
                ? '#d1d5db' 
                : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.3)',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Seeding Course...' : 'Seed Course Now'}
          </button>

          {/* Success Result */}
          {result && (
            <div style={{
              marginTop: '24px',
              padding: '20px',
              background: '#dcfce7',
              border: '1px solid #86efac',
              borderRadius: '12px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#166534', marginBottom: '12px' }}>
                ✅ Course Seeded Successfully!
              </h3>
              <div style={{ fontSize: '14px', color: '#166534' }}>
                <p><strong>Course:</strong> {result.course?.title}</p>
                <p><strong>Modules Created:</strong> {result.modulesCreated || 0}</p>
                <p><strong>Lessons Created:</strong> {result.lessonsCreated || 0}</p>
                <p style={{ marginTop: '16px' }}>
                  You can now view the course in the <a href="/admin/courses" style={{ color: '#166534', fontWeight: '700', textDecoration: 'underline' }}>Courses section</a> and use it in the <a href="/admin/assignments" style={{ color: '#166534', fontWeight: '700', textDecoration: 'underline' }}>Assignment Management</a>.
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              marginTop: '24px',
              padding: '20px',
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '12px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#991b1b', marginBottom: '8px' }}>
                ❌ Error
              </h3>
              <p style={{ fontSize: '14px', color: '#dc2626', margin: 0 }}>
                {error}
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
