import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw, Play, Pause } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  currentNode: number | null;
  k: number;
  count: number;
  visited: number[];
  found: boolean;
  result: number | null;
  message: string;
  highlightedLines: number[];
  variables: Record<string, any>;
}

export const KthSmallestInBSTVisualization = () => {
  const code = `function kthSmallest(root: TreeNode | null, k: number): number {
  let count = 0;
  let result = 0;
  
  function inorder(node: TreeNode | null): void {
    if (!node) return;
    
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
    { currentNode: null, k: 3, count: 0, visited: [], found: false, result: null, message: "Start: Find 3rd smallest in BST", highlightedLines: [1], variables: { root: '3', k: 3, count: 0 } },
    { currentNode: null, k: 3, count: 0, visited: [], found: false, result: null, message: "Initialize count = 0, result = 0", highlightedLines: [2, 3], variables: { count: 0, result: 0, k: 3 } },
    { currentNode: 3, k: 3, count: 0, visited: [], found: false, result: null, message: "Call inorder(root=3)", highlightedLines: [19], variables: { node: '3', k: 3 } },
    { currentNode: 3, k: 3, count: 0, visited: [], found: false, result: null, message: "Check if node 3 is null", highlightedLines: [6], variables: { node: '3', 'node === null': false } },
    { currentNode: 3, k: 3, count: 0, visited: [], found: false, result: null, message: "Not null, traverse left subtree first", highlightedLines: [8], variables: { node: '3', direction: 'left' } },
    { currentNode: 1, k: 3, count: 0, visited: [], found: false, result: null, message: "Call inorder(left=1)", highlightedLines: [5], variables: { node: '1', k: 3 } },
    { currentNode: 1, k: 3, count: 0, visited: [], found: false, result: null, message: "Check if node 1 is null", highlightedLines: [6], variables: { node: '1', 'node === null': false } },
    { currentNode: 1, k: 3, count: 0, visited: [], found: false, result: null, message: "Not null, traverse left of 1", highlightedLines: [8], variables: { node: '1', direction: 'left' } },
    { currentNode: null, k: 3, count: 0, visited: [], found: false, result: null, message: "Call inorder(left=null)", highlightedLines: [5], variables: { node: 'null' } },
    { currentNode: null, k: 3, count: 0, visited: [], found: false, result: null, message: "Node is null, return", highlightedLines: [6], variables: { node: 'null', action: 'return' } },
    { currentNode: 1, k: 3, count: 0, visited: [], found: false, result: null, message: "Back to node 1, left done", highlightedLines: [8], variables: { node: '1' } },
    { currentNode: 1, k: 3, count: 0, visited: [1], found: false, result: null, message: "Visit node 1, increment count", highlightedLines: [10], variables: { node: '1', count: 1, k: 3 } },
    { currentNode: 1, k: 3, count: 1, visited: [1], found: false, result: null, message: "Check if count === k", highlightedLines: [11], variables: { count: 1, k: 3, 'count === k': false } },
    { currentNode: 1, k: 3, count: 1, visited: [1], found: false, result: null, message: "Not yet, traverse right of 1", highlightedLines: [16], variables: { node: '1', direction: 'right' } },
    { currentNode: null, k: 3, count: 1, visited: [1], found: false, result: null, message: "Call inorder(right=null)", highlightedLines: [5], variables: { node: 'null' } },
    { currentNode: null, k: 3, count: 1, visited: [1], found: false, result: null, message: "Node is null, return", highlightedLines: [6], variables: { node: 'null', action: 'return' } },
    { currentNode: 1, k: 3, count: 1, visited: [1], found: false, result: null, message: "Node 1 complete, return to parent", highlightedLines: [16], variables: { node: '1', status: 'complete' } },
    { currentNode: 3, k: 3, count: 1, visited: [1], found: false, result: null, message: "Back to node 3, left subtree done", highlightedLines: [8], variables: { node: '3' } },
    { currentNode: 3, k: 3, count: 1, visited: [1,3], found: false, result: null, message: "Visit node 3, increment count", highlightedLines: [10], variables: { node: '3', count: 2, k: 3 } },
    { currentNode: 3, k: 3, count: 2, visited: [1,3], found: false, result: null, message: "Check if count === k", highlightedLines: [11], variables: { count: 2, k: 3, 'count === k': false } },
    { currentNode: 3, k: 3, count: 2, visited: [1,3], found: false, result: null, message: "Not yet, traverse right of 3", highlightedLines: [16], variables: { node: '3', direction: 'right' } },
    { currentNode: 4, k: 3, count: 2, visited: [1,3], found: false, result: null, message: "Call inorder(right=4)", highlightedLines: [5], variables: { node: '4', k: 3 } },
    { currentNode: 4, k: 3, count: 2, visited: [1,3], found: false, result: null, message: "Check if node 4 is null", highlightedLines: [6], variables: { node: '4', 'node === null': false } },
    { currentNode: 4, k: 3, count: 2, visited: [1,3], found: false, result: null, message: "Not null, traverse left of 4", highlightedLines: [8], variables: { node: '4', direction: 'left' } },
    { currentNode: null, k: 3, count: 2, visited: [1,3], found: false, result: null, message: "Call inorder(left=null)", highlightedLines: [5], variables: { node: 'null' } },
    { currentNode: null, k: 3, count: 2, visited: [1,3], found: false, result: null, message: "Node is null, return", highlightedLines: [6], variables: { node: 'null', action: 'return' } },
    { currentNode: 4, k: 3, count: 2, visited: [1,3], found: false, result: null, message: "Back to node 4, left done", highlightedLines: [8], variables: { node: '4' } },
    { currentNode: 4, k: 3, count: 2, visited: [1,3,4], found: false, result: null, message: "Visit node 4, increment count", highlightedLines: [10], variables: { node: '4', count: 3, k: 3 } },
    { currentNode: 4, k: 3, count: 3, visited: [1,3,4], found: false, result: null, message: "Check if count === k", highlightedLines: [11], variables: { count: 3, k: 3, 'count === k': true } },
    { currentNode: 4, k: 3, count: 3, visited: [1,3,4], found: true, result: 4, message: "Found! 3rd smallest element is 4 ✓", highlightedLines: [12], variables: { count: 3, k: 3, result: 4 } },
    { currentNode: 4, k: 3, count: 3, visited: [1,3,4], found: true, result: 4, message: "Set result = 4 and return early", highlightedLines: [13], variables: { result: 4, action: 'return' } },
    { currentNode: null, k: 3, count: 3, visited: [1,3,4], found: true, result: 4, message: "Return result: 4", highlightedLines: [20], variables: { result: 4 } },
    { currentNode: null, k: 3, count: 3, visited: [1,3,4], found: true, result: 4, message: "Complete! Kth smallest = 4 ✓", highlightedLines: [20], variables: { k: 3, result: 4, visited: '[1,3,4]' } }
  ];

  const [idx, setIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const step = steps[idx];
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const decorations = step.highlightedLines.map(lineNum => ({
        range: new monacoRef.current.Range(lineNum, 1, lineNum, 1),
        options: {
          isWholeLine: true,
          className: 'highlighted-line-blue'
        }
      }));
      editorRef.current.createDecorationsCollection(decorations);
    }
  }, [idx, step.highlightedLines]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setIdx(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 900);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  const renderTree = () => {
    const positions = [
      { x: 200, y: 40, offset: 80, value: 3 },
      { x: 120, y: 100, offset: 40, value: 1 },
      { x: 280, y: 100, offset: 40, value: 4 }
    ];

    return (
      <div className="space-y-4">
        <div className="text-sm font-semibold text-center mb-2">Inorder Traversal (k={step.k})</div>
        <svg width="400" height="180" className="mx-auto">
          <line x1={200} y1={40} x2={120} y2={100} stroke="currentColor" className="text-border" strokeWidth="2" />
          <line x1={200} y1={40} x2={280} y2={100} stroke="currentColor" className="text-border" strokeWidth="2" />

          {positions.map((pos, i) => {
            const isCurrent = step.currentNode === pos.value;
            const isVisited = step.visited.includes(pos.value);
            const isResult = step.found && step.result === pos.value;
            const visitOrder = step.visited.indexOf(pos.value) + 1;
            
            return (
              <g key={i}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="24"
                  className={`transition-all duration-300 ${
                    isResult
                      ? 'fill-green-500'
                      : isCurrent
                      ? 'fill-yellow-500'
                      : isVisited
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
                {isVisited && visitOrder > 0 && (
                  <text
                    x={pos.x}
                    y={pos.y + 45}
                    textAnchor="middle"
                    className="text-xs fill-primary font-bold"
                  >
                    #{visitOrder}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        <div className="text-center text-xs text-muted-foreground">
          Visit Order: {step.visited.join(' → ') || 'None'}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button onClick={() => setIdx(0)} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button onClick={() => setIsPlaying(!isPlaying)} variant="outline" size="sm">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-4">
            {renderTree()}
          </Card>

          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <VariablePanel variables={step.variables} />
            </motion.div>
          </AnimatePresence>

          <Card className="p-4 bg-primary/5 border-primary/20">
            <motion.p 
              key={`msg-${idx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-medium"
            >
              {step.message}
            </motion.p>
          </Card>

          {step.found && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
            >
              <p className="text-green-600 dark:text-green-400 font-semibold">✓ Found: {step.result}</p>
            </motion.div>
          )}
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
                scrollBeyondLastLine: false,
                automaticLayout: true
              }}
              onMount={(editor, monaco) => {
                editorRef.current = editor;
                monacoRef.current = monaco;
              }}
            />
          </div>
        </Card>
      </div>

      <style>{`
        .highlighted-line-blue {
          background: rgba(37, 99, 235, 0.15);
          border-left: 3px solid rgb(37, 99, 235);
        }
      `}</style>
    </div>
  );
};
