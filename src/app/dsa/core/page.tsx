import { Metadata } from 'next';
import { Suspense } from 'react';
import ProblemsClient from '../problems/ProblemsClient';

export const metadata: Metadata = {
  title: "Core Patterns - Master the Fundamentals | RulCode",
  description: "Master the 20% of patterns that solve 80% of interview questions. Focus on high-impact techniques like Sliding Window, Two Pointers, and Backtracking.",
  openGraph: {
    title: "Core Patterns Library - RulCode",
    description: "Master essential algorithm patterns with step-by-step visualizations.",
    url: 'https://rulcode.com/dsa/core',
  }
};

export default function CorePage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Suspense fallback={<div className="p-8 animate-pulse">Loading patterns...</div>}>
        <ProblemsClient 
          listType="core"
          title="Core Patterns Library"
          description="Master the 20% of patterns that solve 80% of interview questions. Focus on high-impact techniques like Sliding Window, Two Pointers, and Backtracking to develop a deep, pattern-based intuition for problem-solving."
          progressTitle="Pattern Mastery Progress"
        />
      </Suspense>
    </div>
  );
}
