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
  min: number | null;
  max: number | null;
  isValid: boolean | null;
  message: string;
  highlightedLines: number[];
  stackDepth: number;
}

export const ValidateBSTVisualization = () => {
  const code = `function isValidBST(root: TreeNode | null): boolean {
  function validate(node: TreeNode | null, min: number | null, max: number | null): boolean {
    if (node === null) return true;
    if ((min !== null && node.val <= min) || (max !== null && node.val >= max)) return false;
    return validate(node.left, min, node.val) && validate(node.right, node.val, max);
  }
  return validate(root, null, null);
}`;

  const steps: Step[] = [
    { currentNode: 2, min: null, max: null, isValid: null, message: "Start: Validate BST", highlightedLines: [7], stackDepth: 0 },
    { currentNode: 2, min: null, max: null, isValid: null, message: "Check: null < 2 < null ✓", highlightedLines: [4], stackDepth: 1 },
    { currentNode: 1, min: null, max: 2, isValid: null, message: "Left: null < 1 < 2 ✓", highlightedLines: [5], stackDepth: 2 },
    { currentNode: 3, min: 2, max: null, isValid: null, message: "Right: 2 < 3 < null ✓", highlightedLines: [5], stackDepth: 2 },
    { currentNode: 2, min: null, max: null, isValid: true, message: "Complete! Valid BST ✓", highlightedLines: [7], stackDepth: 0 }
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
      <div className="grid grid-cols-2 gap-6"><Card className="p-6"><VariablePanel variables={{ node: step.currentNode ?? 'null', min: step.min === null ? '-∞' : step.min, max: step.max === null ? '+∞' : step.max, depth: step.stackDepth }} /><Card className="p-4 mt-4 bg-primary/5"><p className="text-sm">{step.message}</p></Card></Card><Card className="p-4"><div className="h-[700px]"><Editor height="100%" defaultLanguage="typescript" value={code} theme="vs-dark" options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }} onMount={(e, m) => { ref.current = e; monaco.current = m; }} /></div></Card></div>
      <style>{`.highlighted-line-purple { background: rgba(168, 85, 247, 0.15); border-left: 3px solid rgb(168, 85, 247); }`}</style>
    </div>
  );
};
