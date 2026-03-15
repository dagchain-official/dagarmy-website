"use client";
export default function DashboardLayout({ children }) {
  return (
    <div style={{ paddingTop: 0, minHeight: '100vh', background: '#f0f2f5' }}>
      {children}
    </div>
  );
}
