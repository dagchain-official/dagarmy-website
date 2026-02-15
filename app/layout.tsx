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
    <html lang="en" suppressHydrationWarning>
      <body className="counter-scroll">
        <Web3Provider>
          <Context>{children}</Context>
        </Web3Provider>
      </body>
    </html>
  );
}
