import { Metadata } from 'next';
import TwoPointerClient from './TwoPointerClient';

export const metadata: Metadata = {
  title: 'Two Pointer Race Game - Learn Two Pointer Technique | RulCode',
  description: 'Master the two-pointer technique through interactive gameplay. Find valid pairs, learn sorted array patterns, and optimize your algorithm skills.',
  keywords: 'two pointer game, two pointer technique, algorithm pattern game, sorted array problems, coding interview prep',
  openGraph: {
    title: 'Two Pointer Race - Interactive Algorithm Game',
    description: 'Master the two-pointer technique through interactive gameplay.',
    url: 'https://rulcode.com/games/two-pointer',
  }
};

export default function TwoPointerPage() {
  return <TwoPointerClient />;
}
