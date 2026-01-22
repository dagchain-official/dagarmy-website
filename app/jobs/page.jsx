import JobsPanel from "@/components/jobs/JobsPanel";
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import React from "react";

export const metadata = {
  title: "Jobs || DAGARMY - Find Tech Jobs in AI, Blockchain & Data Visualization",
  description: "Discover the latest job opportunities in AI, Blockchain, and Data Visualization. Apply to top tech companies hiring Vibe Coders.",
};

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
