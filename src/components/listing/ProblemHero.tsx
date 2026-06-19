import { BadgeCheck, Beaker, Code2, Brain, Target, Layers, Rocket, BookOpen, Presentation, PencilLine, GitCompare, ChevronRight, Database } from "lucide-react";
import Link from "next/link";

const ICON_MAP: Record<string, any> = {
    brain: Brain,
    target: Target,
    layers: Layers,
    rocket: Rocket,
    code: Code2,
    beaker: Beaker,
    check: BadgeCheck,
    database: Database
};

interface ProblemHeroProps {
    title: string;
    description: string;
    icon?: any;
    benefits?: { icon: any; text: string }[];
    showRecommendation?: boolean;
}

export const ProblemHero = ({
    title,
    description,
    icon: iconProp,
    benefits = [
        { icon: BookOpen, text: "Read Problem" },
        { icon: Brain, text: "Think" },
        { icon: Presentation, text: "Check Visualization" },
        { icon: PencilLine, text: "Draw in Think Pad" },
        { icon: Code2, text: "Code Solve" },
        { icon: GitCompare, text: "Compare Solution" }
    ],
    showRecommendation = true
}: ProblemHeroProps) => {
    // Resolve icon if it's a string
    const PageIcon = typeof iconProp === 'string' ? ICON_MAP[iconProp.toLowerCase()] : iconProp;
    return (
        <div className="mb-8 md:mb-12 space-y-6 md:space-y-8 animate-in fade-in slide-in-from-top-4 duration-700 w-full break-words">
            <div className="space-y-3 md:space-y-4">
                <h1 className="text-xl md:text-xl font-medium tracking-tight text-foreground break-words flex items-center gap-3">
                    {PageIcon && (
                        <div className="p-2 rounded-xl bg-primary/5 text-primary border border-primary/10">
                            <PageIcon className="w-5 h-5" strokeWidth={2.5} />
                        </div>
                    )}
                    {title}
                </h1>
                <p className="text-md text-muted-foreground max-w-2xl leading-relaxed break-words">
                    {description}
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-2 md:gap-x-3 gap-y-3 md:gap-y-4 py-4 md:py-6 border-y border-border/40">
                {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                        <div key={index} className="flex items-center gap-2 md:gap-3">
                            <div className="flex items-center gap-2 md:gap-2.5 text-[12px] md:text-sm font-medium text-muted-foreground/80">
                                <div className="p-1 md:p-1.5 rounded-lg bg-primary/5 text-primary shrink-0">
                                    <Icon className="w-3.5 md:w-4 h-3.5 md:h-4" />
                                </div>
                                <span className="whitespace-nowrap">{benefit.text}</span>
                            </div>
                            {index < benefits.length - 1 && (
                                <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground/30 shrink-0" />
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="space-y-3 md:space-y-4 text-md text-muted-foreground/90 leading-relaxed max-w-[820px]">
                {showRecommendation && (
                    <p>
                        Short on time? If your interview is in 2 weeks, we highly recommend starting with the <Link href="/dsa/blind-75" className="font-semibold text-foreground underline decoration-primary/30 underline-offset-4 cursor-pointer hover:decoration-primary transition-colors">Blind 75</Link> list to cover the most essential patterns.
                    </p>
                )}
            </div>
        </div>
    );
};
