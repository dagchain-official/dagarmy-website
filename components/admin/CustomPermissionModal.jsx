"use client";
import React, { useState } from "react";
import { X, Save, Plus, AlertCircle, CheckCircle } from "lucide-react";

export default function CustomPermissionModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    permission_key: '',
    permission_label: '',
    permission_description: '',
    module_key: 'dashboard'
  });
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const modules = [
    { key: 'dashboard', label: 'Dashboard & Analytics' },
    { key: 'users', label: 'User Management' },
    { key: 'courses', label: 'Course Management' },
    { key: 'content', label: 'Content & Media' },
    { key: 'progress', label: 'Student Progress & Tracking' },
    { key: 'trainers', label: 'Trainers & Mentors' },
    { key: 'communications', label: 'Communications' },
    { key: 'reports', label: 'Reports & Analytics' },
    { key: 'roles', label: 'Role & Access Management' },
    { key: 'settings', label: 'Settings & Configuration' },
    { key: 'system', label: 'System & Audit' },
    { key: 'custom', label: 'Custom Module' }
  ];

  const handleSubmit = async () => {
    if (!formData.permission_label || !formData.permission_description) {
      setNotification({ type: 'error', message: 'Label and description are required' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    // Auto-generate permission key if not provided
    let permissionKey = formData.permission_key;
    if (!permissionKey) {
      permissionKey = `${formData.module_key}.${formData.permission_label.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/admin/custom-permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          permission_key: permissionKey
        })
      });

      const data = await response.json();

      if (response.ok) {
        setNotification({ type: 'success', message: 'Custom permission created!' });
        setTimeout(() => {
          onSave(data.permission);
          onClose();
        }, 1500);
      } else {
        setNotification({ type: 'error', message: data.error || 'Failed to create permission' });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      console.error('Error creating permission:', error);
      setNotification({ type: 'error', message: 'An error occurred' });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }}
    onClick={onClose}>
      <div style={{
        background: '#fff',
        borderRadius: '24px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
        border: '2px solid #e2e8f0'
      }}
      onClick={(e) => e.stopPropagation()}>
        {notification && (
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '10px',
            background: notification.type === 'success' 
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
              : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: '#fff',
            fontSize: '13px',
            fontWeight: '600',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
            zIndex: 10001,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {notification.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {notification.message}
          </div>
        )}

        {/* Header */}
        <div style={{
          padding: '28px',
          borderBottom: '2px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0, marginBottom: '4px' }}>
              Create Custom Permission
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Add a new permission type for specific access control
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              borderRadius: '10px',
              background: '#f8fafc',
              border: '2px solid #e2e8f0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <X size={20} style={{ color: '#64748b' }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '28px' }}>
          <div style={{ display: 'grid', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                Module <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={formData.module_key}
                onChange={(e) => setFormData({ ...formData, module_key: e.target.value })}
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
                {modules.map(module => (
                  <option key={module.key} value={module.key}>{module.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                Permission Label <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.permission_label}
                onChange={(e) => setFormData({ ...formData, permission_label: e.target.value })}
                placeholder="e.g., Manage Special Features"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#8b5cf6'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                Description <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                value={formData.permission_description}
                onChange={(e) => setFormData({ ...formData, permission_description: e.target.value })}
                rows={3}
                placeholder="Describe what this permission allows..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#8b5cf6'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                Permission Key <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>(optional - auto-generated)</span>
              </label>
              <input
                type="text"
                value={formData.permission_key}
                onChange={(e) => setFormData({ ...formData, permission_key: e.target.value })}
                placeholder="e.g., custom.special_features"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '13px',
                  outline: 'none',
                  fontFamily: 'monospace'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#8b5cf6'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
                Leave empty to auto-generate from label
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '24px 28px',
          borderTop: '2px solid #f1f5f9',
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              background: '#f8fafc',
              border: '2px solid #e2e8f0',
              fontSize: '14px',
              fontWeight: '600',
              color: '#64748b',
              cursor: 'pointer'
            }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              background: saving ? '#cbd5e1' : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: '#fff',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: saving ? 'none' : '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}>
            <Plus size={16} />
            {saving ? 'Creating...' : 'Create Permission'}
          </button>
        </div>
      </div>
    </div>
  );
}
