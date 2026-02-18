"use client";
import { useEffect } from "react";
import "./globals.css";
import "../public/scss/main.scss";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "react-modal-video/css/modal-video.css";
import Context from "@/context/Context";
import { Web3Provider } from "@/context/Web3Provider";
import { usePathname } from "next/navigation";
import { DM_Sans, Fraunces } from "next/font/google";

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
    const { WOW } = require("wowjs");
    const wow = new WOW({
      mobile: false,
      live: false,
    });
    wow.init();
  }, [pathname]);

  return (
    <html lang="en" suppressHydrationWarning className={`${dmSans.variable} ${fraunces.variable}`}>
      <body className="counter-scroll">
        <Web3Provider>
          <Context>{children}</Context>
        </Web3Provider>
      </body>
    </html>
  );
}
