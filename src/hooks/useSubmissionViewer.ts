import { useState } from 'react';
import { Submission } from '@/types/userAlgorithmData';
import { usePostHog } from '@posthog/react';

interface UseSubmissionViewerProps {
    algorithmId?: string; // Change to problemId in future phase
    setIsOutputExpanded: (val: boolean) => void;
    setIsOutputModalOpen: (val: boolean) => void;
}

export const useSubmissionViewer = ({
    algorithmId,
    setIsOutputExpanded,
    setIsOutputModalOpen
}: UseSubmissionViewerProps) => {
    const posthog = usePostHog();
    const [viewingSubmission, setViewingSubmission] = useState<Submission | null>(null);
    const [activeEditorTab, setActiveEditorTab] = useState<"current" | "submission" | "scratchpad">("current");
    const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);

    const handleSelectSubmission = (submission: Submission) => {
        setViewingSubmission(submission);
        setActiveEditorTab("submission");
        setIsOutputExpanded(false);
        setIsOutputModalOpen(false);

        posthog?.capture('code_view_switched', {
            problemId: algorithmId,
            view: 'submission',
            submissionId: submission.id
        });
    };

    const handleCloseSubmission = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setViewingSubmission(null);
        setActiveEditorTab("current");

        posthog?.capture('code_view_switched', {
            problemId: algorithmId,
            view: 'current'
        });
    };

    return {
        viewingSubmission,
        setViewingSubmission,
        activeEditorTab,
        setActiveEditorTab,
        isScratchpadOpen,
        setIsScratchpadOpen,
        handleSelectSubmission,
        handleCloseSubmission
    };
};
