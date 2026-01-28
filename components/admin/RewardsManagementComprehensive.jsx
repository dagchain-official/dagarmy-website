"use client";
import React, { useState, useEffect } from "react";
import { 
  Award, Save, Edit2, Check, X, Users, Trophy, DollarSign, Crown, Settings,
  Gift, TrendingUp, Zap, Shield, Lock, Unlock
} from "lucide-react";

export default function RewardsManagementComprehensive() {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('signup');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/rewards/config');
      const data = await response.json();
      
      if (data.config) {
        const configObj = {};
        data.config.forEach(item => {
          configObj[item.config_key] = item.config_value;
        });
        setConfig(configObj);
      }
    } catch (error) {
      console.error('Error fetching config:', error);
      showMessage('error', 'Failed to load rewards configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section) => {
    setEditingSection(section);
    setEditValues({...config});
  };

  const handleCancel = () => {
    setEditingSection(null);
    setEditValues({});
  };

  const handleSave = async (section) => {
    try {
      setSaving(true);
      
      const userStr = localStorage.getItem('dagarmy_user');
      const user = userStr ? JSON.parse(userStr) : null;
      const userEmail = user?.email;

      if (!userEmail) {
        showMessage('error', 'User not authenticated');
        return;
      }

      let keysToUpdate = [];
      if (section === 'signup') {
        keysToUpdate = ['soldier_signup_bonus', 'lieutenant_self_upgrade_bonus'];
      } else if (section === 'referral') {
        keysToUpdate = [
          'soldier_refers_soldier_join',
          'soldier_refers_soldier_upgrade',
          'lieutenant_refers_soldier_join',
          'lieutenant_refers_soldier_upgrade',
          'lieutenant_bonus_percentage'
        ];
      } else if (section === 'ranks') {
        keysToUpdate = [
          'rank_burn_initiator', 'rank_burn_vanguard', 'rank_burn_guardian',
          'rank_burn_striker', 'rank_burn_invoker', 'rank_burn_commander',
          'rank_burn_champion', 'rank_burn_conqueror', 'rank_burn_paragon',
          'rank_burn_mythic'
        ];
      } else if (section === 'sales') {
        keysToUpdate = [
          'soldier_direct_sales_commission',
          'lieutenant_direct_sales_commission_default',
          'lieutenant_level2_sales_commission',
          'lieutenant_level3_sales_commission'
        ];
      } else if (section === 'rank_commissions') {
        keysToUpdate = [
          'rank_commission_initiator', 'rank_commission_vanguard', 'rank_commission_guardian',
          'rank_commission_striker', 'rank_commission_invoker', 'rank_commission_commander',
          'rank_commission_champion', 'rank_commission_conqueror', 'rank_commission_paragon',
          'rank_commission_mythic'
        ];
      } else if (section === 'system') {
        keysToUpdate = ['ranking_system_enabled_for_soldier', 'max_commission_levels'];
      }

      const updatePromises = keysToUpdate.map(key => 
        fetch('/api/rewards/config', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            config_key: key,
            config_value: parseInt(editValues[key]),
            user_email: userEmail
          })
        })
      );

      const results = await Promise.all(updatePromises);
      const allSuccessful = results.every(r => r.ok);

      if (allSuccessful) {
        showMessage('success', 'Configuration updated successfully');
        setEditingSection(null);
        setEditValues({});
        fetchConfig();
      } else {
        showMessage('error', 'Some updates failed');
      }
    } catch (error) {
      console.error('Error updating config:', error);
      showMessage('error', 'Failed to update configuration');
    } finally {
      setSaving(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleInputChange = (key, value) => {
    setEditValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderConfigItem = (title, description, key, suffix = '', isEditing = false) => {
    const value = isEditing ? editValues[key] : config[key];
    
    return (
      <div style={{
        padding: '20px',
        background: '#f8fafc',
        borderRadius: '10px',
        marginBottom: '16px',
        border: '2px solid #e5e7eb'
      }}>
        <div style={{ marginBottom: '12px' }}>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '700', 
            color: '#111827',
            marginBottom: '6px'
          }}>
            {title}
          </h4>
          <p style={{ 
            fontSize: '14px', 
            color: '#6b7280',
            lineHeight: '1.6'
          }}>
            {description}
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>
            Current Value:
          </span>
          {isEditing ? (
            <input
              type="number"
              value={value || 0}
              onChange={(e) => handleInputChange(key, e.target.value)}
              min={0}
              max={100000}
              style={{
                width: '150px',
                padding: '10px 14px',
                border: '2px solid #3b82f6',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: '700',
                color: '#1f2937',
                textAlign: 'right'
              }}
            />
          ) : (
            <span style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1f2937',
              background: '#fff',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '2px solid #e5e7eb'
            }}>
              {value || 0}{suffix}
            </span>
          )}
        </div>
      </div>
    );
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
          <p style={{ fontSize: '16px', color: '#6b7280' }}>Loading reward system...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '30px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: '700', 
            color: '#111827',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Award size={36} style={{ color: '#1f2937' }} />
            Comprehensive Rewards Management
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280' }}>
            Configure all aspects of the DAG MLM reward system
          </p>
        </div>

        {/* Message */}
        {message.text && (
          <div style={{
            padding: '16px 20px',
            borderRadius: '12px',
            marginBottom: '24px',
            background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
            border: `2px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
            color: message.type === 'success' ? '#065f46' : '#991b1b',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            {message.type === 'success' ? <Check size={20} /> : <X size={20} />}
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'signup', label: 'Self Signup Bonuses', icon: Gift },
            { id: 'referral', label: 'Referral Scenarios', icon: Users },
            { id: 'ranks', label: 'Rank Requirements', icon: Trophy },
            { id: 'sales', label: 'Sales Commissions', icon: DollarSign },
            { id: 'rank_commissions', label: 'Rank Commissions', icon: Crown },
            { id: 'system', label: 'System Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
                  : '#fff',
                color: activeTab === tab.id ? '#fff' : '#374151',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(31, 41, 55, 0.3)' : 'none'
              }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          {/* Self Signup Bonuses Tab */}
          {activeTab === 'signup' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '6px' }}>
                    Self Signup Bonuses
                  </h2>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    Points awarded to users when they sign up or upgrade their tier
                  </p>
                </div>
                {editingSection === 'signup' ? (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => handleSave('signup')}
                      disabled={saving}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#10b981',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <Save size={16} />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: '2px solid #e5e7eb',
                        background: '#fff',
                        color: '#6b7280',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEdit('signup')}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#1f2937',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Edit2 size={16} />
                    Edit Values
                  </button>
                )}
              </div>

              {renderConfigItem(
                'DAG SOLDIER Signup Bonus',
                'DAG Points awarded to a new user when they sign up as DAG SOLDIER (free tier)',
                'soldier_signup_bonus',
                ' Points',
                editingSection === 'signup'
              )}

              {renderConfigItem(
                'DAG LIEUTENANT Self Upgrade Bonus',
                'Additional DAG Points awarded when a user upgrades themselves to DAG LIEUTENANT by paying $149. Total points after upgrade: 500 (signup) + 3100 (upgrade) = 3600 Points',
                'lieutenant_self_upgrade_bonus',
                ' Points',
                editingSection === 'signup'
              )}
            </div>
          )}

          {/* Referral Scenarios Tab */}
          {activeTab === 'referral' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '6px' }}>
                    Referral Commission Scenarios
                  </h2>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    Points earned by referrers when their referrals join or upgrade
                  </p>
                </div>
                {editingSection === 'referral' ? (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => handleSave('referral')}
                      disabled={saving}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#10b981',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <Save size={16} />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: '2px solid #e5e7eb',
                        background: '#fff',
                        color: '#6b7280',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEdit('referral')}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#1f2937',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Edit2 size={16} />
                    Edit Values
                  </button>
                )}
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '700', 
                  color: '#1f2937',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Shield size={20} style={{ color: '#6b7280' }} />
                  Scenario 1: DAG SOLDIER Refers DAG SOLDIER
                </h3>

                {renderConfigItem(
                  'When Referral Joins',
                  'DAG Points earned by DAG SOLDIER when their referral signs up as DAG SOLDIER',
                  'soldier_refers_soldier_join',
                  ' Points',
                  editingSection === 'referral'
                )}

                {renderConfigItem(
                  'When Referral Upgrades to LIEUTENANT',
                  'Additional DAG Points earned by DAG SOLDIER when their referred DAG SOLDIER upgrades to DAG LIEUTENANT. Total earned from this referral: 500 (join) + 2500 (upgrade) = 3000 Points',
                  'soldier_refers_soldier_upgrade',
                  ' Points',
                  editingSection === 'referral'
                )}
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '700', 
                  color: '#1f2937',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Crown size={20} style={{ color: '#f59e0b' }} />
                  Scenario 2: DAG LIEUTENANT Refers DAG SOLDIER
                </h3>

                {renderConfigItem(
                  'When Referral Joins (20% Bonus)',
                  'DAG Points earned by DAG LIEUTENANT when their referral signs up as DAG SOLDIER. This is 20% more than what DAG SOLDIER earns (500 + 20% = 600)',
                  'lieutenant_refers_soldier_join',
                  ' Points',
                  editingSection === 'referral'
                )}

                {renderConfigItem(
                  'When Referral Upgrades to LIEUTENANT',
                  'Additional DAG Points earned by DAG LIEUTENANT when their referred DAG SOLDIER upgrades to DAG LIEUTENANT. Total earned from this referral: 600 (join) + 3000 (upgrade) = 3600 Points',
                  'lieutenant_refers_soldier_upgrade',
                  ' Points',
                  editingSection === 'referral'
                )}
              </div>

              {renderConfigItem(
                'DAG LIEUTENANT Bonus Percentage',
                'Extra percentage bonus that DAG LIEUTENANT members receive on all referral earnings compared to DAG SOLDIER members. This applies to all referral commissions.',
                'lieutenant_bonus_percentage',
                '%',
                editingSection === 'referral'
              )}
            </div>
          )}

          {/* Rank Requirements Tab */}
          {activeTab === 'ranks' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '6px' }}>
                    Rank Burn Requirements
                  </h2>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    DAG Points that must be burned (spent) to achieve each rank. Ranks must be achieved sequentially.
                  </p>
                </div>
                {editingSection === 'ranks' ? (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => handleSave('ranks')}
                      disabled={saving}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#10b981',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <Save size={16} />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: '2px solid #e5e7eb',
                        background: '#fff',
                        color: '#6b7280',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEdit('ranks')}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#1f2937',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Edit2 size={16} />
                    Edit Values
                  </button>
                )}
              </div>

              {renderConfigItem(
                'Rank 1: INITIATOR',
                'First rank achievement. User must burn 700 DAG Points to unlock INITIATOR rank and its benefits.',
                'rank_burn_initiator',
                ' Points',
                editingSection === 'ranks'
              )}

              {renderConfigItem(
                'Rank 2: VANGUARD',
                'Second rank. User must first achieve INITIATOR, then burn an additional 1500 Points to unlock VANGUARD.',
                'rank_burn_vanguard',
                ' Points',
                editingSection === 'ranks'
              )}

              {renderConfigItem(
                'Rank 3: GUARDIAN',
                'Third rank. Requires VANGUARD rank first, then burn an additional 3200 Points.',
                'rank_burn_guardian',
                ' Points',
                editingSection === 'ranks'
              )}

              {renderConfigItem(
                'Rank 4: STRIKER',
                'Fourth rank. Requires GUARDIAN rank first, then burn an additional 7000 Points.',
                'rank_burn_striker',
                ' Points',
                editingSection === 'ranks'
              )}

              {renderConfigItem(
                'Rank 5: INVOKER',
                'Fifth rank. Requires STRIKER rank first, then burn an additional 10000 Points.',
                'rank_burn_invoker',
                ' Points',
                editingSection === 'ranks'
              )}

              {renderConfigItem(
                'Rank 6: COMMANDER',
                'Sixth rank. Requires INVOKER rank first, then burn an additional 15000 Points.',
                'rank_burn_commander',
                ' Points',
                editingSection === 'ranks'
              )}

              {renderConfigItem(
                'Rank 7: CHAMPION',
                'Seventh rank. Requires COMMANDER rank first, then burn an additional 20000 Points.',
                'rank_burn_champion',
                ' Points',
                editingSection === 'ranks'
              )}

              {renderConfigItem(
                'Rank 8: CONQUEROR',
                'Eighth rank. Requires CHAMPION rank first, then burn an additional 30000 Points.',
                'rank_burn_conqueror',
                ' Points',
                editingSection === 'ranks'
              )}

              {renderConfigItem(
                'Rank 9: PARAGON',
                'Ninth rank. Requires CONQUEROR rank first, then burn an additional 40000 Points.',
                'rank_burn_paragon',
                ' Points',
                editingSection === 'ranks'
              )}

              {renderConfigItem(
                'Rank 10: MYTHIC',
                'Highest rank. Requires PARAGON rank first, then burn an additional 50000 Points to achieve MYTHIC status.',
                'rank_burn_mythic',
                ' Points',
                editingSection === 'ranks'
              )}
            </div>
          )}

          {/* Sales Commissions Tab */}
          {activeTab === 'sales' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '6px' }}>
                    Default Sales Commissions
                  </h2>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    USD commission percentages for product sales (Validator Nodes, Storage Nodes, DAGGPT Subscriptions)
                  </p>
                </div>
                {editingSection === 'sales' ? (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => handleSave('sales')}
                      disabled={saving}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#10b981',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <Save size={16} />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: '2px solid #e5e7eb',
                        background: '#fff',
                        color: '#6b7280',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEdit('sales')}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#1f2937',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Edit2 size={16} />
                    Edit Values
                  </button>
                )}
              </div>

              {renderConfigItem(
                'DAG SOLDIER Direct Sales Commission',
                'Percentage of sale amount earned by DAG SOLDIER on direct sales from their referrals. DAG SOLDIER only earns from direct sales (Level 1), no downline commissions.',
                'soldier_direct_sales_commission',
                '%',
                editingSection === 'sales'
              )}

              {renderConfigItem(
                'DAG LIEUTENANT Direct Sales (No Rank)',
                'Percentage of sale amount earned by DAG LIEUTENANT on direct sales when they have not achieved any rank (INITIATOR-MYTHIC). This applies to Level 1 sales.',
                'lieutenant_direct_sales_commission_default',
                '%',
                editingSection === 'sales'
              )}

              {renderConfigItem(
                'DAG LIEUTENANT Level 2 Commission',
                'Percentage of sale amount earned by DAG LIEUTENANT from their 2nd level downline sales (referrals of their referrals).',
                'lieutenant_level2_sales_commission',
                '%',
                editingSection === 'sales'
              )}

              {renderConfigItem(
                'DAG LIEUTENANT Level 3 Commission',
                'Percentage of sale amount earned by DAG LIEUTENANT from their 3rd level downline sales (3 levels deep in referral tree).',
                'lieutenant_level3_sales_commission',
                '%',
                editingSection === 'sales'
              )}
            </div>
          )}

          {/* Rank Commissions Tab */}
          {activeTab === 'rank_commissions' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '6px' }}>
                    Rank-Based Direct Sales Commissions
                  </h2>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    Enhanced commission rates for DAG LIEUTENANT members who have achieved ranks. Only applies to direct (Level 1) sales. Level 2 and 3 remain at default rates.
                  </p>
                </div>
                {editingSection === 'rank_commissions' ? (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => handleSave('rank_commissions')}
                      disabled={saving}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#10b981',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <Save size={16} />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: '2px solid #e5e7eb',
                        background: '#fff',
                        color: '#6b7280',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEdit('rank_commissions')}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#1f2937',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Edit2 size={16} />
                    Edit Values
                  </button>
                )}
              </div>

              {renderConfigItem(
                'INITIATOR Rank Commission',
                'Direct sales commission rate for users who have achieved INITIATOR rank. Replaces the default 7% rate.',
                'rank_commission_initiator',
                '%',
                editingSection === 'rank_commissions'
              )}

              {renderConfigItem(
                'VANGUARD Rank Commission',
                'Direct sales commission rate for users who have achieved VANGUARD rank.',
                'rank_commission_vanguard',
                '%',
                editingSection === 'rank_commissions'
              )}

              {renderConfigItem(
                'GUARDIAN Rank Commission',
                'Direct sales commission rate for users who have achieved GUARDIAN rank.',
                'rank_commission_guardian',
                '%',
                editingSection === 'rank_commissions'
              )}

              {renderConfigItem(
                'STRIKER Rank Commission',
                'Direct sales commission rate for users who have achieved STRIKER rank.',
                'rank_commission_striker',
                '%',
                editingSection === 'rank_commissions'
              )}

              {renderConfigItem(
                'INVOKER Rank Commission',
                'Direct sales commission rate for users who have achieved INVOKER rank.',
                'rank_commission_invoker',
                '%',
                editingSection === 'rank_commissions'
              )}

              {renderConfigItem(
                'COMMANDER Rank Commission',
                'Direct sales commission rate for users who have achieved COMMANDER rank.',
                'rank_commission_commander',
                '%',
                editingSection === 'rank_commissions'
              )}

              {renderConfigItem(
                'CHAMPION Rank Commission',
                'Direct sales commission rate for users who have achieved CHAMPION rank.',
                'rank_commission_champion',
                '%',
                editingSection === 'rank_commissions'
              )}

              {renderConfigItem(
                'CONQUEROR Rank Commission',
                'Direct sales commission rate for users who have achieved CONQUEROR rank.',
                'rank_commission_conqueror',
                '%',
                editingSection === 'rank_commissions'
              )}

              {renderConfigItem(
                'PARAGON Rank Commission',
                'Direct sales commission rate for users who have achieved PARAGON rank.',
                'rank_commission_paragon',
                '%',
                editingSection === 'rank_commissions'
              )}

              {renderConfigItem(
                'MYTHIC Rank Commission',
                'Direct sales commission rate for users who have achieved the highest MYTHIC rank. Maximum commission rate.',
                'rank_commission_mythic',
                '%',
                editingSection === 'rank_commissions'
              )}
            </div>
          )}

          {/* System Settings Tab */}
          {activeTab === 'system' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '6px' }}>
                    System Settings
                  </h2>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    Global configuration for the reward system
                  </p>
                </div>
                {editingSection === 'system' ? (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => handleSave('system')}
                      disabled={saving}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#10b981',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <Save size={16} />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: '2px solid #e5e7eb',
                        background: '#fff',
                        color: '#6b7280',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEdit('system')}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#1f2937',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Edit2 size={16} />
                    Edit Values
                  </button>
                )}
              </div>

              <div style={{
                padding: '24px',
                background: '#f8fafc',
                borderRadius: '10px',
                marginBottom: '16px',
                border: '2px solid #e5e7eb'
              }}>
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ 
                    fontSize: '16px', 
                    fontWeight: '700', 
                    color: '#111827',
                    marginBottom: '6px'
                  }}>
                    Ranking System for DAG SOLDIER
                  </h4>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280',
                    lineHeight: '1.6'
                  }}>
                    Enable or disable the ranking system (INITIATOR → MYTHIC) for DAG SOLDIER tier members. Currently, only DAG LIEUTENANT can achieve ranks. Toggle this to allow DAG SOLDIER to participate in the ranking system.
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '16px',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>
                    Current Status:
                  </span>
                  {editingSection === 'system' ? (
                    <select
                      value={editValues.ranking_system_enabled_for_soldier || 0}
                      onChange={(e) => handleInputChange('ranking_system_enabled_for_soldier', e.target.value)}
                      style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: '2px solid #3b82f6',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        background: '#fff'
                      }}
                    >
                      <option value="0">Disabled</option>
                      <option value="1">Enabled</option>
                    </select>
                  ) : (
                    <div style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      background: config.ranking_system_enabled_for_soldier === 1 ? '#d1fae5' : '#fee2e2',
                      color: config.ranking_system_enabled_for_soldier === 1 ? '#065f46' : '#991b1b',
                      fontSize: '14px',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      border: `2px solid ${config.ranking_system_enabled_for_soldier === 1 ? '#10b981' : '#ef4444'}`
                    }}>
                      {config.ranking_system_enabled_for_soldier === 1 ? <Unlock size={16} /> : <Lock size={16} />}
                      {config.ranking_system_enabled_for_soldier === 1 ? 'Enabled' : 'Disabled'}
                    </div>
                  )}
                </div>
              </div>

              {renderConfigItem(
                'Maximum Commission Levels',
                'Maximum number of downline levels for which commissions are paid. Currently set to 3 (Direct, Level 2, Level 3). Can be increased to 4 or 5 levels if needed in the future.',
                'max_commission_levels',
                ' Levels',
                editingSection === 'system'
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
