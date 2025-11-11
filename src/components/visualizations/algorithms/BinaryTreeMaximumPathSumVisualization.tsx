import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';
import type { editor as MonacoEditor } from 'monaco-editor';

interface Step {
  currentNode: number | string;
  leftGain: number | string;
  rightGain: number | string;
  currentSum: number | string;
  maxSum: number | string;
  returnValue: number | string;
  message: string;
  highlightedLines: number[];
  stackDepth: number;
  phase: string;
}

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

  const steps: Step[] = [
    { currentNode: '-', leftGain: '-', rightGain: '-', currentSum: '-', maxSum: '-Infinity', returnValue: '-', message: "Initialize: maxSum = -Infinity", highlightedLines: [2], stackDepth: 0, phase: "init" },
    { currentNode: '-', leftGain: '-', rightGain: '-', currentSum: '-', maxSum: '-Infinity', returnValue: '-', message: "Call dfs(root) with node -10", highlightedLines: [16], stackDepth: 0, phase: "call" },
    
    { currentNode: -10, leftGain: '-', rightGain: '-', currentSum: '-', maxSum: '-Infinity', returnValue: '-', message: "Enter dfs(-10): Check if null", highlightedLines: [5], stackDepth: 1, phase: "enter" },
    { currentNode: -10, leftGain: '-', rightGain: '-', currentSum: '-', maxSum: '-Infinity', returnValue: '-', message: "Not null, compute leftGain = max(dfs(left), 0)", highlightedLines: [7], stackDepth: 1, phase: "compute_left" },
    { currentNode: -10, leftGain: '-', rightGain: '-', currentSum: '-', maxSum: '-Infinity', returnValue: '-', message: "Call dfs(node.left) → dfs(9)", highlightedLines: [7], stackDepth: 1, phase: "call_left" },
    
    { currentNode: 9, leftGain: '-', rightGain: '-', currentSum: '-', maxSum: '-Infinity', returnValue: '-', message: "Enter dfs(9): Check if null", highlightedLines: [5], stackDepth: 2, phase: "enter" },
    { currentNode: 9, leftGain: '-', rightGain: '-', currentSum: '-', maxSum: '-Infinity', returnValue: '-', message: "Not null, compute leftGain for node 9", highlightedLines: [7], stackDepth: 2, phase: "compute_left" },
    { currentNode: 9, leftGain: '-', rightGain: '-', currentSum: '-', maxSum: '-Infinity', returnValue: '-', message: "Call dfs(node.left) → dfs(null)", highlightedLines: [7], stackDepth: 2, phase: "call_left" },
    
    { currentNode: 'null', leftGain: '-', rightGain: '-', currentSum: '-', maxSum: '-Infinity', returnValue: 0, message: "dfs(null): Return 0", highlightedLines: [5], stackDepth: 3, phase: "return_null" },
    
    { currentNode: 9, leftGain: 0, rightGain: '-', currentSum: '-', maxSum: '-Infinity', returnValue: '-', message: "Back to node 9: leftGain = max(0, 0) = 0", highlightedLines: [7], stackDepth: 2, phase: "got_left" },
    { currentNode: 9, leftGain: 0, rightGain: '-', currentSum: '-', maxSum: '-Infinity', returnValue: '-', message: "Compute rightGain for node 9", highlightedLines: [8], stackDepth: 2, phase: "compute_right" },
    { currentNode: 9, leftGain: 0, rightGain: '-', currentSum: '-', maxSum: '-Infinity', returnValue: '-', message: "Call dfs(node.right) → dfs(null)", highlightedLines: [8], stackDepth: 2, phase: "call_right" },
    
    { currentNode: 'null', leftGain: '-', rightGain: '-', currentSum: '-', maxSum: '-Infinity', returnValue: 0, message: "dfs(null): Return 0", highlightedLines: [5], stackDepth: 3, phase: "return_null" },
    
    { currentNode: 9, leftGain: 0, rightGain: 0, currentSum: '-', maxSum: '-Infinity', returnValue: '-', message: "Back to node 9: rightGain = max(0, 0) = 0", highlightedLines: [8], stackDepth: 2, phase: "got_right" },
    { currentNode: 9, leftGain: 0, rightGain: 0, currentSum: 9, maxSum: '-Infinity', returnValue: '-', message: "currentSum = 9 + 0 + 0 = 9", highlightedLines: [10], stackDepth: 2, phase: "compute_sum" },
    { currentNode: 9, leftGain: 0, rightGain: 0, currentSum: 9, maxSum: 9, returnValue: '-', message: "maxSum = max(-∞, 9) = 9", highlightedLines: [11], stackDepth: 2, phase: "update_max" },
    { currentNode: 9, leftGain: 0, rightGain: 0, currentSum: 9, maxSum: 9, returnValue: 9, message: "Return 9 + max(0, 0) = 9", highlightedLines: [13], stackDepth: 2, phase: "return" },
    
    { currentNode: -10, leftGain: 9, rightGain: '-', currentSum: '-', maxSum: 9, returnValue: '-', message: "Back to node -10: leftGain = max(9, 0) = 9", highlightedLines: [7], stackDepth: 1, phase: "got_left" },
    { currentNode: -10, leftGain: 9, rightGain: '-', currentSum: '-', maxSum: 9, returnValue: '-', message: "Compute rightGain for node -10", highlightedLines: [8], stackDepth: 1, phase: "compute_right" },
    { currentNode: -10, leftGain: 9, rightGain: '-', currentSum: '-', maxSum: 9, returnValue: '-', message: "Call dfs(node.right) → dfs(20)", highlightedLines: [8], stackDepth: 1, phase: "call_right" },
    
    { currentNode: 20, leftGain: '-', rightGain: '-', currentSum: '-', maxSum: 9, returnValue: '-', message: "Enter dfs(20): Check if null", highlightedLines: [5], stackDepth: 2, phase: "enter" },
    { currentNode: 20, leftGain: '-', rightGain: '-', currentSum: '-', maxSum: 9, returnValue: '-', message: "Not null, compute leftGain for node 20", highlightedLines: [7], stackDepth: 2, phase: "compute_left" },
    { currentNode: 20, leftGain: '-', rightGain: '-', currentSum: '-', maxSum: 9, returnValue: '-', message: "Call dfs(node.left) → dfs(15)", highlightedLines: [7], stackDepth: 2, phase: "call_left" },
    
    { currentNode: 15, leftGain: '-', rightGain: '-', currentSum: '-', maxSum: 9, returnValue: '-', message: "Enter dfs(15): Check if null", highlightedLines: [5], stackDepth: 3, phase: "enter" },
    { currentNode: 15, leftGain: '-', rightGain: '-', currentSum: '-', maxSum: 9, returnValue: '-', message: "Not null, compute leftGain for node 15", highlightedLines: [7], stackDepth: 3, phase: "compute_left" },
    { currentNode: 15, leftGain: '-', rightGain: '-', currentSum: '-', maxSum: 9, returnValue: '-', message: "Call dfs(node.left) → dfs(null)", highlightedLines: [7], stackDepth: 3, phase: "call_left" },
    { currentNode: 'null', leftGain: '-', rightGain: '-', currentSum: '-', maxSum: 9, returnValue: 0, message: "dfs(null): Return 0", highlightedLines: [5], stackDepth: 4, phase: "return_null" },
    
    { currentNode: 15, leftGain: 0, rightGain: '-', currentSum: '-', maxSum: 9, returnValue: '-', message: "Back to node 15: leftGain = max(0, 0) = 0", highlightedLines: [7], stackDepth: 3, phase: "got_left" },
    { currentNode: 15, leftGain: 0, rightGain: '-', currentSum: '-', maxSum: 9, returnValue: '-', message: "Compute rightGain for node 15", highlightedLines: [8], stackDepth: 3, phase: "compute_right" },
    { currentNode: 15, leftGain: 0, rightGain: '-', currentSum: '-', maxSum: 9, returnValue: '-', message: "Call dfs(node.right) → dfs(null)", highlightedLines: [8], stackDepth: 3, phase: "call_right" },
    { currentNode: 'null', leftGain: '-', rightGain: '-', currentSum: '-', maxSum: 9, returnValue: 0, message: "dfs(null): Return 0", highlightedLines: [5], stackDepth: 4, phase: "return_null" },
    
    { currentNode: 15, leftGain: 0, rightGain: 0, currentSum: '-', maxSum: 9, returnValue: '-', message: "Back to node 15: rightGain = max(0, 0) = 0", highlightedLines: [8], stackDepth: 3, phase: "got_right" },
    { currentNode: 15, leftGain: 0, rightGain: 0, currentSum: 15, maxSum: 9, returnValue: '-', message: "currentSum = 15 + 0 + 0 = 15", highlightedLines: [10], stackDepth: 3, phase: "compute_sum" },
    { currentNode: 15, leftGain: 0, rightGain: 0, currentSum: 15, maxSum: 15, returnValue: '-', message: "maxSum = max(9, 15) = 15 (new max!)", highlightedLines: [11], stackDepth: 3, phase: "update_max" },
    { currentNode: 15, leftGain: 0, rightGain: 0, currentSum: 15, maxSum: 15, returnValue: 15, message: "Return 15 + max(0, 0) = 15", highlightedLines: [13], stackDepth: 3, phase: "return" },
    
    { currentNode: 20, leftGain: 15, rightGain: '-', currentSum: '-', maxSum: 15, returnValue: '-', message: "Back to node 20: leftGain = max(15, 0) = 15", highlightedLines: [7], stackDepth: 2, phase: "got_left" },
    { currentNode: 20, leftGain: 15, rightGain: '-', currentSum: '-', maxSum: 15, returnValue: '-', message: "Compute rightGain for node 20", highlightedLines: [8], stackDepth: 2, phase: "compute_right" },
    { currentNode: 20, leftGain: 15, rightGain: '-', currentSum: '-', maxSum: 15, returnValue: '-', message: "Call dfs(node.right) → dfs(7)", highlightedLines: [8], stackDepth: 2, phase: "call_right" },
    
    { currentNode: 7, leftGain: '-', rightGain: '-', currentSum: '-', maxSum: 15, returnValue: '-', message: "Enter dfs(7): Check if null", highlightedLines: [5], stackDepth: 3, phase: "enter" },
    { currentNode: 7, leftGain: '-', rightGain: '-', currentSum: '-', maxSum: 15, returnValue: '-', message: "Not null, compute leftGain for node 7", highlightedLines: [7], stackDepth: 3, phase: "compute_left" },
    { currentNode: 7, leftGain: '-', rightGain: '-', currentSum: '-', maxSum: 15, returnValue: '-', message: "Call dfs(node.left) → dfs(null)", highlightedLines: [7], stackDepth: 3, phase: "call_left" },
    { currentNode: 'null', leftGain: '-', rightGain: '-', currentSum: '-', maxSum: 15, returnValue: 0, message: "dfs(null): Return 0", highlightedLines: [5], stackDepth: 4, phase: "return_null" },
    
    { currentNode: 7, leftGain: 0, rightGain: '-', currentSum: '-', maxSum: 15, returnValue: '-', message: "Back to node 7: leftGain = max(0, 0) = 0", highlightedLines: [7], stackDepth: 3, phase: "got_left" },
    { currentNode: 7, leftGain: 0, rightGain: '-', currentSum: '-', maxSum: 15, returnValue: '-', message: "Compute rightGain for node 7", highlightedLines: [8], stackDepth: 3, phase: "compute_right" },
    { currentNode: 7, leftGain: 0, rightGain: '-', currentSum: '-', maxSum: 15, returnValue: '-', message: "Call dfs(node.right) → dfs(null)", highlightedLines: [8], stackDepth: 3, phase: "call_right" },
    { currentNode: 'null', leftGain: '-', rightGain: '-', currentSum: '-', maxSum: 15, returnValue: 0, message: "dfs(null): Return 0", highlightedLines: [5], stackDepth: 4, phase: "return_null" },
    
    { currentNode: 7, leftGain: 0, rightGain: 0, currentSum: '-', maxSum: 15, returnValue: '-', message: "Back to node 7: rightGain = max(0, 0) = 0", highlightedLines: [8], stackDepth: 3, phase: "got_right" },
    { currentNode: 7, leftGain: 0, rightGain: 0, currentSum: 7, maxSum: 15, returnValue: '-', message: "currentSum = 7 + 0 + 0 = 7", highlightedLines: [10], stackDepth: 3, phase: "compute_sum" },
    { currentNode: 7, leftGain: 0, rightGain: 0, currentSum: 7, maxSum: 15, returnValue: '-', message: "maxSum stays 15 (7 < 15)", highlightedLines: [11], stackDepth: 3, phase: "update_max" },
    { currentNode: 7, leftGain: 0, rightGain: 0, currentSum: 7, maxSum: 15, returnValue: 7, message: "Return 7 + max(0, 0) = 7", highlightedLines: [13], stackDepth: 3, phase: "return" },
    
    { currentNode: 20, leftGain: 15, rightGain: 7, currentSum: '-', maxSum: 15, returnValue: '-', message: "Back to node 20: rightGain = max(7, 0) = 7", highlightedLines: [8], stackDepth: 2, phase: "got_right" },
    { currentNode: 20, leftGain: 15, rightGain: 7, currentSum: 42, maxSum: 15, returnValue: '-', message: "currentSum = 20 + 15 + 7 = 42 🔥", highlightedLines: [10], stackDepth: 2, phase: "compute_sum" },
    { currentNode: 20, leftGain: 15, rightGain: 7, currentSum: 42, maxSum: 42, returnValue: '-', message: "maxSum = max(15, 42) = 42 (NEW MAX!)", highlightedLines: [11], stackDepth: 2, phase: "update_max" },
    { currentNode: 20, leftGain: 15, rightGain: 7, currentSum: 42, maxSum: 42, returnValue: 35, message: "Return 20 + max(15, 7) = 35", highlightedLines: [13], stackDepth: 2, phase: "return" },
    
    { currentNode: -10, leftGain: 9, rightGain: 35, currentSum: '-', maxSum: 42, returnValue: '-', message: "Back to node -10: rightGain = max(35, 0) = 35", highlightedLines: [8], stackDepth: 1, phase: "got_right" },
    { currentNode: -10, leftGain: 9, rightGain: 35, currentSum: 34, maxSum: 42, returnValue: '-', message: "currentSum = -10 + 9 + 35 = 34", highlightedLines: [10], stackDepth: 1, phase: "compute_sum" },
    { currentNode: -10, leftGain: 9, rightGain: 35, currentSum: 34, maxSum: 42, returnValue: '-', message: "maxSum stays 42 (34 < 42)", highlightedLines: [11], stackDepth: 1, phase: "update_max" },
    { currentNode: -10, leftGain: 9, rightGain: 35, currentSum: 34, maxSum: 42, returnValue: 25, message: "Return -10 + max(9, 35) = 25", highlightedLines: [13], stackDepth: 1, phase: "return" },
    
    { currentNode: '-', leftGain: '-', rightGain: '-', currentSum: '-', maxSum: 42, returnValue: 42, message: "Complete! Return maxSum = 42 ✓", highlightedLines: [17], stackDepth: 0, phase: "final" }
  ];

  const [idx, setIdx] = useState(0);
  const step = steps[idx];
  const ref = useRef<any>(null);
  const monaco = useRef<any>(null);

  useEffect(() => {
    if (ref.current && monaco.current) {
      ref.current.createDecorationsCollection(
        step.highlightedLines.map(l => ({
          range: new monaco.current!.Range(l, 1, l, 1),
          options: { isWholeLine: true, className: 'highlighted-line-purple' }
        }))
      );
    }
  }, [idx]);

  const renderTree = () => {
    const positions = [
      { x: 200, y: 40, value: -10 },
      { x: 120, y: 100, value: 9 },
      { x: 280, y: 100, value: 20 },
      { x: 240, y: 160, value: 15 },
      { x: 320, y: 160, value: 7 }
    ];

    return (
      <div className="space-y-4">
        <div className="text-sm font-semibold text-center mb-2">Maximum Path Sum</div>
        <svg width="400" height="220" className="mx-auto">
          <line x1={200} y1={40} x2={120} y2={100} stroke="currentColor" className="text-border" strokeWidth="2" />
          <line x1={200} y1={40} x2={280} y2={100} stroke="currentColor" className="text-border" strokeWidth="2" />
          <line x1={280} y1={100} x2={240} y2={160} stroke="currentColor" className="text-border" strokeWidth="2" />
          <line x1={280} y1={100} x2={320} y2={160} stroke="currentColor" className="text-border" strokeWidth="2" />

          {positions.map((pos, i) => {
            const isCurrent = step.currentNode === pos.value;
            const isInPath = (step.maxSum === 42 && [15, 20, 7].includes(pos.value));
            
            return (
              <g key={i}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="24"
                  className={`transition-all duration-300 ${
                    isInPath
                      ? 'fill-green-500'
                      : isCurrent
                      ? 'fill-yellow-500'
                      : 'fill-card'
                  }`}
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <text
                  x={pos.x}
                  y={pos.y + 6}
                  textAnchor="middle"
                  className="text-sm font-bold fill-foreground"
                >
                  {pos.value}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="text-center text-xs text-muted-foreground">
          Max Path: 15 → 20 → 7 = 42
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button onClick={() => setIdx(0)} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0} variant="outline" size="sm">
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button onClick={() => setIdx(Math.min(steps.length - 1, idx + 1))} disabled={idx === steps.length - 1} variant="outline" size="sm">
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">Step {idx + 1} / {steps.length}</span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-4">
            {renderTree()}
          </Card>
          <Card className="p-6">
          <motion.div key={step.maxSum} className="p-4 bg-green-500/10 rounded mb-4">
            <p className="text-2xl font-bold text-green-600 text-center">Max: {step.maxSum}</p>
          </motion.div>
          <VariablePanel variables={{
            node: step.currentNode,
            leftGain: step.leftGain,
            rightGain: step.rightGain,
            currentSum: step.currentSum,
            maxSum: step.maxSum,
            return: step.returnValue,
            depth: step.stackDepth
          }} />
          <Card className="p-4 mt-4 bg-primary/5">
            <p className="text-sm">{step.message}</p>
          </Card>
        </Card>
      </div>

        <Card className="p-4">
          <div className="h-[700px]">
            <Editor
              height="100%"
              defaultLanguage="typescript"
              value={code}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: 'on',
                scrollBeyondLastLine: false
              }}
              onMount={(e, m) => {
                ref.current = e;
                monaco.current = m;
              }}
            />
          </div>
        </Card>
      </div>

      <style>{`.highlighted-line-purple { background: rgba(168, 85, 247, 0.15); border-left: 3px solid rgb(168, 85, 247); }`}</style>
    </div>
  );
};