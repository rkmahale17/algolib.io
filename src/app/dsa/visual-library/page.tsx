import { Metadata } from 'next';
import { Suspense } from 'react';
import VisualLibraryClient from './VisualLibraryClient';

export const metadata: Metadata = {
  title: "Visual Library - Interactive Patterns | RulCode",
  description: "Explore our recommended 30 patterns and interact with visualizations and problem descriptions. Enhance your understanding through interactive learning.",
  openGraph: {
    title: "Visual Library - RulCode",
    description: "Interactive visual library of the top 30 algorithm patterns.",
    url: 'https://rulcode.com/dsa/visual-library',
  }
};

export default function VisualLibraryPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading visual library...</div>}>
        <VisualLibraryClient />
      </Suspense>
    </div>
  );
}
