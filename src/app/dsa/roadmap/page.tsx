import { Metadata } from 'next';
import { Suspense } from 'react';
import RoadmapClient from './RoadmapClient';

export const metadata: Metadata = {
  title: "Algorithm Learning Roadmap | RulCode",
  description: "Follow curated visual roadmaps for Core DSA, Blind 75, and Rulcode 150. Track your progress step-by-step from learning to visualization and practice.",
  openGraph: {
    title: "Algorithm Learning Roadmap - RulCode",
    description: "Follow curated visual roadmaps for Core DSA, Blind 75, and Rulcode 150.",
    url: 'https://rulcode.com/dsa/roadmap',
  }
};

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Suspense fallback={<div className="p-8 animate-pulse text-muted-foreground">Loading learning roadmap...</div>}>
        <RoadmapClient />
      </Suspense>
    </div>
  );
}
