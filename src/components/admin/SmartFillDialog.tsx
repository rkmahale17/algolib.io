
import { useState } from "react";
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
}

const FIELD_GROUPS = [
  { id: "basic", label: "Basic Info (Title, Category, Difficulty, etc.)", keys: ["title", "name", "category", "difficulty", "description", "serial_no", "list_type", "id"] },
  { id: "problem", label: "Problem Details (Statement, Steps, Use Cases, Tips, Table)", keys: ["explanation"] },
  { id: "code", label: "Code Implementations", keys: ["implementations"] },
  { id: "tests", label: "Test Cases & Schema", keys: ["test_cases", "input_schema"] },
  { id: "meta", label: "Metadata (Tags, Likes)", keys: ["metadata"] },
];

export function SmartFillDialog({ onFill }: SmartFillDialogProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("paste");
  
  // Paste Tab State
  const [input, setInput] = useState("");
  

  // Generate Tab State
  const [topic, setTopic] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const [generatorMode, setGeneratorMode] = useState<"problem" | "core">("problem");
  const [target, setTarget] = useState<"all" | "initial" | "enrichment">("all");
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
        body: { topic, referenceCode, mode: generatorMode, target },
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
      <DialogContent className="sm:max-w-[1200px] h-[90vh] flex flex-col">
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

            <TabsContent value="generate" className="h-full mt-0 flex flex-col gap-4">
               {/* Search Bar */}
               <div className="flex gap-2 items-end shrink-0">

                  <div className="flex-1 space-y-2">
                    <Label htmlFor="topic">Algorithm Name / LeetCode ID</Label>
                    <Input 
                        id="topic"
                        placeholder="e.g. Merge Sort, two-sum, 3Sum" 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <Label>Generation Mode</Label>
                    <div className="flex items-center gap-2 border rounded-md p-1 h-10 bg-muted/30">
                        <Button 
                            variant={generatorMode === "problem" ? "secondary" : "ghost"}
                            size="sm"
                            className="flex-1 h-8"
                            onClick={() => setGeneratorMode("problem")}
                        >
                            <FileCode className="w-4 h-4 mr-2" />
                            LeetCode
                        </Button>
                        <Button 
                            variant={generatorMode === "core" ? "secondary" : "ghost"} 
                            size="sm"
                            className="flex-1 h-8"
                            onClick={() => setGeneratorMode("core")}
                        >
                            <BookOpen className="w-4 h-4 mr-2" />
                            Core Algo
                        </Button>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                     <Label>Generation Strategy</Label>
                     <div className="flex items-center gap-1 border rounded-md p-1 h-10 bg-muted/30">
                        <Button
                             variant={target === "all" ? "secondary" : "ghost"}
                             size="sm"
                             className="flex-1 h-8 px-2 text-[10px] sm:text-xs"
                             onClick={() => setTarget("all")}
                             title="Generate Everything (Default)"
                        >
                             <Layers className="w-3 h-3 mr-1.5" />
                             Full
                        </Button>
                        <Button
                             variant={target === "initial" ? "secondary" : "ghost"}
                             size="sm"
                             className="flex-1 h-8 px-2 text-[10px] sm:text-xs"
                             onClick={() => setTarget("initial")}
                             title="Metadata + Optimized Solution Only"
                        >
                             <ListStart className="w-3 h-3 mr-1.5" />
                             Base
                        </Button>
                        <Button
                             variant={target === "enrichment" ? "secondary" : "ghost"}
                             size="sm"
                             className="flex-1 h-8 px-2 text-[10px] sm:text-xs"
                             onClick={() => setTarget("enrichment")}
                             title="Add Brute/Better + Table Only"
                        >
                             <ListPlus className="w-3 h-3 mr-1.5" />
                             Enrich
                        </Button>
                     </div>
                  </div>
                  <div className="flex-1 space-y-2">
                     <Label htmlFor="referenceCode">Reference Code (Optional)</Label>
                     <Textarea
                        id="referenceCode"
                        placeholder="Paste optimized code (Python/JS/etc) here. AI will use this logic for the 'optimize' approach."
                        value={referenceCode}
                        onChange={(e) => setReferenceCode(e.target.value)}
                        className="font-mono text-xs h-24 resize-y"
                     />
                  </div>
                  <Button onClick={handleGenerate} disabled={isGenerating} className="gap-2 min-w-[120px]">
                    {isGenerating ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Wand2 className="h-4 w-4" />
                            Generate
                        </>
                    )}
                  </Button>
               </div>

               {/* Results Area */}
               {generatedData ? (
                 <div className="flex-1 flex flex-col min-h-0 gap-4">
                    <div className="bg-muted/30 border rounded-md p-3">
                        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <CheckSquare className="h-4 w-4" />
                            Select Fields to Apply
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {FIELD_GROUPS.map(group => (
                                <div key={group.id} className="flex items-start space-x-2">
                                    <Checkbox 
                                        id={group.id} 
                                        checked={selectedGroups.includes(group.id)}
                                        onCheckedChange={() => toggleGroup(group.id)}
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <label
                                            htmlFor={group.id}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            {group.label}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 border rounded-md bg-muted/10 flex flex-col min-h-0">
                        <div className="p-2 border-b bg-muted/20 text-xs font-semibold text-muted-foreground flex justify-between items-center">
                             <span>Preview Generated JSON</span>
                             <span className="text-[10px] bg-background border px-1.5 py-0.5 rounded-full">
                                {generatedData.implementations?.[0]?.code?.length || 0} approaches
                             </span>
                        </div>
                        <ScrollArea className="flex-1">
                            <pre className="p-4 text-xs font-mono whitespace-pre-wrap text-muted-foreground">
                                {JSON.stringify(generatedData, null, 2)}
                            </pre>
                        </ScrollArea>
                    </div>
                 </div>
               ) : (
                 !isGenerating && (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 rounded-md border-dashed border">
                        <Wand2 className="h-8 w-8 mb-2 opacity-20" />
                        <p className="text-sm">Enter a topic (e.g. "Two Sum") and click Generate</p>
                        <p className="text-xs text-muted-foreground/60 mt-1 max-w-xs text-center">
                            AI will search for the exact LeetCode problem details and formatting.
                        </p>
                    </div>
                 )
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
