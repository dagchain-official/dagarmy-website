"use client";
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import JobPostingsManager from "@/components/admin/JobPostingsManager";
import MasterCareersApplications from "@/components/admin/MasterCareersApplications";

export default function MasterCareersPage() {
  const [tab, setTab] = useState("postings");

  const tabStyle = (active) => ({
    padding: "10px 22px", borderRadius: "10px", border: "none", cursor: "pointer",
    fontSize: "13px", fontWeight: "700", transition: "all 0.15s",
    background: active ? "#0f172a" : "transparent",
    color: active ? "#fff" : "#64748b",
  });

  return (
    <AdminLayout>
      <div style={{ padding: "32px", maxWidth: "1200px" }}>
        {/* Page Header */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ margin: "0 0 4px", fontSize: "24px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px" }}>
            Careers
          </h1>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
            Manage job postings and review applicants
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: "inline-flex", background: "#f1f5f9", borderRadius: "12px",
          padding: "4px", marginBottom: "28px", gap: "2px",
        }}>
          <button style={tabStyle(tab === "postings")} onClick={() => setTab("postings")}>
            Job Postings
          </button>
          <button style={tabStyle(tab === "applications")} onClick={() => setTab("applications")}>
            Applications
          </button>
        </div>

        {tab === "postings" && <JobPostingsManager />}
        {tab === "applications" && <MasterCareersApplications />}
      </div>
    </AdminLayout>
  );
}
