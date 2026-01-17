import DashboardNav2 from "@/components/dashboard/DashboardNav2";
import Orders from "@/components/dashboard/Orders2";
import PageTitle2 from "@/components/dashboard/PageTitle2";
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import React from "react";

export const metadata = {
  title: "Orders || DAGARMY - Master AI, Blockchain & Data Visualization",
  description: "DAGARMY Student Orders - View your course enrollment history.",
};

export default function StudentOrderPage() {
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
                    <div className="instructors-dashboard">
                      <div className="dashboard-title">
                        STUDENT DASHBOARD
                        <DashboardNav2 />
                      </div>
                    </div>
                  </div>
                </div>
                <Orders />
              </div>
            </div>
          </div>
        </div>
        <Footer1 />
      </div>
    </>
  );
}
