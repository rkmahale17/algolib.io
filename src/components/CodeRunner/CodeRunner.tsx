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
import { generateStub } from '@/utils/stubGenerator';
import { algorithms } from '@/data/algorithms';

interface CodeRunnerProps {
  algorithmId?: string;
}

export const CodeRunner: React.FC<CodeRunnerProps> = ({ algorithmId }) => {
  const [language, setLanguage] = useState<Language>('typescript'); // Default to TypeScript
  const [code, setCode] = useState<string>(DEFAULT_CODE['typescript']);
  const [output, setOutput] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

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
    setIsFullscreen(prev => !prev);
  }, []);

  // ESC key handler for fullscreen
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
  }, [isFullscreen]);

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

  const generateDriverCode = (userCode: string, lang: Language, inputs: Record<string, string>) => {
    const algoImpl = algorithmId ? algorithmImplementations[algorithmId] : null;
    if (!algoImpl || !algoImpl.inputSchema) return userCode;

    if (lang === 'typescript') {
       const match = userCode.match(/function\s+(\w+)/);
       const funcName = match ? match[1] : 'solution';
       
       // Generate variable declarations
       let declarations = '';
       const args: string[] = [];
       algoImpl.inputSchema.forEach(field => {
         const value = formatValueForLanguage(inputs[field.name], field.type, lang);
         declarations += `const ${field.name} = ${value};\n`;
         args.push(field.name);
       });
       
       return `${userCode}\n\n// Driver Code (Auto-generated)\n${declarations}console.log(JSON.stringify(${funcName}(${args.join(', ')})));`;
    } 
    else if (lang === 'python') {
       const match = userCode.match(/def\s+(\w+)/);
       const funcName = match ? match[1] : 'solution';
       
       // Generate variable declarations
       let declarations = '';
       const args: string[] = [];
       algoImpl.inputSchema.forEach(field => {
         const value = formatValueForLanguage(inputs[field.name], field.type, lang);
         declarations += `${field.name} = ${value}\n`;
         args.push(field.name);
       });
       
       // Check if we need to add typing import
       let imports = '';
       if (userCode.includes('List[') && !userCode.includes('from typing import')) {
         imports = 'from typing import List\n';
       }
       
       return `${imports}${userCode}\n\n# Driver Code (Auto-generated)\nimport json\n${declarations}print(json.dumps(${funcName}(${args.join(', ')})))`;
    }
    else if (lang === 'java') {
       // Need to wrap in class Main
       let adjustedUserCode = userCode;
       if (!adjustedUserCode.includes('static')) {
          adjustedUserCode = adjustedUserCode.replace('public ', 'public static ');
          if (!adjustedUserCode.includes('public static')) {
             adjustedUserCode = adjustedUserCode.replace(/^(\w+)/, 'static $1');
          }
       }

       const match = userCode.match(/(\w+)\s*\(/);
       const funcName = match ? match[1] : 'solution';
       
       // Check if return type is array
       const isArrayReturn = userCode.includes('int[]') || userCode.includes('Integer[]');
       
       // Generate variable declarations
       let declarations = '';
       const args: string[] = [];
       algoImpl.inputSchema.forEach(field => {
         const value = formatValueForLanguage(inputs[field.name], field.type, lang);
         const varType = field.type === 'number[]' ? 'int[]' : 
                        field.type === 'number' ? 'int' :
                        field.type === 'string' ? 'String' : 'boolean';
         
         if (field.type === 'number[]') {
           // formatValueForLanguage already returns {1, 2, 3} for Java
           declarations += `        ${varType} ${field.name} = new int[]${value};\n`;
         } else {
           declarations += `        ${varType} ${field.name} = ${value};\n`;
         }
         args.push(field.name);
       });

       return `import java.util.*;
import java.util.stream.*;

public class Main {
    ${isArrayReturn ? `// Helper method to print array as JSON
    private static void printArrayJSON(int[] arr) {
        System.out.print("[");
        for(int i = 0; i < arr.length; i++) {
            System.out.print(arr[i]);
            if(i < arr.length - 1) System.out.print(",");
        }
        System.out.println("]");
    }
    
    ` : ''}${adjustedUserCode}

    public static void main(String[] args) {
        try {
${declarations}            ${isArrayReturn ? `int[] result = ${funcName}(${args.join(', ')});
            printArrayJSON(result);` : `Object result = ${funcName}(${args.join(', ')});
            System.out.println(result);`}
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}`;
    }
    else if (lang === 'cpp') {
       const match = userCode.match(/(\w+)\s*\(/);
       const funcName = match ? match[1] : 'solution';
       
       // Check if return type is vector
       const isVectorReturn = userCode.includes('vector<int>');
       
       // Generate variable declarations
       let declarations = '';
       const args: string[] = [];
       algoImpl.inputSchema.forEach(field => {
         const value = formatValueForLanguage(inputs[field.name], field.type, lang);
         const varType = field.type === 'number[]' ? 'vector<int>' : 
                        field.type === 'number' ? 'int' :
                        field.type === 'string' ? 'string' : 'bool';
         
         declarations += `    ${varType} ${field.name} = ${value};\n`;
         args.push(field.name);
       });
       
       return `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <map>

using namespace std;

${isVectorReturn ? `// Helper function to print vector as JSON array
void printVectorJSON(const vector<int>& v) {
    cout << "[";
    for(size_t i = 0; i < v.size(); i++) {
        cout << v[i];
        if(i < v.size() - 1) cout << ",";
    }
    cout << "]" << endl;
}

` : ''}${userCode}

int main() {
${declarations}    auto result = ${funcName}(${args.join(', ')});
    ${isVectorReturn ? 'printVectorJSON(result);' : 'cout << result << endl;'}
    return 0;
}`;
    }
    
    return userCode;
  };

  const handleRun = async () => {
    setIsLoading(true);
    setOutput(null);
    setExecutionTime(null);

    try {
      const startTime = performance.now();
      const fullCode = generateDriverCode(code, language, inputValues);

      const response = await axios.post('/api/execute', {
        language_id: LANGUAGE_IDS[language],
        source_code: fullCode,
        stdin: "" // Inputs are hardcoded into driver code now
      });

      const endTime = performance.now();
      const execTime = Math.round(endTime - startTime);
      setExecutionTime(execTime);

      const result = response.data;
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
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Test Inputs</h4>
        <div className="grid grid-cols-2 gap-4">
          {algorithmImplementations[algorithmId].inputSchema!.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name} className="text-xs">{field.label || field.name}</Label>
              <Input 
                id={field.name}
                value={inputValues[field.name] || ''}
                onChange={(e) => setInputValues(prev => ({ ...prev, [field.name]: e.target.value }))}
                className="font-mono text-xs h-8"
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
        : 'h-[calc(100vh-100px)] min-h-[1200px]'
    }`}>
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-muted/30">
              <div className="flex items-center gap-4">
                <LanguageSelector
                  language={language}
                  onLanguageChange={handleLanguageChange}
                  disabled={isLoading}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  disabled={isLoading}
                  title="Reset to default code"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleFullscreen}
                  title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <Button 
                onClick={handleRun} 
                disabled={isLoading}
                className="w-32"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Running
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Code
                  </>
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
                  testCases={algorithmId ? algorithmImplementations[algorithmId]?.testCases : undefined}
                  executionTime={executionTime}
                  algorithmMeta={algorithmMeta}
                />
             </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
