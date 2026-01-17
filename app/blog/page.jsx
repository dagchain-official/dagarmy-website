import Blogs2 from "@/components/blogs/Blogs2";
import PageTitle from "@/components/blogs/PageTitle";
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import React from "react";

export const metadata = {
  title: "Blog || DAGARMY - AI, Blockchain & Data Visualization Insights",
  description: "Explore the latest insights on AI, Blockchain, and Data Visualization from the DAGARMY team. Stay updated with tech trends and tutorials.",
};

export default function BlogPage() {
  return (
    <>
      <div id="wrapper">
        <Header2 />
        <PageTitle title="DAGARMY Blog" />
        <Blogs2 />
        <Footer1 parentClass="footer has-border-top" />
      </div>
    </>
  );
}
