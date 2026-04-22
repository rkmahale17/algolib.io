import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useFeatureFlag } from "@/contexts/FeatureFlagContext";
import { usePostHog } from "@posthog/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, RotateCcw, Loader2, Maximize, Minimize2, Settings, AlignLeft, Info, Send, Copy, X, Clock, Terminal, Book, PanelRightClose, Code } from "lucide-react";
import { BrainstormSection } from "../brainstorm/BrainstormSection";
import { FeatureGuard } from "@/components/FeatureGuard";
import { toast } from "sonner";
import axios from 'axios';
import { ImperativePanelGroupHandle } from "react-resizable-panels";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import confetti from 'canvas-confetti';

import { LanguageSelector, Language } from './LanguageSelector';
import { LazyCodeEditor, CodeEditorSkeleton } from './LazyCodeEditor';
import type { CodeEditorRef } from './CodeEditor';
import { OutputPanel } from './OutputPanel';
import { DEFAULT_CODE, LANGUAGE_IDS } from './constants';
import { supabase } from '@/integrations/supabase/client';
import { generateStub } from '@/utils/stubGenerator';
import { addSubmission, updateProgress, getUserAlgorithmData } from '@/utils/userAlgorithmDataHelpers';
import { Submission } from '@/types/userAlgorithmData';
import { RunnerFooter } from './RunnerFooter';
import env from '@/config/env';

interface CodeRunnerProps {
  algorithmId?: string;
  algorithmData?: any;
  onToggleFullscreen?: () => void;
  isMaximized?: boolean;
  className?: string;
  initialCode?: string;
  onCodeChange?: (code: string) => void;
  language?: Language;
  onLanguageChange?: (language: Language) => void;
  onSuccess?: () => void;
  controls?: {
    run_code: boolean;
    submit: boolean;
    add_test_case: boolean;
    languages: {
      typescript: boolean;
      python: boolean;
      java: boolean;
      cpp: boolean;
    };
  };
  submissions?: Submission[];
  isInterviewMode?: boolean;
  // New props for remote control
  onStateChange?: (state: { isLoading: boolean; isSubmitting: boolean; lastRunSuccess: boolean }) => void;
  isMobile?: boolean;
  isLoading?: boolean;
  onToggleRightPanel?: () => void;
  brainstormProps?: {
    algorithmId: string;
    algorithmTitle: string;
    controls?: any;
  };
}

export interface CodeRunnerRef {
  run: () => void;
  submit: () => void;
  openThinkpad: () => void;
}

interface EditorSettings {
  fontSize: number;
  theme: 'dark' | 'light' | 'system';
  tabSize: number;
  wordWrap: 'on' | 'off';
  minimap: boolean;
  lineNumbers: 'on' | 'off' | 'relative' | 'interval';
  autocomplete: boolean;
}

const DEFAULT_SETTINGS: EditorSettings = {
  fontSize: 14,
  theme: 'system',
  tabSize: 2,
  wordWrap: 'off',
  minimap: false,
  lineNumbers: 'on',
  autocomplete: true
};

const parseErrorLines = (output: string, lang: string): Array<{ line: number; column?: number; message: string }> => {
  if (!output) return [];
  const errors: Array<{ line: number; column?: number; message: string }> = [];
  const lines = output.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let match;

    // Python: File "script.py", line 10, in <module>
    if (lang === 'python') {
      match = line.match(/File ".*", line (\d+)/);
      if (match) {
        const lineNum = parseInt(match[1]);
        // Try to get the next line which usually contains the actual error message in tracebacks
        let message = line;
        if (i + 1 < lines.length) {
          message += '\n' + lines[i + 1];
          if (i + 2 < lines.length) message += '\n' + lines[i + 2];
        }
        errors.push({ line: lineNum, message: message.trim() });
      } else if (line.includes('Error:') || line.includes('Exception:')) {
        // Fallback for direct error lines
        errors.push({ line: 1, message: line }); // Default to line 1 if trace not found
      }
    }
    // Java: Solution.java:10: error: ...
    // C++: solution.cpp:12:5: error: ...
    else if (lang === 'java' || lang === 'cpp') {
      // Improved regex to handle various compiler output formats
      match = line.match(/(?::| )(\d+)[: ](?:(\d+)[: ])?\s*(error|warning|fatal error):(.*)/i);
      if (match) {
        errors.push({
          line: parseInt(match[1]),
          column: match[2] ? parseInt(match[2]) : undefined,
          message: match[4]?.trim() || line
        });
      }
    }
  }
  return errors;
};

