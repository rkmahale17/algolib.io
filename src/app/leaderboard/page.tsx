import { Metadata } from 'next';
import LeaderboardClient from './LeaderboardClient';

export const metadata: Metadata = {
  title: 'Leaderboard | RulCode',
  description: 'See the top performers and competition rankings on RulCode.',
};

export default function LeaderboardPage() {
  return <LeaderboardClient />;
}
