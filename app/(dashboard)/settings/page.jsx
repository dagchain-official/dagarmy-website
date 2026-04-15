import PageTitle2 from "@/components/dashboard/PageTitle2";
import Setttings from "@/components/dashboard/Setttings2";
import React from "react";

export const metadata = {
  title: "Settings || DAGARMY - Master AI, Blockchain & Data Visualization",
  description: "DAGARMY Student Settings - Manage your account and preferences.",
};

export default function StudentSettingPage() {
  return (
    <div style={{ flex: 1, background: '#eef0f5' }}>
        <Setttings />
    </div>
  );
}




