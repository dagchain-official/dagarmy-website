import DashboardNav2 from "@/components/dashboard/DashboardNav2";
import PageTitle2 from "@/components/dashboard/PageTitle2";
import Reviews from "@/components/dashboard/Reviews2";
import React from "react";

export const metadata = {
  title: "Reviews || DAGARMY - Master AI, Blockchain & Data Visualization",
  description: "DAGARMY Student Reviews - View and manage your course reviews.",
};

export default function StudentReviewsPage() {
  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: '#f0f2f5' }}>
      <div style={{ width: '248px', flexShrink: 0, position: 'sticky', top: '0', height: '100vh', overflowY: 'auto', background: '#f0f2f5' }}>
        <DashboardNav2 />
      </div>
      <div style={{ flex: 1, background: '#f0f2f5' }}>
        {/* Page Title Section */}
        <div style={{
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          padding: "60px 40px",
          borderBottom: "1px solid #e5e7eb"
        }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <h1 style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: "8px"
            }}>
              Student Dashboard
            </h1>
            <p style={{
              fontSize: "16px",
              color: "#cbd5e1",
              margin: 0
            }}>
              View and manage your course reviews
            </p>
          </div>
        </div>
        {/* Reviews Content */}
        <div style={{ padding: "40px" }}>
          <Reviews />
        </div>
      </div>
    </div>
  );
}




