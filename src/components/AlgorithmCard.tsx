import { Check, Circle, Lock, ArrowRight, Timer, Database, Zap, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { AlgorithmListItem } from "@/types/algorithm";
import { cn } from "@/lib/utils";

interface AlgorithmCardProps {
    algorithm: AlgorithmListItem;
    status: 'solved' | 'attempted' | 'none';
    isPremium?: boolean;
    index?: number;
    isSidebar?: boolean;
}

const difficultyColors: Record<string, string> = {
    'Easy': 'text-green-500 bg-green-500/10 border-green-500/20',
    'Medium': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    'Hard': 'text-red-500 bg-red-500/10 border-red-500/20',
};

export const AlgorithmCard = ({ algorithm, status, isPremium, index, isSidebar }: AlgorithmCardProps) => {
    const displayTitle = algorithm.title || algorithm.name || '';
    const serialNo = algorithm.serial_no || (index !== undefined ? index + 1 : null);

    return (
        <Link
            to={algorithm.slug ? `/problem/${algorithm.slug}` : `/problem/${algorithm.id}`}
            className="group block relative max-w-[800px] m-auto border border-gray-100 dark:border-gray-800 -mb-px first:rounded-tl-xl first:rounded-tr-xl last:rounded-bl-xl last:rounded-br-xl last:mb-0 overflow-hidden transition-colors hover:bg-muted/30"
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
                        <div className={cn("rounded-full border-2 border-border/60 flex items-center justify-center text-muted-foreground/10 group-hover:border-primary/20 transition-colors", isSidebar ? "w-6 h-6" : "w-8 h-8")}>
                            <Check className={cn("stroke-[3]", isSidebar ? "w-4 h-4" : "w-5 h-5")} />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1.5 md:space-y-2">
                    <div className="flex items-center flex-wrap gap-2">
                        <h3 className={cn("font-medium tracking-tight transition-colors truncate", isSidebar ? "text-sm" : "text-md")}>
                            {displayTitle}
                        </h3>


                        {isPremium && (
                            <Badge variant="secondary" className={cn("bg-yellow-500/20 text-yellow-700 dark:text-yellow-500 border-none px-2 py-0 rounded-full font- text-[9px] flex items-center gap-1", isSidebar ? "scale-90" : "")}>
                                {isSidebar ? <Lock className="w-2.5 h-2.5" /> : <Zap className="w-2.5 h-2.5 fill-current" />}
                                {isSidebar ? "PR" : "PREMIUM"}
                            </Badge>
                        )}
                    </div>

                    {!isSidebar && (
                        <p className="text-muted-foreground text-[14px] leading-relaxed line-clamp-2 max-w-3xl opacity-80">
                            {algorithm.description}
                        </p>
                    )}

                    {/* Meta Info */}
                    <div className={cn("flex flex-wrap items-center gap-y-2", isSidebar ? "gap-x-3" : "gap-x-5")}>
                        <div className="flex items-center gap-1.5 text-muted-foreground/60">
                            <BookOpen className={cn(isSidebar ? "w-3 h-3" : "w-3.5 h-3.5")} />
                            <span className={cn("font-medium", isSidebar ? "text-[9px]" : "text-xs")}>{algorithm.category}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <div className={cn(
                                "flex items-center gap-1 px-2 py-0 rounded-full border font- uppercase tracking-wider",
                                difficultyColors[algorithm.difficulty] || difficultyColors['Medium'],
                                isSidebar ? "text-[7px]" : "text-[10px]"
                            )}>
                                {!isSidebar && <Zap className="w-2.5 h-2.5" />}
                                {algorithm.difficulty}
                            </div>
                        </div>

                        {!isSidebar && algorithm.metadata?.likes && (
                            <div className="flex items-center gap-1.5 text-muted-foreground/40">
                                <Check className="w-3.5 h-3.5" />
                                <span className="text-[11px]">{(algorithm.metadata.likes / 1000).toFixed(1)}k done</span>
                            </div>
                        )}

                        {serialNo && !isSidebar && (
                            <div className="ml-auto pointer-events-none  transition-opacity flex items-center gap-1 text-bg font-mono text-[10px]">
                                ALGO-{serialNo.toString().padStart(2, '0')}
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Arrow */}
                <div className="shrink-0 self-center block group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                    <ArrowRight className={cn("text-bg", isSidebar ? "w-4 h-4" : "w-5 h-5")} />
                </div>
            </div>
        </Link>
    );
};
