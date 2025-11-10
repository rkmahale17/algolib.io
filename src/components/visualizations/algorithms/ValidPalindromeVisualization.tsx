import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import Editor from '@monaco-editor/react';

interface Step { s: string; cleaned: string; left: number; right: number; isPalindrome?: boolean; message: string; highlightedLines: number[]; }

export const ValidPalindromeVisualization = () => {
  const code = `function isPalindrome(s: string): boolean {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = cleaned.length - 1;
  
  while (left < right) {
    if (cleaned[left] !== cleaned[right]) return false;
    left++;
    right--;
  }
  return true;
}`;

  const steps: Step[] = [
    { s: "A man, a plan, a canal: Panama", cleaned: "amanaplanacanalpanama", left: 0, right: 20, message: "Clean string & compare from both ends", highlightedLines: [2, 3] },
    { s: "A man, a plan, a canal: Panama", cleaned: "amanaplanacanalpanama", left: 5, right: 15, message: "left='p' vs right='p' ✓ Match", highlightedLines: [6] },
    { s: "A man, a plan, a canal: Panama", cleaned: "amanaplanacanalpanama", left: 10, right: 10, isPalindrome: true, message: "Pointers meet - Valid palindrome!", highlightedLines: [10] }
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
        <Card className="p-6"><p className="text-sm mb-4">"{currentStep.s}"</p><div className="flex flex-wrap gap-1">{currentStep.cleaned.split('').map((c, i) => <div key={i} className={`w-9 h-9 flex items-center justify-center rounded font-mono border-2 ${i === currentStep.left || i === currentStep.right ? 'bg-primary/20 border-primary ring-2 ring-primary' : 'bg-muted/50 border-border'}`}>{c}</div>)}</div>{currentStep.isPalindrome !== undefined && <Card className="p-4 mt-4 bg-green-500/10"><p className="font-bold text-green-600">✓ Valid Palindrome</p></Card>}<Card className="p-4 mt-4 bg-primary/5"><p className="text-sm">{currentStep.message}</p></Card></Card>
        <Card className="p-4 overflow-hidden"><div className="h-[600px]"><Editor height="100%" defaultLanguage="typescript" value={code} theme="vs-dark" options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }} onMount={(editor, monaco) => { editor.createDecorationsCollection(currentStep.highlightedLines.map(line => ({ range: new monaco.Range(line, 1, line, 1), options: { isWholeLine: true, className: 'highlighted-line' } }))); }} /></div></Card>
      </div>
      <style>{`.highlighted-line { background: rgba(59, 130, 246, 0.15); border-left: 3px solid rgb(59, 130, 246); }`}</style>
    </div>
  );
};
