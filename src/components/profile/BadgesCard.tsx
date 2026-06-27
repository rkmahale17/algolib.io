import { Award, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Badge {
  id: string;
  name: string;
  icon?: string;
  earnedAt?: string;
}

interface BadgesCardProps {
  badges?: Badge[];
  className?: string;
}

export const BadgesCard = ({ badges = [], className }: BadgesCardProps) => {
  const badgeCount = badges.length;
  const mostRecent = badges[0];

  return (
    <div className={cn("flex flex-col h-full p-5", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-semibold">Badges</span>
        </div>
        {badgeCount > 0 && (
          <button className="text-muted-foreground hover:text-primary transition-colors duration-200">
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Count */}
      <div className="text-3xl font-bold text-foreground tabular-nums mb-4">
        {badgeCount}
      </div>

      {/* Badge Display */}
      {badgeCount > 0 && mostRecent ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-3">
          {/* Badge Icon */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-lg animate-pulse" />
            {mostRecent.icon ? (
              <img
                src={mostRecent.icon}
                alt={mostRecent.name}
                className="w-16 h-16 relative z-10 object-contain drop-shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400/30 to-orange-500/30 border border-amber-400/30 flex items-center justify-center relative z-10">
                <Award className="w-8 h-8 text-amber-400" />
              </div>
            )}
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">
              Most Recent Badge
            </p>
            <p className="text-xs font-semibold text-foreground">{mostRecent.name}</p>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center flex-1 gap-3 py-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-muted/30 border border-dashed border-border/50 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-muted-foreground/30" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Solve problems to
              <br />
              earn badges
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
