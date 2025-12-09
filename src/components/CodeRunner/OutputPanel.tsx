import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Terminal, FlaskConical, Clock, Zap, Plus, CheckCircle2, XCircle, AlertCircle, AlertTriangle, Edit2, Trash2, History, Code } from "lucide-react";
import { Algorithm } from '@/data/algorithms';
import { Button } from "@/components/ui/button";
import { FeatureGuard } from "@/components/FeatureGuard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TestCaseEditor } from './TestCaseEditor';
import { Submission } from '@/types/userAlgorithmData';

interface OutputPanelProps {
  output: any | null;
  loading: boolean;
  stdin: string;
  onStdinChange: (value: string) => void;
  testCases?: Array<{ input: any[]; output: any }>;
  executionTime?: number | null;
  algorithmMeta?: Algorithm | null;
  
  // LeetCode Style Props
  activeTab: "testcase" | "result" | "submissions";
  onTabChange: (tab: "testcase" | "result" | "submissions") => void;
  
  allTestCases: Array<{ id: number; input: any[]; expectedOutput: any; isCustom: boolean; description?: string; isSubmission?: boolean }>;
  onAddTestCase: () => void;
  onUpdateTestCase: (id: number, data: any) => void;
  onDeleteTestCase: (id: number) => void;
  
  // Editing State
  editingTestCaseId: number | null;
  onEditTestCase: (id: number | null) => void;
  onCancelEdit: () => void;
  
  inputSchema?: any[];
  controls?: any;
  
  // New Prop
  submissions?: Submission[];
  executedTestCases?: Array<{ id: number; input: any[]; expectedOutput: any; isCustom: boolean; description?: string; isSubmission?: boolean }>;
  onSelectSubmission?: (submission: Submission) => void;
}

