import React from 'react';
import { cn } from '@/lib/utils';
import { BadgeConfig } from '@/constants/xpConfig';
import { Leaf, CalendarDays, Flame, Mountain, Trophy } from 'lucide-react';

export const BadgeSVG = ({ 
  className = "", 
  badge 
}: { 
  className?: string, 
  badge: BadgeConfig 
}) => {
  const idStr = React.useId().replace(/:/g, '');
  
  // Base hexagon points inscribed in 120x120 with radius 56
  // (60,4), (108.5,32), (108.5,88), (60,116), (11.5,88), (11.5,32)
  const hexPoints = "60,4 108.5,32 108.5,88 60,116 11.5,88 11.5,32";
  const innerHexPoints = "60,9 104,34.5 104,85.5 60,111 16,85.5 16,34.5"; // Slightly smaller for inner rim

  // Choose the activity icon if applicable
  const ActivityIcon = badge.type === 'activity' ? {
    sprout: Leaf,
    calendar: CalendarDays,
    flame: Flame,
    mountain: Mountain,
    trophy: Trophy
  }[badge.iconType || 'sprout'] : null;

  return (
    <div 
      className={cn("relative group inline-block", className, badge.color)}
      style={{ color: badge.hexColor }} // Force currentColor to be the exact hex color
    >
      {/* Outer Glow / Halo animation */}
      <div className="absolute inset-0 rounded-full blur-[20px] opacity-30 group-hover:opacity-60 transition-opacity duration-1000 bg-current animate-pulse" />
      
      <svg 
        viewBox="0 0 120 120" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-xl group-hover:scale-105 transition-transform duration-500 ease-out overflow-visible"
      >
        <defs>
          {/* Metallic Border Gradient - matching tier colors or generic silver */}
          <linearGradient id={`metal-ring-${idStr}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={badge.hexColor} stopOpacity="0.8" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="50%" stopColor={badge.hexColor} stopOpacity="0.4" />
            <stop offset="80%" stopColor="#000000" stopOpacity="0.6" />
            <stop offset="100%" stopColor={badge.hexColor} stopOpacity="0.9" />
          </linearGradient>

          {/* Dark Textured Background Gradient */}
          <linearGradient id={`dark-bg-${idStr}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#27272a" />
            <stop offset="50%" stopColor="#18181b" />
            <stop offset="100%" stopColor="#09090b" />
          </linearGradient>

          {/* Color Gradient using currentColor */}
          <linearGradient id={`color-grad-${idStr}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
          </linearGradient>

          {/* Filters */}
          <filter id={`inner-shadow-${idStr}`} x="-20%" y="-20%" width="140%" height="140%">
            <feOffset dx="0" dy="4"/>
            <feGaussianBlur stdDeviation="4" result="offset-blur"/>
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
            <feFlood floodColor="black" floodOpacity="0.8" result="color"/>
            <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
            <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
          </filter>

          <filter id={`drop-shadow-${idStr}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* 1. Base dark background with inner shadow */}
        <polygon 
          points={hexPoints}
          fill={`url(#dark-bg-${idStr})`}
          filter={`url(#inner-shadow-${idStr})`}
        />

        {/* Subtle grid pattern overlay for texture */}
        <g opacity="0.05">
          <path d="M0,20 L120,20 M0,40 L120,40 M0,60 L120,60 M0,80 L120,80 M0,100 L120,100" stroke="#ffffff" strokeWidth="1"/>
          <path d="M20,0 L20,120 M40,0 L40,120 M60,0 L60,120 M80,0 L80,120 M100,0 L100,120" stroke="#ffffff" strokeWidth="1"/>
        </g>

        {/* Background color glow behind logo */}
        <circle cx="60" cy="60" r="35" fill="currentColor" className="opacity-15 blur-xl" />

        {/* Laurels for Tier 3, 4, 5 */}
        {badge.tier >= 3 && (
          <g fill="currentColor" opacity="0.8" filter={`url(#drop-shadow-${idStr})`}>
            {/* Left Laurel */}
            <path d="M 12 70 C 5 60 5 45 15 35 C 10 45 10 60 20 70 Z" />
            <path d="M 16 80 C 8 70 8 55 18 45 C 13 55 13 70 24 80 Z" />
            <path d="M 22 90 C 14 80 14 65 24 55 C 19 65 19 80 30 90 Z" />
            <path d="M 30 98 C 22 88 22 73 32 63 C 27 73 27 88 38 98 Z" />
            
            {/* Right Laurel */}
            <path d="M 108 70 C 115 60 115 45 105 35 C 110 45 110 60 100 70 Z" />
            <path d="M 104 80 C 112 70 112 55 102 45 C 107 55 107 70 96 80 Z" />
            <path d="M 98 90 C 106 80 106 65 96 55 C 101 65 101 80 90 90 Z" />
            <path d="M 90 98 C 98 88 98 73 88 63 C 93 73 93 88 82 98 Z" />
          </g>
        )}

        {/* Crown for Tier 5 */}
        {badge.tier === 5 && (
          <g transform="translate(45, -12) scale(1.5)" fill="currentColor" filter={`url(#drop-shadow-${idStr})`}>
            <path d="M 2 15 L 5 5 L 10 10 L 15 5 L 18 15 Z" />
            <circle cx="5" cy="4" r="1.5" />
            <circle cx="10" cy="9" r="1.5" />
            <circle cx="15" cy="4" r="1.5" />
          </g>
        )}

        {/* Logo / Icon inside */}
        {badge.type === 'xp' ? (
          <g filter={`url(#drop-shadow-${idStr})`}>
            <g strokeWidth="4.5" strokeLinecap="square" strokeLinejoin="miter" fill="none">
              <g stroke={`url(#metal-ring-${idStr})`} strokeWidth="6" className="opacity-70">
                <polyline points="23,36 93,16 63,91" />
                <polyline points="26,43 82,27 54,97" />
                <polyline points="29,50 71,38 45,103" />
                <polyline points="32,57 60,49 36,109" />
              </g>
              <g stroke={`url(#color-grad-${idStr})`}>
                <polyline points="23,36 93,16 63,91" />
                <polyline points="26,43 82,27 54,97" />
                <polyline points="29,50 71,38 45,103" />
                <polyline points="32,57 60,49 36,109" />
              </g>
            </g>
          </g>
        ) : (
          ActivityIcon && (
            <svg x="30" y="30" width="60" height="60" className="drop-shadow-2xl opacity-90 text-current">
              <ActivityIcon size={60} strokeWidth={1.5} color="currentColor" />
            </svg>
          )
        )}

        {/* 3. Outer Thick Metallic Ring */}
        <polygon 
          points={hexPoints}
          fill="none" 
          stroke={`url(#metal-ring-${idStr})`} 
          strokeWidth="6"
          filter={`url(#drop-shadow-${idStr})`}
        />
        
        {/* Subtle inner highlight on the metallic ring */}
        <polygon 
          points={innerHexPoints}
          fill="none" 
          stroke="rgba(255,255,255,0.3)" 
          strokeWidth="1"
        />

        {/* Glass glare effect across the top half */}
        <path 
          d="M 11.5,32 L 60,4 L 108.5,32 L 108.5,60 Q 60,20 11.5,60 Z" 
          fill="white" 
          className="opacity-[0.03] mix-blend-overlay"
        />
      </svg>
    </div>
  );
};
