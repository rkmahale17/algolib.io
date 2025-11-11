import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';
import type { editor as MonacoEditor } from 'monaco-editor';

interface Step {
  currentNode: number | null;
  leftVal: number | null;
  rightVal: number | null;
  swapped: boolean;
  tree: { [key: number]: { left: number | null; right: number | null } };
  message: string;
  highlightedLines: number[];
  stackDepth: number;
}

export const InvertBinaryTreeVisualization = () => {
  const code = `function invertTree(root: TreeNode | null): TreeNode | null {
  if (root === null) return null;
  
  const temp = root.left;
  root.left = root.right;
  root.right = temp;
  
  invertTree(root.left);
  invertTree(root.right);
  
  return root;
}`;

  const initialTree = { 4: { left: 2, right: 7 }, 2: { left: 1, right: 3 }, 7: { left: 6, right: 9 }, 1: { left: null, right: null }, 3: { left: null, right: null }, 6: { left: null, right: null }, 9: { left: null, right: null } };

  const steps: Step[] = [
    { currentNode: 4, leftVal: 2, rightVal: 7, swapped: false, tree: initialTree, message: "Start: At root node (4)", highlightedLines: [1], stackDepth: 1 },
    { currentNode: 4, leftVal: 2, rightVal: 7, swapped: false, tree: initialTree, message: "Check: root is not null, continue", highlightedLines: [2], stackDepth: 1 },
    { currentNode: 4, leftVal: 2, rightVal: 7, swapped: false, tree: initialTree, message: "Store left child in temp: temp=2", highlightedLines: [4], stackDepth: 1 },
    { currentNode: 4, leftVal: 7, rightVal: 7, swapped: false, tree: initialTree, message: "Swap: root.left = root.right (7)", highlightedLines: [5], stackDepth: 1 },
    { currentNode: 4, leftVal: 7, rightVal: 2, swapped: true, tree: { ...initialTree, 4: { left: 7, right: 2 } }, message: "Swap: root.right = temp (2). Children swapped! ✓", highlightedLines: [6], stackDepth: 1 },
    
    { currentNode: 7, leftVal: 6, rightVal: 9, swapped: false, tree: { ...initialTree, 4: { left: 7, right: 2 } }, message: "Recurse left: invertTree(7)", highlightedLines: [8], stackDepth: 2 },
    { currentNode: 7, leftVal: 6, rightVal: 9, swapped: false, tree: { ...initialTree, 4: { left: 7, right: 2 } }, message: "Check: node 7 is not null", highlightedLines: [2], stackDepth: 2 },
    { currentNode: 7, leftVal: 6, rightVal: 9, swapped: false, tree: { ...initialTree, 4: { left: 7, right: 2 } }, message: "Store left child: temp=6", highlightedLines: [4], stackDepth: 2 },
    { currentNode: 7, leftVal: 9, rightVal: 9, swapped: false, tree: { ...initialTree, 4: { left: 7, right: 2 } }, message: "Swap: root.left = 9", highlightedLines: [5], stackDepth: 2 },
    { currentNode: 7, leftVal: 9, rightVal: 6, swapped: true, tree: { 4: { left: 7, right: 2 }, 2: { left: 1, right: 3 }, 7: { left: 9, right: 6 }, 1: { left: null, right: null }, 3: { left: null, right: null }, 6: { left: null, right: null }, 9: { left: null, right: null } }, message: "Swap: root.right = 6. Swapped! ✓", highlightedLines: [6], stackDepth: 2 },
    
    { currentNode: 2, leftVal: 1, rightVal: 3, swapped: false, tree: { 4: { left: 7, right: 2 }, 2: { left: 1, right: 3 }, 7: { left: 9, right: 6 }, 1: { left: null, right: null }, 3: { left: null, right: null }, 6: { left: null, right: null }, 9: { left: null, right: null } }, message: "Recurse right: invertTree(2)", highlightedLines: [9], stackDepth: 2 },
    { currentNode: 2, leftVal: 3, rightVal: 1, swapped: true, tree: { 4: { left: 7, right: 2 }, 2: { left: 3, right: 1 }, 7: { left: 9, right: 6 }, 1: { left: null, right: null }, 3: { left: null, right: null }, 6: { left: null, right: null }, 9: { left: null, right: null } }, message: "Swap: root.right = 1. Swapped! ✓", highlightedLines: [6], stackDepth: 2 },
    
    { currentNode: 4, leftVal: 7, rightVal: 2, swapped: true, tree: { 4: { left: 7, right: 2 }, 2: { left: 3, right: 1 }, 7: { left: 9, right: 6 }, 1: { left: null, right: null }, 3: { left: null, right: null }, 6: { left: null, right: null }, 9: { left: null, right: null } }, message: "Complete! Tree fully inverted ✓", highlightedLines: [11], stackDepth: 1 }
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)];
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof import('monaco-editor') | null>(null);

  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const decorations = currentStep.highlightedLines.map(line => ({
        range: new monacoRef.current!.Range(line, 1, line, 1),
        options: { isWholeLine: true, className: 'highlighted-line-purple' }
      }));
      editorRef.current.createDecorationsCollection(decorations);
    }
  }, [currentStepIndex]);

  const renderTree = () => {
    const tree = currentStep.tree;
    const positions = [
      { x: 200, y: 40, value: 4 },
      { x: 120, y: 100, value: tree[4]?.left ?? 2 },
      { x: 280, y: 100, value: tree[4]?.right ?? 7 },
      { x: 80, y: 160, value: tree[tree[4]?.left ?? 2]?.left ?? 1 },
      { x: 160, y: 160, value: tree[tree[4]?.left ?? 2]?.right ?? 3 },
      { x: 240, y: 160, value: tree[tree[4]?.right ?? 7]?.left ?? 6 },
      { x: 320, y: 160, value: tree[tree[4]?.right ?? 7]?.right ?? 9 }
    ];

    return (
      <div className="space-y-4">
        <div className="text-sm font-semibold text-center mb-2">Tree Inversion Progress</div>
        <svg width="400" height="220" className="mx-auto">
          <line x1={200} y1={40} x2={120} y2={100} stroke="currentColor" className="text-border" strokeWidth="2" />
          <line x1={200} y1={40} x2={280} y2={100} stroke="currentColor" className="text-border" strokeWidth="2" />
          <line x1={120} y1={100} x2={80} y2={160} stroke="currentColor" className="text-border" strokeWidth="2" />
          <line x1={120} y1={100} x2={160} y2={160} stroke="currentColor" className="text-border" strokeWidth="2" />
          <line x1={280} y1={100} x2={240} y2={160} stroke="currentColor" className="text-border" strokeWidth="2" />
          <line x1={280} y1={100} x2={320} y2={160} stroke="currentColor" className="text-border" strokeWidth="2" />

          {positions.map((pos, i) => {
            const isCurrent = currentStep.currentNode === pos.value;
            const isSwapped = currentStep.swapped && currentStep.currentNode === pos.value;
            
            return (
              <g key={i}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="24"
                  className={`transition-all duration-300 ${
                    isSwapped
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
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <Button onClick={() => setCurrentStepIndex(0)} variant="outline" size="sm"><RotateCcw className="h-4 w-4" /></Button>
          <Button onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))} disabled={currentStepIndex === 0} variant="outline" size="sm"><SkipBack className="h-4 w-4" /></Button>
          <Button onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))} disabled={currentStepIndex === steps.length - 1} variant="outline" size="sm"><SkipForward className="h-4 w-4" /></Button>
        </div>
        <span className="text-sm text-muted-foreground">Step {currentStepIndex + 1} of {steps.length}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-4">
            {renderTree()}
          </Card>
          <Card className="p-6">
            <VariablePanel variables={{ currentNode: currentStep.currentNode ?? 'null', leftChild: currentStep.leftVal ?? 'null', rightChild: currentStep.rightVal ?? 'null', stackDepth: currentStep.stackDepth }} />
            <Card className="p-4 mt-4 bg-primary/5 border-primary/20"><p className="text-sm">{currentStep.message}</p></Card>
          </Card>
        </div>
        <Card className="p-4"><div className="h-[700px]"><Editor height="100%" defaultLanguage="typescript" value={code} theme="vs-dark" options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }} onMount={(editor, monaco) => { editorRef.current = editor; monacoRef.current = monaco; }} /></div></Card>
      </div>
      <style>{`.highlighted-line-purple { background: rgba(168, 85, 247, 0.15); border-left: 3px solid rgb(168, 85, 247); }`}</style>
    </div>
  );
};
