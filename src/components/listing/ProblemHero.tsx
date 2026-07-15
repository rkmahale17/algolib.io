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
        <div className="mb-8 md:mb-12 animate-in fade-in slide-in-from-top-4 duration-700 w-full break-words">
            <h1 className="text-xl md:text-xl font-medium tracking-tight text-foreground break-words flex items-center gap-3">
                {PageIcon && (
                    <div className="p-2 rounded-xl bg-primary/5 text-primary border border-primary/10">
                        <PageIcon className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                )}
                {title}
            </h1>
            <div className="h-px bg-border/40 w-full mt-6"></div>
        </div>
    );
};
