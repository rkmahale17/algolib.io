import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';
import type { editor as MonacoEditor } from 'monaco-editor';

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

interface Step {
  pNode: number | null;
  qNode: number | null;
  pVal: number | null;
  qVal: number | null;
  checking: string;
  result: boolean | null;
  message: string;
  highlightedLines: number[];
  stackDepth: number;
}

export const SameTreeVisualization = () => {
  const code = `function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  if (p === null && q === null) return true;
  if (p === null || q === null) return false;
  if (p.val !== q.val) return false;
  
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`;

  const steps: Step[] = [
    { pNode: 1, qNode: 1, pVal: 1, qVal: 1, checking: "root", result: null, message: "Start: Compare root nodes of both trees", highlightedLines: [1], stackDepth: 1 },
    { pNode: 1, qNode: 1, pVal: 1, qVal: 1, checking: "null-check", result: null, message: "Check: p=1, q=1 (both not null)", highlightedLines: [2], stackDepth: 1 },
    { pNode: 1, qNode: 1, pVal: 1, qVal: 1, checking: "null-check", result: null, message: "Check: Neither is null, continue", highlightedLines: [3], stackDepth: 1 },
    { pNode: 1, qNode: 1, pVal: 1, qVal: 1, checking: "value", result: null, message: "Check: p.val=1 == q.val=1 ✓", highlightedLines: [4], stackDepth: 1 },
    
    { pNode: 2, qNode: 2, pVal: 2, qVal: 2, checking: "left", result: null, message: "Recurse: Check left subtrees (p.left=2, q.left=2)", highlightedLines: [6], stackDepth: 2 },
    { pNode: 2, qNode: 2, pVal: 2, qVal: 2, checking: "null-check", result: null, message: "Check: p=2, q=2 (both not null)", highlightedLines: [2], stackDepth: 2 },
    { pNode: 2, qNode: 2, pVal: 2, qVal: 2, checking: "null-check", result: null, message: "Check: Neither is null, continue", highlightedLines: [3], stackDepth: 2 },
    { pNode: 2, qNode: 2, pVal: 2, qVal: 2, checking: "value", result: null, message: "Check: p.val=2 == q.val=2 ✓", highlightedLines: [4], stackDepth: 2 },
    
    { pNode: null, qNode: null, pVal: null, qVal: null, checking: "left-left", result: null, message: "Recurse: Check left-left (both null)", highlightedLines: [6], stackDepth: 3 },
    { pNode: null, qNode: null, pVal: null, qVal: null, checking: "null-check", result: true, message: "Both null: return true ✓", highlightedLines: [2], stackDepth: 3 },
    { pNode: 2, qNode: 2, pVal: 2, qVal: 2, checking: "left-result", result: true, message: "Left result: true. Continue to right", highlightedLines: [6], stackDepth: 2 },
    
    { pNode: null, qNode: null, pVal: null, qVal: null, checking: "left-right", result: null, message: "Recurse: Check left-right (both null)", highlightedLines: [6], stackDepth: 3 },
    { pNode: null, qNode: null, pVal: null, qVal: null, checking: "null-check", result: true, message: "Both null: return true ✓", highlightedLines: [2], stackDepth: 3 },
    { pNode: 2, qNode: 2, pVal: 2, qVal: 2, checking: "complete", result: true, message: "Left subtree comparison: true && true = true", highlightedLines: [6], stackDepth: 2 },
    
    { pNode: 1, qNode: 1, pVal: 1, qVal: 1, checking: "left-done", result: true, message: "Left subtree result: true. Now check right", highlightedLines: [6], stackDepth: 1 },
    { pNode: 3, qNode: 3, pVal: 3, qVal: 3, checking: "right", result: null, message: "Recurse: Check right subtrees (p.right=3, q.right=3)", highlightedLines: [6], stackDepth: 2 },
    { pNode: 3, qNode: 3, pVal: 3, qVal: 3, checking: "null-check", result: null, message: "Check: p=3, q=3 (both not null)", highlightedLines: [2], stackDepth: 2 },
    { pNode: 3, qNode: 3, pVal: 3, qVal: 3, checking: "null-check", result: null, message: "Check: Neither is null, continue", highlightedLines: [3], stackDepth: 2 },
    { pNode: 3, qNode: 3, pVal: 3, qVal: 3, checking: "value", result: null, message: "Check: p.val=3 == q.val=3 ✓", highlightedLines: [4], stackDepth: 2 },
    
    { pNode: null, qNode: null, pVal: null, qVal: null, checking: "right-left", result: null, message: "Recurse: Check right-left (both null)", highlightedLines: [6], stackDepth: 3 },
    { pNode: null, qNode: null, pVal: null, qVal: null, checking: "null-check", result: true, message: "Both null: return true ✓", highlightedLines: [2], stackDepth: 3 },
    { pNode: 3, qNode: 3, pVal: 3, qVal: 3, checking: "left-result", result: true, message: "Left result: true. Continue to right", highlightedLines: [6], stackDepth: 2 },
    
    { pNode: null, qNode: null, pVal: null, qVal: null, checking: "right-right", result: null, message: "Recurse: Check right-right (both null)", highlightedLines: [6], stackDepth: 3 },
    { pNode: null, qNode: null, pVal: null, qVal: null, checking: "null-check", result: true, message: "Both null: return true ✓", highlightedLines: [2], stackDepth: 3 },
    { pNode: 3, qNode: 3, pVal: 3, qVal: 3, checking: "complete", result: true, message: "Right subtree comparison: true && true = true", highlightedLines: [6], stackDepth: 2 },
    
    { pNode: 1, qNode: 1, pVal: 1, qVal: 1, checking: "final", result: true, message: "Final: true && true = true. Trees are identical! ✓", highlightedLines: [6], stackDepth: 1 }
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)];
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof import('monaco-editor') | null>(null);

  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const decorations = currentStep.highlightedLines.map(line => ({
        range: new monacoRef.current!.Range(line, 1, line, 1),
        options: {
          isWholeLine: true,
          className: 'highlighted-line-purple'
        }
      }));
      editorRef.current.createDecorationsCollection(decorations);
    }
  }, [currentStepIndex]);

  const TreeVisual = ({ label }: { label: string }) => (
    <div className="flex flex-col items-center">
      <p className="text-xs text-muted-foreground mb-2">{label}</p>
      <div className="flex flex-col items-center gap-2">
        <motion.div
          animate={{ scale: currentStep.pVal === 1 || currentStep.qVal === 1 ? 1.1 : 1 }}
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
            (currentStep.pVal === 1 || currentStep.qVal === 1) && currentStep.checking !== 'final'
              ? 'bg-yellow-500/30 border-yellow-500'
              : 'bg-primary/20 border-primary'
          }`}
        >
          1
        </motion.div>
        <div className="flex gap-8">
          <motion.div
            animate={{ scale: currentStep.pVal === 2 || currentStep.qVal === 2 ? 1.1 : 1 }}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
              (currentStep.pVal === 2 || currentStep.qVal === 2)
                ? 'bg-yellow-500/30 border-yellow-500'
                : 'bg-muted/50 border-border'
            }`}
          >
            2
          </motion.div>
          <motion.div
            animate={{ scale: currentStep.pVal === 3 || currentStep.qVal === 3 ? 1.1 : 1 }}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
              (currentStep.pVal === 3 || currentStep.qVal === 3)
                ? 'bg-yellow-500/30 border-yellow-500'
                : 'bg-muted/50 border-border'
            }`}
          >
            3
          </motion.div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <Button onClick={() => setCurrentStepIndex(0)} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button 
            onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))} 
            disabled={currentStepIndex === 0} 
            variant="outline" 
            size="sm"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button 
            onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))} 
            disabled={currentStepIndex === steps.length - 1} 
            variant="outline" 
            size="sm"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">
          Step {currentStepIndex + 1} of {steps.length}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold">Tree Comparison</h3>
            <motion.div
              animate={{ scale: currentStep.result !== null ? 1 : 0.9 }}
              className={`px-2 py-1 rounded text-xs font-semibold ${
                currentStep.result === true ? 'bg-green-500/20 text-green-600' :
                currentStep.result === false ? 'bg-red-500/20 text-red-600' :
                'bg-blue-500/20 text-blue-600'
              }`}
            >
              Depth: {currentStep.stackDepth}
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <TreeVisual label="Tree P" />
            <TreeVisual label="Tree Q" />
          </div>

          {currentStep.result !== null && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded border mb-4 ${
                currentStep.result
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-red-500/10 border-red-500/30'
              }`}
            >
              <p className={`text-sm font-semibold ${
                currentStep.result ? 'text-green-600' : 'text-red-600'
              }`}>
                Result: {currentStep.result ? 'TRUE ✓' : 'FALSE ✗'}
              </p>
            </motion.div>
          )}

          <VariablePanel
            variables={{
              'p.val': currentStep.pVal ?? 'null',
              'q.val': currentStep.qVal ?? 'null',
              checking: currentStep.checking,
              stackDepth: currentStep.stackDepth
            }}
          />

          <Card className="p-4 mt-4 bg-primary/5 border-primary/20">
            <p className="text-sm">{currentStep.message}</p>
          </Card>
        </Card>

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
