import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useFeatureFlag } from "@/contexts/FeatureFlagContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, RotateCcw, Loader2, Maximize2, Minimize2, Settings, AlignLeft, Info, Send, Copy, X, Clock } from "lucide-react";
import { FeatureGuard } from "@/components/FeatureGuard";
import { toast } from "sonner";
import axios from 'axios';
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
import { CodeEditor, CodeEditorRef } from './CodeEditor';
import { OutputPanel } from './OutputPanel';
import { DEFAULT_CODE, LANGUAGE_IDS } from './constants';
import { supabase } from '@/integrations/supabase/client';
import { generateStub } from '@/utils/stubGenerator';
import { addSubmission, updateProgress, getUserAlgorithmData } from '@/utils/userAlgorithmDataHelpers';
import { Submission } from '@/types/userAlgorithmData';

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
}

interface EditorSettings {
  fontSize: number;
  theme: 'dark' | 'light' | 'system';
  tabSize: number;
  wordWrap: 'on' | 'off';
  minimap: boolean;
  lineNumbers: 'on' | 'off' | 'relative' | 'interval';
}

const DEFAULT_SETTINGS: EditorSettings = {
  fontSize: 14,
  theme: 'system',
  tabSize: 2,
  wordWrap: 'off',
  minimap: false,
  lineNumbers: 'on'
};

