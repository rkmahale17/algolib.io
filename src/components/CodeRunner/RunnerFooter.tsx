import React from "react";
import { ChevronUp, ChevronDown, Shuffle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeExecutionButtonGroup } from "./CodeExecutionButtonGroup";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface RunnerFooterProps {
    // Console state
    isExpanded: boolean;
    onToggleExpand: () => void;

    // Action props (passed to CodeExecutionButtonGroup)
    onRun: () => void;
    onSubmit: () => void;
    isLoading: boolean;
    isSubmitting: boolean;
    lastRunSuccess: boolean;
    algorithm?: any;
    hideUserMenu?: boolean;
    hasPremiumAccess?: boolean;
    handleRandomProblem?: () => void;
    handleNextProblem?: () => void;
    handlePreviousProblem?: () => void;
}

export const RunnerFooter: React.FC<RunnerFooterProps> = ({
    isExpanded,
    onToggleExpand,
    onRun,
    onSubmit,
    isLoading,
    isSubmitting,
    lastRunSuccess,
    algorithm,
    hideUserMenu,
    hasPremiumAccess,
    handleRandomProblem,
    handleNextProblem,
    handlePreviousProblem,
}) => {
    return (
        <div className="flex items-center px-4 bg-background border-t border-border shrink-0 z-20 h-10 relative">
            {/* Left: Console Toggle */}
            <div className="flex-1 flex justify-start">
                <button
                    onClick={onToggleExpand}
                    className="flex items-center gap-2 text-xs font-semibold py-1.5 px-3 rounded-md hover:bg-muted transition-colors text-foreground/80 hover:text-foreground group"
                >
                    <span>Console</span>
                    {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                    ) : (
                        <ChevronUp className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                    )}
                </button>
            </div>

            {/* Center: Actions */}
            <div className="flex-none flex justify-center">
                <CodeExecutionButtonGroup
                    onRun={onRun}
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                    isSubmitting={isSubmitting}
                    lastRunSuccess={lastRunSuccess}
                    algorithm={algorithm}
                    hideUserMenu={hideUserMenu}
                    hasPremiumAccess={hasPremiumAccess}
                    showTooltips={true}
                />
            </div>

            {/* Right: Problem Navigation */}
            <div className="flex-1 flex justify-end">
                <div className="flex items-center shadow-sm rounded-md overflow-hidden border border-border bg-secondary/30 h-7">
                    <TooltipProvider>
                        {handlePreviousProblem && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handlePreviousProblem}
                                        className="h-7 w-7 rounded-none text-muted-foreground hover:text-foreground hover:bg-muted border-r border-border transition-colors px-0"
                                    >
                                        <ChevronLeft className="h-3.5 w-3.5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">Previous Problem</TooltipContent>
                            </Tooltip>
                        )}
                        {handleRandomProblem && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleRandomProblem}
                                        className="h-7 w-7 rounded-none hover:bg-muted border-r border-border transition-colors px-0"
                                    >
                                        <Shuffle className="h-3 w-3" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">Random Problem</TooltipContent>
                            </Tooltip>
                        )}
                        {handleNextProblem && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleNextProblem}
                                        className="h-7 w-7 rounded-none hover:bg-muted transition-colors px-0"
                                    >
                                        <ChevronRight className="h-3.5 w-3.5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">Next Problem</TooltipContent>
                            </Tooltip>
                        )}
                    </TooltipProvider>
                </div>
            </div>
        </div>
    );
};
