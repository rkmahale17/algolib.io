import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { VariablePanel } from '../shared/VariablePanel';

export const SerializeDeserializeBinaryTreeVisualization = () => {
  const code = `class Codec {
  serialize(root: TreeNode | null): string {
    const result: string[] = [];
    function dfs(node: TreeNode | null): void {
      if (node === null) { result.push("null"); return; }
      result.push(String(node.val));
      dfs(node.left);
      dfs(node.right);
    }
    dfs(root);
    return result.join(",");
  }
  deserialize(data: string): TreeNode | null {
    const values = data.split(",");
    let index = 0;
    function dfs(): TreeNode | null {
      if (values[index] === "null") { index++; return null; }
      const node = new TreeNode(parseInt(values[index]));
      index++;
      node.left = dfs();
      node.right = dfs();
      return node;
    }
    return dfs();
  }
}`;

  const steps = [
    { phase: "serialize", serialized: [], message: "Start serialize", highlightedLines: [4], index: 0 },
    { phase: "serialize", serialized: ["1", "2", "null", "null", "3", "null", "null"], message: "Serialize: '1,2,null,null,3,null,null'", highlightedLines: [11], index: 0 },
    { phase: "deserialize", serialized: ["1", "2", "null", "null", "3", "null", "null"], message: "Deserialize: Split string", highlightedLines: [14], index: 0 },
    { phase: "deserialize", serialized: ["1", "2", "null", "null", "3", "null", "null"], message: "Complete! Tree reconstructed ✓", highlightedLines: [24], index: 7 }
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
      <div className="grid grid-cols-2 gap-6"><Card className="p-6"><VariablePanel variables={{ phase: step.phase, index: step.index, arrayLength: step.serialized.length }} /><Card className="p-4 mt-4 bg-primary/5"><p className="text-sm">{step.message}</p></Card></Card><Card className="p-4"><div className="h-[700px]"><Editor height="100%" defaultLanguage="typescript" value={code} theme="vs-dark" options={{ readOnly: true, minimap: { enabled: false }, fontSize: 12 }} onMount={(e, m) => { ref.current = e; monaco.current = m; }} /></div></Card></div>
      <style>{`.highlighted-line-purple { background: rgba(168, 85, 247, 0.15); border-left: 3px solid rgb(168, 85, 247); }`}</style>
    </div>
  );
};
