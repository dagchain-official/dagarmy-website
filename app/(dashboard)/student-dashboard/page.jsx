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
        <PageTitle2 />
        <div className="main-content pt-0">
          <div className="page-inner tf-spacing-1">
            <div className="tf-container">
              <div className="row">
                <div className="col-xl-3 col-lg-12">
                  <div className="dashboard_navigationbar">
                    <div className="dropbtn">
                      <i className="icon-home" /> Dashboard Navigation
                    </div>
                    <div className="instructors-dashboard student-dashboard-sidebar">
                      <div className="dashboard-title">
                        STUDENT DASHBOARD
                        <DashboardNav2 />
                      </div>
                    </div>
                  </div>
                </div>
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
