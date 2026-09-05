import Link from "next/link";
import { getProblemUrl } from "@/utils/url";
import { Check, ArrowRight, Lock, Unlock, Flame, FileCode2, Layout, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { AlgorithmListItem, DIFFICULTY_MAP } from "@/types/algorithm";
import { Badge } from "@/components/ui/badge";
import { CollapsibleCategories } from "./CollapsibleCategories";
import { useApp } from "@/contexts/AppContext";

interface PremiumProblemCardProps {
    algorithm: AlgorithmListItem;
    status: 'none' | 'attempted' | 'solved';
    isPremium?: boolean;
    index: number;
    isFirst?: boolean;
    isLast?: boolean;
    disableRounding?: boolean;
    onCategoryClick?: (category: string, e: React.MouseEvent) => void;
    onClick?: (e: React.MouseEvent) => void;
    isSelected?: boolean;
    compact?: boolean;
    isPOTD?: boolean;
    potdCountdown?: { hours: number; minutes: number; seconds: number };
    reasonBadge?: React.ReactNode;
    showEstimatedTime?: boolean;
    ctaText?: string;
    noBorder?: boolean;
    showDetailsInCompact?: boolean;
    hideCategoryTags?: boolean;
    transparentBg?: boolean;
    hideAction?: boolean;
    categoriesOnSeparateRow?: boolean;
}

const difficultyColors: Record<string, string> = {
    'Easy': 'text-green-500',
    'Medium': 'text-yellow-500',
    'Med': 'text-yellow-500',
    'Hard': 'text-red-500',
};

const getEstimatedTime = (difficulty: string) => {
    const norm = difficulty.toLowerCase();
    if (['easy', 'beginner', 'beginners', 'begineers'].includes(norm)) return '15 min';
    if (['hard', 'advance', 'advanced', 'advacned', 'expert'].includes(norm)) return '45 min';
    return '25 min';
};

const StatusIcon = ({ status, isPremium, hasAccess, displayNo, isPOTD }: { status: string; isPremium?: boolean; hasAccess?: boolean; displayNo: number; isPOTD?: boolean }) => {
    if (status === 'solved') {
        if (isPremium) {
            return (
                <div className="relative w-9 h-9">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center bg-green-500 text-white shadow-sm">
                        <Check className="w-4.5 h-4.5" strokeWidth={3} />
                    </div>
                    {!hasAccess && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-primary text-primary-foreground border border-background flex items-center justify-center shadow-sm">
                            <Lock className="w-2 h-2" strokeWidth={2} />
                        </div>
                    )}
                </div>
            );
        }
        return (
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-green-500 text-white shadow-sm">
                <Check className="w-4.5 h-4.5" strokeWidth={3} />
            </div>
        );
    }
    if (isPOTD) {
        return (
            <div className="w-9 h-9 rounded-full flex items-center justify-center border border-primary/20 bg-primary/10 text-primary shadow-sm shadow-primary/5 transition-colors">
                <Calendar className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
            </div>
        );
    }
    if (isPremium) {
        if (!hasAccess) {
            return (
                <div className="w-9 h-9 rounded-full flex items-center justify-center border border-primary/20 bg-primary/10 text-primary shadow-sm shadow-primary/5">
                    <Lock className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
                </div>
            );
        }
        return (
            <div className="w-9 h-9 rounded-full flex items-center justify-center border border-amber-500/30 bg-amber-500/10 text-amber-600 shadow-sm shadow-amber-500/5 font-sans text-[14px] font-medium">
                {displayNo}
            </div>
        );
    }
    return (
        <div className="w-9 h-9 rounded-full flex items-center justify-center border border-border/60 text-muted-foreground transition-colors font-sans text-[14px] font-medium bg-muted/5">
            {displayNo}
        </div>
    );
};

