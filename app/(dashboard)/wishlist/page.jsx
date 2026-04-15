import PageTitle2 from "@/components/dashboard/PageTitle2";
import Wishlist from "@/components/dashboard/Wishlist2";
import React from "react";

export const metadata = {
  title: "Wishlist || DAGARMY - Master AI, Blockchain & Data Visualization",
  description: "DAGARMY Student Wishlist - Manage your favorite courses.",
};

export default function StudentWishlistPage() {
  return (
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
              Manage your favorite modules and lessons
            </p>
          </div>
        </div>
        {/* Wishlist Content */}
        <div style={{ padding: "40px" }}>
          <Wishlist />
        </div>
    </div>
  );
}




