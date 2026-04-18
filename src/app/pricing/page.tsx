import { Metadata } from 'next';
import PricingClient from './PricingClient';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: "Pricing - RulCode Premium",
  description: "Join RulCode Premium to get full access to all algorithms, interactive visualizations, and curated interview roadmaps. Invest in your career today.",
  openGraph: {
    title: "Pricing - RulCode Premium",
    description: "Unlock all premium competitive coding features and algorithm visualizations.",
    url: 'https://rulcode.com/pricing',
  }
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background pt-24 font-sans text-foreground">
      <PricingClient />
      <Footer />
    </main>
  );
}