export const PremiumProblemCard = ({ algorithm, status, isPremium: isPremiumProp, index, isFirst, isLast, disableRounding, onCategoryClick, onClick, isSelected, compact, isPOTD, potdCountdown, reasonBadge, showEstimatedTime, ctaText, noBorder, showDetailsInCompact, hideCategoryTags, transparentBg, hideAction, categoriesOnSeparateRow }: PremiumProblemCardProps) => {
    const { hasPremiumAccess } = useApp();
    const isPremium = isPremiumProp ?? (algorithm.is_premium || algorithm.is_pro || algorithm.metadata?.is_pro);
    const rawDifficulty = algorithm.mappedDifficulty || DIFFICULTY_MAP[algorithm.difficulty?.toLowerCase()] || 'Medium';
    const displayDifficulty = rawDifficulty === 'Medium' ? 'Med' : rawDifficulty;

    const displayTitle = algorithm.title || algorithm.name || '';
    const truncatedTitle = displayTitle.length > 36 ? `${displayTitle.substring(0, 36)}...` : displayTitle;

    const isLockedLink = algorithm.id === 'locked' || algorithm.slug === 'locked';

    const innerContent = (
        <div className={cn(
            isPOTD
                ? "flex items-center gap-3 sm:gap-6 px-4 py-3 sm:px-6 sm:py-3.5 transition-all duration-500 ease-out"
                : compact
                    ? "flex items-center gap-2.5 px-3 py-2.5 transition-all duration-300 ease-out"
                    : "flex items-center gap-3 sm:gap-6 p-4 sm:p-6 transition-all duration-500 ease-out",
            transparentBg
                ? "hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-300"
                : "bg-card hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-300",
            noBorder
                ? "border-none"
                : cn(
                    "border-x border-t border-border/40",
                    !disableRounding && isFirst && "rounded-t-xl",
                    !disableRounding && isLast && "rounded-b-xl border-b",
                    (disableRounding || (!isFirst && !isLast)) && "rounded-none",
                    disableRounding && isLast && "border-b"
                ),
            !compact && !noBorder && "shadow-sm hover:shadow-md z-0 hover:z-10 relative overflow-hidden",
            isSelected && "bg-muted dark:bg-muted/60"
        )}>
                {/* Status Indicator */}
                <div className={compact && !showDetailsInCompact ? "shrink-0" : "shrink-0 scale-90 sm:scale-100"}>
                    {compact && !showDetailsInCompact ? (
                        <div className={cn(
                            'w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-300',
                            status === 'solved'
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'bg-muted/5 border-muted-foreground/20'
                        )}>
                            <Check className="w-3 h-3" strokeWidth={3} style={{ opacity: status === 'solved' ? 1 : 0.3 }} />
                        </div>
                    ) : (
                        <StatusIcon status={status} isPremium={isPremium} hasAccess={hasPremiumAccess} displayNo={algorithm.serial_no || index + 1} isPOTD={isPOTD} />
                    )}
                </div>

                {/* Content */}
                {isPOTD ? (
                    <div className="flex-1 min-w-0 flex flex-row items-center justify-between gap-4">
                        <h3 className="font-normal text-foreground transition-colors duration-300 truncate text-[16px]">
                            <span>{truncatedTitle}</span>
                        </h3>
                        <div className="flex items-center gap-2 shrink-0">
                            {/* Daily Challenge Badge */}
                            <div className="font-semibold px-2.5 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-[10px] sm:text-[11px] tracking-wide select-none cursor-default flex items-center gap-1">
                                <span>🔥</span>
                                <span className="hidden xs:inline">Daily Challenge</span>
                                <span className="xs:hidden">Daily</span>
                            </div>
                            {/* Difficulty Badge */}
                            <div className={cn(
                                "font-semibold px-2.5 py-0.5 rounded-full border text-[10px] sm:text-[11px] select-none cursor-default justify-center transition-all duration-300",
                                displayDifficulty === "Easy" && "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30 group-hover:bg-green-500/20 group-hover:border-green-500/50 group-hover:shadow-[0_0_8px_rgba(34,197,94,0.4)]",
                                displayDifficulty === "Med" && "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30 group-hover:bg-yellow-500/20 group-hover:border-yellow-500/50 group-hover:shadow-[0_0_8px_rgba(234,179,8,0.4)]",
                                displayDifficulty === "Hard" && "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 group-hover:bg-red-500/20 group-hover:border-red-500/50 group-hover:shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                            )}>
                                {displayDifficulty}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={cn("flex-1 min-w-0", !compact && "space-y-1 sm:space-y-2")}>
                        <div className={cn(
                            "flex min-w-0",
                            showDetailsInCompact ? "flex-wrap items-center gap-x-3 gap-y-1.5" : "flex-col sm:flex-row sm:items-center gap-1 sm:gap-3"
                        )}>
                            <h3 className={cn(
                                "font-normal text-foreground transition-colors duration-300 flex items-center gap-1.5",
                                compact ? "text-[13px]" : "text-[16px]",
                                showDetailsInCompact ? "shrink-0 max-w-full truncate" : "truncate"
                            )}>
                                <span>{truncatedTitle}</span>
                                {reasonBadge && (
                                    <span className="shrink-0">{reasonBadge}</span>
                                )}
                            </h3>

                            {showDetailsInCompact && (
                                <div className="flex items-center gap-2 ml-auto">
                                    <div className="difficulty-badge flex items-center shrink-0">
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "font-semibold px-3 py-0.5 h-6 rounded-full text-[10px] sm:text-[11px] select-none cursor-default border justify-center w-14 transition-all duration-300",
                                                displayDifficulty === "Easy" && "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30 group-hover:bg-green-500/20 group-hover:border-green-500/50 group-hover:shadow-[0_0_8px_rgba(34,197,94,0.4)]",
                                                displayDifficulty === "Med" && "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30 group-hover:bg-yellow-500/20 group-hover:border-yellow-500/50 group-hover:shadow-[0_0_8px_rgba(234,179,8,0.4)]",
                                                displayDifficulty === "Hard" && "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 group-hover:bg-red-500/20 group-hover:border-red-500/50 group-hover:shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                                            )}
                                        >
                                            {displayDifficulty}
                                        </Badge>
                                    </div>
                                    {showEstimatedTime && (
                                        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-muted-foreground/80 bg-muted/40 px-2 py-0.5 rounded-full border border-border/30 h-6 select-none cursor-default">
                                            <Clock className="w-3.5 h-3.5 text-muted-foreground/60" />
                                            <span>{getEstimatedTime(rawDifficulty)}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {!compact && (
                            <>
                                {(() => {
                                const difficultyAndTime = (
                                    <>
                                        {/* Difficulty */}
                                        <div className="difficulty-badge flex items-center shrink-0">
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "font-semibold px-3 py-0.5 h-6 rounded-full text-[10px] sm:text-[11px] select-none cursor-default border justify-center w-14 transition-all duration-300",
                                                    displayDifficulty === "Easy" && "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30 group-hover:bg-green-500/20 group-hover:border-green-500/50 group-hover:shadow-[0_0_8px_rgba(34,197,94,0.4)]",
                                                    displayDifficulty === "Med" && "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30 group-hover:bg-yellow-500/20 group-hover:border-yellow-500/50 group-hover:shadow-[0_0_8px_rgba(234,179,8,0.4)]",
                                                    displayDifficulty === "Hard" && "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 group-hover:bg-red-500/20 group-hover:border-red-500/50 group-hover:shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                                                )}
                                            >
                                                {displayDifficulty}
                                            </Badge>
                                        </div>

                                        {/* Estimated Time */}
                                        {showEstimatedTime && (
                                            <div className="time-badge flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-muted-foreground/80 bg-muted/40 px-2 py-0.5 rounded-full border border-border/30 h-6 select-none cursor-default shrink-0">
                                                <Clock className="w-3.5 h-3.5 text-muted-foreground/60" />
                                                <span>{getEstimatedTime(rawDifficulty)}</span>
                                            </div>
                                        )}
                                    </>
                                );

                                const categories = (!isPOTD && !hideCategoryTags) ? (algorithm.category || '').split(',').map(c => c.trim()).filter(Boolean) : [];
                                const hasCategories = categories.length > 0;

                                if (categoriesOnSeparateRow) {
                                    return (
                                        <div className="flex flex-col gap-1.5 pt-1 w-full">
                                            <div className="meta-info-row flex flex-nowrap items-center gap-x-3 sm:gap-x-4 text-[11px] sm:text-xs font-normal w-full overflow-hidden">
                                                {difficultyAndTime}
                                            </div>
                                            {hasCategories && (
                                                <div className="meta-info-row flex flex-nowrap items-center w-full overflow-hidden">
                                                    <CollapsibleCategories
                                                        categories={categories}
                                                        onCategoryClick={onCategoryClick}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                }

                                return (
                                    <div className="flex pt-1 w-full">
                                        <div className="meta-info-row flex flex-nowrap items-center gap-x-2 sm:gap-x-3 text-[11px] sm:text-xs font-normal w-full overflow-hidden">
                                            {difficultyAndTime}
                                            {hasCategories && (
                                                <div className="flex items-center min-w-0 flex-1">
                                                    <CollapsibleCategories
                                                        categories={categories}
                                                        onCategoryClick={onCategoryClick}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                                })()}
                            </>
                        )}
                    </div>
                )}

                {/* Action Indicator */}
                {!hideAction && (
                    compact && !showDetailsInCompact ? (
                        <div className="shrink-0 text-muted-foreground/30 group-hover:text-primary transition-colors group-hover:translate-x-1 transition-transform">
                            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                        </div>
                    ) : (
                        <div className="shrink-0 flex items-center gap-3 justify-center">
                            {ctaText && (
                                <span className="hidden xs:inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide px-3 py-1 rounded-md bg-muted/50 text-muted-foreground border border-border/50 group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                                    {ctaText}
                                </span>
                            )}
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-muted-foreground/30 group-hover:text-foreground group-hover:bg-muted/50 group-hover:shadow-sm transition-all duration-300 transform group-hover:translate-x-1.5 border border-transparent group-hover:border-border/50">
                                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" strokeWidth={2} />
                            </div>
                        </div>
                    )
                )}
            </div>
    );

    if (onClick) {
        return (
            <div
                role="button"
                tabIndex={0}
                onClick={onClick}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(e as any); }}
                className="group block relative w-full break-words cursor-pointer"
            >
                {innerContent}
            </div>
        );
    }

    return (
        <Link
            href={isLockedLink ? '/pricing' : getProblemUrl(algorithm)}
            className="group block relative w-full break-words"
        >
            {innerContent}
        </Link>
    );
};
