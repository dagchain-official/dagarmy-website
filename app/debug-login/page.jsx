"use client";
import { useState, useEffect } from 'react';

export default function DebugLoginPage() {
  const [debugInfo, setDebugInfo] = useState(null);
  const [extractionInfo, setExtractionInfo] = useState(null);

  useEffect(() => {
    // Load debug info from localStorage
    const debug = localStorage.getItem('dagarmy_login_debug');
    const extraction = localStorage.getItem('dagarmy_email_extraction');
    
    if (debug) {
      setDebugInfo(JSON.parse(debug));
    }
    if (extraction) {
      setExtractionInfo(JSON.parse(extraction));
    }
  }, []);

  const clearDebug = () => {
    localStorage.removeItem('dagarmy_login_debug');
    localStorage.removeItem('dagarmy_email_extraction');
    setDebugInfo(null);
    setExtractionInfo(null);
    alert('Debug info cleared');
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '24px' }}>
        🔍 Login Debug Information
      </h1>
      
      <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '32px' }}>
        This page shows what data was captured during your last login. This helps us debug why email addresses aren't being saved.
      </p>

      <button
        onClick={clearDebug}
        style={{
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          background: '#ef4444',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '24px'
        }}
      >
        Clear Debug Data
      </button>

      {/* Email Extraction Result */}
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        border: '2px solid #e5e7eb'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: '#111827' }}>
          📧 Email Extraction Result
        </h2>
        {extractionInfo ? (
          <div>
            <p style={{ marginBottom: '8px' }}>
              <strong>Timestamp:</strong> {new Date(extractionInfo.timestamp).toLocaleString()}
            </p>
            <p style={{ marginBottom: '8px', color: extractionInfo.extractedEmail ? '#10b981' : '#ef4444', fontWeight: '600' }}>
              <strong>Email:</strong> {extractionInfo.extractedEmail || '❌ NOT FOUND'}
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong>Name:</strong> {extractionInfo.extractedName || 'Not found'}
            </p>
            <p>
              <strong>Avatar:</strong> {extractionInfo.extractedAvatar || 'Not found'}
            </p>
          </div>
        ) : (
          <p style={{ color: '#9ca3af' }}>No extraction data available. Log in to capture data.</p>
        )}
      </div>

      {/* Full Debug Info */}
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        border: '2px solid #e5e7eb'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: '#111827' }}>
          📦 Full Debug Information
        </h2>
        {debugInfo ? (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ marginBottom: '8px' }}>
                <strong>Timestamp:</strong> {new Date(debugInfo.timestamp).toLocaleString()}
              </p>
              <p style={{ marginBottom: '8px' }}>
                <strong>Has embeddedWalletInfo:</strong> {debugInfo.hasEmbeddedWalletInfo ? '✅ Yes' : '❌ No'}
              </p>
              <p style={{ marginBottom: '8px' }}>
                <strong>Wallet Address:</strong> {debugInfo.address}
              </p>
              <p style={{ marginBottom: '8px' }}>
                <strong>CAIP Address:</strong> {debugInfo.caipAddress || 'Not available'}
              </p>
            </div>

            {debugInfo.embeddedWalletInfo && (
              <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  embeddedWalletInfo Object:
                </h3>
                <div style={{ marginBottom: '12px' }}>
                  <strong>Available Keys:</strong> {debugInfo.embeddedWalletInfo.allKeys.join(', ')}
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <strong>Auth Provider:</strong> {debugInfo.embeddedWalletInfo.authProvider || 'Not specified'}
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <strong>Direct email property:</strong> {debugInfo.embeddedWalletInfo.email || 'Not found'}
                </div>
                {debugInfo.embeddedWalletInfo.user && (
                  <div>
                    <strong>User object:</strong>
                    <pre style={{
                      background: '#f9fafb',
                      padding: '16px',
                      borderRadius: '8px',
                      overflow: 'auto',
                      fontSize: '13px',
                      marginTop: '8px'
                    }}>
                      {JSON.stringify(debugInfo.embeddedWalletInfo.user, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {debugInfo.appKitState && (
              <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  AppKit State:
                </h3>
                <pre style={{
                  background: '#f9fafb',
                  padding: '16px',
                  borderRadius: '8px',
                  overflow: 'auto',
                  fontSize: '13px'
                }}>
                  {JSON.stringify(debugInfo.appKitState, null, 2)}
                </pre>
              </div>
            )}

            <div style={{ marginTop: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                Full Raw Data:
              </h3>
              <pre style={{
                background: '#f9fafb',
                padding: '16px',
                borderRadius: '8px',
                overflow: 'auto',
                fontSize: '12px',
                maxHeight: '400px'
              }}>
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <p style={{ color: '#9ca3af' }}>No debug data available. Log in to capture data.</p>
        )}
      </div>

      <div style={{
        marginTop: '32px',
        padding: '16px',
        background: '#fef3c7',
        borderRadius: '8px',
        border: '1px solid #fbbf24'
      }}>
        <p style={{ fontSize: '14px', color: '#92400e' }}>
          <strong>Instructions:</strong> Log out, then log in again with email or Google. After login, come back to this page to see what data was captured.
        </p>
      </div>
    </div>
  );
}
