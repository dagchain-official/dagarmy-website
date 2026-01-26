import DashboardNav2 from "@/components/dashboard/DashboardNav2";
import PageTitle2 from "@/components/dashboard/PageTitle2";
import Wishlist from "@/components/dashboard/Wishlist2";
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import React from "react";

export const metadata = {
  title: "Wishlist || DAGARMY - Master AI, Blockchain & Data Visualization",
  description: "DAGARMY Student Wishlist - Manage your favorite courses.",
};

export default function StudentWishlistPage() {
  return (
    <>
      <div id="wrapper">
        <Header2 />
        <div className="main-content pt-0">
          <div className="page-inner" style={{ padding: "0" }}>
            <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
              {/* Sidebar Navigation */}
              <div style={{ 
                width: "240px", 
                flexShrink: 0,
                background: "#1a1f36",
                padding: "32px 16px",
                position: "sticky",
                top: "0",
                height: "100vh",
                overflowY: "auto"
              }}>
                <DashboardNav2 />
              </div>
              
              {/* Main Content */}
              <div style={{ flex: 1, background: "#f9fafb" }}>
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
            </div>
          </div>
        </div>
        <Footer1 />
      </div>
    </>
  );
}
