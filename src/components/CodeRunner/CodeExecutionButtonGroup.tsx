import React from "react";
import { Play, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { FeatureGuard } from "@/components/FeatureGuard";

interface CodeExecutionButtonGroupProps {
    onRun: () => void;
    onSubmit: () => void;
    isLoading: boolean;
    isSubmitting: boolean;
    lastRunSuccess: boolean;
    algorithm?: any;
    hasPremiumAccess?: boolean;
    hideUserMenu?: boolean;
    className?: string;
    showTooltips?: boolean;
}

export const CodeExecutionButtonGroup: React.FC<CodeExecutionButtonGroupProps> = ({
    onRun,
    onSubmit,
    isLoading,
    isSubmitting,
    lastRunSuccess,
    algorithm,
    hasPremiumAccess = false,
    hideUserMenu = false,
    className = "",
    showTooltips = true,
}) => {
    const isUnlockRequired = (algorithm?.is_premium || algorithm?.metadata?.is_pro) && !hasPremiumAccess && !hideUserMenu;

    const runButton = (
        <Button
            onClick={onRun}
            disabled={isLoading || isSubmitting}
            size="sm"
            variant="secondary"
            className="h-8 px-4 text-xs rounded-r-none border border-r-0 border-border font-medium transition-colors hover:bg-secondary/80 shrink-0"
        >
            {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
            ) : (
                <Play className="w-3.5 h-3.5 mr-2 fill-current" />
            )}
            Run
        </Button>
    );

    const submitButton = (
        <Button
            onClick={() => {
                if (!lastRunSuccess && !isLoading && !isSubmitting) {
                    toast.warning("Please run your code successfully before submitting", {
                        description: "You need to pass all sample test cases first."
                    });
                    return;
                }
                onSubmit();
            }}
            disabled={isLoading || isSubmitting || isUnlockRequired}
            size="sm"
            variant="default"
            className={`h-8 px-4 text-xs rounded-l-none border ${lastRunSuccess && !isUnlockRequired
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 border-primary/20'
                : 'bg-muted text-muted-foreground border-border'
                } transition-colors shrink-0`}
        >
            {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
            ) : (
                <Send className="w-3.5 h-3.5 mr-2" />
            )}
            Submit
        </Button>
    );

    return (
        <div className={`flex items-center shadow-sm rounded-md ${className}`}>
            <TooltipProvider delayDuration={300}>
                <FeatureGuard flag="code_runner">
                    {showTooltips ? (
                        <Tooltip>
                            <TooltipTrigger asChild>{runButton}</TooltipTrigger>
                            <TooltipContent side="bottom" className="text-[11px]">
                                Run Code <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"><span className="text-xs">Ctrl</span> + '</kbd>
                            </TooltipContent>
                        </Tooltip>
                    ) : runButton}
                </FeatureGuard>

                <FeatureGuard flag="submit_button">
                    {showTooltips ? (
                        <Tooltip>
                            <TooltipTrigger asChild>{submitButton}</TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-[250px] text-[11px]">
                                {isUnlockRequired ? (
                                    <span className="text-orange-500 font-medium">Unlock Pro mode to submit this problem</span>
                                ) : !lastRunSuccess && !isLoading && !isSubmitting ? (
                                    <span className="text-orange-500 font-medium">Run all test cases successfully to enable submission</span>
                                ) : (
                                    <>Submit Solution <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"><span className="text-xs">Ctrl</span> + Enter</kbd></>
                                )}
                            </TooltipContent>
                        </Tooltip>
                    ) : submitButton}
                </FeatureGuard>
            </TooltipProvider>
        </div>
    );
};
