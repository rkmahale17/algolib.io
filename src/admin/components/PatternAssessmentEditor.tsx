import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Algorithm } from '@/types/algorithm';
import { supabase } from "@/integrations/supabase/client";

interface PatternAssessmentEditorProps {
  hasPatternGuess: boolean;
  setHasPatternGuess: (val: boolean) => void;
  patternExplanations: Record<string, string>;
  setPatternExplanations: (val: Record<string, string>) => void;
  algorithmData: Partial<Algorithm>; // We pass current form data so AI can read it
}

export function PatternAssessmentEditor({
  hasPatternGuess,
  setHasPatternGuess,
  patternExplanations,
  setPatternExplanations,
  algorithmData,
}: PatternAssessmentEditorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [explanationsText, setExplanationsText] = useState(
    JSON.stringify(patternExplanations, null, 2)
  );

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setExplanationsText(e.target.value);
    try {
      const parsed = JSON.parse(e.target.value);
      setPatternExplanations(parsed);
    } catch (err) {
      // Don't update state if invalid JSON, just let them type
    }
  };

  const handleGenerate = async () => {
    if (!algorithmData.description) {
      toast.error("Algorithm description is required to generate explanations.");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-algorithm", {
        body: {
          target: "pattern_explanations",
          title: algorithmData.title || algorithmData.name,
          description: algorithmData.description,
          categories: algorithmData.categories || [],
        }
      });

      if (error) {
        throw error;
      }

      if (data && data.explanations) {
        setPatternExplanations(data.explanations);
        setExplanationsText(JSON.stringify(data.explanations, null, 2));
        toast.success("Explanations generated successfully.");
      } else if (data) {
        // Fallback if the function returns the direct JSON
        setPatternExplanations(data);
        setExplanationsText(JSON.stringify(data, null, 2));
        toast.success("Explanations generated successfully.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error generating pattern explanations.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pattern Assessment Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="pattern-guess-toggle" className="text-base font-semibold">
                Enable Pattern Guess Assessment
              </Label>
              <p className="text-sm text-muted-foreground">
                Turn this on to release the "Guess the Pattern" assessment mode for this problem.
              </p>
            </div>
            <Switch
              id="pattern-guess-toggle"
              checked={hasPatternGuess}
              onCheckedChange={setHasPatternGuess}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pattern Explanations Data</CardTitle>
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            size="sm"
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            AI Generate
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-amber-500/10 border border-amber-500/20 p-3 flex gap-3 text-amber-700 dark:text-amber-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div className="text-sm leading-relaxed">
              <p className="font-semibold mb-1">Required JSON Structure:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Include keys for specific patterns (e.g., "Two Pointers", "Sliding Window")</li>
                <li>Include a "General" or "Intuition" key for the overall problem logic.</li>
                <li>Explanations can include HTML/Markdown for rich formatting.</li>
              </ul>
            </div>
          </div>

          <Textarea 
            value={explanationsText}
            onChange={handleTextChange}
            className="font-mono text-sm min-h-[400px]"
            placeholder={'{\n  "Two Pointers": "Explanation..."\n}'}
          />
        </CardContent>
      </Card>
    </div>
  );
}
