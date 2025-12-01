import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Terminal, FlaskConical, Clock, Zap, Plus, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Algorithm } from '@/data/algorithms';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface OutputPanelProps {
  output: any | null;
  loading: boolean;
  stdin: string;
  onStdinChange: (value: string) => void;
  testCases?: Array<{ input: any[]; output: any }>;
  executionTime?: number | null;
  algorithmMeta?: Algorithm | null;
  onAddCustomTestCase?: () => void;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  output,
  loading,
  testCases,
  executionTime,
  algorithmMeta,
  onAddCustomTestCase
}) => {
  const [activeTestCase, setActiveTestCase] = useState<string>("test-0");
  
  // Check for compilation or system errors
  const hasCompilationError = output?.status?.id === 6 || output?.compile_output;
  const hasRuntimeError = output?.status?.id && output.status.id !== 3 && !hasCompilationError;
  const hasTestResults = output?.testResults && Array.isArray(output.testResults);
  
  // Determine default tab
  let defaultTab = "output";
  if (hasCompilationError || hasRuntimeError) {
    defaultTab = "output";
  } else if (hasTestResults && testCases && testCases.length > 0) {
    defaultTab = "testcases";
  }

  // Get test result for a specific test case index
  const getTestResult = (index: number) => {
    if (!output?.testResults || !output.testResults[index]) return null;
    return output.testResults[index];
  };

  return (
    <div className="h-full flex flex-col bg-muted/10 border-t">
      <Tabs defaultValue={defaultTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b px-4 bg-muted/30 shrink-0">
          <TabsList className="h-10">
            {testCases && testCases.length > 0 && (
              <TabsTrigger value="testcases" className="text-xs">
                <FlaskConical className="w-3 h-3 mr-2" />
                Test Cases
              </TabsTrigger>
            )}
            <TabsTrigger value="output" className="text-xs">
              <Terminal className="w-3 h-3 mr-2" />
              Console
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          {/* Test Cases Tab */}
          {testCases && testCases.length > 0 && (
            <TabsContent value="testcases" className="h-full m-0 p-0 flex flex-col overflow-hidden">
              {/* Show compilation/runtime errors prominently */}
              {(hasCompilationError || hasRuntimeError) && (
                <div className="p-4 border-b bg-destructive/5">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>
                      {hasCompilationError ? 'Compilation Error' : output.status?.description}
                    </AlertTitle>
                    <AlertDescription className="mt-2">
                      {hasCompilationError ? (
                        <div className="font-mono text-xs whitespace-pre-wrap">
                          {output.compile_output}
                        </div>
                      ) : (
                        <div className="font-mono text-xs whitespace-pre-wrap">
                          {output.message || output.stderr || 'An error occurred during execution'}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Fix the error above to run test cases. Check the Console tab for full output.
                  </div>
                </div>
              )}

              {/* Test Case Tabs - only show if no compilation/runtime errors */}
              {!hasCompilationError && !hasRuntimeError && (
                <>
                  <div className="border-b bg-background/50 shrink-0">
                    <Tabs value={activeTestCase} onValueChange={setActiveTestCase} className="w-full">
                      <ScrollArea className="w-full">
                        <div className="flex items-center px-4 py-2 gap-2">
                          <TabsList className="h-8 bg-transparent p-0 gap-1 flex-nowrap">
                            {testCases.map((_, index) => {
                              const result = getTestResult(index);
                              const isPassed = result?.status === 'pass';
                              const isFailed = result?.status === 'fail';
                              const isError = result?.status === 'error';
                              
                              return (
                                <TabsTrigger
                                  key={index}
                                  value={`test-${index}`}
                                  className={`text-xs px-3 h-8 whitespace-nowrap data-[state=active]:bg-primary/10 ${
                                    isPassed ? 'text-green-600 data-[state=active]:text-green-600' :
                                    isFailed || isError ? 'text-destructive data-[state=active]:text-destructive' :
                                    ''
                                  }`}
                                >
                                  {isPassed && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                  {(isFailed || isError) && <XCircle className="w-3 h-3 mr-1" />}
                                  Test Case {index + 1}
                                </TabsTrigger>
                              );
                            })}
                          </TabsList>
                          {onAddCustomTestCase && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs gap-1 ml-auto shrink-0"
                              onClick={onAddCustomTestCase}
                            >
                              <Plus className="w-3 h-3" />
                              Add Custom
                            </Button>
                          )}
                        </div>
                      </ScrollArea>

                      {/* Individual Test Case Content */}
                      <ScrollArea className="flex-1 h-[calc(100%-40px)] w-full">
                        {testCases.map((testCase, index) => {
                          const result = getTestResult(index);
                          
                          return (
                            <TabsContent key={index} value={`test-${index}`} className="m-0 p-4 space-y-4">
                              {result ? (
                                <>
                                  {/* Status Badge */}
                                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                                    result.status === 'pass' 
                                      ? 'bg-green-500/10 text-green-600 border border-green-500/20' 
                                      : 'bg-destructive/10 text-destructive border border-destructive/20'
                                  }`}>
                                    {result.status === 'pass' ? (
                                      <>
                                        <CheckCircle2 className="w-4 h-4" />
                                        Passed
                                      </>
                                    ) : (
                                      <>
                                        <XCircle className="w-4 h-4" />
                                        {result.status === 'error' ? 'Runtime Error' : 'Failed'}
                                      </>
                                    )}
                                  </div>

                                  {/* Test Case Details */}
                                  <div className="space-y-3">
                                    <div className="p-3 rounded-lg bg-muted/30 border">
                                      <div className="text-xs font-semibold text-muted-foreground mb-2">INPUT</div>
                                      <code className="font-mono text-sm break-all block">
                                        {JSON.stringify(result.input || testCase.input, null, 2)}
                                      </code>
                                    </div>

                                    <div className="p-3 rounded-lg bg-muted/30 border">
                                      <div className="text-xs font-semibold text-muted-foreground mb-2">EXPECTED OUTPUT</div>
                                      <code className="font-mono text-sm break-all block">
                                        {JSON.stringify(result.expected || testCase.output, null, 2)}
                                      </code>
                                    </div>

                                    {result.status !== 'error' && (
                                      <div className={`p-3 rounded-lg border ${
                                        result.status === 'pass' 
                                          ? 'bg-green-500/5 border-green-500/20' 
                                          : 'bg-destructive/5 border-destructive/20'
                                      }`}>
                                        <div className="text-xs font-semibold text-muted-foreground mb-2">YOUR OUTPUT</div>
                                        <code className="font-mono text-sm break-all block">
                                          {JSON.stringify(result.actual, null, 2)}
                                        </code>
                                      </div>
                                    )}

                                    {/* Captured Logs (Stdout) */}
                                    {result.logs && result.logs.length > 0 && (
                                      <div className="p-3 rounded-lg bg-muted/30 border">
                                        <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                                          <Terminal className="w-3 h-3" />
                                          STDOUT
                                        </div>
                                        <div className="font-mono text-xs whitespace-pre-wrap break-words text-muted-foreground">
                                          {Array.isArray(result.logs) ? result.logs.join('\n') : result.logs}
                                        </div>
                                      </div>
                                    )}

                                    {result.status === 'error' && (
                                      <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                                        <div className="text-xs font-semibold text-destructive mb-2">ERROR</div>
                                        <code className="font-mono text-sm text-destructive whitespace-pre-wrap break-words block">
                                          {result.error}
                                        </code>
                                      </div>
                                    )}

                                    {result.time !== undefined && (
                                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        Runtime: {result.time}ms
                                      </div>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                  <FlaskConical className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                  <p className="text-sm mb-4">Run your code to see test results</p>
                                  <div className="p-3 rounded-lg bg-muted/30 border text-left max-w-md mx-auto">
                                    <div className="text-xs font-semibold text-muted-foreground mb-2">INPUT</div>
                                    <code className="font-mono text-sm break-all block">
                                      {JSON.stringify(testCase.input, null, 2)}
                                    </code>
                                  </div>
                                </div>
                              )}
                            </TabsContent>
                          );
                        })}
                      </ScrollArea>
                    </Tabs>
                  </div>

                  {/* Summary and Complexity - Fixed at bottom */}
                  {hasTestResults && (
                    <div className="border-t p-3 bg-background/50 shrink-0">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold">Summary:</span>
                        <span className={`font-mono ${
                          output.testResults.filter((r: any) => r.status === 'pass').length === output.testResults.length
                            ? 'text-green-600'
                            : 'text-muted-foreground'
                        }`}>
                          {output.testResults.filter((r: any) => r.status === 'pass').length} / {output.testResults.length} Passed
                        </span>
                      </div>

                      {/* Complexity Metrics */}
                      {algorithmMeta && (
                        <div className="mt-2 pt-2 border-t">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Time:</span>
                              <code className="font-mono font-semibold text-primary">{algorithmMeta.timeComplexity}</code>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Space:</span>
                              <code className="font-mono font-semibold text-primary">{algorithmMeta.spaceComplexity}</code>
                            </div>
                          </div>
                          {executionTime !== null && (
                            <div className="flex items-center justify-between mt-1 text-xs">
                              <span className="text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Total:
                              </span>
                              <code className="font-mono font-semibold text-green-600">{executionTime}ms</code>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          )}

          {/* Console/Raw Output Tab */}
          <TabsContent value="output" className="h-full m-0 p-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                {loading ? (
                  <div className="flex items-center text-muted-foreground">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Executing code...
                  </div>
                ) : output ? (
                  <>
                    {/* Compilation Error */}
                    {hasCompilationError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Compilation Error</AlertTitle>
                        <AlertDescription className="mt-2">
                          <pre className="font-mono text-xs whitespace-pre-wrap overflow-x-auto">
                            {output.compile_output}
                          </pre>
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Runtime/System Error */}
                    {hasRuntimeError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>{output.status?.description || 'Runtime Error'}</AlertTitle>
                        <AlertDescription className="mt-2">
                          {output.message && (
                            <div className="font-mono text-xs whitespace-pre-wrap mb-2 font-semibold">
                              {output.message}
                            </div>
                          )}
                          <pre className="font-mono text-xs whitespace-pre-wrap overflow-x-auto">
                            {output.stderr || 'An error occurred during execution'}
                          </pre>
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Standard Output */}
                    {(output.userOutput || output.stdout) && (
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                          <Terminal className="w-3 h-3" />
                          CONSOLE OUTPUT
                        </div>
                        <div className="p-3 rounded-md bg-muted/50 border font-mono text-xs whitespace-pre-wrap break-words">
                          {output.userOutput || output.stdout}
                        </div>
                        {hasTestResults && output.userOutput && (
                          <div className="text-xs text-muted-foreground mt-2 italic">
                            💡 Your console.log/print statements appear above. Test results are in the Test Cases tab.
                          </div>
                        )}
                        {hasTestResults && !output.userOutput && (
                          <div className="text-xs text-muted-foreground mt-2 italic">
                            💡 No console output from your code. Test results are in the Test Cases tab.
                          </div>
                        )}
                        {/* If we have stdout but it contains markers and we didn't extract userOutput (e.g. because of error), warn user */}
                        {!output.userOutput && output.stdout && output.stdout.includes('___TEST_RESULTS_START___') && (
                           <div className="text-xs text-muted-foreground mt-2 italic">
                            (Raw output shown because test results could not be fully parsed)
                          </div>
                        )}
                      </div>
                    )}

                    {/* Standard Error (if not already shown) */}
                    {output.stderr && !hasRuntimeError && (
                      <div>
                        <div className="text-xs font-semibold text-destructive mb-2">STDERR</div>
                        <div className="p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/20 font-mono text-xs whitespace-pre-wrap break-words">
                          {output.stderr}
                        </div>
                      </div>
                    )}

                    {/* Execution Stats */}
                    {(output.time || output.memory) && (
                      <div className="flex gap-4 text-xs text-muted-foreground pt-2 border-t">
                        {output.time && <div>⏱️ Time: {output.time}s</div>}
                        {output.memory && <div>💾 Memory: {output.memory}KB</div>}
                      </div>
                    )}

                    {/* No output message */}
                    {!output.stdout && !output.stderr && !hasCompilationError && !hasRuntimeError && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Terminal className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No console output</p>
                        <p className="text-xs mt-1">Add console.log() statements to see output here</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Terminal className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Run the code to see output...</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
