import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import type { editor as MonacoEditor } from 'monaco-editor';

export const PalindromicSubstringsVisualization = () => {
  const steps = [
    { s: "aaa", center: -1, count: 0, message: "Initialize: count=0", highlightedLines: [2] },
    { s: "aaa", center: 0, count: 1, message: "i=0: Found 'a', count=1", highlightedLines: [6] },
    { s: "aaa", center: 0, count: 2, message: "Even: Found 'aa', count=2", highlightedLines: [6] },
    { s: "aaa", center: 1, count: 4, message: "i=1: Found 'a' and 'aaa', count=4", highlightedLines: [6] },
    { s: "aaa", center: 1, count: 5, message: "Even: Found 'aa', count=5", highlightedLines: [6] },
    { s: "aaa", center: 2, count: 6, message: "i=2: Found 'a', count=6. Complete!", highlightedLines: [17] }
  ];

  const [idx, setIdx] = useState(0);
  const step = steps[idx];
  const ref = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const monaco = useRef<typeof import('monaco-editor') | null>(null);

  useEffect(() => {
    if (ref.current && monaco.current) {
      ref.current.createDecorationsCollection(step.highlightedLines.map(l => ({ range: new monaco.current!.Range(l, 1, l, 1), options: { isWholeLine: true, className: 'highlighted-line' } })));
    }
  }, [idx]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button onClick={() => setIdx(0)} variant="outline" size="sm"><RotateCcw className="h-4 w-4" /></Button>
          <Button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0} variant="outline" size="sm"><SkipBack className="h-4 w-4" /></Button>
          <Button onClick={() => setIdx(Math.min(steps.length - 1, idx + 1))} disabled={idx === steps.length - 1} variant="outline" size="sm"><SkipForward className="h-4 w-4" /></Button>
        </div>
        <span className="text-sm text-muted-foreground">Step {idx + 1} / {steps.length}</span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex gap-2 mb-4">
            {step.s.split('').map((c, i) => <motion.div key={i} animate={{ scale: i === step.center ? 1.2 : 1 }} className={`w-12 h-12 flex items-center justify-center rounded font-mono font-bold border-2 ${i === step.center ? 'bg-primary/20 border-primary' : 'bg-muted/50'}`}>{c}</motion.div>)}
          </div>
          <div className="p-4 bg-green-500/10 rounded"><p className="text-3xl font-bold text-green-600">{step.count}</p></div>
          <Card className="p-4 mt-4 bg-primary/5"><p className="text-sm">{step.message}</p></Card>
        </Card>

        <Card className="p-4"><div className="h-[500px]"><Editor height="100%" defaultLanguage="typescript" value={`function countSubstrings(s: string): number {\n  let count = 0;\n  \n  function expand(left: number, right: number): void {\n    while (left >= 0 && right < s.length && s[left] === s[right]) {\n      count++;\n      left--;\n      right++;\n    }\n  }\n  \n  for (let i = 0; i < s.length; i++) {\n    expand(i, i);\n    expand(i, i + 1);\n  }\n  \n  return count;\n}`} theme="vs-dark" options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }} onMount={(e, m) => { ref.current = e; monaco.current = m; }} /></div></Card>
      </div>

      <style>{`.highlighted-line { background: rgba(59, 130, 246, 0.15); border-left: 3px solid rgb(59, 130, 246); }`}</style>
    </div>
  );
};