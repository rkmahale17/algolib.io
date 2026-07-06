"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { AlgorithmListItem } from '@/types/algorithm';
import type { UserAlgorithmData } from '@/types/userAlgorithmData';
import Link from 'next/link';

interface ActiveQuestCardProps {
  algorithm?: AlgorithmListItem | null;
  progress?: UserAlgorithmData | null;
}

export const ActiveQuestCard = ({ algorithm, progress }: ActiveQuestCardProps) => {
  if (!algorithm) {
    return (
      <Card className="bg-[#111111] border-[#222] shadow-xl overflow-hidden font-mono p-6 mb-6 rounded-xl">
        <div className="flex items-center gap-2 mb-6 opacity-70">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
          </div>
          <span className="text-[10px] text-zinc-500 ml-2">~/rulcode/quests/active</span>
        </div>
        <div className="text-zinc-400 text-sm mb-4">No active quest found. Start your journey!</div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-black font-sans font-bold">
          <Link href="/dsa/problems">Browse Problems</Link>
        </Button>
      </Card>
    );
  }

  // Calculate checkpoints
  const STEPS = ['solution_completed', 'visualization_completed', 'drawing_completed', 'completed'];
  let cleared = 0;
  if (progress) {
    STEPS.forEach((key) => {
      if (progress[key as keyof UserAlgorithmData]) cleared++;
    });
  }
  const total = STEPS.length;
  const pct = Math.round((cleared / total) * 100);

  const tags = algorithm.category ? algorithm.category.split(',').map(t => t.trim()) : [];

  return (
    <Card className="bg-[#0A0A0A] border-[#222] shadow-xl overflow-hidden font-mono mb-6 rounded-2xl relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 pointer-events-none" />
      
      <div className="px-6 py-4 border-b border-[#222]/50 flex items-center gap-3 bg-[#111]/50">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
        </div>
        <span className="text-[11px] text-zinc-500 tracking-wider">~/rulcode/quests/active</span>
      </div>

      <div className="p-6 sm:p-8">
        <div className="text-xs text-primary/80 font-semibold tracking-wider mb-2 uppercase flex items-center gap-2">
          <span>ACTIVE QUEST</span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-400">{tags[0] || 'ALGORITHMS'}</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-sans tracking-tight">
          {algorithm.title || algorithm.name}
        </h3>
        
        <div className="text-[11px] text-zinc-500 mb-6 flex items-center gap-2 font-sans">
          <span>Step {Math.min(cleared + 1, total)} of {total}</span>
          <span>·</span>
          <span>Last touched recently</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 font-sans">
          {tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-[10px] text-primary/80 bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between mt-8 relative z-10 font-sans">
          <div className="w-full sm:w-2/3">
            <div className="h-1.5 w-full bg-[#222] rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(var(--primary),0.5)]" 
                style={{ width: `${pct}%` }} 
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-zinc-500">
              <span>{cleared} of {total} checkpoints cleared</span>
              <span className="text-primary font-mono">{pct}%</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
            <Button asChild variant="outline" className="flex-1 sm:flex-none border-[#333] hover:bg-[#222] text-zinc-300 bg-transparent text-xs h-10 px-6 rounded-lg">
              <Link href="/dsa/problems">Switch quest</Link>
            </Button>
            <Button asChild className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-black font-bold shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.5)] transition-all text-xs h-10 px-6 rounded-lg">
              <Link href={algorithm.slug ? `/problem/${algorithm.slug}` : `/problem/${algorithm.id}`}>
                <Play className="w-3.5 h-3.5 mr-2" fill="currentColor" /> Resume Journey
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
