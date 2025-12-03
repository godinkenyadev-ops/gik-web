import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import { getSiteUrl } from "@/lib/seo";
import { Toaster } from "@/app/components/ui/sonner";
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
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: "white",
              border: "1px solid rgb(34 197 94)",
              borderRadius: "1rem",
              color: "rgb(15 23 42)",
              boxShadow: "0 10px 15px -3px rgb(34 197 94 / 0.1), 0 4px 6px -4px rgb(34 197 94 / 0.1)"
            },
            className: "font-medium"
          }}
        />
      </body>
    </html>
  );
}
