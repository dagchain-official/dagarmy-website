"use client";
import React from "react";
import dynamic from "next/dynamic";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import RewardsOverview from "@/components/rewards/RewardsOverview";

const PDFViewer = dynamic(() => import("@/components/PDFViewer"), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <svg 
        width="48" 
        height="48" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="#3b82f6" 
        strokeWidth="2"
        style={{ animation: 'spin 1s linear infinite' }}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
      </svg>
      <p style={{ fontSize: '16px', color: '#6b7280', fontWeight: '500' }}>
        Loading PDF Viewer...
      </p>
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
});

export default function RewardsPage() {
  return (
    <>
      <div id="wrapper">
        <Header2 />
        
        <div className="main-content pt-0">
          {/* Rewards Overview Section */}
          <RewardsOverview />
          
          {/* PDF Documentation Section */}
          <div id="rewards-documentation">
            <PDFViewer />
          </div>
        </div>
        
        <Footer1 />
      </div>
    </>
  );
}
