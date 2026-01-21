"use client";
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout>
      <div>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
          Analytics & Insights
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '32px' }}>
          Track platform performance and user engagement
        </p>

        {/* Charts Placeholder */}
        <div className="row g-4">
          <div className="col-md-8">
            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📈</div>
                <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>User Growth Chart</div>
                <div style={{ fontSize: '14px' }}>Chart visualization will be implemented here</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
                <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Top Courses</div>
                <div style={{ fontSize: '14px' }}>Statistics coming soon</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
