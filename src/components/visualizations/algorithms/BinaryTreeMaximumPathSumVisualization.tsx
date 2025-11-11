import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';
import type { editor as MonacoEditor } from 'monaco-editor';

export const BinaryTreeMaximumPathSumVisualization = () => {
  const code = `function maxPathSum(root: TreeNode | null): number {
  let maxSum = -Infinity;
  function dfs(node: TreeNode | null): number {
    if (node === null) return 0;
    const leftGain = Math.max(dfs(node.left), 0);
    const rightGain = Math.max(dfs(node.right), 0);
    const currentSum = node.val + leftGain + rightGain;
    maxSum = Math.max(maxSum, currentSum);
    return node.val + Math.max(leftGain, rightGain);
  }
  dfs(root);
  return maxSum;
}`;

  const steps = [
    { currentNode: -10, maxSum: -Infinity, message: "Start DFS from root", highlightedLines: [2], stackDepth: 1 },
    { currentNode: 9, maxSum: 9, message: "Node 9: maxSum=9", highlightedLines: [8], stackDepth: 2 },
    { currentNode: 20, maxSum: 42, message: "Node 20: path 15+20+7=42!", highlightedLines: [8], stackDepth: 2 },
    { currentNode: -10, maxSum: 42, message: "Complete! Max=42 ✓", highlightedLines: [12], stackDepth: 0 }
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
      <div className="grid grid-cols-2 gap-6"><Card className="p-6"><VariablePanel variables={{ currentNode: step.currentNode, maxSum: step.maxSum, stackDepth: step.stackDepth }} /><Card className="p-4 mt-4 bg-primary/5"><p className="text-sm">{step.message}</p></Card></Card><Card className="p-4"><div className="h-[700px]"><Editor height="100%" defaultLanguage="typescript" value={code} theme="vs-dark" options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }} onMount={(e, m) => { ref.current = e; monaco.current = m; }} /></div></Card></div>
      <style>{`.highlighted-line-purple { background: rgba(168, 85, 247, 0.15); border-left: 3px solid rgb(168, 85, 247); }`}</style>
    </div>
  );
};
