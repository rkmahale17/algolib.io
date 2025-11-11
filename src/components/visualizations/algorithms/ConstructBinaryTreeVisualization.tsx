import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw, Play, Pause } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  preorder: number[];
  inorder: number[];
  preStart: number;
  preEnd: number;
  inStart: number;
  inEnd: number;
  rootVal: number | null;
  rootIndex: number | null;
  builtNodes: number[];
  message: string;
  highlightedLines: number[];
  variables: Record<string, any>;
}

export const ConstructBinaryTreeVisualization = () => {
  const code = `function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  if (preorder.length === 0) return null;
  
  const rootVal = preorder[0];
  const root = new TreeNode(rootVal);
  const mid = inorder.indexOf(rootVal);
  
  root.left = buildTree(
    preorder.slice(1, mid + 1),
    inorder.slice(0, mid)
  );
  root.right = buildTree(
    preorder.slice(mid + 1),
    inorder.slice(mid + 1)
  );
  
  return root;
}`;

  const steps: Step[] = [
    { preorder: [3,9,20,15,7], inorder: [9,3,15,20,7], preStart: 0, preEnd: 4, inStart: 0, inEnd: 4, rootVal: null, rootIndex: null, builtNodes: [], message: "Start: Build tree from arrays", highlightedLines: [1], variables: { preorder: '[3,9,20,15,7]', inorder: '[9,3,15,20,7]' } },
    { preorder: [3,9,20,15,7], inorder: [9,3,15,20,7], preStart: 0, preEnd: 4, inStart: 0, inEnd: 4, rootVal: null, rootIndex: null, builtNodes: [], message: "Check if preorder is empty", highlightedLines: [2], variables: { 'preorder.length': 5 } },
    { preorder: [3,9,20,15,7], inorder: [9,3,15,20,7], preStart: 0, preEnd: 4, inStart: 0, inEnd: 4, rootVal: null, rootIndex: null, builtNodes: [], message: "Not empty, continue", highlightedLines: [2], variables: { 'preorder.length': 5 } },
    { preorder: [3,9,20,15,7], inorder: [9,3,15,20,7], preStart: 0, preEnd: 4, inStart: 0, inEnd: 4, rootVal: 3, rootIndex: null, builtNodes: [], message: "Root value is first element in preorder: 3", highlightedLines: [4], variables: { rootVal: 3, preorder: '[3,9,20,15,7]' } },
    { preorder: [3,9,20,15,7], inorder: [9,3,15,20,7], preStart: 0, preEnd: 4, inStart: 0, inEnd: 4, rootVal: 3, rootIndex: null, builtNodes: [3], message: "Create root node with value 3", highlightedLines: [5], variables: { root: '3', rootVal: 3 } },
    { preorder: [3,9,20,15,7], inorder: [9,3,15,20,7], preStart: 0, preEnd: 4, inStart: 0, inEnd: 4, rootVal: 3, rootIndex: 1, builtNodes: [3], message: "Find root in inorder: index 1", highlightedLines: [6], variables: { mid: 1, rootVal: 3, inorder: '[9,3,15,20,7]' } },
    { preorder: [3,9,20,15,7], inorder: [9,3,15,20,7], preStart: 0, preEnd: 4, inStart: 0, inEnd: 4, rootVal: 3, rootIndex: 1, builtNodes: [3], message: "Elements before index 1 go to left subtree", highlightedLines: [8], variables: { mid: 1, 'left elements': 1 } },
    { preorder: [9], inorder: [9], preStart: 0, preEnd: 0, inStart: 0, inEnd: 0, rootVal: 3, rootIndex: 1, builtNodes: [3], message: "Build left subtree: preorder=[9], inorder=[9]", highlightedLines: [1], variables: { preorder: '[9]', inorder: '[9]' } },
    { preorder: [9], inorder: [9], preStart: 0, preEnd: 0, inStart: 0, inEnd: 0, rootVal: 3, rootIndex: 1, builtNodes: [3], message: "Check if preorder is empty", highlightedLines: [2], variables: { 'preorder.length': 1 } },
    { preorder: [9], inorder: [9], preStart: 0, preEnd: 0, inStart: 0, inEnd: 0, rootVal: 9, rootIndex: 1, builtNodes: [3], message: "Root value for left subtree: 9", highlightedLines: [4], variables: { rootVal: 9, preorder: '[9]' } },
    { preorder: [9], inorder: [9], preStart: 0, preEnd: 0, inStart: 0, inEnd: 0, rootVal: 9, rootIndex: 1, builtNodes: [3,9], message: "Create node 9 as left child of 3", highlightedLines: [5], variables: { root: '9', parent: '3' } },
    { preorder: [9], inorder: [9], preStart: 0, preEnd: 0, inStart: 0, inEnd: 0, rootVal: 9, rootIndex: 0, builtNodes: [3,9], message: "Find 9 in inorder: index 0", highlightedLines: [6], variables: { mid: 0, rootVal: 9 } },
    { preorder: [9], inorder: [9], preStart: 0, preEnd: 0, inStart: 0, inEnd: 0, rootVal: 9, rootIndex: 0, builtNodes: [3,9], message: "Build left subtree of 9: empty", highlightedLines: [8], variables: { preorder: '[]', inorder: '[]' } },
    { preorder: [], inorder: [], preStart: 0, preEnd: -1, inStart: 0, inEnd: -1, rootVal: 9, rootIndex: 0, builtNodes: [3,9], message: "Empty array, return null", highlightedLines: [2], variables: { 'preorder.length': 0 } },
    { preorder: [9], inorder: [9], preStart: 0, preEnd: 0, inStart: 0, inEnd: 0, rootVal: 9, rootIndex: 0, builtNodes: [3,9], message: "Left of 9 is null, build right", highlightedLines: [12], variables: { 'root.left': 'null' } },
    { preorder: [], inorder: [], preStart: 0, preEnd: -1, inStart: 0, inEnd: -1, rootVal: 9, rootIndex: 0, builtNodes: [3,9], message: "Empty array, return null", highlightedLines: [2], variables: { 'preorder.length': 0 } },
    { preorder: [9], inorder: [9], preStart: 0, preEnd: 0, inStart: 0, inEnd: 0, rootVal: 9, rootIndex: 0, builtNodes: [3,9], message: "Right of 9 is null, node 9 complete", highlightedLines: [17], variables: { root: '9', 'root.left': 'null', 'root.right': 'null' } },
    { preorder: [3,9,20,15,7], inorder: [9,3,15,20,7], preStart: 0, preEnd: 4, inStart: 0, inEnd: 4, rootVal: 3, rootIndex: 1, builtNodes: [3,9], message: "Left subtree complete, build right subtree", highlightedLines: [12], variables: { mid: 1, 'elements after': 3 } },
    { preorder: [20,15,7], inorder: [15,20,7], preStart: 0, preEnd: 2, inStart: 0, inEnd: 2, rootVal: 3, rootIndex: 1, builtNodes: [3,9], message: "Build right subtree: preorder=[20,15,7]", highlightedLines: [1], variables: { preorder: '[20,15,7]', inorder: '[15,20,7]' } },
    { preorder: [20,15,7], inorder: [15,20,7], preStart: 0, preEnd: 2, inStart: 0, inEnd: 2, rootVal: 3, rootIndex: 1, builtNodes: [3,9], message: "Check if preorder is empty", highlightedLines: [2], variables: { 'preorder.length': 3 } },
    { preorder: [20,15,7], inorder: [15,20,7], preStart: 0, preEnd: 2, inStart: 0, inEnd: 2, rootVal: 20, rootIndex: 1, builtNodes: [3,9], message: "Root value for right subtree: 20", highlightedLines: [4], variables: { rootVal: 20, preorder: '[20,15,7]' } },
    { preorder: [20,15,7], inorder: [15,20,7], preStart: 0, preEnd: 2, inStart: 0, inEnd: 2, rootVal: 20, rootIndex: 1, builtNodes: [3,9,20], message: "Create node 20 as right child of 3", highlightedLines: [5], variables: { root: '20', parent: '3' } },
    { preorder: [20,15,7], inorder: [15,20,7], preStart: 0, preEnd: 2, inStart: 0, inEnd: 2, rootVal: 20, rootIndex: 1, builtNodes: [3,9,20], message: "Find 20 in inorder: index 1", highlightedLines: [6], variables: { mid: 1, rootVal: 20, inorder: '[15,20,7]' } },
    { preorder: [20,15,7], inorder: [15,20,7], preStart: 0, preEnd: 2, inStart: 0, inEnd: 2, rootVal: 20, rootIndex: 1, builtNodes: [3,9,20], message: "Build left subtree of 20", highlightedLines: [8], variables: { preorder: '[15]', inorder: '[15]' } },
    { preorder: [15], inorder: [15], preStart: 0, preEnd: 0, inStart: 0, inEnd: 0, rootVal: 20, rootIndex: 1, builtNodes: [3,9,20], message: "Build node 15", highlightedLines: [1], variables: { preorder: '[15]', inorder: '[15]' } },
    { preorder: [15], inorder: [15], preStart: 0, preEnd: 0, inStart: 0, inEnd: 0, rootVal: 20, rootIndex: 1, builtNodes: [3,9,20], message: "Check if preorder is empty", highlightedLines: [2], variables: { 'preorder.length': 1 } },
    { preorder: [15], inorder: [15], preStart: 0, preEnd: 0, inStart: 0, inEnd: 0, rootVal: 15, rootIndex: 1, builtNodes: [3,9,20], message: "Root value: 15", highlightedLines: [4], variables: { rootVal: 15 } },
    { preorder: [15], inorder: [15], preStart: 0, preEnd: 0, inStart: 0, inEnd: 0, rootVal: 15, rootIndex: 1, builtNodes: [3,9,20,15], message: "Create node 15 as left child of 20", highlightedLines: [5], variables: { root: '15', parent: '20' } },
    { preorder: [15], inorder: [15], preStart: 0, preEnd: 0, inStart: 0, inEnd: 0, rootVal: 15, rootIndex: 0, builtNodes: [3,9,20,15], message: "Find 15 in inorder: index 0", highlightedLines: [6], variables: { mid: 0 } },
    { preorder: [15], inorder: [15], preStart: 0, preEnd: 0, inStart: 0, inEnd: 0, rootVal: 15, rootIndex: 0, builtNodes: [3,9,20,15], message: "Build left of 15: empty", highlightedLines: [8], variables: { preorder: '[]' } },
    { preorder: [], inorder: [], preStart: 0, preEnd: -1, inStart: 0, inEnd: -1, rootVal: 15, rootIndex: 0, builtNodes: [3,9,20,15], message: "Empty, return null", highlightedLines: [2], variables: { 'preorder.length': 0 } },
    { preorder: [15], inorder: [15], preStart: 0, preEnd: 0, inStart: 0, inEnd: 0, rootVal: 15, rootIndex: 0, builtNodes: [3,9,20,15], message: "Build right of 15: empty", highlightedLines: [12], variables: { preorder: '[]' } },
    { preorder: [], inorder: [], preStart: 0, preEnd: -1, inStart: 0, inEnd: -1, rootVal: 15, rootIndex: 0, builtNodes: [3,9,20,15], message: "Empty, return null", highlightedLines: [2], variables: { 'preorder.length': 0 } },
    { preorder: [15], inorder: [15], preStart: 0, preEnd: 0, inStart: 0, inEnd: 0, rootVal: 15, rootIndex: 0, builtNodes: [3,9,20,15], message: "Node 15 complete (leaf)", highlightedLines: [17], variables: { root: '15' } },
    { preorder: [20,15,7], inorder: [15,20,7], preStart: 0, preEnd: 2, inStart: 0, inEnd: 2, rootVal: 20, rootIndex: 1, builtNodes: [3,9,20,15], message: "Left of 20 complete, build right", highlightedLines: [12], variables: { preorder: '[7]', inorder: '[7]' } },
    { preorder: [7], inorder: [7], preStart: 0, preEnd: 0, inStart: 0, inEnd: 0, rootVal: 20, rootIndex: 1, builtNodes: [3,9,20,15], message: "Build node 7", highlightedLines: [1], variables: { preorder: '[7]', inorder: '[7]' } },
    { preorder: [7], inorder: [7], preStart: 0, preEnd: 0, inStart: 0, inEnd: 0, rootVal: 20, rootIndex: 1, builtNodes: [3,9,20,15], message: "Check if preorder is empty", highlightedLines: [2], variables: { 'preorder.length': 1 } },
    { preorder: [7], inorder: [7], preStart: 0, preEnd: 0, inStart: 0, inEnd: 0, rootVal: 7, rootIndex: 1, builtNodes: [3,9,20,15], message: "Root value: 7", highlightedLines: [4], variables: { rootVal: 7 } },
    { preorder: [7], inorder: [7], preStart: 0, preEnd: 0, inStart: 0, inEnd: 0, rootVal: 7, rootIndex: 1, builtNodes: [3,9,20,15,7], message: "Create node 7 as right child of 20", highlightedLines: [5], variables: { root: '7', parent: '20' } },
    { preorder: [7], inorder: [7], preStart: 0, preEnd: 0, inStart: 0, inEnd: 0, rootVal: 7, rootIndex: 0, builtNodes: [3,9,20,15,7], message: "Find 7 in inorder: index 0", highlightedLines: [6], variables: { mid: 0 } },
    { preorder: [7], inorder: [7], preStart: 0, preEnd: 0, inStart: 0, inEnd: 0, rootVal: 7, rootIndex: 0, builtNodes: [3,9,20,15,7], message: "Build left of 7: empty", highlightedLines: [8], variables: { preorder: '[]' } },
    { preorder: [], inorder: [], preStart: 0, preEnd: -1, inStart: 0, inEnd: -1, rootVal: 7, rootIndex: 0, builtNodes: [3,9,20,15,7], message: "Empty, return null", highlightedLines: [2], variables: { 'preorder.length': 0 } },
    { preorder: [7], inorder: [7], preStart: 0, preEnd: 0, inStart: 0, inEnd: 0, rootVal: 7, rootIndex: 0, builtNodes: [3,9,20,15,7], message: "Build right of 7: empty", highlightedLines: [12], variables: { preorder: '[]' } },
    { preorder: [], inorder: [], preStart: 0, preEnd: -1, inStart: 0, inEnd: -1, rootVal: 7, rootIndex: 0, builtNodes: [3,9,20,15,7], message: "Empty, return null", highlightedLines: [2], variables: { 'preorder.length': 0 } },
    { preorder: [7], inorder: [7], preStart: 0, preEnd: 0, inStart: 0, inEnd: 0, rootVal: 7, rootIndex: 0, builtNodes: [3,9,20,15,7], message: "Node 7 complete (leaf)", highlightedLines: [17], variables: { root: '7' } },
    { preorder: [20,15,7], inorder: [15,20,7], preStart: 0, preEnd: 2, inStart: 0, inEnd: 2, rootVal: 20, rootIndex: 1, builtNodes: [3,9,20,15,7], message: "Node 20 complete with children 15 and 7", highlightedLines: [17], variables: { root: '20' } },
    { preorder: [3,9,20,15,7], inorder: [9,3,15,20,7], preStart: 0, preEnd: 4, inStart: 0, inEnd: 4, rootVal: 3, rootIndex: 1, builtNodes: [3,9,20,15,7], message: "Complete! Tree built successfully ✓", highlightedLines: [17], variables: { root: '3', nodes: '[3,9,20,15,7]' } }
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
      }, 1000);
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
          <Button onClick={() => setIdx(Math.min(steps.length - 1, idx + 1))} disabled={idx === steps.length - 1} variant="outline" size="sm">
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">Step {idx + 1} / {steps.length}</span>
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

          {step.builtNodes.length === 5 && idx === steps.length - 1 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
            >
              <p className="text-green-600 dark:text-green-400 font-semibold">✓ Tree Construction Complete!</p>
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
