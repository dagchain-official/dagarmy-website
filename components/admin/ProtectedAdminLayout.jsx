"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, AlertCircle } from 'lucide-react';
import { isMasterAdmin } from '@/lib/auth-utils';

export default function ProtectedAdminLayout({ children, requireMasterAdmin = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      // Get current user from your auth system
      // This is a placeholder - replace with your actual auth check
      const response = await fetch('/api/auth/session');
      const data = await response.json();

      if (!data.user || !data.user.email) {
        router.push('/login');
        return;
      }

      const email = data.user.email;
      setUserEmail(email);

      // Check if user is master admin
      const isMaster = isMasterAdmin(email);

      if (requireMasterAdmin && !isMaster) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      // Check if user has any admin access
      if (isMaster || data.user.is_admin) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error checking access:', error);
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #f1f5f9',
            borderTop: '4px solid #1f2937',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#64748b' }}>
            Verifying access...
          </div>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f8fafc',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '500px',
          width: '100%',
          background: '#fff',
          borderRadius: '24px',
          padding: '48px',
          border: '2px solid #e2e8f0',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <AlertCircle size={40} style={{ color: '#fff' }} />
          </div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '12px'
          }}>
            Access Denied
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            lineHeight: 1.6,
            marginBottom: '24px'
          }}>
            {requireMasterAdmin 
              ? 'This section is restricted to master administrators only. Only authorized email addresses can access this area.'
              : 'You do not have permission to access the admin panel. Please contact an administrator if you believe this is an error.'
            }
          </p>
          {userEmail && (
            <div style={{
              padding: '12px 16px',
              background: '#f8fafc',
              borderRadius: '10px',
              fontSize: '13px',
              color: '#64748b',
              marginBottom: '24px'
            }}>
              Logged in as: <strong>{userEmail}</strong>
            </div>
          )}
          <button
            onClick={() => router.push('/')}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
              color: '#fff',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}>
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return children;
}
