import React, { useState, useEffect, useCallback } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, RotateCcw, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { toast } from "sonner";
import axios from 'axios';

import { LanguageSelector, Language } from './LanguageSelector';
import { CodeEditor } from './CodeEditor';
import { OutputPanel } from './OutputPanel';
import { DEFAULT_CODE, LANGUAGE_IDS } from './constants';
import { algorithmImplementations } from '@/data/algorithmImplementations';
import { getTestCases } from '@/data/testCases';
import { generateStub } from '@/utils/stubGenerator';
import { algorithms } from '@/data/algorithms';

interface CodeRunnerProps {
  algorithmId?: string;
  onToggleFullscreen?: () => void;
  isMaximized?: boolean;
  className?: string;
}

export const CodeRunner: React.FC<CodeRunnerProps> = ({ 
  algorithmId, 
  onToggleFullscreen, 
  isMaximized = false,
  className 
}) => {
  const [language, setLanguage] = useState<Language>('typescript'); // Default to TypeScript
  const [code, setCode] = useState<string>(DEFAULT_CODE['typescript']);
  const [output, setOutput] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [internalIsFullscreen, setInternalIsFullscreen] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [customTestCases, setCustomTestCases] = useState<Array<{ input: any[]; expectedOutput: any }>>([]);

  // Use either internal state or prop
  const isFullscreen = isMaximized || internalIsFullscreen;

  // Load algorithm code and schema
  useEffect(() => {
    if (algorithmId && algorithmImplementations[algorithmId]) {
      const algoImpl = algorithmImplementations[algorithmId];
      
      // Try to get starter code or full implementation
      let algoCode = algoImpl.starterCode?.[language] || algoImpl.code?.[language];
      
      // If no code exists for this language, generate a stub
      if (!algoCode && algoImpl.inputSchema) {
        const algorithm = algorithms.find(a => a.id === algorithmId);
        const functionName = algorithmId.replace(/-/g, '_'); // Convert kebab-case to snake_case
        
        // Parse input values for stub generation
        const parsedInputs: Record<string, any> = {};
        algoImpl.inputSchema.forEach(field => {
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
          algoImpl.inputSchema,
          Object.keys(parsedInputs).length > 0 ? parsedInputs : undefined
        );
      }
      
      if (algoCode) {
        setCode(algoCode);
      } else {
        setCode(DEFAULT_CODE[language]);
      }

      // Initialize input values from schema or test case
      if (algoImpl.inputSchema) {
        const initialValues: Record<string, string> = {};
        algoImpl.inputSchema.forEach((field, index) => {
           // Default to first test case value if available, else empty
           const defaultVal = algoImpl.testCases?.[0]?.input[index];
           initialValues[field.name] = defaultVal !== undefined ? JSON.stringify(defaultVal) : "";
        });
        setInputValues(initialValues);
      }
    } else {
      setCode(DEFAULT_CODE[language]);
    }
  }, [algorithmId, language]);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setOutput(null);
  };

  const handleReset = () => {
    if (algorithmId && algorithmImplementations[algorithmId]) {
      const algoImpl = algorithmImplementations[algorithmId];
      const algoCode = algoImpl.starterCode?.[language] || algoImpl.code[language];
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
  const algorithmMeta = algorithmId ? algorithms.find(a => a.id === algorithmId) : null;

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

  const handleAddCustomTestCase = () => {
    // TODO: Show modal/dialog to add custom test case
    // For now, just log
    toast.info("Custom test case feature coming soon!");
  };

  const handleRun = async () => {
    setIsLoading(true);
    setOutput(null);
    setExecutionTime(null);

    try {
      const startTime = performance.now();
      
      const algoImpl = algorithmId ? algorithmImplementations[algorithmId] : null;
      const testCaseData = algorithmId ? getTestCases(algorithmId) : null;
      let fullCode = code;

      if (algoImpl && testCaseData && testCaseData.testCases) {
        // Use the new test runner generator with predefined test cases
        const { generateTestRunner } = await import('@/utils/testRunnerGenerator');
        fullCode = generateTestRunner(
          code,
          language,
          testCaseData.testCases,
          algoImpl.inputSchema || []
        );
      } else if (algoImpl && algoImpl.testCases) {
        // Fallback to old test cases from algorithmImplementations if available
        const { generateTestRunner } = await import('@/utils/testRunnerGenerator');
        fullCode = generateTestRunner(
          code,
          language,
          algoImpl.testCases,
          algoImpl.inputSchema || []
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

  const renderInputForm = () => {
    if (!algorithmId || !algorithmImplementations[algorithmId]?.inputSchema) return null;

    return (
      <div className="p-4 grid gap-4 bg-muted/20 border-b">
        <h4 className="text-xs font-medium text-muted-foreground mb-2">Test Inputs</h4>
        <div className="grid grid-cols-2 gap-4">
          {algorithmImplementations[algorithmId].inputSchema!.map((field) => (
            <div key={field.name} className="space-y-1">
              <Label htmlFor={field.name} className="text-[10px] uppercase tracking-wider">{field.label || field.name}</Label>
              <Input 
                id={field.name}
                value={inputValues[field.name] || ''}
                onChange={(e) => setInputValues(prev => ({ ...prev, [field.name]: e.target.value }))}
                className="font-mono text-xs h-7"
                placeholder={`Enter ${field.type}`}
              />
            </div>
          ))}
        </div>
      </div>
    );
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
                onChange={(value) => setCode(value || '')}
              />
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="h-full flex flex-col">
             {renderInputForm()}
             <div className="flex-1 overflow-hidden">
                <OutputPanel 
                  output={output} 
                  loading={isLoading} 
                  stdin="" // Not used anymore
                  onStdinChange={() => {}} // Not used anymore
                  testCases={algorithmId ? (getTestCases(algorithmId)?.testCases || algorithmImplementations[algorithmId]?.testCases) : undefined}
                  executionTime={executionTime}
                  algorithmMeta={algorithmMeta}
                  onAddCustomTestCase={handleAddCustomTestCase}
                />
             </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
