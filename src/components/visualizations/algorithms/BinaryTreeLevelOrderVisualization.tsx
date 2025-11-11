import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';
import type { editor as MonacoEditor } from 'monaco-editor';

interface Step {
  queue: number[];
  result: number[][];
  currentLevel: number[];
  levelSize: number;
  loopIndex: number;
  currentNode: number | string;
  message: string;
  highlightedLines: number[];
  phase: string;
}

export const BinaryTreeLevelOrderVisualization = () => {
  const code = `function levelOrder(root: TreeNode | null): number[][] {
  if (root === null) return [];
  
  const result: number[][] = [];
  const queue: TreeNode[] = [root];
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel: number[] = [];
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      currentLevel.push(node.val);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(currentLevel);
  }
  
  return result;
}`;

  const steps: Step[] = [
    { queue: [], result: [], currentLevel: [], levelSize: 0, loopIndex: 0, currentNode: '-', message: "Check if root is null", highlightedLines: [2], phase: "check_null" },
    { queue: [], result: [], currentLevel: [], levelSize: 0, loopIndex: 0, currentNode: 3, message: "Root is not null, continue", highlightedLines: [2], phase: "not_null" },
    { queue: [], result: [], currentLevel: [], levelSize: 0, loopIndex: 0, currentNode: '-', message: "Initialize result = []", highlightedLines: [4], phase: "init_result" },
    { queue: [3], result: [], currentLevel: [], levelSize: 0, loopIndex: 0, currentNode: '-', message: "Initialize queue = [3]", highlightedLines: [5], phase: "init_queue" },
    
    { queue: [3], result: [], currentLevel: [], levelSize: 0, loopIndex: 0, currentNode: '-', message: "LEVEL 0: Enter while loop (queue not empty)", highlightedLines: [7], phase: "while_check" },
    { queue: [3], result: [], currentLevel: [], levelSize: 1, loopIndex: 0, currentNode: '-', message: "levelSize = queue.length = 1", highlightedLines: [8], phase: "get_level_size" },
    { queue: [3], result: [], currentLevel: [], levelSize: 1, loopIndex: 0, currentNode: '-', message: "Initialize currentLevel = []", highlightedLines: [9], phase: "init_current_level" },
    
    { queue: [3], result: [], currentLevel: [], levelSize: 1, loopIndex: 0, currentNode: '-', message: "For loop: i=0, i < 1", highlightedLines: [11], phase: "for_check" },
    { queue: [], result: [], currentLevel: [], levelSize: 1, loopIndex: 0, currentNode: 3, message: "Dequeue node = 3", highlightedLines: [12], phase: "dequeue" },
    { queue: [], result: [], currentLevel: [3], levelSize: 1, loopIndex: 0, currentNode: 3, message: "Push 3 to currentLevel → [3]", highlightedLines: [13], phase: "push_to_level" },
    
    { queue: [], result: [], currentLevel: [3], levelSize: 1, loopIndex: 0, currentNode: 3, message: "Check if node 3 has left child", highlightedLines: [15], phase: "check_left" },
    { queue: [9], result: [], currentLevel: [3], levelSize: 1, loopIndex: 0, currentNode: 3, message: "node.left exists (9), enqueue → [9]", highlightedLines: [15], phase: "enqueue_left" },
    { queue: [9], result: [], currentLevel: [3], levelSize: 1, loopIndex: 0, currentNode: 3, message: "Check if node 3 has right child", highlightedLines: [16], phase: "check_right" },
    { queue: [9, 20], result: [], currentLevel: [3], levelSize: 1, loopIndex: 0, currentNode: 3, message: "node.right exists (20), enqueue → [9,20]", highlightedLines: [16], phase: "enqueue_right" },
    
    { queue: [9, 20], result: [], currentLevel: [3], levelSize: 1, loopIndex: 1, currentNode: '-', message: "For loop: i=1, i < 1 (false, exit loop)", highlightedLines: [11], phase: "for_done" },
    { queue: [9, 20], result: [[3]], currentLevel: [3], levelSize: 1, loopIndex: 0, currentNode: '-', message: "Push currentLevel to result → [[3]]", highlightedLines: [19], phase: "push_result" },
    
    { queue: [9, 20], result: [[3]], currentLevel: [], levelSize: 1, loopIndex: 0, currentNode: '-', message: "LEVEL 1: While loop check (queue not empty)", highlightedLines: [7], phase: "while_check" },
    { queue: [9, 20], result: [[3]], currentLevel: [], levelSize: 2, loopIndex: 0, currentNode: '-', message: "levelSize = queue.length = 2", highlightedLines: [8], phase: "get_level_size" },
    { queue: [9, 20], result: [[3]], currentLevel: [], levelSize: 2, loopIndex: 0, currentNode: '-', message: "Initialize currentLevel = []", highlightedLines: [9], phase: "init_current_level" },
    
    { queue: [9, 20], result: [[3]], currentLevel: [], levelSize: 2, loopIndex: 0, currentNode: '-', message: "For loop: i=0, i < 2", highlightedLines: [11], phase: "for_check" },
    { queue: [20], result: [[3]], currentLevel: [], levelSize: 2, loopIndex: 0, currentNode: 9, message: "Dequeue node = 9", highlightedLines: [12], phase: "dequeue" },
    { queue: [20], result: [[3]], currentLevel: [9], levelSize: 2, loopIndex: 0, currentNode: 9, message: "Push 9 to currentLevel → [9]", highlightedLines: [13], phase: "push_to_level" },
    
    { queue: [20], result: [[3]], currentLevel: [9], levelSize: 2, loopIndex: 0, currentNode: 9, message: "Check if node 9 has left child", highlightedLines: [15], phase: "check_left" },
    { queue: [20], result: [[3]], currentLevel: [9], levelSize: 2, loopIndex: 0, currentNode: 9, message: "node.left is null, skip", highlightedLines: [15], phase: "no_left" },
    { queue: [20], result: [[3]], currentLevel: [9], levelSize: 2, loopIndex: 0, currentNode: 9, message: "Check if node 9 has right child", highlightedLines: [16], phase: "check_right" },
    { queue: [20], result: [[3]], currentLevel: [9], levelSize: 2, loopIndex: 0, currentNode: 9, message: "node.right is null, skip", highlightedLines: [16], phase: "no_right" },
    
    { queue: [20], result: [[3]], currentLevel: [9], levelSize: 2, loopIndex: 1, currentNode: '-', message: "For loop: i=1, i < 2", highlightedLines: [11], phase: "for_check" },
    { queue: [], result: [[3]], currentLevel: [9], levelSize: 2, loopIndex: 1, currentNode: 20, message: "Dequeue node = 20", highlightedLines: [12], phase: "dequeue" },
    { queue: [], result: [[3]], currentLevel: [9, 20], levelSize: 2, loopIndex: 1, currentNode: 20, message: "Push 20 to currentLevel → [9,20]", highlightedLines: [13], phase: "push_to_level" },
    
    { queue: [], result: [[3]], currentLevel: [9, 20], levelSize: 2, loopIndex: 1, currentNode: 20, message: "Check if node 20 has left child", highlightedLines: [15], phase: "check_left" },
    { queue: [15], result: [[3]], currentLevel: [9, 20], levelSize: 2, loopIndex: 1, currentNode: 20, message: "node.left exists (15), enqueue → [15]", highlightedLines: [15], phase: "enqueue_left" },
    { queue: [15], result: [[3]], currentLevel: [9, 20], levelSize: 2, loopIndex: 1, currentNode: 20, message: "Check if node 20 has right child", highlightedLines: [16], phase: "check_right" },
    { queue: [15, 7], result: [[3]], currentLevel: [9, 20], levelSize: 2, loopIndex: 1, currentNode: 20, message: "node.right exists (7), enqueue → [15,7]", highlightedLines: [16], phase: "enqueue_right" },
    
    { queue: [15, 7], result: [[3]], currentLevel: [9, 20], levelSize: 2, loopIndex: 2, currentNode: '-', message: "For loop: i=2, i < 2 (false, exit loop)", highlightedLines: [11], phase: "for_done" },
    { queue: [15, 7], result: [[3], [9, 20]], currentLevel: [9, 20], levelSize: 2, loopIndex: 0, currentNode: '-', message: "Push currentLevel to result → [[3],[9,20]]", highlightedLines: [19], phase: "push_result" },
    
    { queue: [15, 7], result: [[3], [9, 20]], currentLevel: [], levelSize: 2, loopIndex: 0, currentNode: '-', message: "LEVEL 2: While loop check (queue not empty)", highlightedLines: [7], phase: "while_check" },
    { queue: [15, 7], result: [[3], [9, 20]], currentLevel: [], levelSize: 2, loopIndex: 0, currentNode: '-', message: "levelSize = queue.length = 2", highlightedLines: [8], phase: "get_level_size" },
    { queue: [15, 7], result: [[3], [9, 20]], currentLevel: [], levelSize: 2, loopIndex: 0, currentNode: '-', message: "Initialize currentLevel = []", highlightedLines: [9], phase: "init_current_level" },
    
    { queue: [15, 7], result: [[3], [9, 20]], currentLevel: [], levelSize: 2, loopIndex: 0, currentNode: '-', message: "For loop: i=0, i < 2", highlightedLines: [11], phase: "for_check" },
    { queue: [7], result: [[3], [9, 20]], currentLevel: [], levelSize: 2, loopIndex: 0, currentNode: 15, message: "Dequeue node = 15", highlightedLines: [12], phase: "dequeue" },
    { queue: [7], result: [[3], [9, 20]], currentLevel: [15], levelSize: 2, loopIndex: 0, currentNode: 15, message: "Push 15 to currentLevel → [15]", highlightedLines: [13], phase: "push_to_level" },
    
    { queue: [7], result: [[3], [9, 20]], currentLevel: [15], levelSize: 2, loopIndex: 0, currentNode: 15, message: "Check if node 15 has left child", highlightedLines: [15], phase: "check_left" },
    { queue: [7], result: [[3], [9, 20]], currentLevel: [15], levelSize: 2, loopIndex: 0, currentNode: 15, message: "node.left is null, skip", highlightedLines: [15], phase: "no_left" },
    { queue: [7], result: [[3], [9, 20]], currentLevel: [15], levelSize: 2, loopIndex: 0, currentNode: 15, message: "Check if node 15 has right child", highlightedLines: [16], phase: "check_right" },
    { queue: [7], result: [[3], [9, 20]], currentLevel: [15], levelSize: 2, loopIndex: 0, currentNode: 15, message: "node.right is null, skip", highlightedLines: [16], phase: "no_right" },
    
    { queue: [7], result: [[3], [9, 20]], currentLevel: [15], levelSize: 2, loopIndex: 1, currentNode: '-', message: "For loop: i=1, i < 2", highlightedLines: [11], phase: "for_check" },
    { queue: [], result: [[3], [9, 20]], currentLevel: [15], levelSize: 2, loopIndex: 1, currentNode: 7, message: "Dequeue node = 7", highlightedLines: [12], phase: "dequeue" },
    { queue: [], result: [[3], [9, 20]], currentLevel: [15, 7], levelSize: 2, loopIndex: 1, currentNode: 7, message: "Push 7 to currentLevel → [15,7]", highlightedLines: [13], phase: "push_to_level" },
    
    { queue: [], result: [[3], [9, 20]], currentLevel: [15, 7], levelSize: 2, loopIndex: 1, currentNode: 7, message: "Check if node 7 has left child", highlightedLines: [15], phase: "check_left" },
    { queue: [], result: [[3], [9, 20]], currentLevel: [15, 7], levelSize: 2, loopIndex: 1, currentNode: 7, message: "node.left is null, skip", highlightedLines: [15], phase: "no_left" },
    { queue: [], result: [[3], [9, 20]], currentLevel: [15, 7], levelSize: 2, loopIndex: 1, currentNode: 7, message: "Check if node 7 has right child", highlightedLines: [16], phase: "check_right" },
    { queue: [], result: [[3], [9, 20]], currentLevel: [15, 7], levelSize: 2, loopIndex: 1, currentNode: 7, message: "node.right is null, skip", highlightedLines: [16], phase: "no_right" },
    
    { queue: [], result: [[3], [9, 20]], currentLevel: [15, 7], levelSize: 2, loopIndex: 2, currentNode: '-', message: "For loop: i=2, i < 2 (false, exit loop)", highlightedLines: [11], phase: "for_done" },
    { queue: [], result: [[3], [9, 20], [15, 7]], currentLevel: [15, 7], levelSize: 2, loopIndex: 0, currentNode: '-', message: "Push currentLevel to result → [[3],[9,20],[15,7]]", highlightedLines: [19], phase: "push_result" },
    
    { queue: [], result: [[3], [9, 20], [15, 7]], currentLevel: [], levelSize: 0, loopIndex: 0, currentNode: '-', message: "While loop: queue is empty, exit", highlightedLines: [7], phase: "while_done" },
    { queue: [], result: [[3], [9, 20], [15, 7]], currentLevel: [], levelSize: 0, loopIndex: 0, currentNode: '-', message: "Return result = [[3],[9,20],[15,7]] ✓", highlightedLines: [22], phase: "return" }
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
      { x: 200, y: 40, value: 3, level: 0 },
      { x: 120, y: 100, value: 9, level: 1 },
      { x: 280, y: 100, value: 20, level: 1 },
      { x: 240, y: 160, value: 15, level: 2 },
      { x: 320, y: 160, value: 7, level: 2 }
    ];

    const currentLevelNumber = step.result.length;

    return (
      <div className="space-y-4">
        <div className="text-sm font-semibold text-center mb-2">Level Order Traversal</div>
        <svg width="400" height="220" className="mx-auto">
          <line x1={200} y1={40} x2={120} y2={100} stroke="currentColor" className="text-border" strokeWidth="2" />
          <line x1={200} y1={40} x2={280} y2={100} stroke="currentColor" className="text-border" strokeWidth="2" />
          <line x1={280} y1={100} x2={240} y2={160} stroke="currentColor" className="text-border" strokeWidth="2" />
          <line x1={280} y1={100} x2={320} y2={160} stroke="currentColor" className="text-border" strokeWidth="2" />

          {positions.map((pos, i) => {
            const isCurrent = step.currentNode === pos.value;
            const isInQueue = step.queue.includes(pos.value);
            const isVisited = step.result.flat().includes(pos.value);
            
            return (
              <g key={i}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="24"
                  className={`transition-all duration-300 ${
                    isCurrent
                      ? 'fill-yellow-500'
                      : isVisited
                      ? 'fill-green-500'
                      : isInQueue
                      ? 'fill-blue-500'
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
                <text
                  x={pos.x}
                  y={pos.y + 45}
                  textAnchor="middle"
                  className="text-xs fill-muted-foreground font-bold"
                >
                  L{pos.level}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="text-center text-xs text-muted-foreground">
          Queue: [{step.queue.join(', ') || 'empty'}]
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
          <motion.div key={step.result.length} className="p-4 bg-blue-500/10 rounded mb-4">
            <p className="text-lg font-bold text-blue-600 text-center">Levels Processed: {step.result.length}</p>
          </motion.div>
          <VariablePanel variables={{
            queue: JSON.stringify(step.queue),
            queueSize: step.queue.length,
            levelSize: step.levelSize,
            currentNode: step.currentNode,
            currentLevel: JSON.stringify(step.currentLevel),
            result: JSON.stringify(step.result)
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