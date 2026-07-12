"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Flame, TrendingUp, Star, CheckCircle2 } from 'lucide-react';
import { useGlobalRank } from '@/hooks/useGlobalRank';
import { useXP } from '@/hooks/useXP';
import { useApp } from '@/contexts/AppContext';

interface StatsRowProps {
  totalSolved: number;
  solvedThisWeek: number;
  currentStreak: number;
}

export const StatsRow = ({ totalSolved, solvedThisWeek, currentStreak }: StatsRowProps) => {
  const { user } = useApp();
  const { data: rankData } = useGlobalRank(user?.id);
  const { totalXP } = useXP(user?.id);
  
  const hasEnoughXP = totalXP >= 500;

  const statItems = [
    {
      icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
      value: totalSolved,
      label: 'Problems solved',
    },
    {
      icon: <TrendingUp className="w-4 h-4 text-zinc-500" />,
      value: solvedThisWeek,
      label: 'Solved this week',
    },
    {
      icon: <Flame className="w-4 h-4 text-orange-500" />,
      value: currentStreak,
      label: 'Day streak',
    },
    {
      icon: <Star className="w-4 h-4 text-indigo-400" />,
      value: (hasEnoughXP && rankData) ? `#${rankData.rank.toLocaleString()}` : 'Unranked',
      label: (hasEnoughXP && rankData) ? `Global rank · Top ${rankData.percentile}%` : (totalXP < 500 ? `${totalXP}/500 Points to rank` : 'Solve to rank'),
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statItems.map((item, i) => (
        <Card key={i} className="bg-[#111111] border-[#222] p-4 flex flex-col justify-center rounded-xl shadow-lg hover:border-[#333] transition-colors">
          <div className="flex items-start justify-between mb-2">
            {item.icon}
          </div>
          <div className="text-3xl font-bold text-white mb-1 tracking-tight font-sans">
            {item.value}
          </div>
          <div className="text-[11px] text-zinc-500 font-medium tracking-wide">
            {item.label}
          </div>
        </Card>
      ))}
    </div>
  );
};
