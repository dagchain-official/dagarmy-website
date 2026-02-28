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
import BuildersPledgeSection from "@/components/udaan/BuildersPledgeSection";
import Reality from "@/components/udaan/Reality";
import BentoGrid from "@/components/udaan/BentoGrid";
import Vision2030 from "@/components/udaan/Vision2030";
import NextStepSection from "@/components/udaan/NextStepSection";
import Ecosystem from "@/components/udaan/Ecosystem";
import RegionalSwitcher from "@/components/udaan/RegionalSwitcher";
import Culture from "@/components/udaan/Culture";
import Pledge from "@/components/udaan/Pledge";
import FinalCTA from "@/components/udaan/FinalCTA";
import Footer1 from "@/components/footers/Footer1";
import UdaanClient from "./UdaanClient";

export default function UdaanPage() {
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
        <BuildersPledgeSection />
        <Vision2030 />
        <NextStepSection />
        <Reality />
        <BentoGrid />
        <Ecosystem />
        <RegionalSwitcher />
        <Culture />
        <Pledge />
        <FinalCTA />
      </main>
      <Footer1 />
      {/* PledgeModal rendered at page root to escape all section stacking contexts */}
      <UdaanClient />
    </>
  );
}
