import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { VariablePanel } from '../shared/VariablePanel';
import type { editor as MonacoEditor } from 'monaco-editor';

export const LowestCommonAncestorBSTVisualization = () => {
  const code = `function lowestCommonAncestor(root: TreeNode | null, p: TreeNode | null, q: TreeNode | null): TreeNode | null {
  if (root === null) return null;
  if (p.val < root.val && q.val < root.val) return lowestCommonAncestor(root.left, p, q);
  if (p.val > root.val && q.val > root.val) return lowestCommonAncestor(root.right, p, q);
  return root;
}`;

  const steps = [
    { currentNode: 6, p: 2, q: 8, message: "At node 6: p=2 < 6 < q=8. Split point!", highlightedLines: [1], stackDepth: 1 },
    { currentNode: 6, p: 2, q: 8, message: "Found LCA = 6 ✓", highlightedLines: [5], stackDepth: 1 }
  ];

  const [idx, setIdx] = useState(0);
  const step = steps[idx];
  const ref = useRef<any>(null);
  const monaco = useRef<any>(null);

  useEffect(() => {
    if (ref.current && monaco.current) {
      ref.current.createDecorationsCollection(step.highlightedLines.map(l => ({ range: new monaco.current!.Range(l, 1, l, 1), options: { isWholeLine: true, className: 'highlighted-line-purple' } })));
    }
  }, [idx]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between"><div className="flex gap-2"><Button onClick={() => setIdx(0)} variant="outline" size="sm"><RotateCcw className="h-4 w-4" /></Button><Button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0} variant="outline" size="sm"><SkipBack className="h-4 w-4" /></Button><Button onClick={() => setIdx(Math.min(steps.length - 1, idx + 1))} disabled={idx === steps.length - 1} variant="outline" size="sm"><SkipForward className="h-4 w-4" /></Button></div><span className="text-sm text-muted-foreground">Step {idx + 1} / {steps.length}</span></div>
      <div className="grid grid-cols-2 gap-6"><Card className="p-6"><VariablePanel variables={{ current: step.currentNode, p: step.p, q: step.q, depth: step.stackDepth }} /><Card className="p-4 mt-4 bg-primary/5"><p className="text-sm">{step.message}</p></Card></Card><Card className="p-4"><div className="h-[700px]"><Editor height="100%" defaultLanguage="typescript" value={code} theme="vs-dark" options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }} onMount={(e, m) => { ref.current = e; monaco.current = m; }} /></div></Card></div>
      <style>{`.highlighted-line-purple { background: rgba(168, 85, 247, 0.15); border-left: 3px solid rgb(168, 85, 247); }`}</style>
    </div>
  );
};
