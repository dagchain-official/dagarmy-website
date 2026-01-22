import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import Login from "@/components/otherPages/Login";
import React from "react";

export const metadata = {
  title: "Login || DAGARMY - Master AI, Blockchain & Data Visualization",
  description: "Sign in to DAGARMY with your wallet or social account. Access AI, Blockchain, and Data Visualization courses.",
};

export default function LoginPage() {
  return (
    <>
      <div id="wrapper">
        <Header2 />
        <Login />
        <Footer1 />
      </div>
    </>
  );
}
