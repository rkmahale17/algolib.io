import { Metadata } from 'next';
import { Suspense } from 'react';
import PatternGuessListClient from './PatternGuessListClient';

export const metadata: Metadata = {
  title: "Guess the Pattern | RulCode",
  description: "Test your algorithmic intuition by guessing the underlying patterns of various problems.",
};

export default function PatternGuessPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Suspense fallback={<div className="p-8 animate-pulse">Loading patterns...</div>}>
        <PatternGuessListClient />
      </Suspense>
    </div>
  );
}
