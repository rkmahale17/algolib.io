'use client';

import { useXP } from '@/hooks/useXP';
import { XP_BADGES, ACTIVITY_BADGES, BadgeConfig } from '@/constants/xpConfig';
import { BadgeSVG } from './BadgeSVG';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowRight, Sparkles, Star, CalendarDays } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// The new Shield Card wrapper for Badges
const ShieldCard = ({ badge, isEarned, currentValue, children }: { badge: BadgeConfig, isEarned: boolean, currentValue: number, children: React.ReactNode }) => {
  const color = isEarned ? badge.hexColor : '#555555';
  
  return (
    <div className={cn("relative w-full min-h-[220px] h-full flex flex-col items-center p-3 sm:p-4 transition-all duration-300",  
      isEarned ? "hover:-translate-y-2 hover:shadow-2xl" : "opacity-60 grayscale hover:opacity-80"
    )}>
      {/* SVG Background Shield */}
      <svg 
        className="absolute inset-0 w-full h-full drop-shadow-xl" 
        preserveAspectRatio="none" 
        viewBox="0 0 100 130"
      >
        <defs>
          <linearGradient id={`glow-top-${badge.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Main Shield Body */}
        <path 
          d="M 5 10 C 5 4, 9 0, 15 0 L 85 0 C 91 0, 95 4, 95 10 L 95 105 C 95 110, 92 114, 88 116 L 55 128 C 52 129, 48 129, 45 128 L 12 116 C 8 114, 5 110, 5 105 Z" 
          className="fill-zinc-50 dark:fill-[#111216]"
          stroke={color}
          strokeWidth="1.5"
          strokeOpacity={isEarned ? "0.4" : "0.2"}
        />
        {/* Top Glow */}
        <path 
          d="M 5 25 L 5 10 C 5 4, 9 0, 15 0 L 85 0 C 91 0, 95 4, 95 10 L 95 25 Z" 
          fill={`url(#glow-top-${badge.id})`}
        />
      </svg>
      
      <div className="relative z-10 flex flex-col items-center h-full w-full justify-start text-center">
        {children}
        
        {/* Progress Bar for unearned badges */}
        {!isEarned && (
          <div className="mt-auto w-full pt-3 pb-1 space-y-1">
            <div className="flex justify-between text-[10px] text-zinc-500 font-medium px-1">
              <span>{currentValue}</span>
              <span>{badge.threshold}</span>
            </div>
            <div className="h-1 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-zinc-400 dark:bg-zinc-600 rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, (currentValue / badge.threshold) * 100))}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const BadgeItem = ({ 
  badge, 
  isEarned, 
  currentValue 
}: { 
  badge: BadgeConfig; 
  isEarned: boolean;
  currentValue: number;
}) => {
  const Icon = badge.type === 'activity' ? CalendarDays : Star;

  const innerContent = (
    <ShieldCard badge={badge} isEarned={isEarned} currentValue={currentValue}>
      <div className="relative mt-2 mb-2">
        <BadgeSVG badge={badge} className="w-24 h-24" />
      </div>
      
      <div className="flex flex-col items-center flex-1 w-full">
        <div 
          className="text-[9px] tracking-[0.2em] font-bold mb-1" 
          style={{ color: isEarned ? badge.hexColor : '#888' }}
        >
          RULCODE
        </div>
        
        <h4 className="text-sm sm:text-base font-bold mb-1 text-zinc-900 dark:text-white leading-tight px-1">
          {badge.name}
        </h4>
        
        <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 mb-3">
          {badge.description}
        </p>
        
        {/* Pill at the bottom */}
        {isEarned && (
          <div className="mt-auto flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-black/60 border border-zinc-200 dark:border-white/10 shadow-inner">
            <Icon className="w-3 h-3" style={{ color: badge.hexColor }} fill={badge.hexColor} fillOpacity={0.2} />
            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{badge.threshold.toLocaleString()}</span>
          </div>
        )}
      </div>
    </ShieldCard>
  );

  if (!isEarned) return innerContent;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full text-left outline-none">
          {innerContent}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white overflow-hidden p-0 gap-0">
        <DialogTitle className="sr-only">Achievement Unlocked</DialogTitle>
        <div className="relative w-full flex flex-col items-center justify-center py-16 px-8 text-center min-h-[420px]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300%] h-[300px] bg-gradient-to-b from-zinc-100 dark:from-white/10 to-transparent blur-[50px] pointer-events-none rounded-[100%]" />
          <div className="relative z-10 flex flex-col items-center h-full w-full justify-center">
            <h2 className="text-2xl md:text-3xl font-light text-primary mb-12 animate-in slide-in-from-bottom-2 fade-in duration-700">
              Congratulations
            </h2>
            
            <div className="relative mb-12 animate-in zoom-in fade-in duration-1000 delay-300">
              <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full animate-pulse" />
              <BadgeSVG badge={badge} className="w-48 h-48 drop-shadow-2xl animate-[float_4s_ease-in-out_infinite]" />
              <Sparkles className="absolute -top-6 -left-8 w-6 h-6 text-primary/70 animate-pulse delay-75" />
              <Sparkles className="absolute -bottom-4 -right-6 w-5 h-5 text-zinc-300 animate-pulse delay-300" />
              <Sparkles className="absolute top-1/2 -translate-y-1/2 -right-12 w-4 h-4 text-white animate-pulse delay-500" />
            </div>

            <h3 className="text-xl md:text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3 animate-in slide-in-from-bottom-2 fade-in duration-700 delay-150">
              {badge.name} Badge!
            </h3>
            
            <div className="text-sm tracking-widest text-zinc-500 dark:text-zinc-400 uppercase font-medium animate-in fade-in duration-700 delay-700">
              {badge.description.replace('Earned for ', '')}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Section Divider for the Grid View
const Divider = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center w-full my-8">
    <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent flex-1" />
    <h3 className="text-sm font-semibold text-green-500 uppercase tracking-widest px-4 flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
      {title}
      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
    </h3>
    <div className="h-px bg-gradient-to-r from-green-500/50 via-transparent to-transparent flex-1" />
  </div>
);

export const BadgesPanel = ({ userId }: { userId?: string }) => {
  const { totalXP, activeDaysThisYear, xpBadge, activityBadge, isLoading } = useXP(userId);

  if (isLoading) {
    return (
      <Card className="w-full animate-pulse border-border/40">
        <div className="h-40 bg-muted/20" />
      </Card>
    );
  }

  const displayXpBadge = xpBadge || XP_BADGES[0];
  const displayActivityBadge = activityBadge || ACTIVITY_BADGES[0];
  const hasXpBadge = !!xpBadge;
  const hasActivityBadge = !!activityBadge;

  return (
    <Card className="w-full bg-card border-border/40 shadow-sm overflow-hidden h-full flex flex-col">
      <CardHeader className="border-b border-border/40 bg-muted/10 px-5 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold tracking-wide flex items-center gap-2">
            <span>🏆</span> Top Achievements
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold text-primary hover:text-primary">
                View all
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </DialogTrigger>
            
            {/* The Full View All Modal */}
            <DialogContent className="max-w-[1200px] w-[95vw] bg-white dark:bg-[#0a0c10] border-zinc-200 dark:border-zinc-800 p-6 sm:p-10 max-h-[90vh] overflow-y-auto">
              <DialogTitle className="sr-only">All Achievements</DialogTitle>
              
              <div className="w-full mx-auto space-y-12">
                
                <div>
                  <Divider title="Experience Badges" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
                    {XP_BADGES.map(badge => (
                      <BadgeItem 
                        key={badge.id} 
                        badge={badge} 
                        isEarned={totalXP >= badge.threshold} 
                        currentValue={totalXP}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Divider title="Activity Badges" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
                    {ACTIVITY_BADGES.map(badge => (
                      <BadgeItem 
                        key={badge.id} 
                        badge={badge} 
                        isEarned={activeDaysThisYear >= badge.threshold} 
                        currentValue={activeDaysThisYear}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      {/* Top badges displayed on the profile card */}
      <CardContent className="p-5 flex-1 flex flex-col justify-center bg-white dark:bg-[#0a0c10]">
        <div className="grid grid-cols-2 gap-4 h-full">
          {/* Highest XP Badge */}
          {hasXpBadge ? (
            <BadgeItem badge={displayXpBadge} isEarned={true} currentValue={totalXP} />
          ) : (
            <BadgeItem badge={XP_BADGES[0]} isEarned={false} currentValue={totalXP} />
          )}

          {/* Highest Activity Badge */}
          {hasActivityBadge ? (
            <BadgeItem badge={displayActivityBadge} isEarned={true} currentValue={activeDaysThisYear} />
          ) : (
            <BadgeItem badge={ACTIVITY_BADGES[0]} isEarned={false} currentValue={activeDaysThisYear} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
