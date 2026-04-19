import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React, { Suspense } from "react";
import Navbar from "@/components/Navbar";
import { Providers } from "./providers";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rulcode - Master 200+ Algorithms with Interactive Visualizations | Free & Open Source",
  description: "Rulcode.com is a free and open-source algorithm library for developers and competitive programmers. Learn, visualize, and master 72+ algorithms with step-by-step explanations, pro tips, and code snippets in Python, Java, C++, and TypeScript — all free to use.",
  keywords: ["algorithms", "open source", "free", "data structures", "competitive programming", "coding interviews", "algorithm visualization", "code snippets", "python", "java", "c++", "typescript", "Rulcode.com"],
  authors: [{ name: "Rulcode.com Team" }],
  robots: "index, follow",
  openGraph: {
    title: "Rulcode.com - Master 200+ Algorithms with Interactive Visualizations | Free & Open Source",
    description: "Free and open-source algorithm library for competitive programming. Learn and visualize algorithms with step-by-step guides and code snippets in multiple languages.",
    type: "website",
    url: "https://rulcode.com/",
    images: ["https://rulcode.com/og-image.png"],
    siteName: "rulcode.com",
  },
  twitter: {
    card: "summary_large_image",
    site: "@rulcode_com",
    title: "Rulcode.com - Master 200+ Algorithms with Interactive Visualizations | Free & Open Source",
    description: "Free and open-source algorithm library for competitive programming. Learn and visualize algorithms with step-by-step guides and code snippets in multiple languages.",
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
          <AppSidebar />
          <SidebarInset>
            <Navbar />
            {children}
          </SidebarInset>
        </Providers>
      </body>
    </html>
  );
}
