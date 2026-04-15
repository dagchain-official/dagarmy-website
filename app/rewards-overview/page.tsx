"use client";
import React from "react";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import RewardsOverviewNeo from "@/components/rewards/RewardsOverviewNeo";

export default function RewardsPage() {
  return (
    <>
      <div id="wrapper">
        <Header2 />
        <div className="main-content pt-0">
          <RewardsOverviewNeo />
        </div>
        <Footer1 />
      </div>
    </>
  );
}