export const CodeRunner: React.FC<CodeRunnerProps> = ({ 
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
  submissions: initialSubmissions = []
}) => {
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
  const [activeEditorTab, setActiveEditorTab] = useState<"current" | "submission">("current");

  // Settings state
  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS);
  const editorRef = useRef<CodeEditorRef>(null);

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
            .single();
          
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
      // If we have valid initialCode (user saved code), prioritize it!
      if (initialCode && initialCode.trim().length > 0) {
        setCode(initialCode);
        onCodeChange?.(initialCode); // Ensure parent is synced if needed, though usually parent passed it
        
        // We still need to populate default input values for test cases
        if (activeAlgorithm.input_schema) {
            const initialValues: Record<string, string> = {};
            activeAlgorithm.input_schema.forEach((field: any, index: number) => {
               const defaultVal = activeAlgorithm.test_cases?.[0]?.input[index];
               initialValues[field.name] = defaultVal !== undefined ? JSON.stringify(defaultVal) : "";
            });
            setInputValues(initialValues);
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
        onCodeChange?.(algoCode);
      } else {
        setCode(DEFAULT_CODE[language]);
        onCodeChange?.(DEFAULT_CODE[language]);
      }

      // Setting input values
      if (algo.input_schema) {
        const initialValues: Record<string, string> = {};
        algo.input_schema.forEach((field: any, index: number) => {
           const defaultVal = algo.test_cases?.[0]?.input[index];
           initialValues[field.name] = defaultVal !== undefined ? JSON.stringify(defaultVal) : "";
        });
        setInputValues(initialValues);
      }


      if (algo.test_cases) {
        const initialTestCases = algo.test_cases.map((tc: any, idx: number) => ({
          id: idx,
          input: tc.input,
          expectedOutput: tc.expectedOutput || tc.output,
          isCustom: false,
          description: tc.description,
          isSubmission: tc.isSubmission
        }));
        setTestCases(initialTestCases);
      }
    } else {
      if (!initialCode) {
        setCode(DEFAULT_CODE[language]);
        onCodeChange?.(DEFAULT_CODE[language]);
      }
    }
  }, [activeAlgorithm, language, algorithmId]); 
  
  useEffect(() => {
    if (initialCode && initialCode !== code) {
        setCode(initialCode);
    }
  }, [initialCode]); 

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



  const algorithmMeta = activeAlgorithm;

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
      toast.error("Daily execution limit exceeded! Please try again tomorrow.");
      return;
    }

    if (isSubmission) setIsSubmitting(true);
    else setIsLoading(true);

    setOutput(null);
    setExecutionTime(null);

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

      const preparedTestCases = casesToRun.map(tc => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        description: tc.isCustom ? 'Custom Case' : `Case ${tc.id + 1}`
      }));

      if (algo && preparedTestCases.length > 0) {
        const { generateTestRunner } = await import('@/utils/testRunnerGenerator');
        fullCode = generateTestRunner(
          code,
          language,
          preparedTestCases,
          algo.input_schema || []
        );
      }

      const response = await axios.post('/api/execute', {
        language_id: LANGUAGE_IDS[language],
        source_code: fullCode,
        stdin: "" 
      });

      const endTime = performance.now();
      const execTime = Math.round(endTime - startTime);
      setExecutionTime(execTime);

      const result = response.data;

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
      if(!isSubmission) {
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
    executeCode(false);
  };

  const handleSubmit = async () => {
    if (!algorithmId) return;

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
  };

  const handleSelectSubmission = (submission: Submission) => {
    setViewingSubmission(submission);
    setActiveEditorTab("submission");
  };

  const handleCloseSubmission = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setViewingSubmission(null);
    setActiveEditorTab("current");
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

  return (
    <div className={`w-full border rounded-lg overflow-hidden bg-background shadow-sm flex flex-col transition-all duration-300 ${
      isFullscreen 
        ? 'fixed inset-0 z-50 h-screen' 
        : className || 'h-[calc(100vh-100px)] min-h-[600px]'
    }`}>
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={50} minSize={30}>
           <Tabs 
             value={activeEditorTab} 
             onValueChange={(v) => setActiveEditorTab(v as any)} 
             className="h-full flex flex-col"
           >
             {/* Only show tab list if we have a submission to view */}
             {viewingSubmission && (
               <div className="flex items-center px-1 bg-muted/20 border-b">
                 <TabsList className="bg-transparent h-9 p-0 gap-1 w-full justify-start">
                   <TabsTrigger 
                     value="current"
                     className="data-[state=active]:bg-background data-[state=active]:shadow-none rounded-t-md rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary h-9 px-4 rounded-none"
                   >
                     Current Code
                   </TabsTrigger>
                   <TabsTrigger 
                     value="submission"
                     className="data-[state=active]:bg-background data-[state=active]:shadow-none rounded-t-md rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary h-9 px-4 gap-3 rounded-none group items-center"
                   >
                     <div className="flex items-center gap-2 text-xs">
                        <span className={`font-semibold ${viewingSubmission?.status === 'passed' ? 'text-green-600' : 'text-destructive'}`}>
                          {viewingSubmission?.status === 'passed' ? 'Accepted' : (viewingSubmission?.status === 'error' ? 'Runtime Error' : 'Wrong Answer')}
                        </span>
                        <span className="text-muted-foreground">|</span>
                        <span className="uppercase font-medium text-foreground">{viewingSubmission?.language}</span>
                         {/* Time & Memory if available */}
                        {viewingSubmission?.test_results?.execution_time_ms && (
                           <>
                             <span className="text-muted-foreground">|</span>
                             <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {viewingSubmission.test_results.execution_time_ms}ms
                             </div>
                           </>
                        )}
                        {/* Memory usage typically not stored but if it were: */}
                        {/* <div className="flex items-center gap-1 text-muted-foreground">| 12MB</div> */}
                     </div>
                     
                     <div 
                        role="button"
                        className="opacity-60 group-hover:opacity-100 hover:bg-muted rounded-full p-0.5 ml-2"
                        onClick={handleCloseSubmission}
                     >
                        <X className="w-3 h-3" />
                     </div>
                   </TabsTrigger>
                 </TabsList>
               </div>
             )}

           <TabsContent value="current" className="flex-1 flex flex-col min-h-0 m-0 data-[state=inactive]:hidden h-full">
            <div className={`h-full flex flex-col ${viewingSubmission ? '' : 'border-t-0'}`}>
            <div className="flex items-center justify-between p-2 border-b bg-muted/30 overflow-x-auto no-scrollbar min-h-[50px]">
              <div className="flex items-center gap-2">
                <LanguageSelector
                  language={language}
                  onLanguageChange={handleLanguageChange}
                  disabled={isLoading || isSubmitting}
                  availableLanguages={availableLanguages}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleReset}
                  disabled={isLoading || isSubmitting}
                  title="Reset to default code"
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>

             
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleFormatCode}
                  title="Format Code"
                >
                  <AlignLeft className="w-4 h-4" />
                </Button>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Editor Settings"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
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
                              <SelectItem value="2">2 Spaces</SelectItem>
                              <SelectItem value="4">4 Spaces</SelectItem>
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
                          <Select 
                            value={settings.lineNumbers} 
                            onValueChange={(val: any) => updateSetting('lineNumbers', val)}
                          >
                            <SelectTrigger className="w-[120px] h-8">
                              <SelectValue placeholder="Line Numbers" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="on">On</SelectItem>
                              <SelectItem value="off">Off</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={toggleFullscreen}
                  title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-3 h-3" />
                  ) : (
                    <Maximize2 className="w-3 h-3" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex-1 relative min-h-0">
              <CodeEditor
                ref={editorRef}
                code={code}
                language={language}
                path={`/runner/${algorithmId || 'playground'}/${language}/code.${language === 'python' ? 'py' : language === 'java' ? 'java' : language === 'cpp' ? 'cpp' : 'ts'}`}
                onChange={(value) => {
                  const newCode = value || '';
                  setCode(newCode);
                  onCodeChange?.(newCode);
                  setLastRunSuccess(false); // Reset success on code change
                }}
                options={{
                  ...settings,
                  readOnly: false // Explicitly writable
                }}
              />
              <div className="absolute bottom-5 right-5 z-10">
                <div className="flex items-center gap-0.5 p-0.5 bg-background/60 backdrop-blur-xl border shadow-lg rounded-full">
                <TooltipProvider>
                  <FeatureGuard flag="code_runner">
                  {controls?.run_code !== false && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          onClick={handleRun} 
                          disabled={isLoading || isSubmitting}
                          size="sm"
                          variant="ghost"
                          className="h-8 px-3 text-xs rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all border-0"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                              Running
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 mr-1 text-primary fill-primary/20" />
                              Run
                            </>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">Run Code <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"><span className="text-xs">Ctrl</span> + '</kbd></TooltipContent>
                    </Tooltip>
                  )}
                  </FeatureGuard>

                  {controls?.run_code !== false && controls?.submit !== false && (
                    <div className="w-px h-4 bg-border/50 mx-0" />
                  )}

                  <FeatureGuard flag="submit_button">
                  {controls?.submit !== false && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="cursor-default">
                          <Button 
                            onClick={handleSubmit} 
                            disabled={isLoading || isSubmitting || !lastRunSuccess}
                            size="sm"
                            variant="ghost"
                            className={`h-8 px-3 text-xs rounded-full transition-all border-0 ${
                              lastRunSuccess 
                                ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20 hover:text-green-700' 
                                : 'hover:bg-muted'
                            } ${(!lastRunSuccess && !isLoading && !isSubmitting) ? 'pointer-events-none opacity-50' : ''}`}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                                Submitting
                              </>
                            ) : (
                              <>
                                <Send className="w-3 h-3 mr-1" />
                                Submit
                              </>
                            )}
                          </Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        {!lastRunSuccess && !isLoading && !isSubmitting ? (
                           <span className="text-orange-500 font-medium">Run all test cases successfully to enable submission</span>
                        ) : (
                           <>Submit Solution <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"><span className="text-xs">Ctrl</span> + Enter</kbd></>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  )}
                  </FeatureGuard>
                </TooltipProvider>
                </div>
              </div>
            </div>
            </div>
           </TabsContent>
          
          <TabsContent value="submission" className="flex-1 flex flex-col min-h-0 m-0 data-[state=inactive]:hidden h-full">
            <div className="h-full flex flex-col bg-background">
               {/* Read Only Toolbar */}
               <div className="flex items-center justify-between p-2 border-b bg-muted/30 min-h-[50px]">
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
                  <CodeEditor
                    code={viewingSubmission?.code || ''}
                    language={viewingSubmission?.language as Language || 'typescript'}
                    path={`/runner/submission/${viewingSubmission?.id}`}
                    onChange={() => {}} // Read only
                    options={{
                       ...settings,
                        readOnly: true,
                        domReadOnly: true
                    }}
                  />
               </div>
            </div>
          </TabsContent>
         </Tabs>
        </ResizablePanel>
        
        <ResizableHandle withHandle className="bg-muted/50 hover:bg-primary/20 data-[resize-handle-active]:bg-primary/40 transition-colors" />
                <ResizablePanel defaultSize={10} minSize={5}>
          <div className="h-full flex flex-col">
             <div className="flex-1 min-h-0 overflow-hidden">
                 <OutputPanel 
                  output={output} 
                  loading={isLoading} 
                  stdin="" 
                  onStdinChange={() => {}} 
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
                />
             </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
