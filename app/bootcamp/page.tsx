"use client";
import React from "react";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import BootcampHero from "@/components/bootcamp/BootcampHero";
import ProblemSolution from "@/components/bootcamp/ProblemSolution";
import WeeklyCurriculum from "@/components/bootcamp/WeeklyCurriculum";
import CertificationBadges from "@/components/bootcamp/CertificationBadges";
import BusinessModelsGrid from "@/components/bootcamp/BusinessModelsGrid";
import ToolsEcosystem from "@/components/bootcamp/ToolsEcosystem";
import BootcampFAQ from "@/components/bootcamp/BootcampFAQ";
import WhyThisWorks from "@/components/bootcamp/WhyThisWorks";
import EnrollmentCTA from "@/components/bootcamp/EnrollmentCTA";

export default function BootcampPage() {
  return (
    <>
      <div id="wrapper">
        <Header2 />
        
        <div className="main-content">
          {/* Hero Section */}
          <BootcampHero />
          
          {/* Problem vs Solution */}
          <ProblemSolution />
          
          {/* 4-Week Curriculum */}
          <WeeklyCurriculum />
          
          {/* Certification Levels */}
          <CertificationBadges />
          
          {/* 20+ Business Models */}
          <BusinessModelsGrid />
          
          {/* No-Code Tools */}
          <ToolsEcosystem />
          
          {/* Why This Works */}
          <WhyThisWorks />
          
          {/* FAQ */}
          <BootcampFAQ />
          
          {/* Enrollment CTA */}
          <EnrollmentCTA />
        </div>

        <Footer1 />
      </div>
    </>
  );
}
