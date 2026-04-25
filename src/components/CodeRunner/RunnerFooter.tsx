import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeExecutionButtonGroup } from "./CodeExecutionButtonGroup";

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

            {/* Right: Empty spacer for true centering */}
            <div className="flex-1"></div>
        </div>
    );
};
