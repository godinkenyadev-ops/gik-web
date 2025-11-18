import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import { getSiteUrl } from "@/lib/seo";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "God in Kenya Missions",
  description: "Faith-driven initiatives empowering communities across Kenya.",
  metadataBase: new URL(getSiteUrl()),
  openGraph: {
    title: "God in Kenya Missions",
    description: "Faith-driven initiatives empowering communities across Kenya.",
    url: getSiteUrl(),
    siteName: "God in Kenya Missions",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "God in Kenya Missions logo"
      }
    ]
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-slate-50 text-slate-900" suppressHydrationWarning>
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
