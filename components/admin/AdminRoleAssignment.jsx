"use client";
import React, { useState, useEffect } from "react";
import { 
  Search, Shield, CheckCircle, X, Save, Users as UsersIcon,
  ChevronDown, ChevronUp, AlertCircle, Trash2, Edit3
} from "lucide-react";
import { PERMISSIONS, ROLE_TEMPLATES } from "@/lib/permissions";

export default function AdminRoleAssignment() {
  const [users, setUsers] = useState([]);
  const [adminRoles, setAdminRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleName, setRoleName] = useState('Custom Admin');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const [notification, setNotification] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchAdminRoles();
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

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    
    // Check if user already has admin role
    const existingRole = adminRoles.find(role => role.user_id === user.id);
    if (existingRole) {
      setRoleName(existingRole.role_name || 'Custom Admin');
      setSelectedPermissions(existingRole.permissions || []);
    } else {
      setRoleName('Custom Admin');
      setSelectedPermissions([]);
    }
    
    // Expand all sections by default
    const expanded = {};
    Object.keys(PERMISSIONS).forEach(key => {
      expanded[key] = true;
    });
    setExpandedSections(expanded);
    
    setShowModal(true);
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

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const selectAllInSection = (sectionKey) => {
    const sectionPermissions = PERMISSIONS[sectionKey].permissions.map(p => p.key);
    setSelectedPermissions(prev => {
      const newPerms = [...prev];
      sectionPermissions.forEach(perm => {
        if (!newPerms.includes(perm)) {
          newPerms.push(perm);
        }
      });
      return newPerms;
    });
  };

  const deselectAllInSection = (sectionKey) => {
    const sectionPermissions = PERMISSIONS[sectionKey].permissions.map(p => p.key);
    setSelectedPermissions(prev => prev.filter(p => !sectionPermissions.includes(p)));
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
          setShowModal(false);
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
          {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
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
            background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
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
      </div>

      {/* Current Admins Section */}
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
                    background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
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
                      color: '#1f2937',
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

      {/* User Selection Section */}
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '24px',
        border: '2px solid #e2e8f0'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>
          Select User to Grant Admin Access
        </h2>
        
        {/* Search */}
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
              e.currentTarget.style.borderColor = '#1f2937';
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

        {/* User List */}
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
            maxHeight: '400px', 
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
                    e.currentTarget.style.borderColor = '#1f2937';
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
                        : 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
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

      {/* Permission Assignment Modal */}
      {showModal && selectedUser && (
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
          zIndex: 9999,
          padding: '20px',
          overflowY: 'auto'
        }}
        onClick={() => setShowModal(false)}>
          <div style={{
            background: '#fff',
            borderRadius: '24px',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
            border: '2px solid #e2e8f0',
            margin: '20px 0'
          }}
          onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{
              padding: '28px',
              borderBottom: '2px solid #f1f5f9',
              position: 'sticky',
              top: 0,
              background: '#fff',
              zIndex: 10,
              borderRadius: '24px 24px 0 0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0, marginBottom: '4px' }}>
                    Assign Admin Permissions
                  </h2>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                    {selectedUser.full_name || selectedUser.email}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
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

              {/* Role Name Input */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                  Role Name
                </label>
                <input
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="e.g., Marketing Manager, HR Admin"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Quick Templates */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                  Quick Templates (Optional)
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {Object.keys(ROLE_TEMPLATES).map(key => (
                    <button
                      key={key}
                      onClick={() => handleApplyTemplate(key)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        background: '#f8fafc',
                        border: '2px solid #e2e8f0',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#475569',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#1f2937';
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.borderColor = '#1f2937';
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

              {/* Selected Count */}
              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: '#f0f9ff',
                border: '2px solid #bae6fd',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#0369a1',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle size={16} />
                {selectedPermissions.length} permissions selected
              </div>
            </div>

            {/* Permissions List */}
            <div style={{ padding: '28px' }}>
              {Object.keys(PERMISSIONS).map(sectionKey => {
                const section = PERMISSIONS[sectionKey];
                const sectionPerms = section.permissions.map(p => p.key);
                const selectedInSection = sectionPerms.filter(p => selectedPermissions.includes(p)).length;
                const isExpanded = expandedSections[sectionKey];

                return (
                  <div key={sectionKey} style={{
                    marginBottom: '16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}>
                    {/* Section Header */}
                    <div
                      onClick={() => toggleSection(sectionKey)}
                      style={{
                        padding: '16px',
                        background: '#f8fafc',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>
                          {section.label}
                        </div>
                        <div style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: selectedInSection > 0 ? '#dcfce7' : '#fff',
                          border: `1px solid ${selectedInSection > 0 ? '#86efac' : '#e2e8f0'}`,
                          fontSize: '11px',
                          fontWeight: '700',
                          color: selectedInSection > 0 ? '#065f46' : '#64748b'
                        }}>
                          {selectedInSection}/{sectionPerms.length}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            selectAllInSection(sectionKey);
                          }}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            background: '#fff',
                            border: '1px solid #e2e8f0',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: '600',
                            color: '#1f2937'
                          }}>
                          Select All
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deselectAllInSection(sectionKey);
                          }}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            background: '#fff',
                            border: '1px solid #e2e8f0',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: '600',
                            color: '#64748b'
                          }}>
                          Clear
                        </button>
                        {isExpanded ? <ChevronUp size={20} style={{ color: '#64748b' }} /> : <ChevronDown size={20} style={{ color: '#64748b' }} />}
                      </div>
                    </div>

                    {/* Section Permissions */}
                    {isExpanded && (
                      <div style={{ padding: '16px', background: '#fff' }}>
                        <div style={{ display: 'grid', gap: '8px' }}>
                          {section.permissions.map(permission => {
                            const isSelected = selectedPermissions.includes(permission.key);
                            return (
                              <label
                                key={permission.key}
                                style={{
                                  padding: '12px',
                                  background: isSelected ? '#f0fdf4' : '#f8fafc',
                                  border: `2px solid ${isSelected ? '#86efac' : '#e2e8f0'}`,
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'start',
                                  gap: '12px',
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
                                    width: '18px',
                                    height: '18px',
                                    cursor: 'pointer',
                                    accentColor: '#10b981',
                                    marginTop: '2px'
                                  }}
                                />
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '2px' }}>
                                    {permission.label}
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                                    {permission.description}
                                  </div>
                                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', fontFamily: 'monospace' }}>
                                    {permission.key}
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '24px 28px',
              borderTop: '2px solid #f1f5f9',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              position: 'sticky',
              bottom: 0,
              background: '#fff',
              borderRadius: '0 0 24px 24px'
            }}>
              <button
                onClick={() => setShowModal(false)}
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
                onClick={handleSaveRole}
                disabled={saving || selectedPermissions.length === 0}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  background: saving || selectedPermissions.length === 0 
                    ? '#cbd5e1' 
                    : 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
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
                {saving ? 'Saving...' : 'Grant Admin Access'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
