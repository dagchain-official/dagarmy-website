"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function Setttings() {
  const { userProfile, address, userRole } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Randomly select default images
  const getRandomBanner = () => {
    const banners = ['/images/avatar/banner/abstract-b01.jpg', '/images/avatar/banner/abstract-b02.jpeg'];
    return banners[Math.floor(Math.random() * banners.length)];
  };
  
  const getRandomProfile = () => {
    const profiles = ['/images/avatar/banner/abstract-p01.jpg', '/images/avatar/banner/abstract-p02.jpg'];
    return profiles[Math.floor(Math.random() * profiles.length)];
  };
  
  const [bannerPreview, setBannerPreview] = useState(getRandomBanner());
  const [avatarPreview, setAvatarPreview] = useState(getRandomProfile());
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    user_provided_email: '',
    country_code: '+91',
    whatsapp_number: '',
    bio: '',
    skill_occupation: '',
    wallet_address: ''
  });

  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    x: '',
    linkedin: '',
    instagram: '',
    github: '',
    website: ''
  });

  // Fetch user data from Supabase
  useEffect(() => {
    async function fetchUserData() {
      if (!address) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/auth/user?wallet=${address}`);
        const data = await response.json();
        
        if (data.user) {
          setUserData(data.user);
          setFormData({
            first_name: data.user.first_name || '',
            last_name: data.user.last_name || '',
            user_provided_email: data.user.user_provided_email || data.user.email || '',
            country_code: data.user.country_code || '+91',
            whatsapp_number: data.user.whatsapp_number || '',
            bio: data.user.bio || '',
            skill_occupation: data.user.skill_occupation || '',
            wallet_address: data.user.wallet_address || ''
          });
          
          if (data.user.avatar_url) {
            setAvatarPreview(data.user.avatar_url);
          }
          
          if (data.user.banner_url) {
            setBannerPreview(data.user.banner_url);
          }

          // Load social links from Supabase
          if (data.user.social_links) {
            setSocialLinks({
              facebook: data.user.social_links.facebook || '',
              x: data.user.social_links.x || '',
              linkedin: data.user.social_links.linkedin || '',
              instagram: data.user.social_links.instagram || '',
              github: data.user.social_links.github || '',
              website: data.user.social_links.website || ''
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserData();
  }, [address]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_address: address,
          ...formData,
          avatar_url: avatarPreview,
          banner_url: bannerPreview,
          social_links: socialLinks
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSocialSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_address: address,
          social_links: socialLinks
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Social links updated successfully!');
      } else {
        alert('Failed to update social links: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating social links:', error);
      alert('Failed to update social links');
    } finally {
      setSaving(false);
    }
  };

  // Check if user logged in with social account (Google, GitHub, etc.)
  // Check both userData.auth_provider (from DB) and userProfile.authProvider (from current session)
  const isSocialLogin = (userData?.auth_provider && 
                        userData.auth_provider !== 'wallet' && 
                        userData.auth_provider !== 'email') ||
                        (userProfile?.authProvider && 
                        userProfile.authProvider !== 'wallet' &&
                        userProfile.authProvider !== 'email');

  if (loading) {
    return (
      <div className="col-xl-9 col-lg-12">
        <div className="section-setting-right section-right">
          <div className="box" style={{ padding: '40px', textAlign: 'center' }}>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", background: "#f9fafb", minHeight: "100vh" }}>
      <div>
        {/* Page Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1a1f36", marginBottom: "8px" }}>Settings</h1>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>Manage your profile, preferences, and account settings</p>
        </div>

        {/* 2-Column Layout: Profile Information & Social Links */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "24px", alignItems: "stretch" }}>
          
          {/* Left Column - Profile with Banner */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Profile Banner & Avatar Card */}
            <div style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "0",
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              overflow: "hidden"
            }}>
              <div style={{ position: 'relative', marginBottom: '60px' }}>
                {/* Banner Image */}
                <div style={{ 
                  position: 'relative',
                  width: '100%',
                  height: '180px',
                  overflow: 'hidden',
                  backgroundColor: '#f3f4f6'
                }}>
                        <Image
                          src={bannerPreview}
                          alt="Banner"
                          fill
                          style={{ objectFit: 'cover' }}
                          priority
                        />
                        {/* Banner Edit Icon */}
                        <button
                          onClick={() => document.getElementById('banner-input').click()}
                          style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            zIndex: 10
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'white'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
                        >
                          <svg width="20" height="20" fill="none" stroke="#374151" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <input 
                          id="banner-input" 
                          type="file" 
                          accept="image/*"
                          onChange={handleBannerChange}
                          style={{ display: 'none' }}
                        />
                      </div>

            {/* Profile Image */}
            <div style={{
              position: 'absolute',
              bottom: '-50px',
              left: '32px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '4px solid white',
              overflow: 'hidden',
              backgroundColor: '#f3f4f6',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <Image
                src={avatarPreview}
                alt="Profile"
                width={120}
                height={120}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
                        
              {/* Profile Edit Icon */}
              <button
                onClick={() => document.getElementById('avatar-input').click()}
                style={{
                  position: 'absolute',
                  bottom: '4px',
                  right: '4px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#6366f1',
                  border: '2px solid white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#4f46e5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#6366f1'}
              >
                <svg width="14" height="14" fill="none" stroke="#ffffff" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <input 
                id="avatar-input" 
                type="file" 
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </div>
              </div>
            </div>

            {/* Profile Information Card */}
            <div style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              flex: 1
            }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1a1f36", marginBottom: "20px" }}>Profile Information</h2>
            <form onSubmit={handleSubmit}>
            {/* Name Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    backgroundColor: '#fff'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    backgroundColor: '#fff'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            {/* Email Field with Icon */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#374151',
                marginBottom: '8px'
              }}>
                Email Address
              </label>
                    <div style={{ position: 'relative' }}>
                      <svg 
                        style={{ 
                          position: 'absolute', 
                          left: '16px', 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          width: '20px',
                          height: '20px',
                          color: '#9ca3af'
                        }}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                <input
                  type="email"
                  name="user_provided_email"
                  value={formData.user_provided_email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 44px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    backgroundColor: '#fff'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            {/* WhatsApp Field with Icon */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#374151',
                marginBottom: '8px'
              }}>
                WhatsApp Number
              </label>
                    <div style={{ position: 'relative', display: 'flex', gap: '12px' }}>
                      <svg 
                        style={{ 
                          position: 'absolute', 
                          left: '16px', 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          width: '20px',
                          height: '20px',
                          color: '#25D366',
                          zIndex: 1
                        }}
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                <input
                  type="text"
                  name="country_code"
                  value={formData.country_code}
                  onChange={handleInputChange}
                  style={{
                    width: '100px',
                    padding: '10px 14px 10px 44px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    backgroundColor: '#fff'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                <input
                  type="tel"
                  name="whatsapp_number"
                  value={formData.whatsapp_number}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter phone number"
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    backgroundColor: '#fff'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            {/* Skill/Occupation */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#374151',
                marginBottom: '8px'
              }}>
                Skill/Occupation
              </label>
              <input
                type="text"
                name="skill_occupation"
                value={formData.skill_occupation}
                onChange={handleInputChange}
                placeholder="e.g., Full Stack Developer"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: '#fff'
                }}
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Bio */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#374151',
                marginBottom: '8px'
              }}>
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                placeholder="Tell us about yourself..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: '#fff',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={saving}
              style={{
                width: '100%',
                padding: '12px 20px',
                backgroundColor: saving ? '#d1d5db' : '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: saving ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (!saving) e.target.style.backgroundColor = '#4f46e5';
              }}
              onMouseLeave={(e) => {
                if (!saving) e.target.style.backgroundColor = '#6366f1';
              }}
            >
              {saving ? 'Updating...' : 'Update Profile'}
              {!saving && <span>→</span>}
            </button>
          </form>
            </div>
          </div>

          {/* Right Column - Social Links & Wallet */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Social Links Card */}
            <div style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
            }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1a1f36", marginBottom: "20px" }}>Social Links</h2>
            <form onSubmit={handleSocialSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Facebook */}
              <div>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px', 
                  fontWeight: '600', 
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                        <svg style={{ width: '20px', height: '20px', color: '#1877F2' }} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </label>
                <input
                  type="url"
                  name="facebook"
                  value={socialLinks.facebook}
                  onChange={handleSocialChange}
                  placeholder="https://facebook.com/username"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    backgroundColor: '#fff'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              {/* X (formerly Twitter) */}
              <div>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px', 
                  fontWeight: '600', 
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                        <svg style={{ width: '20px', height: '20px', color: '#000000' }} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        X
                      </label>
                <input
                  type="url"
                  name="x"
                  value={socialLinks.x}
                  onChange={handleSocialChange}
                  placeholder="https://x.com/username"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    backgroundColor: '#fff'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px', 
                  fontWeight: '600', 
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                        <svg style={{ width: '20px', height: '20px', color: '#0A66C2' }} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        LinkedIn
                      </label>
                <input
                  type="url"
                  name="linkedin"
                  value={socialLinks.linkedin}
                  onChange={handleSocialChange}
                  placeholder="https://linkedin.com/in/username"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    backgroundColor: '#fff'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              {/* Instagram */}
              <div>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px', 
                  fontWeight: '600', 
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                        <svg style={{ width: '20px', height: '20px', color: '#E4405F' }} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                        </svg>
                        Instagram
                      </label>
                <input
                  type="url"
                  name="instagram"
                  value={socialLinks.instagram}
                  onChange={handleSocialChange}
                  placeholder="https://instagram.com/username"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    backgroundColor: '#fff'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              {/* GitHub */}
              <div>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px', 
                  fontWeight: '600', 
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                        <svg style={{ width: '20px', height: '20px', color: '#181717' }} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                        </svg>
                        GitHub
                      </label>
                <input
                  type="url"
                  name="github"
                  value={socialLinks.github}
                  onChange={handleSocialChange}
                  placeholder="https://github.com/username"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    backgroundColor: '#fff'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              {/* Website */}
              <div>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px', 
                  fontWeight: '600', 
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                        <svg style={{ width: '20px', height: '20px', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        Website
                      </label>
                <input
                  type="url"
                  name="website"
                  value={socialLinks.website}
                  onChange={handleSocialChange}
                  placeholder="https://yourwebsite.com"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    backgroundColor: '#fff'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>
            
            {/* Submit Button */}
            <button 
              type="submit"
              style={{
                width: '100%',
                padding: '12px 20px',
                backgroundColor: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '24px'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#4f46e5'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#6366f1'}
            >
              Update Social Links
              <span>→</span>
            </button>
          </form>
            </div>

            {/* Wallet Address Card */}
            <div style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
            }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1a1f36", marginBottom: "20px" }}>Wallet Address</h2>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '13px', 
                    fontWeight: '600', 
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    DAGCHAIN Wallet <span style={{ color: '#9ca3af', fontWeight: '400' }}>(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="wallet_address"
                    value={formData.wallet_address}
                    onChange={handleInputChange}
                    placeholder="0x..."
                    pattern="^0x[a-fA-F0-9]{40}$"
                    title="Please enter a valid Ethereum wallet address (0x...)"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s',
                      backgroundColor: '#fff',
                      fontFamily: 'monospace'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                  <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '6px', display: 'block' }}>
                    Connect your DAGCHAIN wallet to enable blockchain features
                  </small>
                </div>
                <button 
                  type="submit" 
                  disabled={saving}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    backgroundColor: saving ? '#d1d5db' : '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (!saving) e.target.style.backgroundColor = '#4f46e5';
                  }}
                  onMouseLeave={(e) => {
                    if (!saving) e.target.style.backgroundColor = '#6366f1';
                  }}
                >
                  {saving ? 'Updating...' : 'Update Wallet'}
                  {!saving && <span>→</span>}
                </button>
              </form>
            </div>

            {/* Action Cards - Get Help & Set Goals */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "auto" }}>
              <div style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                borderRadius: "16px",
                padding: "24px",
                color: "#ffffff",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(245, 158, 11, 0.2)",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" style={{ marginBottom: "12px" }}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "6px" }}>Get Help</h3>
                <p style={{ fontSize: "12px", opacity: 0.95, lineHeight: "1.5" }}>Connect with mentors and community</p>
              </div>
              
              <div style={{
                background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
                borderRadius: "16px",
                padding: "24px",
                color: "#ffffff",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(236, 72, 153, 0.2)",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" style={{ marginBottom: "12px" }}>
                  <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "6px" }}>Set Goals</h3>
                <p style={{ fontSize: "12px", opacity: 0.95, lineHeight: "1.5" }}>Track progress and achieve milestones</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
