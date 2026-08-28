import { Metadata } from 'next';
import PatternsClient from './PatternsClient';

export const metadata: Metadata = {
  title: "Pattern Practice - Master Category Wise Topics | RulCode",
  description: "Browse and practice problems by specific topics and patterns.",
  openGraph: {
    title: "Pattern Practice - Master Category Wise Topics | RulCode",
    description: "Browse and practice problems by specific topics and patterns.",
    url: 'https://rulcode.com/dsa/patterns',
  },
  alternates: {
    canonical: 'https://rulcode.com/dsa/patterns',
  },
};

export default function PatternsPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <PatternsClient />
    </div>
  );
}
