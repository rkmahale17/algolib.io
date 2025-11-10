import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';
import type { editor as MonacoEditor } from 'monaco-editor';

interface Step {
  s: string;
  center: number;
  left: number;
  right: number;
  longestPalindrome: string;
  longestStart: number;
  longestLen: number;
  message: string;
  highlightedLines: number[];
}

export const LongestPalindromicSubstringVisualization = () => {
  const code = `function longestPalindrome(s: string): string {
  let start = 0, maxLen = 0;
  
  function expand(left: number, right: number): void {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      const len = right - left + 1;
      if (len > maxLen) {
        maxLen = len;
        start = left;
      }
      left--;
      right++;
    }
  }
  
  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  
  return s.substring(start, start + maxLen);
}`;

  const steps: Step[] = [
    { s: "babad", center: -1, left: -1, right: -1, longestPalindrome: "", longestStart: 0, longestLen: 0, message: "Initialize: start=0, maxLen=0", highlightedLines: [2] },
    { s: "babad", center: 0, left: 0, right: 0, longestPalindrome: "b", longestStart: 0, longestLen: 1, message: "i=0: Expand around 'b'. Found 'b' (len=1)", highlightedLines: [16] },
    { s: "babad", center: 1, left: 0, right: 2, longestPalindrome: "bab", longestStart: 0, longestLen: 3, message: "i=1: s[0]='b'==s[2]='b'. Found 'bab' (len=3)!", highlightedLines: [6] },
    { s: "babad", center: 2, left: 1, right: 3, longestPalindrome: "bab", longestStart: 0, longestLen: 3, message: "i=2: Found 'aba' (len=3), not longer", highlightedLines: [6] },
    { s: "babad", center: -1, left: -1, right: -1, longestPalindrome: "bab", longestStart: 0, longestLen: 3, message: "Complete! Return 'bab'", highlightedLines: [20] }
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)];
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof import('monaco-editor') | null>(null);

  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      editorRef.current.createDecorationsCollection(currentStep.highlightedLines.map(line => ({ range: new monacoRef.current!.Range(line, 1, line, 1), options: { isWholeLine: true, className: 'highlighted-line' } })));
    }
  }, [currentStepIndex]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <Button onClick={() => setCurrentStepIndex(0)} variant="outline" size="sm"><RotateCcw className="h-4 w-4" /></Button>
          <Button onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))} disabled={currentStepIndex === 0} variant="outline" size="sm"><SkipBack className="h-4 w-4" /></Button>
          <Button onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))} disabled={currentStepIndex === steps.length - 1} variant="outline" size="sm"><SkipForward className="h-4 w-4" /></Button>
        </div>
        <span className="text-sm text-muted-foreground">Step {currentStepIndex + 1} of {steps.length}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">String: "{currentStep.s}"</h3>
          <div className="flex gap-2 mb-6">
            {currentStep.s.split('').map((char, idx) => (
              <motion.div key={idx} animate={{ scale: idx === currentStep.center ? 1.2 : 1 }} className={`w-12 h-12 flex items-center justify-center rounded font-mono font-bold border-2 ${idx === currentStep.center ? 'bg-yellow-500/20 border-yellow-500 ring-2 ring-yellow-500' : idx >= currentStep.left && idx <= currentStep.right && currentStep.left >= 0 ? 'bg-primary/20 border-primary' : 'bg-muted/50 border-border'}`}>{char}</motion.div>
            ))}
          </div>

          {currentStep.longestPalindrome && (
            <motion.div initial={{ y: -10 }} animate={{ y: 0 }} className="p-3 bg-green-500/10 rounded border border-green-500/20 mb-4">
              <p className="text-sm text-green-600"><span className="font-semibold">Longest:</span> "{currentStep.longestPalindrome}" (len={currentStep.longestLen})</p>
            </motion.div>
          )}

          <VariablePanel variables={{ center: currentStep.center, left: currentStep.left, right: currentStep.right, maxLen: currentStep.longestLen }} />
          <Card className="p-4 mt-4 bg-primary/5 border-primary/20"><p className="text-sm">{currentStep.message}</p></Card>
        </Card>

        <Card className="p-4"><div className="h-[700px]"><Editor height="100%" defaultLanguage="typescript" value={code} theme="vs-dark" options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }} onMount={(editor, monaco) => { editorRef.current = editor; monacoRef.current = monaco; }} /></div></Card>
      </div>

      <style>{`.highlighted-line { background: rgba(59, 130, 246, 0.15); border-left: 3px solid rgb(59, 130, 246); }`}</style>
    </div>
  );
};