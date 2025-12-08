import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, RotateCcw, Loader2, Maximize2, Minimize2, Settings, AlignLeft, Info } from "lucide-react";
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

import { LanguageSelector, Language } from './LanguageSelector';
import { CodeEditor, CodeEditorRef } from './CodeEditor';
import { OutputPanel } from './OutputPanel';
import { DEFAULT_CODE, LANGUAGE_IDS } from './constants';
import { supabase } from '@/integrations/supabase/client';
import { generateStub } from '@/utils/stubGenerator';



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
  onSuccess
}) => {
  const [internalLanguage, setInternalLanguage] = useState<Language>('typescript');
  const language = controlledLanguage || internalLanguage;
  
  const [code, setCode] = useState<string>(initialCode || DEFAULT_CODE['typescript']);
  const [output, setOutput] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [internalIsFullscreen, setInternalIsFullscreen] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  // Unified test cases state
  const [testCases, setTestCases] = useState<Array<{ id: number; input: any[]; expectedOutput: any; isCustom: boolean; description?: string }>>([]);
  const [activeTab, setActiveTab] = useState<"testcase" | "result">("testcase");
  
  const [fetchedAlgorithm, setFetchedAlgorithm] = useState<any>(null);
  const [editingTestCaseId, setEditingTestCaseId] = useState<number | null>(null);
  const [pendingTestCaseId, setPendingTestCaseId] = useState<number | null>(null);

  // Settings state
  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS);
  const editorRef = useRef<CodeEditorRef>(null);

  const activeAlgorithm = algorithmData || fetchedAlgorithm;

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
  // Load algorithm code and schema
  useEffect(() => {
    if (activeAlgorithm) {
      const algo = activeAlgorithm;
      
      // Determine if language changed (simple way: check if current code matches expected language style? No, unreliable)
      // Better: We know 'language' prop changed because this effect is running.
      // If we are switching languages, we should ALWAYS load the new language code, 
      // unless we are just mounting and have a specific initialCode.
      
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

      // Logic:
      // 1. If initialCode is provided AND it seems to match the TARGET language (heuristics or metadata), we use it.
      // 2. But the 'initialCode' prop might be stale (from previous language) during the first render of a language switch.
      // 3. So relying on 'initialCode' during a language switch is dangerous if the parent hasn't updated it yet.
      // 4. Ideally, we should ignore 'initialCode' if we detect a language switch inside this component, 
      //    UNLESS we are sure 'initialCode' is meant for the NEW language.
      
      // FIX: Since we can't easily know if initialCode is stale without deep comparison, 
      // we will rely on the fact that when switching languages, we usually want the STARTER code 
      // for the new language, OR the cached code for the new language (which the parent should provide).
      
      // If the parent updates `initialCode` in a later render (after localStorage fetch), 
      // we might want to respect that.
      
      // Current approach: Just set the code to the calculated algoCode (starter).
      // If the parent passes a specialized 'initialCode' (e.g. from saved state), 
      // we need to know if that 'initialCode' is actually for THIS language.
      // We can't know for sure.
      
      // The safest fix for the reported bug ("Java code in C++ runner") is:
      // When 'language' changes, ALWAYS reset to the starter code (algoCode) derived from 'activeAlgorithm'.
      // If the parent wants to restore a saved session, it should ensure 'initialCode' is correct 
      // AND maybe we need a separate effect for 'initialCode' updates?
      
      // Actually, let's simplify.
      
      if (algoCode) {
        // We always switch to the correct language starter/stub first. 
        // If the parent has "savedCode", it will eventually trigger a re-render with the correct 'initialCode' 
        // (because AlgorithmDetailNew has a useEffect for that).
        // However, we need to respect that 'initialCode' when it arrives.
        
        // Problem: This effect runs on 'language' change.
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
          description: tc.description
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
  
  // Separate effect to handle external updates to initialCode (e.g. loading from cache/db)
  // This allows the parent to override the "starter code" set by the previous effect 
  // once the async fetch/cache lookup is done.
  useEffect(() => {
    if (initialCode && initialCode !== code) {
        // Only update if it looks different, to avoid cursor jumps or overwrites while typing 
        // (though this effect only runs when initialCode prop changes).
        // We simply trust the parent's initialCode if it changes.
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

  const handleRun = async () => {
    setIsLoading(true);
    setOutput(null);
    setExecutionTime(null);

    try {
      const startTime = performance.now();
      
      const algo = activeAlgorithm;
      let fullCode = code;

      const allTestCases = testCases.map(tc => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        description: tc.isCustom ? 'Custom Case' : `Case ${tc.id + 1}`
      }));

      if (algo && allTestCases.length > 0) {
        const { generateTestRunner } = await import('@/utils/testRunnerGenerator');
        fullCode = generateTestRunner(
          code,
          language,
          allTestCases,
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
      setOutput(result);
      setActiveTab("result");
      
      const testResults = result.testResults;
      const allPassed = testResults && Array.isArray(testResults) && testResults.length > 0 &&
                        testResults.every((r: any) => r.status === 'pass');
      const hasFailed = testResults && Array.isArray(testResults) && 
                        testResults.some((r: any) => r.status !== 'pass');

      if (result.status?.id === 3 && allPassed) {
        toast.success("All test cases passed!");
        onSuccess?.(); // Trigger success callback
      } else if (result.status?.id === 3 && hasFailed) {
        toast.warning("Code ran, but some test cases failed.");
      } else if (result.status?.id !== 3) {
        toast.error("Execution failed");
      } else {
        toast.success("Code executed successfully!");
      }
      
      if (result.stdout) {
        const startMarker = '___TEST_RESULTS_START___';
        const startIdx = result.stdout.indexOf(startMarker);
        
        if (startIdx !== -1) {
          const userOutput = result.stdout.substring(0, startIdx).trim();
          if (userOutput) {
            result.userOutput = userOutput;
          }
        }
      }

      if (result.stdout && !result.stderr && !result.compile_output) {
        try {
          const startMarker = '___TEST_RESULTS_START___';
          const endMarker = '___TEST_RESULTS_END___';
          
          const startIdx = result.stdout.indexOf(startMarker);
          const endIdx = result.stdout.indexOf(endMarker);
          
          if (startIdx !== -1 && endIdx !== -1) {
            const jsonStr = result.stdout.substring(
              startIdx + startMarker.length,
              endIdx
            ).trim();
            
            const parsedResults = JSON.parse(jsonStr);
            if (Array.isArray(parsedResults) && parsedResults.length > 0 && 
                Object.keys(parsedResults[parsedResults.length - 1]).length === 0) {
              parsedResults.pop();
            }
            result.testResults = parsedResults;
          } else {
             const lines = result.stdout.split('\n');
            let jsonStr = '';
            
            let inJson = false;
            let bracketCount = 0;
            
            for (const line of lines) {
              const trimmed = line.trim();
              if (!inJson && trimmed.startsWith('[')) {
                inJson = true;
                bracketCount = 0;
              }
              
              if (inJson) {
                jsonStr += line;
                for (const char of line) {
                  if (char === '[') bracketCount++;
                  if (char === ']') bracketCount--;
                }
                
                if (bracketCount === 0) {
                  break;
                }
              }
            }
            
            if (jsonStr) {
              const parsedResults = JSON.parse(jsonStr);
              if (Array.isArray(parsedResults) && parsedResults.length > 0 && 
                  Object.keys(parsedResults[parsedResults.length - 1]).length === 0) {
                parsedResults.pop();
              }
              result.testResults = parsedResults;
            }
          }
        } catch (e) {
          console.warn("Failed to parse test results JSON", e);
        }
      }

      setOutput(result);

    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.error || err.message || "An unexpected error occurred";
      setOutput({ stderr: errorMessage });
      toast.error("Failed to execute code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full border rounded-lg overflow-hidden bg-background shadow-sm flex flex-col transition-all duration-300 ${
      isFullscreen 
        ? 'fixed inset-0 z-50 h-screen' 
        : className || 'h-[calc(100vh-100px)] min-h-[600px]'
    }`}>
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-2 border-b bg-muted/30 overflow-x-auto no-scrollbar min-h-[50px]">
              <div className="flex items-center gap-2">
                <LanguageSelector
                  language={language}
                  onLanguageChange={handleLanguageChange}
                  disabled={isLoading}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleReset}
                  disabled={isLoading}
                  title="Reset to default code"
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
                 <Button 
                onClick={handleRun} 
                disabled={isLoading}
                size="sm"
                className="h-8 px-4 text-xs"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                    Running
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 mr-2" />
                    Run Code
                  </>
                )}
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
                }}
                options={{
                  fontSize: settings.fontSize,
                  wordWrap: settings.wordWrap,
                  tabSize: settings.tabSize,
                  minimap: settings.minimap,
                  lineNumbers: settings.lineNumbers
                }}
                theme={settings.theme}
              />
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
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
                  onAddTestCase={handleAddTestCase}
                  onUpdateTestCase={handleUpdateTestCase}
                  onDeleteTestCase={handleDeleteTestCase}
                  
                  // Editing State
                  editingTestCaseId={editingTestCaseId}
                  onEditTestCase={setEditingTestCaseId}
                  onCancelEdit={handleCancelEdit}
                  
                  inputSchema={activeAlgorithm?.input_schema}
                />
             </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
