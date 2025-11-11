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
  const code = `function lowestCommonAncestor(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  let curr = root;
  
  while (curr) {
    if (p.val > curr.val && q.val > curr.val) {
      curr = curr.right;
    } else if (p.val < curr.val && q.val < curr.val) {
      curr = curr.left;
    } else {
      return curr;
    }
  }
  
  return null;
}`;

  const steps: Step[] = [
    { currentNode: null, p: 2, q: 8, found: false, message: "Start: Find LCA of nodes 2 and 8", highlightedLines: [1], variables: { root: '6', p: '2', q: '8' } },
    { currentNode: 6, p: 2, q: 8, found: false, message: "Initialize curr to root node 6", highlightedLines: [2], variables: { curr: '6', p: '2', q: '8' } },
    { currentNode: 6, p: 2, q: 8, found: false, message: "Enter while loop - curr is not null", highlightedLines: [4], variables: { curr: '6', 'curr !== null': true } },
    { currentNode: 6, p: 2, q: 8, found: false, message: "Check if both p and q > curr", highlightedLines: [5], variables: { p: '2', q: '8', curr: '6', 'p > curr': false, 'q > curr': true } },
    { currentNode: 6, p: 2, q: 8, found: false, message: "Not both greater (2 < 6), check next condition", highlightedLines: [5], variables: { condition: false } },
    { currentNode: 6, p: 2, q: 8, found: false, message: "Check if both p and q < curr", highlightedLines: [7], variables: { p: '2', q: '8', curr: '6', 'p < curr': true, 'q < curr': false } },
    { currentNode: 6, p: 2, q: 8, found: false, message: "Not both smaller (8 > 6), check else", highlightedLines: [7], variables: { condition: false } },
    { currentNode: 6, p: 2, q: 8, found: false, message: "Split point! p < curr < q", highlightedLines: [9], variables: { p: '2', curr: '6', q: '8', relation: '2 < 6 < 8' } },
    { currentNode: 6, p: 2, q: 8, found: true, message: "Found LCA: Node 6 is split point ✓", highlightedLines: [10], variables: { result: '6', reason: 'split point' } },
    { currentNode: 6, p: 2, q: 8, found: true, message: "Return node 6 as LCA", highlightedLines: [10], variables: { LCA: '6' } }
  ];

  const steps2: Step[] = [
    { currentNode: null, p: 2, q: 4, found: false, message: "Example 2: Find LCA of 2 and 4", highlightedLines: [1], variables: { root: '6', p: '2', q: '4' } },
    { currentNode: 6, p: 2, q: 4, found: false, message: "Initialize curr to root node 6", highlightedLines: [2], variables: { curr: '6', p: '2', q: '4' } },
    { currentNode: 6, p: 2, q: 4, found: false, message: "Enter while loop", highlightedLines: [4], variables: { curr: '6' } },
    { currentNode: 6, p: 2, q: 4, found: false, message: "Check if both p and q > curr", highlightedLines: [5], variables: { p: '2', q: '4', curr: '6', 'p > curr': false, 'q > curr': false } },
    { currentNode: 6, p: 2, q: 4, found: false, message: "Not both greater, check next", highlightedLines: [5], variables: { condition: false } },
    { currentNode: 6, p: 2, q: 4, found: false, message: "Check if both p and q < curr", highlightedLines: [7], variables: { p: '2', q: '4', curr: '6', 'p < curr': true, 'q < curr': true } },
    { currentNode: 6, p: 2, q: 4, found: false, message: "Both smaller! Move to left subtree", highlightedLines: [8], variables: { p: '2', q: '4', curr: '6', direction: 'left' } },
    { currentNode: 2, p: 2, q: 4, found: false, message: "Move curr to left child: node 2", highlightedLines: [8], variables: { curr: '2', p: '2', q: '4' } },
    { currentNode: 2, p: 2, q: 4, found: false, message: "Continue while loop", highlightedLines: [4], variables: { curr: '2' } },
    { currentNode: 2, p: 2, q: 4, found: false, message: "Check if both p and q > curr", highlightedLines: [5], variables: { p: '2', q: '4', curr: '2', 'p > curr': false, 'q > curr': true } },
    { currentNode: 2, p: 2, q: 4, found: false, message: "Not both greater, check next", highlightedLines: [5], variables: { condition: false } },
    { currentNode: 2, p: 2, q: 4, found: false, message: "Check if both p and q < curr", highlightedLines: [7], variables: { p: '2', q: '4', curr: '2', 'p < curr': false, 'q < curr': false } },
    { currentNode: 2, p: 2, q: 4, found: false, message: "Not both smaller, go to else", highlightedLines: [7], variables: { condition: false } },
    { currentNode: 2, p: 2, q: 4, found: false, message: "Split point! p = curr, q > curr", highlightedLines: [9], variables: { p: '2', curr: '2', q: '4', relation: '2 = 2 < 4' } },
    { currentNode: 2, p: 2, q: 4, found: true, message: "Found LCA: Node 2 (one target is ancestor) ✓", highlightedLines: [10], variables: { result: '2', reason: 'p is ancestor' } },
    { currentNode: 2, p: 2, q: 4, found: true, message: "Return node 2 as LCA", highlightedLines: [10], variables: { LCA: '2' } }
  ];

  const allSteps = [...steps, ...steps.slice(-1), ...steps2];

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
          if (prev >= allSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1100);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

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
        <span className="text-sm text-muted-foreground">Step {idx + 1} / {allSteps.length}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
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
              <p className="text-green-600 dark:text-green-400 font-semibold">✓ LCA Found: Node {step.currentNode}</p>
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
