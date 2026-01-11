"use client";
import { useEffect } from "react";
import "./globals.css";
import "../public/scss/main.scss";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "react-modal-video/css/modal-video.css";
import Context from "@/context/Context";
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
    <html lang="en">
      <body className="counter-scroll">
        <Context>{children}</Context>
      </body>
    </html>
  );
}
