"use client";
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { ADMIN_MODULES, ADMIN_ROLE_TEMPLATES } from "@/lib/admin-permissions";
import { UserPlus, Shield, Trash2, Edit3, Check, X, Copy, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function ManageAdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  
  // Create admin form state
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role_name: 'Sub Admin'
  });
  const [permissions, setPermissions] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [createdPassword, setCreatedPassword] = useState('');
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [creating, setCreating] = useState(false);

  // Edit admin state
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [editPermissions, setEditPermissions] = useState({});

  useEffect(() => {
    fetchAdmins();
    initializePermissions();
  }, []);

  const initializePermissions = () => {
    const initialPerms = {};
    Object.keys(ADMIN_MODULES).forEach(moduleKey => {
      initialPerms[moduleKey] = { read: false, write: false, overwrite: false };
    });
    setPermissions(initialPerms);
  };

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/admin/roles');
      const data = await response.json();
      if (response.ok) {
        setAdmins(data.roles || []);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (moduleKey, action) => {
    setPermissions(prev => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        [action]: !prev[moduleKey][action]
      }
    }));
  };

  const handleSelectAll = (action) => {
    const newPerms = {};
    Object.keys(ADMIN_MODULES).forEach(moduleKey => {
      newPerms[moduleKey] = {
        ...permissions[moduleKey],
        [action]: true
      };
    });
    setPermissions(newPerms);
  };

  const handleDeselectAll = (action) => {
    const newPerms = {};
    Object.keys(ADMIN_MODULES).forEach(moduleKey => {
      newPerms[moduleKey] = {
        ...permissions[moduleKey],
        [action]: false
      };
    });
    setPermissions(newPerms);
  };

  const applyTemplate = (templateKey) => {
    const template = ADMIN_ROLE_TEMPLATES[templateKey];
    if (!template) return;

    const newPerms = {};
    Object.keys(ADMIN_MODULES).forEach(moduleKey => {
      newPerms[moduleKey] = {
        read: template.permissions.includes(`${moduleKey}.read`),
        write: template.permissions.includes(`${moduleKey}.write`),
        overwrite: template.permissions.includes(`${moduleKey}.overwrite`)
      };
    });
    setPermissions(newPerms);
    setFormData(prev => ({ ...prev, role_name: template.name }));
    
    setNotification({ type: 'success', message: `Applied ${template.name} template` });
    setTimeout(() => setNotification(null), 2000);
  };

  const getPermissionArray = (permsObject) => {
    const permArray = [];
    Object.entries(permsObject).forEach(([moduleKey, actions]) => {
      if (actions.read) permArray.push(`${moduleKey}.read`);
      if (actions.write) permArray.push(`${moduleKey}.write`);
      if (actions.overwrite) permArray.push(`${moduleKey}.overwrite`);
    });
    return permArray;
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    
    const permArray = getPermissionArray(permissions);
    if (permArray.length === 0) {
      setNotification({ type: 'error', message: 'Please select at least one permission' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setCreating(true);
    try {
      const storedUser = localStorage.getItem('admin_user');
      const currentAdminId = storedUser ? JSON.parse(storedUser).id : null;

      const response = await fetch('/api/admin/auth/create-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          full_name: formData.full_name,
          role_name: formData.role_name,
          permissions: permArray,
          created_by_id: currentAdminId
        })
      });

      const data = await response.json();

      if (response.ok) {
        setCreatedPassword(data.temporary_password);
        setNotification({ type: 'success', message: 'Admin created successfully!' });
        setTimeout(() => setNotification(null), 5000);
        
        // Reset form
        setFormData({ email: '', full_name: '', role_name: 'Sub Admin' });
        initializePermissions();
        fetchAdmins();
      } else {
        setNotification({ type: 'error', message: data.error || 'Failed to create admin' });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      setNotification({ type: 'error', message: 'An error occurred' });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setCreating(false);
    }
  };

  const handleRevokeAccess = async (adminId) => {
    if (!confirm('Are you sure you want to revoke admin access?')) return;

    try {
      const response = await fetch(`/api/admin/roles?user_id=${adminId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setNotification({ type: 'success', message: 'Admin access revoked' });
        setTimeout(() => setNotification(null), 3000);
        fetchAdmins();
      } else {
        setNotification({ type: 'error', message: 'Failed to revoke access' });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      console.error('Error revoking access:', error);
      setNotification({ type: 'error', message: 'An error occurred' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(createdPassword);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2000);
  };

  const getPermissionSummary = (permArray) => {
    if (!permArray || permArray.length === 0) return 'No permissions';
    const modules = new Set(permArray.map(p => p.split('.')[0]));
    return `${modules.size} module${modules.size !== 1 ? 's' : ''}, ${permArray.length} permission${permArray.length !== 1 ? 's' : ''}`;
  };

  const ToggleSwitch = ({ checked, onChange, color = '#6366f1' }) => (
    <button
      type="button"
      onClick={onChange}
      style={{
        width: '44px',
        height: '24px',
        borderRadius: '12px',
        border: 'none',
        background: checked ? color : '#e2e8f0',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.3s ease',
        padding: 0,
        flexShrink: 0
      }}
    >
      <div style={{
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        background: '#fff',
        position: 'absolute',
        top: '3px',
        left: checked ? '23px' : '3px',
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
      }} />
    </button>
  );

  const permCount = getPermissionArray(permissions).length;
  const totalPossible = Object.keys(ADMIN_MODULES).length * 3;

  return (
    <AdminLayout>
      <div style={{ padding: '32px 40px', background: '#f8fafc', minHeight: '100vh' }}>
        {/* Notification Toast */}
        {notification && (
          <div style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            padding: '16px 28px',
            borderRadius: '16px',
            background: notification.type === 'success' ? '#fff' : '#fff',
            color: notification.type === 'success' ? '#059669' : '#dc2626',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backdropFilter: 'blur(20px)'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: notification.type === 'success' ? '#dcfce7' : '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {notification.type === 'success' ? <Check size={16} /> : <X size={16} />}
            </div>
            {notification.message}
          </div>
        )}

        {/* Page Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)'
              }}>
                <Shield size={28} style={{ color: '#fff' }} />
              </div>
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>
                  Admin Management
                </h1>
                <p style={{ fontSize: '15px', color: '#94a3b8', margin: 0, marginTop: '4px' }}>
                  Create and manage admin accounts with granular permissions
                </p>
              </div>
            </div>
            <div style={{
              padding: '10px 20px',
              background: '#f1f5f9',
              borderRadius: '12px',
              fontSize: '14px',
              color: '#64748b',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
              {admins.length} Active Admin{admins.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Create Admin Section */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          marginBottom: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
          overflow: 'hidden'
        }}>
          {/* Section Header */}
          <div style={{
            padding: '28px 32px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: '#f0fdf4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <UserPlus size={22} color="#16a34a" />
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                  Create New Admin
                </h2>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, marginTop: '2px' }}>
                  Set up a new admin account with custom access levels
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleCreateAdmin} style={{ padding: '32px' }}>
            {/* Basic Info - Modern Input Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
              {[
                { label: 'Email Address', value: formData.email, key: 'email', type: 'email', placeholder: 'admin@dagarmy.network', required: true, icon: '✉' },
                { label: 'Full Name', value: formData.full_name, key: 'full_name', type: 'text', placeholder: 'John Doe', required: true, icon: '👤' },
                { label: 'Role Title', value: formData.role_name, key: 'role_name', type: 'text', placeholder: 'Sub Admin', required: false, icon: '🏷' }
              ].map((field) => (
                <div key={field.key} style={{
                  background: '#f8fafc',
                  borderRadius: '14px',
                  padding: '20px',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease'
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#64748b',
                    marginBottom: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    <span style={{ fontSize: '14px' }}>{field.icon}</span>
                    {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
                  </label>
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    required={field.required}
                    style={{
                      width: '100%',
                      padding: '12px 0',
                      border: 'none',
                      borderBottom: '2px solid #e2e8f0',
                      fontSize: '15px',
                      fontWeight: '500',
                      outline: 'none',
                      boxSizing: 'border-box',
                      background: 'transparent',
                      color: '#0f172a',
                      transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderBottomColor = '#6366f1';
                      e.target.parentElement.style.borderColor = '#c7d2fe';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderBottomColor = '#e2e8f0';
                      e.target.parentElement.style.borderColor = '#e2e8f0';
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Role Templates - Pill Style */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Quick Templates
                </span>
                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {Object.entries(ADMIN_ROLE_TEMPLATES).map(([key, template]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => applyTemplate(key)}
                    style={{
                      padding: '10px 22px',
                      background: formData.role_name === template.name ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : '#ffffff',
                      border: formData.role_name === template.name ? 'none' : '1px solid #e2e8f0',
                      borderRadius: '100px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      color: formData.role_name === template.name ? '#fff' : '#475569',
                      transition: 'all 0.3s ease',
                      boxShadow: formData.role_name === template.name ? '0 4px 14px rgba(99, 102, 241, 0.35)' : '0 1px 2px rgba(0,0,0,0.04)'
                    }}
                    onMouseEnter={(e) => {
                      if (formData.role_name !== template.name) {
                        e.currentTarget.style.borderColor = '#c7d2fe';
                        e.currentTarget.style.color = '#6366f1';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formData.role_name !== template.name) {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.color = '#475569';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Permission Matrix - Modern Card Grid */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Permissions
                  </span>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '100px',
                    background: permCount > 0 ? '#ede9fe' : '#f1f5f9',
                    color: permCount > 0 ? '#6366f1' : '#94a3b8',
                    fontSize: '12px',
                    fontWeight: '700'
                  }}>
                    {permCount} / {totalPossible}
                  </span>
                  <div style={{ flex: 1, height: '1px', background: '#e2e8f0', marginLeft: '4px' }} />
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[
                    { action: 'read', label: 'All Read', color: '#10b981' },
                    { action: 'write', label: 'All Write', color: '#3b82f6' },
                    { action: 'overwrite', label: 'All Delete', color: '#ef4444' }
                  ].map(({ action, label, color }) => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => handleSelectAll(action)}
                      style={{
                        padding: '6px 14px',
                        background: '#fff',
                        border: `1px solid ${color}30`,
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        color: color,
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = color;
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.borderColor = color;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.color = color;
                        e.currentTarget.style.borderColor = `${color}30`;
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Permission Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {Object.entries(ADMIN_MODULES).map(([moduleKey, module]) => {
                  const hasAny = permissions[moduleKey]?.read || permissions[moduleKey]?.write || permissions[moduleKey]?.overwrite;
                  return (
                    <div
                      key={moduleKey}
                      style={{
                        background: hasAny ? '#fafbff' : '#ffffff',
                        borderRadius: '14px',
                        padding: '20px',
                        border: hasAny ? '1px solid #c7d2fe' : '1px solid #e2e8f0',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ 
                          fontSize: '14px', 
                          fontWeight: '700', 
                          color: hasAny ? '#4338ca' : '#0f172a', 
                          marginBottom: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          {hasAny && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1' }} />}
                          {module.label}
                        </div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.4' }}>
                          {module.description}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        {[
                          { key: 'read', label: 'Read', color: '#10b981' },
                          { key: 'write', label: 'Write', color: '#3b82f6' },
                          { key: 'overwrite', label: 'Delete', color: '#ef4444' }
                        ].map(({ key, label, color }) => (
                          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ToggleSwitch
                              checked={permissions[moduleKey]?.[key] || false}
                              onChange={() => handlePermissionToggle(moduleKey, key)}
                              color={color}
                            />
                            <span style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              color: permissions[moduleKey]?.[key] ? color : '#94a3b8'
                            }}>
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Created Password Display */}
            {createdPassword && (
              <div style={{
                background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
                border: '1px solid #fde68a',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: '#fbbf24',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <AlertCircle size={22} color="#fff" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '16px', fontWeight: '700', color: '#92400e', margin: '0 0 6px 0' }}>
                      Admin Created Successfully!
                    </p>
                    <p style={{ fontSize: '13px', color: '#a16207', margin: '0 0 16px 0', lineHeight: '1.5' }}>
                      Save this temporary password securely. The admin will be required to change it on first login.
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: '#fff',
                      borderRadius: '12px',
                      padding: '6px',
                      border: '1px solid #fde68a'
                    }}>
                      <code style={{
                        flex: 1,
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#92400e',
                        padding: '10px 16px',
                        fontFamily: 'monospace',
                        letterSpacing: '0.5px'
                      }}>
                        {showPassword ? createdPassword : '••••••••••••••••'}
                      </code>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          padding: '10px',
                          background: '#fef3c7',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {showPassword ? <EyeOff size={18} color="#92400e" /> : <Eye size={18} color="#92400e" />}
                      </button>
                      <button
                        type="button"
                        onClick={copyPassword}
                        style={{
                          padding: '10px 20px',
                          background: copiedPassword ? '#10b981' : '#6366f1',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '13px',
                          fontWeight: '700',
                          transition: 'all 0.2s'
                        }}
                      >
                        {copiedPassword ? <Check size={16} /> : <Copy size={16} />}
                        {copiedPassword ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={creating}
              style={{
                width: '100%',
                padding: '18px',
                background: creating ? '#94a3b8' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '14px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: creating ? 'not-allowed' : 'pointer',
                boxShadow: creating ? 'none' : '0 8px 24px rgba(99, 102, 241, 0.35)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                letterSpacing: '-0.2px'
              }}
              onMouseEnter={(e) => {
                if (!creating) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(99, 102, 241, 0.45)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = creating ? 'none' : '0 8px 24px rgba(99, 102, 241, 0.35)';
              }}
            >
              <UserPlus size={20} />
              {creating ? 'Creating Admin...' : 'Create Admin Account'}
            </button>
          </form>
        </div>

        {/* Current Admins Section */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
          overflow: 'hidden'
        }}>
          {/* Section Header */}
          <div style={{
            padding: '28px 32px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: '#ede9fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Shield size={22} color="#7c3aed" />
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                  Team Members
                </h2>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, marginTop: '2px' }}>
                  {admins.length} admin{admins.length !== 1 ? 's' : ''} with active access
                </p>
              </div>
            </div>
          </div>

          <div style={{ padding: '24px 32px 32px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 40px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  border: '3px solid #e2e8f0',
                  borderTopColor: '#6366f1',
                  borderRadius: '50%',
                  margin: '0 auto 16px',
                  animation: 'spin 0.8s linear infinite'
                }} />
                <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>Loading team members...</p>
              </div>
            ) : admins.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 40px' }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '20px',
                  background: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <UserPlus size={32} color="#cbd5e1" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#334155', margin: '0 0 8px 0' }}>
                  No team members yet
                </h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
                  Create your first admin account above to get started
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {admins.map((admin, index) => (
                  <div
                    key={admin.id}
                    style={{
                      padding: '20px 24px',
                      background: '#f8fafc',
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.3s ease',
                      border: '1px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fff';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: `linear-gradient(135deg, ${['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6'][index % 6]} 0%, ${['#8b5cf6','#a78bfa','#f472b6','#fbbf24','#34d399','#60a5fa'][index % 6]} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#fff',
                        flexShrink: 0
                      }}>
                        {(admin.user_email || admin.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <h3 style={{
                            fontSize: '15px',
                            fontWeight: '700',
                            color: '#0f172a',
                            margin: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {admin.user_email || admin.email || 'Unknown'}
                          </h3>
                          <span style={{
                            padding: '3px 10px',
                            background: '#ede9fe',
                            color: '#7c3aed',
                            borderRadius: '100px',
                            fontSize: '11px',
                            fontWeight: '700',
                            flexShrink: 0
                          }}>
                            {admin.role_name || admin.role || 'Admin'}
                          </span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, fontWeight: '500' }}>
                          {getPermissionSummary(admin.permissions)}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => alert('Edit functionality coming soon')}
                        style={{
                          padding: '9px 16px',
                          background: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#475569',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#6366f1';
                          e.currentTarget.style.color = '#6366f1';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.color = '#475569';
                        }}
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleRevokeAccess(admin.user_id)}
                        style={{
                          padding: '9px 16px',
                          background: '#fff',
                          border: '1px solid #fecaca',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#ef4444',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#fef2f2';
                          e.currentTarget.style.borderColor = '#ef4444';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#fff';
                          e.currentTarget.style.borderColor = '#fecaca';
                        }}
                      >
                        <Trash2 size={14} />
                        Revoke
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
