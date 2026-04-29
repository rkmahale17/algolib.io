import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs } from "@/components/ui/tabs";
import { useFeatureFlag } from "@/contexts/FeatureFlagContext";
import { usePostHog } from "@posthog/react";

import { OutputPanel } from './OutputPanel';
import { RunnerFooter } from './RunnerFooter';
import type { CodeEditorRef } from './CodeEditor';
import { EditorToolbar } from './EditorToolbar';
import { EditorPane } from './EditorPane';
import { DEFAULT_CODE } from './constants';
import { ImperativePanelGroupHandle } from "react-resizable-panels";
import { Language } from './LanguageSelector';
import { Submission } from '@/types/userAlgorithmData';
import { toast } from "sonner";
import { generateStub } from '@/utils/stubGenerator';

// Hooks
import { useEditorSettings } from '@/hooks/useEditorSettings';
import { useTestCases } from '@/hooks/useTestCases';
import { useSubmissionViewer } from '@/hooks/useSubmissionViewer';
import { useCodeExecution } from '@/hooks/useCodeExecution';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

interface CodeRunnerProps {
  algorithmId?: string; // problemId in generic version
  algorithmData?: any;  // problem in generic version
  onToggleFullscreen?: () => void;
  isMaximized?: boolean;
  className?: string;
  initialCode?: string;
  onCodeChange?: (code: string) => void;
  language?: Language;
  onLanguageChange?: (language: Language) => void;
  onSuccess?: () => void;
  controls?: any;
  submissions?: Submission[];
  isInterviewMode?: boolean;
  onStateChange?: (state: any) => void;
  isMobile?: boolean;
  isLoading?: boolean;
  onToggleRightPanel?: () => void;
  brainstormProps?: any;
  hasPremiumAccess?: boolean;
  handleRandomProblem?: () => void;
  handleNextProblem?: () => void;
  handlePreviousProblem?: () => void;
}

export interface CodeRunnerRef {
  run: () => void;
  submit: () => void;
  openThinkpad: () => void;
}

