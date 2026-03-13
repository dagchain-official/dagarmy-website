import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import HomeNeo from "@/components/homes/home-2/HomeNeo";
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
        <div className="main-content">
          <HomeNeo />
          <Footer1 parentClass="footer style-2" />
        </div>
      </div>
    </>
  );
}
