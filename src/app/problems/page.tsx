import { Metadata } from "next";
import GetStartedClient from "./GetStartedClient";

export const metadata: Metadata = {
  title: "All Practice - Master Data Structures & Algorithms | RulCode",
  description:
    "Explore our comprehensive bank of 200+ coding problems and curated patterns.",
  openGraph: {
    title: "All Practice - Master DSA | RulCode",
    description:
      "Explore our comprehensive bank of 200+ coding problems and curated patterns.",
    url: "https://rulcode.com/problems",
  },
};

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <GetStartedClient />
    </div>
  );
}
