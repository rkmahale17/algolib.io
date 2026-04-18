import { Metadata } from 'next';
import { Suspense } from 'react';
import ProblemsClient from './ProblemsClient';

export const metadata: Metadata = {
  title: "Algorithm Problems - RulCode | Master Patterns",
  description: "Browse our comprehensive collection of 150+ algorithm problems. Master everything from basic arrays to advanced dynamic programming through hands-on practice and step-by-step visualizations.",
  openGraph: {
    title: "Algorithm Problems - RulCode | Master Patterns",
    description: "Browse 150+ algorithm problems with interactive visualizations.",
    url: 'https://rulcode.com/dsa/problems',
  }
};

export default function ProblemsPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Suspense fallback={<div className="p-8 animate-pulse">Loading problems...</div>}>
        <ProblemsClient />
      </Suspense>
    </div>
  );
}
