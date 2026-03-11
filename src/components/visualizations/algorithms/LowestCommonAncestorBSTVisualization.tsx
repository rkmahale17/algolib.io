import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw, Play, Pause } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  currentNode: number | null;
  p: number;
  q: number;
  found: boolean;
  message: string;
  highlightedLines: number[];
  variables: Record<string, any>;
}

export const LowestCommonAncestorBSTVisualization = () => {
  const code = `function lowestCommonAncestor(
  root: TreeNode | null,
  p: TreeNode,
  q: TreeNode
): TreeNode | null {
  let cur = root;

  while (cur) {
    if (p.val > cur.val && q.val > cur.val) {
      cur = cur.right;
    } else if (p.val < cur.val && q.val < cur.val) {
      cur = cur.left;
    } else {
      return cur;
    }
  }

  return null;
}`;

  // Example 1: LCA(3, 5) -> 4
  const steps1: Step[] = [
    { currentNode: null, p: 3, q: 5, found: false, message: "Example 1: Find LCA of nodes 3 and 5", highlightedLines: [1], variables: { root: '6', p: '3', q: '5' } },
    { currentNode: 6, p: 3, q: 5, found: false, message: "Initialize cur to root node 6", highlightedLines: [6], variables: { cur: '6', p: '3', q: '5' } },
    { currentNode: 6, p: 3, q: 5, found: false, message: "While cur is not null (6), continue traversal", highlightedLines: [8], variables: { cur: '6', 'cur !== null': true } },
    { currentNode: 6, p: 3, q: 5, found: false, message: "Check if both p(3) and q(5) > cur(6)", highlightedLines: [9], variables: { p: '3', q: '5', cur: '6', 'p > cur': false, 'q > cur': false } },
    { currentNode: 6, p: 3, q: 5, found: false, message: "Not both greater, check if both < cur(6)", highlightedLines: [11], variables: { p: '3', q: '5', cur: '6', 'p < cur': true, 'q < cur': true } },
    { currentNode: 6, p: 3, q: 5, found: false, message: "Both smaller! Move cur to left child (2)", highlightedLines: [12], variables: { cur: '6', next: 'left' } },
    { currentNode: 2, p: 3, q: 5, found: false, message: "Update cur to 2", highlightedLines: [12], variables: { cur: '2' } },
    { currentNode: 2, p: 3, q: 5, found: false, message: "While cur (2) is not null, continue", highlightedLines: [8], variables: { cur: '2' } },
    { currentNode: 2, p: 3, q: 5, found: false, message: "Check if both p(3) and q(5) > cur(2)", highlightedLines: [9], variables: { p: '3', q: '5', cur: '2', 'p > cur': true, 'q > cur': true } },
    { currentNode: 2, p: 3, q: 5, found: false, message: "Both greater! Move cur to right child (4)", highlightedLines: [10], variables: { cur: '2', next: 'right' } },
    { currentNode: 4, p: 3, q: 5, found: false, message: "Update cur to 4", highlightedLines: [10], variables: { cur: '4' } },
    { currentNode: 4, p: 3, q: 5, found: false, message: "While cur (4) is not null, continue", highlightedLines: [8], variables: { cur: '4' } },
    { currentNode: 4, p: 3, q: 5, found: false, message: "Check if both p(3) and q(5) > cur(4)", highlightedLines: [9], variables: { p: '3', q: '5', cur: '4', 'p > cur': false, 'q > cur': true } },
    { currentNode: 4, p: 3, q: 5, found: false, message: "Check if both p(3) and q(5) < cur(4)", highlightedLines: [11], variables: { p: '3', q: '5', cur: '4', 'p < cur': true, 'q < cur': false } },
    { currentNode: 4, p: 3, q: 5, found: false, message: "Neither condition met. Split point found at 4!", highlightedLines: [13], variables: { cur: '4', status: 'split' } },
    { currentNode: 4, p: 3, q: 5, found: true, message: "Return cur(4) as the LCA", highlightedLines: [14], variables: { LCA: '4' } }
  ];

  // Example 2: LCA(2, 4) -> 2
  const steps2: Step[] = [
    { currentNode: null, p: 2, q: 4, found: false, message: "Example 2: Find LCA of nodes 2 and 4", highlightedLines: [1], variables: { root: '6', p: '2', q: '4' } },
    { currentNode: 6, p: 2, q: 4, found: false, message: "Initialize cur to root node 6", highlightedLines: [6], variables: { cur: '6', p: '2', q: '4' } },
    { currentNode: 6, p: 2, q: 4, found: false, message: "While cur is not null (6), continue", highlightedLines: [8], variables: { cur: '6' } },
    { currentNode: 6, p: 2, q: 4, found: false, message: "Both 2 and 4 are < 6. Move left to 2.", highlightedLines: [11, 12], variables: { cur: '6', 'cur.left': '2' } },
    { currentNode: 2, p: 2, q: 4, found: false, message: "Update cur to 2", highlightedLines: [12], variables: { cur: '2' } },
    { currentNode: 2, p: 2, q: 4, found: false, message: "While cur is not null (2), continue", highlightedLines: [8], variables: { cur: '2' } },
    { currentNode: 2, p: 2, q: 4, found: false, message: "Check conditions at node 2.", highlightedLines: [9, 11], variables: { p: '2', q: '4', cur: '2' } },
    { currentNode: 2, p: 2, q: 4, found: false, message: "p(2) is cur(2). Condition not met for traversal.", highlightedLines: [13], variables: { cur: '2', p: '2', status: 'cur is target' } },
    { currentNode: 2, p: 2, q: 4, found: true, message: "Return cur(2) as LCA. Node 2 is an ancestor of 4.", highlightedLines: [14], variables: { LCA: '2' } }
  ];

  const allSteps = [...steps1, ...steps1.slice(-1), ...steps2];

  const [idx, setIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const step = allSteps[idx];
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
          if (prev >= allSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  const renderTree = () => {
    const nodes = [
      { x: 200, y: 40, val: 6, left: 2, right: 8 },
      { x: 100, y: 100, val: 2, left: 0, right: 4 },
      { x: 300, y: 100, val: 8, left: 7, right: 9 },
      { x: 50, y: 160, val: 0, left: null, right: null },
      { x: 150, y: 160, val: 4, left: 3, right: 5 },
      { x: 250, y: 160, val: 7, left: null, right: null },
      { x: 350, y: 160, val: 9, left: null, right: null },
      { x: 125, y: 220, val: 3, left: null, right: null },
      { x: 175, y: 220, val: 5, left: null, right: null },
    ];

    const findNode = (val: number) => nodes.find(n => n.val === val);

    return (
      <div className="space-y-4">
        <div className="text-sm font-semibold text-center mb-2">BST Visualization</div>
        <svg width="400" height="260" className="mx-auto">
          {nodes.map(node => (
            <g key={`links-${node.val}`}>
              {node.left !== null && (
                <line
                  x1={node.x} y1={node.y}
                  x2={findNode(node.left)!.x} y2={findNode(node.left)!.y}
                  stroke="currentColor" className="text-border" strokeWidth="2"
                />
              )}
              {node.right !== null && (
                <line
                  x1={node.x} y1={node.y}
                  x2={findNode(node.right)!.x} y2={findNode(node.right)!.y}
                  stroke="currentColor" className="text-border" strokeWidth="2"
                />
              )}
            </g>
          ))}
          {nodes.map((pos) => {
            const isCurrent = step.currentNode === pos.val;
            const isTarget = pos.val === step.p || pos.val === step.q;
            const isLCA = step.found && step.currentNode === pos.val;

            return (
              <g key={pos.val}>
                <motion.circle
                  initial={false}
                  animate={{
                    r: isCurrent ? 26 : 22,
                    strokeWidth: isCurrent ? 4 : 2
                  }}
                  cx={pos.x}
                  cy={pos.y}
                  className={`transition-all duration-300 ${isLCA
                    ? 'fill-green-500 stroke-green-600'
                    : isCurrent
                      ? 'fill-yellow-500 stroke-yellow-600'
                      : isTarget
                        ? 'fill-blue-500 stroke-blue-600'
                        : 'fill-card stroke-border'
                    }`}
                />
                <text
                  x={pos.x}
                  y={pos.y + 6}
                  textAnchor="middle"
                  className={`text-sm font- ${isTarget || isCurrent || isLCA ? 'fill-white' : 'fill-foreground'}`}
                >
                  {pos.val}
                </text>
                {isTarget && (
                  <text
                    x={pos.x}
                    y={pos.y - 30}
                    textAnchor="middle"
                    className="text-xs fill-blue-600 font-"
                  >
                    {pos.val === step.p ? 'p' : 'q'}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
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
          <Button onClick={() => setIdx(Math.min(allSteps.length - 1, idx + 1))} disabled={idx === allSteps.length - 1} variant="outline" size="sm">
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">
            Targets: <span className="text-blue-500">p={step.p}, q={step.q}</span>
          </span>
          <span className="text-sm text-muted-foreground">Step {idx + 1} / {allSteps.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
            {renderTree()}
          </Card>

          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <VariablePanel variables={step.variables} />
            </motion.div>
          </AnimatePresence>

          <Card className="p-4 bg-primary/5 border-primary/20 min-h-[80px] flex items-center">
            <motion.p
              key={`msg-${idx}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm font-medium leading-relaxed"
            >
              {step.message}
            </motion.p>
          </Card>

          {step.found && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
            >
              <p className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                LCA Found: Node {step.currentNode}
              </p>
            </motion.div>
          )}
        </div>

        <Card className="p-4 overflow-hidden border-border/50">
          <div className="h-[500px] rounded-md overflow-hidden border border-border/50">
            <Editor
              height="100%"
              defaultLanguage="typescript"
              value={code}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16 }
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
          background: rgba(59, 130, 246, 0.2) !important;
          border-left: 4px solid #3b82f6 !important;
        }
      `}</style>
    </div>
  );
};
