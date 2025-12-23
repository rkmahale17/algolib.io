
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Wand2, Loader2, FileJson, Copy, CheckSquare, Square, FileCode, BookOpen, Layers, ListStart, ListPlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SmartFillDialogProps {
  onFill: (data: any) => void;
  initialTopic?: string;
  existingApproaches?: string[];
}

const FIELD_GROUPS = [
  { id: "basic", label: "Basic Info (Title, Category, Difficulty, etc.)", keys: ["title", "name", "category", "difficulty", "description", "serial_no", "list_type", "id"] },
  { id: "problem", label: "Problem Details (Statement, Steps, Use Cases, Tips, Table)", keys: ["explanation"] },
  { id: "code", label: "Code Implementations", keys: ["implementations"] },
  { id: "tests", label: "Test Cases & Schema", keys: ["test_cases", "input_schema"] },
  { id: "meta", label: "Metadata (Tags, Likes)", keys: ["metadata"] },
];

export function SmartFillDialog({ onFill, initialTopic = "", existingApproaches = [] }: SmartFillDialogProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("paste");
  
  // Paste Tab State
  const [input, setInput] = useState("");
  

  // Generate Tab State
  const [topic, setTopic] = useState(initialTopic);
  
  // Sync initialTopic to topic when it changes or dialog opens
  useEffect(() => {
    if (initialTopic) setTopic(initialTopic);
  }, [initialTopic, open]);

  const [referenceCode, setReferenceCode] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [generatorMode, setGeneratorMode] = useState<"problem" | "core">("problem");
  // Target: all=Full, add_approaches=New Only
  const [target, setTarget] = useState<"all" | "add_approaches">("all");
  const [approachCount, setApproachCount] = useState(1);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);
  
  // Selection State
  const [selectedGroups, setSelectedGroups] = useState<string[]>(FIELD_GROUPS.map(g => g.id));

  const toggleGroup = (groupId: string) => {
    setSelectedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleFill = (dataToFill: any = null) => {
    let data = dataToFill || (activeTab === "paste" ? parseAlgorithmData(input) : generatedData);
    
    if (!data) {
        toast.error("No data to fill");
        return;
    }

    try {
      // If we are parsing raw input (Paste tab), parse it first
      const rawData = (activeTab === "paste" && typeof data === 'string') 
        ? parseAlgorithmData(input) 
        : data;

      // Filter data based on selection if in Generate mode (or even paste mode if we want to apply it there too, 
      // but usually paste is "take all". Let's apply selection logic only if we showed the selection UI, which describes "generatedData").
      // For now, let's apply strict filtering if we have generatedData.
      
      let finalData = { ...rawData };
      
      if (generatedData) {
         finalData = {}; // Start empty and push selected
         FIELD_GROUPS.forEach(group => {
            if (selectedGroups.includes(group.id)) {
               group.keys.forEach(key => {
                  if (rawData[key] !== undefined) {
                     finalData[key] = rawData[key];
                  }
               });
            }
         });
      }

      onFill(finalData);
      setOpen(false);
      setInput("");
      setGeneratedData(null);
      setTopic("");
      setReferenceCode("");
      setUserPrompt("");
      // Reset selection
      setSelectedGroups(FIELD_GROUPS.map(g => g.id)); 
      toast.success("Form filled successfully!");
    } catch (error) {
       // Error handled in parseAlgorithmData or here
       toast.error("Failed to process data");
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    setIsGenerating(true);
    setGeneratedData(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-algorithm", {
        body: { 
            topic, 
            referenceCode, 
            userPrompt,
            mode: generatorMode, 
            target,
            approachCount: target === 'add_approaches' ? approachCount : undefined,
            existingApproaches: target === 'add_approaches' ? existingApproaches : []
        },
      });

      if (error) throw error;

      console.log("Generated Data:", data);
      setGeneratedData(data);
      // Ensure all selected by default on new generation
      setSelectedGroups(FIELD_GROUPS.map(g => g.id)); 
      toast.success("Algorithm generated! Please review and select fields.");
    } catch (error) {
      console.error("Generation Error:", error);
      toast.error("Failed to generate algorithm. Check console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 border-purple-200/20">
          <Sparkles className="h-4 w-4 text-purple-500" />
          Smart Fill
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1800px] h-[100vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Smart Fill Algorithm Data
          </DialogTitle>
          <DialogDescription>
            Automatically fill the form using existing data or generate it with AI.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="paste" className="gap-2">
                <Copy className="h-4 w-4" />
                Paste Data
            </TabsTrigger>
            <TabsTrigger value="generate" className="gap-2">
                <Wand2 className="h-4 w-4" />
                Generate with AI
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 min-h-0 py-4">
            <TabsContent value="paste" className="h-full mt-0">
                 <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste your JSON training data here..."
                    className="h-full font-mono text-xs resize-none"
                  />
            </TabsContent>

            <TabsContent value="generate" className="h-full mt-0 flex flex-col gap-6">
               
               {/* 1. Primary Action Section */}
               <div className="flex gap-4 items-end shrink-0">
                  <div className="flex-[2] space-y-2">
                    <Label htmlFor="topic" className="text-base font-semibold">Algorithm Topic</Label>
                    <Input 
                        id="topic"
                        placeholder="e.g. Merge Sort, two-sum, 3Sum" 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        className="h-12 text-lg px-4 shadow-sm"
                    />
                  </div>
                  <Button 
                    onClick={handleGenerate} 
                    disabled={isGenerating} 
                    size="lg"
                    className="h-12 px-8 min-w-[140px] shadow-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold"
                  >
                    {isGenerating ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Wand2 className="h-5 w-5 mr-2" />
                            Generate
                        </>
                    )}
                  </Button>
               </div>

               {/* 2. Configuration Section */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/20 border rounded-lg">
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-muted-foreground">
                        <FileCode className="w-4 h-4" />
                        Generation Mode
                    </Label>
                    <div className="flex items-center p-1 bg-muted/40 rounded-lg border">
                        <Button 
                            variant={generatorMode === "problem" ? "secondary" : "ghost"}
                            size="sm"
                            className="flex-1 shadow-none"
                            onClick={() => setGeneratorMode("problem")}
                        >
                            LeetCode Problem
                        </Button>
                        <Button 
                            variant={generatorMode === "core" ? "secondary" : "ghost"} 
                            size="sm"
                            className="flex-1 shadow-none"
                            onClick={() => setGeneratorMode("core")}
                        >
                            Core Algorithm
                        </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-muted-foreground">
                        <Layers className="w-4 h-4" />
                        Strategy
                    </Label>
                    <div className="flex gap-3">
                        <Select value={target} onValueChange={(val: any) => setTarget(val)}>
                            <SelectTrigger className="flex-1 h-9 bg-background">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Full Generation (Standard)</SelectItem>
                                <SelectItem value="add_approaches">Add More Approaches</SelectItem>
                            </SelectContent>
                        </Select>
                         
                        {target === 'add_approaches' && (
                             <div className="w-24 shrink-0">
                                <Input 
                                    type="number" 
                                    min={1} 
                                    max={3} 
                                    value={approachCount}
                                    onChange={(e) => setApproachCount(parseInt(e.target.value) || 1)}
                                    className="h-9 bg-background text-center"
                                />
                             </div>
                        )}
                    </div>
                  </div>
               </div>

               {/* 3. Context Section */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
                  <div className="space-y-2 flex flex-col h-full">
                     <Label htmlFor="userPrompt" className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                        User Instructions
                     </Label>
                     <Textarea
                        id="userPrompt"
                        placeholder="e.g. 'Use BFS approach', 'Explain time complexity trade-offs', 'Focus on recursive solution'..."
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                        className="font-mono text-xs flex-1 resize-none bg-background/50 focus:bg-background transition-colors"
                     />
                  </div>

                  <div className="space-y-2 flex flex-col h-full">
                     <Label htmlFor="referenceCode" className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                        Reference Code
                     </Label>
                     <Textarea
                        id="referenceCode"
                        placeholder="Paste optimized code here. The AI will adhere to this logic for the 'optimize' approach."
                        value={referenceCode}
                        onChange={(e) => setReferenceCode(e.target.value)}
                        className="font-mono text-xs flex-1 resize-none bg-background/50 focus:bg-background transition-colors"
                     />
                  </div>
               </div>

               {/* Results Area (Hidden until generated) */}
               {generatedData && (
                  <div className="mt-4 flex flex-col gap-4 border-t pt-4 animate-in slide-in-from-bottom-5 fade-in duration-300">
                     <div className="bg-green-50/50 dark:bg-green-950/10 border border-green-200/50 dark:border-green-800/50 rounded-md p-3">
                        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-green-700 dark:text-green-400">
                            <CheckSquare className="h-4 w-4" />
                            Select Fields to Apply
                        </h4>
                        <div className="flex flex-wrap gap-4">
                            {FIELD_GROUPS.map(group => (
                                <div key={group.id} className="flex items-center space-x-2 bg-background/80 px-2 py-1 rounded border shadow-sm">
                                    <Checkbox 
                                        id={group.id} 
                                        checked={selectedGroups.includes(group.id)}
                                        onCheckedChange={() => toggleGroup(group.id)}
                                    />
                                    <label
                                        htmlFor={group.id}
                                        className="text-xs font-medium cursor-pointer select-none"
                                    >
                                        {group.label.split('(')[0].trim()}
                                    </label>
                                </div>
                            ))}
                        </div>
                     </div>

                     <div className="border rounded-md bg-muted/30 p-2">
                        <div className="text-xs font-semibold text-muted-foreground mb-2 flex justify-between">
                             <span>Preview ({generatedData.implementations?.length || 0} implementations)</span>
                        </div>
                        <ScrollArea className="h-40 bg-background border rounded-md">
                            <pre className="p-3 text-[10px] font-mono whitespace-pre-wrap text-muted-foreground">
                                {JSON.stringify(generatedData, null, 2)}
                            </pre>
                        </ScrollArea>
                     </div>
                  </div>
               )}
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="pt-4 border-t mt-auto">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => handleFill(activeTab === 'generate' ? generatedData : null)} 
            disabled={activeTab === 'generate' ? !generatedData : !input.trim()}
            className="gap-2"
          >
            {activeTab === 'generate' ? (
                <>
                    <Sparkles className="h-4 w-4" />
                    Apply Selected ({selectedGroups.length})
                </>
            ) : (
                "Fill Form"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


// TODO: Refine this parser based on user's specific text format
function parseAlgorithmData(input: string): any {
  // 1. Try JSON parsing first
  try {
    const json = JSON.parse(input);
    
    // Handle array input - return first item if array
    if (Array.isArray(json)) {
        if (json.length === 0) throw new Error("Empty array provided");
        // If user pastes a list, we might want to support bulk import later, 
        // but for this form (single edit), we take the first one.
        toast.info("Array detected. Filling with the first item.");
        return json[0];
    }
    
    return json;
  } catch (e) {
    if ((e as Error).message.includes("Empty array")) throw e;

    // 2. If JSON fails, fall back to "Label: Value" regex parsing (placeholder logic)
    // Example format assumption:
    // Name: ...
    // Description: ...
    
    const lines = input.split('\n');
    const data: any = {};
    
    // Very basic mapping for now, will improve with real examples
    if (input.includes("Name:")) {
        // This is a placeholder for custom text parsing
        throw new Error("Custom text format parsing not yet implemented. Please provide JSON or example format.");
    }
    
    throw new Error("Invalid JSON format. Please paste valid JSON.");
  }
}
