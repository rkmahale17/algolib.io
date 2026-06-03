import { useState, useEffect, useRef, useCallback } from 'react';

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

    // Tab State (Legacy Compatibility)
    activeTab: string;
    setActiveTab: (tab: string) => void;

    // Customizable Tabs Layout State
    leftTabs: string[];
    rightTabs: string[];
    activeLeftTab: string;
    activeRightTab: string;
    setActiveLeftTab: (tab: string) => void;
    setActiveRightTab: (tab: string) => void;
    addTab: (panel: 'left' | 'right', tabId: string) => void;
    removeTab: (panel: 'left' | 'right', tabId: string) => void;
    resetLayout: () => void;

    // Maximize State
    isCodeRunnerMaximized: boolean;
    setIsCodeRunnerMaximized: (val: boolean) => void;
    isVisualizationMaximized: boolean;
    setIsVisualizationMaximized: (val: boolean) => void;
    isBrainstormMaximized: boolean;
    setIsBrainstormMaximized: (val: boolean) => void;
}

const BASE_LEFT_TABS = ["description"];
const BASE_RIGHT_TABS = ["editor"];
const DEFAULT_LEFT_TABS = ["description", "visualizations", "solutions", "submissions"];
const DEFAULT_RIGHT_TABS = ["editor", "thinkpad"];

