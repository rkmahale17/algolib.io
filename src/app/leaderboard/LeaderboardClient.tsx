'use client';
import dynamic from 'next/dynamic';
const Leaderboard = dynamic(() => import('@/pages/Leaderboard'), { ssr: false });
export default function LeaderboardClient() { return <Leaderboard />; }
