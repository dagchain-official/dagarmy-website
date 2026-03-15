import DashboardNav2 from "@/components/dashboard/DashboardNav2";
import MyCourses from "@/components/dashboard/MyCourses2";
import PageTitle2 from "@/components/dashboard/PageTitle2";
import React from "react";

export const metadata = {
  title: "My Courses || DAGARMY - Master AI, Blockchain & Data Visualization",
  description: "DAGARMY Student My Courses - Track your enrolled courses in AI, Blockchain, and Data Visualization.",
};

export default function StudentMyCoursesPage() {
  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: '#f0f2f5' }}>
      <div style={{ width: '248px', flexShrink: 0, position: 'sticky', top: '0', height: '100vh', overflowY: 'auto', background: '#f0f2f5' }}>
        <DashboardNav2 />
      </div>
      <div style={{ flex: 1, background: '#f0f2f5' }}>
        <div style={{ padding: '40px' }}>
          <MyCourses />
        </div>
      </div>
    </div>
  );
}