export const useAlgorithmLayout = (): UseAlgorithmLayoutReturn => {
    const [windowWidth, setWindowWidth] = useState(1200); // Default to desktop width for SSR
    const [isMobile, setIsMobile] = useState(false);

    const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
    const [isRightCollapsed, setIsRightCollapsed] = useState(false);

    // Legacy activeTab compatibility
    const [activeTab, setActiveTabState] = useState("description");

    const [leftTabs, setLeftTabs] = useState<string[]>(DEFAULT_LEFT_TABS);
    const [rightTabs, setRightTabs] = useState<string[]>(DEFAULT_RIGHT_TABS);
    const [activeLeftTab, setActiveLeftTabState] = useState<string>("description");
    const [activeRightTab, setActiveRightTabState] = useState<string>("editor");

    // Load layout states from localStorage on client mount to prevent SSR hydration mismatch
    useEffect(() => {
        const savedLeft = localStorage.getItem("dsa-layout-left-tabs");
        if (savedLeft) {
            try {
                setLeftTabs(JSON.parse(savedLeft));
            } catch (e) {
                console.error("Failed to parse left tabs", e);
            }
        }

        const savedRight = localStorage.getItem("dsa-layout-right-tabs");
        if (savedRight) {
            try {
                setRightTabs(JSON.parse(savedRight));
            } catch (e) {
                console.error("Failed to parse right tabs", e);
            }
        }

        const savedActiveLeft = localStorage.getItem("dsa-layout-active-left-tab");
        if (savedActiveLeft) {
            setActiveLeftTabState(savedActiveLeft);
            setActiveTabState(savedActiveLeft); // Sync legacy activeTab compatibility
        }

        const savedActiveRight = localStorage.getItem("dsa-layout-active-right-tab");
        if (savedActiveRight) {
            setActiveRightTabState(savedActiveRight);
        }
    }, []);

    const setActiveTab = useCallback((tab: string) => {
        setActiveTabState(tab);
    }, []);

    const setActiveLeftTab = useCallback((tab: string) => {
        setActiveLeftTabState(tab);
        localStorage.setItem("dsa-layout-active-left-tab", tab);
        // Sync activeTab for legacy compatibility
        setActiveTab(tab);
    }, [setActiveTab]);

    const setActiveRightTab = useCallback((tab: string) => {
        setActiveRightTabState(tab);
        localStorage.setItem("dsa-layout-active-right-tab", tab);
    }, []);

    const addTab = useCallback((panel: "left" | "right", tabId: string) => {
        if (panel === "left") {
            if (leftTabs.includes(tabId)) return;
            
            // Remove from right panel first if it exists there to prevent duplication
            const updatedRight = rightTabs.filter(t => t !== tabId);
            setRightTabs(updatedRight);
            localStorage.setItem("dsa-layout-right-tabs", JSON.stringify(updatedRight));
            
            const updatedLeft = [...leftTabs, tabId];
            setLeftTabs(updatedLeft);
            localStorage.setItem("dsa-layout-left-tabs", JSON.stringify(updatedLeft));
            setActiveLeftTab(tabId);
            
            // If the active right tab was the one moved, activate another right tab
            if (activeRightTab === tabId && updatedRight.length > 0) {
                setActiveRightTab(updatedRight[0]);
            }
        } else {
            if (rightTabs.includes(tabId)) return;
            
            // Remove from left panel first if it exists there to prevent duplication
            const updatedLeft = leftTabs.filter(t => t !== tabId);
            setLeftTabs(updatedLeft);
            localStorage.setItem("dsa-layout-left-tabs", JSON.stringify(updatedLeft));
            
            const updatedRight = [...rightTabs, tabId];
            setRightTabs(updatedRight);
            localStorage.setItem("dsa-layout-right-tabs", JSON.stringify(updatedRight));
            setActiveRightTab(tabId);
            
            // If the active left tab was the one moved, activate another left tab
            if (activeLeftTab === tabId && updatedLeft.length > 0) {
                setActiveLeftTab(updatedLeft[0]);
            }
        }
    }, [leftTabs, rightTabs, activeLeftTab, activeRightTab, setActiveLeftTab, setActiveRightTab]);

    const removeTab = useCallback((panel: "left" | "right", tabId: string) => {
        if (panel === "left") {
            if (BASE_LEFT_TABS.includes(tabId)) return; // Only user-added tabs can be removed
            
            const updatedLeft = leftTabs.filter(t => t !== tabId);
            setLeftTabs(updatedLeft);
            localStorage.setItem("dsa-layout-left-tabs", JSON.stringify(updatedLeft));
            
            if (activeLeftTab === tabId && updatedLeft.length > 0) {
                setActiveLeftTab(updatedLeft[0]);
            }
        } else {
            if (BASE_RIGHT_TABS.includes(tabId)) return; // Only user-added tabs can be removed
            
            const updatedRight = rightTabs.filter(t => t !== tabId);
            setRightTabs(updatedRight);
            localStorage.setItem("dsa-layout-right-tabs", JSON.stringify(updatedRight));
            
            if (activeRightTab === tabId && updatedRight.length > 0) {
                setActiveRightTab(updatedRight[0]);
            }
        }
    }, [leftTabs, rightTabs, activeLeftTab, activeRightTab, setActiveLeftTab, setActiveRightTab]);

    const resetLayout = useCallback(() => {
        setLeftTabs(DEFAULT_LEFT_TABS);
        setRightTabs(DEFAULT_RIGHT_TABS);
        setActiveLeftTab("description");
        setActiveRightTab("editor");
        localStorage.removeItem("dsa-layout-left-tabs");
        localStorage.removeItem("dsa-layout-right-tabs");
        localStorage.removeItem("dsa-layout-active-left-tab");
        localStorage.removeItem("dsa-layout-active-right-tab");
    }, [setActiveLeftTab, setActiveRightTab]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const tabParam = params.get("tab");
            if (tabParam) {
                if (leftTabs.includes(tabParam)) {
                    setActiveLeftTab(tabParam);
                } else if (rightTabs.includes(tabParam)) {
                    setActiveRightTab(tabParam);
                }
            }
        }
    }, [leftTabs, rightTabs, setActiveLeftTab, setActiveRightTab]);

    // Migration: Move thinkpad to right panel and remove from left panel for existing users
    useEffect(() => {
        if (typeof window !== "undefined") {
            const migrated = localStorage.getItem("dsa-layout-migrated-thinkpad-v4");
            if (!migrated) {
                let leftChanged = false;
                let rightChanged = false;
                
                let currentLeft = [...leftTabs];
                if (currentLeft.includes("thinkpad")) {
                    currentLeft = currentLeft.filter(t => t !== "thinkpad");
                    leftChanged = true;
                }
                
                let currentRight = [...rightTabs];
                if (!currentRight.includes("thinkpad")) {
                    currentRight.push("thinkpad");
                    rightChanged = true;
                }
                
                if (leftChanged) {
                    setLeftTabs(currentLeft);
                    localStorage.setItem("dsa-layout-left-tabs", JSON.stringify(currentLeft));
                    if (activeLeftTab === "thinkpad" && currentLeft.length > 0) {
                        setActiveLeftTab(currentLeft[0]);
                    }
                }
                if (rightChanged) {
                    setRightTabs(currentRight);
                    localStorage.setItem("dsa-layout-right-tabs", JSON.stringify(currentRight));
                }
                localStorage.setItem("dsa-layout-migrated-thinkpad-v4", "true");
            }
        }
    }, [leftTabs, rightTabs, activeLeftTab, setActiveLeftTab]);


    const [isCodeRunnerMaximized, setIsCodeRunnerMaximized] = useState(false);
    const [isVisualizationMaximized, setIsVisualizationMaximized] = useState(false);
    const [isBrainstormMaximized, setIsBrainstormMaximized] = useState(false);

    const leftPanelRef = useRef<any>(null);
    const rightPanelRef = useRef<any>(null);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setWindowWidth(width);
            setIsMobile(width < 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleLeftPanel = useCallback(() => {
        setIsLeftCollapsed(prev => {
            const newCollapsed = !prev;
            localStorage.setItem('leftPanelCollapsed', String(newCollapsed));
            if (newCollapsed) {
                leftPanelRef.current?.collapse();
            } else {
                leftPanelRef.current?.expand();
            }
            return newCollapsed;
        });
    }, []);

    const toggleRightPanel = useCallback(() => {
        setIsRightCollapsed(prev => {
            const newCollapsed = !prev;
            localStorage.setItem('rightPanelCollapsed', String(newCollapsed));
            if (newCollapsed) {
                rightPanelRef.current?.collapse();
            } else {
                rightPanelRef.current?.expand();
            }
            return newCollapsed;
        });
    }, []);

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
        leftTabs,
        rightTabs,
        activeLeftTab,
        activeRightTab,
        setActiveLeftTab,
        setActiveRightTab,
        addTab,
        removeTab,
        resetLayout,
        isCodeRunnerMaximized,
        setIsCodeRunnerMaximized,
        isVisualizationMaximized,
        setIsVisualizationMaximized,
        isBrainstormMaximized,
        setIsBrainstormMaximized,
    };
};
