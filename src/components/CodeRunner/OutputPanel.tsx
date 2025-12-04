import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Terminal, FlaskConical, Clock, Zap, Plus, CheckCircle2, XCircle, AlertCircle, Edit2, Trash2 } from "lucide-react";
import { Algorithm } from '@/data/algorithms';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TestCaseEditor } from './TestCaseEditor';

interface OutputPanelProps {
  output: any | null;
  loading: boolean;
  stdin: string;
  onStdinChange: (value: string) => void;
  testCases?: Array<{ input: any[]; output: any }>;
  executionTime?: number | null;
  algorithmMeta?: Algorithm | null;
  
  // LeetCode Style Props
  activeTab: "testcase" | "result";
  onTabChange: (tab: "testcase" | "result") => void;
  
  allTestCases: Array<{ id: number; input: any[]; expectedOutput: any; isCustom: boolean }>;
  onAddTestCase: () => void;
  onUpdateTestCase: (id: number, data: any) => void;
  onDeleteTestCase: (id: number) => void;
  
  editingTestCaseId: number | null;
  onEditTestCase: (id: number | null) => void;
  onCancelEdit: () => void;
  
  inputSchema?: any[];
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  output,
  loading,
  testCases,
  executionTime,
  algorithmMeta,
  
  activeTab,
  onTabChange,
  
  allTestCases,
  onAddTestCase,
  onUpdateTestCase,
  onDeleteTestCase,
  
  editingTestCaseId,
  onEditTestCase,
  onCancelEdit,
  
  inputSchema = []
}) => {
  // Determine status color
  const getStatusColor = (statusId?: number) => {
    if (statusId === 3) return "text-green-500"; // Accepted
    if (statusId === 6) return "text-yellow-500"; // Compilation Error
    return "text-destructive"; // Runtime Error or Wrong Answer
  };

  const getStatusText = (statusId?: number, description?: string) => {
    if (statusId === 3) return "Accepted";
    return description || "Error";
  };

  return (
    <div className="h-full flex flex-col bg-muted/10 border-t">
      {/* Top Level Tabs Control */}
      <div className="flex items-center gap-1 p-1 bg-muted/30 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onTabChange("testcase")}
          className={`h-8 text-xs gap-2 ${activeTab === "testcase" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          Testcase
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onTabChange("result")}
          className={`h-8 text-xs gap-2 ${activeTab === "result" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
          disabled={!output}
        >
          <Terminal className="w-3.5 h-3.5" />
          Test Result
        </Button>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {/* TESTCASE TAB */}
        {activeTab === "testcase" && (
          <div className="h-full flex flex-col">
            <Tabs defaultValue={`case-${allTestCases[0]?.id}`} className="flex-1 flex flex-col overflow-hidden">
              <div className="border-b px-4 bg-background/50 shrink-0 flex items-center gap-2 overflow-x-auto no-scrollbar">
                <TabsList className="h-9 bg-transparent p-0 gap-1 flex-nowrap">
                  {allTestCases.map((tc, index) => (
                    <TabsTrigger
                      key={tc.id}
                      value={`case-${tc.id}`}
                      className="text-xs px-3 h-7 whitespace-nowrap data-[state=active]:bg-primary/10 relative group"
                    >
                      {tc.isCustom ? `Case ${index + 1}` : `Case ${index + 1}`}
                      {/* Delete button for all cases */}
                      <div 
                        className="ml-2 hover:bg-destructive/20 rounded-full p-0.5 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTestCase(tc.id);
                        }}
                      >
                        <XCircle className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1 ml-1 shrink-0 text-muted-foreground hover:text-foreground"
                  onClick={onAddTestCase}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>

              <div className="flex-1 overflow-hidden">
                {allTestCases.map((tc) => (
                  <TabsContent key={tc.id} value={`case-${tc.id}`} className="h-full m-0 p-4 overflow-y-auto">
                    <div className="space-y-4 max-w-3xl">
                      <div className="relative">
                        <TestCaseEditor
                          testCase={tc}
                          inputSchema={inputSchema}
                          onSave={(updated) => onUpdateTestCase(tc.id, updated)}
                          onCancel={() => onCancelEdit()} 
                          isEditing={tc.isCustom} // Only custom cases are editable
                        />
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </div>
        )}

        {/* TEST RESULT TAB */}
        {activeTab === "result" && output && (
          <div className="h-full flex flex-col">
            {/* Result Header */}
            <div className="p-4 border-b bg-background/50">
              <div className={`text-lg font-semibold flex items-center gap-3 ${getStatusColor(output.status?.id)}`}>
                {getStatusText(output.status?.id, output.status?.description)}
                {executionTime !== null && (
                  <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Runtime: {executionTime} ms
                  </span>
                )}
              </div>
            </div>

            {/* Compilation/Runtime Error */}
            {(output.status?.id === 6 || (output.stderr && !output.testResults)) && (
               <div className="p-4">
                 <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive font-mono text-sm whitespace-pre-wrap">
                   {output.compile_output || output.stderr || output.message}
                 </div>
               </div>
            )}

            {/* Test Results */}
            {output.testResults && (
              <Tabs defaultValue="result-0" className="flex-1 flex flex-col overflow-hidden">
                <div className="border-b px-4 bg-background/50 shrink-0">
                  <TabsList className="h-9 bg-transparent p-0 gap-2 flex-nowrap">
                    {output.testResults.map((result: any, index: number) => (
                      <TabsTrigger
                        key={index}
                        value={`result-${index}`}
                        className={`text-xs px-3 h-7 whitespace-nowrap gap-2 data-[state=active]:bg-muted ${
                          result.status === 'pass' ? 'text-green-500' : 'text-destructive'
                        }`}
                      >
                        {result.status === 'pass' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        Case {index + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {output.testResults.map((result: any, index: number) => (
                    <TabsContent key={index} value={`result-${index}`} className="m-0 space-y-6">
                      {/* Input */}
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground">Input</div>
                        <div className="p-3 rounded-md bg-muted/30 border font-mono text-sm">
                          {JSON.stringify(result.input, null, 2)}
                        </div>
                      </div>

                      {/* Stdout (if any) */}
                      {result.logs && result.logs.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-muted-foreground">Stdout</div>
                          <div className="p-3 rounded-md bg-muted/30 border font-mono text-sm whitespace-pre-wrap">
                            {Array.isArray(result.logs) ? result.logs.join('\n') : result.logs}
                          </div>
                        </div>
                      )}

                      {/* Output */}
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground">Output</div>
                        <div className="p-3 rounded-md bg-muted/30 border font-mono text-sm">
                          {JSON.stringify(result.actual, null, 2)}
                        </div>
                      </div>

                      {/* Expected */}
                      {result.expected !== undefined && (
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-muted-foreground">Expected</div>
                          <div className="p-3 rounded-md bg-muted/30 border font-mono text-sm">
                            {JSON.stringify(result.expected, null, 2)}
                          </div>
                        </div>
                      )}
                      
                      {/* Error Message */}
                      {result.error && (
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-destructive">Error</div>
                          <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 font-mono text-sm text-destructive whitespace-pre-wrap">
                            {result.error}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
            )}
          </div>
        )}
        
        {/* Empty State / Loading */}
        {activeTab === "result" && !output && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
            <div className="text-sm">Run the code to see results</div>
          </div>
        )}
        
        {loading && (
           <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
             <Loader2 className="w-8 h-8 animate-spin text-primary" />
           </div>
        )}
      </div>
    </div>
  );
};
