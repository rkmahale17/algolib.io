import { useState, useEffect, useRef } from 'react';

interface UseAlgorithmLayoutReturn {
    // Device State
    isMobile: boolean;
    windowWidth: number;

    // Panel Collapse State
    isLeftCollapsed: boolean;
    isRightCollapsed: boolean;
    toggleLeftPanel: () => void;
    toggleRightPanel: () => void;

    // Refs for Reflex/Resizable Panels
    leftPanelRef: React.RefObject<any>;
    rightPanelRef: React.RefObject<any>;

    // Tab State
    activeTab: string;
    setActiveTab: (tab: string) => void;

    // Maximize State
    isCodeRunnerMaximized: boolean;
    setIsCodeRunnerMaximized: (val: boolean) => void;
    isVisualizationMaximized: boolean;
    setIsVisualizationMaximized: (val: boolean) => void;
    isBrainstormMaximized: boolean;
    setIsBrainstormMaximized: (val: boolean) => void;
}

export const useAlgorithmLayout = (): UseAlgorithmLayoutReturn => {
    const [windowWidth, setWindowWidth] = useState(
        typeof window !== 'undefined' ? window.innerWidth : 1200
    );
    const [isMobile, setIsMobile] = useState(false);

    const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
    const [isRightCollapsed, setIsRightCollapsed] = useState(false);

    const [activeTab, setActiveTab] = useState("description");

    const [isCodeRunnerMaximized, setIsCodeRunnerMaximized] = useState(false);
    const [isVisualizationMaximized, setIsVisualizationMaximized] = useState(false);
    const [isBrainstormMaximized, setIsBrainstormMaximized] = useState(false);

    const leftPanelRef = useRef<any>(null);
    const rightPanelRef = useRef<any>(null);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setWindowWidth(width);
            setIsMobile(width < 480);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleLeftPanel = () => {
        const newCollapsed = !isLeftCollapsed;
        setIsLeftCollapsed(newCollapsed);
        localStorage.setItem('leftPanelCollapsed', String(newCollapsed));
        if (newCollapsed) {
            leftPanelRef.current?.collapse();
        } else {
            leftPanelRef.current?.expand();
        }
    };

    const toggleRightPanel = () => {
        const newCollapsed = !isRightCollapsed;
        setIsRightCollapsed(newCollapsed);
        localStorage.setItem('rightPanelCollapsed', String(newCollapsed));
        if (newCollapsed) {
            rightPanelRef.current?.collapse();
        } else {
            rightPanelRef.current?.expand();
        }
    };

    return {
        isMobile,
        windowWidth,
        isLeftCollapsed,
        isRightCollapsed,
        toggleLeftPanel,
        toggleRightPanel,
        leftPanelRef,
        rightPanelRef,
        activeTab,
        setActiveTab,
        isCodeRunnerMaximized,
        setIsCodeRunnerMaximized,
        isVisualizationMaximized,
        setIsVisualizationMaximized,
        isBrainstormMaximized,
        setIsBrainstormMaximized,
    };
};
