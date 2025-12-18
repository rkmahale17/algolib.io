import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, Play, Terminal, Trash2, StopCircle, Settings } from "lucide-react";
import { toast } from "sonner";
import axios from 'axios';
import { generateTestRunner } from '@/utils/testRunnerGenerator';
import { LANGUAGE_IDS } from '@/components/CodeRunner/constants';
import { Language } from '@/components/CodeRunner/LanguageSelector';

// Types
interface LogEntry {
  id: string;
  type: 'info' | 'success' | 'error' | 'warning';
  message: string;
  timestamp: string;
}

interface SimulationStats {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
}

const AdminSimulator: React.FC = () => {
  // State
  const [selectedAlgos, setSelectedAlgos] = useState<Set<string>>(new Set());
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [stopOnFail, setStopOnFail] = useState(false);
  const [simulationStats, setSimulationStats] = useState<SimulationStats>({ total: 0, passed: 0, failed: 0, skipped: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [approachFilter, setApproachFilter] = useState("optimize"); // Default to 'optimize'
  
  // Expanded Algo State
  const [expandedAlgoId, setExpandedAlgoId] = useState<string | null>(null);
  const [expandedAlgoDetails, setExpandedAlgoDetails] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const stopRequested = useRef(false);

  // Edit Approach State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingApproachName, setEditingApproachName] = useState("");
  const [editTarget, setEditTarget] = useState<{algoId: string, implIndex: number, codeIndex: number} | null>(null);
  
  // Fetch Algorithms List
  const { data: algorithms, isLoading: isLoadingAlgos } = useQuery({
    queryKey: ['admin-algorithms-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('algorithms')
        .select('id, title, category, difficulty, serial_no')
        .order('serial_no', { ascending: true })
        .limit(1000);
      if (error) throw error;
      return data;
    }
  });

  // Scroll to bottom of logs - DISABLED as per request
  // useEffect(() => {
  //   logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [logs]);

  // Helper: Add Log
  const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    setLogs(prev => [...prev, {
      id: crypto.randomUUID(),
      type,
      message,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  // Helper: Clear Logs
  const clearLogs = () => {
    setLogs([]);
    setSimulationStats({ total: 0, passed: 0, failed: 0, skipped: 0 });
  };

  // Toggle Selection
  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedAlgos);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedAlgos(newSet);
  };

  const toggleSelectAll = () => {
    if (!algorithms) return;
    if (selectedAlgos.size === algorithms.length) {
      setSelectedAlgos(new Set());
    } else {
      setSelectedAlgos(new Set(algorithms.map(a => a.id)));
    }
  };
  
  // Expand/Collapse Logic
  const handleExpand = async (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (expandedAlgoId === id) {
          setExpandedAlgoId(null);
          setExpandedAlgoDetails(null);
          return;
      }
      
      setExpandedAlgoId(id);
      setIsLoadingDetails(true);
      try {
          const { data, error } = await supabase
            .from('algorithms')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error) throw error;
          setExpandedAlgoDetails(data);
      } catch (err: any) {
          toast.error(`Failed to load details: ${err.message}`);
      } finally {
          setIsLoadingDetails(false);
      }
  };

  // --- Execution Logic ---

  const executeCode = async (code: string, language: Language, testCases: any[], schema: any[]) => {
    try {
      const fullCode = generateTestRunner(code, language, testCases, schema);
      const response = await axios.post('/api/execute', {
        language_id: LANGUAGE_IDS[language],
        source_code: fullCode,
        stdin: ""
      });
      return response.data;
    } catch (e: any) {
      return { stderr: e.message || "Execution Error" };
    }
  };
  
  // --- Approach Name Editing ---

  const handleEditApproachName = (algo: any, implIndex: number, codeIndex: number, currentName: string) => {
      setEditingApproachName(currentName);
      setEditTarget({ algoId: algo.id, implIndex, codeIndex });
      setIsEditDialogOpen(true);
  };

  const saveApproachName = async () => {
      if (!editTarget || !expandedAlgoDetails) return;

      try {
          // deep clone the implementations
          const newImpls = JSON.parse(JSON.stringify(expandedAlgoDetails.implementations));
          
          // update the name
          newImpls[editTarget.implIndex].code[editTarget.codeIndex].codeType = editingApproachName;

          // Optimistic update
          setExpandedAlgoDetails({ ...expandedAlgoDetails, implementations: newImpls });
          setIsEditDialogOpen(false);

          // Save to Supabase
          const { error } = await supabase
              .from('algorithms')
              .update({ implementations: newImpls })
              .eq('id', editTarget.algoId);

          if (error) throw error;
          
          toast.success("Approach name updated");
          
          // Refetch to ensure consistency? Not strictly needed with optimistic update
      } catch (e: any) {
          toast.error("Failed to update name: " + e.message);
      }
  };

  // Robust JSON Extractor for polluted stdout (Java/Cpp)
  const extractJsonObjects = (str: string): any[] => {
    const results: any[] = [];
    let currentIndex = 0;
    
    // We are looking for objects that strictly start with {"status":
    // This is the signature of our test runner output objects
    const startMarker = '{"status":';
    
    while (true) {
        const foundIndex = str.indexOf(startMarker, currentIndex);
        if (foundIndex === -1) break;
        
        // Attempt to balance braces to find the end of this object
        let braceCount = 0;
        let endIndex = -1;
        let inString = false;
        let escape = false;
        
        // Start scanning from the opening brace
        for (let i = foundIndex; i < str.length; i++) {
            const char = str[i];
            
            if (escape) {
                escape = false;
                continue;
            }
            
            if (char === '\\') {
                escape = true;
                continue;
            }
            
            if (char === '"') {
                inString = !inString;
                continue;
            }
            
            if (!inString) {
                if (char === '{') braceCount++;
                if (char === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        endIndex = i + 1;
                        break;
                    }
                }
            }
        }
        
        if (endIndex !== -1) {
            const jsonCandidate = str.substring(foundIndex, endIndex);
            try {
                const obj = JSON.parse(jsonCandidate);
                results.push(obj);
            } catch (e) {
                // Ignore malformed candidates
                console.warn("Found candidate but failed to parse:", jsonCandidate);
            }
            // Move past this object
            currentIndex = endIndex;
        } else {
            // Malformed or truncated, skip this marker to avoid infinite loops if it's just a loose string
            currentIndex = foundIndex + 1;
        }
    }
    return results;
  };

  const parseResult = (result: any) => {
     let passed = false;
     let errorMsg = "";
     let failedItems: any[] = [];
     
     if (result.stderr || result.compile_output) {
         errorMsg = result.stderr || result.compile_output;
     } else if (result.testResults) {
         // Direct testResults property if available
         failedItems = result.testResults.filter((r: any) => r.status && r.status !== 'pass');
         if (failedItems.length === 0) passed = true;
         else errorMsg = `Test cases failed: ${failedItems.length}`;
     } else if (result.stdout) {
         let json: any = null;
         
         // Try 1: Clean Parse with markers
         const startMarker = '___TEST_RESULTS_START___';
         const endMarker = '___TEST_RESULTS_END___';
         const startIdx = result.stdout.indexOf(startMarker);
         
         if (startIdx !== -1) {
             const jsonStr = result.stdout.substring(
                startIdx + startMarker.length, 
                result.stdout.indexOf(endMarker) !== -1 ? result.stdout.indexOf(endMarker) : undefined
             ).trim();
             try {
                 json = JSON.parse(jsonStr);
             } catch (e) {
                 // Fallback below
             }
         }
         
         // Try 2: Robust Extraction if clean parse failed or returned empty/invalid
         if (!json || !Array.isArray(json)) {
             json = extractJsonObjects(result.stdout);
         }

         if (Array.isArray(json) && json.length > 0) {
            failedItems = json.filter((r: any) => r.status && r.status !== 'pass');
            // If we have parsed results, we consider execution "successful" in terms of running
            // Now check if tests passed
            
            // Check for explicit error status in results
            const errorResult = json.find((r: any) => r.status === 'error');
            if (errorResult) {
                errorMsg = errorResult.error || "Runtime Error";
                passed = false;
            } else if (failedItems.length === 0) {
                passed = true;
            } else {
                errorMsg = `Test cases failed: ${failedItems.length}`;
            }
         } else {
             // If we still found nothing
             if (!errorMsg) errorMsg = "No valid test results found in output";
         }
     } else {
         errorMsg = "No output produced";
     }
     
     return { passed, errorMsg, failedItems };
  };

  // Run Specific Single Implementation
  const runIndividual = async (algo: any, lang: string, codeBlock: any) => {
      setIsRunning(true);
      addLog(`Running Individual: ${algo.title} [${lang} - ${codeBlock.codeType}]...`, 'info');
      
      try {
          const testCases = (algo.test_cases as any[])?.map((tc: any) => ({
             input: tc.input,
             expectedOutput: tc.expectedOutput || tc.output
          })) || [];
          
          if (testCases.length === 0) {
              addLog(`No test cases found`, 'warning');
              setIsRunning(false);
              return;
          }
          
          const result = await executeCode(
              codeBlock.code, 
              (lang as string).toLowerCase() as Language, 
              testCases, 
              (algo.input_schema as any[])
          );
          
          const { passed, errorMsg, failedItems } = parseResult(result);
          
          if (passed) {
             addLog(`PASS: ${algo.title} [${lang}/${codeBlock.codeType}]`, 'success');
             toast.success("Correct Answer!");
          } else {
             let detailedMsg = errorMsg;
             if (failedItems.length > 0) {
                 const f = failedItems[0];
                 if (f.expected !== undefined && f.actual !== undefined) {
                     detailedMsg += ` (Ex: ${JSON.stringify(f.expected)}, Act: ${JSON.stringify(f.actual)})`;
                 } else {
                     detailedMsg += ` (Raw: ${JSON.stringify(f)})`;
                 }
             }
             addLog(`FAIL: ${algo.title} [${lang}/${codeBlock.codeType}] - ${detailedMsg}`, 'error');
             toast.error("Code Failed");
          }
      } catch (e: any) {
          addLog(`Error: ${e.message}`, 'error');
      } finally {
          setIsRunning(false);
      }
  };

  const runSimulation = async () => {
    if (selectedAlgos.size === 0) {
      toast.error("No algorithms selected");
      return;
    }

    setIsRunning(true);
    stopRequested.current = false;
    clearLogs(); 
    addLog(`Starting simulation for ${selectedAlgos.size} algorithms (Filter: ${approachFilter || 'All'})...`, 'info');
    
    let stats = { total: 0, passed: 0, failed: 0, skipped: 0 };
    setSimulationStats(stats);

    for (const algoId of Array.from(selectedAlgos)) {
      if (stopRequested.current) {
         addLog("Simulation stopped by user.", 'warning');
         break;
      }
      if (stopOnFail && stats.failed > 0) {
        addLog("Stopping due to failure.", 'warning');
        break;
      }
      
      try {
        addLog(`Fetching details for ${algoId}...`, 'info');
        
        const { data: algo, error } = await supabase
          .from('algorithms')
          .select('*')
          .eq('id', algoId)
          .single();

        if (error) {
           addLog(`Fetch Error: ${error.message}`, 'error');
           stats.failed++; setSimulationStats({...stats}); continue;
        }

        if (!algo.implementations) {
           addLog(`No implementations.`, 'warning');
           stats.skipped++; setSimulationStats({...stats}); continue;
        }

        const testCases = (algo.test_cases as any[])?.map((tc: any) => ({
             input: tc.input,
             expectedOutput: tc.expectedOutput || tc.output
        })) || [];

        if (testCases.length === 0) {
            addLog(`No test cases.`, 'warning');
            stats.skipped++; setSimulationStats({...stats}); continue;
        }

        let ranAny = false;

        for (const impl of (algo.implementations as any[])) {
          if (stopRequested.current) break;
          const lang = (impl.lang as string).toLowerCase() as Language;
          if (!LANGUAGE_IDS[lang]) continue;

          // FILTER LOGIC
          const codeBlocks = impl.code.filter((c: any) => {
             if (c.codeType === 'starter') return false;
             if (approachFilter && approachFilter.trim() !== "") {
                 return c.codeType === approachFilter.trim();
             }
             return true; 
          });

          for (const block of codeBlocks) {
             if (stopRequested.current) break;
             addLog(`Running ${algo.title} [${lang}/${block.codeType}]...`, 'info');
             ranAny = true;

             const result = await executeCode(block.code, lang, testCases, (algo.input_schema as any[]));
             const { passed, errorMsg, failedItems } = parseResult(result);

             if (passed) {
                 addLog(`PASS: ${algo.title} [${lang}/${block.codeType}]`, 'success');
                 stats.passed++;
             } else {
                 let detailedMsg = errorMsg;
                  if (failedItems.length > 0) {
                      const f = failedItems[0];
                      // Use simpler JSON stringify to avoid huge logs
                      if (f.expected !== undefined && f.actual !== undefined) {
                          detailedMsg += ` (Ex: ${JSON.stringify(f.expected)}, Act: ${JSON.stringify(f.actual)})`;
                      } else {
                          detailedMsg += ` (Raw: ${JSON.stringify(f)})`;
                      }
                  }
                 addLog(`FAIL: ${algo.title} [${lang}/${block.codeType}] - ${detailedMsg}`, 'error');
                 stats.failed++;
                 if (stopOnFail) break; 
             }
             stats.total++;
             setSimulationStats({...stats});
          }
          if (stopOnFail && stats.failed > 0) break;
          if (stopRequested.current) break;
        }
        
        if (!ranAny) {
            addLog(`Skipped (No code matched '${approachFilter}')`, 'warning');
            stats.skipped++;
            setSimulationStats({...stats});
        }

      } catch (err: any) {
        addLog(`Error: ${err.message}`, 'error');
        stats.failed++;
        setSimulationStats({...stats});
      }
    }

    setIsRunning(false);
    if (!stopRequested.current) {
        addLog(`Simulation Complete. Passed: ${stats.passed}, Failed: ${stats.failed}`, 'info');
    }
  };

  const handleStop = () => {
    stopRequested.current = true;
    addLog("Stop requested...", 'warning');
  };
  
  const filteredAlgorithms = algorithms?.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-4rem)] p-6 gap-6 grid grid-cols-12 bg-background">
      
    {/* Sidebar: Algorithm List */}
      <Card className="col-span-4 flex flex-col h-full border-border/50 shadow-sm max-h-[calc(100vh-4rem)]">
        <CardHeader className="py-4 px-6 border-b">
           <CardTitle className="flex justify-between items-center text-lg">
             <span>Algorithms</span>
             <Badge variant="secondary">{selectedAlgos.size} selected</Badge>
           </CardTitle>
           <Input 
             placeholder="Search algorithms..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="mt-2 h-8"
           />
           <div className="flex gap-2 mt-2">
             <Button variant="ghost" size="sm" onClick={toggleSelectAll} className="h-6 px-2 text-xs">
                {selectedAlgos.size === algorithms?.length ? 'Deselect All' : 'Select All'}
             </Button>
           </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full">
                <div className="p-2 space-y-1">
                    {isLoadingAlgos ? (
                        <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
                    ) : (
                        filteredAlgorithms?.map(algo => (
                            <div key={algo.id} className="rounded-md border border-transparent hover:border-border/50 overflow-hidden transition-all">
                                <div 
                                    className={`
                                        flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer
                                        ${selectedAlgos.has(algo.id) ? 'bg-muted' : ''}
                                    `}
                                    onClick={() => toggleSelection(algo.id)}
                                >
                                    <Checkbox 
                                        checked={selectedAlgos.has(algo.id)} 
                                        onCheckedChange={() => toggleSelection(algo.id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <div className="flex-1 flex flex-col overflow-hidden">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground font-mono w-6 text-right">{algo.serial_no}</span>
                                            <span className="truncate font-medium text-sm">{algo.title}</span>
                                        </div>
                                        <div className="flex gap-2 pl-8">
                                            <span className="text-[10px] text-muted-foreground uppercase">{algo.difficulty}</span>
                                            <span className="text-[10px] text-muted-foreground truncate">{algo.category}</span>
                                        </div>
                                    </div>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-6 w-6 p-0"
                                        onClick={(e) => handleExpand(algo.id, e)}
                                    >
                                        <Play className={`w-3 h-3 transition-transform ${expandedAlgoId === algo.id ? 'rotate-90' : ''}`} />
                                    </Button>
                                </div>
                                
                                {/* Expanded Details */}
                                {expandedAlgoId === algo.id && (
                                    <div className="bg-muted/30 border-t p-2 pl-8 text-xs space-y-2">
                                        {isLoadingDetails ? (
                                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                        ) : (expandedAlgoDetails?.implementations as any[])?.length > 0 ? (
                                            (expandedAlgoDetails.implementations as any[]).map((impl: any, implIdx: number) => (
                                                <div key={impl.lang} className="space-y-1">
                                                    <div className="font-semibold text-muted-foreground uppercase text-[10px]">{impl.lang}</div>
                                                    <div className="grid gap-1">
                                                        {impl.code.map((c: any, codeIdx: number) => (
                                                            c.codeType !== 'starter' && (
                                                                <div key={c.codeType} className="flex justify-between items-center bg-background rounded px-2 py-1 border">
                                                                    <div className="flex items-center gap-2">
                                                                        <span>{c.codeType}</span>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-4 w-4"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleEditApproachName(expandedAlgoDetails, implIdx, codeIdx, c.codeType);
                                                                            }}
                                                                        >
                                                                            <Settings className="w-3 h-3" />
                                                                        </Button>
                                                                    </div>
                                                                    <Button 
                                                                       size="sm" 
                                                                       variant="outline" 
                                                                       className="h-5 text-[10px] px-2"
                                                                       onClick={(e) => { e.stopPropagation(); runIndividual(expandedAlgoDetails, impl.lang, c); }}
                                                                       disabled={isRunning}
                                                                    >
                                                                        Run
                                                                    </Button>
                                                                </div>
                                                            )
                                                        ))}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-muted-foreground">No implementations</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </CardContent>
      </Card>

      {/* Main Content: Controls & Logs */}
      <Card className="col-span-8 flex flex-col h-full border-border/50 shadow-sm overflow-hidden max-h-[80vh]">
         <CardHeader className="py-4 px-6 border-b bg-muted/20">
             <div className="flex flex-col gap-4">
                 <div className="flex justify-between items-center">
                     <CardTitle className="text-lg flex items-center gap-2">
                         <Terminal className="w-5 h-5" /> Simulator
                     </CardTitle>
                     
                     <div className="flex items-center gap-3">
                         <div className="flex items-center gap-2 bg-background p-1 rounded-md border">
                             <select 
                                 className="h-7 w-32 text-xs border-0 bg-transparent focus:ring-0 cursor-pointer"
                                 value={approachFilter}
                                 onChange={(e) => setApproachFilter(e.target.value)}
                             >
                                 <option value="">All Approaches</option>
                                 <option value="optimize">Optimize</option>
                                 <option value="brute-force">Brute Force</option>
                                 <option value="recursive">Recursive</option>
                                 <option value="iterative">Iterative</option>
                                 <option value="memoization">Memoization</option>
                                 <option value="two-pointer">Two Pointer</option>
                             </select>
                             <Input 
                                 placeholder="Custom..." 
                                 className="h-7 w-20 text-xs border-l rounded-none border-0 focus-visible:ring-0"
                                 value={approachFilter}
                                 onChange={(e) => setApproachFilter(e.target.value)}
                             />
                         </div>
                         <div className="flex items-center gap-2">
                             <span className="text-sm text-muted-foreground">Stop On Fail</span>
                             <Switch 
                                checked={stopOnFail}
                                onCheckedChange={setStopOnFail}
                             />
                         </div>
                     </div>
                 </div>
                 
                 <div className="flex justify-between items-center">
                     <div className="flex gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                            <span className="text-muted-foreground">Total: <span className="text-foreground font-mono">{simulationStats.total}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-muted-foreground">Passed: <span className="text-foreground font-mono">{simulationStats.passed}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span className="text-muted-foreground">Failed: <span className="text-foreground font-mono">{simulationStats.failed}</span></span>
                        </div>
                     </div>
                     
                     <div className="flex gap-2">
                         <Button 
                            variant="outline" 
                            size="sm"
                            onClick={clearLogs}
                            disabled={isRunning}
                         >
                            <Trash2 className="w-4 h-4 mr-2" /> Clear Logs
                         </Button>
                         <Button 
                            size="sm"
                            onClick={runSimulation}
                            disabled={isRunning || selectedAlgos.size === 0}
                            className={isRunning ? "hidden" : ""}
                         >
                            <Play className="w-4 h-4 mr-2" />
                            {approachFilter ? `Run '${approachFilter}'` : 'Run All'}
                         </Button>
                         
                         {isRunning && (
                             <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={handleStop}
                             >
                                 <StopCircle className="w-4 h-4 mr-2" /> Stop
                             </Button>
                         )}
                     </div>
                 </div>
             </div>
         </CardHeader>
         
         <CardContent className="flex-1 p-0 bg-black text-green-400 font-mono text-xs overflow-hidden relative">
             <ScrollArea className="h-full w-full p-4">
                 {logs.length === 0 && (
                     <div className="absolute inset-0 flex items-center justify-center text-muted-foreground opacity-20 pointer-events-none">
                         <Terminal className="w-16 h-16 mb-2" />
                         <span>Ready to simulate</span>
                     </div>
                 )}
                 <div className="space-y-1 h-full overflow-y-auto">
                     {logs.map((log) => (
                         <div key={log.id} className="flex gap-2 font-mono">
                             <span className="text-slate-600 select-none hidden sm:inline">[{log.timestamp}]</span>
                             <span className={`
                                 grow break-all
                                 ${log.type === 'error' ? 'text-red-500 font-bold' : ''}
                                 ${log.type === 'success' ? 'text-green-500' : ''}
                                 ${log.type === 'warning' ? 'text-yellow-500' : ''}
                                 ${log.type === 'info' ? 'text-slate-300' : ''}
                             `}>
                                 {log.type === 'success' && '✓ '}
                                 {log.type === 'error' && '✗ '}
                                 {log.message}
                             </span>
                         </div>
                     ))}
                     {/* Removed automatic scroll ref */}
                 </div>
             </ScrollArea>
         </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Approach Name</DialogTitle>
            <DialogDescription>
              Change the name of this approach. This will be reflected in the algorithm details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={editingApproachName}
                onChange={(e) => setEditingApproachName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveApproachName}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSimulator;
