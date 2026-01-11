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
import React from "react";

export const metadata = {
  title: "DAGARMY - Master AI, Blockchain & Data Visualisation",
  description: "Join 2,500+ learners mastering AI, Blockchain, and Data Visualisation with DAGARMY's industry-leading courses and expert instructors.",
};

export default function Home() {
  return (
    <>
      <div id="wrapper">
        <Header2 />
        <Hero />
        <div className="main-content">
          <Courses />
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
