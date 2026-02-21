import DashboardNav2 from "@/components/dashboard/DashboardNav2";
import MyCourses from "@/components/dashboard/MyCourses2";
import PageTitle2 from "@/components/dashboard/PageTitle2";
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import React from "react";

export const metadata = {
  title: "My Courses || DAGARMY - Master AI, Blockchain & Data Visualization",
  description: "DAGARMY Student My Courses - Track your enrolled courses in AI, Blockchain, and Data Visualization.",
};

export default function StudentMyCoursesPage() {
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
                padding: "24px 16px",
                position: "sticky",
                top: "0",
                height: "100vh",
                overflowY: "auto"
              }}>
                <DashboardNav2 />
              </div>
              
              {/* Main Content */}
              <div style={{ flex: 1, background: "#f9fafb" }}>
                {/* Courses Content */}
                <div style={{ padding: "40px" }}>
                  <MyCourses />
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
