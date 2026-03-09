"use client";
import { useEffect } from "react";
import "./udaan.css";
import Header2 from "@/components/headers/Header2";
import Hero from "@/components/udaan/Hero";
import ExecutionSection from "@/components/udaan/ExecutionSection";
import WeeklyScheduleSection from "@/components/udaan/WeeklyScheduleSection";
import SoldierSection from "@/components/udaan/SoldierSection";
import LieutenantSection from "@/components/udaan/LieutenantSection";
import PrideLadderSection from "@/components/udaan/PrideLadderSection";
import DemoDaySection from "@/components/udaan/DemoDaySection";
import UdaanCodeSection from "@/components/udaan/UdaanCodeSection";
import Vision2030 from "@/components/udaan/Vision2030";
import Pledge from "@/components/udaan/Pledge";
import Footer1 from "@/components/footers/Footer1";
import UdaanClient from "./UdaanClient";

export default function UdaanPage() {
  // Scroll to top when page loads to ensure hero stats are fully visible
  useEffect(() => {
    // Set scroll restoration to manual to prevent browser from restoring scroll position
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Scroll to top immediately
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    // Also scroll after a brief delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Header2 />
      <main className="udaan-page">
        <Hero />
        <ExecutionSection />
        <WeeklyScheduleSection />
        <SoldierSection />
        <LieutenantSection />
        <PrideLadderSection />
        <DemoDaySection />
        <UdaanCodeSection />
        <Vision2030 />
        <Pledge />

      </main>
      <Footer1 />
      {/* PledgeModal rendered at page root to escape all section stacking contexts */}
      <UdaanClient />
    </>
  );
}
