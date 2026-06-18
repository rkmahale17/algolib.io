import { Metadata } from 'next';
import { Suspense } from 'react';
import ProblemsClient from '../problems/ProblemsClient';
import { Layers } from 'lucide-react';

export const metadata: Metadata = {
  title: "Rulcode 150 LeetCode Problems - RulCode",
  description: "A comprehensive collection of 150 critical problems combining Blind 75 and additional core patterns.",
  openGraph: {
    title: "Rulcode 150 Collection - RulCode",
    description: "Master 150 essential problems with interactive visualizations.",
    url: 'https://rulcode.com/dsa/rulcode-150',
  }
};

export default function Rulcode150Page() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Suspense fallback={<div className="p-8 animate-pulse">Loading Rulcode 150...</div>}>
        <ProblemsClient 
          listType="blind150"
          title="Rulcode 150 Problems"
          description="A comprehensive collection of 150 critical problems combining Blind 75 and additional core patterns, providing thorough coverage across all standard algorithm topics."
          progressTitle="Rulcode 150 Progress"
          icon="layers"
        />
      </Suspense>
    </div>
  );
}
