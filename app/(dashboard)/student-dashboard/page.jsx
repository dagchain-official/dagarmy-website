import Dashboard2 from "@/components/dashboard/Dashboard2";
import DashboardNav2 from "@/components/dashboard/DashboardNav2";
import PageTitle2 from "@/components/dashboard/PageTitle2";
import React from "react";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Student Dashboard || DAGARMY - Master AI, Blockchain & Data Visualization",
  description: "DAGARMY Student Dashboard - Track your progress in AI, Blockchain, and Data Visualization courses. Join the global army of Vibe Coders.",
};

export default function StudentDashboardPage() {
  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: '#f0f2f5' }}>
      <div style={{ width: '248px', flexShrink: 0, position: 'sticky', top: '0', height: '100vh', overflowY: 'auto', background: '#f0f2f5' }}>
        <DashboardNav2 />
      </div>
      <div style={{ flex: 1, minWidth: 0, background: '#f0f2f5' }}>
        <Dashboard2 />
      </div>
    </div>
  );
}









