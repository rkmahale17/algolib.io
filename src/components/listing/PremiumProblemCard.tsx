import Link from "next/link";
import { Check, ArrowRight, Lock, Flame, FileCode2, Layout } from "lucide-react";
import { cn } from "@/lib/utils";
import { AlgorithmListItem, DIFFICULTY_MAP } from "@/types/algorithm";
import { Badge } from "@/components/ui/badge";
import { CollapsibleCategories } from "./CollapsibleCategories";

interface PremiumProblemCardProps {
    algorithm: AlgorithmListItem;
    status: 'none' | 'attempted' | 'solved';
    isPremium?: boolean;
    index: number;
    isFirst?: boolean;
    isLast?: boolean;
    disableRounding?: boolean;
    onCategoryClick?: (category: string, e: React.MouseEvent) => void;
}

const difficultyColors: Record<string, string> = {
    'Easy': 'text-green-500',
    'Medium': 'text-yellow-500',
    'Med': 'text-yellow-500',
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

export const PremiumProblemCard = ({ algorithm, status, isPremium: isPremiumProp, index, isFirst, isLast, disableRounding, onCategoryClick }: PremiumProblemCardProps) => {
    const isPremium = isPremiumProp ?? (algorithm.is_premium || algorithm.is_pro || algorithm.metadata?.is_pro);
    const rawDifficulty = algorithm.mappedDifficulty || DIFFICULTY_MAP[algorithm.difficulty?.toLowerCase()] || 'Medium';
    const displayDifficulty = rawDifficulty === 'Medium' ? 'Med' : rawDifficulty;

    const isLockedLink = algorithm.id === 'locked' || algorithm.slug === 'locked';

    return (
        <Link
            href={isLockedLink ? '/pricing' : (algorithm.slug ? `/problem/${algorithm.slug}` : `/problem/${algorithm.id}`)}
            className="group block relative w-full break-words"
        >
            <div className={cn(
                "flex items-center gap-3 sm:gap-6 p-4 sm:p-6 transition-all duration-500 ease-out",
                "bg-card hover:bg-accent/40 dark:hover:bg-accent/20",
                "border-x border-t border-border/40",
                !disableRounding && isFirst && "rounded-t-xl",
                !disableRounding && isLast && "rounded-b-xl border-b",
                (disableRounding || (!isFirst && !isLast)) && "rounded-none",
                disableRounding && isLast && "border-b",
                "shadow-sm hover:shadow-md z-0 hover:z-10 relative overflow-hidden"
            )}>
                {/* Status Indicator */}
                <div className="shrink-0 scale-90 sm:scale-100">
                    <StatusIcon status={status} isPremium={isPremium} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 min-w-0">
                        <h3 className="text-[15px] sm:text-[17px] font-normal text-foreground group-hover:text-black dark:group-hover:text-primary transition-colors duration-300 truncate">
                            {algorithm.serial_no || index + 1}. {algorithm.title || algorithm.name}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {isPremium && (
                                <div className="hidden sm:flex font-semibold px-3 py-0.5 h-6 rounded-full border border-primary/20 bg-primary/10 text-primary text-[10px] sm:text-[11px] uppercase tracking-wider items-center gap-1.5 select-none cursor-default">
                                    <Lock className="w-3 h-3" />
                                    Pro
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-[13px] sm:text-[14px] text-muted-foreground/80 line-clamp-1 max-w-2xl leading-relaxed font-normal">
                        {algorithm.description}
                    </p>

                    <div className="meta-info-row flex flex-wrap items-center gap-x-4 sm:gap-x-8 gap-y-1.5 text-[11px] sm:text-xs font-normal pt-1 w-full">
                        {/* Difficulty */}
                        <div className="difficulty-badge flex items-center shrink-0">
                            <Badge
                                variant="outline"
                                className={cn(
                                    "font-semibold px-3 py-0.5 h-6 rounded-full text-[10px] sm:text-[11px] select-none cursor-default border justify-center w-14",
                                    displayDifficulty === "Easy" && "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30",
                                    displayDifficulty === "Med" && "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
                                    displayDifficulty === "Hard" && "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30"
                                )}
                            >
                                {displayDifficulty}
                            </Badge>
                        </div>

                        {/* Category */}
                        {(() => {
                            const categories = (algorithm.category || '').split(',').map(c => c.trim()).filter(Boolean);
                            return (
                                <CollapsibleCategories
                                    categories={categories}
                                    onCategoryClick={onCategoryClick}
                                />
                            );
                        })()}
                    </div>
                </div>

                {/* Action Indicator */}
                <div className="shrink-0 flex items-center justify-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-muted-foreground/30 group-hover:text-primary group-hover:bg-primary/5 group-hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.15)] dark:group-hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] transition-all duration-300 transform group-hover:translate-x-1 border border-transparent group-hover:border-primary/10">
                        <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" strokeWidth={2} />
                    </div>
                </div>
            </div>
        </Link>
    );
};
