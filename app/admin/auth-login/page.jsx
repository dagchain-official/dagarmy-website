"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AdminAuthLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attemptsRemaining, setAttemptsRemaining] = useState(null);

  // Check if already logged in (only on mount)
  useEffect(() => {
    const checkSession = async () => {
      // Check localStorage first (faster)
      const isAuthenticated = localStorage.getItem('dagarmy_authenticated');
      const role = localStorage.getItem('dagarmy_role');
      
      if (isAuthenticated === 'true' && role === 'admin') {
        router.push('/admin/dashboard');
        return;
      }

      // Then check session cookie
      try {
        const response = await fetch('/api/admin/auth/verify-session');
        if (response.ok) {
          router.push('/admin/dashboard');
        }
      } catch (error) {
        // Not logged in, stay on login page
      }
    };
    
    // Only run once on mount
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAttemptsRemaining(null);
    setLoading(true);

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      console.log('Login response:', { status: response.status, data });

      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem('admin_user', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.full_name,
          is_admin: data.user.is_admin,
          is_master_admin: data.user.is_master_admin,
          role: data.user.role
        }));

        // Set authentication flags for AdminLayout compatibility
        localStorage.setItem('dagarmy_role', 'admin');
        localStorage.setItem('dagarmy_authenticated', 'true');
        localStorage.setItem('dagarmy_user', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.full_name,
          is_admin: data.user.is_admin,
          is_master_admin: data.user.is_master_admin
        }));

        // Set cookies for compatibility
        document.cookie = 'dagarmy_role=admin; path=/; max-age=86400';
        document.cookie = 'dagarmy_authenticated=true; path=/; max-age=86400';

        // Check if password change is required
        if (data.force_password_change) {
          router.push('/admin/change-password?force=true');
        } else {
          router.push('/admin/dashboard');
        }
      } else {
        console.error('Login failed:', data);
        setError(data.error || data.details || 'Login failed');
        if (data.attemptsRemaining !== undefined) {
          setAttemptsRemaining(data.attemptsRemaining);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '450px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '40px 30px',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <Shield size={40} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
            Admin Portal
          </h1>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>
            Secure credential-based authentication
          </p>
        </div>

        {/* Form */}
        <div style={{ padding: '40px 30px' }}>
          {error && (
            <div style={{
              background: '#fee',
              border: '1px solid #fcc',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <AlertCircle size={20} color="#c00" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{ color: '#c00', fontSize: '14px', margin: 0 }}>{error}</p>
                {attemptsRemaining !== null && attemptsRemaining > 0 && (
                  <p style={{ color: '#c00', fontSize: '12px', margin: '4px 0 0', opacity: 0.8 }}>
                    {attemptsRemaining} attempt{attemptsRemaining !== 1 ? 's' : ''} remaining
                  </p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={20} style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dagchain.network"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 48px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={20} style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 48px 12px 48px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9ca3af',
                    padding: 0
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Info */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, textAlign: 'center' }}>
              🔒 This is a secure admin portal. Only authorized personnel with valid credentials can access this area.
            </p>
          </div>

          {/* Student Login Link */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              Not an admin?{' '}
              <a
                href="/"
                style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                Go to Student Portal
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
