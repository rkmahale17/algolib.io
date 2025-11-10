import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  s: string;
  k: number;
  left: number;
  right: number;
  charCount: Record<string, number>;
  maxCount: number;
  maxLength: number;
  message: string;
  highlightedLines: number[];
}

export const LongestRepeatingCharacterReplacementVisualization = () => {
  const code = `function characterReplacement(s: string, k: number): number {
  let left = 0;
  let maxCount = 0;
  let maxLength = 0;
  const charCount: Record<string, number> = {};
  
  for (let right = 0; right < s.length; right++) {
    charCount[s[right]] = (charCount[s[right]] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[s[right]]);
    
    while (right - left + 1 - maxCount > k) {
      charCount[s[left]]--;
      left++;
    }
    
    maxLength = Math.max(maxLength, right - left + 1);
  }
  
  return maxLength;
}`;

  const steps: Step[] = [
    { s: "AABABBA", k: 1, left: 0, right: -1, charCount: {}, maxCount: 0, maxLength: 0, message: "Initialize: left=0, k=1", highlightedLines: [2, 3, 4, 5] },
    { s: "AABABBA", k: 1, left: 0, right: 0, charCount: { A: 1 }, maxCount: 1, maxLength: 1, message: "right=0: Add 'A', maxCount=1", highlightedLines: [8, 9] },
    { s: "AABABBA", k: 1, left: 0, right: 1, charCount: { A: 2 }, maxCount: 2, maxLength: 2, message: "right=1: Add 'A', maxCount=2", highlightedLines: [8, 9, 16] },
    { s: "AABABBA", k: 1, left: 0, right: 2, charCount: { A: 2, B: 1 }, maxCount: 2, maxLength: 3, message: "right=2: Add 'B', window='AAB' valid", highlightedLines: [8, 9, 16] },
    { s: "AABABBA", k: 1, left: 0, right: 4, charCount: { A: 3, B: 2 }, maxCount: 3, maxLength: 4, message: "right=4: Need 2 replacements, shrink window", highlightedLines: [11, 12, 13] },
    { s: "AABABBA", k: 1, left: 2, right: 6, charCount: { A: 2, B: 3 }, maxCount: 3, maxLength: 5, message: "Complete! Max length = 4", highlightedLines: [19] }
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button onClick={() => setCurrentStepIndex(0)} variant="outline" size="sm"><RotateCcw className="h-4 w-4" /></Button>
          <Button onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))} disabled={currentStepIndex === 0} variant="outline" size="sm"><SkipBack className="h-4 w-4" /></Button>
          <Button onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))} disabled={currentStepIndex === steps.length - 1} variant="outline" size="sm"><SkipForward className="h-4 w-4" /></Button>
        </div>
        <span className="text-sm text-muted-foreground">Step {currentStepIndex + 1} of {steps.length}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">String: "{currentStep.s}" (k={currentStep.k})</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {currentStep.s.split('').map((char, idx) => (
                <motion.div key={idx} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className={`w-12 h-12 flex items-center justify-center rounded font-mono font-bold text-lg border-2 ${idx >= currentStep.left && idx <= currentStep.right && currentStep.right >= 0 ? 'bg-primary/20 border-primary text-primary' : 'bg-muted/50 border-border'}`}>{char}</motion.div>
              ))}
            </div>
            <VariablePanel variables={{ left: currentStep.left, right: currentStep.right, maxCount: currentStep.maxCount, maxLength: currentStep.maxLength }} />
            <Card className="p-4 mt-4 bg-primary/5 border-primary/20"><p className="text-sm">{currentStep.message}</p></Card>
          </Card>
        </div>

        <Card className="p-4 overflow-hidden">
          <div className="h-[600px]">
            <Editor height="100%" defaultLanguage="typescript" value={code} theme="vs-dark" options={{ readOnly: true, minimap: { enabled: false }, scrollBeyondLastLine: false, fontSize: 13 }} onMount={(editor, monaco) => { editor.createDecorationsCollection(currentStep.highlightedLines.map(line => ({ range: new monaco.Range(line, 1, line, 1), options: { isWholeLine: true, className: 'highlighted-line' } }))); }} />
          </div>
        </Card>
      </div>
      <style>{`.highlighted-line { background: rgba(59, 130, 246, 0.15); border-left: 3px solid rgb(59, 130, 246); }`}</style>
    </div>
  );
};
