import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import AnalyticsConsent from "@/components/AnalyticsConsent";

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
  referrer: "no-referrer",
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import PWARegistry from "@/components/PWARegistry";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script id="ga4-sanitize-url" strategy="beforeInteractive">
        {`(() => {
  if (window.location.search || window.location.hash) {
    window.history.replaceState(null, document.title, window.location.origin + window.location.pathname);
  }
})();`}
      </Script>
      <Script id="ga4-consent-default" strategy="beforeInteractive">
        {`window.dataLayer=window.dataLayer||[];
window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
window.gtag('consent','default',{
  ad_storage:'denied',
  analytics_storage:'denied',
  ad_user_data:'denied',
  ad_personalization:'denied',
  wait_for_update:500
});`}
      </Script>
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col pb-16`}>
        <PWARegistry />
        {children}
      </body>
      <AnalyticsConsent />
    </html>
  );
}
