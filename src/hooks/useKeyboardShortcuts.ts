import { useEffect } from 'react';
import { toast } from 'sonner';

interface UseKeyboardShortcutsProps {
    isLoading: boolean;
    isSubmitting: boolean;
    lastRunSuccess: boolean;
    controls: any;
    handleRun: () => void;
    handleSubmit: () => void;
}

export const useKeyboardShortcuts = ({
    isLoading,
    isSubmitting,
    lastRunSuccess,
    controls,
    handleRun,
    handleSubmit
}: UseKeyboardShortcutsProps) => {
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            // Ctrl/Cmd + ' for Run
            if ((e.ctrlKey || e.metaKey) && e.key === "'") {
                e.preventDefault();
                e.stopPropagation();
                if (!isLoading && !isSubmitting && controls?.run_code !== false) {
                    handleRun();
                }
            }

            // Ctrl/Cmd + Enter for Submit
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                const canSubmit = controls?.allow_submission !== false;

                if (!isLoading && !isSubmitting && canSubmit) {
                    if (!lastRunSuccess) {
                        toast.warning("Please run your code successfully before submitting (Ctrl/Cmd + Enter)", {
                            description: "You need to pass all test cases first."
                        });
                        return;
                    }
                    handleSubmit();
                }
            }
        };

        // Use capture phase to intercept before Monaco Editor swallows the keystroke
        window.addEventListener('keydown', handleGlobalKeyDown, { capture: true });
        return () => window.removeEventListener('keydown', handleGlobalKeyDown, { capture: true });
    }, [handleRun, handleSubmit, isLoading, isSubmitting, lastRunSuccess, controls]);
};
