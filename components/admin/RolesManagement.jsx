"use client";
import React, { useState, useEffect } from "react";
import { 
  UserCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  Shield,
  Users,
  Award,
  BookOpen,
  Save,
  X,
  Search,
  Filter
} from "lucide-react";

export default function RolesManagement() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCreator, setEditingCreator] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');

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
      }
    } catch (error) {
      console.error('Error saving creator:', error);
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
      }
    } catch (error) {
      console.error('Error deleting creator:', error);
    }
  };

  const roleConfig = {
    'organization': { icon: Shield, color: '#1f2937', label: 'Organization', bg: '#f3e8ff' },
    'trainer': { icon: Users, color: '#3b82f6', label: 'Trainer', bg: '#dbeafe' },
    'mentor': { icon: Award, color: '#10b981', label: 'Mentor', bg: '#d1fae5' },
    'instructor': { icon: BookOpen, color: '#f59e0b', label: 'Instructor', bg: '#fef3c7' }
  };

  const filteredCreators = creators.filter(creator => {
    if (filterRole !== 'all' && creator.role !== filterRole) return false;
    if (searchQuery && !creator.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div style={{ 
        padding: '48px', 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div className="spinner" style={{
          width: '48px',
          height: '48px',
          border: '4px solid #f3f4f6',
          borderTop: '4px solid #1f2937',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <div style={{ fontSize: '16px', color: '#6b7280', fontWeight: '500' }}>Loading roles...</div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', width: '100%' }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '40px',
        marginBottom: '32px',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          filter: 'blur(40px)'
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
            <div>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '700',
                marginBottom: '12px',
                letterSpacing: '-0.02em'
              }}>
                Roles Management
              </h1>
              <p style={{ fontSize: '16px', opacity: 0.95, lineHeight: '1.6' }}>
                Manage trainers, mentors, instructors, and team roles with access control
              </p>
            </div>
            <button
              onClick={handleAddCreator}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Plus size={18} />
              Add Role
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {[
              { label: 'Total Roles', value: creators.length, icon: UserCheck },
              { label: 'Trainers', value: creators.filter(c => c.role === 'trainer').length, icon: Users },
              { label: 'Mentors', value: creators.filter(c => c.role === 'mentor').length, icon: Award },
              { label: 'Verified', value: creators.filter(c => c.is_verified).length, icon: Shield }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <Icon size={24} style={{ marginBottom: '12px', opacity: 0.9 }} />
                  <div style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '13px', opacity: 0.9, fontWeight: '500' }}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ 
        background: '#fff', 
        borderRadius: '12px', 
        padding: '24px', 
        marginBottom: '24px',
        border: '1px solid #e5e7eb',
        display: 'flex',
        gap: '16px',
        alignItems: 'center'
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 44px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>
        
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          style={{
            padding: '12px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            background: '#fff',
            minWidth: '180px'
          }}
        >
          <option value="all">All Roles</option>
          <option value="organization">Organization</option>
          <option value="trainer">Trainer</option>
          <option value="mentor">Mentor</option>
          <option value="instructor">Instructor</option>
        </select>
      </div>

      {/* Roles List */}
      {filteredCreators.length === 0 ? (
        <div style={{ 
          background: '#fff', 
          borderRadius: '12px', 
          padding: '60px', 
          textAlign: 'center',
          border: '1px solid #e5e7eb'
        }}>
          <UserCheck size={48} style={{ color: '#9ca3af', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
            No roles found
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
            {searchQuery || filterRole !== 'all' ? 'Try adjusting your filters' : 'Get started by adding your first role'}
          </p>
          <button
            onClick={handleAddCreator}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              background: '#1f2937',
              color: '#fff',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Plus size={18} />
            Add Role
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredCreators.map((creator) => {
            const config = roleConfig[creator.role] || roleConfig.trainer;
            const Icon = config.icon;

            return (
              <div key={creator.id} style={{
                background: '#fff',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                padding: '24px',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'}
              >
                <div style={{ display: 'flex', alignItems: 'start', gap: '20px' }}>
                  {/* Icon */}
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '12px',
                    background: config.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={32} style={{ color: config.color }} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: 0 }}>
                        {creator.name}
                      </h3>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        background: config.bg,
                        color: config.color,
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}>
                        {config.label}
                      </span>
                      {creator.is_verified && (
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: '#d1fae5',
                          color: '#065f46',
                          fontSize: '11px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Shield size={12} />
                          Verified
                        </span>
                      )}
                      {!creator.is_active && (
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: '#fee2e2',
                          color: '#991b1b',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}>
                          Inactive
                        </span>
                      )}
                    </div>

                    {creator.email && (
                      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                        {creator.email}
                      </p>
                    )}

                    {creator.bio && (
                      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px', lineHeight: '1.6' }}>
                        {creator.bio}
                      </p>
                    )}

                    {creator.expertise && creator.expertise.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                        {creator.expertise.map((skill, index) => (
                          <span key={index} style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            background: '#f3f4f6',
                            color: '#374151',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#6b7280' }}>
                      <span><strong style={{ color: '#111827' }}>{creator.total_courses || 0}</strong> courses</span>
                      <span><strong style={{ color: '#111827' }}>{creator.total_students || 0}</strong> students</span>
                      {creator.rating > 0 && (
                        <span><strong style={{ color: '#111827' }}>{creator.rating.toFixed(1)}</strong> rating</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEditCreator(creator)}
                      style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        background: '#fff',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#6b7280',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f9fafb';
                        e.currentTarget.style.color = '#111827';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.color = '#6b7280';
                      }}
                    >
                      <Edit3 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCreator(creator.id)}
                      style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: '1px solid #fee2e2',
                        background: '#fff',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#dc2626',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>
                {editingCreator ? 'Edit Role' : 'Add New Role'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#f3f4f6',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} style={{ color: '#6b7280' }} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block', color: '#374151' }}>
                  Name *
                </label>
                <input 
                  type="text" 
                  value={creatorForm.name} 
                  onChange={(e) => setCreatorForm({...creatorForm, name: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '12px 14px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    outline: 'none'
                  }} 
                />
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block', color: '#374151' }}>
                  Email
                </label>
                <input 
                  type="email" 
                  value={creatorForm.email} 
                  onChange={(e) => setCreatorForm({...creatorForm, email: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '12px 14px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    outline: 'none'
                  }} 
                />
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block', color: '#374151' }}>
                  Role *
                </label>
                <select 
                  value={creatorForm.role} 
                  onChange={(e) => setCreatorForm({...creatorForm, role: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '12px 14px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer',
                    background: '#fff'
                  }}
                >
                  <option value="trainer">Trainer</option>
                  <option value="mentor">Mentor</option>
                  <option value="instructor">Instructor</option>
                  <option value="organization">Organization</option>
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block', color: '#374151' }}>
                  Bio
                </label>
                <textarea 
                  value={creatorForm.bio} 
                  onChange={(e) => setCreatorForm({...creatorForm, bio: e.target.value})}
                  rows={3} 
                  style={{ 
                    width: '100%', 
                    padding: '12px 14px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }} 
                />
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block', color: '#374151' }}>
                  Expertise (comma-separated)
                </label>
                <input 
                  type="text" 
                  value={creatorForm.expertise} 
                  onChange={(e) => setCreatorForm({...creatorForm, expertise: e.target.value})}
                  placeholder="e.g., AI, Blockchain, Web3"
                  style={{ 
                    width: '100%', 
                    padding: '12px 14px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    outline: 'none'
                  }} 
                />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={creatorForm.is_verified}
                    onChange={(e) => setCreatorForm({...creatorForm, is_verified: e.target.checked})}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Verified</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={creatorForm.is_active}
                    onChange={(e) => setCreatorForm({...creatorForm, is_active: e.target.checked})}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Active</span>
                </label>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
              <button 
                onClick={() => setShowModal(false)}
                style={{ 
                  flex: 1, 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #d1d5db', 
                  background: '#fff', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveCreator}
                style={{ 
                  flex: 1, 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: 'none', 
                  background: '#1f2937', 
                  color: '#fff', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Save size={16} />
                Save Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
