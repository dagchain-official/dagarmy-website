"use client";
import JobsPanel from "@/components/jobs/JobsPanel";
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import React from "react";

export default function JobsPage() {
  return (
    <>
      <div id="wrapper">
        <Header2 />
        <JobsPanel />
        <Footer1 parentClass="footer has-border-top" />
      </div>
    </>
  );
}
