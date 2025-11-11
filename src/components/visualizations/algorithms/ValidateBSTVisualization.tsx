import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw, Play, Pause } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  currentNode: number | null;
  min: number | null;
  max: number | null;
  isValid: boolean | null;
  message: string;
  highlightedLines: number[];
  variables: Record<string, any>;
}

export const ValidateBSTVisualization = () => {
  const code = `function isValidBST(root: TreeNode | null): boolean {
  function validate(node: TreeNode | null, min: number | null, max: number | null): boolean {
    if (node === null) return true;
    
    if ((min !== null && node.val <= min) || (max !== null && node.val >= max)) {
      return false;
    }
    
    return validate(node.left, min, node.val) && validate(node.right, node.val, max);
  }
  
  return validate(root, null, null);
}`;

  const steps: Step[] = [
    { currentNode: null, min: null, max: null, isValid: null, message: "Start: Validate BST with root", highlightedLines: [12], variables: { root: '5', min: '-∞', max: '+∞' } },
    { currentNode: 5, min: null, max: null, isValid: null, message: "Call validate(5, null, null)", highlightedLines: [2], variables: { node: '5', min: '-∞', max: '+∞' } },
    { currentNode: 5, min: null, max: null, isValid: null, message: "Check if node is null", highlightedLines: [3], variables: { node: '5', 'node === null': false } },
    { currentNode: 5, min: null, max: null, isValid: null, message: "Node 5 is not null, continue", highlightedLines: [3], variables: { node: '5' } },
    { currentNode: 5, min: null, max: null, isValid: null, message: "Check bounds: -∞ < 5 < +∞", highlightedLines: [5], variables: { node: '5', min: '-∞', max: '+∞' } },
    { currentNode: 5, min: null, max: null, isValid: null, message: "5 is within bounds ✓", highlightedLines: [5], variables: { node: '5', valid: true } },
    { currentNode: 5, min: null, max: null, isValid: null, message: "Validate left subtree with max=5", highlightedLines: [9], variables: { node: '5', min: '-∞', max: '5' } },
    { currentNode: 1, min: null, max: 5, isValid: null, message: "Call validate(1, null, 5)", highlightedLines: [2], variables: { node: '1', min: '-∞', max: '5' } },
    { currentNode: 1, min: null, max: 5, isValid: null, message: "Check if node is null", highlightedLines: [3], variables: { node: '1', 'node === null': false } },
    { currentNode: 1, min: null, max: 5, isValid: null, message: "Node 1 is not null, continue", highlightedLines: [3], variables: { node: '1' } },
    { currentNode: 1, min: null, max: 5, isValid: null, message: "Check bounds: -∞ < 1 < 5", highlightedLines: [5], variables: { node: '1', min: '-∞', max: '5' } },
    { currentNode: 1, min: null, max: 5, isValid: null, message: "1 is within bounds ✓", highlightedLines: [5], variables: { node: '1', valid: true } },
    { currentNode: 1, min: null, max: 5, isValid: null, message: "Validate left subtree of 1", highlightedLines: [9], variables: { node: '1', min: '-∞', max: '1' } },
    { currentNode: null, min: null, max: 1, isValid: true, message: "Left child is null, return true", highlightedLines: [3], variables: { node: 'null', result: true } },
    { currentNode: 1, min: null, max: 5, isValid: null, message: "Left validated, check right with min=1", highlightedLines: [9], variables: { node: '1', min: '1', max: '5' } },
    { currentNode: null, min: 1, max: 5, isValid: true, message: "Right child is null, return true", highlightedLines: [3], variables: { node: 'null', result: true } },
    { currentNode: 1, min: null, max: 5, isValid: true, message: "Node 1 is valid BST ✓", highlightedLines: [9], variables: { node: '1', result: true } },
    { currentNode: 5, min: null, max: null, isValid: null, message: "Left validated, check right with min=5", highlightedLines: [9], variables: { node: '5', min: '5', max: '+∞' } },
    { currentNode: 4, min: 5, max: null, isValid: null, message: "Call validate(4, 5, null)", highlightedLines: [2], variables: { node: '4', min: '5', max: '+∞' } },
    { currentNode: 4, min: 5, max: null, isValid: null, message: "Check if node is null", highlightedLines: [3], variables: { node: '4', 'node === null': false } },
    { currentNode: 4, min: 5, max: null, isValid: null, message: "Node 4 is not null, continue", highlightedLines: [3], variables: { node: '4' } },
    { currentNode: 4, min: 5, max: null, isValid: null, message: "Check bounds: 5 < 4 < +∞", highlightedLines: [5], variables: { node: '4', min: '5', max: '+∞', 'node.val': 4 } },
    { currentNode: 4, min: 5, max: null, isValid: false, message: "INVALID! 4 <= 5 violates BST ✗", highlightedLines: [6], variables: { node: '4', min: '5', valid: false } },
    { currentNode: 4, min: 5, max: null, isValid: false, message: "Return false - BST property violated", highlightedLines: [6], variables: { result: false } },
    { currentNode: 5, min: null, max: null, isValid: false, message: "Right subtree invalid, return false", highlightedLines: [9], variables: { node: '5', result: false } },
    { currentNode: null, min: null, max: null, isValid: false, message: "Complete! Not a valid BST ✗", highlightedLines: [12], variables: { result: false, reason: '4 <= 5' } }
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

          {step.isValid === false && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
            >
              <p className="text-red-600 dark:text-red-400 font-semibold">✗ Invalid BST Detected!</p>
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
