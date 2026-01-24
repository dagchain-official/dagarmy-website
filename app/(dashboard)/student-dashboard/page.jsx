import Dashboard2 from "@/components/dashboard/Dashboard2";
import DashboardNav2 from "@/components/dashboard/DashboardNav2";
import PageTitle2 from "@/components/dashboard/PageTitle2";
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import React from "react";

export const metadata = {
  title: "Student Dashboard || DAGARMY - Master AI, Blockchain & Data Visualization",
  description: "DAGARMY Student Dashboard - Track your progress in AI, Blockchain, and Data Visualization courses. Join the global army of Vibe Coders.",
};

export default function StudentDashboardPage() {
  return (
    <>
      <div id="wrapper">
        <Header2 />
        <div className="main-content pt-0">
          <div className="page-inner" style={{ padding: "0" }}>
            <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
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
              <div style={{ flex: 1, padding: "40px", background: "#f9fafb" }}>
                <Dashboard2 />
              </div>
            </div>
          </div>
        </div>
        <Footer1 />
      </div>
    </>
  );
}
