import { Link } from "react-router-dom";
import { Check, ArrowRight, Circle, Lock, Flame, FileCode2, Layout } from "lucide-react";
import { cn } from "@/lib/utils";
import { AlgorithmListItem } from "@/types/algorithm";

interface PremiumProblemCardProps {
    algorithm: AlgorithmListItem;
    status: 'none' | 'attempted' | 'solved';
    isPremium?: boolean;
    index: number;
    isFirst?: boolean;
    isLast?: boolean;
}

const difficultyColors: Record<string, string> = {
    'Easy': 'text-green-500',
    'Medium': 'text-yellow-500',
    'Hard': 'text-red-500',
};

const StatusIcon = ({ status, isPremium }: { status: string; isPremium?: boolean }) => {
    if (isPremium) return (
        <div className="w-8 h-8 rounded-full flex items-center justify-center border border-muted-foreground/10 bg-muted/5">
            <Lock className="w-3.5 h-3.5 text-muted-foreground/40" strokeWidth={1.5} />
        </div>
    );
    if (status === 'solved') return (
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-500 text-white shadow-sm">
            <Check className="w-4 h-4 " strokeWidth={3} />
        </div>
    );
    return (
        <div className="w-8 h-8 rounded-full flex items-center justify-center border border-muted-foreground/10 bg-muted/5 transition-colors disabled:opacity-50  ">
            <Check className="w-4 h-4 bg-muted/5 text-muted-foreground/40" strokeWidth={3} />
        </div>
    );
};

export const PremiumProblemCard = ({ algorithm, status, isPremium: isPremiumProp, index, isFirst, isLast }: PremiumProblemCardProps) => {
    const isPremium = isPremiumProp ?? (algorithm.is_premium || algorithm.is_pro || algorithm.metadata?.is_pro);
    const difficulty = algorithm.difficulty?.charAt(0).toUpperCase() + algorithm.difficulty?.slice(1).toLowerCase() || 'Medium';
    const displayDifficulty = ['Easy', 'Medium', 'Hard'].includes(difficulty) ? difficulty : 'Medium';

    return (
        <Link
            to={algorithm.slug ? `/problem/${algorithm.slug}` : `/problem/${algorithm.id}`}
            className="group block relative w-full break-words"
        >
            <div className={cn(
                "flex items-center gap-3 sm:gap-6 p-4 sm:p-6 transition-all duration-300",
                "bg-card hover:bg-muted/15",
                "border-x border-t border-border/40",
                isFirst && "rounded-t-xl",
                isLast && "rounded-b-xl border-b",
                !isFirst && !isLast && "rounded-none",
                "shadow-sm hover:shadow-md z-0 hover:z-10 relative overflow-hidden"
            )}>
                {/* Status Indicator */}
                <div className="shrink-0 scale-90 sm:scale-100">
                    <StatusIcon status={status} isPremium={isPremium} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 min-w-0">
                        <h3 className="text-[15px] sm:text-[17px] font-normal text-foreground transition-colors truncate">
                            {algorithm.serial_no || index + 1}. {algorithm.title || algorithm.name}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {index === 0 && (
                                <div className="px-2 sm:px-3 py-0.5 rounded-full border border-orange-200 bg-orange-50/50 text-orange-500 text-[9px] sm:text-[10px] uppercase tracking-wider dark:border-orange-200 dark:bg-white dark:text-orange-500">
                                    Warm up
                                </div>
                            )}
                            {isPremium && (
                                <div className="px-2 sm:px-3 py-0.5 rounded-full border border-yellow-200 bg-yellow-50/50 text-yellow-600 text-[9px] sm:text-[10px] uppercase tracking-wider flex items-center gap-1 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
                                    <Lock className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5" />
                                    Pro
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-[13px] sm:text-[14px] text-muted-foreground/80 line-clamp-1 max-w-2xl leading-relaxed font-normal">
                        {algorithm.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-8 gap-y-2 text-[11px] sm:text-xs font-normal pt-1">
                        {/* Category */}
                        <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground/70">
                            {algorithm.category.toLowerCase().includes('ui') || algorithm.category.toLowerCase().includes('css') ? (
                                <Layout className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                            ) : (
                                <FileCode2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                            )}
                            <span className="text-[11px] sm:text-[12px]">{algorithm.category}</span>
                        </div>

                        {/* Difficulty */}
                        <div className={cn("flex items-center gap-1 sm:gap-1.5", difficultyColors[displayDifficulty])}>
                            <Flame className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-current" />
                            <span className="text-[11px] sm:text-[12px]">{displayDifficulty}</span>
                        </div>
                    </div>
                </div>

                {/* Action Indicator */}
                <div className="shrink-0 flex items-center justify-center w-6 sm:w-8 text-muted-foreground/30 transition-transform duration-300">
                    <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" strokeWidth={1.5} />
                </div>
            </div>
        </Link>
    );
};
