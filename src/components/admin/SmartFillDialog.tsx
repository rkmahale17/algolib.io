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
import { Sparkles, Wand2, Loader2, FileJson, Copy } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SmartFillDialogProps {
  onFill: (data: any) => void;
}

export function SmartFillDialog({ onFill }: SmartFillDialogProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("paste");
  
  // Paste Tab State
  const [input, setInput] = useState("");
  
  // Generate Tab State
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);

  const handleFill = (dataToFill: any = null) => {
    const data = dataToFill || (activeTab === "paste" ? parseAlgorithmData(input) : generatedData);
    
    if (!data) {
        toast.error("No data to fill");
        return;
    }

    try {
      // If we are parsing raw input (Paste tab), parse it first
      const finalData = (activeTab === "paste" && typeof data === 'string') 
        ? parseAlgorithmData(input) 
        : data;

      onFill(finalData);
      setOpen(false);
      setInput("");
      setGeneratedData(null);
      setTopic("");
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
        body: { topic },
      });

      if (error) throw error;

      console.log("Generated Data:", data);
      setGeneratedData(data);
      toast.success("Algorithm generated successfully! Review below.");
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
      <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col">
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
               <div className="flex gap-2 items-end">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="topic">Algorithm Name / Topic</Label>
                    <Input 
                        id="topic"
                        placeholder="e.g. Merge Sort, Dijkstra's Algorithm, 3Sum" 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
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

               {generatedData && (
                 <div className="flex-1 border rounded-md p-4 bg-muted/30 overflow-auto space-y-2">
                    <div className="flex items-center justify-between">
                         <h4 className="font-semibold text-sm flex items-center gap-2">
                            <FileJson className="h-4 w-4 text-green-500" />
                            Generated Result
                         </h4>
                         <span className="text-xs text-muted-foreground">{generatedData.implementations?.[0]?.code?.length || 0} approaches found</span>
                    </div>
                    <pre className="text-xs font-mono whitespace-pre-wrap text-muted-foreground">
                        {JSON.stringify(generatedData, null, 2)}
                    </pre>
                 </div>
               )}

                {!generatedData && !isGenerating && (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 rounded-md border-dashed border">
                        <Wand2 className="h-8 w-8 mb-2 opacity-20" />
                        <p className="text-sm">Enter a topic and click Generate</p>
                    </div>
                )}
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="mt-auto pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => handleFill(activeTab === 'generate' ? generatedData : null)} 
            disabled={activeTab === 'generate' ? !generatedData : !input.trim()}
          >
            Fill Form
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
