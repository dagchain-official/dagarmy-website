"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import CountryCodeDropdown from '@/components/common/CountryCodeDropdown';

export default function ProfileCompletion({ userAddress, socialEmail, onComplete, onClose }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    countryCode: '+91',
    whatsappNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Log what userAddress we received
  useEffect(() => {
    console.log('🔍 ProfileCompletion received userAddress:', userAddress);
  }, [userAddress]);

  // Prevent browser back button during profile completion
  const [isCompleting, setIsCompleting] = useState(false);
  
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Only show warning if form is not being submitted
      if (!isCompleting) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isCompleting]);

  const handleCancel = () => {
    // Disconnect wallet and close modal if user cancels
    if (typeof window !== 'undefined' && window.modal) {
      window.modal.close();
    }
    if (onClose) {
      onClose();
    }
    // Redirect to home page
    router.push('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return;
    }
    // Remove any non-digit characters for validation
    const digitsOnly = formData.whatsappNumber.replace(/\D/g, '');
    if (!formData.whatsappNumber.trim() || digitsOnly.length < 7 || digitsOnly.length > 15) {
      setError('Valid WhatsApp number is required (7-15 digits)');
      return;
    }

    setIsSubmitting(true);
    setIsCompleting(true); // Disable beforeunload warning

    const requestBody = {
      wallet_address: userAddress,
      email: socialEmail || null,
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      country_code: formData.countryCode,
      whatsapp_number: formData.whatsappNumber.trim(),
    };

    console.log('📤 Submitting profile completion:', requestBody);

    try {
      const response = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save profile');
      }

      console.log('✅ Profile completed:', data);
      
      // Remove beforeunload listener before redirecting
      window.onbeforeunload = null;
      
      // Call the onComplete callback
      if (onComplete) {
        onComplete(data.user);
      }
    } catch (err) {
      console.error('Error completing profile:', err);
      setError(err.message || 'Failed to save profile. Please try again.');
      setIsSubmitting(false);
      setIsCompleting(false); // Re-enable warning on error
    }
  };

  return (
    <div className="profile-completion-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div className="profile-completion-modal" style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        position: 'relative'
      }}>
        <button
          onClick={handleCancel}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#6b7280',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.color = '#1f2937';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#6b7280';
          }}
        >
          ×
        </button>
        <h2 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          marginBottom: '10px',
          color: '#1a1a1a'
        }}>
          Complete Your Profile
        </h2>
        <p style={{ 
          color: '#666', 
          marginBottom: '30px',
          fontSize: '14px'
        }}>
          Please provide your details to continue
        </p>

        {error && (
          <div style={{
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            color: '#c33',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#333',
              fontSize: '14px'
            }}>
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#1f2937'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#333',
              fontSize: '14px'
            }}>
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#1f2937'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#333',
              fontSize: '14px'
            }}>
              Country Code *
            </label>
            <CountryCodeDropdown
              value={formData.countryCode}
              onChange={(code) => setFormData(prev => ({ ...prev, countryCode: code }))}
              disabled={isSubmitting}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#333',
              fontSize: '14px'
            }}>
              WhatsApp Number *
            </label>
            <input
              type="tel"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleChange}
              placeholder="1234567890"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#1f2937'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: isSubmitting ? '#d1d5db' : '#1f2937',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              marginTop: '10px'
            }}
            onMouseEnter={(e) => !isSubmitting && (e.target.style.backgroundColor = '#111827')}
            onMouseLeave={(e) => !isSubmitting && (e.target.style.backgroundColor = '#1f2937')}
          >
            {isSubmitting ? 'Saving...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
