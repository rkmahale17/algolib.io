import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';
import type { editor as MonacoEditor } from 'monaco-editor';

interface Step {
  phase: 'serialize' | 'deserialize';
  currentNode: number | string;
  result: string[];
  index: number;
  message: string;
  highlightedLines: number[];
  stackDepth: number;
}

export const SerializeDeserializeBinaryTreeVisualization = () => {
  const code = `class Codec {
  serialize(root: TreeNode | null): string {
    const result: string[] = [];
    
    function dfs(node: TreeNode | null): void {
      if (node === null) {
        result.push("null");
        return;
      }
      
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
      if (values[index] === "null") {
        index++;
        return null;
      }
      
      const node = new TreeNode(parseInt(values[index]));
      index++;
      node.left = dfs();
      node.right = dfs();
      return node;
    }
    
    return dfs();
  }
}`;

  const steps: Step[] = [
    // SERIALIZE PHASE
    { phase: 'serialize', currentNode: '-', result: [], index: 0, message: "SERIALIZE: Initialize result = []", highlightedLines: [3], stackDepth: 0 },
    { phase: 'serialize', currentNode: '-', result: [], index: 0, message: "Call dfs(root) with node 1", highlightedLines: [16], stackDepth: 0 },
    
    { phase: 'serialize', currentNode: 1, result: [], index: 0, message: "Enter dfs(1): Check if null", highlightedLines: [6], stackDepth: 1 },
    { phase: 'serialize', currentNode: 1, result: [], index: 0, message: "Not null, continue", highlightedLines: [6], stackDepth: 1 },
    { phase: 'serialize', currentNode: 1, result: ['1'], index: 0, message: "Push '1' to result → ['1']", highlightedLines: [11], stackDepth: 1 },
    { phase: 'serialize', currentNode: 1, result: ['1'], index: 0, message: "Call dfs(node.left) → dfs(2)", highlightedLines: [12], stackDepth: 1 },
    
    { phase: 'serialize', currentNode: 2, result: ['1'], index: 0, message: "Enter dfs(2): Check if null", highlightedLines: [6], stackDepth: 2 },
    { phase: 'serialize', currentNode: 2, result: ['1'], index: 0, message: "Not null, continue", highlightedLines: [6], stackDepth: 2 },
    { phase: 'serialize', currentNode: 2, result: ['1', '2'], index: 0, message: "Push '2' to result → ['1','2']", highlightedLines: [11], stackDepth: 2 },
    { phase: 'serialize', currentNode: 2, result: ['1', '2'], index: 0, message: "Call dfs(node.left) → dfs(null)", highlightedLines: [12], stackDepth: 2 },
    
    { phase: 'serialize', currentNode: 'null', result: ['1', '2'], index: 0, message: "Enter dfs(null): Node is null", highlightedLines: [6], stackDepth: 3 },
    { phase: 'serialize', currentNode: 'null', result: ['1', '2', 'null'], index: 0, message: "Push 'null' to result → ['1','2','null']", highlightedLines: [7], stackDepth: 3 },
    { phase: 'serialize', currentNode: 'null', result: ['1', '2', 'null'], index: 0, message: "Return from dfs(null)", highlightedLines: [8], stackDepth: 3 },
    
    { phase: 'serialize', currentNode: 2, result: ['1', '2', 'null'], index: 0, message: "Back to node 2: Call dfs(node.right) → dfs(null)", highlightedLines: [13], stackDepth: 2 },
    
    { phase: 'serialize', currentNode: 'null', result: ['1', '2', 'null'], index: 0, message: "Enter dfs(null): Node is null", highlightedLines: [6], stackDepth: 3 },
    { phase: 'serialize', currentNode: 'null', result: ['1', '2', 'null', 'null'], index: 0, message: "Push 'null' to result → ['1','2','null','null']", highlightedLines: [7], stackDepth: 3 },
    { phase: 'serialize', currentNode: 'null', result: ['1', '2', 'null', 'null'], index: 0, message: "Return from dfs(null)", highlightedLines: [8], stackDepth: 3 },
    
    { phase: 'serialize', currentNode: 2, result: ['1', '2', 'null', 'null'], index: 0, message: "Back to node 2: Done with both children", highlightedLines: [13], stackDepth: 2 },
    { phase: 'serialize', currentNode: 1, result: ['1', '2', 'null', 'null'], index: 0, message: "Back to node 1: Call dfs(node.right) → dfs(3)", highlightedLines: [13], stackDepth: 1 },
    
    { phase: 'serialize', currentNode: 3, result: ['1', '2', 'null', 'null'], index: 0, message: "Enter dfs(3): Check if null", highlightedLines: [6], stackDepth: 2 },
    { phase: 'serialize', currentNode: 3, result: ['1', '2', 'null', 'null'], index: 0, message: "Not null, continue", highlightedLines: [6], stackDepth: 2 },
    { phase: 'serialize', currentNode: 3, result: ['1', '2', 'null', 'null', '3'], index: 0, message: "Push '3' to result → ['1','2','null','null','3']", highlightedLines: [11], stackDepth: 2 },
    { phase: 'serialize', currentNode: 3, result: ['1', '2', 'null', 'null', '3'], index: 0, message: "Call dfs(node.left) → dfs(null)", highlightedLines: [12], stackDepth: 2 },
    
    { phase: 'serialize', currentNode: 'null', result: ['1', '2', 'null', 'null', '3'], index: 0, message: "Enter dfs(null): Node is null", highlightedLines: [6], stackDepth: 3 },
    { phase: 'serialize', currentNode: 'null', result: ['1', '2', 'null', 'null', '3', 'null'], index: 0, message: "Push 'null' to result → ['1','2','null','null','3','null']", highlightedLines: [7], stackDepth: 3 },
    { phase: 'serialize', currentNode: 'null', result: ['1', '2', 'null', 'null', '3', 'null'], index: 0, message: "Return from dfs(null)", highlightedLines: [8], stackDepth: 3 },
    
    { phase: 'serialize', currentNode: 3, result: ['1', '2', 'null', 'null', '3', 'null'], index: 0, message: "Back to node 3: Call dfs(node.right) → dfs(null)", highlightedLines: [13], stackDepth: 2 },
    
    { phase: 'serialize', currentNode: 'null', result: ['1', '2', 'null', 'null', '3', 'null'], index: 0, message: "Enter dfs(null): Node is null", highlightedLines: [6], stackDepth: 3 },
    { phase: 'serialize', currentNode: 'null', result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 0, message: "Push 'null' to result → ['1','2','null','null','3','null','null']", highlightedLines: [7], stackDepth: 3 },
    { phase: 'serialize', currentNode: 'null', result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 0, message: "Return from dfs(null)", highlightedLines: [8], stackDepth: 3 },
    
    { phase: 'serialize', currentNode: 3, result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 0, message: "Back to node 3: Done", highlightedLines: [13], stackDepth: 2 },
    { phase: 'serialize', currentNode: 1, result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 0, message: "Back to node 1: All nodes processed", highlightedLines: [16], stackDepth: 1 },
    { phase: 'serialize', currentNode: '-', result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 0, message: "Join result with commas: '1,2,null,null,3,null,null'", highlightedLines: [17], stackDepth: 0 },
    
    // DESERIALIZE PHASE
    { phase: 'deserialize', currentNode: '-', result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 0, message: "DESERIALIZE: Split string by comma", highlightedLines: [21], stackDepth: 0 },
    { phase: 'deserialize', currentNode: '-', result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 0, message: "Initialize index = 0", highlightedLines: [22], stackDepth: 0 },
    { phase: 'deserialize', currentNode: '-', result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 0, message: "Call dfs() to rebuild tree", highlightedLines: [36], stackDepth: 0 },
    
    { phase: 'deserialize', currentNode: '-', result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 0, message: "Enter dfs(): values[0] = '1'", highlightedLines: [25], stackDepth: 1 },
    { phase: 'deserialize', currentNode: '-', result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 0, message: "Not 'null', continue", highlightedLines: [25], stackDepth: 1 },
    { phase: 'deserialize', currentNode: 1, result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 0, message: "Create node with value 1", highlightedLines: [30], stackDepth: 1 },
    { phase: 'deserialize', currentNode: 1, result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 1, message: "Increment index to 1", highlightedLines: [31], stackDepth: 1 },
    { phase: 'deserialize', currentNode: 1, result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 1, message: "Call dfs() for node.left", highlightedLines: [32], stackDepth: 1 },
    
    { phase: 'deserialize', currentNode: '-', result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 1, message: "Enter dfs(): values[1] = '2'", highlightedLines: [25], stackDepth: 2 },
    { phase: 'deserialize', currentNode: '-', result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 1, message: "Not 'null', continue", highlightedLines: [25], stackDepth: 2 },
    { phase: 'deserialize', currentNode: 2, result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 1, message: "Create node with value 2", highlightedLines: [30], stackDepth: 2 },
    { phase: 'deserialize', currentNode: 2, result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 2, message: "Increment index to 2", highlightedLines: [31], stackDepth: 2 },
    { phase: 'deserialize', currentNode: 2, result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 2, message: "Call dfs() for node.left", highlightedLines: [32], stackDepth: 2 },
    
    { phase: 'deserialize', currentNode: '-', result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 2, message: "Enter dfs(): values[2] = 'null'", highlightedLines: [25], stackDepth: 3 },
    { phase: 'deserialize', currentNode: 'null', result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 3, message: "Is 'null', increment index and return null", highlightedLines: [26], stackDepth: 3 },
    
    { phase: 'deserialize', currentNode: 2, result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 3, message: "Back to node 2: node.left = null", highlightedLines: [32], stackDepth: 2 },
    { phase: 'deserialize', currentNode: 2, result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 3, message: "Call dfs() for node.right", highlightedLines: [33], stackDepth: 2 },
    
    { phase: 'deserialize', currentNode: '-', result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 3, message: "Enter dfs(): values[3] = 'null'", highlightedLines: [25], stackDepth: 3 },
    { phase: 'deserialize', currentNode: 'null', result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 4, message: "Is 'null', increment index and return null", highlightedLines: [26], stackDepth: 3 },
    
    { phase: 'deserialize', currentNode: 2, result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 4, message: "Back to node 2: node.right = null, return node 2", highlightedLines: [34], stackDepth: 2 },
    
    { phase: 'deserialize', currentNode: 1, result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 4, message: "Back to node 1: node.left = node 2", highlightedLines: [32], stackDepth: 1 },
    { phase: 'deserialize', currentNode: 1, result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 4, message: "Call dfs() for node.right", highlightedLines: [33], stackDepth: 1 },
    
    { phase: 'deserialize', currentNode: '-', result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 4, message: "Enter dfs(): values[4] = '3'", highlightedLines: [25], stackDepth: 2 },
    { phase: 'deserialize', currentNode: '-', result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 4, message: "Not 'null', continue", highlightedLines: [25], stackDepth: 2 },
    { phase: 'deserialize', currentNode: 3, result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 4, message: "Create node with value 3", highlightedLines: [30], stackDepth: 2 },
    { phase: 'deserialize', currentNode: 3, result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 5, message: "Increment index to 5", highlightedLines: [31], stackDepth: 2 },
    { phase: 'deserialize', currentNode: 3, result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 5, message: "Call dfs() for node.left", highlightedLines: [32], stackDepth: 2 },
    
    { phase: 'deserialize', currentNode: '-', result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 5, message: "Enter dfs(): values[5] = 'null'", highlightedLines: [25], stackDepth: 3 },
    { phase: 'deserialize', currentNode: 'null', result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 6, message: "Is 'null', increment index and return null", highlightedLines: [26], stackDepth: 3 },
    
    { phase: 'deserialize', currentNode: 3, result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 6, message: "Back to node 3: node.left = null", highlightedLines: [32], stackDepth: 2 },
    { phase: 'deserialize', currentNode: 3, result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 6, message: "Call dfs() for node.right", highlightedLines: [33], stackDepth: 2 },
    
    { phase: 'deserialize', currentNode: '-', result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 6, message: "Enter dfs(): values[6] = 'null'", highlightedLines: [25], stackDepth: 3 },
    { phase: 'deserialize', currentNode: 'null', result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 7, message: "Is 'null', increment index and return null", highlightedLines: [26], stackDepth: 3 },
    
    { phase: 'deserialize', currentNode: 3, result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 7, message: "Back to node 3: node.right = null, return node 3", highlightedLines: [34], stackDepth: 2 },
    
    { phase: 'deserialize', currentNode: 1, result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 7, message: "Back to node 1: node.right = node 3, return node 1", highlightedLines: [34], stackDepth: 1 },
    { phase: 'deserialize', currentNode: '-', result: ['1', '2', 'null', 'null', '3', 'null', 'null'], index: 7, message: "Tree fully reconstructed! Return root ✓", highlightedLines: [36], stackDepth: 0 }
  ];

  const [idx, setIdx] = useState(0);
  const step = steps[idx];
  const ref = useRef<any>(null);
  const monaco = useRef<any>(null);

  useEffect(() => {
    if (ref.current && monaco.current) {
      ref.current.createDecorationsCollection(
        step.highlightedLines.map(l => ({
          range: new monaco.current!.Range(l, 1, l, 1),
          options: { isWholeLine: true, className: 'highlighted-line-blue' }
        }))
      );
    }
  }, [idx]);

  const renderTree = () => {
    const positions = [
      { x: 200, y: 40, value: 1 },
      { x: 120, y: 100, value: 2 },
      { x: 280, y: 100, value: 3 }
    ];

    return (
      <div className="space-y-4">
        <div className="text-sm font-semibold text-center mb-2">
          {step.phase === 'serialize' ? 'Tree → Array' : 'Array → Tree'}
        </div>
        <svg width="400" height="160" className="mx-auto">
          <line x1={200} y1={40} x2={120} y2={100} stroke="currentColor" className="text-border" strokeWidth="2" />
          <line x1={200} y1={40} x2={280} y2={100} stroke="currentColor" className="text-border" strokeWidth="2" />

          {positions.map((pos, i) => {
            const isCurrent = step.currentNode === pos.value;
            const isProcessed = step.phase === 'serialize' 
              ? step.result.includes(String(pos.value))
              : step.index > ['1', '2', '3'].indexOf(String(pos.value));
            
            return (
              <g key={i}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="24"
                  className={`transition-all duration-300 ${
                    isCurrent
                      ? step.phase === 'serialize' ? 'fill-green-500' : 'fill-green-500'
                      : isProcessed
                      ? 'fill-blue-500'
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
        <div className="text-center text-xs text-muted-foreground">
          Array: [{step.result.slice(0, 7).join(', ')}...]
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button onClick={() => setIdx(0)} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4" />
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

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-4">
            {renderTree()}
          </Card>
          <Card className="p-6">
          <motion.div key={step.phase} className={`p-4 rounded mb-4 ${step.phase === 'serialize' ? 'bg-green-500/10' : 'bg-green-500/10'}`}>
            <p className={`text-2xl font-bold text-center ${step.phase === 'serialize' ? 'text-green-600' : 'text-green-600'}`}>
              {step.phase === 'serialize' ? 'SERIALIZE' : 'DESERIALIZE'}
            </p>
          </motion.div>
          <VariablePanel variables={{
            phase: step.phase,
            currentNode: step.currentNode,
            index: step.index,
            arrayLength: step.result.length,
            stackDepth: step.stackDepth,
            result: step.result.join(',')
          }} />
          <Card className="p-4 mt-4 bg-primary/5">
            <p className="text-sm">{step.message}</p>
          </Card>
        </Card>
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
                fontSize: 12,
                lineNumbers: 'on',
                scrollBeyondLastLine: false
              }}
              onMount={(e, m) => {
                ref.current = e;
                monaco.current = m;
              }}
            />
          </div>
        </Card>
      </div>

      <style>{`.highlighted-line-purple { background: rgba(168, 85, 247, 0.15); border-left: 3px solid rgb(168, 85, 247); }`}</style>
    </div>
  );
};