export const OutputPanel = ({
  output,
  loading,
  stdin,
  onStdinChange,
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
  controls,
  inputSchema,
  submissions = [],
  executedTestCases,
  onSelectSubmission
}: OutputPanelProps) => {
  const [activeTestCaseTab, setActiveTestCaseTab] = useState<string>("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [panelWidth, setPanelWidth] = useState(300);

  // Measure panel width for responsive tab labels
  React.useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setPanelWidth(entry.contentRect.width);
      }
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (allTestCases.length > 0) {
      // If no active tab, select the first one
      if (!activeTestCaseTab) {
        setActiveTestCaseTab(`case-${allTestCases[0].id}`);
      } else {
        // Check if current active tab still exists
        const currentExists = allTestCases.some(tc => `case-${tc.id}` === activeTestCaseTab);
        if (!currentExists) {
          // If current tab was deleted, select the last one
          setActiveTestCaseTab(`case-${allTestCases[allTestCases.length - 1].id}`);
        }
      }
      
      // Auto-select the newest test case (last in array) when a new one is added
      const lastTestCase = allTestCases[allTestCases.length - 1];
      if (lastTestCase && lastTestCase.isCustom && editingTestCaseId === lastTestCase.id) {
        setActiveTestCaseTab(`case-${lastTestCase.id}`);
      }
    }
  }, [allTestCases, editingTestCaseId]);

  // Determine status color
  const getStatusColor = (statusId?: number, testResults?: any[]) => {
    if (statusId === 3) {
      const allPassed = testResults?.every((r: any) => r.status === 'pass');
      return allPassed ? "text-green-500" : "text-destructive";
    }
    if (statusId === 6) return "text-yellow-500"; // Compilation Error
    return "text-destructive"; // Runtime Error or Wrong Answer
  };

  const getStatusText = (statusId?: number, description?: string, testResults?: any[]) => {
    if (statusId === 3) {
      const allPassed = testResults?.every((r: any) => r.status === 'pass');
      return allPassed ? "Accepted" : "Wrong Answer";
    }
    return description || "Error";
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="h-full flex flex-col bg-muted/10 border-t overflow-hidden">
      {/* Top Bar / Tabs */}
      <div className="flex items-center gap-1 p-1 border-b bg-background/50 shrink-0 overflow-x-auto no-scrollbar">
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

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onTabChange("submissions")}
          className={`h-8 text-xs gap-2 ${activeTab === "submissions" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
        >
          <History className="w-3.5 h-3.5" />
          Submissions
        </Button>
      </div>
      {/* TABS content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        {/* TESTCASE TAB */}
        {activeTab === "testcase" && (
          <div className="h-full flex flex-col min-h-0">
            <Tabs 
              value={activeTestCaseTab} 
              onValueChange={setActiveTestCaseTab}
              className="flex-1 flex flex-col min-h-0"
            >
              <div className="border-b px-4 bg-background/50 shrink-0 flex items-center gap-2">
                <TabsList className="h-9 bg-transparent p-0 gap-1 flex-nowrap overflow-x-auto w-0 flex-1 justify-start overflow-y-hidden">
                  {allTestCases.filter(tc => !tc.isSubmission).map((tc, index) => (
                    <TabsTrigger
                      key={tc.id}
                      value={`case-${tc.id}`}
                      className="text-xs px-3 h-7 whitespace-nowrap data-[state=active]:bg-primary/10 relative group shrink-0"
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
                
                <div className="flex items-center gap-2">
                 <FeatureGuard flag="custom_test_case_addtion">
                  {controls?.add_test_case !== false && (
                      <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={onAddTestCase}
                      className="h-8 text-xs gap-1 ml-1"
                      disabled={loading}
                      >
                      <Plus className="w-3 h-3" />
                      Add Test Case
                      </Button>
                  )}
                 </FeatureGuard>
                </div>
              </div>

              <div className="flex-1 min-h-0">
                <ScrollArea className="h-full" type="always">
                  {allTestCases.filter(tc => !tc.isSubmission).map((tc) => (
                    <TabsContent key={tc.id} value={`case-${tc.id}`} className="h-full m-0 p-4">
                        <div className="relative">
                          <TestCaseEditor
                            testCase={tc}
                            inputSchema={inputSchema}
                            onSave={(updated) => onUpdateTestCase(tc.id, updated)}
                            onCancel={() => onCancelEdit()} 
                            isEditing={editingTestCaseId === tc.id}
                            onEdit={() => onEditTestCase(tc.id)}
                            canEdit={tc.isCustom}
                          />
                        </div>
                    </TabsContent>
                  ))}
                </ScrollArea>
              </div>
            </Tabs>
          </div>
        )}

        {/* TEST RESULT TAB */}
        {activeTab === "result" && output && (
          <div className="h-full flex flex-col min-h-0">
            {/* Result Header */}
            <div className="p-4 border-b bg-background/50 shrink-0">
              <div className={`text-lg font-semibold flex items-center gap-3 ${getStatusColor(output.status?.id, output.testResults)}`}>
                {loading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Running Tests...</span>
                  </div>
                ) : (
                  <>
                    {getStatusText(output.status?.id, output.status?.description, output.testResults)}
                    {executionTime !== null && (
                      <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {executionTime} ms
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Scrollable content area */}
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full" type="always">
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
                  <Tabs defaultValue="result-0" className="flex flex-col">
                    <div className="flex border-b px-4 bg-background/50 shrink-0 sticky top-0 z-10 overflow-hidden">
                      <TabsList className="h-9 bg-transparent p-0 gap-2 flex-nowrap overflow-x-auto w-full justify-start overflow-y-hidden">
                        {output.testResults.map((result: any, index: number) => (
                          <TabsTrigger
                            key={index}
                            value={`result-${index}`}
                            className={`text-xs px-3 h-7 whitespace-nowrap gap-2 data-[state=active]:bg-muted ${
                              result.status === 'pass' ? 'text-green-500 data-[state=active]:text-green-500' : 'text-destructive data-[state=active]:text-destructive'
                            }`}
                          >
                            {result.status === 'pass' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            Case {index + 1}
                            {/* Show tooltip or small indicator if description exists */}
                            {(() => {
                                // Resolve test case from executed list if available, else allTestCases (fallback/legacy)
                                // Note: result index matches executedTestCases index
                                const tc = executedTestCases ? executedTestCases[index] : allTestCases[index];
                                return tc?.description && (
                                    <span className="ml-2 text-[10px] text-muted-foreground/70 hidden sm:inline-block truncate max-w-[100px]">
                                        - {tc.description}
                                    </span>
                                );
                            })()}

                            {/* Hide details for submission cases in tabs? Or show them but mask content? 
                                User Requirement: "test cases which mark as a submission also visiable here" -> imply they see them but shouldn't?
                                Or "should at test visible" -> "should NOT be visible"?
                                Let's show them in RESULTS but mark as hidden.
                            */}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </div>

                    <div className="p-4">
                      {output.testResults.map((result: any, index: number) => (
                        <TabsContent key={index} value={`result-${index}`} className="m-0 space-y-6">
                          {/* Input */}
                          <div className="space-y-2">
                            <div className="text-xs font-medium text-muted-foreground">Input</div>
                            <div className="p-3 rounded-md bg-muted/30 border font-mono text-sm">
                              {(() => {
                                const tc = executedTestCases ? executedTestCases[index] : allTestCases[index];

                                // Check if this is a hidden submission case
                                const isHidden = tc?.isSubmission;
                                if (isHidden) return "Hidden Test Case";

                                // Fallback to original test case input if result input is missing
                                const inputData = result.input !== undefined ? result.input : tc?.input;
                                
                                if (inputSchema && inputSchema.length > 0 && Array.isArray(inputData)) {
                                   return (
                                    <div className="space-y-1">
                                        {inputSchema.map((field, i) => (
                                            <div key={i} className="flex gap-2">
                                                <span className="text-muted-foreground select-none">{field.name}:</span>
                                                <span>{JSON.stringify(inputData[i])}</span>
                                            </div>
                                        ))}
                                    </div>
                                   );
                                }
                                return JSON.stringify(inputData, null, 2);
                              })()}
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
                              {(() => {
                                const tc = executedTestCases ? executedTestCases[index] : allTestCases[index];
                                return tc?.isSubmission ? "Hidden Output" : JSON.stringify(result.actual, null, 2);
                              })()}
                            </div>
                          </div>

                          {/* Expected */}
                          {result.expected !== undefined && (
                            <div className="space-y-2">
                              <div className="text-xs font-medium text-muted-foreground">Expected</div>
                              <div className="p-3 rounded-md bg-muted/30 border font-mono text-sm">
                                {(() => {
                                  const tc = executedTestCases ? executedTestCases[index] : allTestCases[index];
                                  return tc?.isSubmission ? "Hidden Expected Output" : JSON.stringify(result.expected, null, 2);
                                })()}
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
              </ScrollArea>
            </div>
          </div>
        )}
        
        {/* SUBMISSIONS TAB */}
        {activeTab === "submissions" && (
          <div className="h-full flex flex-col min-h-0 bg-background/50">
             {submissions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                    <History className="w-12 h-12 mb-4 opacity-20" />
                    <p>No submissions yet</p>
                    <p className="text-xs mt-1">Submit your code to see history here</p>
                </div>
             ) : (
                <ScrollArea className="h-full">
                    <div className="p-4 space-y-3">
                        {/* Header */}
                        <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-3 mb-2">
                            <div className="col-span-4">Status</div>
                            <div className="col-span-2">Lang</div>
                        </div>
                        
                        {/* List */}
                        <div className="space-y-2">
                        {[...submissions].reverse().map((sub) => (
                          <div 
                             key={sub.id} 
                             className="grid grid-cols-12 gap-2 p-3 rounded-lg border bg-card hover:bg-muted/50 cursor-pointer transition-colors items-center text-sm shadow-sm"
                             onClick={() => onSelectSubmission?.(sub)}
                          >
                             <div className="col-span-4 flex items-center gap-2">
                                {sub.status === 'passed' ? (
                                   <CheckCircle2 className="w-4 h-4 text-green-500" />
                                ) : sub.status === 'error' ? (
                                   <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                ) : (
                                   <XCircle className="w-4 h-4 text-destructive" />
                                )}
                                <div className="flex flex-col">
                                   <span className={`font-medium ${sub.status === 'passed' ? 'text-green-600' : 'text-destructive'}`}>
                                      {sub.status === 'passed' ? 'Accepted' : (sub.status === 'error' ? 'Runtime Error' : 'Wrong Answer')}
                                   </span>
                                   <span className="text-[10px] text-muted-foreground mt-0.5">
                                      {sub.test_results?.passed ?? 0} / {sub.test_results?.total ?? 0} passed
                                   </span>
                                </div>
                             </div>
                             <div className="col-span-2 text-xs capitalize text-muted-foreground">
                                {sub.language}
                             </div>
                              <div className="col-span-3 text-xs text-muted-foreground font-mono">
                                  {sub.test_results?.execution_time_ms ? `${sub.test_results.execution_time_ms} ms` : '-'}
                              </div>
                              <div className="col-span-3 text-right text-xs text-muted-foreground">
                                  {new Date(sub.timestamp).toLocaleString()}
                              </div>
                          </div>
                        ))}
                      </div>
                    </div>
                </ScrollArea>
              )}
          </div>
        )}
        
        {/* Empty State / Loading for Result Tab */}
        {activeTab === "result" && !output && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
            <div className="text-sm">Run the code to see results</div>
          </div>
        )}
        
        {loading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-primary animate-pulse" />
              </div>
            </div>
            <div className="mt-4 text-sm font-medium text-muted-foreground animate-pulse">
              Running Code...
            </div>
          </div>
        )}
      </div>
   
    </div>
  );
};
