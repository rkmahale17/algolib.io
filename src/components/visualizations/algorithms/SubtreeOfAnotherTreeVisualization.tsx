import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';
import type { editor as MonacoEditor } from 'monaco-editor';

interface Step {
  rootNode: number | null;
  subNode: number | null;
  checking: string;
  isSame: boolean | null;
  found: boolean;
  message: string;
  highlightedLines: number[];
  stackDepth: number;
}

export const SubtreeOfAnotherTreeVisualization = () => {
  const code = `function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
  if (root === null) return false;
  if (isSameTree(root, subRoot)) return true;
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}

function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  if (p === null && q === null) return true;
  if (p === null || q === null) return false;
  if (p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`;

  const steps: Step[] = [
    { rootNode: 3, subNode: 4, checking: "start", isSame: null, found: false, message: "Start: Check if subRoot (4,1,2) is subtree of root", highlightedLines: [1], stackDepth: 1 },
    { rootNode: 3, subNode: 4, checking: "null-check", isSame: null, found: false, message: "Check: root is not null, continue", highlightedLines: [2], stackDepth: 1 },
    { rootNode: 3, subNode: 4, checking: "same-tree", isSame: null, found: false, message: "Check: Is tree at node 3 same as subRoot?", highlightedLines: [3], stackDepth: 1 },
    { rootNode: 3, subNode: 4, checking: "compare", isSame: null, found: false, message: "isSameTree: Compare node 3 with node 4", highlightedLines: [7], stackDepth: 2 },
    { rootNode: 3, subNode: 4, checking: "value-check", isSame: false, found: false, message: "Values differ: 3 ≠ 4. Not same tree ✗", highlightedLines: [10], stackDepth: 2 },
    { rootNode: 3, subNode: 4, checking: "result", isSame: false, found: false, message: "Return false. Trees not same at root", highlightedLines: [3], stackDepth: 1 },
    { rootNode: 4, subNode: 4, checking: "left-recurse", isSame: null, found: false, message: "Recurse left: Check if node 4 contains subtree", highlightedLines: [4], stackDepth: 2 },
    { rootNode: 4, subNode: 4, checking: "null-check", isSame: null, found: false, message: "Check: node 4 is not null", highlightedLines: [2], stackDepth: 2 },
    { rootNode: 4, subNode: 4, checking: "same-tree", isSame: null, found: false, message: "Check: Is tree at node 4 same as subRoot?", highlightedLines: [3], stackDepth: 2 },
    { rootNode: 4, subNode: 4, checking: "compare", isSame: null, found: false, message: "isSameTree: Compare node 4 with node 4", highlightedLines: [7], stackDepth: 3 },
    { rootNode: 4, subNode: 4, checking: "value-check", isSame: null, found: false, message: "Values match: 4 = 4 ✓", highlightedLines: [10], stackDepth: 3 },
    { rootNode: 1, subNode: 1, checking: "left-left", isSame: null, found: false, message: "Recurse: Compare left children (1, 1)", highlightedLines: [11], stackDepth: 4 },
    { rootNode: 1, subNode: 1, checking: "compare", isSame: null, found: false, message: "Both not null, values match: 1 = 1 ✓", highlightedLines: [10], stackDepth: 4 },
    { rootNode: null, subNode: null, checking: "leaf", isSame: true, found: false, message: "Both children null: return true ✓", highlightedLines: [8], stackDepth: 5 },
    { rootNode: 2, subNode: 2, checking: "right-right", isSame: null, found: false, message: "Recurse: Compare right children (2, 2)", highlightedLines: [11], stackDepth: 4 },
    { rootNode: 2, subNode: 2, checking: "compare", isSame: null, found: false, message: "Both not null, values match: 2 = 2 ✓", highlightedLines: [10], stackDepth: 4 },
    { rootNode: null, subNode: null, checking: "leaf", isSame: true, found: false, message: "Both children null: return true ✓", highlightedLines: [8], stackDepth: 5 },
    { rootNode: 4, subNode: 4, checking: "result", isSame: true, found: true, message: "All nodes match! Trees are identical ✓", highlightedLines: [11], stackDepth: 3 },
    { rootNode: 4, subNode: 4, checking: "found", isSame: true, found: true, message: "Found matching subtree at node 4!", highlightedLines: [3], stackDepth: 2 },
    { rootNode: 4, subNode: 4, checking: "return", isSame: true, found: true, message: "Return true. Subtree found! ✓", highlightedLines: [4], stackDepth: 1 }
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
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold">Subtree Check</h3>
            <motion.div className="px-2 py-1 rounded text-xs font-semibold bg-blue-500/20 text-blue-600">Depth: {currentStep.stackDepth}</motion.div>
            {currentStep.found && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="px-2 py-1 rounded text-xs font-semibold bg-green-500/20 text-green-600">FOUND ✓</motion.div>}
          </div>
          <VariablePanel variables={{ rootNode: currentStep.rootNode ?? 'null', subNode: currentStep.subNode ?? 'null', checking: currentStep.checking, isSame: currentStep.isSame === null ? 'checking' : currentStep.isSame, stackDepth: currentStep.stackDepth }} />
          <Card className="p-4 mt-4 bg-primary/5 border-primary/20"><p className="text-sm">{currentStep.message}</p></Card>
        </Card>
        <Card className="p-4"><div className="h-[700px]"><Editor height="100%" defaultLanguage="typescript" value={code} theme="vs-dark" options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }} onMount={(editor, monaco) => { editorRef.current = editor; monacoRef.current = monaco; }} /></div></Card>
      </div>
      <style>{`.highlighted-line-purple { background: rgba(168, 85, 247, 0.15); border-left: 3px solid rgb(168, 85, 247); }`}</style>
    </div>
  );
};