export const CodeRunner = React.forwardRef<CodeRunnerRef, CodeRunnerProps>(({
  algorithmId,
  algorithmData,
  onToggleFullscreen,
  isMaximized = false,
  className,
  initialCode,
  onCodeChange,
  language: controlledLanguage,
  onLanguageChange,
  onSuccess,
  controls,
  submissions: initialSubmissions = [],
  isInterviewMode,
  onStateChange,
  isMobile,
  isLoading: isLoadingProp,
  onToggleRightPanel,
  brainstormProps,
  handleRandomProblem,
  handleNextProblem,
  handlePreviousProblem
}, ref) => {
  const posthog = usePostHog();
  const isLimitExceeded = useFeatureFlag("todays_limit_exceed");

  const [internalLanguage, setInternalLanguage] = useState<Language>('typescript');
  const language = controlledLanguage || internalLanguage;
  const availableLanguages = controls?.languages ? (Object.keys(controls.languages) as Language[]).filter((lang: string) => controls.languages[lang]) : undefined;

  const [code, setCode] = useState<string>(initialCode || DEFAULT_CODE['typescript']);
  const [internalIsFullscreen, setInternalIsFullscreen] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);

  const editorRef = useRef<CodeEditorRef>(null);
  const panelGroupRef = useRef<ImperativePanelGroupHandle>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [minPanelSize, setMinPanelSize] = useState(8);
  const [isOutputExpanded, setIsOutputExpanded] = useState(false);
  const [isOutputModalOpen, setIsOutputModalOpen] = useState(false);

  // Hook 1: Editor Settings
  const { settings, updateSetting } = useEditorSettings();

  // Hook 2: Test Cases
  const testCasesHook = useTestCases();
  const { testCases, setTestCases, executedTestCases, setExecutedTestCases, activeTab, setActiveTab, activeTestCaseTab, setActiveTestCaseTab, editingTestCaseId, setEditingTestCaseId, inputValues, setInputValues, handleAddTestCase, handleUpdateTestCase, handleDeleteTestCase, handleCancelEdit, pendingTestCaseId, setPendingTestCaseId } = testCasesHook;

  // Hook 3: Submission Viewer
  const submissionViewer = useSubmissionViewer({
    algorithmId,
    setIsOutputExpanded,
    setIsOutputModalOpen
  });

  const { viewingSubmission, activeEditorTab, setActiveEditorTab, isScratchpadOpen, setIsScratchpadOpen } = submissionViewer;

  useEffect(() => {
    if (!containerRef.current) return;
    let initialSet = false;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry && entry.contentRect.height > 0) {
        const minPercent = (82 / entry.contentRect.height) * 100;
        setMinPanelSize(minPercent);
      }
    });

    const timer = setInterval(() => {
      if (!initialSet && panelGroupRef.current && !isMobile && containerRef.current?.clientHeight) {
        const minPercent = (82 / containerRef.current.clientHeight) * 100;
        panelGroupRef.current.setLayout([100 - minPercent, minPercent]);
        initialSet = true;
        clearInterval(timer);
      }
    }, 50);

    setTimeout(() => clearInterval(timer), 3000);

    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
      clearInterval(timer);
    };
  }, [isMobile]);

  // Initialize Data
  useEffect(() => {
    if (initialSubmissions.length > 0) {
      setSubmissions(initialSubmissions);
    }
  }, [initialSubmissions]);

  useEffect(() => {
    if (algorithmData) {
      if (algorithmData.test_cases) {
        const initialTestCases = algorithmData.test_cases.map((tc: any, idx: number) => ({
          id: idx,
          input: tc.input,
          expectedOutput: tc.expectedOutput || tc.output,
          isCustom: false,
          description: tc.description,
          isSubmission: tc.isSubmission
        }));
        setTestCases(initialTestCases);
      }

      const initialValues: Record<string, string> = {};
      if (algorithmData.input_schema) {
        algorithmData.input_schema.forEach((field: any, index: number) => {
          const defaultVal = algorithmData.test_cases?.[0]?.input[index];
          initialValues[field.name] = defaultVal !== undefined ? JSON.stringify(defaultVal) : "";
        });
        setInputValues(initialValues);
      }

      if (typeof initialCode === 'string' && initialCode.trim().length > 0) {
        setCode(initialCode);
        return;
      }

      const impl = algorithmData.implementations?.find((i: any) => i.lang.toLowerCase() === language.toLowerCase());
      let algoCode = impl?.code?.find((c: any) => c.codeType === 'starter')?.code || impl?.code?.find((c: any) => c.codeType === 'optimize')?.code;

      if (!algoCode && algorithmData.input_schema) {
        const functionName = algorithmId?.replace(/-/g, '_') || 'solution';
        const parsedInputs: Record<string, any> = {};
        algorithmData.input_schema.forEach((field: any) => {
          const value = initialValues[field.name]; // Use initialValues since state might not be updated yet
          if (value) {
            try { parsedInputs[field.name] = JSON.parse(value); } catch { parsedInputs[field.name] = value; }
          }
        });

        algoCode = generateStub(
          language,
          functionName,
          algorithmData.input_schema as any,
          Object.keys(parsedInputs).length > 0 ? parsedInputs : undefined
        );
      }

      setCode(algoCode || DEFAULT_CODE[language]);
    } else {
      if (typeof initialCode === 'string' && initialCode.trim().length > 0) {
        setCode(initialCode);
      } else {
        setCode(DEFAULT_CODE[language]);
      }
    }
  }, [algorithmData, language, algorithmId, initialCode]);

  const handleLanguageChange = (newLang: Language) => {
    if (onLanguageChange) onLanguageChange(newLang);
    else setInternalLanguage(newLang);
  };

  const handleReset = () => {
    if (algorithmData) {
      const impl = algorithmData.implementations?.find((i: any) => i.lang.toLowerCase() === language.toLowerCase());
      const algoCode = impl?.code?.find((c: any) => c.codeType === 'starter')?.code || impl?.code?.find((c: any) => c.codeType === 'optimize')?.code;
      setCode(algoCode || DEFAULT_CODE[language]);
    } else {
      setCode(DEFAULT_CODE[language]);
    }
    toast.success("Code reset to default");
  };

  const handleFormatCode = () => {
    editorRef.current?.formatCode();
    toast.success("Code formatted");
  };

  const isFullscreen = isMaximized || internalIsFullscreen;
  const toggleFullscreen = useCallback(() => {
    if (onToggleFullscreen) onToggleFullscreen();
    else setInternalIsFullscreen(prev => !prev);
  }, [onToggleFullscreen]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        if (!onToggleFullscreen) setInternalIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullscreen, onToggleFullscreen]);

  useEffect(() => {
    const timer = setTimeout(() => { editorRef.current?.layout(); }, 100);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  // Hook 4: Code Execution
  const executionHook = useCodeExecution({
    algorithmId,
    activeAlgorithm: algorithmData,
    code,
    language,
    testCases,
    setExecutedTestCases,
    editorRef,
    setActiveTab,
    setSubmissions,
    posthog,
    isLimitExceeded,
    onRunStart: () => {
      if (isMobile) {
        setIsOutputExpanded(true);
      } else {
        panelGroupRef.current?.setLayout([60, 40]);
        setIsOutputExpanded(true);
      }
    },
    onSuccess
  });

  const { isLoading, isSubmitting, output, executionTime, lastRunSuccess, handleRun, handleSubmit } = executionHook;

  // Expose Imperative Handle
  React.useImperativeHandle(ref, () => ({
    run: handleRun,
    submit: handleSubmit,
    openThinkpad: () => {
      setIsScratchpadOpen(true);
      setActiveEditorTab("scratchpad");
    }
  }));

  // Report state changes
  useEffect(() => {
    onStateChange?.({ isLoading, isSubmitting, lastRunSuccess });
  }, [isLoading, isSubmitting, lastRunSuccess, onStateChange]);

  // Hook 5: Keyboard Shortcuts
  useKeyboardShortcuts({
    isLoading,
    isSubmitting,
    lastRunSuccess,
    controls,
    handleRun,
    handleSubmit
  });

  const handleShortcut = (key: string) => {
    if (key === "'") {
      if (!isLoading && !isSubmitting && controls?.run_code !== false) {
        handleRun();
      }
    } else if (key === "Enter") {
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

  const handleToggleOutputExpand = () => {
    const newExpanded = !isOutputExpanded;
    setIsOutputExpanded(newExpanded);
    if (!isMobile && panelGroupRef.current) {
      if (newExpanded) {
        panelGroupRef.current.setLayout([60, 40]);
      } else {
        panelGroupRef.current.setLayout([100 - minPanelSize, minPanelSize]);
      }
    }
  };

  const outputPanelContent = (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <OutputPanel
          onToggleExpand={handleToggleOutputExpand}
          isExpanded={isOutputExpanded}
          onMaximize={() => setIsOutputModalOpen(!isOutputModalOpen)}
          isMaximized={isOutputModalOpen}
          output={output}
          loading={isLoading}
          submitting={isSubmitting}
          stdin=""
          onStdinChange={() => { }}
          testCases={testCases.map((tc: any) => ({
            input: tc.input,
            output: tc.expectedOutput
          }))}
          executionTime={executionTime}
          algorithmMeta={algorithmData}
          activeTab={activeTab}
          onTabChange={setActiveTab as any}
          allTestCases={testCases}
          executedTestCases={executedTestCases}
          onAddTestCase={() => handleAddTestCase(algorithmData)}
          onUpdateTestCase={handleUpdateTestCase}
          onDeleteTestCase={handleDeleteTestCase}
          submissions={submissions}
          onSelectSubmission={submissionViewer.handleSelectSubmission}
          editingTestCaseId={editingTestCaseId}
          onEditTestCase={setEditingTestCaseId}
          onCancelEdit={handleCancelEdit}
          inputSchema={algorithmData?.input_schema}
          controls={controls}
          activeTestCaseTab={activeTestCaseTab}
          onTestCaseTabChange={setActiveTestCaseTab}
        />
      </div>

      <RunnerFooter
        isExpanded={isOutputExpanded}
        onToggleExpand={handleToggleOutputExpand}
        onRun={handleRun}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        lastRunSuccess={lastRunSuccess}
        algorithm={algorithmData}
        handleRandomProblem={handleRandomProblem}
        handleNextProblem={handleNextProblem}
        handlePreviousProblem={handlePreviousProblem}
      />
    </div>
  );

  const editorTabs = (
    <Tabs
      value={activeEditorTab}
      onValueChange={(v) => setActiveEditorTab(v as any)}
      className="h-full flex flex-col"
    >
      <EditorToolbar
        activeEditorTab={activeEditorTab}
        setActiveEditorTab={setActiveEditorTab}
        language={language}
        onLanguageChange={handleLanguageChange}
        availableLanguages={availableLanguages}
        isMobile={isMobile || false}
        onToggleRightPanel={onToggleRightPanel}
        onReset={handleReset}
        onFormatCode={handleFormatCode}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        viewingSubmission={viewingSubmission}
        onCloseSubmission={submissionViewer.handleCloseSubmission}
        isScratchpadOpen={isScratchpadOpen}
        setIsScratchpadOpen={setIsScratchpadOpen}
        settings={settings}
        updateSetting={updateSetting}
        brainstormProps={brainstormProps}
      />

      <EditorPane
        activeEditorTab={activeEditorTab}
        code={code}
        onCodeChange={(newCode) => {
          setCode(newCode);
          onCodeChange?.(newCode);
        }}
        language={language}
        problemId={algorithmId}
        isMobile={isMobile || false}
        isLoading={isLoadingProp || false}
        settings={settings}
        viewingSubmission={viewingSubmission}
        editorRef={editorRef}
        brainstormProps={brainstormProps}
        onShortcut={handleShortcut}
      />
    </Tabs>
  );

  const content = (
    <div ref={containerRef} className={`w-full bg-background shadow-sm flex flex-col ${isFullscreen
      ? 'fixed inset-0 z-50 h-screen w-screen rounded-none border-0'
      : `border rounded-lg overflow-hidden ${className || 'h-[calc(100vh-100px)]'}`
      }`}>
      {isMobile ? (
        <div className="h-full flex flex-col">
          <div className="flex-1 min-h-0 overflow-hidden">
            {editorTabs}
          </div>
          <div className={`flex flex-col border-t bg-background transition-all duration-300 ease-in-out ${isOutputExpanded ? 'h-[50vh]' : 'h-[64px]'}`}>
            {!isOutputModalOpen && outputPanelContent}
          </div>
        </div>
      ) : (
        <ResizablePanelGroup ref={panelGroupRef} direction="vertical" className="h-full">
          <ResizablePanel defaultSize={100 - minPanelSize} minSize={20} collapsible={true} collapsedSize={0}>
            {editorTabs}
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-muted/50 hover:bg-primary/20 data-[resize-handle-active]:bg-primary/40 transition-colors" />
          <ResizablePanel
            defaultSize={minPanelSize}
            minSize={minPanelSize}
            onResize={(size) => {
              if (size > minPanelSize + 5 && !isOutputExpanded) setIsOutputExpanded(true);
              if (size <= minPanelSize + 5 && isOutputExpanded) setIsOutputExpanded(false);
            }}
          >
            {!isOutputModalOpen && outputPanelContent}
          </ResizablePanel>
        </ResizablePanelGroup>
      )}

      <Dialog open={isOutputModalOpen} onOpenChange={setIsOutputModalOpen}>
        <DialogContent className="max-w-none w-screen h-screen m-0 flex flex-col p-0 overflow-hidden border-0 bg-background shadow-none rounded-none [&>button]:hidden">
          {outputPanelContent}
        </DialogContent>
      </Dialog>
    </div>
  );

  if (isFullscreen) {
    return createPortal(content, document.body);
  }

  return content;
});

CodeRunner.displayName = 'CodeRunner';

export default CodeRunner;
