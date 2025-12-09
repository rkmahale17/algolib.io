import { useState, useEffect } from 'react';

interface UseInterviewSessionReturn {
    isInterviewMode: boolean;
    toggleInterviewMode: () => void;
    timerSeconds: number;
    setTimerSeconds: (seconds: number) => void;
    isTimerRunning: boolean;
    setIsTimerRunning: (running: boolean) => void;
    showInterviewSummary: boolean;
    setShowInterviewSummary: (show: boolean) => void;
    interviewTime: number;
    formatTime: (seconds: number) => string;
}

export const useInterviewSession = (): UseInterviewSessionReturn => {
    const [isInterviewMode, setIsInterviewMode] = useState(false);
    const [showInterviewSummary, setShowInterviewSummary] = useState(false);
    const [interviewTime, setInterviewTime] = useState(0);

    const [timerSeconds, setTimerSeconds] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setTimerSeconds(s => s + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const toggleInterviewMode = () => {
        if (isInterviewMode) {
            // Stopping interview mode
            setIsInterviewMode(false);
            setIsTimerRunning(false);
            setInterviewTime(timerSeconds);
            setShowInterviewSummary(true);
        } else {
            // Starting interview mode
            setIsInterviewMode(true);
            setIsTimerRunning(true);
            setTimerSeconds(0);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return {
        isInterviewMode,
        toggleInterviewMode,
        timerSeconds,
        setTimerSeconds,
        isTimerRunning,
        setIsTimerRunning,
        showInterviewSummary,
        setShowInterviewSummary,
        interviewTime,
        formatTime
    };
};
