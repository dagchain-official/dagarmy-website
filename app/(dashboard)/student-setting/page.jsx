import DashboardNav2 from "@/components/dashboard/DashboardNav2";
import PageTitle2 from "@/components/dashboard/PageTitle2";
import Setttings from "@/components/dashboard/Setttings2";
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import React from "react";

export const metadata = {
  title: "Settings || DAGARMY - Master AI, Blockchain & Data Visualization",
  description: "DAGARMY Student Settings - Manage your account and preferences.",
};

export default function StudentSettingPage() {
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
              <div style={{ flex: 1 }}>
                <Setttings />
              </div>
            </div>
          </div>
        </div>
        <Footer1 />
      </div>
    </>
  );
}
