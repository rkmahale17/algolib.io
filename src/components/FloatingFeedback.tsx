import React from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";

export const FloatingFeedback: React.FC = () => {
    return (
        <div className="fixed bottom-6 right-6 z-50">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>

                        <Button variant="outline" size="sm" asChild><Link href="/feedback">
                            Feedback
                        </Link></Button>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="font-medium">
                        <p>Share your feedback</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};
