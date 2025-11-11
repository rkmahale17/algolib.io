import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw, Play, Pause } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  rootNode: number | null;
  subNode: number | null;
  comparing: boolean;
  isSame: boolean | null;
  found: boolean;
  message: string;
  highlightedLines: number[];
  variables: Record<string, any>;
}

export const SubtreeOfAnotherTreeVisualization = () => {
  const code = `function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
  if (!subRoot) return true;
  if (!root) return false;
  if (isSameTree(root, subRoot)) return true;
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}

function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  if (!p && !q) return true;
  if (!p || !q) return false;
  if (p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`;

  const steps: Step[] = [
    { rootNode: null, subNode: null, comparing: false, isSame: null, found: false, message: "Start: Check if subRoot is null", highlightedLines: [2], variables: { root: '3', subRoot: '4' } },
    { rootNode: null, subNode: null, comparing: false, isSame: null, found: false, message: "subRoot is not null, continue", highlightedLines: [2], variables: { root: '3', subRoot: '4' } },
    { rootNode: null, subNode: null, comparing: false, isSame: null, found: false, message: "Check if root is null", highlightedLines: [3], variables: { root: '3', subRoot: '4' } },
    { rootNode: null, subNode: null, comparing: false, isSame: null, found: false, message: "root is not null, continue", highlightedLines: [3], variables: { root: '3', subRoot: '4' } },
    { rootNode: 3, subNode: 4, comparing: true, isSame: null, found: false, message: "Check if tree at node 3 matches subRoot", highlightedLines: [4], variables: { root: '3', subRoot: '4' } },
    { rootNode: 3, subNode: 4, comparing: true, isSame: null, found: false, message: "Call isSameTree(3, 4)", highlightedLines: [8], variables: { p: '3', q: '4' } },
    { rootNode: 3, subNode: 4, comparing: true, isSame: null, found: false, message: "Check if both nodes are null", highlightedLines: [9], variables: { p: '3', q: '4' } },
    { rootNode: 3, subNode: 4, comparing: true, isSame: null, found: false, message: "Not both null, continue", highlightedLines: [9], variables: { p: '3', q: '4' } },
    { rootNode: 3, subNode: 4, comparing: true, isSame: null, found: false, message: "Check if either node is null", highlightedLines: [10], variables: { p: '3', q: '4' } },
    { rootNode: 3, subNode: 4, comparing: true, isSame: null, found: false, message: "Neither is null, continue", highlightedLines: [10], variables: { p: '3', q: '4' } },
    { rootNode: 3, subNode: 4, comparing: true, isSame: false, found: false, message: "Compare values: 3 ≠ 4, not same", highlightedLines: [11], variables: { p: '3', q: '4', 'p.val': 3, 'q.val': 4 } },
    { rootNode: 3, subNode: 4, comparing: false, isSame: false, found: false, message: "Trees not same at root, check left subtree", highlightedLines: [5], variables: { root: '3', subRoot: '4' } },
    { rootNode: 4, subNode: 4, comparing: true, isSame: null, found: false, message: "Check left child: node 4", highlightedLines: [4], variables: { root: '4', subRoot: '4' } },
    { rootNode: 4, subNode: 4, comparing: true, isSame: null, found: false, message: "Call isSameTree(4, 4)", highlightedLines: [8], variables: { p: '4', q: '4' } },
    { rootNode: 4, subNode: 4, comparing: true, isSame: null, found: false, message: "Check if both nodes are null", highlightedLines: [9], variables: { p: '4', q: '4' } },
    { rootNode: 4, subNode: 4, comparing: true, isSame: null, found: false, message: "Not both null, continue", highlightedLines: [9], variables: { p: '4', q: '4' } },
    { rootNode: 4, subNode: 4, comparing: true, isSame: null, found: false, message: "Check if either node is null", highlightedLines: [10], variables: { p: '4', q: '4' } },
    { rootNode: 4, subNode: 4, comparing: true, isSame: null, found: false, message: "Neither is null, continue", highlightedLines: [10], variables: { p: '4', q: '4' } },
    { rootNode: 4, subNode: 4, comparing: true, isSame: true, found: false, message: "Compare values: 4 = 4 ✓", highlightedLines: [11], variables: { p: '4', q: '4', 'p.val': 4, 'q.val': 4 } },
    { rootNode: 4, subNode: 4, comparing: true, isSame: true, found: false, message: "Values match, check left children", highlightedLines: [12], variables: { p: '4', q: '4' } },
    { rootNode: 1, subNode: 1, comparing: true, isSame: null, found: false, message: "Call isSameTree(1, 1)", highlightedLines: [8], variables: { p: '1', q: '1' } },
    { rootNode: 1, subNode: 1, comparing: true, isSame: null, found: false, message: "Check if both nodes are null", highlightedLines: [9], variables: { p: '1', q: '1' } },
    { rootNode: 1, subNode: 1, comparing: true, isSame: null, found: false, message: "Not both null, continue", highlightedLines: [9], variables: { p: '1', q: '1' } },
    { rootNode: 1, subNode: 1, comparing: true, isSame: null, found: false, message: "Check if either node is null", highlightedLines: [10], variables: { p: '1', q: '1' } },
    { rootNode: 1, subNode: 1, comparing: true, isSame: null, found: false, message: "Neither is null, continue", highlightedLines: [10], variables: { p: '1', q: '1' } },
    { rootNode: 1, subNode: 1, comparing: true, isSame: true, found: false, message: "Compare values: 1 = 1 ✓", highlightedLines: [11], variables: { p: '1', q: '1', 'p.val': 1, 'q.val': 1 } },
    { rootNode: 1, subNode: 1, comparing: true, isSame: true, found: false, message: "Values match, check left children", highlightedLines: [12], variables: { p: '1', q: '1' } },
    { rootNode: null, subNode: null, comparing: true, isSame: true, found: false, message: "Both left children are null ✓", highlightedLines: [9], variables: { p: 'null', q: 'null' } },
    { rootNode: 1, subNode: 1, comparing: true, isSame: true, found: false, message: "Left match, check right children", highlightedLines: [12], variables: { p: '1', q: '1' } },
    { rootNode: null, subNode: null, comparing: true, isSame: true, found: false, message: "Both right children are null ✓", highlightedLines: [9], variables: { p: 'null', q: 'null' } },
    { rootNode: 1, subNode: 1, comparing: true, isSame: true, found: false, message: "Node 1 matches completely ✓", highlightedLines: [12], variables: { p: '1', q: '1' } },
    { rootNode: 4, subNode: 4, comparing: true, isSame: true, found: false, message: "Left child matched, check right child", highlightedLines: [12], variables: { p: '4', q: '4' } },
    { rootNode: 2, subNode: 2, comparing: true, isSame: null, found: false, message: "Call isSameTree(2, 2)", highlightedLines: [8], variables: { p: '2', q: '2' } },
    { rootNode: 2, subNode: 2, comparing: true, isSame: null, found: false, message: "Check if both nodes are null", highlightedLines: [9], variables: { p: '2', q: '2' } },
    { rootNode: 2, subNode: 2, comparing: true, isSame: null, found: false, message: "Not both null, continue", highlightedLines: [9], variables: { p: '2', q: '2' } },
    { rootNode: 2, subNode: 2, comparing: true, isSame: null, found: false, message: "Check if either node is null", highlightedLines: [10], variables: { p: '2', q: '2' } },
    { rootNode: 2, subNode: 2, comparing: true, isSame: null, found: false, message: "Neither is null, continue", highlightedLines: [10], variables: { p: '2', q: '2' } },
    { rootNode: 2, subNode: 2, comparing: true, isSame: true, found: false, message: "Compare values: 2 = 2 ✓", highlightedLines: [11], variables: { p: '2', q: '2', 'p.val': 2, 'q.val': 2 } },
    { rootNode: 2, subNode: 2, comparing: true, isSame: true, found: false, message: "Values match, check left children", highlightedLines: [12], variables: { p: '2', q: '2' } },
    { rootNode: null, subNode: null, comparing: true, isSame: true, found: false, message: "Both left children are null ✓", highlightedLines: [9], variables: { p: 'null', q: 'null' } },
    { rootNode: 2, subNode: 2, comparing: true, isSame: true, found: false, message: "Left match, check right children", highlightedLines: [12], variables: { p: '2', q: '2' } },
    { rootNode: null, subNode: null, comparing: true, isSame: true, found: false, message: "Both right children are null ✓", highlightedLines: [9], variables: { p: 'null', q: 'null' } },
    { rootNode: 2, subNode: 2, comparing: true, isSame: true, found: false, message: "Node 2 matches completely ✓", highlightedLines: [12], variables: { p: '2', q: '2' } },
    { rootNode: 4, subNode: 4, comparing: true, isSame: true, found: true, message: "Both children match! Tree at node 4 is same ✓", highlightedLines: [12], variables: { p: '4', q: '4' } },
    { rootNode: 4, subNode: 4, comparing: false, isSame: true, found: true, message: "Found subtree match! Return true", highlightedLines: [4], variables: { root: '4', subRoot: '4', result: true } },
    { rootNode: null, subNode: null, comparing: false, isSame: null, found: true, message: "Complete! Subtree found at node 4 ✓", highlightedLines: [5], variables: { result: true } }
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
          className: 'highlighted-line-purple'
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
      }, 1200);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  const renderTree = () => {
    const mainTreePositions = [
      { x: 200, y: 40, offset: 80, value: 3 },
      { x: 120, y: 100, offset: 40, value: 4 },
      { x: 280, y: 100, offset: 40, value: 5 },
      { x: 80, y: 160, offset: 0, value: 1 },
      { x: 160, y: 160, offset: 0, value: 2 }
    ];

    const subTreePositions = [
      { x: 550, y: 60, offset: 40, value: 4 },
      { x: 510, y: 120, offset: 0, value: 1 },
      { x: 590, y: 120, offset: 0, value: 2 }
    ];

    const currentNodeValue = step.rootNode;
    const subNodeValue = step.subNode;

    return (
      <div className="space-y-4">
        <div className="text-sm font-semibold text-center mb-2">Main Tree vs Subtree</div>
        <svg width="700" height="200" className="mx-auto">
          <g>
            <line x1={200} y1={40} x2={120} y2={100} stroke="currentColor" className="text-border" strokeWidth="2" />
            <line x1={200} y1={40} x2={280} y2={100} stroke="currentColor" className="text-border" strokeWidth="2" />
            <line x1={120} y1={100} x2={80} y2={160} stroke="currentColor" className="text-border" strokeWidth="2" />
            <line x1={120} y1={100} x2={160} y2={160} stroke="currentColor" className="text-border" strokeWidth="2" />

            {mainTreePositions.map((pos, i) => (
              <g key={`main-${i}`}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="24"
                  className={`transition-all duration-300 ${
                    pos.value === currentNodeValue && step.comparing
                      ? 'fill-yellow-500'
                      : step.found && [1, 2, 4].includes(pos.value)
                      ? 'fill-green-500'
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
            ))}
          </g>

          <g>
            <line x1={550} y1={60} x2={510} y2={120} stroke="currentColor" className="text-border" strokeWidth="2" />
            <line x1={550} y1={60} x2={590} y2={120} stroke="currentColor" className="text-border" strokeWidth="2" />

            {subTreePositions.map((pos, i) => (
              <g key={`sub-${i}`}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="24"
                  className={`transition-all duration-300 ${
                    pos.value === subNodeValue && step.comparing
                      ? 'fill-purple-500'
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
            ))}
          </g>

          <text x="200" y="190" textAnchor="middle" className="text-xs fill-muted-foreground">Main Tree</text>
          <text x="550" y="150" textAnchor="middle" className="text-xs fill-muted-foreground">Subtree to Find</text>
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
              <p className="text-green-600 dark:text-green-400 font-semibold">✓ Subtree Match Found!</p>
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
        .highlighted-line-purple {
          background: rgba(168, 85, 247, 0.15);
          border-left: 3px solid rgb(168, 85, 247);
        }
      `}</style>
    </div>
  );
};
