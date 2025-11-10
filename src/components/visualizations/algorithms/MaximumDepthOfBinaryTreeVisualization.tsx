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
  currentNode: number | null;
  visitedNodes: number[];
  stack: { node: number; depth: number }[];
  maxDepth: number;
  currentDepth: number;
  action: string;
  message: string;
  highlightedLines: number[];
}

export const MaximumDepthOfBinaryTreeVisualization = () => {
  const code = `function maxDepth(root: TreeNode | null): number {
  if (root === null) {
    return 0;
  }
  
  const leftDepth = maxDepth(root.left);
  const rightDepth = maxDepth(root.right);
  
  return 1 + Math.max(leftDepth, rightDepth);
}`;

  const tree = {
    val: 3,
    left: { val: 9, left: null, right: null },
    right: {
      val: 20,
      left: { val: 15, left: null, right: null },
      right: { val: 7, left: null, right: null }
    }
  };

  const steps: Step[] = [
    {
      currentNode: null,
      visitedNodes: [],
      stack: [],
      maxDepth: 0,
      currentDepth: 0,
      action: "start",
      message: "Start: Call maxDepth(root=3) at depth 0",
      highlightedLines: [1]
    },
    {
      currentNode: 3,
      visitedNodes: [3],
      stack: [{ node: 3, depth: 0 }],
      maxDepth: 0,
      currentDepth: 0,
      action: "check",
      message: "Node 3: Not null, continue recursion",
      highlightedLines: [2]
    },
    {
      currentNode: 3,
      visitedNodes: [3],
      stack: [{ node: 3, depth: 0 }],
      maxDepth: 0,
      currentDepth: 0,
      action: "recurse_left",
      message: "Node 3: Recurse left → Call maxDepth(9) at depth 1",
      highlightedLines: [6]
    },
    {
      currentNode: 9,
      visitedNodes: [3, 9],
      stack: [{ node: 3, depth: 0 }, { node: 9, depth: 1 }],
      maxDepth: 0,
      currentDepth: 1,
      action: "check",
      message: "Node 9: Not null, continue",
      highlightedLines: [2]
    },
    {
      currentNode: 9,
      visitedNodes: [3, 9],
      stack: [{ node: 3, depth: 0 }, { node: 9, depth: 1 }],
      maxDepth: 0,
      currentDepth: 1,
      action: "recurse_left",
      message: "Node 9: Recurse left → left is null",
      highlightedLines: [6]
    },
    {
      currentNode: null,
      visitedNodes: [3, 9],
      stack: [{ node: 3, depth: 0 }, { node: 9, depth: 1 }],
      maxDepth: 0,
      currentDepth: 2,
      action: "return",
      message: "Null node: Return 0 (base case)",
      highlightedLines: [3]
    },
    {
      currentNode: 9,
      visitedNodes: [3, 9],
      stack: [{ node: 3, depth: 0 }, { node: 9, depth: 1 }],
      maxDepth: 0,
      currentDepth: 1,
      action: "recurse_right",
      message: "Node 9: leftDepth=0. Recurse right → right is null",
      highlightedLines: [7]
    },
    {
      currentNode: null,
      visitedNodes: [3, 9],
      stack: [{ node: 3, depth: 0 }, { node: 9, depth: 1 }],
      maxDepth: 0,
      currentDepth: 2,
      action: "return",
      message: "Null node: Return 0",
      highlightedLines: [3]
    },
    {
      currentNode: 9,
      visitedNodes: [3, 9],
      stack: [{ node: 3, depth: 0 }, { node: 9, depth: 1 }],
      maxDepth: 1,
      currentDepth: 1,
      action: "compute",
      message: "Node 9: rightDepth=0. Return 1 + max(0, 0) = 1",
      highlightedLines: [9]
    },
    {
      currentNode: 3,
      visitedNodes: [3, 9],
      stack: [{ node: 3, depth: 0 }],
      maxDepth: 1,
      currentDepth: 0,
      action: "recurse_right",
      message: "Node 3: leftDepth=1. Recurse right → Call maxDepth(20) at depth 1",
      highlightedLines: [7]
    },
    {
      currentNode: 20,
      visitedNodes: [3, 9, 20],
      stack: [{ node: 3, depth: 0 }, { node: 20, depth: 1 }],
      maxDepth: 1,
      currentDepth: 1,
      action: "check",
      message: "Node 20: Not null, continue",
      highlightedLines: [2]
    },
    {
      currentNode: 20,
      visitedNodes: [3, 9, 20],
      stack: [{ node: 3, depth: 0 }, { node: 20, depth: 1 }],
      maxDepth: 1,
      currentDepth: 1,
      action: "recurse_left",
      message: "Node 20: Recurse left → Call maxDepth(15) at depth 2",
      highlightedLines: [6]
    },
    {
      currentNode: 15,
      visitedNodes: [3, 9, 20, 15],
      stack: [{ node: 3, depth: 0 }, { node: 20, depth: 1 }, { node: 15, depth: 2 }],
      maxDepth: 1,
      currentDepth: 2,
      action: "check",
      message: "Node 15: Not null, continue",
      highlightedLines: [2]
    },
    {
      currentNode: 15,
      visitedNodes: [3, 9, 20, 15],
      stack: [{ node: 3, depth: 0 }, { node: 20, depth: 1 }, { node: 15, depth: 2 }],
      maxDepth: 1,
      currentDepth: 2,
      action: "leaf",
      message: "Node 15: Both children null. Return 1 + max(0, 0) = 1",
      highlightedLines: [9]
    },
    {
      currentNode: 20,
      visitedNodes: [3, 9, 20, 15],
      stack: [{ node: 3, depth: 0 }, { node: 20, depth: 1 }],
      maxDepth: 1,
      currentDepth: 1,
      action: "recurse_right",
      message: "Node 20: leftDepth=1. Recurse right → Call maxDepth(7) at depth 2",
      highlightedLines: [7]
    },
    {
      currentNode: 7,
      visitedNodes: [3, 9, 20, 15, 7],
      stack: [{ node: 3, depth: 0 }, { node: 20, depth: 1 }, { node: 7, depth: 2 }],
      maxDepth: 1,
      currentDepth: 2,
      action: "check",
      message: "Node 7: Not null, continue",
      highlightedLines: [2]
    },
    {
      currentNode: 7,
      visitedNodes: [3, 9, 20, 15, 7],
      stack: [{ node: 3, depth: 0 }, { node: 20, depth: 1 }, { node: 7, depth: 2 }],
      maxDepth: 1,
      currentDepth: 2,
      action: "leaf",
      message: "Node 7: Both children null. Return 1 + max(0, 0) = 1",
      highlightedLines: [9]
    },
    {
      currentNode: 20,
      visitedNodes: [3, 9, 20, 15, 7],
      stack: [{ node: 3, depth: 0 }, { node: 20, depth: 1 }],
      maxDepth: 2,
      currentDepth: 1,
      action: "compute",
      message: "Node 20: rightDepth=1. Return 1 + max(1, 1) = 2",
      highlightedLines: [9]
    },
    {
      currentNode: 3,
      visitedNodes: [3, 9, 20, 15, 7],
      stack: [{ node: 3, depth: 0 }],
      maxDepth: 3,
      currentDepth: 0,
      action: "compute",
      message: "Node 3: rightDepth=2. Return 1 + max(1, 2) = 3. Maximum depth = 3 ✓",
      highlightedLines: [9]
    }
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
          className: 'highlighted-line',
        }
      }));
      editorRef.current.createDecorationsCollection(decorations);
    }
  }, [currentStepIndex, currentStep.highlightedLines]);

  const renderTree = () => {
    return (
      <div className="flex flex-col items-center space-y-6">
        <motion.div
          animate={{ 
            scale: currentStep.currentNode === 3 ? 1.2 : 1,
          }}
          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 ${
            currentStep.currentNode === 3
              ? 'bg-primary/20 border-primary text-primary ring-2 ring-primary'
              : currentStep.visitedNodes.includes(3)
              ? 'bg-green-500/20 border-green-500 text-green-600'
              : 'bg-muted/50 border-border text-foreground'
          }`}
        >
          3
        </motion.div>

        <div className="flex gap-24">
          <motion.div
            animate={{ 
              scale: currentStep.currentNode === 9 ? 1.2 : 1,
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 ${
              currentStep.currentNode === 9
                ? 'bg-primary/20 border-primary text-primary ring-2 ring-primary'
                : currentStep.visitedNodes.includes(9)
                ? 'bg-green-500/20 border-green-500 text-green-600'
                : 'bg-muted/50 border-border text-foreground'
            }`}
          >
            9
          </motion.div>

          <motion.div
            animate={{ 
              scale: currentStep.currentNode === 20 ? 1.2 : 1,
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 ${
              currentStep.currentNode === 20
                ? 'bg-primary/20 border-primary text-primary ring-2 ring-primary'
                : currentStep.visitedNodes.includes(20)
                ? 'bg-green-500/20 border-green-500 text-green-600'
                : 'bg-muted/50 border-border text-foreground'
            }`}
          >
            20
          </motion.div>
        </div>

        <div className="flex gap-12 ml-24">
          <motion.div
            animate={{ 
              scale: currentStep.currentNode === 15 ? 1.2 : 1,
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 ${
              currentStep.currentNode === 15
                ? 'bg-primary/20 border-primary text-primary ring-2 ring-primary'
                : currentStep.visitedNodes.includes(15)
                ? 'bg-green-500/20 border-green-500 text-green-600'
                : 'bg-muted/50 border-border text-foreground'
            }`}
          >
            15
          </motion.div>

          <motion.div
            animate={{ 
              scale: currentStep.currentNode === 7 ? 1.2 : 1,
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 ${
              currentStep.currentNode === 7
                ? 'bg-primary/20 border-primary text-primary ring-2 ring-primary'
                : currentStep.visitedNodes.includes(7)
                ? 'bg-green-500/20 border-green-500 text-green-600'
                : 'bg-muted/50 border-border text-foreground'
            }`}
          >
            7
          </motion.div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button onClick={() => setCurrentStepIndex(0)} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))} disabled={currentStepIndex === 0} variant="outline" size="sm">
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))} disabled={currentStepIndex === steps.length - 1} variant="outline" size="sm">
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">Step {currentStepIndex + 1} of {steps.length}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Binary Tree</h3>
            {renderTree()}

            <div className="mt-6 grid grid-cols-2 gap-4">
              <motion.div
                animate={{ scale: currentStep.maxDepth > 0 ? 1 : 0.95 }}
                className="p-4 bg-green-500/10 rounded border border-green-500/20"
              >
                <p className="text-xs text-muted-foreground mb-1">Max Depth</p>
                <p className="text-3xl font-bold text-green-600">{currentStep.maxDepth}</p>
              </motion.div>

              <div className="p-4 bg-primary/10 rounded border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Current Depth</p>
                <p className="text-3xl font-bold text-primary">{currentStep.currentDepth}</p>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-3">Call Stack</h4>
              <div className="min-h-[80px] border-2 border-dashed border-border rounded-lg p-3 bg-muted/20">
                {currentStep.stack.length > 0 ? (
                  <div className="space-y-2">
                    {currentStep.stack.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="flex items-center gap-3 p-2 bg-background rounded"
                      >
                        <span className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center font-bold">
                          {item.node}
                        </span>
                        <span className="text-sm">depth={item.depth}</span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center">Empty</p>
                )}
              </div>
            </div>

            <VariablePanel
              variables={{
                currentNode: currentStep.currentNode || 'null',
                currentDepth: currentStep.currentDepth,
                maxDepth: currentStep.maxDepth,
                action: currentStep.action
              }}
            />

            <Card className="p-4 mt-4 bg-primary/5 border-primary/20">
              <p className="text-sm text-foreground">{currentStep.message}</p>
            </Card>
          </Card>
        </div>

        <Card className="p-4 overflow-hidden">
          <div className="h-[700px]">
            <Editor
              height="100%"
              defaultLanguage="typescript"
              value={code}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 13,
                lineNumbers: 'on',
              }}
              onMount={(editor, monaco) => {
                editorRef.current = editor;
                monacoRef.current = monaco;
                const decorations = currentStep.highlightedLines.map(line => ({
                  range: new monaco.Range(line, 1, line, 1),
                  options: {
                    isWholeLine: true,
                    className: 'highlighted-line',
                  }
                }));
                editor.createDecorationsCollection(decorations);
              }}
            />
          </div>
        </Card>
      </div>

      <style>{`
        .highlighted-line {
          background: rgba(59, 130, 246, 0.15);
          border-left: 3px solid rgb(59, 130, 246);
        }
      `}</style>
    </div>
  );
};