import React, { useState, useEffect, useCallback } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, RotateCcw, Loader2, Maximize2, Minimize2, Plus, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import axios from 'axios';

import { LanguageSelector, Language } from './LanguageSelector';
import { CodeEditor } from './CodeEditor';
import { OutputPanel } from './OutputPanel';
import { TestCaseEditor } from './TestCaseEditor';
import { DEFAULT_CODE, LANGUAGE_IDS } from './constants';
// import { algorithmsDB } from '@/data/algorithmsDB';
import { supabase } from '@/integrations/supabase/client';
import { generateStub } from '@/utils/stubGenerator';
import { ScrollArea } from '@/components/ui/scroll-area';

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
}

export const CodeRunner: React.FC<CodeRunnerProps> = ({ 
  algorithmId, 
  algorithmData,
  onToggleFullscreen, 
  isMaximized = false,
  className,
  initialCode,
  onCodeChange,
  language: controlledLanguage,
  onLanguageChange
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
  const [testCases, setTestCases] = useState<Array<{ id: number; input: any[]; expectedOutput: any; isCustom: boolean }>>([]);
  const [activeTab, setActiveTab] = useState<"testcase" | "result">("testcase");
  
  const [fetchedAlgorithm, setFetchedAlgorithm] = useState<any>(null);
  const [editingTestCaseId, setEditingTestCaseId] = useState<number | null>(null);
  const [pendingTestCaseId, setPendingTestCaseId] = useState<number | null>(null);
  const [isAddingTestCase, setIsAddingTestCase] = useState(false);

  const activeAlgorithm = algorithmData || fetchedAlgorithm;

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
          
          // Transform Supabase data structure to match component expectations
          const transformedData = {
            ...data,
            ...(data.metadata || {}),
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
      const algo = activeAlgorithm;
      
      // If initialCode is provided and we haven't switched languages manually, use it
      // Note: This is a simple heuristic. For more robust handling, we might need a 'savedLanguage' prop.
      if (initialCode && code === initialCode) {
         // Do nothing, keep initial code
      } else {
          // Try to get starter code or full implementation
          const impl = algo.implementations.find(i => i.lang.toLowerCase() === language.toLowerCase());
          let algoCode = impl?.code.find(c => c.codeType === 'starter')?.code || impl?.code.find(c => c.codeType === 'optimize')?.code;
          
          // If no code exists for this language, generate a stub
          if (!algoCode && algo.input_schema) {
            const functionName = algorithmId?.replace(/-/g, '_') || 'solution'; // Convert kebab-case to snake_case
            
            // Parse input values for stub generation
            const parsedInputs: Record<string, any> = {};
            algo.input_schema.forEach(field => {
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
      }

      // Initialize input values from schema or test case
      if (algo.input_schema) {
        const initialValues: Record<string, string> = {};
        algo.input_schema.forEach((field, index) => {
           // Default to first test case value if available, else empty
           const defaultVal = algo.test_cases?.[0]?.input[index];
           initialValues[field.name] = defaultVal !== undefined ? JSON.stringify(defaultVal) : "";
        });
        setInputValues(initialValues);
      }

      // Initialize test cases from algorithm data
      if (algo.test_cases) {
        const initialTestCases = algo.test_cases.map((tc: any, idx: number) => ({
          id: idx, // Use index as ID for sample cases
          input: tc.input,
          expectedOutput: tc.expectedOutput || tc.output,
          isCustom: false
        }));
        setTestCases(initialTestCases);
      }
    } else {
      if (!initialCode) {
        setCode(DEFAULT_CODE[language]);
        onCodeChange?.(DEFAULT_CODE[language]);
      }
    }
  }, [activeAlgorithm, language, algorithmId]); // Removed initialCode from deps to prevent reset on every save

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
      const impl = algo.implementations.find(i => i.lang.toLowerCase() === language.toLowerCase());
      const algoCode = impl?.code.find(c => c.codeType === 'starter')?.code || impl?.code.find(c => c.codeType === 'optimize')?.code;
      setCode(algoCode || DEFAULT_CODE[language]);
    } else {
      setCode(DEFAULT_CODE[language]);
    }
    setOutput(null);
    toast.success("Code reset to default");
  };

  // Fullscreen mode handlers
  const toggleFullscreen = useCallback(() => {
    if (onToggleFullscreen) {
      onToggleFullscreen();
    } else {
      setInternalIsFullscreen(prev => !prev);
    }
  }, [onToggleFullscreen]);

  // ESC key handler for fullscreen
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        if (onToggleFullscreen) {
           // Optional: call onToggleFullscreen() if we want ESC to exit external fullscreen
        } else {
          setInternalIsFullscreen(false);
        }
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullscreen, onToggleFullscreen]);

  // Get algorithm metadata for complexity display
  const algorithmMeta = activeAlgorithm;

  const formatValueForLanguage = (value: string, type: string, lang: Language): string => {
    if (type === 'number' || type === 'boolean') {
      return value;
    }
    
    if (type === 'string') {
      return `"${value}"`;
    }
    
    if (type === 'number[]') {
      try {
        const arr = JSON.parse(value);
        if (lang === 'java') {
          // Return only the initializer list, caller will add 'new int[]'
          return `{${arr.join(', ')}}`;
        } else if (lang === 'cpp') {
          return `{${arr.join(', ')}}`; // For vector initializer
        } else if (lang === 'python') {
           return value; // "[1, 2, 3]" is valid python list
        } else {
           return value; // "[1, 2, 3]" is valid JS array
        }
      } catch (e) {
        return value; // Fallback
      }
    }
    return value;
  };

  const handleAddTestCase = () => {
    // Create default values based on schema types
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
    setEditingTestCaseId(newTestCase.id); // Auto-start editing
    setPendingTestCaseId(newTestCase.id); // Mark as pending
    toast.success("New test case added");
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
    // If we are cancelling a newly added test case that hasn't been saved/modified yet, remove it
    // We can check if it's the last one and matches default values, or track "newlyAdded" state.
    // Simpler approach: If the user cancels the edit of a custom test case immediately after adding it,
    // we should probably keep it if they want to edit it later?
    // User request: "cancel means delete the test case if not added"
    // We'll implement a check: if it's a custom case and we just added it.
    // For now, let's just stop editing. The user can delete it explicitly if they want.
    // Wait, user explicitly asked: "cancel means delete the test case if not added"
    // We need to know if it was just added.
    // Let's rely on the fact that we setEditingTestCaseId immediately after adding.
    // But we don't have a separate "isNew" flag.
    // Let's assume if the user cancels, they just want to stop editing.
    // If they want to delete, they can use the delete button.
    // BUT, for a better UX on "Add", we could check if it's identical to default?
    // Let's stick to simple cancel for now to avoid accidental deletion of work.
    // Re-reading user request: "cancel means delete the test case if not added"
    // Okay, I will implement a "pendingTestCaseId" state.
    
    if (editingTestCaseId === pendingTestCaseId) {
       setTestCases(testCases.filter(tc => tc.id !== pendingTestCaseId));
       setPendingTestCaseId(null);
       toast.info("New test case discarded");
    }
    setEditingTestCaseId(null);
  };

  const handleRun = async () => {
    setIsLoading(true);
    setOutput(null);
    setExecutionTime(null);

    try {
      const startTime = performance.now();
      
      const algo = activeAlgorithm;
      let fullCode = code;

      // Use the unified test cases
      const allTestCases = testCases.map(tc => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        description: tc.isCustom ? 'Custom Case' : `Case ${tc.id + 1}`
      }));

      if (algo && allTestCases.length > 0) {
        // Use the new test runner generator with all test cases
        const { generateTestRunner } = await import('@/utils/testRunnerGenerator');
        fullCode = generateTestRunner(
          code,
          language,
          allTestCases,
          algo.input_schema || []
        );
      } else {
        // No test cases available, just run the code as-is
        // This might need custom input handling in the future
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
      setActiveTab("result"); // Switch to result tab on completion
      
      // Check if ALL test cases passed
      const allPassed = result.testResults && Array.isArray(result.testResults) && 
                        result.testResults.every((r: any) => r.status === 'pass');

      if (result.status?.id === 3 && allPassed) { // Accepted AND all tests passed
        toast.success("All test cases passed!");
      } else if (result.status?.id === 3 && !allPassed) {
         toast.warning("Code ran, but some test cases failed.");
      } else {
        toast.error("Execution failed");
      }
      
      // Always try to extract user output from stdout, regardless of errors
      if (result.stdout) {
        const startMarker = '___TEST_RESULTS_START___';
        const startIdx = result.stdout.indexOf(startMarker);
        
        if (startIdx !== -1) {
          // We found the marker, so everything before it is user output
          const userOutput = result.stdout.substring(0, startIdx).trim();
          if (userOutput) {
            result.userOutput = userOutput;
          }
        }
      }

      // Parse the output if it's our structured JSON and no runtime errors
      if (result.stdout && !result.stderr && !result.compile_output) {
        try {
          // Look for test results between markers
          const startMarker = '___TEST_RESULTS_START___';
          const endMarker = '___TEST_RESULTS_END___';
          
          const startIdx = result.stdout.indexOf(startMarker);
          const endIdx = result.stdout.indexOf(endMarker);
          
          if (startIdx !== -1 && endIdx !== -1) {
            // Extract only the JSON between markers
            const jsonStr = result.stdout.substring(
              startIdx + startMarker.length,
              endIdx
            ).trim();
            
            const parsedResults = JSON.parse(jsonStr);
            // Remove the dummy last element if it exists (from C++ runner)
            if (Array.isArray(parsedResults) && parsedResults.length > 0 && 
                Object.keys(parsedResults[parsedResults.length - 1]).length === 0) {
              parsedResults.pop();
            }
            result.testResults = parsedResults;
          } else {
            // Fallback to old bracket-counting method for languages without markers
            // ... (keep existing fallback logic if needed, or simplify if we trust markers)
             const lines = result.stdout.split('\n');
            let jsonStr = '';
            
            // Find the line that starts with '[' and collect until we find the matching ']'
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
                // Count brackets
                for (const char of line) {
                  if (char === '[') bracketCount++;
                  if (char === ']') bracketCount--;
                }
                
                // If we've closed all brackets, we're done
                if (bracketCount === 0) {
                  break;
                }
              }
            }
            
            if (jsonStr) {
              const parsedResults = JSON.parse(jsonStr);
              // Remove the dummy last element if it exists (from C++ runner)
              if (Array.isArray(parsedResults) && parsedResults.length > 0 && 
                  Object.keys(parsedResults[parsedResults.length - 1]).length === 0) {
                parsedResults.pop();
              }
              result.testResults = parsedResults;
            }
          }
        } catch (e) {
          console.warn("Failed to parse test results JSON", e);
          console.log("Raw stdout:", result.stdout);
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
            <div className="flex items-center justify-between p-2 border-b bg-muted/30">
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
            <div className="flex-1 relative">
              <CodeEditor
                code={code}
                language={language}
                onChange={(value) => {
                  const newCode = value || '';
                  setCode(newCode);
                  onCodeChange?.(newCode);
                }}
              />
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50} minSize={20}>
           <ScrollArea className="h-full">
          <div className="h-full flex-col">
             <div className="flex-1 overflow-hidden">
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

         </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
