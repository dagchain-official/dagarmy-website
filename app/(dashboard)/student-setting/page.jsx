import DashboardNav2 from "@/components/dashboard/DashboardNav2";
import PageTitle2 from "@/components/dashboard/PageTitle2";
import Setttings from "@/components/dashboard/Setttings2";
import React from "react";

export const metadata = {
  title: "Settings || DAGARMY - Master AI, Blockchain & Data Visualization",
  description: "DAGARMY Student Settings - Manage your account and preferences.",
};

export default function StudentSettingPage() {
  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: '#f0f2f5' }}>
      <div style={{ width: '248px', flexShrink: 0, position: 'sticky', top: '0', height: '100vh', overflowY: 'auto', background: '#f0f2f5' }}>
        <DashboardNav2 />
      </div>
      <div style={{ flex: 1, background: '#f0f2f5' }}>
        <Setttings />
      </div>
    </div>
  );
}




