import { Metadata } from 'next';
import DPPuzzleClient from './DPPuzzleClient';

export const metadata: Metadata = {
  title: 'DP Puzzle - Master Dynamic Programming | RulCode',
  description: 'Master dynamic programming patterns through interactive puzzles and visualizations.',
};

export default function DPPuzzlePage() {
  return <DPPuzzleClient />;
}
