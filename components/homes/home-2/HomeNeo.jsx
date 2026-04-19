"use client";
import React from "react";
import HomeRedesign from "./HomeRedesign";

// ── Legacy section imports kept here (commented) for future use ──
// import Hero from "./Hero";
// import Courses from "./Courses";
// import Stories from "./Stories";
// import Categories from "./Categories";
// import Features from "./Features";
// import Facts from "./Facts";
// import Events from "./Events";            // COMING SOON
// import BecomeInstractor from "./BecomeInstractor"; // COMING SOON
// import Skills from "./Skills";
// import DownloadApp from "./DownloadApp";
// import NextPhase from "./NextPhase";

export default function HomeNeo() {
  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", overflowX: "hidden" }}>
      <HomeRedesign />
    </div>
  );
}
