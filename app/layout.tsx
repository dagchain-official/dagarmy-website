import { Urbanist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-urbanist",
});

export const metadata = {
  title: "DAG ARMY - The Backbone of the DAGCHAIN Ecosystem",
  description: "Join DAG ARMY, the official community growth and contribution program of DAGCHAIN and DAGGPT. Earn rewards through active participation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${urbanist.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