const mapStatusStringToId = (status: string): { id: number; description: string } => {
  switch (status.toLowerCase()) {
    case 'accepted': return { id: 3, description: 'Accepted' };
    case 'wrong answer': return { id: 4, description: 'Wrong Answer' };
    case 'time limit exceeded': return { id: 5, description: 'Time Limit Exceeded' };
    case 'compilation error': return { id: 6, description: 'Compilation Error' };
    case 'runtime error': return { id: 7, description: 'Runtime Error' };
    case 'internal error': return { id: 13, description: 'Internal Error' };
    case 'executing': return { id: 2, description: 'Processing' };
    case 'pending': return { id: 1, description: 'In Queue' };
    default: return { id: 3, description: status }; // Fallback to Accepted if unknown but finished? Or keep as is.
  }
};

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
  brainstormProps
}, ref) => {
  const posthog = usePostHog();
  const isLimitExceeded = useFeatureFlag("todays_limit_exceed");
  const [internalLanguage, setInternalLanguage] = useState<Language>('typescript');
  const language = controlledLanguage || internalLanguage;

  const availableLanguages = controls?.languages
    ? (Object.keys(controls.languages) as Language[]).filter(lang => controls.languages[lang])
    : undefined;

  const [code, setCode] = useState<string>(initialCode || DEFAULT_CODE['typescript']);
  const [output, setOutput] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [internalIsFullscreen, setInternalIsFullscreen] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  // Unified test cases state
  const [testCases, setTestCases] = useState<Array<{ id: number; input: any[]; expectedOutput: any; isCustom: boolean; description?: string; isSubmission?: boolean }>>([]);
  const [executedTestCases, setExecutedTestCases] = useState<Array<{ id: number; input: any[]; expectedOutput: any; isCustom: boolean; description?: string; isSubmission?: boolean }>>([]);
  const [activeTab, setActiveTab] = useState<"testcase" | "result" | "submissions">("testcase");

  const [fetchedAlgorithm, setFetchedAlgorithm] = useState<any>(null);
  const [editingTestCaseId, setEditingTestCaseId] = useState<number | null>(null);
  const [pendingTestCaseId, setPendingTestCaseId] = useState<number | null>(null);

  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [lastRunSuccess, setLastRunSuccess] = useState(false);

  const [viewingSubmission, setViewingSubmission] = useState<Submission | null>(null);
  const [activeEditorTab, setActiveEditorTab] = useState<"current" | "submission" | "scratchpad">("current");
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);

  // Settings state
  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS);

  const editorRef = useRef<CodeEditorRef>(null);
  const panelGroupRef = useRef<ImperativePanelGroupHandle>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [minPanelSize, setMinPanelSize] = useState(8);
  const [isOutputExpanded, setIsOutputExpanded] = useState(false);
  const [isOutputModalOpen, setIsOutputModalOpen] = useState(false);
  const [activeTestCaseTab, setActiveTestCaseTab] = useState<string>("");

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

    // Safety cleanup if it never mounts within 3 seconds
    setTimeout(() => clearInterval(timer), 3000);

    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
      clearInterval(timer);
    };
  }, [isMobile]);


  const activeAlgorithm = algorithmData || fetchedAlgorithm;

  // Sync submissions from props if they change
  useEffect(() => {
    if (initialSubmissions.length > 0) {
      setSubmissions(initialSubmissions);
    }
  }, [initialSubmissions]);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('monaco-editor-settings');
    if (savedSettings) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
      } catch (e) {
        console.error("Failed to parse saved settings", e);
      }
    }
  }, []);

  const updateSetting = <K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('monaco-editor-settings', JSON.stringify(newSettings));
    window.dispatchEvent(new Event('monaco-settings-changed'));
  };

  // Deprecated internal fetching - removed to prevent redundant calls
  /*
  const fetchUserData = useCallback(async () => {
     ...
  }, [algorithmId]);
  */

  useEffect(() => {
    if (!algorithmData && algorithmId) {
      const fetchAlgo = async () => {
        try {
          const { data, error } = await supabase
            .from('algorithms')
            .select('*')
            .eq('id', algorithmId)
            .maybeSingle();

          if (error) throw error;

          const transformedData = {
            ...data,
            ...(typeof data.metadata === 'object' && data.metadata !== null ? data.metadata : {}),
            metadata: data.metadata
          };

          setFetchedAlgorithm(transformedData);
        } catch (error) {
          console.error('Error fetching algorithm for runner:', error);
        }
      };
      fetchAlgo();
    }
  }, [algorithmId, algorithmData]);

  // Use either internal state or prop
  const isFullscreen = isMaximized || internalIsFullscreen;

  // Load algorithm code and schema
  useEffect(() => {
    if (activeAlgorithm) {
      // 1. Initialize Test Cases (Always)
      if (activeAlgorithm.test_cases) {
        const initialTestCases = activeAlgorithm.test_cases.map((tc: any, idx: number) => ({
          id: idx,
          input: tc.input,
          expectedOutput: tc.expectedOutput || tc.output,
          isCustom: false,
          description: tc.description,
          isSubmission: tc.isSubmission
        }));
        setTestCases(initialTestCases);
      }

      // 2. Initialize Input Values (Always, based on first test case or defaults)
      if (activeAlgorithm.input_schema) {
        const initialValues: Record<string, string> = {};
        activeAlgorithm.input_schema.forEach((field: any, index: number) => {
          const defaultVal = activeAlgorithm.test_cases?.[0]?.input[index];
          initialValues[field.name] = defaultVal !== undefined ? JSON.stringify(defaultVal) : "";
        });
        setInputValues(initialValues);
      }

      // 3. Initialize Code
      // Priority 1: User-saved code (initialCode) - only if it has content
      if (typeof initialCode === 'string' && initialCode.trim().length > 0) {
        if (initialCode !== code) {
          setCode(initialCode);
        }
        return;
      }

      // FALLBACK: Generate starter code if no user code exists
      const algo = activeAlgorithm;

      const impl = algo.implementations.find((i: any) => i.lang.toLowerCase() === language.toLowerCase());
      let algoCode = impl?.code.find((c: any) => c.codeType === 'starter')?.code || impl?.code.find((c: any) => c.codeType === 'optimize')?.code;

      if (!algoCode && algo.input_schema) {
        const functionName = algorithmId?.replace(/-/g, '_') || 'solution';

        const parsedInputs: Record<string, any> = {};
        algo.input_schema.forEach((field: any) => {
          const value = inputValues[field.name];
          if (value) {
            try {
              parsedInputs[field.name] = JSON.parse(value);
            } catch {
              parsedInputs[field.name] = value;
            }
          }
        });

        algoCode = generateStub(
          language,
          functionName,
          algo.input_schema as any,
          Object.keys(parsedInputs).length > 0 ? parsedInputs : undefined
        );
      }

      if (algoCode) {
        setCode(algoCode);
      } else {
        setCode(DEFAULT_CODE[language]);
      }

    } else {
      if (typeof initialCode === 'string' && initialCode.trim().length > 0) {
        setCode(initialCode);
      } else {
        setCode(DEFAULT_CODE[language]);
      }
    }
  }, [activeAlgorithm, language, algorithmId, initialCode]);

  const handleLanguageChange = (newLang: Language) => {
    if (onLanguageChange) {
      onLanguageChange(newLang);
    } else {
      setInternalLanguage(newLang);
    }
    setOutput(null);
    setLastRunSuccess(false);
  };

  const handleReset = () => {
    if (activeAlgorithm) {
      const algo = activeAlgorithm;
      const impl = algo.implementations.find((i: any) => i.lang.toLowerCase() === language.toLowerCase());
      const algoCode = impl?.code.find((c: any) => c.codeType === 'starter')?.code || impl?.code.find((c: any) => c.codeType === 'optimize')?.code;
      setCode(algoCode || DEFAULT_CODE[language]);
    } else {
      setCode(DEFAULT_CODE[language]);
    }
    setOutput(null);
    setLastRunSuccess(false);
    toast.success("Code reset to default");
  };

  const handleToggleOutputExpand = () => {
    const newExpanded = !isOutputExpanded;
    setIsOutputExpanded(newExpanded);

    // On desktop, adjust the panel layout if needed
    if (!isMobile && panelGroupRef.current) {
      if (newExpanded) {
        panelGroupRef.current.setLayout([60, 40]);
      } else {
        panelGroupRef.current.setLayout([100 - minPanelSize, minPanelSize]);
      }
    }
  };



  const toggleFullscreen = useCallback(() => {
    if (onToggleFullscreen) {
      onToggleFullscreen();
    } else {
      setInternalIsFullscreen(prev => !prev);
    }
  }, [onToggleFullscreen]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        if (onToggleFullscreen) {
          // do nothing
        } else {
          setInternalIsFullscreen(false);
        }
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullscreen, onToggleFullscreen]);

  // Force layout update when fullscreen changes to prevent blank editor
  useEffect(() => {
    // Small timeout to allow transition/DOM update to complete
    const timer = setTimeout(() => {
      editorRef.current?.layout();
    }, 100);
    return () => clearTimeout(timer);
  }, [isFullscreen]);



  const algorithmMeta = activeAlgorithm;

  // Expose Run and Submit methods
  React.useImperativeHandle(ref, () => ({
    run: () => handleRun(),
    submit: () => handleSubmit(),
    openThinkpad: () => {
      setIsScratchpadOpen(true);
      setActiveEditorTab("scratchpad");
    }
  }));

  const waitForSubmissionResult = (submissionId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        supabase?.removeChannel(channel);
        reject(new Error("Execution timeout. Please try again or check submissions history."));
      }, 30000); // 30 seconds timeout

      const channel = supabase!
        .channel(`submission-${submissionId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'submissions',
            filter: `id=eq.${submissionId}`,
          },
          (payload) => {
            console.log('Submission Updated Realtime:', payload.new);
            const { status } = payload.new;
            if (status && status !== 'pending' && status !== 'executing') {
              clearTimeout(timeout);
              supabase?.removeChannel(channel);

              // Map record to match the expected format in CodeRunner
              const result = {
                ...payload.new,
                status: mapStatusStringToId(payload.new.status)
              };
              resolve(result);
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log(`Subscribed to submission-${submissionId}`);
          }
        });
    });
  };

  // Report state changes to parent
  useEffect(() => {
    onStateChange?.({
      isLoading,
      isSubmitting,
      lastRunSuccess
    });
  }, [isLoading, isSubmitting, lastRunSuccess, onStateChange]);

  const handleAddTestCase = () => {
    const defaultInput = activeAlgorithm?.input_schema?.map((field: any) => {
      switch (field.type) {
        case 'integer': return 0;
        case 'float': return 0.0;
        case 'string': return "";
        case 'boolean': return false;
        case 'array': return [];
        case 'integer[]': return [];
        case 'string[]': return [];
        case 'ListNode[]': return [];
        case 'TreeNode[]': return [];
        case 'object': return {};
        default: return null;
      }
    }) || [];

    const newTestCase = {
      id: Date.now(),
      input: defaultInput,
      expectedOutput: null,
      isCustom: true
    };
    setTestCases([...testCases, newTestCase]);
    setEditingTestCaseId(newTestCase.id);
    setPendingTestCaseId(newTestCase.id);
    setActiveTab("testcase");
  };

  const handleUpdateTestCase = (id: number, updatedCase: any) => {
    setTestCases(testCases.map(tc =>
      tc.id === id ? { ...tc, input: updatedCase.input, expectedOutput: updatedCase.expectedOutput } : tc
    ));
    setEditingTestCaseId(null);
    toast.success("Test case updated");
  };

  const handleDeleteTestCase = (id: number) => {
    setTestCases(testCases.filter(tc => tc.id !== id));
    toast.success("Test case deleted");
  };

  const handleCancelEdit = () => {
    if (editingTestCaseId === pendingTestCaseId) {
      setTestCases(testCases.filter(tc => tc.id !== pendingTestCaseId));
      setPendingTestCaseId(null);
      toast.info("New test case discarded");
    }
    setEditingTestCaseId(null);
  };

  const handleFormatCode = () => {
    editorRef.current?.formatCode();
    toast.success("Code formatted");
  };

  const executeCode = async (isSubmission: boolean = false) => {
    if (isLimitExceeded) {
      toast.error("Daily execution limit exceeded! Please try again in sometime.");
      return { result: { stderr: "Limit exceeded" }, allPassed: false, execTime: 0 };
    }

    if (isSubmission) setIsSubmitting(true);
    else setIsLoading(true);

    setOutput(null);
    setExecutionTime(null);

    // Clear previous error markers
    editorRef.current?.setErrors([]);

    // If running (not submitting), filter out submission-only cases
    // If submitting, run ALL cases
    const casesToRun = isSubmission
      ? testCases
      : testCases.filter(tc => !tc.isSubmission);

    setExecutedTestCases(casesToRun);

    if (casesToRun.length === 0 && !isSubmission) {
      // If there are no public cases, warn but allow running if custom cases exist?
      // Just proceed to let user see output of empty run or something
    }

    try {
      const startTime = performance.now();

      const algo = activeAlgorithm;
      let fullCode = code;

      const preparedTestCases = casesToRun.map((tc: any) => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput ?? tc.output,
        description: tc.isCustom ? 'Custom Case' : `Case ${tc.id + 1}`
      }));

      if (algo && preparedTestCases.length > 0) {
        // Ensure metadata is an object (it might be a string from DB)
        const metadata = typeof algo.metadata === 'string'
          ? JSON.parse(algo.metadata)
          : (algo.metadata || {});

        // CLASS MODE: Multi-function execution (e.g., LRU Cache)
        if (metadata.class_mode) {
          const { generateClassTestRunner } = await import('@/utils/testRunnerGenerator');
          fullCode = generateClassTestRunner(code, language, preparedTestCases);
        } else {
          // STANDARD MODE: Single function execution
          const { generateTestRunner } = await import('@/utils/testRunnerGenerator');

          // Use specified function name or derive from ID
          const entryFunctionName = algo.function_name || algo.metadata?.function_name;

          // Check if any input field has inplace flag set
          const inputSchema = algo.input_schema || [];
          const inplaceFieldIndex = inputSchema.findIndex((field: any) => field.inplace === true || String(field.inplace) === 'true');
          const hasInplaceField = inplaceFieldIndex !== -1;

          console.log("DEBUG: Inplace detection", {
            hasInplaceField,
            inplaceFieldIndex,
            metadataInplace: metadata.inplace,
            metadataReturnModified: metadata.return_modified_input,
            algoReturnModified: algo.return_modified_input
          });

          fullCode = generateTestRunner(
            code,
            language,
            preparedTestCases,
            inputSchema,
            entryFunctionName,
            {
              unordered: metadata.unordered || algo.unordered,
              multiExpected: metadata.multi_expected || algo.multi_expected,
              returnModifiedInput: hasInplaceField || metadata.return_modified_input === true || String(metadata.return_modified_input) === 'true' || metadata.inplace === true || String(metadata.inplace) === 'true' || algo.return_modified_input === true || String(algo.return_modified_input) === 'true',
              modifiedInputIndex: hasInplaceField ? inplaceFieldIndex : (metadata.modified_input_index !== undefined ? Number(metadata.modified_input_index) : (algo.modified_input_index !== undefined ? Number(algo.modified_input_index) : 0))
            }
          );
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      const apiUrl = env.apiUrl;
      const response = await axios.post(`${apiUrl}/api/execute`, {
        language_id: LANGUAGE_IDS[language],
        source_code: fullCode,
        stdin: "",
        problem_id: algorithmId, // Added problem_id if available
        compiler_options: language === 'typescript' ? "--target ES2020 --downlevelIteration" : undefined
      }, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      const { submission_id } = response.data;
      if (!submission_id) {
        throw new Error("No submission_id received from server");
      }

      // Wait for real-time update
      const result = await waitForSubmissionResult(submission_id);

      const endTime = performance.now();
      const execTime = Math.round(endTime - startTime);
      setExecutionTime(execTime);

      // Parse test results immediately if present in stdout
      if (result.stdout && !result.stderr && !result.compile_output) {
        try {
          const startMarker = '___TEST_RESULTS_START___';
          const endMarker = '___TEST_RESULTS_END___';

          const startIdx = result.stdout.indexOf(startMarker);
          const endIdx = result.stdout.indexOf(endMarker);

          let parsedResults = [];

          if (startIdx !== -1 && endIdx !== -1) {
            const jsonStr = result.stdout.substring(
              startIdx + startMarker.length,
              endIdx
            ).trim();
            parsedResults = JSON.parse(jsonStr);
          } else {
            const lines = result.stdout.split('\n');
            let jsonStr = '';
            let inJson = false;
            let bracketCount = 0;
            for (const line of lines) {
              const trimmed = line.trim();
              if (!inJson && trimmed.startsWith('[')) { inJson = true; bracketCount = 0; }
              if (inJson) {
                jsonStr += line;
                for (const char of line) {
                  if (char === '[') bracketCount++;
                  if (char === ']') bracketCount--;
                }
                if (bracketCount === 0) break;
              }
            }
            if (jsonStr) parsedResults = JSON.parse(jsonStr);
          }

          if (Array.isArray(parsedResults) && parsedResults.length > 0 &&
            Object.keys(parsedResults[parsedResults.length - 1]).length === 0) {
            parsedResults.pop();
          }
          result.testResults = parsedResults;
        } catch (e) {
          console.warn("Failed to parse test results JSON", e);
        }
      }

      setOutput(result);

      // Parse and show errors in editor
      if (result.stderr || result.compile_output) {
        const errorText = result.compile_output || result.stderr || "";
        const parsedErrors = parseErrorLines(errorText, language);
        if (parsedErrors.length > 0) {
          editorRef.current?.setErrors(parsedErrors);
        }
      }

      // Don't switch tab if submitting
      if (!isSubmission) {
        setActiveTab("result");
      }

      const testResults = result.testResults;
      const allPassed = testResults && Array.isArray(testResults) && testResults.length > 0 &&
        testResults.every((r: any) => r.status === 'pass');

      const hasFailed = testResults && Array.isArray(testResults) &&
        testResults.some((r: any) => r.status !== 'pass');

      // Update run success status (only for manual runs)
      if (!isSubmission) {
        setLastRunSuccess(!!(result.status?.id === 3 && allPassed));
      }

      if (result.status?.id === 3 && allPassed) {
        if (!isSubmission) toast.success("All test cases passed!");
      } else if (result.status?.id === 3 && hasFailed) {
        if (!isSubmission) toast.warning("Code ran, but some test cases failed.");
      } else if (result.status?.id !== 3) {
        toast.error("Execution failed");
      } else {
        if (!isSubmission) toast.success("Code executed successfully!");
      }



      setOutput(result);

      // PostHog Tracking for Run Code (Not Submission)
      if (!isSubmission) {
        posthog?.capture('run_code', {
          problemId: algorithmId,
          language: language,
          status: result.status?.id === 3 ? (allPassed ? 'pass' : 'fail') : 'error',
          executionTimeMs: execTime
        });
      }

      return { result, allPassed, execTime };

    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.error || err.message || "An unexpected error occurred";
      setOutput({ stderr: errorMessage });
      toast.error("Failed to execute code");
      return { result: { stderr: errorMessage }, allPassed: false, execTime: 0 };
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleRun = () => {
    if (isMobile) {
      setIsOutputExpanded(true);
    } else {
      panelGroupRef.current?.setLayout([60, 40]);
      setIsOutputExpanded(true);
    }
    executeCode(false);
  };

  const handleSubmit = async () => {
    if (!algorithmId) return;

    // Auto-resize panel on desktop
    if (!isMobile) {
      panelGroupRef.current?.setLayout([60, 40]);
      setIsOutputExpanded(true);
    }

    const { result, allPassed, execTime } = await executeCode(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to submit.");
      return;
    }

    const now = new Date().toISOString();
    const submissionId = crypto.randomUUID();

    // Pass/Fail counts
    const testResults = result?.testResults || [];
    const passedCount = testResults.filter((r: any) => r.status === 'pass').length;
    const failedCount = testResults.filter((r: any) => r.status !== 'pass').length;

    const newSubmission: Submission = {
      id: submissionId,
      timestamp: now,
      language: language,
      code: code,
      status: allPassed ? 'passed' : (result?.stderr || result?.compile_output ? 'error' : 'failed'),
      test_results: {
        passed: passedCount,
        failed: failedCount,
        total: testResults.length,
        execution_time_ms: execTime,
        errors: result?.stderr ? [result.stderr] : undefined
      }
    };

    // Save submission
    await addSubmission(user.id, algorithmId, newSubmission);

    // Update local state
    setSubmissions(prev => [...prev, newSubmission]);
    setActiveTab("submissions");

    if (allPassed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast.success("Solution Submitted Successfully!");
      onSuccess?.();

      // Update progress
      await updateProgress(user.id, algorithmId, {
        completed: true,
        completed_at: now
      });
    } else {
      toast.error("Submission Failed. Check the results.");
    }

    // PostHog Tracking for Submit Code
    posthog?.capture('submit_code', {
      problemId: algorithmId,
      language: language,
      status: allPassed ? 'pass' : (result?.status?.id === 3 ? 'fail' : 'error'),
      executionTimeMs: execTime
    });
  };

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

  const handleCopySubmission = () => {
    if (viewingSubmission?.code) {
      navigator.clipboard.writeText(viewingSubmission.code);
      toast.success("Submission code copied to clipboard");
    }
  };

  // Keyboard Shortcuts for Run (Ctrl + ') and Submit (Ctrl + Enter)
  useEffect(() => {
    const handleShortcuts = (e: KeyboardEvent) => {
      // Check for Ctrl or Meta (Cmd) key
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "'") {
          e.preventDefault();
          if (!isLoading && !isSubmitting && controls?.run_code !== false) {
            handleRun();
          }
        }
        if (e.key === "Enter") {
          // Only trigger submit if not loading, not submitting, and if last run was successful
          if (!isLoading && !isSubmitting && lastRunSuccess && controls?.submit !== false) {
            e.preventDefault();
            handleSubmit();
          } else if (!lastRunSuccess && controls?.submit !== false) {
            // If trying to submit but last run wasn't success, maybe show toast?
            // Optional: toast.warning("Please run code successfully before submitting.");
          }
        }
      }
    };

    window.addEventListener('keydown', handleShortcuts);
    return () => window.removeEventListener('keydown', handleShortcuts);
  }, [isLoading, isSubmitting, lastRunSuccess, controls, handleRun, handleSubmit]);

  /* Refactored Layout Components to support Mobile/Desktop switch */
  const editorTabs = (
    <Tabs
      value={activeEditorTab}
      onValueChange={(v) => setActiveEditorTab(v as any)}
      className="h-full flex flex-col"
    >
      {/* Top Toolbar Integrated with Tabs */}
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
                onLanguageChange={handleLanguageChange}
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
                    onClick={handleCloseSubmission}
                  >
                    <X className="w-3 h-3" />
                  </div>
                </TabsTrigger>
              )}
            </TabsList>
          )}
        </div>

        {/* Right Group: Actions (Reset, Format, Settings) */}
        <div className="flex items-center gap-1 shrink-0 pr-1">
          {activeEditorTab === 'current' && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleReset}
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
                      onClick={handleFormatCode}
                    >
                      <AlignLeft className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Format code</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}

          <Popover>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <PopoverContent className="w-80" align="end">
              {/* Settings content remains the same */}
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Editor Settings</h4>
                  <p className="text-sm text-muted-foreground">
                    Customize your coding experience.
                  </p>
                </div>
                <div className="grid gap-4">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={settings.theme === 'system' ? 'light' : settings.theme}
                      onValueChange={(val: any) => updateSetting('theme', val)}
                    >
                      <SelectTrigger className="w-full col-span-2 h-8">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="fontSize">Font Size</Label>
                    <div className="col-span-2 flex items-center gap-2">
                      <Slider
                        id="fontSize"
                        value={[settings.fontSize]}
                        min={10}
                        max={24}
                        step={1}
                        onValueChange={([val]) => updateSetting('fontSize', val)}
                        className="w-full"
                      />
                      <span className="w-8 text-xs text-right">{settings.fontSize}px</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="tabSize">Tab Size</Label>
                    <Select
                      value={settings.tabSize.toString()}
                      onValueChange={(val) => updateSetting('tabSize', parseInt(val))}
                    >
                      <SelectTrigger className="w-full col-span-2 h-8">
                        <SelectValue placeholder="Tab Size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 spaces</SelectItem>
                        <SelectItem value="4">4 spaces</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="wordWrap">Word Wrap</Label>
                    <Switch
                      id="wordWrap"
                      checked={settings.wordWrap === 'on'}
                      onCheckedChange={(checked) => updateSetting('wordWrap', checked ? 'on' : 'off')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="minimap">Minimap</Label>
                    <Switch
                      id="minimap"
                      checked={settings.minimap}
                      onCheckedChange={(checked) => updateSetting('minimap', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="lineNumbers">Line Numbers</Label>
                    <Switch
                      id="lineNumbers"
                      checked={settings.lineNumbers === 'on'}
                      onCheckedChange={(checked) => updateSetting('lineNumbers', checked ? 'on' : 'off')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="autocomplete">Autocomplete</Label>
                    <Switch
                      id="autocomplete"
                      checked={settings.autocomplete}
                      onCheckedChange={(checked) => updateSetting('autocomplete', checked)}
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={toggleFullscreen}
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

      <TabsContent value="current" className="flex-1 flex flex-col min-h-0 m-0 data-[state=inactive]:hidden h-full">
        <div className={`h-full flex flex-col ${viewingSubmission ? '' : 'border-t-0'}`}>
          <div className="flex-1 relative min-h-[300px]">
            {isLoadingProp ? (
              <CodeEditorSkeleton />
            ) : (
              <LazyCodeEditor
                ref={editorRef}
                code={code}
                isMobile={isMobile}
                language={language}
                path={`/runner/${algorithmId || 'playground'}/${language}/code.${language === 'python' ? 'py' : language === 'java' ? 'java' : language === 'cpp' ? 'cpp' : 'ts'}`}
                onChange={(value) => {
                  const newCode = value || '';
                  setCode(newCode);
                  onCodeChange?.(newCode);
                  setLastRunSuccess(false); // Reset success on code change
                }}
                theme={settings.theme}
                options={{
                  ...settings,
                  readOnly: false // Explicitly writable
                }}
              />
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="submission" className="flex-1 flex flex-col min-h-0 m-0 data-[state=inactive]:hidden h-full">
        <div className="h-full flex flex-col bg-background">
          {/* Read Only Toolbar */}
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
    </Tabs>
  );

  const outputPanelContent = (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Output Panel - Contains persistent tabs and expanded content */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <OutputPanel
          onToggleExpand={handleToggleOutputExpand}
          isExpanded={isOutputExpanded}
          onMaximize={() => setIsOutputModalOpen(!isOutputModalOpen)}
          isMaximized={isOutputModalOpen}
          output={output}
          loading={isLoading}
          submitting={isSubmitting as boolean}
          stdin=""
          onStdinChange={() => { }}
          testCases={testCases.map(tc => ({
            input: tc.input,
            output: tc.expectedOutput
          }))}
          executionTime={executionTime}
          algorithmMeta={algorithmMeta as any}

          // New Props for LeetCode Style UI
          activeTab={activeTab}
          onTabChange={setActiveTab}

          // Unified Test Case Management
          allTestCases={testCases}
          executedTestCases={executedTestCases}
          onAddTestCase={handleAddTestCase}
          onUpdateTestCase={handleUpdateTestCase}
          onDeleteTestCase={handleDeleteTestCase}

          submissions={submissions}
          onSelectSubmission={handleSelectSubmission}

          // Editing State
          editingTestCaseId={editingTestCaseId}
          onEditTestCase={setEditingTestCaseId}
          onCancelEdit={() => {
            setEditingTestCaseId(null);
            setPendingTestCaseId(null);
          }}

          inputSchema={algorithmData?.input_schema}
          controls={controls}

          // Submissions
          activeTestCaseTab={activeTestCaseTab}
          onTestCaseTabChange={setActiveTestCaseTab}
        />
      </div>

      {/* Runner Footer - Always visible fixed at bottom */}
      <RunnerFooter
        isExpanded={isOutputExpanded}
        onToggleExpand={handleToggleOutputExpand}
        onRun={handleRun}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        lastRunSuccess={lastRunSuccess}
        algorithm={activeAlgorithm}
      />
    </div>
  );

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + ' for Run
      if ((e.ctrlKey || e.metaKey) && e.key === "'") {
        e.preventDefault();
        e.stopPropagation();
        handleRun();
      }
      
      // Ctrl/Cmd + Enter for Submit
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        
        const canSubmit = controls?.allow_submission !== false;
        if (!isLoading && !isSubmitting && canSubmit) {
          handleSubmit();
        }
      }
    };

    // Use capture phase to intercept before Monaco Editor swallows the keystroke
    window.addEventListener('keydown', handleGlobalKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleGlobalKeyDown, { capture: true });
  }, [handleRun, handleSubmit, isLoading, isSubmitting, controls?.allow_submission]);

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
          {/* Mobile Output: Shared space for console tabs and content */}
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

      {/* Fullscreen Output Modal */}
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

export default CodeRunner;

