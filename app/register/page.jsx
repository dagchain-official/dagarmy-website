import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import Register from "@/components/otherPages/Register";
import React from "react";

export const metadata = {
  title: "Register || DAGARMY - Master AI, Blockchain & Data Visualization",
  description: "Join DAGARMY with your wallet or social account. Start learning AI, Blockchain, and Data Visualization.",
};

export default function RegisterPage() {
  return (
    <>
      <div id="wrapper">
        <Header2 />
        <Register />
        <Footer1 />
      </div>
    </>
  );
}
