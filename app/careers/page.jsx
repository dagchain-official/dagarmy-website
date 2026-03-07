import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import CareersPage from "@/components/careers/CareersPage";
import { Suspense } from "react";

export const metadata = {
  title: "Careers — DAGArmy",
  description: "Join the DAGArmy team. We're hiring Developer Relations Managers and Sales Interns across India, Southeast Asia, MENA, and globally.",
};

export default function CareersRoute() {
  return (
    <div id="wrapper">
      <Header2 />
      <Suspense fallback={null}>
        <CareersPage />
      </Suspense>
      <Footer1 parentClass="footer has-border-top" />
    </div>
  );
}
