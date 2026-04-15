import { BadgeCheck, Beaker, Code2 } from "lucide-react";
import { Link } from "react-router-dom";

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
    icon: PageIcon,
    benefits = [
        { icon: BadgeCheck, text: "Questions and solutions by ex-interviewers" },
        { icon: Beaker, text: "Comprehensive test cases" },
        { icon: Code2, text: "Code in browser" }
    ],
    showRecommendation = true
}: ProblemHeroProps) => {
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

            <div className="flex flex-wrap gap-x-6 md:gap-x-8 gap-y-3 md:gap-y-4 py-4 md:py-6 border-y border-border/40">
                {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                        <div key={index} className="flex items-center gap-2 md:gap-2.5 text-[13px] md:text-sm font-medium text-muted-foreground/80">
                            <div className="p-1 md:p-1.5 rounded-lg bg-primary/5 text-primary">
                                <Icon className="w-3.5 md:w-4 h-3.5 md:h-4" />
                            </div>
                            <span>{benefit.text}</span>
                        </div>
                    );
                })}
            </div>

            <div className="space-y-3 md:space-y-4 text-md text-muted-foreground/90 leading-relaxed">
                <p>
                    Master the foundational and advanced data structures and algorithms. Practice 150+ curated questions, each with high quality visualizations, multiple language solutions, and optimized complexity analysis.
                </p>
                {showRecommendation && (
                    <p>
                        Short on time? If your interview is in 2 weeks, we highly recommend starting with the <Link to="/blind75" className="font-semibold text-foreground underline decoration-primary/30 underline-offset-4 cursor-pointer hover:decoration-primary transition-colors">Blind 75</Link> list to cover the most essential patterns.
                    </p>
                )}
            </div>
        </div>
    );
};
