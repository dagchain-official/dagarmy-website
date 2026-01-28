"use client";
import React, { useState, useEffect } from "react";
import { 
  Award, TrendingUp, DollarSign, Users, Settings, Save, RefreshCw, 
  Edit2, Check, X, Info, Zap, Target, Gift, Star, Crown, Shield,
  Percent, Coins, Trophy, Lock, Unlock
} from "lucide-react";

export default function RewardsManagementComprehensive() {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('referral');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/rewards/config');
      const data = await response.json();
      
      if (data.config) {
        // Convert array to object for easier access
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
      
      // Get user email from localStorage
      const userStr = localStorage.getItem('dagarmy_user');
      const user = userStr ? JSON.parse(userStr) : null;
      const userEmail = user?.email;

      if (!userEmail) {
        showMessage('error', 'User not authenticated');
        return;
      }

      // Determine which keys to update based on section
      let keysToUpdate = [];
      if (section === 'referral') {
        keysToUpdate = [
          'soldier_referral_join_bonus',
          'lieutenant_referral_join_bonus',
          'referral_upgrade_total_bonus',
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

      // Update each config value
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

  const renderEditableField = (label, key, suffix = '', min = 0, max = 100000) => {
    const isEditing = editingSection && editValues.hasOwnProperty(key);
    const value = isEditing ? editValues[key] : config[key];

    return (
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        background: '#f8fafc',
        borderRadius: '8px',
        marginBottom: '12px'
      }}>
        <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
          {label}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isEditing ? (
            <input
              type="number"
              value={value || 0}
              onChange={(e) => handleInputChange(key, e.target.value)}
              min={min}
              max={max}
              style={{
                width: '120px',
                padding: '8px 12px',
                border: '2px solid #3b82f6',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '700',
                color: '#1f2937',
                textAlign: 'right'
              }}
            />
          ) : (
            <span style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#1f2937',
              minWidth: '80px',
              textAlign: 'right'
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
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
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
            Configure DAG Points, Referral Bonuses, Ranking System, and Sales Commissions
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
            { id: 'referral', label: 'Referral Bonuses', icon: Users },
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
          {/* Referral Bonuses Tab */}
          {activeTab === 'referral' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
                  Referral Bonuses
                </h2>
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

              {renderEditableField('DAG SOLDIER Referral Join Bonus', 'soldier_referral_join_bonus', ' Points')}
              {renderEditableField('DAG LIEUTENANT Referral Join Bonus', 'lieutenant_referral_join_bonus', ' Points')}
              {renderEditableField('Referral Upgrade Total Bonus', 'referral_upgrade_total_bonus', ' Points')}
              {renderEditableField('DAG LIEUTENANT Bonus Percentage', 'lieutenant_bonus_percentage', '%', 0, 100)}
            </div>
          )}

          {/* Rank Requirements Tab */}
          {activeTab === 'ranks' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
                  Rank Burn Requirements
                </h2>
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                {renderEditableField('INITIATOR', 'rank_burn_initiator', ' Points')}
                {renderEditableField('VANGUARD', 'rank_burn_vanguard', ' Points')}
                {renderEditableField('GUARDIAN', 'rank_burn_guardian', ' Points')}
                {renderEditableField('STRIKER', 'rank_burn_striker', ' Points')}
                {renderEditableField('INVOKER', 'rank_burn_invoker', ' Points')}
                {renderEditableField('COMMANDER', 'rank_burn_commander', ' Points')}
                {renderEditableField('CHAMPION', 'rank_burn_champion', ' Points')}
                {renderEditableField('CONQUEROR', 'rank_burn_conqueror', ' Points')}
                {renderEditableField('PARAGON', 'rank_burn_paragon', ' Points')}
                {renderEditableField('MYTHIC', 'rank_burn_mythic', ' Points')}
              </div>
            </div>
          )}

          {/* Sales Commissions Tab */}
          {activeTab === 'sales' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
                  Default Sales Commissions
                </h2>
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

              {renderEditableField('DAG SOLDIER Direct Sales Commission', 'soldier_direct_sales_commission', '%', 0, 100)}
              {renderEditableField('DAG LIEUTENANT Direct Sales (No Rank)', 'lieutenant_direct_sales_commission_default', '%', 0, 100)}
              {renderEditableField('DAG LIEUTENANT Level 2 Commission', 'lieutenant_level2_sales_commission', '%', 0, 100)}
              {renderEditableField('DAG LIEUTENANT Level 3 Commission', 'lieutenant_level3_sales_commission', '%', 0, 100)}
            </div>
          )}

          {/* Rank Commissions Tab */}
          {activeTab === 'rank_commissions' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
                  Rank-Based Direct Sales Commissions
                </h2>
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                {renderEditableField('INITIATOR Commission', 'rank_commission_initiator', '%', 0, 100)}
                {renderEditableField('VANGUARD Commission', 'rank_commission_vanguard', '%', 0, 100)}
                {renderEditableField('GUARDIAN Commission', 'rank_commission_guardian', '%', 0, 100)}
                {renderEditableField('STRIKER Commission', 'rank_commission_striker', '%', 0, 100)}
                {renderEditableField('INVOKER Commission', 'rank_commission_invoker', '%', 0, 100)}
                {renderEditableField('COMMANDER Commission', 'rank_commission_commander', '%', 0, 100)}
                {renderEditableField('CHAMPION Commission', 'rank_commission_champion', '%', 0, 100)}
                {renderEditableField('CONQUEROR Commission', 'rank_commission_conqueror', '%', 0, 100)}
                {renderEditableField('PARAGON Commission', 'rank_commission_paragon', '%', 0, 100)}
                {renderEditableField('MYTHIC Commission', 'rank_commission_mythic', '%', 0, 100)}
              </div>
            </div>
          )}

          {/* System Settings Tab */}
          {activeTab === 'system' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
                  System Settings
                </h2>
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
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px',
                background: '#f8fafc',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <div>
                  <span style={{ fontSize: '16px', color: '#111827', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                    Ranking System for DAG SOLDIER
                  </span>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>
                    Enable or disable the ranking system for DAG SOLDIER tier
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                        cursor: 'pointer'
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
                      gap: '8px'
                    }}>
                      {config.ranking_system_enabled_for_soldier === 1 ? <Unlock size={16} /> : <Lock size={16} />}
                      {config.ranking_system_enabled_for_soldier === 1 ? 'Enabled' : 'Disabled'}
                    </div>
                  )}
                </div>
              </div>

              {renderEditableField('Maximum Commission Levels', 'max_commission_levels', ' Levels', 1, 10)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
