'use client';

import { useXP } from '@/hooks/useXP';
import { cn } from '@/lib/utils';
import { Coins } from 'lucide-react';

export const XPWidget = () => {
  const { totalXP, xpBadge, activityBadge, isLoading } = useXP();

  if (isLoading) {
    return (
      <div className="h-9 w-40 animate-pulse bg-muted/40 rounded-lg" />
    );
  }

  return (
    <div className="flex items-center gap-2 px-4 h-8 rounded-full bg-muted/30 border border-border/80 text-foreground shrink-0">
      <Coins className="w-4 h-4 text-muted-foreground" />
      <span className="text-xs font-bold text-foreground">
        <span className="text-yellow-500">{totalXP.toLocaleString()}</span> <span className="text-muted-foreground font-medium">Points</span>
      </span>
      
      {/* Show latest XP badge if any */}
      {xpBadge && (
        <>
          <div className="w-px h-3 bg-border/50 mx-1" />
          <div className="flex items-center gap-1 cursor-default text-xs font-bold text-muted-foreground" title={xpBadge.name}>
            Rank <span className="text-sm ml-0.5">{xpBadge.icon}</span>
          </div>
        </>
      )}

      {/* Show latest Activity badge if any */}
      {activityBadge && (
        <>
          <div className="w-px h-3 bg-border/50 mx-1" />
          <div className="flex items-center gap-1 cursor-default" title={activityBadge.name}>
            <span className="text-sm">{activityBadge.icon}</span>
          </div>
        </>
      )}
    </div>
  );
};
