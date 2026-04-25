import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { LazyCodeEditor, CodeEditorSkeleton } from "./LazyCodeEditor";
import { EditorSettings } from "@/hooks/useEditorSettings";
import { Submission } from "@/types/userAlgorithmData";
import { Language } from "./LanguageSelector";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BrainstormSection } from "../brainstorm/BrainstormSection";

interface EditorPaneProps {
    activeEditorTab: "current" | "submission" | "scratchpad";
    code: string;
    onCodeChange: (code: string) => void;
    language: Language;
    problemId?: string;
    isMobile: boolean;
    isLoading: boolean;
    settings: EditorSettings;
    viewingSubmission: Submission | null;
    editorRef: React.RefObject<any>;
    brainstormProps?: {
        algorithmId: string;
        algorithmTitle: string;
        controls?: any;
    };
    onShortcut?: (key: string) => void;
}

export const EditorPane: React.FC<EditorPaneProps> = ({
    activeEditorTab,
    code,
    onCodeChange,
    language,
    problemId,
    isMobile,
    isLoading,
    settings,
    viewingSubmission,
    editorRef,
    brainstormProps,
    onShortcut
}) => {
    const handleCopySubmission = () => {
        if (viewingSubmission?.code) {
            navigator.clipboard.writeText(viewingSubmission.code);
            toast.success("Submission code copied to clipboard");
        }
    };

    return (
        <>
            <TabsContent value="current" className="flex-1 flex flex-col min-h-0 m-0 data-[state=inactive]:hidden h-full">
                <div className={`h-full flex flex-col ${viewingSubmission ? '' : 'border-t-0'}`}>
                    <div className="flex-1 relative min-h-[300px]">
                        {isLoading ? (
                            <CodeEditorSkeleton />
                        ) : (
                            <LazyCodeEditor
                                ref={editorRef}
                                code={code}
                                isMobile={isMobile}
                                language={language}
                                path={`/runner/${problemId || 'playground'}/${language}/code.${language === 'python' ? 'py' : language === 'java' ? 'java' : language === 'cpp' ? 'cpp' : 'ts'}`}
                                onChange={(value) => {
                                    onCodeChange(value || '');
                                }}
                                theme={settings.theme}
                                options={{
                                    ...settings,
                                    readOnly: false
                                }}
                                onShortcut={onShortcut}
                            />
                        )}
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="submission" className="flex-1 flex flex-col min-h-0 m-0 data-[state=inactive]:hidden h-full">
                <div className="h-full flex flex-col bg-background">
                    <div className="flex items-center justify-between p-2 border-b bg-muted/30">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium px-2">
                                {viewingSubmission?.language} Submission
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {viewingSubmission && new Date(viewingSubmission.timestamp).toLocaleString()}
                            </span>
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="h-8 gap-2"
                            onClick={handleCopySubmission}
                        >
                            <Copy className="w-3 h-3" />
                            Copy Code
                        </Button>
                    </div>

                    <div className="flex-1 relative min-h-0">
                        <LazyCodeEditor
                            code={viewingSubmission?.code || ''}
                            language={viewingSubmission?.language as Language || 'typescript'}
                            path={`/runner/submission/${viewingSubmission?.id}`}
                            onChange={() => { }} // Read only
                            theme={settings.theme}
                            options={{
                                ...settings,
                                readOnly: true
                            }}
                            isMobile={isMobile}
                        />
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="scratchpad" className="flex-1 flex flex-col min-h-0 m-0 data-[state=inactive]:hidden h-full bg-background">
                {brainstormProps && (
                    <BrainstormSection
                        algorithmId={brainstormProps.algorithmId}
                        algorithmTitle={brainstormProps.algorithmTitle}
                        controls={brainstormProps.controls}
                    />
                )}
            </TabsContent>
        </>
    );
};
