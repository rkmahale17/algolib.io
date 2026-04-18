import React from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProOverlayProps {
    className?: string;
}

export const ProOverlay: React.FC<ProOverlayProps> = ({ className = "" }) => {
    return (
        <div className={`sticky top-0 left-0 z-50 flex flex-col items-center justify-center p-6 bg-background/98 backdrop-blur-md border-2 border-orange-500/20 rounded-lg animate-in fade-in duration-300 min-h-full w-full ${className}`}>
            <div className="bg-orange-500/10 p-4 rounded-full mb-4 border border-orange-500/20">
                <Lock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>

            <h3 className="text-xl font-bold text-foreground mb-2">
                Unlock with Pro mode
            </h3>

            <p className="text-sm text-muted-foreground text-center max-w-[280px] mb-6">
                Get access to premium solutions, interactive visualizations, and advanced brainstorming tools.
            </p>

            <Link href="/pricing">
                <Button
                    className="bg-orange-600 hover:bg-orange-700 text-white border-none shadow-lg shadow-orange-600/20 rounded-full px-8 font-semibold transition-all active:scale-95"
                >
                    View Pricing
                </Button>
            </Link>
        </div>
    );
};
