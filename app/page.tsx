import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import BecomeInstractor from "@/components/homes/home-2/BecomeInstractor";
import Categories from "@/components/homes/home-2/Categories";
import Courses from "@/components/homes/home-2/Courses";
import Courses2 from "@/components/homes/home-2/Courses2";
import DownloadApp from "@/components/homes/home-2/DownloadApp";
import Events from "@/components/homes/home-2/Events";
import Facts from "@/components/homes/home-2/Facts";
import Features from "@/components/homes/home-2/Features";
import Hero from "@/components/homes/home-2/Hero";
import Skills from "@/components/homes/home-2/Skills";
import Stories from "@/components/homes/home-2/Stories";
import React from "react";

export const metadata = {
  title: "DAG Army Global Skill Community for Future Technology Careers",
  description: "Join DAG Army, a global skill community focused on practical technology learning across AI, Blockchain, and Data. Designed for students, professionals, and creators worldwide.",
  keywords: [
    "DAG Army",
    "global skill community",
    "AI learning",
    "blockchain education",
    "data visualisation",
    "future tech careers",
    "technology skills",
    "professional growth",
    "digital skills platform"
  ],
  authors: [{ name: "DAG Army" }],
  creator: "DAG Army",
  publisher: "DAG Army",
  openGraph: {
    title: "DAG Army Global Skill Community for Future Technology Careers",
    description: "Join DAG Army, a global skill community focused on practical technology learning across AI, Blockchain, and Data. Designed for students, professionals, and creators worldwide.",
    type: "website",
    locale: "en_US",
    siteName: "DAG Army",
  },
  twitter: {
    card: "summary_large_image",
    title: "DAG Army Global Skill Community for Future Technology Careers",
    description: "Join DAG Army, a global skill community focused on practical technology learning across AI, Blockchain, and Data. Designed for students, professionals, and creators worldwide.",
  },
};

export default function Home() {
  return (
    <>
      <div id="wrapper">
        <Header2 />
        <Hero />
        <div className="main-content">
          <Courses />
          <Stories />
          <Categories />
          <Features />
          <Courses2 />
          <Facts />
          <Events />
          <BecomeInstractor />
          <Skills />
          <DownloadApp />
          <Footer1 parentClass="footer style-2" />
        </div>
      </div>
    </>
  );
}
