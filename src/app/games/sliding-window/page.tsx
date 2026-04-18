import { Metadata } from 'next';
import SlidingWindowClient from './SlidingWindowClient';

export const metadata: Metadata = {
  title: 'Sliding Window Ninja Game - Master Sliding Window Technique | RulCode',
  description: 'Master the sliding window algorithm through interactive gameplay. Learn fixed window, variable window, and optimization techniques for substring and subarray problems.',
  keywords: 'sliding window game, sliding window technique, subarray game, substring problems, algorithm optimization',
  openGraph: {
    title: 'Sliding Window Ninja - Interactive Algorithm Game',
    description: 'Master sliding window technique through gameplay.',
    url: 'https://rulcode.com/games/sliding-window',
  }
};

export default function SlidingWindowPage() {
  return <SlidingWindowClient />;
}
