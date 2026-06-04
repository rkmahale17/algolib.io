import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React, { Suspense } from "react";
import Navbar from "@/components/Navbar";
import { Providers } from "./providers";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { FeedbackButton } from "@/components/FeedbackButton";
import { GoogleAnalytics } from '@next/third-parties/google';
import PostHogPageView from "./PostHogPageView";
import AdminViewToggle from "@/admin/components/AdminViewToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://rulcode.com'),
  title: "Rulcode: Master Algorithms Visually & Open Source",
  description: "Master 200+ algorithms visually with interactive animations, pro tips, and code snippets in Python, C++, Java, and TypeScript.",
  keywords: ["algorithms", "open source", "data structures", "competitive programming", "coding interviews", "algorithm visualization", "code snippets", "python", "java", "c++", "typescript", "Rulcode.com"],
  authors: [{ name: "Rulcode.com Team" }],
  robots: "index, follow",
  openGraph: {
    title: "Rulcode: Master Algorithms Visually & Open Source",
    description: "Master 200+ algorithms visually with interactive animations, pro tips, and code snippets in Python, C++, Java, and TypeScript.",
    type: "website",
    url: "https://rulcode.com/",
    images: ["https://rulcode.com/og-image.png"],
    siteName: "rulcode.com",
  },
  twitter: {
    card: "summary_large_image",
    site: "@rulcode_com",
    title: "Rulcode: Master Algorithms Visually & Open Source",
    description: "Master 200+ algorithms visually with interactive animations, pro tips, and code snippets in Python, C++, Java, and TypeScript.",
    images: ["https://rulcode.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>

          {/* Google Analytics 4 */}
          {process.env.NEXT_PUBLIC_GA_ID && (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
          )}

          <AppSidebar />
          <SidebarInset>
            <Navbar className="global-nav" />
            {children}
          </SidebarInset>
          <AdminViewToggle />
          <FeedbackButton />
        </Providers>
      </body>
    </html>
  );
}
