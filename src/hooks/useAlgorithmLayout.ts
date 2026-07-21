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
const DEFAULT_LEFT_TABS = ["description", "visualizations", "rulo", "solutions", "submissions"];
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
    const [isLoaded, setIsLoaded] = useState(false);

    // Load layout states from localStorage on client mount to prevent SSR hydration mismatch
    useEffect(() => {
        let parsedLeft = DEFAULT_LEFT_TABS;
        const savedLeft = localStorage.getItem("dsa-layout-left-tabs");
        if (savedLeft) {
            try {
                parsedLeft = JSON.parse(savedLeft);
                setLeftTabs(parsedLeft);
            } catch (e) {
                console.error("Failed to parse left tabs", e);
            }
        }

        let parsedRight = DEFAULT_RIGHT_TABS;
        const savedRight = localStorage.getItem("dsa-layout-right-tabs");
        if (savedRight) {
            try {
                parsedRight = JSON.parse(savedRight);
                setRightTabs(parsedRight);
            } catch (e) {
                console.error("Failed to parse right tabs", e);
            }
        }

        const savedActiveLeft = localStorage.getItem("dsa-layout-active-left-tab");
        if (savedActiveLeft && parsedLeft.includes(savedActiveLeft)) {
            setActiveLeftTabState(savedActiveLeft);
            setActiveTabState(savedActiveLeft); // Sync legacy activeTab compatibility
        } else if (parsedLeft.length > 0) {
            setActiveLeftTabState(parsedLeft[0]);
            setActiveTabState(parsedLeft[0]);
        }

        const savedActiveRight = localStorage.getItem("dsa-layout-active-right-tab");
        if (savedActiveRight && parsedRight.includes(savedActiveRight)) {
            setActiveRightTabState(savedActiveRight);
        } else if (parsedRight.length > 0) {
            setActiveRightTabState(parsedRight[0]);
        }
        
        setIsLoaded(true);
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

    const hasAppliedUrlTab = useRef(false);

    useEffect(() => {
        if (!isLoaded || typeof window === "undefined" || hasAppliedUrlTab.current) return;
        
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get("tab");
        
        if (tabParam) {
            const inLeft = leftTabs.includes(tabParam);
            const inRight = rightTabs.includes(tabParam);
            
            if (inLeft || inRight) {
                hasAppliedUrlTab.current = true;
                
                let targetPanel = "left";
                if (inLeft && inRight) {
                    targetPanel = DEFAULT_RIGHT_TABS.includes(tabParam) ? "right" : "left";
                } else if (inRight) {
                    targetPanel = "right";
                }

                if (targetPanel === "left") {
                    setActiveLeftTab(tabParam);
                    if (activeRightTab === tabParam) {
                        const fallback = rightTabs.find(t => t !== tabParam) || "editor";
                        setActiveRightTab(fallback);
                    }
                } else {
                    setActiveRightTab(tabParam);
                    if (activeLeftTab === tabParam) {
                        const fallback = leftTabs.find(t => t !== tabParam) || "description";
                        setActiveLeftTab(fallback);
                    }
                }
            }
        }
    }, [isLoaded, leftTabs, rightTabs, activeLeftTab, activeRightTab, setActiveLeftTab, setActiveRightTab]);

    // Ensure the same tab is not active on both panels initially
    useEffect(() => {
        if (activeLeftTab === activeRightTab && activeLeftTab !== "") {
            const fallback = rightTabs.find(t => t !== activeRightTab) || "editor";
            setActiveRightTab(fallback);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Migrations: Run only AFTER localStorage values have been loaded into state.
    // Without the isLoaded gate, migrations see the default (full) tab arrays on
    // the first render, mark themselves as done, and never fix the stale values
    // that arrive from localStorage on the second render.
    useEffect(() => {
        if (!isLoaded || typeof window === "undefined") return;

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

            // Migration: Add rulo to left panel for existing users
            const migratedRulo = localStorage.getItem("dsa-layout-migrated-rulo-v5");
            if (!migratedRulo) {
                let leftChanged = false;
                
                let currentLeft = [...leftTabs];
                if (!currentLeft.includes("rulo")) {
                    currentLeft.push("rulo");
                    leftChanged = true;
                }
                
                if (leftChanged) {
                    setLeftTabs(currentLeft);
                    localStorage.setItem("dsa-layout-left-tabs", JSON.stringify(currentLeft));
                }
                localStorage.setItem("dsa-layout-migrated-rulo-v5", "true");
            }

            // Migration v6: Ensure all default tabs are present in both panels.
            // Fixes stale localStorage where users lost tabs (e.g. only "description" left, only "editor" right).
            const migratedEnsureDefaults = localStorage.getItem("dsa-layout-migrated-ensure-defaults-v7");
            if (!migratedEnsureDefaults) {
                let currentLeft = [...leftTabs];
                let currentRight = [...rightTabs];
                let leftChanged = false;
                let rightChanged = false;

                for (const tab of DEFAULT_LEFT_TABS) {
                    if (!currentLeft.includes(tab) && !currentRight.includes(tab)) {
                        currentLeft.push(tab);
                        leftChanged = true;
                    }
                }
                for (const tab of DEFAULT_RIGHT_TABS) {
                    if (!currentRight.includes(tab) && !currentLeft.includes(tab)) {
                        currentRight.push(tab);
                        rightChanged = true;
                    }
                }

                if (leftChanged) {
                    setLeftTabs(currentLeft);
                    localStorage.setItem("dsa-layout-left-tabs", JSON.stringify(currentLeft));
                }
                if (rightChanged) {
                    setRightTabs(currentRight);
                    localStorage.setItem("dsa-layout-right-tabs", JSON.stringify(currentRight));
                }
                localStorage.setItem("dsa-layout-migrated-ensure-defaults-v7", "true");
            }

            // Migration v8: Enforce the order of default left panel tabs to:
            // Description, Visualizations, Rulo, Solutions, Submissions.
            const migratedOrderV8 = localStorage.getItem("dsa-layout-migrated-ensure-defaults-v8");
            if (!migratedOrderV8) {
                let currentLeft = [...leftTabs];
                let currentRight = [...rightTabs];
                let leftChanged = false;
                let rightChanged = false;

                for (const tab of DEFAULT_LEFT_TABS) {
                    if (!currentLeft.includes(tab) && !currentRight.includes(tab)) {
                        currentLeft.push(tab);
                        leftChanged = true;
                    }
                }
                for (const tab of DEFAULT_RIGHT_TABS) {
                    if (!currentRight.includes(tab) && !currentLeft.includes(tab)) {
                        currentRight.push(tab);
                        rightChanged = true;
                    }
                }

                const sortedLeft = [...currentLeft].sort((a, b) => {
                    const idxA = DEFAULT_LEFT_TABS.indexOf(a);
                    const idxB = DEFAULT_LEFT_TABS.indexOf(b);
                    if (idxA === -1) return 1;
                    if (idxB === -1) return -1;
                    return idxA - idxB;
                });

                if (JSON.stringify(sortedLeft) !== JSON.stringify(currentLeft)) {
                    currentLeft = sortedLeft;
                    leftChanged = true;
                }

                if (leftChanged) {
                    setLeftTabs(currentLeft);
                    localStorage.setItem("dsa-layout-left-tabs", JSON.stringify(currentLeft));
                }
                if (rightChanged) {
                    setRightTabs(currentRight);
                    localStorage.setItem("dsa-layout-right-tabs", JSON.stringify(currentRight));
                }
                localStorage.setItem("dsa-layout-migrated-ensure-defaults-v8", "true");
            }
    }, [isLoaded, leftTabs, rightTabs, activeLeftTab, setActiveLeftTab]);


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
