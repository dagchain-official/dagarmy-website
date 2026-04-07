"use client";
import React, { useState } from 'react';

export default function WebinarInvitation() {
  const [mode, setMode] = useState('test');
  const [testEmail, setTestEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSend = async () => {
    setError('');
    setResult(null);

    if (mode === 'test' && !testEmail) {
      setError('Please enter a test email address');
      return;
    }

    if (mode === 'all') {
      const confirmed = window.confirm(
        'Are you sure you want to send webinar invitations to ALL users? This action cannot be undone.'
      );
      if (!confirmed) return;
    }

    setSending(true);

    try {
      const res = await fetch('/api/emails/webinar-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, testEmail: mode === 'test' ? testEmail : undefined }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data);
        if (mode === 'test') {
          setTestEmail('');
        }
      } else {
        setError(data.error || 'Failed to send emails');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '24px',
      background: '#fff',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
    }}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: '700',
        color: '#111827',
        marginBottom: '8px',
      }}>
        Webinar Invitation Email
      </h2>
      <p style={{
        fontSize: '14px',
        color: '#6b7280',
        marginBottom: '24px',
      }}>
        Send webinar invitation emails to all users or test with a single email first
      </p>

      {/* Mode Selection */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '8px',
        }}>
          Send Mode
        </label>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setMode('test')}
            style={{
              flex: 1,
              padding: '12px 20px',
              borderRadius: '8px',
              border: mode === 'test' ? '2px solid #4158f9' : '1px solid #d1d5db',
              background: mode === 'test' ? '#eff6ff' : '#fff',
              color: mode === 'test' ? '#4158f9' : '#6b7280',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            🧪 Test Mode
          </button>
          <button
            onClick={() => setMode('all')}
            style={{
              flex: 1,
              padding: '12px 20px',
              borderRadius: '8px',
              border: mode === 'all' ? '2px solid #4158f9' : '1px solid #d1d5db',
              background: mode === 'all' ? '#eff6ff' : '#fff',
              color: mode === 'all' ? '#4158f9' : '#6b7280',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            📧 Send to All Users
          </button>
        </div>
      </div>

      {/* Test Email Input */}
      {mode === 'test' && (
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px',
          }}>
            Test Email Address
          </label>
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="your-email@example.com"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>
      )}

      {/* Webinar Details Preview */}
      <div style={{
        background: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px',
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '12px',
        }}>
          📅 Webinar Details
        </h3>
        <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.8' }}>
          <div><strong>Platform:</strong> Zoom Webinar</div>
          <div><strong>Webinar ID:</strong> 827 8483 8030</div>
          <div><strong>Link:</strong> <a href="https://us05web.zoom.us/webinar/82784838030" target="_blank" rel="noopener noreferrer" style={{ color: '#4158f9' }}>Join Webinar</a></div>
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
            <strong>Timezones:</strong>
            <div style={{ marginTop: '6px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              <div>🇺🇸 USA (Pacific): 06:30 AM PDT</div>
              <div>🇺🇸 USA (Central): 08:30 AM CDT</div>
              <div>🇺🇸 USA (Eastern): 09:30 AM EST</div>
              <div>🇨🇦 Canada (Toronto): 09:30 AM EST</div>
              <div>🇬🇧 UK (UTC): 02:30 PM</div>
              <div>🇦🇪 UAE: 05:30 PM GST</div>
              <div>🇮🇳 India: 07:00 PM IST</div>
              <div>🇧🇩 Bangladesh: 07:30 PM BDT</div>
              <div>🇵🇰 Pakistan: 06:30 PM PKT</div>
            </div>
          </div>
        </div>
      </div>

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={sending || (mode === 'test' && !testEmail)}
        style={{
          width: '100%',
          padding: '14px 24px',
          borderRadius: '8px',
          border: 'none',
          background: sending ? '#9ca3af' : '#4158f9',
          color: '#fff',
          fontSize: '16px',
          fontWeight: '600',
          cursor: sending ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
        }}
      >
        {sending ? (
          mode === 'test' ? 'Sending Test Email...' : 'Sending to All Users...'
        ) : (
          mode === 'test' ? 'Send Test Email' : 'Send to All Users'
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          borderRadius: '8px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          fontSize: '14px',
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Success Message */}
      {result && (
        <div style={{
          marginTop: '16px',
          padding: '16px',
          borderRadius: '8px',
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
        }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#16a34a', marginBottom: '8px' }}>
            ✅ {result.message}
          </div>
          {result.mode === 'test' && (
            <div style={{ fontSize: '13px', color: '#15803d' }}>
              Sent to: {result.recipient}
            </div>
          )}
          {result.mode === 'all' && (
            <div style={{ fontSize: '13px', color: '#15803d' }}>
              <div>Total: {result.total}</div>
              <div>Sent: {result.sent}</div>
              {result.failed > 0 && <div>Failed: {result.failed}</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
