import { Metadata } from 'next';
import SortHeroClient from './SortHeroClient';

export const metadata: Metadata = {
  title: 'Sort Hero - Master Sorting Algorithms | RulCode',
  description: 'Learn and master sorting algorithms through an interactive game. Visualize bubble sort, quick sort, and more.',
};

export default function SortHeroPage() {
  return <SortHeroClient />;
}
