import React from 'react';
import Link from 'next/link';
import { Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProOverlayProps {
    className?: string;
    variant?: 'default' | 'compact' | 'transparent';
    title?: React.ReactNode;
    description?: string;
    hideBadges?: boolean;
    buttonText?: string;
}

export const ProOverlay: React.FC<ProOverlayProps> = ({ 
    className = "", 
    variant = "default",
    title,
    description,
    hideBadges = false,
    buttonText = "View subscription plans"
}) => {
    const isCompanyTags = title === "Premium company tags";
    const isRula = title === "Rula AI Assistant";

    const badges = isCompanyTags ? [
        "All premium questions",
        "High quality solutions",
        "Time-savers like focus areas",
        "Front end system design guides"
    ] : isRula ? [
        "Step-by-step thinking",
        "Unlimited hints",
        "Optimal approaches",
        "Code solutions"
    ] : [
        "Get all visualization solutions",
        "Premium solutions",
        "Fast learning",
        "User thinkpad"
    ];

    if (variant === 'compact') {
        return (
            <div className={`flex flex-col items-center justify-center p-3 bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg animate-in fade-in duration-200 w-full h-full text-center ${className}`}>
                <Lock className="w-5 h-5 text-muted-foreground/80 mb-1" />
                <h4 className="text-xs font-semibold text-foreground mb-1">
                    Premium Feature
                </h4>
                <Link href="/pricing" className="mt-1">
                    <Button
                        size="sm"
                        className="h-7 text-[10px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full transition-all active:scale-95 px-3"
                    >
                        Unlock
                    </Button>
                </Link>
            </div>
        );
    }

    if (variant === 'transparent') {
        return (
            <div className={`flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300 w-full max-w-[620px] bg-card/65 dark:bg-card/45 backdrop-blur-md rounded-2xl shadow-lg border-none ${className}`}>
                <Lock className="w-12 h-12 text-muted-foreground/80 mb-4 stroke-[1.5]" />

                <h3 className="text-xl font-bold text-foreground mb-2">
                    {title || "Premium solution"}
                </h3>

                <p className="text-sm text-muted-foreground text-center max-w-[420px] mb-6 leading-relaxed">
                    {description || "Purchase premium to unlock official solutions and all the best materials we have to offer."}
                </p>

                {!hideBadges && (
                    <div className="flex flex-wrap gap-2.5 justify-center max-w-[500px] mb-8">
                        {badges.map((badge, idx) => (
                            <span key={idx} className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-foreground bg-muted/40 border border-border/60 rounded-md">
                                <span className="text-muted-foreground/80 font-bold mr-0.5">✦</span> {badge}
                            </span>
                        ))}
                    </div>
                )}

                <Link href="/pricing">
                    <Button
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-8 py-2.5 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md shadow-primary/10 border-none"
                    >
                        {buttonText} <ArrowRight className="w-4 h-4 animate-pulse" />
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className={`sticky top-0 left-0 z-50 flex flex-col items-center justify-center p-6 bg-background/98 backdrop-blur-md border border-border rounded-lg animate-in fade-in duration-300 min-h-full w-full ${className}`}>
            <Lock className="w-12 h-12 text-muted-foreground/80 mb-4 stroke-[1.5]" />

            <h3 className="text-xl font-bold text-foreground mb-2">
                {title || "Premium solution"}
            </h3>

            <p className="text-sm text-muted-foreground text-center max-w-[420px] mb-6 leading-relaxed">
                {description || "Purchase premium to unlock official solutions and all the best materials we have to offer."}
            </p>

            {!hideBadges && (
                <div className="flex flex-wrap gap-2.5 justify-center max-w-[500px] mb-8">
                    {badges.map((badge, idx) => (
                        <span key={idx} className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-foreground bg-muted/40 border border-border/60 rounded-md">
                            <span className="text-muted-foreground/80 font-bold mr-0.5">✦</span> {badge}
                        </span>
                    ))}
                </div>
            )}

            <Link href="/pricing">
                <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-8 py-2.5 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md shadow-primary/10 border-none"
                >
                    {buttonText} <ArrowRight className="w-4 h-4 animate-pulse" />
                </Button>
            </Link>
        </div>
    );
};
