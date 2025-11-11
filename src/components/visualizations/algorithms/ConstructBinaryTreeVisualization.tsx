import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';
import type { editor as MonacoEditor } from 'monaco-editor';

interface Step {
  preorder: number[];
  inorder: number[];
  preStart: number;
  preEnd: number;
  inStart: number;
  inEnd: number;
  rootVal: number | null;
  rootIdx: number;
  builtNodes: number[];
  message: string;
  highlightedLines: number[];
  stackDepth: number;
}

export const ConstructBinaryTreeVisualization = () => {
  const code = `function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  const inMap = new Map<number, number>();
  inorder.forEach((val, idx) => inMap.set(val, idx));
  
  function build(preStart: number, preEnd: number, inStart: number, inEnd: number): TreeNode | null {
    if (preStart > preEnd) return null;
    const rootVal = preorder[preStart];
    const root = new TreeNode(rootVal);
    const inIdx = inMap.get(rootVal)!;
    const leftSize = inIdx - inStart;
    root.left = build(preStart + 1, preStart + leftSize, inStart, inIdx - 1);
    root.right = build(preStart + leftSize + 1, preEnd, inIdx + 1, inEnd);
    return root;
  }
  return build(0, preorder.length - 1, 0, inorder.length - 1);
}`;

  const steps: Step[] = [
    { preorder: [3,9,20,15,7], inorder: [9,3,15,20,7], preStart: 0, preEnd: 4, inStart: 0, inEnd: 4, rootVal: null, rootIdx: -1, builtNodes: [], message: "Start: Build tree from arrays", highlightedLines: [2], stackDepth: 0 },
    { preorder: [3,9,20,15,7], inorder: [9,3,15,20,7], preStart: 0, preEnd: 4, inStart: 0, inEnd: 4, rootVal: 3, rootIdx: 1, builtNodes: [3], message: "Root: preorder[0]=3, find in inorder at idx=1", highlightedLines: [7], stackDepth: 1 },
    { preorder: [3,9,20,15,7], inorder: [9,3,15,20,7], preStart: 1, preEnd: 1, inStart: 0, inEnd: 0, rootVal: 9, rootIdx: 0, builtNodes: [3, 9], message: "Left: preorder[1]=9 (leaf)", highlightedLines: [11], stackDepth: 2 },
    { preorder: [3,9,20,15,7], inorder: [9,3,15,20,7], preStart: 2, preEnd: 4, inStart: 2, inEnd: 4, rootVal: 20, rootIdx: 3, builtNodes: [3, 9, 20], message: "Right: preorder[2]=20", highlightedLines: [12], stackDepth: 2 },
    { preorder: [3,9,20,15,7], inorder: [9,3,15,20,7], preStart: 3, preEnd: 3, inStart: 2, inEnd: 2, rootVal: 15, rootIdx: 2, builtNodes: [3, 9, 20, 15], message: "Left of 20: preorder[3]=15", highlightedLines: [11], stackDepth: 3 },
    { preorder: [3,9,20,15,7], inorder: [9,3,15,20,7], preStart: 4, preEnd: 4, inStart: 4, inEnd: 4, rootVal: 7, rootIdx: 4, builtNodes: [3, 9, 20, 15, 7], message: "Right of 20: preorder[4]=7", highlightedLines: [12], stackDepth: 3 },
    { preorder: [3,9,20,15,7], inorder: [9,3,15,20,7], preStart: 0, preEnd: 4, inStart: 0, inEnd: 4, rootVal: 3, rootIdx: 1, builtNodes: [3, 9, 20, 15, 7], message: "Complete! Tree built ✓", highlightedLines: [15], stackDepth: 0 }
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)];
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof import('monaco-editor') | null>(null);

  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      editorRef.current.createDecorationsCollection(currentStep.highlightedLines.map(line => ({ range: new monacoRef.current!.Range(line, 1, line, 1), options: { isWholeLine: true, className: 'highlighted-line-purple' } })));
    }
  }, [currentStepIndex]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between"><div className="flex gap-2"><Button onClick={() => setCurrentStepIndex(0)} variant="outline" size="sm"><RotateCcw className="h-4 w-4" /></Button><Button onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))} disabled={currentStepIndex === 0} variant="outline" size="sm"><SkipBack className="h-4 w-4" /></Button><Button onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))} disabled={currentStepIndex === steps.length - 1} variant="outline" size="sm"><SkipForward className="h-4 w-4" /></Button></div><span className="text-sm text-muted-foreground">Step {currentStepIndex + 1} of {steps.length}</span></div>
      <div className="grid grid-cols-2 gap-6"><Card className="p-6"><div className="mb-4"><p className="text-xs mb-1">Preorder:</p><div className="flex gap-1">{currentStep.preorder.map((val, idx) => <div key={idx} className={`w-10 h-10 flex items-center justify-center rounded border-2 font-mono ${idx === currentStep.preStart ? 'bg-yellow-500/30 border-yellow-500' : 'bg-muted/50 border-border'}`}>{val}</div>)}</div></div><VariablePanel variables={{ preStart: currentStep.preStart, inStart: currentStep.inStart, rootVal: currentStep.rootVal ?? 'null', built: currentStep.builtNodes.length }} /><Card className="p-4 mt-4 bg-primary/5"><p className="text-sm">{currentStep.message}</p></Card></Card><Card className="p-4"><div className="h-[700px]"><Editor height="100%" defaultLanguage="typescript" value={code} theme="vs-dark" options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }} onMount={(e, m) => { editorRef.current = e; monacoRef.current = m; }} /></div></Card></div>
      <style>{`.highlighted-line-purple { background: rgba(168, 85, 247, 0.15); border-left: 3px solid rgb(168, 85, 247); }`}</style>
    </div>
  );
};
