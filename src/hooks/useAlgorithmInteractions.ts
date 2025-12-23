import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { updateProgress, updateSocial, updateCode } from '@/utils/userAlgorithmDataHelpers';
import { useFeatureFlag } from '@/contexts/FeatureFlagContext';
import confetti from 'canvas-confetti';

interface UseAlgorithmInteractionsProps {
    user: any;
    algorithmId: string | undefined;
    algorithm: any;
    userAlgoData: any;
    refetchUserData: () => void;
}

export const useAlgorithmInteractions = ({
    user,
    algorithmId,
    algorithm,
    userAlgoData,
    refetchUserData
}: UseAlgorithmInteractionsProps) => {
    const navigate = useNavigate();
    const [isCompleted, setIsCompleted] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);

    // Code Management
    const [savedCode, setSavedCode] = useState<string>("");
    const [selectedLanguage, setSelectedLanguage] = useState(
        localStorage.getItem('preferredLanguage') || 'typescript'
    );
    const [codeCache, setCodeCache] = useState<Record<string, string>>({});
    const [isUserModified, setIsUserModified] = useState(false);

    const isNaughtyCloud = useFeatureFlag("naugty_cloud");

    // Sync state with userAlgoData
    useEffect(() => {
        if (userAlgoData) {
            setIsCompleted(userAlgoData.completed || false);
            setIsFavorite(userAlgoData.is_favorite || false);
            setUserVote(userAlgoData.user_vote || null);

            if (userAlgoData.code && typeof userAlgoData.code === 'object') {
                const cache = userAlgoData.code as Record<string, string>;
                setCodeCache(cache);
                // Only update saved code if user hasn't modified it locally
                if (!isUserModified) {
                    setSavedCode(cache[selectedLanguage] || '');
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userAlgoData, selectedLanguage]);

    // Handle language switch or algorithm change
    useEffect(() => {
        // When algorithmId changes, we want to reset state first
        // But codeCache might be from previous algo if userAlgoData hasn't updated yet?
        // Actually, userAlgoData updates when algorithmId changes (via key in parent or refetch)
        // Check effect above (line 42) - it depends on userAlgoData.

        // This effect ensures that if we switch language, we load from cache.
        // It also needs to handle the case where we just switched algorithm.
        const codeForLanguage = codeCache[selectedLanguage] || '';
        setSavedCode(codeForLanguage);

        // IMPORTANT: We must NOT reset isUserModified to false blindly if we just typed,
        // BUT if we switched algorithm, we start fresh.
        // The safest way is to rely on userAlgoData effect to setInitial state.
    }, [selectedLanguage]); // Keeping this simple for language switch

    // Reset local state when algorithmId changes
    useEffect(() => {
        setSavedCode("");
        setCodeCache({});
        setIsUserModified(false);
    }, [algorithmId]);

    // Auto-save Effect
    useEffect(() => {
        if (!isUserModified) return;

        const saveTimeout = setTimeout(async () => {
            if (!user || !algorithmId || !savedCode) return;

            try {
                const success = await updateCode(user.id, algorithmId, {
                    language: selectedLanguage,
                    code: savedCode,
                });

                if (!success) throw new Error('Failed to save code');

                if (isNaughtyCloud) {
                    toast("Cloud is feeling naughty today, but saved anyway 😈", {
                        description: "Your code is safe, don't worry!",
                    });
                }

                setIsUserModified(false);
                refetchUserData(); // Sync latest state to prevent stale overwrites
            } catch (err) {
                console.error("Error saving code:", err);
            }
        }, 4000);

        return () => clearTimeout(saveTimeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [savedCode, user, algorithmId, selectedLanguage, isUserModified, isNaughtyCloud]);

    const handleCodeChange = useCallback((newCode: string) => {
        setSavedCode(newCode);
        setIsUserModified(true);
        setCodeCache(prev => ({
            ...prev,
            [selectedLanguage]: newCode
        }));
    }, [selectedLanguage]);

    const toggleCompletion = useCallback(async () => {
        if (!user || !algorithmId) {
            toast.error("Please sign in to track progress");
            return;
        }

        try {
            const newStatus = !isCompleted;
            const success = await updateProgress(user.id, algorithmId, {
                completed: newStatus,
                completed_at: newStatus ? new Date().toISOString() : null,
            });

            if (!success) throw new Error('Failed to update');

            setIsCompleted(newStatus);
            toast.success(newStatus ? "Marked as completed!" : "Marked as incomplete");
            refetchUserData();
        } catch (error) {
            console.error('Error toggling completion:', error);
            toast.error("Failed to update progress");
        }
    }, [user, algorithmId, isCompleted, refetchUserData]);

    const handleCodeSuccess = useCallback(async () => {
        // Trigger Confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        if (user && algorithmId && !isCompleted) {
            try {
                const success = await updateProgress(user.id, algorithmId, {
                    completed: true,
                    completed_at: new Date().toISOString(),
                });

                if (success) {
                    setIsCompleted(true);
                    toast.success("Algorithm completed! Keep it up!", {
                        description: "Marked as completed automatically."
                    });
                    refetchUserData();
                }
            } catch (error) {
                console.error("Failed to auto-complete:", error);
            }
        } else if (!user) {
            toast.success("Great job! Sign in to track your progress.");
        }
    }, [user, algorithmId, isCompleted, refetchUserData]);

    const toggleFavorite = useCallback(async () => {
        if (!user || !algorithmId) {
            toast.error("Please sign in to favorite");
            return;
        }

        try {
            const newStatus = !isFavorite;
            const success = await updateSocial(user.id, algorithmId, {
                is_favorite: newStatus,
            });

            if (!success) throw new Error('Failed to update');
            setIsFavorite(newStatus);
            toast.success(newStatus ? "Added to favorites" : "Removed from favorites");
            refetchUserData();
        } catch (error) {
            toast.error("Failed to update favorites");
        }
    }, [user, algorithmId, isFavorite, refetchUserData]);

    const handleVote = useCallback(async (vote: 'like' | 'dislike') => {
        if (!user) {
            toast.error("Please sign in to vote");
            return;
        }

        const previousVote = userVote;
        const previousLikes = likes;
        const previousDislikes = dislikes;

        // Optimistic Update
        if (userVote === vote) {
            setUserVote(null);
            if (vote === 'like') setLikes(l => Math.max(0, l - 1));
            else setDislikes(d => Math.max(0, d - 1));
        } else {
            setUserVote(vote);
            if (vote === 'like') {
                setLikes(l => l + 1);
                if (previousVote === 'dislike') setDislikes(d => Math.max(0, d - 1));
            } else {
                setDislikes(d => d + 1);
                if (previousVote === 'like') setLikes(l => Math.max(0, l - 1));
            }
        }

        try {
            // DB Logic copied from original component
            let likeIncrement = 0;
            let dislikeIncrement = 0;

            if (previousVote === vote) {
                if (vote === 'like') likeIncrement = -1;
                else dislikeIncrement = -1;
            } else {
                if (vote === 'like') {
                    likeIncrement = 1;
                    if (previousVote === 'dislike') dislikeIncrement = -1;
                } else {
                    dislikeIncrement = 1;
                    if (previousVote === 'like') likeIncrement = -1;
                }
            }

            if (likeIncrement !== 0 || dislikeIncrement !== 0) {
                const { data: current, error: fetchError } = await supabase
                    .from('algorithms')
                    .select('metadata')
                    .eq('id', algorithm.id)
                    .single();

                if (current && !fetchError) {
                    const currentMeta = (current.metadata as any) || {};
                    const newLikes = Math.max(0, (currentMeta.likes || 0) + likeIncrement);
                    const newDislikes = Math.max(0, (currentMeta.dislikes || 0) + dislikeIncrement);

                    await supabase.from('algorithms').update({
                        metadata: {
                            ...currentMeta,
                            likes: newLikes,
                            dislikes: newDislikes
                        }
                    }).eq('id', algorithm.id);
                }
            }

            const newVote = (previousVote === vote) ? null : vote;
            await updateSocial(user.id, algorithmId || '', {
                user_vote: newVote
            });

        } catch (error) {
            console.error("Error updating vote:", error);
            toast.error("Failed to update vote");
            // Revert optimistic
            setUserVote(previousVote);
            setLikes(previousLikes);
            setDislikes(previousDislikes);
        }
    }, [user, algorithmId, userVote, likes, dislikes, algorithm]);

    const handleRandomProblem = useCallback(async () => {
        const { data } = await supabase.from('algorithms').select('id');
        if (data && data.length > 0) {
            const random = data[Math.floor(Math.random() * data.length)];
            navigate(`/problem/${random.id}`);
        }
    }, [navigate]);

    const handlePreviousProblem = useCallback(async () => {
        if (!algorithm || !supabase) return;

        try {
            if (typeof algorithm.serial_no === 'number') {
                const { data: prevAlgo } = await supabase
                    .from('algorithms')
                    .select('id, serial_no')
                    .lt('serial_no', algorithm.serial_no)
                    .order('serial_no', { ascending: false })
                    .limit(1)
                    .single();

                if (prevAlgo) {
                    navigate(`/problem/${prevAlgo.id}`);
                    return;
                }
            }

            toast.info("No previous problem found. You are at the start!");
        } catch (error) {
            console.error("Error navigating previous:", error);
        }
    }, [algorithm, navigate]);

    const handleNextProblem = useCallback(async () => {
        if (!algorithm || !supabase) return;

        try {
            // New Logic: Find next by serial_no
            if (typeof algorithm.serial_no === 'number') {
                const { data: nextAlgo } = await supabase
                    .from('algorithms')
                    .select('id, serial_no')
                    .gt('serial_no', algorithm.serial_no)
                    .order('serial_no', { ascending: true })
                    .limit(1)
                    .single(); // Use single() as we expect at most one, or null if none

                if (nextAlgo) {
                    navigate(`/problem/${nextAlgo.id}`);
                    return;
                }
            }

            // Fallback: If no serial number or no next problem found (last one?), try random
            console.log("No next problem found by serial_no, trying random...");
            toast.info("No next problem found in sequence. Trying random...");
            handleRandomProblem();

        } catch (error) {
            console.error("Error navigating next:", error);
            handleRandomProblem();
        }

    }, [algorithm, handleRandomProblem, navigate]);

    const handleShare = useCallback(async () => {
        try {
            const url = window.location.href;
            await navigator.clipboard.writeText(url);
            toast.success("Link copied to clipboard!");
        } catch (error) {
            toast.error("Failed to copy link");
        }
    }, []);

    return {
        isCompleted,
        isFavorite,
        likes,
        dislikes,
        userVote,
        savedCode,
        selectedLanguage,
        setSelectedLanguage,
        isUserModified,

        // Actions
        toggleCompletion,
        handleCodeSuccess,
        toggleFavorite,
        handleVote,
        handleRandomProblem,
        handlePreviousProblem,
        handleNextProblem,
        handleShare,
        handleCodeChange,

        // Setters for initial data
        setLikes,
        setDislikes
    };
};
