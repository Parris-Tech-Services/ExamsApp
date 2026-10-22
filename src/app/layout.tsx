import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CSU Exam Supervisor | Dubbo Quick Reference",
  description: "Quick reference guide for CSU exam supervisors in Dubbo.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CSU Exams",
  },
  formatDetection: {
    telephone: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import PWARegistry from "@/components/PWARegistry";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col pb-16`}>
        <PWARegistry />
        {children}
        <Script
          src="https://cloud.umami.is/script.js"
          strategy="afterInteractive"
          data-website-id="__UMAMI_WEBSITE_ID__"
          data-do-not-track="true"
          data-performance="true"
          data-exclude-hash="true"
          data-domains="exams-app-nine.vercel.app"
          data-tag="ExamsApp"
        />
      </body>
    </html>
  );
}
