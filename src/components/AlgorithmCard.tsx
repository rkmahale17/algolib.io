import { Check, Circle, Lock, ArrowRight, Timer, Database, Zap, BookOpen } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AlgorithmListItem, DIFFICULTY_MAP } from "@/types/algorithm";
import { cn } from "@/lib/utils";
import { CollapsibleCategories } from "./listing/CollapsibleCategories";

interface AlgorithmCardProps {
    algorithm: AlgorithmListItem;
    status: 'solved' | 'attempted' | 'none';
    isPremium?: boolean;
    index?: number;
    isSidebar?: boolean;
    hasPremiumAccess?: boolean;
    isPaywallEnabled?: boolean;
    onCategoryClick?: (category: string, e: React.MouseEvent) => void;
}

const difficultyColors: Record<string, string> = {
    'Easy': 'text-green-500 bg-green-500/10 border-green-500/20',
    'Medium': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    'Med': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    'Hard': 'text-red-500 bg-red-500/10 border-red-500/20',
};

export const AlgorithmCard = ({ algorithm, status, isPremium, index, isSidebar, hasPremiumAccess, isPaywallEnabled, onCategoryClick }: AlgorithmCardProps) => {
    const displayTitle = algorithm.title || algorithm.name || '';
    const serialNo = algorithm.serial_no || (index !== undefined ? index + 1 : null);
    const rawDifficulty = algorithm.mappedDifficulty || DIFFICULTY_MAP[algorithm.difficulty?.toLowerCase()] || 'Medium';
    const displayDifficulty = rawDifficulty === 'Medium' ? 'Med' : rawDifficulty;

    return (
        <Link
            href={algorithm.slug ? `/problem/${algorithm.slug}` : `/problem/${algorithm.id}`}
            className="group block relative max-w-[800px] m-auto border border-gray-100 dark:border-gray-800 -mb-px first:rounded-tl-xl first:rounded-tr-xl last:rounded-bl-xl last:rounded-br-xl last:mb-0 overflow-hidden transition-colors hover:bg-muted/20"
        >
            <div className={cn(
                "flex items-center gap-4 justify-between",
                isSidebar ? "px-4 py-3" : "px-6 py-4 md:px-8 md:py-5 md:gap-6"
            )}>
                {/* Status Icon */}
                <div className="shrink-0 pt-1">
                    {status === 'solved' ? (
                        <div className={cn("rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/20", isSidebar ? "w-6 h-6" : "w-8 h-8")}>
                            <Check className={cn("stroke-[3]", isSidebar ? "w-4 h-4" : "w-5 h-5")} />
                        </div>
                    ) : status === 'attempted' ? (
                        <div className={cn("rounded-full border-2 border-orange-400 flex items-center justify-center text-orange-400", isSidebar ? "w-6 h-6" : "w-8 h-8")}>
                            <Circle className={cn("fill-orange-400", isSidebar ? "w-4 h-4" : "w-5 h-5")} />
                        </div>
                    ) : (
                        <div className={cn("rounded-full border-2 border-border/60 flex items-center justify-center text-muted-foreground/10 transition-colors", isSidebar ? "w-6 h-6" : "w-8 h-8")}>
                            <Check className={cn("stroke-[3]", isSidebar ? "w-4 h-4" : "w-5 h-5")} />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1.5 md:space-y-2">
                    <div className="flex items-center flex-wrap gap-2">
                        <h3 className={cn("font-medium tracking-tight transition-colors truncate", isSidebar ? "text-sm" : "text-md")}>
                            {serialNo ? `${serialNo}. ` : ''}{displayTitle}
                        </h3>


                        {isPremium && (
                            <Badge variant="secondary" className={cn("hidden sm:flex bg-primary/10 text-primary border-primary/20 px-3 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold items-center gap-1.5 h-6 uppercase tracking-wider shadow-none select-none cursor-default shrink-0", isSidebar ? "scale-90" : "")}>
                                {isPaywallEnabled && !hasPremiumAccess && <Lock className="w-2.5 h-2.5" />}
                                PRO
                            </Badge>
                        )}
                    </div>

                    {!isSidebar && (
                        <p className="text-muted-foreground text-[14px] leading-relaxed line-clamp-2 max-w-3xl opacity-80">
                            {algorithm.description}
                        </p>
                    )}

                    {/* Meta Info */}
                    <div className={cn("meta-info-row flex flex-wrap items-center gap-y-1.5 w-full", isSidebar ? "gap-x-3" : "gap-x-5")}>
                        {/* Difficulty */}
                        <div className="difficulty-badge flex items-center gap-1.5 shrink-0">
                            <div className={cn(
                                "flex items-center justify-center gap-1 px-3 py-0.5 rounded-full border font-semibold uppercase tracking-wider h-6 select-none cursor-default shrink-0",
                                difficultyColors[displayDifficulty] || difficultyColors['Medium'],
                                isSidebar ? "text-[7px] h-5 px-1.5 w-12" : "text-[9px] sm:text-[10px] w-[70px]"
                            )}>
                                {!isSidebar && <Zap className="w-2.5 h-2.5" />}
                                {displayDifficulty}
                            </div>
                        </div>

                        {/* Category */}
                        {(() => {
                            const categories = (algorithm.category || '').split(',').map(c => c.trim()).filter(Boolean);
                            return (
                                <CollapsibleCategories
                                    categories={categories}
                                    onCategoryClick={onCategoryClick}
                                    isSidebar={isSidebar}
                                />
                            );
                        })()}

                        {!isSidebar && algorithm.metadata?.likes && (
                            <div className="likes-badge flex items-center gap-1.5 text-muted-foreground/40">
                                <Check className="w-3.5 h-3.5" />
                                <span className="text-[11px]">{(algorithm.metadata.likes / 1000).toFixed(1)}k done</span>
                            </div>
                        )}

                        {serialNo && !isSidebar && (
                            <div className="serial-badge ml-auto pointer-events-none  transition-opacity flex items-center gap-1 text-bg font-mono text-[10px]">
                                ALGO-{serialNo.toString().padStart(2, '0')}
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Arrow */}
                <div className="shrink-0 self-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-muted-foreground/30 group-hover:text-primary group-hover:bg-primary/5 group-hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.15)] dark:group-hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] transition-all duration-300 transform group-hover:translate-x-1 border border-transparent group-hover:border-primary/10">
                        <ArrowRight className={cn(isSidebar ? "w-4 h-4" : "w-5 h-5")} strokeWidth={2} />
                    </div>
                </div>
            </div>
        </Link>
    );
};
