"use client";
import React, { useState, useEffect } from "react";
import { 
  Award, TrendingUp, DollarSign, Users, Settings, Save, RefreshCw, 
  Edit2, Check, X, Info, Zap, Target, Gift, Star, Crown, Shield
} from "lucide-react";

export default function RewardsManagement() {
  const [config, setConfig] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/rewards/config');
      const data = await response.json();
      
      if (data.config) {
        setConfig(data.config);
      }
    } catch (error) {
      console.error('Error fetching config:', error);
      showMessage('error', 'Failed to load rewards configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditValue(item.config_value.toString());
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleSave = async (configKey) => {
    try {
      const response = await fetch('/api/rewards/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config_key: configKey,
          config_value: parseInt(editValue)
        })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('success', 'Configuration updated successfully');
        setEditingId(null);
        setEditValue('');
        fetchConfig();
      } else {
        showMessage('error', data.error || 'Failed to update configuration');
      }
    } catch (error) {
      console.error('Error updating config:', error);
      showMessage('error', 'Failed to update configuration');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        background: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 24px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 40px rgba(31, 41, 55, 0.3)'
          }}>
            <Award size={40} style={{ color: '#fff' }} />
          </div>
          <div style={{ fontSize: '18px', color: '#0f172a', fontWeight: '600', marginBottom: '8px' }}>
            Loading Rewards System
          </div>
          <div style={{ fontSize: '14px', color: '#64748b' }}>
            Fetching configuration data...
          </div>
        </div>
      </div>
    );
  }

  const totalSignupBonus = config.find(c => c.config_key === 'signup_bonus')?.config_value || 0;
  const totalUpgradeBonus = config.find(c => c.config_key === 'lieutenant_upgrade_bonus')?.config_value || 0;
  const lieutenantPrice = config.find(c => c.config_key === 'lieutenant_price_usd')?.config_value || 0;

  return (
    <div style={{ padding: '32px', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Premium Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 20px 40px rgba(31, 41, 55, 0.4), 0 0 0 1px rgba(255,255,255,0.1) inset'
              }}>
                <Award size={32} style={{ color: '#fff' }} />
              </div>
              <div>
                <h1 style={{ 
                  fontSize: '42px', 
                  fontWeight: '800', 
                  color: '#0f172a', 
                  margin: 0, 
                  lineHeight: 1,
                  letterSpacing: '-0.02em'
                }}>
                  Rewards Management
                </h1>
                <p style={{ fontSize: '16px', color: '#64748b', margin: '8px 0 0 0', fontWeight: '500' }}>
                  Configure DAG Points and tier rewards for DAGARMY members
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={fetchConfig}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              background: '#fff',
              border: '1px solid #e5e7eb',
              color: '#1f2937',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <RefreshCw size={16} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div
          style={{
            padding: '16px 20px',
            borderRadius: '12px',
            marginBottom: '32px',
            background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
            border: `1px solid ${message.type === 'success' ? '#86efac' : '#fca5a5'}`,
            color: message.type === 'success' ? '#166534' : '#991b1b',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
        >
          {message.type === 'success' ? <Check size={20} /> : <X size={20} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Premium Stats Grid */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div style={{
            background: 'linear-gradient(135deg, #fff 0%, #f9fafb 100%)',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(31,41,55,0.05) 0%, transparent 70%)'
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}>
                  <Gift size={28} style={{ color: '#1f2937' }} />
                </div>
                <span style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: '#f3f4f6',
                  color: '#6b7280',
                  fontSize: '11px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  DAG SOLDIER
                </span>
              </div>
              <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Signup Bonus
              </div>
              <div style={{ fontSize: '48px', fontWeight: '800', color: '#0f172a', lineHeight: 1, marginBottom: '8px' }}>
                {totalSignupBonus}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
                DAG Points awarded on registration
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div style={{
            background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid #374151',
            boxShadow: '0 20px 40px rgba(31,41,55,0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)'
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}>
                  <Crown size={28} style={{ color: '#fff' }} />
                </div>
                <span style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  DAG LIEUTENANT
                </span>
              </div>
              <div style={{ fontSize: '14px', color: '#d1d5db', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Upgrade Bonus
              </div>
              <div style={{ fontSize: '48px', fontWeight: '800', color: '#fff', lineHeight: 1, marginBottom: '8px' }}>
                {totalUpgradeBonus}
              </div>
              <div style={{ fontSize: '13px', color: '#d1d5db', fontWeight: '500' }}>
                DAG Points for premium upgrade
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div style={{
            background: 'linear-gradient(135deg, #fff 0%, #f9fafb 100%)',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(31,41,55,0.05) 0%, transparent 70%)'
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}>
                  <DollarSign size={28} style={{ color: '#1f2937' }} />
                </div>
                <span style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: '#dcfce7',
                  color: '#166534',
                  fontSize: '11px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  PRICING
                </span>
              </div>
              <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Lieutenant Price
              </div>
              <div style={{ fontSize: '48px', fontWeight: '800', color: '#0f172a', lineHeight: 1, marginBottom: '8px' }}>
                ${lieutenantPrice}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
                One-time lifetime upgrade fee
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Configuration Cards */}
      <div style={{
        background: '#fff',
        borderRadius: '24px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)'
      }}>
        <div style={{
          padding: '32px 40px',
          borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(135deg, #f9fafb 0%, #fff 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(31,41,55,0.3)'
            }}>
              <Settings size={24} style={{ color: '#fff' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: 0, lineHeight: 1 }}>
                Reward Configuration
              </h2>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '6px 0 0 0' }}>
                Manage and update reward values - changes take effect immediately
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: '40px' }}>
          <div className="row g-4">
            {config.map((item) => {
              const isEditing = editingId === item.id;
              const getIcon = () => {
                if (item.config_key === 'signup_bonus') return <Gift size={24} style={{ color: '#1f2937' }} />;
                if (item.config_key === 'lieutenant_upgrade_bonus') return <Crown size={24} style={{ color: '#1f2937' }} />;
                if (item.config_key === 'lieutenant_price_usd') return <DollarSign size={24} style={{ color: '#1f2937' }} />;
                return <Star size={24} style={{ color: '#1f2937' }} />;
              };

              const getTitle = () => {
                if (item.config_key === 'signup_bonus') return 'DAG SOLDIER Signup Bonus';
                if (item.config_key === 'lieutenant_upgrade_bonus') return 'DAG LIEUTENANT Upgrade Bonus';
                if (item.config_key === 'lieutenant_price_usd') return 'DAG LIEUTENANT Price';
                return item.config_key.replace(/_/g, ' ').toUpperCase();
              };

              const getTierBadge = () => {
                if (item.config_key === 'signup_bonus') {
                  return { text: 'SOLDIER', bg: '#f3f4f6', color: '#6b7280' };
                } else if (item.config_key.includes('lieutenant')) {
                  return { text: 'LIEUTENANT', bg: '#e5e7eb', color: '#1f2937' };
                }
                return { text: 'GENERAL', bg: '#f3f4f6', color: '#6b7280' };
              };

              const badge = getTierBadge();

              return (
                <div key={item.id} className="col-12">
                  <div style={{
                    background: 'linear-gradient(135deg, #f9fafb 0%, #fff 100%)',
                    borderRadius: '16px',
                    padding: '28px 32px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                    transition: 'all 0.3s'
                  }}>
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                          <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '14px',
                            background: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                            border: '1px solid #e5e7eb'
                          }}>
                            {getIcon()}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                                {getTitle()}
                              </h3>
                              <span style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '10px',
                                fontWeight: '700',
                                background: badge.bg,
                                color: badge.color,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}>
                                {badge.text}
                              </span>
                            </div>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                              {item.description}
                            </p>
                            {item.updated_at && (
                              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Info size={12} />
                                Last updated {new Date(item.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'flex-end' }}>
                          {isEditing ? (
                            <>
                              <input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                style={{
                                  width: '160px',
                                  padding: '14px 20px',
                                  border: '2px solid #1f2937',
                                  borderRadius: '12px',
                                  fontSize: '18px',
                                  fontWeight: '700',
                                  textAlign: 'center',
                                  background: '#fff'
                                }}
                                autoFocus
                              />
                              <button
                                onClick={() => handleSave(item.config_key)}
                                style={{
                                  padding: '14px 24px',
                                  borderRadius: '12px',
                                  background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                                  color: '#fff',
                                  border: 'none',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  boxShadow: '0 8px 20px rgba(31,41,55,0.3)',
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'translateY(-2px)';
                                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(31,41,55,0.4)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'translateY(0)';
                                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(31,41,55,0.3)';
                                }}
                              >
                                <Check size={16} />
                                Save Changes
                              </button>
                              <button
                                onClick={handleCancel}
                                style={{
                                  padding: '14px 24px',
                                  borderRadius: '12px',
                                  background: '#fff',
                                  color: '#6b7280',
                                  border: '1px solid #e5e7eb',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  transition: 'all 0.2s'
                                }}
                              >
                                <X size={16} />
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <div style={{
                                padding: '16px 28px',
                                borderRadius: '12px',
                                background: '#fff',
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                              }}>
                                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                  Current Value
                                </div>
                                <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>
                                  {item.config_key.includes('price') ? `$${item.config_value}` : item.config_value}
                                </div>
                              </div>
                              <button
                                onClick={() => handleEdit(item)}
                                style={{
                                  padding: '14px 28px',
                                  borderRadius: '12px',
                                  background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                                  color: '#fff',
                                  border: 'none',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  boxShadow: '0 8px 20px rgba(31,41,55,0.3)',
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'translateY(-2px)';
                                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(31,41,55,0.4)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'translateY(0)';
                                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(31,41,55,0.3)';
                                }}
                              >
                                <Edit2 size={16} />
                                Edit Value
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Premium Info Box */}
      <div style={{
        marginTop: '32px',
        padding: '24px 28px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        border: '1px solid #bfdbfe',
        display: 'flex',
        gap: '16px',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
        }}>
          <Zap size={24} style={{ color: '#1e40af' }} />
        </div>
        <div>
          <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#1e40af', margin: '0 0 8px 0' }}>
            Instant Updates
          </h4>
          <p style={{ fontSize: '13px', color: '#1e40af', margin: 0, lineHeight: 1.6, opacity: 0.9 }}>
            Changes to reward values take effect immediately for new signups and upgrades. Existing users retain their already earned points. All transactions are logged and auditable in the system.
          </p>
        </div>
      </div>
    </div>
  );
}
