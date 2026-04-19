"use client";
import React, { useState, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

/* ── Neumorphic design tokens ── */
const BG      = '#eef0f5';
const S_UP    = '6px 6px 14px rgba(0,0,0,0.12), -5px -5px 12px rgba(255,255,255,0.95)';
const S_UP_LG = '10px 10px 24px rgba(0,0,0,0.13), -8px -8px 20px rgba(255,255,255,1)';
const S_IN    = 'inset 5px 5px 12px rgba(0,0,0,0.11), inset -4px -4px 10px rgba(255,255,255,0.9)';
const S_IN_SM = 'inset 3px 3px 7px rgba(0,0,0,0.10), inset -2px -2px 6px rgba(255,255,255,0.85)';
const PURPLE  = '#6366f1';
const S_PURPLE= '5px 5px 14px rgba(99,102,241,0.40), -3px -3px 8px rgba(255,255,255,0.6)';

/* Shared neumorphic input */
const nmInput = (extra = {}) => ({
  width: '100%', padding: '11px 15px', borderRadius: '13px', border: 'none',
  fontSize: '13px', color: '#0f172a', outline: 'none', background: BG,
  boxShadow: S_IN, boxSizing: 'border-box', fontFamily: 'inherit', ...extra,
});
const lbl = {
  fontSize: '10px', fontWeight: '800', color: '#94a3b8',
  textTransform: 'uppercase', letterSpacing: '0.7px',
  marginBottom: '7px', display: 'block',
};

export default function Setttings() {
  const { userProfile, address, userRole } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mob, setMob] = useState(true);
  // DGCC transfer state
  const [dgccBalance, setDgccBalance]   = useState(0);
  const [transferDest, setTransferDest] = useState(null);
  const [transferAmt, setTransferAmt]   = useState(1);
  const [transferring, setTransferring] = useState(false);
  const [transferMsg, setTransferMsg]   = useState(null);

  useLayoutEffect(() => {
    const check = () => setMob(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  const [paymentSaving, setPaymentSaving] = useState(false);
  const [paymentSaved, setPaymentSaved] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [referralInput, setReferralInput] = useState('');
  const [referralApplying, setReferralApplying] = useState(false);
  const [referralMsg, setReferralMsg] = useState(null);
  const [existingReferrer, setExistingReferrer] = useState(null);
  const [referralChecked, setReferralChecked] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    preferred_payout: 'bank',
    bep20_address: '',
    bank_account_name: '',
    bank_account_number: '',
    bank_name: '',
    bank_branch: '',
    bank_swift_iban: '',
  });
  
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

  const profileEmail = userProfile?.email;

  // Fetch user data from Supabase
  useEffect(() => {
    async function fetchUserData() {
      // Try to resolve identity: wallet address → userProfile email → localStorage
      let fetchUrl = null;
      if (address) {
        fetchUrl = `/api/auth/user?wallet=${address}`;
      } else if (profileEmail) {
        fetchUrl = `/api/auth/user?email=${encodeURIComponent(profileEmail)}`;
      } else {
        // Fallback: read from localStorage (set during login for social users)
        try {
          const stored = localStorage.getItem('dagarmy_user');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed?.email) {
              fetchUrl = `/api/auth/user?email=${encodeURIComponent(parsed.email)}`;
            } else if (parsed?.wallet_address) {
              fetchUrl = `/api/auth/user?wallet=${parsed.wallet_address.toLowerCase()}`;
            }
          }
        } catch (_) {}
      }

      if (!fetchUrl) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(fetchUrl);
        const data = await response.json();
        
        if (data.user) {
          setUserData(data.user);
          // Check if user already has a referral
          if (data.user.id) {
            fetch(`/api/referral/status?userId=${data.user.id}`)
              .then(r => r.json())
              .then(d => {
                if (d.referrer) setExistingReferrer(d.referrer);
                setReferralChecked(true);
              })
              .catch(() => setReferralChecked(true));
          }
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
          
          if (data.user.avatar_url) setAvatarPreview(data.user.avatar_url);
          if (data.user.banner_url) setBannerPreview(data.user.banner_url);
          setDgccBalance(data.user.dgcc_balance || 0);

          setPaymentForm({
            preferred_payout: data.user.preferred_payout || 'bank',
            bep20_address: data.user.bep20_address || '',
            bank_account_name: data.user.bank_account_name || '',
            bank_account_number: data.user.bank_account_number || '',
            bank_name: data.user.bank_name || '',
            bank_branch: data.user.bank_branch || '',
            bank_swift_iban: data.user.bank_swift_iban || '',
          });

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
  }, [address, profileEmail]);

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

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentSaving(true);
    setPaymentError('');
    setPaymentSaved(false);
    try {
      let userId = userData?.id;
      if (!userId) {
        try {
          const stored = localStorage.getItem('dagarmy_user');
          if (stored) userId = JSON.parse(stored)?.id;
        } catch (_) {}
      }
      if (!userId) { setPaymentError('User not found. Please refresh.'); return; }
      const res = await fetch('/api/user/payment-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...paymentForm }),
      });
      const data = await res.json();
      if (data.success) {
        setPaymentSaved(true);
        setTimeout(() => setPaymentSaved(false), 3000);
      } else {
        setPaymentError(data.error || 'Failed to save payment info');
      }
    } catch (err) {
      setPaymentError('Network error. Please try again.');
    } finally {
      setPaymentSaving(false);
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
      <div style={{ width:'100%', padding:'32px 36px', background:BG, minHeight:'100vh',
        display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ background:BG, borderRadius:'22px', boxShadow:S_IN,
          padding:'48px 64px', textAlign:'center' }}>
          <div style={{ width:'44px', height:'44px', border:`3px solid ${BG}`,
            borderTopColor:PURPLE, borderRadius:'50%',
            animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }} />
          <p style={{ color:'#94a3b8', fontSize:'14px', fontWeight:'600', margin:0 }}>
            Loading profile…
          </p>
        </div>
        <style>{`@keyframes spin { to{transform:rotate(360deg)} }`}</style>
      </div>
    );
  }

  /* ── Shared save button style ── */
  const saveBtn = (disabled) => ({
    display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
    padding:'12px 28px', borderRadius:'14px', border:'none', fontSize:'13px',
    fontWeight:'700', cursor: disabled ? 'not-allowed' : 'pointer',
    background: disabled ? BG : PURPLE,
    color:  disabled ? '#94a3b8' : '#fff',
    boxShadow: disabled ? S_IN : S_PURPLE,
    transition:'all 0.2s',
  });

  return (
    <div style={{ width:'100%', padding: mob ? '20px 14px 80px' : '32px 36px', background:BG, minHeight:'100vh', boxSizing:'border-box' }}>
      <style>{`
        @keyframes nm-up { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin  { to{transform:rotate(360deg)} }
        .nm-inp:focus { box-shadow: ${S_IN}, 0 0 0 2px ${PURPLE}44 !important; }
      `}</style>

      {/* ── Page header ── */}
      <div style={{ marginBottom: mob ? '18px' : '32px', animation:'nm-up 0.4s ease-out both' }}>
        <div style={{ display:'flex', alignItems: mob ? 'center' : 'flex-end', gap: mob ? '10px' : '16px' }}>
          <div style={{ width: mob ? '40px' : '52px', height: mob ? '40px' : '52px', borderRadius:'16px', background:BG, boxShadow:S_UP,
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </div>
          <div style={{ display:'flex', alignItems: mob ? 'flex-start' : 'baseline', flexDirection: mob ? 'column' : 'row', gap: mob ? '2px' : '12px' }}>
            <h1 style={{ fontSize: mob ? '20px' : '26px', fontWeight:'800', color:'#0f172a', margin:0,
              letterSpacing:'-0.5px', fontFamily:'Nasalization, sans-serif', lineHeight:1 }}>Settings</h1>
            {!mob && <p style={{ fontSize:'13px', color:'#94a3b8', margin:0, fontWeight:'500' }}>
              Manage your profile, preferences, and account settings
            </p>}
          </div>
        </div>
      </div>

      {/* ── 2-column grid (1-col on mobile) ── */}
      <div style={{ display:'grid', gridTemplateColumns: mob ? '1fr' : '1.5fr 1fr', gap:'24px', alignItems:'stretch',
        animation:'nm-up 0.4s ease-out 0.06s both' }}>

        {/* ════ LEFT COLUMN ════ */}
        <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>

          {/* Banner + Avatar card */}
          <div style={{ background:BG, borderRadius:'22px', boxShadow:S_UP, overflow:'hidden' }}>
            {/* Banner */}
            <div
              onClick={() => document.getElementById('banner-input').click()}
              style={{ position:'relative', width:'100%', height:'180px', background:'#d1d5db', cursor:'pointer' }}
              onMouseEnter={e => e.currentTarget.querySelector('.banner-overlay').style.opacity='1'}
              onMouseLeave={e => e.currentTarget.querySelector('.banner-overlay').style.opacity='0'}>
              <Image src={bannerPreview} alt="Banner" fill style={{ objectFit:'cover' }} priority />
              <div className="banner-overlay" style={{
                position:'absolute', inset:0, background:'rgba(0,0,0,0.35)',
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                gap:'6px', opacity:0, transition:'opacity 0.2s', zIndex:10
              }}>
                <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                  <circle cx="12" cy="13" r="3" stroke="#fff" strokeWidth="2"/>
                </svg>
                <span style={{ color:'#fff', fontSize:'12px', fontWeight:'700', letterSpacing:'0.3px' }}>Change Banner</span>
              </div>
              <input id="banner-input" type="file" accept="image/*" onChange={handleBannerChange} style={{ display:'none' }} />
            </div>
            {/* Avatar row */}
            <div style={{ position:'relative', padding:'0 24px', height:'24px' }}>
              {/* Avatar - absolutely overlaps the banner */}
              <div
                onClick={() => document.getElementById('avatar-input').click()}
                style={{ position:'absolute', top:'-44px', left:'24px',
                  width:'88px', height:'88px', borderRadius:'50%', overflow:'hidden', flexShrink:0,
                  boxShadow:`0 0 0 4px ${BG}, ${S_UP}`, background:'#d1d5db', cursor:'pointer' }}
                onMouseEnter={e => e.currentTarget.querySelector('.avatar-overlay').style.opacity='1'}
                onMouseLeave={e => e.currentTarget.querySelector('.avatar-overlay').style.opacity='0'}>
                <Image src={avatarPreview} alt="Profile" width={88} height={88}
                  style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                <div className="avatar-overlay" style={{
                  position:'absolute', inset:0, background:'rgba(0,0,0,0.45)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  opacity:0, transition:'opacity 0.2s', zIndex:10, borderRadius:'50%'
                }}>
                  <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                    <circle cx="12" cy="13" r="3" stroke="#fff" strokeWidth="2"/>
                  </svg>
                </div>
                <input id="avatar-input" type="file" accept="image/*" onChange={handleAvatarChange} style={{ display:'none' }} />
              </div>
            </div>
            {/* Name + tier row */}
            <div style={{
              padding: mob ? '0 16px 20px 120px' : '0 24px 20px',
              display:'flex',
              alignItems: mob ? 'flex-start' : 'center',
              flexDirection: mob ? 'column' : 'row',
              gap: mob ? '6px' : '16px',
              minWidth: 0,
            }}>
              {/* Desktop-only spacer to push content past the avatar */}
              {!mob && <div style={{ width:'88px', flexShrink:0 }} />}

              {/* Name */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:'16px', fontWeight:'800', color:'#0f172a',
                  whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                  {formData.first_name || formData.last_name
                    ? `${formData.first_name} ${formData.last_name}`.trim()
                    : 'Your Name'}
                </div>
              </div>

              {/* Tier pill — rank removed */}
              <div style={{ display:'flex', alignItems:'center', gap:'8px', flexShrink:0, marginLeft: mob ? 0 : 'auto' }}>
                {(() => {
                  const tier = userData?.tier || 'DAG_SOLDIER';
                  const isSoldier = tier !== 'DAG_LIEUTENANT';
                  const tierLabel = isSoldier ? 'DAG SOLDIER' : 'DAG LIEUTENANT';
                  const tierBadge = isSoldier ? '/images/badges/dag-soldier.svg' : '/images/badges/dag-lieutenant.svg';
                  return (
                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:BG,
                        boxShadow:S_UP, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <img src={tierBadge} alt={tierLabel} style={{ width:'22px', height:'22px', objectFit:'contain' }} />
                      </div>
                      <div style={{ padding:'5px 13px', borderRadius:'20px', background:BG, boxShadow:S_IN,
                        fontSize:'10px', fontWeight:'800', color:'#475569',
                        textTransform:'uppercase', letterSpacing:'0.5px' }}>
                        {tierLabel}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Profile Information card */}
          <div style={{ background:BG, borderRadius:'22px', boxShadow:S_UP, padding:'24px', flex:1, display:'flex', flexDirection:'column' }}>
            {/* Card header */}
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'22px' }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'11px', background:BG, boxShadow:S_IN,
                display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <span style={{ fontSize:'15px', fontWeight:'800', color:'#0f172a' }}>Profile Information</span>
            </div>

            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px', flex:1 }}>
              {/* Name row */}
              <div style={{ display:'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap:'14px' }}>
                <div>
                  <label style={lbl}>First Name</label>
                  <input className="nm-inp" type="text" name="first_name" value={formData.first_name}
                    onChange={handleInputChange} required style={nmInput()} />
                </div>
                <div>
                  <label style={lbl}>Last Name</label>
                  <input className="nm-inp" type="text" name="last_name" value={formData.last_name}
                    onChange={handleInputChange} required style={nmInput()} />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={lbl}>Email Address</label>
                <input className="nm-inp" type="email" name="user_provided_email"
                  value={formData.user_provided_email} onChange={handleInputChange}
                  required style={nmInput()} />
              </div>

              {/* WhatsApp */}
              <div>
                <label style={lbl}>WhatsApp Number</label>
                <div style={{ display:'flex', gap:'10px' }}>
                  <input className="nm-inp" type="text" name="country_code" value={formData.country_code}
                    onChange={handleInputChange} style={nmInput({ width:'90px', flexShrink:0 })} />
                  <input className="nm-inp" type="tel" name="whatsapp_number" value={formData.whatsapp_number}
                    onChange={handleInputChange} placeholder="Phone number" required style={nmInput({ flex:1, width:'auto' })} />
                </div>
              </div>

              {/* Skill */}
              <div>
                <label style={lbl}>Skill / Occupation</label>
                <input className="nm-inp" type="text" name="skill_occupation" value={formData.skill_occupation}
                  onChange={handleInputChange} placeholder="e.g., Full Stack Developer" style={nmInput()} />
              </div>

              {/* Bio */}
              <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
                <label style={lbl}>Bio</label>
                <textarea className="nm-inp" name="bio" value={formData.bio} onChange={handleInputChange}
                  placeholder="Tell us about yourself…"
                  style={nmInput({ resize:'none', lineHeight:1.65, flex:1 })} />
              </div>

              <button type="submit" disabled={saving} style={saveBtn(saving)}
                onMouseEnter={e => { if(!saving){ e.currentTarget.style.background='#4f46e5'; } }}
                onMouseLeave={e => { if(!saving){ e.currentTarget.style.background=PURPLE; } }}>
                {saving
                  ? <><div style={{ width:'14px', height:'14px', border:'2px solid rgba(255,255,255,0.3)',
                      borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} /> Updating…</>
                  : <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Update Profile
                    </>
                }
              </button>
            </form>
          </div>
        </div>

        {/* ════ RIGHT COLUMN ════ */}
        <div style={{ display:'flex', flexDirection:'column', gap:'24px', minHeight:0 }}>

          {/* Social Links card */}
          <div style={{ background:BG, borderRadius:'22px', boxShadow:S_UP, padding:'24px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'22px' }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'11px', background:BG, boxShadow:S_IN,
                display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
              </div>
              <span style={{ fontSize:'15px', fontWeight:'800', color:'#0f172a' }}>Social Links</span>
            </div>
            <form onSubmit={handleSocialSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
              <div style={{ display:'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap:'14px' }}>
                {[
                  { name:'facebook',  label:'Facebook',  placeholder:'facebook.com/username' },
                  { name:'x',         label:'X',         placeholder:'x.com/username' },
                  { name:'linkedin',  label:'LinkedIn',  placeholder:'linkedin.com/in/username' },
                  { name:'instagram', label:'Instagram', placeholder:'instagram.com/username' },
                  { name:'github',    label:'GitHub',    placeholder:'github.com/username' },
                  { name:'website',   label:'Website',   placeholder:'yourwebsite.com' },
                ].map(s => (
                  <div key={s.name}>
                    <label style={lbl}>{s.label}</label>
                    <input className="nm-inp" type="url" name={s.name} value={socialLinks[s.name]}
                      onChange={handleSocialChange} placeholder={s.placeholder} style={nmInput()} />
                  </div>
                ))}
              </div>
              <button type="submit" disabled={saving} style={{ ...saveBtn(saving), marginTop:'4px' }}
                onMouseEnter={e => { if(!saving){ e.currentTarget.style.background='#4f46e5'; } }}
                onMouseLeave={e => { if(!saving){ e.currentTarget.style.background=PURPLE; } }}>
                {saving
                  ? <><div style={{ width:'14px', height:'14px', border:'2px solid rgba(255,255,255,0.3)',
                      borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} /> Updating…</>
                  : <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Update Social Links
                    </>
                }
              </button>
            </form>
          </div>

          {/* Wallet Address card */}
          <div style={{ background:BG, borderRadius:'22px', boxShadow:S_UP, padding:'24px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'22px' }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'11px', background:BG, boxShadow:S_IN,
                display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
                </svg>
              </div>
              <span style={{ fontSize:'15px', fontWeight:'800', color:'#0f172a' }}>Wallet Address</span>
            </div>
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
              <div>
                <label style={lbl}>DAGCHAIN Wallet <span style={{ color:'#94a3b8', fontWeight:'500', textTransform:'none', letterSpacing:0, fontSize:'11px' }}>(Optional)</span></label>
                <input className="nm-inp" type="text" name="wallet_address" value={formData.wallet_address}
                  onChange={handleInputChange} placeholder="0x…"
                  pattern="^0x[a-fA-F0-9]{40}$" title="Valid Ethereum wallet address (0x...)"
                  style={nmInput({ fontFamily:'monospace', letterSpacing:'0.5px' })} />
                <div style={{ fontSize:'11px', color:'#94a3b8', marginTop:'7px', paddingLeft:'2px' }}>
                  Connect your DAGCHAIN wallet to enable blockchain features
                </div>
              </div>
              <button type="submit" disabled={saving} style={{ ...saveBtn(saving), alignSelf:'flex-start' }}
                onMouseEnter={e => { if(!saving){ e.currentTarget.style.background='#4f46e5'; } }}
                onMouseLeave={e => { if(!saving){ e.currentTarget.style.background=PURPLE; } }}>
                {saving
                  ? <><div style={{ width:'14px', height:'14px', border:'2px solid rgba(255,255,255,0.3)',
                      borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} /> Updating…</>
                  : <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Update Wallet
                    </>
                }
              </button>
            </form>
          </div>

          {/* ── Referral Code card (inline in right column) ── */}
          <div style={{ background:BG, borderRadius:'22px', boxShadow:S_UP, overflow:'hidden', flex:1 }}>
            <div style={{ padding:'18px 24px', borderBottom:'1px solid rgba(0,0,0,0.05)',
              display:'flex', alignItems:'center', gap:'12px' }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'11px', background:BG, boxShadow:S_IN,
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize:'15px', fontWeight:'800', color:'#0f172a' }}>Upline Referral Code</div>
                <div style={{ fontSize:'12px', color:'#94a3b8', marginTop:'1px' }}>Link yourself to the person who invited you</div>
              </div>
            </div>
            <div style={{ padding:'20px 24px' }}>
              {!referralChecked ? (
                <p style={{ fontSize:'13px', color:'#94a3b8', margin:0 }}>Loading…</p>
              ) : existingReferrer ? (
                <div style={{ display:'flex', alignItems:'center', gap:'12px', padding:'14px 16px',
                  background:BG, borderRadius:'14px', boxShadow:S_IN }}>
                  <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:BG, boxShadow:S_UP,
                    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize:'13px', fontWeight:'800', color:'#0f172a' }}>Referred by {existingReferrer.name}</div>
                    <div style={{ fontSize:'11px', color:'#94a3b8', marginTop:'2px' }}>Referral code applied. This cannot be changed.</div>
                  </div>
                </div>
              ) : (
                <>
                  <p style={{ fontSize:'13px', color:'#64748b', marginBottom:'14px', marginTop:0 }}>
                    Not applied yet. Enter one below - this can only be done once.
                  </p>
                  <div style={{ display:'flex', gap:'10px' }}>
                    <input className="nm-inp" type="text" value={referralInput}
                      onChange={e => { setReferralInput(e.target.value.toUpperCase()); setReferralMsg(null); }}
                      placeholder="Referral code" maxLength={20}
                      disabled={referralApplying}
                      style={nmInput({ flex:1, width:'auto', fontFamily:'monospace', letterSpacing:'2px', textTransform:'uppercase' })} />
                    <button type="button"
                      disabled={referralApplying || !referralInput.trim()}
                      onClick={async () => {
                        if (!referralInput.trim()) return;
                        setReferralApplying(true); setReferralMsg(null);
                        try {
                          const res = await fetch('/api/referral/apply-code', {
                            method:'POST', headers:{'Content-Type':'application/json'},
                            body: JSON.stringify({ userId: userData?.id, referralCode: referralInput.trim() }),
                          });
                          const d = await res.json();
                          if (res.ok && d.success) { setExistingReferrer(d.referrer); setReferralMsg({ type:'success', text:d.message }); }
                          else { setReferralMsg({ type:'error', text:d.error||'Failed to apply code.' }); }
                        } catch { setReferralMsg({ type:'error', text:'Something went wrong. Please try again.' }); }
                        finally { setReferralApplying(false); }
                      }}
                      style={saveBtn(referralApplying || !referralInput.trim())}
                      onMouseEnter={e => { if(!referralApplying && referralInput.trim()){ e.currentTarget.style.background='#4f46e5'; } }}
                      onMouseLeave={e => { if(!referralApplying && referralInput.trim()){ e.currentTarget.style.background=PURPLE; } }}>
                      {referralApplying ? 'Applying…' : 'Apply'}
                    </button>
                  </div>
                  {referralMsg && (
                    <div style={{ marginTop:'12px', padding:'11px 14px', borderRadius:'13px', background:BG,
                      boxShadow: referralMsg.type==='success'
                        ? '4px 4px 10px rgba(16,185,129,0.18), -3px -3px 8px rgba(255,255,255,0.9)'
                        : '4px 4px 10px rgba(239,68,68,0.18), -3px -3px 8px rgba(255,255,255,0.9)',
                      color: referralMsg.type==='success' ? '#059669' : '#dc2626',
                      fontSize:'13px', fontWeight:'700' }}>
                      {referralMsg.text}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ════ DGCC TRANSFER ════ */}
      {(() => {
        const canTransfer = !!transferDest && Number(transferAmt) > 0 && Number(transferAmt) <= dgccBalance && dgccBalance > 0;
        const handleDgccTransfer = async () => {
          if (!canTransfer || transferring) return;
          setTransferring(true); setTransferMsg(null);
          try {
            const userEmail = userData?.email || (() => { try { return JSON.parse(localStorage.getItem('dagarmy_user') || '{}').email; } catch { return null; } })();
            const res = await fetch('/api/rewards/dgcc/transfer', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user_email: userEmail, destination: transferDest, amount: Number(transferAmt) }),
            });
            const data = await res.json();
            if (data.success) {
              setDgccBalance(b => b - Number(transferAmt));
              setTransferMsg({ type:'success', text:`✓ ${transferAmt} DGCC sent to ${transferDest === 'daggpt' ? 'DAGGPT' : 'DAGChain'} successfully!` });
              setTimeout(() => { setTransferMsg(null); setTransferDest(null); setTransferAmt(1); }, 4000);
            } else {
              setTransferMsg({ type:'error', text: data.error || 'Transfer failed. Please try again.' });
            }
          } catch { setTransferMsg({ type:'error', text:'Network error. Please try again.' }); }
          finally { setTransferring(false); }
        };
        return (
          <div style={{ marginTop:'28px', background:BG, borderRadius:'22px', boxShadow:S_UP, overflow:'hidden',
            animation:'nm-up 0.4s ease-out 0.1s both' }}>
            {/* Header */}
            <div style={{ padding:'20px 26px', borderBottom:'1px solid rgba(0,0,0,0.05)',
              display:'flex', alignItems:'center', gap:'14px' }}>
              <div style={{ width:'40px', height:'40px', borderRadius:'13px', background:BG, boxShadow:S_IN,
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize:'15px', fontWeight:'800', color:'#0f172a' }}>Transfer DGCC</div>
                <div style={{ fontSize:'12px', color:'#94a3b8', marginTop:'2px' }}>Send your DGCC coins to DAGGPT or DAGChain. 1 DGCC = $1.</div>
              </div>
            </div>

            <div style={{ padding: mob ? '18px 16px' : '24px 26px', display:'flex', flexDirection:'column', gap:'20px' }}>

              {/* Balance display */}
              <div style={{ background:BG, borderRadius:'16px', boxShadow:S_IN, padding:'16px 20px',
                display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontSize:'11px', fontWeight:'700', color:'#64748b', textTransform:'uppercase', letterSpacing:'0.6px' }}>Available Balance</span>
                <span style={{ fontSize:'22px', fontWeight:'900', color: dgccBalance > 0 ? PURPLE : '#94a3b8', letterSpacing:'-1px' }}>
                  {dgccBalance > 0 ? dgccBalance.toLocaleString() : '0'}
                  <span style={{ fontSize:'12px', fontWeight:'600', color:PURPLE, marginLeft:'5px' }}>DGCC</span>
                </span>
              </div>

              {/* Destination picker */}
              <div>
                <label style={{ fontSize:'10px', fontWeight:'800', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:'10px', display:'block' }}>Send To</label>
                <div style={{ display:'grid', gridTemplateColumns: mob ? '1fr 1fr' : '1fr 1fr', gap:'10px' }}>
                  {[
                    { key:'daggpt',   label:'DAGGPT',   icon:'🤖', desc:'AI generation credits', accent:'#6366f1' },
                    { key:'dagchain', label:'DAGChain', icon:'⛓️', desc:'Blockchain wallet',      accent:'#10b981' },
                  ].map(opt => (
                    <button key={opt.key} type="button"
                      onClick={() => { if (dgccBalance > 0) setTransferDest(opt.key); }}
                      style={{ padding:'14px 12px', borderRadius:'14px',
                        border:`2px solid ${transferDest === opt.key ? opt.accent : 'transparent'}`,
                        background:BG, cursor: dgccBalance > 0 ? 'pointer' : 'not-allowed',
                        textAlign:'left', transition:'all 0.2s', opacity: dgccBalance > 0 ? 1 : 0.5,
                        boxShadow: transferDest === opt.key ? S_IN : S_UP }}>
                      <div style={{ fontSize:'20px', marginBottom:'4px' }}>{opt.icon}</div>
                      <div style={{ fontSize:'12px', fontWeight:'800', color: transferDest === opt.key ? opt.accent : '#0f172a' }}>{opt.label}</div>
                      <div style={{ fontSize:'10px', color:'#94a3b8', marginTop:'2px' }}>{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount input */}
              <div>
                <label style={{ fontSize:'10px', fontWeight:'800', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:'10px', display:'block' }}>Amount (DGCC)</label>
                <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <button type="button" onClick={() => setTransferAmt(a => Math.max(1, a - 1))}
                    style={{ width:'38px', height:'38px', borderRadius:'10px', border:'none', background:BG, boxShadow:S_UP,
                      fontSize:'18px', fontWeight:'700', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:PURPLE, flexShrink:0 }}>−</button>
                  <input type="number" min="1" max={dgccBalance} value={transferAmt}
                    onChange={e => setTransferAmt(Math.max(1, Math.min(dgccBalance, parseInt(e.target.value)||1)))}
                    style={{ flex:1, padding:'10px', border:'none', borderRadius:'10px', fontSize:'18px', fontWeight:'900',
                      color:'#0f172a', textAlign:'center', outline:'none', background:BG, boxShadow:S_IN, fontFamily:'inherit' }} />
                  <button type="button" onClick={() => setTransferAmt(a => Math.min(dgccBalance, a + 1))}
                    style={{ width:'38px', height:'38px', borderRadius:'10px', border:'none', background:BG, boxShadow:S_UP,
                      fontSize:'18px', fontWeight:'700', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:PURPLE, flexShrink:0 }}>+</button>
                  <button type="button" onClick={() => setTransferAmt(dgccBalance)}
                    style={{ padding:'10px 14px', borderRadius:'10px', border:'none', background:BG, boxShadow:S_UP,
                      cursor:'pointer', fontSize:'11px', fontWeight:'800', color:PURPLE, flexShrink:0 }}>MAX</button>
                </div>
                {Number(transferAmt) > dgccBalance && (
                  <div style={{ fontSize:'11px', color:'#ef4444', fontWeight:'600', marginTop:'6px' }}>Exceeds balance ({dgccBalance} DGCC)</div>
                )}
              </div>

              {/* Feedback */}
              {transferMsg && (
                <div style={{ padding:'12px 16px', borderRadius:'13px', background:BG,
                  boxShadow: transferMsg.type==='success'
                    ? '4px 4px 10px rgba(16,185,129,0.18), -3px -3px 8px rgba(255,255,255,0.9)'
                    : '4px 4px 10px rgba(239,68,68,0.18), -3px -3px 8px rgba(255,255,255,0.9)',
                  color: transferMsg.type==='success' ? '#059669' : '#dc2626',
                  fontSize:'13px', fontWeight:'600' }}>{transferMsg.text}</div>
              )}

              {/* Transfer button */}
              <button type="button" onClick={handleDgccTransfer} disabled={!canTransfer || transferring}
                style={{ width:'100%', padding:'14px', borderRadius:'16px', border:'none',
                  background: canTransfer && !transferring ? PURPLE : BG,
                  color: canTransfer && !transferring ? '#fff' : '#94a3b8',
                  fontSize:'14px', fontWeight:'700',
                  cursor: canTransfer && !transferring ? 'pointer' : 'not-allowed',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                  boxShadow: canTransfer && !transferring ? S_PURPLE : S_IN,
                  transition:'all 0.2s' }}>
                {transferring
                  ? <><div style={{ width:'16px', height:'16px', border:'2px solid rgba(255,255,255,0.3)',
                      borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} /> Sending…</>
                  : <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
                    </svg> Send DGCC</>
                }
              </button>
            </div>
          </div>
        );
      })()}

    </div>
  );
}

