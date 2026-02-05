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

  return (
    <AdminLayout>
      <div style={{ padding: '32px', background: '#f8fafc', minHeight: '100vh' }}>
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
            zIndex: 10000
          }}>
            {notification.message}
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)'
            }}>
              <Shield size={24} style={{ color: '#fff' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', margin: 0, lineHeight: 1 }}>
                Admin Management
              </h1>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0, marginTop: '4px' }}>
                Create and manage admin accounts with custom permissions
              </p>
            </div>
          </div>
        </div>

        {/* Create Admin Form */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '2px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <UserPlus size={24} color="#6366f1" />
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              Create New Admin
            </h2>
          </div>

          <form onSubmit={handleCreateAdmin}>
            {/* Basic Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '32px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@dagchain.network"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="John Doe"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Role Name
                </label>
                <input
                  type="text"
                  value={formData.role_name}
                  onChange={(e) => setFormData({ ...formData, role_name: e.target.value })}
                  placeholder="Sub Admin"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Role Templates */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                Quick Role Templates
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {Object.entries(ADMIN_ROLE_TEMPLATES).map(([key, template]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => applyTemplate(key)}
                    style={{
                      padding: '10px 20px',
                      background: '#f3f4f6',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      color: '#374151',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#6366f1';
                      e.target.style.color = '#fff';
                      e.target.style.borderColor = '#6366f1';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#f3f4f6';
                      e.target.style.color = '#374151';
                      e.target.style.borderColor = '#e5e7eb';
                    }}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Permission Matrix */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Permissions Matrix
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => handleSelectAll('read')}
                    style={{
                      padding: '6px 12px',
                      background: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      color: '#374151'
                    }}
                  >
                    Select All Read
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectAll('write')}
                    style={{
                      padding: '6px 12px',
                      background: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      color: '#374151'
                    }}
                  >
                    Select All Write
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectAll('overwrite')}
                    style={{
                      padding: '6px 12px',
                      background: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      color: '#374151'
                    }}
                  >
                    Select All Delete
                  </button>
                </div>
              </div>

              <div style={{
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#fff'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
                      <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                        Module
                      </th>
                      <th style={{ padding: '16px', textAlign: 'center', fontSize: '13px', fontWeight: '700', color: '#0f172a', width: '120px' }}>
                        Read
                      </th>
                      <th style={{ padding: '16px', textAlign: 'center', fontSize: '13px', fontWeight: '700', color: '#0f172a', width: '120px' }}>
                        Write
                      </th>
                      <th style={{ padding: '16px', textAlign: 'center', fontSize: '13px', fontWeight: '700', color: '#0f172a', width: '120px' }}>
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(ADMIN_MODULES).map(([moduleKey, module]) => (
                      <tr key={moduleKey} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '16px' }}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>
                              {module.label}
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>
                              {module.description}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={permissions[moduleKey]?.read || false}
                            onChange={() => handlePermissionToggle(moduleKey, 'read')}
                            style={{
                              width: '20px',
                              height: '20px',
                              cursor: 'pointer',
                              accentColor: '#10b981'
                            }}
                          />
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={permissions[moduleKey]?.write || false}
                            onChange={() => handlePermissionToggle(moduleKey, 'write')}
                            style={{
                              width: '20px',
                              height: '20px',
                              cursor: 'pointer',
                              accentColor: '#3b82f6'
                            }}
                          />
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={permissions[moduleKey]?.overwrite || false}
                            onChange={() => handlePermissionToggle(moduleKey, 'overwrite')}
                            style={{
                              width: '20px',
                              height: '20px',
                              cursor: 'pointer',
                              accentColor: '#ef4444'
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Created Password Display */}
            {createdPassword && (
              <div style={{
                background: '#fef3c7',
                border: '2px solid #fbbf24',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <AlertCircle size={24} color="#92400e" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: '#92400e', margin: '0 0 8px 0' }}>
                      Admin Created Successfully!
                    </p>
                    <p style={{ fontSize: '13px', color: '#92400e', margin: '0 0 12px 0' }}>
                      Save this temporary password securely. The admin will be required to change it on first login.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <code style={{
                        flex: 1,
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#92400e',
                        background: '#fff',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #fbbf24',
                        fontFamily: 'monospace'
                      }}>
                        {showPassword ? createdPassword : '••••••••••••••••'}
                      </code>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          padding: '12px',
                          background: '#fff',
                          border: '1px solid #fbbf24',
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
                          padding: '12px 20px',
                          background: copiedPassword ? '#10b981' : '#6366f1',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '13px',
                          fontWeight: '600'
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
                padding: '16px',
                background: creating ? '#9ca3af' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: creating ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!creating) e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {creating ? 'Creating Admin...' : 'Create Admin Account'}
            </button>
          </form>
        </div>

        {/* Current Admins List */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '32px',
          border: '2px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '24px' }}>
            Current Admins ({admins.length})
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              Loading admins...
            </div>
          ) : admins.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              No admins found. Create your first admin above.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {admins.map((admin) => (
                <div
                  key={admin.id}
                  style={{
                    padding: '20px',
                    background: '#f8fafc',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                        {admin.user_email || admin.email || 'Unknown'}
                      </h3>
                      <span style={{
                        padding: '4px 12px',
                        background: '#ede9fe',
                        color: '#6366f1',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {admin.role_name || admin.role || 'Admin'}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                      {getPermissionSummary(admin.permissions)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => {
                        // TODO: Implement edit functionality
                        alert('Edit functionality coming soon');
                      }}
                      style={{
                        padding: '10px 16px',
                        background: '#fff',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#374151'
                      }}
                    >
                      <Edit3 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleRevokeAccess(admin.user_id)}
                      style={{
                        padding: '10px 16px',
                        background: '#fee',
                        border: '2px solid #fcc',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#c00'
                      }}
                    >
                      <Trash2 size={16} />
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
