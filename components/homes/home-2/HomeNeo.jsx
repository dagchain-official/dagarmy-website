"use client";
import React from "react";
import Hero from "./Hero";
import Courses from "./Courses";
import Stories from "./Stories";
import Categories from "./Categories";
import Features from "./Features";
import Facts from "./Facts";
import Events from "./Events";
import BecomeInstractor from "./BecomeInstractor";
import Skills from "./Skills";
import DownloadApp from "./DownloadApp";
import NextPhase from "./NextPhase";

/* ─── Neumorphic design tokens — white theme ─── */
const NM_BG = "#ffffff";
const NM_SHADOW = "6px 6px 16px rgba(0,0,0,0.09), -4px -4px 12px rgba(255,255,255,0.9)";
const NM_SHADOW_SM = "4px 4px 10px rgba(0,0,0,0.07), -3px -3px 8px rgba(255,255,255,0.9)";
const NM_SHADOW_INSET = "inset 3px 3px 8px rgba(0,0,0,0.07), inset -2px -2px 6px rgba(255,255,255,0.9)";
const NM_ACCENT = "linear-gradient(135deg,#818cf8,#a78bfa)";

export default function HomeNeo() {
  return (
    <div style={{ background: NM_BG, minHeight: "100vh" }}>
      <style>{`
        /* ── Global nm overrides ── */
        .page-title-home2,
        .section-popular-program,
        .section-stories,
        .section-categories,
        .features-section,
        .section-about-box,
        .section-event,
        .section-become-instructor,
        .section-search-tags,
        .section-mobile-app {
          background: ${NM_BG} !important;
        }

        /* hero video wrapper — right side only */
        .page-title-home2 .col-lg-6:last-child > div {
          border: none !important;
          box-shadow: ${NM_SHADOW} !important;
          border-radius: 24px !important;
        }
        /* hero left text — no box */
        .page-title-home2 .col-lg-6:first-child > div {
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
        }

        /* Cards in Courses section */
        .section-popular-program [style*="border-radius: 16px"],
        .section-popular-program .info-card {
          background: ${NM_BG} !important;
          border: none !important;
          box-shadow: ${NM_SHADOW} !important;
        }

        /* Tab nav active indicator */
        .tab-navigation button {
          background: transparent !important;
        }

        /* Story cards */
        .story-card {
          background: ${NM_BG} !important;
          border: none !important;
          box-shadow: ${NM_SHADOW_SM} !important;
        }
        .story-card:hover {
          transform: translateY(-6px) !important;
          box-shadow: 12px 12px 28px #b8bac0, -6px -6px 20px #ffffff !important;
        }

        /* Carousel nav buttons */
        .story-carousel-wrapper > button {
          background: ${NM_BG} !important;
          border: none !important;
          box-shadow: ${NM_SHADOW_SM} !important;
        }
        .story-carousel-wrapper > button:hover {
          background: #1f2937 !important;
          box-shadow: 4px 4px 12px #b0b2b8, -2px -2px 8px #ffffff !important;
        }

        /* Categories cards */
        .icon-box-link .icons-box {
          background: ${NM_BG} !important;
          border: none !important;
          box-shadow: ${NM_SHADOW_SM} !important;
        }
        .icon-box-link:hover .icons-box {
          box-shadow: inset 3px 3px 8px #c5c7cd, inset -3px -3px 8px #ffffff !important;
          border: none !important;
        }

        /* Features cards */
        .features-section [class*="feature-card"],
        .features-section > div > div > div > div {
          background: ${NM_BG} !important;
          border: none !important;
          box-shadow: ${NM_SHADOW_SM} !important;
        }

        /* Facts / Master AI section box-agent */
        .section-about-box .box-agent {
          background: ${NM_BG} !important;
          box-shadow: ${NM_SHADOW_SM} !important;
          border: none !important;
          border-radius: 16px !important;
        }

        /* Events cards */
        .section-event [style*="border-radius"] {
          background: ${NM_BG} !important;
          border: none !important;
          box-shadow: ${NM_SHADOW_SM} !important;
        }

        /* BecomeInstractor section */
        .section-become-instructor {
          background: ${NM_BG} !important;
        }
        .section-become-instructor .box-agent {
          background: ${NM_BG} !important;
          box-shadow: ${NM_SHADOW_SM} !important;
          border-radius: 16px !important;
        }

        /* Skills tags */
        .section-search-tags .search-tag-item,
        .section-search-tags a[style] {
          background: ${NM_BG} !important;
          border: none !important;
          box-shadow: ${NM_SHADOW_SM} !important;
          border-radius: 50px !important;
        }
        .section-search-tags a[style]:hover {
          box-shadow: ${NM_SHADOW_INSET} !important;
        }

        /* DownloadApp section */
        .section-mobile-app {
          background: ${NM_BG} !important;
        }
        .section-mobile-app [style*="border-radius"] {
          background: ${NM_BG} !important;
          border: none !important;
          box-shadow: ${NM_SHADOW_SM} !important;
        }

        /* NextPhase CTA — keep dark bg, just add depth */
        .next-phase-section {
          background: #1a1c2e !important;
        }
        .next-phase-section [style*="background: rgba(255"] {
          background: rgba(255,255,255,0.08) !important;
          box-shadow: 4px 4px 12px rgba(0,0,0,0.3), -2px -2px 8px rgba(255,255,255,0.05) !important;
          border: none !important;
          border-radius: 16px !important;
        }

        /* Section dividers between sections */
        .section-popular-program,
        .section-stories,
        .section-categories,
        .features-section,
        .section-about-box,
        .section-event,
        .section-become-instructor,
        .section-search-tags,
        .section-mobile-app {
          border-top: 1px solid rgba(0,0,0,0.04);
          border-bottom: 1px solid rgba(0,0,0,0.04);
        }

        /* Headings */
        .section-popular-program h2,
        .section-categories .heading-section h2,
        .features-section h2,
        .section-about-box h2,
        .section-event h2,
        .section-become-instructor h2,
        .section-search-tags h2,
        .section-mobile-app h2 {
          color: #1e2030 !important;
        }

        /* Primary CTA button in hero */
        .page-title-home2 .bottom-btns a.custom-explore-btn {
          box-shadow: ${NM_SHADOW_SM};
          border-radius: 14px !important;
        }
        .page-title-home2 .bottom-btns a.custom-explore-btn:hover {
          box-shadow: ${NM_SHADOW_INSET} !important;
        }

        /* Enrol button in Courses */
        .section-popular-program button[style*="background: #000000"] {
          border-radius: 12px !important;
          box-shadow: 4px 4px 12px rgba(0,0,0,0.25), -2px -2px 6px rgba(255,255,255,0.6) !important;
        }

        /* ── Mobile responsiveness ── */
        @media (max-width: 767px) {
          .page-title-home2 .col-lg-6 > div {
            box-shadow: ${NM_SHADOW_SM} !important;
            margin-top: 24px;
          }
          .story-carousel-wrapper {
            padding-left: 40px !important;
            padding-right: 40px !important;
          }
          .features-section [style*="grid-template-columns"] {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .features-section [style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* ── Sections (all logic/content unchanged) ── */}
      <div className="page-title-home2-wrapper" style={{ background: NM_BG }}>
        <Hero />
      </div>
      <Courses />
      <Stories />
      <Categories />
      <Features />
      <Facts />
      <Events />
      <BecomeInstractor />
      <Skills />
      <DownloadApp />
      <NextPhase />
    </div>
  );
}
