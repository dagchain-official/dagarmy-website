"use client";

import "./udaan.css";
import Header2 from "@/components/headers/Header2";
import Hero from "@/components/udaan/Hero";
import WeeklyScheduleSection from "@/components/udaan/WeeklyScheduleSection";
import SoldierSection from "@/components/udaan/SoldierSection";
import LieutenantSection from "@/components/udaan/LieutenantSection";
import PrideLadderSection from "@/components/udaan/PrideLadderSection";
import DemoDaySection from "@/components/udaan/DemoDaySection";
import UdaanCodeSection from "@/components/udaan/UdaanCodeSection";
import BuildersPledgeSection from "@/components/udaan/BuildersPledgeSection";
import Reality from "@/components/udaan/Reality";
import BentoGrid from "@/components/udaan/BentoGrid";
import Vision2030 from "@/components/udaan/Vision2030";
import NextStepSection from "@/components/udaan/NextStepSection";
import BuilderTestimonialsSection from "@/components/udaan/BuilderTestimonialsSection";
import Ecosystem from "@/components/udaan/Ecosystem";
import RegionalSwitcher from "@/components/udaan/RegionalSwitcher";
import Culture from "@/components/udaan/Culture";
import FinalCTA from "@/components/udaan/FinalCTA";
import Footer1 from "@/components/footers/Footer1";
import UdaanClient from "./UdaanClient";
import { Plasma } from "@/components/ui/plasma-background";

export default function UdaanPage() {
  return (
    <>
      {/* Plasma animated background - WebGL based */}
      <div className="absolute inset-0 z-0">
        <Plasma
          color="#6366f1"
          speed={0.5}
          direction="forward"
          scale={1.2}
          opacity={0.3}
          mouseInteractive={true}
        />

        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-white/70"></div>
      </div>

      <div className="relative z-10">
        <Header2 />
        <main className="udaan-page">
          <Hero />
          <WeeklyScheduleSection />
          <SoldierSection />
          <LieutenantSection />
          <PrideLadderSection />
          <DemoDaySection />
          <UdaanCodeSection />
          <BuildersPledgeSection />
          <Vision2030 />
          <NextStepSection />
          <BuilderTestimonialsSection />
          <Reality />
          <BentoGrid />
          <Ecosystem />
          <RegionalSwitcher />
          <Culture />
          <FinalCTA />
        </main>
        <Footer1 />
      </div>

      {/* PledgeModal rendered at page root to escape all section stacking contexts */}
      <UdaanClient />
    </>
  );
}
