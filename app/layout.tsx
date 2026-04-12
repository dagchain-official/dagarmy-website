"use client";
import { useEffect } from "react";
import "./globals.css";
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
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.esm" as any).then(() => {});
    }
  }, []);

  useEffect(() => {
    // Skip WOW.js on admin pages — it causes re-render flicker
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
            <div style={{ paddingTop: (pathname?.startsWith('/student-') || pathname?.startsWith('/dag-lieutenant')) ? '0' : '50px' }}>
              {children}
            </div>
          </Context>
          {!pathname?.startsWith("/admin") && !pathname?.startsWith("/student-") && <ChatWidget />}
        </Web3Provider>
        <Analytics />
      </body>
    </html>
  );
}
