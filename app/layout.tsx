"use client";
import { useEffect } from "react";
import "./globals.css";
import "../components/headers/Header2.global.css";
import "../public/scss/main.scss";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "react-modal-video/css/modal-video.css";
import Context from "@/context/Context";
import ChatWidget from "@/components/chatbot/ChatWidget";
import Web3Provider from "@/context/Web3Provider";
import { usePathname } from "next/navigation";
import { DM_Sans, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  display: "swap",
  weight: ["300","400","500","600","700","800","900"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["300","400","500","700","900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  useEffect(() => {
    // Ensure viewport-fit=cover so iOS Safari honours env(safe-area-inset-*)
    const existing = document.querySelector('meta[name="viewport"]');
    if (existing) {
      const content = existing.getAttribute('content') || '';
      if (!content.includes('viewport-fit')) {
        existing.setAttribute('content', content + ', viewport-fit=cover');
      }
    } else {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
      document.head.appendChild(meta);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.esm" as any).then(() => {});
    }
  }, []);

  useEffect(() => {
    // Skip WOW.js on admin pages - it causes re-render flicker
    if (pathname?.startsWith("/admin")) return;
    const wowModule = require("wowjs");
    // wowjs exports differently under webpack vs Turbopack
    const WOWConstructor = wowModule.WOW ?? wowModule.default?.WOW ?? wowModule.default ?? wowModule;
    if (typeof WOWConstructor !== "function") return;
    const wow = new WOWConstructor({
      mobile: false,
      live: false,
    });
    wow.init();
  }, [pathname]);

  return (
    <html lang="en" suppressHydrationWarning className={`${dmSans.variable} ${fraunces.variable}`}>
      <body className="counter-scroll">
        <Web3Provider>
          <Context>
            <div style={{ paddingTop: (pathname?.startsWith('/dashboard') || pathname?.startsWith('/missions') || pathname?.startsWith('/my-team') || pathname?.startsWith('/leaderboard') || pathname?.startsWith('/events') || pathname?.startsWith('/notifications') || pathname?.startsWith('/support') || pathname?.startsWith('/settings') || pathname?.startsWith('/rewards') || pathname?.startsWith('/my-courses') || pathname?.startsWith('/referral') || pathname?.startsWith('/bidding') || pathname?.startsWith('/dag-lieutenant')) ? '0' : '50px' }}>
              {children}
            </div>
          </Context>
          {/* ChatWidget: marketing pages only — never on dashboard or admin */}
          {(() => {
            const DASHBOARD_PATHS = ['/admin', '/dashboard', '/missions', '/my-team', '/leaderboard',
              '/events', '/notifications', '/support', '/settings', '/rewards', '/my-courses',
              '/referral', '/bidding', '/dag-lieutenant'];
            const isDashboard = DASHBOARD_PATHS.some(p => pathname?.startsWith(p));
            return !isDashboard ? <ChatWidget /> : null;
          })()}
        </Web3Provider>
        <Analytics />
      </body>
    </html>
  );
}
