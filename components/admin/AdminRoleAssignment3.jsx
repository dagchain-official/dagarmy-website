"use client";
import React, { useState, useEffect } from "react";
import { 
  Search, Shield, CheckCircle, X, Save, Users as UsersIcon,
  ChevronRight, ChevronLeft, AlertCircle, Trash2, Edit3, ArrowLeft, Plus
} from "lucide-react";
import { PERMISSIONS, ROLE_TEMPLATES } from "@/lib/permissions-dagarmy";
import CustomPermissionModal from "@/components/admin/CustomPermissionModal";

export default function AdminRoleAssignment3() {
  const [users, setUsers] = useState([]);
  const [adminRoles, setAdminRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStep, setCurrentStep] = useState('list'); // 'list' or 'assign'
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleName, setRoleName] = useState('Custom Admin');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [notification, setNotification] = useState(null);
  const [saving, setSaving] = useState(false);
  const [customPermissions, setCustomPermissions] = useState([]);
  const [showCustomPermissionModal, setShowCustomPermissionModal] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchAdminRoles();
    fetchCustomPermissions();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      if (response.ok) {
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminRoles = async () => {
    try {
      const response = await fetch('/api/admin/roles');
      const data = await response.json();
      if (response.ok) {
        setAdminRoles(data.roles || []);
      }
    } catch (error) {
      console.error('Error fetching admin roles:', error);
    }
  };

  const fetchCustomPermissions = async () => {
    try {
      const response = await fetch('/api/admin/custom-permissions');
      const data = await response.json();
      if (response.ok) {
        setCustomPermissions(data.permissions || []);
      }
    } catch (error) {
      console.error('Error fetching custom permissions:', error);
    }
  };

  const handleCustomPermissionCreated = (newPermission) => {
    setCustomPermissions(prev => [...prev, newPermission]);
    setNotification({ type: 'success', message: 'Custom permission created successfully!' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    
    const existingRole = adminRoles.find(role => role.user_id === user.id);
    if (existingRole) {
      setRoleName(existingRole.role_name || 'Custom Admin');
      setSelectedPermissions(existingRole.permissions || []);
    } else {
      setRoleName('Custom Admin');
      setSelectedPermissions([]);
    }
    
    setCurrentStep('assign');
    setActiveModule('dashboard');
  };

  const handleApplyTemplate = (templateKey) => {
    const template = ROLE_TEMPLATES[templateKey];
    if (template) {
      setRoleName(template.name);
      setSelectedPermissions([...template.permissions]);
      setNotification({ type: 'success', message: `Applied ${template.name} template` });
      setTimeout(() => setNotification(null), 2000);
    }
  };

  const togglePermission = (permissionKey) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permissionKey)) {
        return prev.filter(p => p !== permissionKey);
      } else {
        return [...prev, permissionKey];
      }
    });
  };

  const selectAllInModule = (moduleKey) => {
    const modulePermissions = PERMISSIONS[moduleKey].permissions.map(p => p.key);
    setSelectedPermissions(prev => {
      const newPerms = [...prev];
      modulePermissions.forEach(perm => {
        if (!newPerms.includes(perm)) {
          newPerms.push(perm);
        }
      });
      return newPerms;
    });
  };

  const deselectAllInModule = (moduleKey) => {
    const modulePermissions = PERMISSIONS[moduleKey].permissions.map(p => p.key);
    setSelectedPermissions(prev => prev.filter(p => !modulePermissions.includes(p)));
  };

  const handleSaveRole = async () => {
    if (!selectedUser) return;

    if (selectedPermissions.length === 0) {
      setNotification({ type: 'error', message: 'Please select at least one permission' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: selectedUser.id,
          role_name: roleName,
          permissions: selectedPermissions
        })
      });

      const data = await response.json();

      if (response.ok) {
        setNotification({ type: 'success', message: 'Admin role assigned successfully!' });
        setTimeout(() => {
          setNotification(null);
          setCurrentStep('list');
          setSelectedUser(null);
          fetchAdminRoles();
        }, 2000);
      } else {
        setNotification({ type: 'error', message: data.error || 'Failed to assign role' });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      console.error('Error saving role:', error);
      setNotification({ type: 'error', message: 'An error occurred' });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleRevokeAccess = async (userId) => {
    if (!confirm('Are you sure you want to revoke admin access for this user?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/roles?user_id=${userId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setNotification({ type: 'success', message: 'Admin access revoked successfully!' });
        setTimeout(() => setNotification(null), 3000);
        fetchAdminRoles();
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

  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.full_name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.wallet_address?.toLowerCase().includes(query)
    );
  });

  // Merge custom permissions with default permissions
  const mergedPermissions = { ...PERMISSIONS };
  customPermissions.forEach(cp => {
    if (!mergedPermissions[cp.module_key]) {
      mergedPermissions[cp.module_key] = {
        label: cp.module_key.charAt(0).toUpperCase() + cp.module_key.slice(1),
        permissions: []
      };
    }
    mergedPermissions[cp.module_key].permissions.push({
      key: cp.permission_key,
      label: cp.permission_label,
      description: cp.permission_description
    });
  });

  const moduleKeys = Object.keys(mergedPermissions);
  const currentModule = mergedPermissions[activeModule];
  const modulePermissions = currentModule?.permissions.map(p => p.key) || [];
  const selectedInModule = modulePermissions.filter(p => selectedPermissions.includes(p)).length;

  // User List View
  if (currentStep === 'list') {
    return (
      <div style={{ padding: '32px', width: '100%', background: '#f8fafc', minHeight: '100vh' }}>
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
            {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {notification.message}
          </div>
        )}

        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(139, 92, 246, 0.3)'
              }}>
                <Shield size={24} style={{ color: '#fff' }} />
              </div>
              <div>
                <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', margin: 0, lineHeight: 1 }}>
                  Admin Role Assignment
                </h1>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0, marginTop: '4px' }}>
                  Select users and assign custom permissions for admin panel access
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCustomPermissionModal(true)}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                border: 'none',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
              }}>
              <Plus size={16} />
              Create Custom Permission
            </button>
          </div>
        </div>

        {adminRoles.length > 0 && (
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '24px',
            border: '2px solid #e2e8f0'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>
              Current Admin Users ({adminRoles.length})
            </h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {adminRoles.map(role => (
                <div key={role.id} style={{
                  padding: '16px',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '2px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '16px',
                      fontWeight: '700'
                    }}>
                      {role.user?.full_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                        {role.user?.full_name || 'Unknown User'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {role.role_name} • {role.permissions?.length || 0} permissions
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleSelectUser(role.user)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: '#f8fafc',
                        border: '2px solid #e2e8f0',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#8b5cf6',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                      <Edit3 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleRevokeAccess(role.user_id)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: '#fee2e2',
                        border: '2px solid #fecaca',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#dc2626',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                      <Trash2 size={14} />
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '24px',
          border: '2px solid #e2e8f0'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>
            Select User to Grant Admin Access
          </h2>
          
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <Search size={20} style={{
              position: 'absolute',
              left: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8'
            }} />
            <input
              type="text"
              placeholder="Search users by name, email, or wallet address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 18px 14px 52px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                outline: 'none',
                transition: 'all 0.2s',
                background: '#f8fafc'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#8b5cf6';
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.1)';
                e.currentTarget.style.background = '#fff';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = '#f8fafc';
              }}
            />
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Loading users...</div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <UsersIcon size={48} style={{ color: '#cbd5e1', margin: '0 auto 12px' }} />
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>No users found</div>
            </div>
          ) : (
            <div style={{ 
              maxHeight: '500px', 
              overflowY: 'auto',
              display: 'grid',
              gap: '8px'
            }}>
              {filteredUsers.map(user => {
                const hasAdminRole = adminRoles.some(role => role.user_id === user.id);
                return (
                  <div
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    style={{
                      padding: '16px',
                      background: hasAdminRole ? '#f0fdf4' : '#f8fafc',
                      borderRadius: '12px',
                      border: `2px solid ${hasAdminRole ? '#86efac' : '#e2e8f0'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = hasAdminRole ? '#dcfce7' : '#fff';
                      e.currentTarget.style.borderColor = '#8b5cf6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = hasAdminRole ? '#f0fdf4' : '#f8fafc';
                      e.currentTarget.style.borderColor = hasAdminRole ? '#86efac' : '#e2e8f0';
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: hasAdminRole 
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                          : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '16px',
                        fontWeight: '700'
                      }}>
                        {user.full_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                          {user.full_name || 'Unknown User'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          {user.email || user.wallet_address?.substring(0, 20) + '...'}
                        </div>
                      </div>
                    </div>
                    {hasAdminRole && (
                      <div style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: '#dcfce7',
                        border: '1px solid #86efac',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#065f46',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <CheckCircle size={12} />
                        Admin
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Permission Assignment View
  return (
    <div style={{ width: '100%', background: '#f8fafc', minHeight: '100vh' }}>
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
          {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div style={{
        background: '#fff',
        borderBottom: '2px solid #e2e8f0',
        padding: '24px 32px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => {
                setCurrentStep('list');
                setSelectedUser(null);
              }}
              style={{
                padding: '10px',
                borderRadius: '10px',
                background: '#f8fafc',
                border: '2px solid #e2e8f0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <ArrowLeft size={20} style={{ color: '#64748b' }} />
            </button>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0, lineHeight: 1 }}>
                Assign Permissions
              </h1>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0, marginTop: '4px' }}>
                {selectedUser?.full_name || selectedUser?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleSaveRole}
            disabled={saving || selectedPermissions.length === 0}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              background: saving || selectedPermissions.length === 0 
                ? '#cbd5e1' 
                : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: '#fff',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: saving || selectedPermissions.length === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: saving || selectedPermissions.length === 0 ? 'none' : '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}>
            <Save size={16} />
            {saving ? 'Saving...' : 'Save & Grant Access'}
          </button>
        </div>

        {/* Role Name and Templates */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block' }}>
              Role Name
            </label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="e.g., Marketing Manager"
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '13px',
                outline: 'none',
                fontWeight: '500'
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block' }}>
              Quick Templates
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {Object.keys(ROLE_TEMPLATES).slice(0, 6).map(key => (
                <button
                  key={key}
                  onClick={() => handleApplyTemplate(key)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '2px solid #e2e8f0',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#475569',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#8b5cf6';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.borderColor = '#8b5cf6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.color = '#475569';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}>
                  {ROLE_TEMPLATES[key].name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Count */}
        <div style={{
          padding: '10px 16px',
          background: '#f0f9ff',
          border: '2px solid #bae6fd',
          borderRadius: '10px',
          fontSize: '12px',
          fontWeight: '600',
          color: '#0369a1',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle size={14} />
          {selectedPermissions.length} permissions selected across all modules
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', height: 'calc(100vh - 220px)' }}>
        {/* Sidebar - Module Navigation */}
        <div style={{
          background: '#fff',
          borderRight: '2px solid #e2e8f0',
          overflowY: 'auto',
          padding: '24px 16px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Permission Modules
          </div>
          {moduleKeys.map(key => {
            const module = PERMISSIONS[key];
            const modulePerms = module.permissions.map(p => p.key);
            const selected = modulePerms.filter(p => selectedPermissions.includes(p)).length;
            const isActive = activeModule === key;

            return (
              <button
                key={key}
                onClick={() => setActiveModule(key)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  marginBottom: '6px',
                  borderRadius: '10px',
                  background: isActive ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : '#f8fafc',
                  border: `2px solid ${isActive ? '#8b5cf6' : '#e2e8f0'}`,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }
                }}>
                <div>
                  <div style={{ 
                    fontSize: '13px', 
                    fontWeight: '600', 
                    color: isActive ? '#fff' : '#0f172a',
                    marginBottom: '2px'
                  }}>
                    {module.label}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: isActive ? 'rgba(255,255,255,0.8)' : '#64748b'
                  }}>
                    {selected}/{modulePerms.length} selected
                  </div>
                </div>
                {isActive && <ChevronRight size={16} style={{ color: '#fff' }} />}
              </button>
            );
          })}
        </div>

        {/* Main Content - Permissions */}
        <div style={{ overflowY: 'auto', padding: '32px' }}>
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            border: '2px solid #e2e8f0',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0, marginBottom: '4px' }}>
                  {currentModule?.label}
                </h2>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  Select permissions for this module
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => selectAllInModule(activeModule)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '2px solid #e2e8f0',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#8b5cf6'
                  }}>
                  Select All
                </button>
                <button
                  onClick={() => deselectAllInModule(activeModule)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '2px solid #e2e8f0',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#64748b'
                  }}>
                  Clear All
                </button>
              </div>
            </div>

            <div style={{
              padding: '12px 16px',
              background: selectedInModule > 0 ? '#f0fdf4' : '#f8fafc',
              border: `2px solid ${selectedInModule > 0 ? '#86efac' : '#e2e8f0'}`,
              borderRadius: '10px',
              marginBottom: '20px',
              fontSize: '13px',
              fontWeight: '600',
              color: selectedInModule > 0 ? '#065f46' : '#64748b'
            }}>
              {selectedInModule} of {modulePermissions.length} permissions selected in this module
            </div>

            <div style={{ display: 'grid', gap: '10px' }}>
              {currentModule?.permissions.map(permission => {
                const isSelected = selectedPermissions.includes(permission.key);
                return (
                  <label
                    key={permission.key}
                    style={{
                      padding: '16px',
                      background: isSelected ? '#f0fdf4' : '#f8fafc',
                      border: `2px solid ${isSelected ? '#86efac' : '#e2e8f0'}`,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'start',
                      gap: '14px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.borderColor = '#cbd5e1';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = '#f8fafc';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                      }
                    }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => togglePermission(permission.key)}
                      style={{
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                        accentColor: '#10b981',
                        marginTop: '2px',
                        flexShrink: 0
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>
                        {permission.label}
                      </div>
                      <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
                        {permission.description}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Permission Modal */}
      {showCustomPermissionModal && (
        <CustomPermissionModal
          onClose={() => setShowCustomPermissionModal(false)}
          onSave={handleCustomPermissionCreated}
        />
      )}
    </div>
  );
}
