import React from "react";
import {
    Code, Book, X, RotateCcw, AlignLeft,
    Maximize, Minimize2, PanelRightClose
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LanguageSelector, Language } from "./LanguageSelector";
import { SettingsPopover } from "./SettingsPopover";
import { EditorSettings } from "@/hooks/useEditorSettings";
import { Submission } from "@/types/userAlgorithmData";

interface EditorToolbarProps {
    activeEditorTab: "current" | "submission" | "scratchpad";
    setActiveEditorTab: (tab: "current" | "submission" | "scratchpad") => void;
    language: Language;
    onLanguageChange: (lang: Language) => void;
    availableLanguages?: Language[];
    isMobile: boolean;
    onToggleRightPanel?: () => void;
    onReset: () => void;
    onFormatCode: () => void;
    isLoading: boolean;
    isSubmitting: boolean;
    isFullscreen: boolean;
    onToggleFullscreen: () => void;
    viewingSubmission: Submission | null;
    onCloseSubmission: (e?: React.MouseEvent) => void;
    isScratchpadOpen: boolean;
    setIsScratchpadOpen: (val: boolean) => void;
    settings: EditorSettings;
    updateSetting: <K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) => void;
    brainstormProps?: {
        algorithmId: string;
        algorithmTitle: string;
        controls?: any;
    };
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
    activeEditorTab,
    setActiveEditorTab,
    language,
    onLanguageChange,
    availableLanguages,
    isMobile,
    onToggleRightPanel,
    onReset,
    onFormatCode,
    isLoading,
    isSubmitting,
    isFullscreen,
    onToggleFullscreen,
    viewingSubmission,
    onCloseSubmission,
    isScratchpadOpen,
    setIsScratchpadOpen,
    settings,
    updateSetting,
    brainstormProps
}) => {
    return (
        <div className="flex items-center justify-between px-0 border-b bg-muted/40 h-10 shrink-0 gap-2">
            <div className="flex items-center gap-0 overflow-x-auto no-scrollbar mask-linear-fade shrink-0 h-full">
                {!isMobile && onToggleRightPanel && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleRightPanel}
                        title="Collapse Panel"
                        className="h-10 w-10 p-0 rounded-none hover:bg-primary/10 hover:text-primary shrink-0"
                    >
                        <PanelRightClose className="w-4 h-4" />
                    </Button>
                )}

                {activeEditorTab === 'current' && (
                    <div className="flex items-center gap-2 mr-4">
                        <LanguageSelector
                            language={language}
                            onLanguageChange={onLanguageChange}
                            disabled={isLoading || isSubmitting}
                            availableLanguages={availableLanguages}
                        />
                    </div>
                )}

                {(isScratchpadOpen || viewingSubmission) && (
                    <TabsList className="bg-transparent h-10 p-0 gap-0 w-auto justify-start rounded-none">
                        <TabsTrigger
                            value="current"
                            className="data-[state=active]:bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary h-10 px-4 rounded-none gap-2"
                        >
                            <Code className="w-4 h-4" />
                            {!isMobile && "Code"}
                        </TabsTrigger>

                        {brainstormProps && isScratchpadOpen && (
                            <TabsTrigger
                                value="scratchpad"
                                className="data-[state=active]:bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary h-10 px-4 rounded-none gap-2 items-center group"
                            >
                                <Book className="w-4 h-4" />
                                {!isMobile && "Thinkpad"}
                                <div
                                    role="button"
                                    className="opacity-60 hover:opacity-100 hover:bg-muted rounded-full p-0.5 ml-1 transition-all"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsScratchpadOpen(false);
                                        if (activeEditorTab === 'scratchpad') {
                                            setActiveEditorTab('current');
                                        }
                                    }}
                                >
                                    <X className="w-3 h-3" />
                                </div>
                            </TabsTrigger>
                        )}

                        {viewingSubmission && (
                            <TabsTrigger
                                value="submission"
                                className="data-[state=active]:bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary h-10 px-4 gap-3 rounded-none group items-center"
                            >
                                <div className="flex items-center gap-2 text-xs">
                                    <span className={`font-semibold ${viewingSubmission?.status === 'passed' ? 'text-green-600' : 'text-destructive'}`}>
                                        {viewingSubmission?.status === 'passed' ? 'Accepted' : (viewingSubmission?.status === 'error' ? 'Runtime Error' : 'Wrong Answer')}
                                    </span>
                                    {!isMobile && (
                                        <>
                                            <span className="text-muted-foreground">|</span>
                                            <span className="uppercase font-medium text-foreground">{viewingSubmission?.language}</span>
                                        </>
                                    )}
                                </div>

                                <div
                                    role="button"
                                    className="opacity-60 group-hover:opacity-100 hover:bg-muted rounded-full p-0.5 ml-1"
                                    onClick={(e) => onCloseSubmission(e)}
                                >
                                    <X className="w-3 h-3" />
                                </div>
                            </TabsTrigger>
                        )}
                    </TabsList>
                )}
            </div>

            <div className="flex items-center gap-1 shrink-0 pr-1">
                {activeEditorTab === 'current' && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={onReset}
                                    disabled={isLoading || isSubmitting}
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">Reset to starter code</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={onFormatCode}
                                >
                                    <AlignLeft className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">Format code</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}

                <SettingsPopover settings={settings} updateSetting={updateSetting} />

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={onToggleFullscreen}
                    title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                    {isFullscreen ? (
                        <Minimize2 className="w-4 h-4" />
                    ) : (
                        <Maximize className="w-4 h-4" />
                    )}
                </Button>
            </div>
        </div>
    );
};
