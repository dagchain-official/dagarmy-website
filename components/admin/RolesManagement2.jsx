"use client";
import React, { useState, useEffect } from "react";
import { 
  Shield, Users, Award, BookOpen, Plus, Edit3, Trash2, 
  Search, CheckCircle, XCircle, Mail, TrendingUp, Target,
  BarChart3, X, Save, AlertCircle
} from "lucide-react";

export default function RolesManagement2() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCreator, setEditingCreator] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [notification, setNotification] = useState(null);

  const [creatorForm, setCreatorForm] = useState({
    name: '',
    email: '',
    bio: '',
    role: 'trainer',
    expertise: '',
    is_verified: false,
    is_active: true
  });

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/creators');
      const data = await response.json();
      
      if (response.ok) {
        setCreators(data.creators || []);
      }
    } catch (error) {
      console.error('Error fetching creators:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCreator = () => {
    setEditingCreator(null);
    setCreatorForm({
      name: '',
      email: '',
      bio: '',
      role: 'trainer',
      expertise: '',
      is_verified: false,
      is_active: true
    });
    setShowModal(true);
  };

  const handleEditCreator = (creator) => {
    setEditingCreator(creator);
    setCreatorForm({
      name: creator.name,
      email: creator.email || '',
      bio: creator.bio || '',
      role: creator.role,
      expertise: Array.isArray(creator.expertise) ? creator.expertise.join(', ') : '',
      is_verified: creator.is_verified,
      is_active: creator.is_active
    });
    setShowModal(true);
  };

  const handleSaveCreator = async () => {
    if (!creatorForm.name || !creatorForm.email) {
      setNotification({ type: 'error', message: 'Name and email are required' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    try {
      const payload = {
        ...creatorForm,
        expertise: creatorForm.expertise.split(',').map(e => e.trim()).filter(e => e)
      };

      const url = '/api/admin/creators';
      const method = editingCreator ? 'PUT' : 'POST';
      
      if (editingCreator) {
        payload.id = editingCreator.id;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowModal(false);
        fetchCreators();
        setNotification({ type: 'success', message: editingCreator ? 'Role updated successfully!' : 'Role created successfully!' });
        setTimeout(() => setNotification(null), 3000);
      } else {
        setNotification({ type: 'error', message: 'Failed to save role' });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      console.error('Error saving creator:', error);
      setNotification({ type: 'error', message: 'An error occurred' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDeleteCreator = async (creatorId) => {
    if (!confirm('Are you sure you want to delete this role? All associated courses will be affected.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/creators?id=${creatorId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchCreators();
        setNotification({ type: 'success', message: 'Role deleted successfully!' });
        setTimeout(() => setNotification(null), 3000);
      } else {
        setNotification({ type: 'error', message: 'Failed to delete role' });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      console.error('Error deleting creator:', error);
      setNotification({ type: 'error', message: 'An error occurred' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const roleConfig = {
    'organization': { 
      icon: Shield, 
      color: '#8b5cf6', 
      label: 'Organization', 
      bg: '#f3e8ff',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
    },
    'trainer': { 
      icon: Users, 
      color: '#3b82f6', 
      label: 'Trainer', 
      bg: '#dbeafe',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
    },
    'mentor': { 
      icon: Award, 
      color: '#10b981', 
      label: 'Mentor', 
      bg: '#d1fae5',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    'instructor': { 
      icon: BookOpen, 
      color: '#f59e0b', 
      label: 'Instructor', 
      bg: '#fef3c7',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    }
  };

  const filteredCreators = creators.filter(creator => {
    if (filterRole !== 'all' && creator.role !== filterRole) return false;
    if (searchQuery && !creator.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: creators.length,
    trainers: creators.filter(c => c.role === 'trainer').length,
    mentors: creators.filter(c => c.role === 'mentor').length,
    instructors: creators.filter(c => c.role === 'instructor').length,
    verified: creators.filter(c => c.is_verified).length
  };

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
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
                  Roles Management
                </h1>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0, marginTop: '4px' }}>
                  Manage trainers, mentors, instructors, and team roles with access control
                </p>
              </div>
            </div>
          </div>
          <button 
            onClick={handleAddCreator}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: '#fff',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
            }}>
            <Plus size={18} />
            Add Role
          </button>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {[
          { 
            title: 'Total Roles', 
            value: stats.total.toString(), 
            change: 'All team members',
            icon: Shield,
            color: '#8b5cf6',
            bgGradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            lightBg: '#f5f3ff'
          },
          { 
            title: 'Trainers', 
            value: stats.trainers.toString(),
            change: 'Course trainers',
            icon: Users,
            color: '#3b82f6',
            bgGradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            lightBg: '#eff6ff'
          },
          { 
            title: 'Mentors', 
            value: stats.mentors.toString(),
            change: 'Student mentors',
            icon: Award,
            color: '#10b981',
            bgGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            lightBg: '#f0fdf4'
          },
          { 
            title: 'Verified', 
            value: stats.verified.toString(),
            change: 'Verified members',
            icon: CheckCircle,
            color: '#06b6d4',
            bgGradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
            lightBg: '#ecfeff'
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '28px',
              border: '2px solid #e2e8f0',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = stat.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}>
              <div style={{
                position: 'absolute',
                top: '-30px',
                right: '-30px',
                width: '140px',
                height: '140px',
                background: stat.lightBg,
                borderRadius: '50%',
                opacity: 0.6
              }} />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: stat.bgGradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 8px 16px ${stat.color}40`
                  }}>
                    <Icon size={28} style={{ color: '#fff' }} />
                  </div>
                  <div style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: stat.lightBg,
                    fontSize: '11px',
                    fontWeight: '700',
                    color: stat.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Live
                  </div>
                </div>
                
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {stat.title}
                </div>
                <div style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', marginBottom: '8px', lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: stat.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={14} />
                  {stat.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filter */}
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '24px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={20} style={{
              position: 'absolute',
              left: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8'
            }} />
            <input
              type="text"
              placeholder="Search by name..."
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
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            style={{
              padding: '14px 18px',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              outline: 'none',
              background: '#f8fafc',
              color: '#475569',
              minWidth: '160px'
            }}>
            <option value="all">All Roles</option>
            <option value="organization">Organization</option>
            <option value="trainer">Trainer</option>
            <option value="mentor">Mentor</option>
            <option value="instructor">Instructor</option>
          </select>

          <button
            onClick={() => {
              setSearchQuery('');
              setFilterRole('all');
            }}
            style={{
              padding: '14px 24px',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              background: '#f8fafc',
              cursor: 'pointer',
              color: '#64748b',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}>
            Reset
          </button>
        </div>
      </div>

      {/* Roles Grid */}
      {loading ? (
        <div style={{ padding: '80px', textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #f1f5f9',
            borderTop: '4px solid #8b5cf6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#64748b' }}>Loading roles...</div>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : filteredCreators.length === 0 ? (
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '80px',
          textAlign: 'center',
          border: '2px solid #e2e8f0'
        }}>
          <Shield size={64} style={{ color: '#cbd5e1', margin: '0 auto 20px' }} />
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>No roles found</div>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px' }}>Try adjusting your search or add a new role</div>
          <button 
            onClick={handleAddCreator}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: '#fff',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
            <Plus size={18} />
            Add First Role
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
          {filteredCreators.map((creator) => {
            const config = roleConfig[creator.role] || roleConfig.trainer;
            const Icon = config.icon;
            
            return (
              <div key={creator.id} style={{
                background: '#fff',
                borderRadius: '20px',
                padding: '28px',
                border: '2px solid #e2e8f0',
                transition: 'all 0.3s',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = config.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}>
                {/* Decorative Background */}
                <div style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '-40px',
                  width: '160px',
                  height: '160px',
                  background: config.lightBg,
                  borderRadius: '50%',
                  opacity: 0.5
                }} />

                {/* Header */}
                <div style={{ position: 'relative', zIndex: 1, marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '16px',
                      background: config.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 8px 16px ${config.color}40`
                    }}>
                      <Icon size={32} style={{ color: '#fff' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {creator.is_verified && (
                        <div style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          background: '#d1fae5',
                          fontSize: '11px',
                          fontWeight: '700',
                          color: '#065f46',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <CheckCircle size={12} />
                          Verified
                        </div>
                      )}
                      <div style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: creator.is_active ? '#d1fae5' : '#fee2e2',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: creator.is_active ? '#065f46' : '#991b1b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {creator.is_active ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {creator.is_active ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: config.bg,
                    fontSize: '12px',
                    fontWeight: '700',
                    color: config.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'inline-block',
                    marginBottom: '16px'
                  }}>
                    {config.label}
                  </div>

                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0, marginBottom: '8px' }}>
                    {creator.name}
                  </h3>
                  <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={14} />
                    {creator.email || 'No email'}
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, margin: 0, marginBottom: '16px' }}>
                    {creator.bio || 'No bio available'}
                  </p>

                  {/* Expertise Tags */}
                  {creator.expertise && creator.expertise.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                      {creator.expertise.slice(0, 3).map((exp, idx) => (
                        <span key={idx} style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          fontSize: '11px',
                          fontWeight: '600',
                          color: '#475569'
                        }}>
                          {exp}
                        </span>
                      ))}
                      {creator.expertise.length > 3 && (
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          fontSize: '11px',
                          fontWeight: '600',
                          color: '#8b5cf6'
                        }}>
                          +{creator.expertise.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
                    <div style={{
                      padding: '12px',
                      background: '#f8fafc',
                      borderRadius: '10px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>
                        Courses
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
                        {creator.total_courses || 0}
                      </div>
                    </div>
                    <div style={{
                      padding: '12px',
                      background: '#f8fafc',
                      borderRadius: '10px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>
                        Students
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
                        {creator.total_students || 0}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEditCreator(creator)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        color: '#fff',
                        border: 'none',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                      <Edit3 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCreator(creator.id)}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        background: '#fee2e2',
                        border: '2px solid #fecaca',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fecaca';
                        e.currentTarget.style.borderColor = '#ef4444';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fee2e2';
                        e.currentTarget.style.borderColor = '#fecaca';
                      }}>
                      <Trash2 size={16} style={{ color: '#dc2626' }} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
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
          padding: '20px'
        }}
        onClick={() => setShowModal(false)}>
          <div style={{
            background: '#fff',
            borderRadius: '24px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
            border: '2px solid #e2e8f0'
          }}
          onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{
              padding: '28px',
              borderBottom: '2px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0, marginBottom: '4px' }}>
                  {editingCreator ? 'Edit Role' : 'Add New Role'}
                </h2>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  {editingCreator ? 'Update role information' : 'Create a new team member role'}
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

            {/* Modal Body */}
            <div style={{ padding: '28px' }}>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                    Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={creatorForm.name}
                    onChange={(e) => setCreatorForm({ ...creatorForm, name: e.target.value })}
                    placeholder="Full name"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#8b5cf6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                    Email <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="email"
                    value={creatorForm.email}
                    onChange={(e) => setCreatorForm({ ...creatorForm, email: e.target.value })}
                    placeholder="email@example.com"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#8b5cf6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                    Role Type
                  </label>
                  <select
                    value={creatorForm.role}
                    onChange={(e) => setCreatorForm({ ...creatorForm, role: e.target.value })}
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
                    <option value="organization">Organization</option>
                    <option value="trainer">Trainer</option>
                    <option value="mentor">Mentor</option>
                    <option value="instructor">Instructor</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                    Bio
                  </label>
                  <textarea
                    value={creatorForm.bio}
                    onChange={(e) => setCreatorForm({ ...creatorForm, bio: e.target.value })}
                    rows={4}
                    placeholder="Brief description about this role..."
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
                    onFocus={(e) => e.currentTarget.style.borderColor = '#8b5cf6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                    Expertise <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>(comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    value={creatorForm.expertise}
                    onChange={(e) => setCreatorForm({ ...creatorForm, expertise: e.target.value })}
                    placeholder="AI/Engineering, Blockchain, Web3"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#8b5cf6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={creatorForm.is_verified}
                      onChange={(e) => setCreatorForm({ ...creatorForm, is_verified: e.target.checked })}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#8b5cf6' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Verified</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={creatorForm.is_active}
                      onChange={(e) => setCreatorForm({ ...creatorForm, is_active: e.target.checked })}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#8b5cf6' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Active</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '24px 28px',
              borderTop: '2px solid #f1f5f9',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
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
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}>
                Cancel
              </button>
              <button
                onClick={handleSaveCreator}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                <Save size={16} />
                {editingCreator ? 'Update Role' : 'Create Role'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
