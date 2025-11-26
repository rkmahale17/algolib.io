import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Terminal, FlaskConical, Clock, Zap } from "lucide-react";
import { Algorithm } from '@/data/algorithms';

interface OutputPanelProps {
  output: any | null;
  loading: boolean;
  stdin: string;
  onStdinChange: (value: string) => void;
  testCases?: Array<{ input: any[]; expectedOutput: any }>;
  executionTime?: number | null;
  algorithmMeta?: Algorithm | null;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  output,
  loading,
  testCases,
  executionTime,
  algorithmMeta
}) => {
  // Determine default tab based on presence of test cases
  const defaultTab = testCases && testCases.length > 0 ? "testcases" : "output";

  return (
    <div className="h-full flex flex-col bg-muted/10 border-t">
      <Tabs defaultValue={defaultTab} className="flex-1 flex flex-col">
        <div className="border-b px-4 bg-muted/30">
          <TabsList className="h-10">
            {testCases && testCases.length > 0 && (
              <TabsTrigger value="testcases" className="text-xs">
                <FlaskConical className="w-3 h-3 mr-2" />
                Test Results
              </TabsTrigger>
            )}
            <TabsTrigger value="output" className="text-xs">
              <Terminal className="w-3 h-3 mr-2" />
              Raw Output
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          {testCases && testCases.length > 0 && (
            <TabsContent value="testcases" className="h-full m-0 p-0">
               <ScrollArea className="h-full">
                <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                  {output && (
                     <div className={`p-4 rounded-lg border shadow-sm ${
                       // Simple check if output matches expected (this is a basic heuristic)
                       output.stdout?.trim() === JSON.stringify(testCases[0].expectedOutput) || 
                       output.stdout?.trim() === String(testCases[0].expectedOutput)
                         ? "bg-green-500/10 border-green-500/20" 
                         : "bg-destructive/10 border-destructive/20"
                     }`}>
                      <h4 className={`font-semibold mb-2 flex items-center gap-2 ${
                         output.stdout?.trim() === JSON.stringify(testCases[0].expectedOutput) || 
                         output.stdout?.trim() === String(testCases[0].expectedOutput)
                         ? "text-green-600" : "text-destructive"
                      }`}>
                        {output.stdout?.trim() === JSON.stringify(testCases[0].expectedOutput) || 
                         output.stdout?.trim() === String(testCases[0].expectedOutput)
                         ? "✓ Passed" : "✗ Failed"}
                      </h4>
                      
                      <div className="grid gap-2 text-sm mt-3">
                        <div className="grid grid-cols-[100px_1fr] gap-2">
                           <span className="text-muted-foreground">Your Output:</span>
                           <code className="font-mono break-all">{output.stdout?.trim() || "No output"}</code>
                        </div>
                        <div className="grid grid-cols-[100px_1fr] gap-2">
                           <span className="text-muted-foreground">Expected:</span>
                           <code className="font-mono break-all">{JSON.stringify(testCases[0].expectedOutput)}</code>
                        </div>
                      </div>
                     </div>
                  )}

                  {/* Complexity Metrics */}
                  {algorithmMeta && (
                    <div className="p-4 rounded-lg border bg-muted/30">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Complexity Analysis
                      </h4>
                      <div className="grid gap-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Time Complexity:</span>
                          <code className="font-mono font-semibold text-primary">{algorithmMeta.timeComplexity}</code>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Space Complexity:</span>
                          <code className="font-mono font-semibold text-primary">{algorithmMeta.spaceComplexity}</code>
                        </div>
                        {executionTime !== null && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Runtime:
                            </span>
                            <code className="font-mono font-semibold text-green-600">{executionTime}ms</code>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <FlaskConical className="w-4 h-4 text-primary" />
                      Test Case Details
                    </h4>
                    <div className="grid gap-3 text-sm">
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Input</span>
                        <div className="bg-muted/50 px-3 py-2 rounded-md font-mono text-xs border">
                          {JSON.stringify(testCases[0].input)}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Expected Output</span>
                        <div className="bg-muted/50 px-3 py-2 rounded-md font-mono text-xs border">
                          {JSON.stringify(testCases[0].expectedOutput)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          )}

          <TabsContent value="output" className="h-full m-0 p-0">
            <ScrollArea className="h-full">
              <div className="p-4 font-mono text-sm max-h-[500px] overflow-y-auto">
                {loading ? (
                  <div className="flex items-center text-muted-foreground">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Executing code...
                  </div>
                ) : output ? (
                  <div className="space-y-4">
                    {output.status?.id !== 3 && output.status && (
                      <div className="p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
                        <div className="font-semibold mb-1">Status: {output.status?.description}</div>
                        {output.message && <div className="whitespace-pre-wrap">{output.message}</div>}
                        {output.stderr && <div className="whitespace-pre-wrap mt-2">{output.stderr}</div>}
                        {output.compile_output && <div className="whitespace-pre-wrap mt-2">{output.compile_output}</div>}
                      </div>
                    )}
                    
                    {output.stdout && (
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-2">STDOUT</div>
                        <div className="p-3 rounded-md bg-muted/50 border whitespace-pre-wrap break-words">
                          {output.stdout}
                        </div>
                      </div>
                    )}

                    {output.stderr && !output.status && (
                       <div>
                        <div className="text-xs font-semibold text-destructive mb-2">STDERR</div>
                        <div className="p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/20 whitespace-pre-wrap break-words">
                          {output.stderr}
                        </div>
                      </div>
                    )}

                    {output.time && output.memory && (
                      <div className="flex gap-4 text-xs text-muted-foreground pt-2 border-t">
                        <div>Time: {output.time}s</div>
                        <div>Memory: {output.memory}KB</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-muted-foreground italic">
                    Run the code to see output...
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
