import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';
import type { editor as MonacoEditor } from 'monaco-editor';

interface Step {
  currentNode: number | null;
  k: number;
  count: number;
  visited: number[];
  found: boolean;
  result: number | null;
  message: string;
  highlightedLines: number[];
  stackDepth: number;
}

export const KthSmallestInBSTVisualization = () => {
  const code = `function kthSmallest(root: TreeNode | null, k: number): number {
  let count = 0;
  let result = 0;
  function inorder(node: TreeNode | null): void {
    if (node === null) return;
    inorder(node.left);
    count++;
    if (count === k) {
      result = node.val;
      return;
    }
    inorder(node.right);
  }
  inorder(root);
  return result;
}`;

  const steps: Step[] = [
    { currentNode: 3, k: 1, count: 0, visited: [], found: false, result: null, message: "Start: Find 1st smallest", highlightedLines: [2], stackDepth: 0 },
    { currentNode: 1, k: 1, count: 0, visited: [], found: false, result: null, message: "Go left to node 1", highlightedLines: [6], stackDepth: 2 },
    { currentNode: 1, k: 1, count: 1, visited: [1], found: true, result: 1, message: "Visit 1: count=1=k. Found! ✓", highlightedLines: [8], stackDepth: 2 },
    { currentNode: 3, k: 1, count: 1, visited: [1], found: true, result: 1, message: "Complete! Result=1", highlightedLines: [15], stackDepth: 0 }
  ];

  const [idx, setIdx] = useState(0);
  const step = steps[idx];
  const ref = useRef<any>(null);
  const monaco = useRef<any>(null);

  useEffect(() => {
    if (ref.current && monaco.current) {
      ref.current.createDecorationsCollection(step.highlightedLines.map(l => ({ range: new monaco.current!.Range(l, 1, l, 1), options: { isWholeLine: true, className: 'highlighted-line-purple' } })));
    }
  }, [idx]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between"><div className="flex gap-2"><Button onClick={() => setIdx(0)} variant="outline" size="sm"><RotateCcw className="h-4 w-4" /></Button><Button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0} variant="outline" size="sm"><SkipBack className="h-4 w-4" /></Button><Button onClick={() => setIdx(Math.min(steps.length - 1, idx + 1))} disabled={idx === steps.length - 1} variant="outline" size="sm"><SkipForward className="h-4 w-4" /></Button></div><span className="text-sm text-muted-foreground">Step {idx + 1} / {steps.length}</span></div>
      <div className="grid grid-cols-2 gap-6"><Card className="p-6"><motion.div key={step.count} className="p-4 bg-green-500/10 rounded mb-4"><p className="text-2xl font-bold text-green-600 text-center">Count: {step.count}</p></motion.div><VariablePanel variables={{ node: step.currentNode ?? 'null', k: step.k, count: step.count, result: step.result ?? 'null' }} /><Card className="p-4 mt-4 bg-primary/5"><p className="text-sm">{step.message}</p></Card></Card><Card className="p-4"><div className="h-[700px]"><Editor height="100%" defaultLanguage="typescript" value={code} theme="vs-dark" options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }} onMount={(e, m) => { ref.current = e; monaco.current = m; }} /></div></Card></div>
      <style>{`.highlighted-line-purple { background: rgba(168, 85, 247, 0.15); border-left: 3px solid rgb(168, 85, 247); }`}</style>
    </div>
  );
};
