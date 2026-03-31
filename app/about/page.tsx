"use client";
import "./about.css";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import AboutNeo from "@/components/otherPages/about/AboutNeo";

export default function AboutPage() {
  return (
    <>
      <div id="wrapper">
        <Header2 />
        <AboutNeo />
        <Footer1 />
      </div>
    </>
  );
}
