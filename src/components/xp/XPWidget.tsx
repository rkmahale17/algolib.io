'use client';

import { useXP } from '@/hooks/useXP';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

export const XPWidget = () => {
  const { totalXP, xpBadge, activityBadge, isLoading } = useXP();

  if (isLoading) {
    return (
      <div className="h-9 w-40 animate-pulse bg-muted/40 rounded-lg" />
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border/40 shadow-sm">
      <Star className="w-4 h-4 text-amber-400" />
      <span className="text-xs font-bold text-foreground">
        {totalXP.toLocaleString()} <span className="text-muted-foreground font-medium">XP</span>
      </span>
      
      {/* Show latest XP badge if any */}
      {xpBadge && (
        <>
          <div className="w-px h-3 bg-border/50 mx-1" />
          <div className="flex items-center gap-1 cursor-default" title={xpBadge.name}>
            <span className="text-sm">{xpBadge.icon}</span>
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
