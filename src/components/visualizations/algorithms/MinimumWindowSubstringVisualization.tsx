import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';

interface Step { s: string; t: string; left: number; right: number; result: string; message: string; highlightedLines: number[]; }

export const MinimumWindowSubstringVisualization = () => {
  const code = `function minWindow(s: string, t: string): string {
  const tCount: Record<string, number> = {};
  for (const c of t) tCount[c] = (tCount[c] || 0) + 1;
  
  let left = 0, have = 0, need = Object.keys(tCount).length;
  const window: Record<string, number> = {};
  let result = "";
  
  for (let right = 0; right < s.length; right++) {
    window[s[right]] = (window[s[right]] || 0) + 1;
    if (s[right] in tCount && window[s[right]] === tCount[s[right]]) have++;
    
    while (have === need) {
      if (!result || right - left + 1 < result.length) result = s.substring(left, right + 1);
      window[s[left]]--;
      if (s[left] in tCount && window[s[left]] < tCount[s[left]]) have--;
      left++;
    }
  }
  return result;
}`;

  const steps: Step[] = [
    { s: "ADOBECODEBANC", t: "ABC", left: 0, right: -1, result: "", message: "Find minimum window containing all chars of t='ABC'", highlightedLines: [2, 3, 5] },
    { s: "ADOBECODEBANC", t: "ABC", left: 0, right: 5, result: "ADOBEC", message: "Found all chars at right=5, window='ADOBEC' (len=6)", highlightedLines: [14] },
    { s: "ADOBECODEBANC", t: "ABC", left: 9, right: 12, result: "BANC", message: "Found smaller window='BANC' (len=4)!", highlightedLines: [14] }
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
        <Card className="p-6"><h3 className="mb-4">Target: "{currentStep.t}"</h3><div className="flex gap-1 mb-4">{currentStep.s.split('').map((c, i) => <motion.div key={i} className={`w-10 h-10 flex items-center justify-center rounded font-mono border-2 ${i >= currentStep.left && i <= currentStep.right && currentStep.right >= 0 ? 'bg-primary/20 border-primary' : 'bg-muted/50 border-border'}`}>{c}</motion.div>)}</div>{currentStep.result && <Card className="p-3 bg-green-500/10"><p className="font-bold text-green-600">Result: "{currentStep.result}"</p></Card>}<Card className="p-4 mt-4 bg-primary/5"><p className="text-sm">{currentStep.message}</p></Card></Card>
        <Card className="p-4 overflow-hidden"><div className="h-[600px]"><Editor height="100%" defaultLanguage="typescript" value={code} theme="vs-dark" options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }} onMount={(editor, monaco) => { editor.createDecorationsCollection(currentStep.highlightedLines.map(line => ({ range: new monaco.Range(line, 1, line, 1), options: { isWholeLine: true, className: 'highlighted-line' } }))); }} /></div></Card>
      </div>
      <style>{`.highlighted-line { background: rgba(59, 130, 246, 0.15); border-left: 3px solid rgb(59, 130, 246); }`}</style>
    </div>
  );
};
