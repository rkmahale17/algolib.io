import { Metadata } from 'next';
import GetStartedClient from './GetStartedClient';

export const metadata: Metadata = {
  title: "DSA Roadmap - RulCode | Master Patterns",
  description: "Master essential recurring algorithm patterns with our curated DSA roadmap.",
  openGraph: {
    title: "DSA Roadmap - RulCode | Master Patterns",
    description: "Master essential recurring algorithm patterns with our curated DSA roadmap.",
    url: 'https://rulcode.com/dsa/get-started',
  }
};

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <GetStartedClient />
    </div>
  );
}
