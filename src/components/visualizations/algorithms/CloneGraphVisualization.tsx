import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  currentNode: number;
  visited: number[];
  cloned: number[];
  message: string;
  lineNumber: number;
}

export const CloneGraphVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    { currentNode: -1, visited: [], cloned: [], message: "Graph: 1--2, 2--3, 3--4, 4--1. Clone using DFS", lineNumber: 2 },
    { currentNode: 1, visited: [1], cloned: [1], message: "Visit node 1, create clone. Add to map", lineNumber: 9 },
    { currentNode: 2, visited: [1, 2], cloned: [1, 2], message: "Visit neighbor 2, create clone", lineNumber: 11 },
    { currentNode: 3, visited: [1, 2, 3], cloned: [1, 2, 3], message: "Visit neighbor 3, create clone", lineNumber: 11 },
    { currentNode: 4, visited: [1, 2, 3, 4], cloned: [1, 2, 3, 4], message: "Visit neighbor 4, create clone", lineNumber: 11 },
    { currentNode: 1, visited: [1, 2, 3, 4], cloned: [1, 2, 3, 4], message: "Node 1 already cloned (cycle detected). Use existing clone", lineNumber: 5 },
    { currentNode: -1, visited: [1, 2, 3, 4], cloned: [1, 2, 3, 4], message: "Complete! All nodes cloned with same structure. Time: O(V+E), Space: O(V)", lineNumber: 15 }
  ];

  const code = `function cloneGraph(node: Node | null): Node | null {
  if (!node) return null;
  const map = new Map<Node, Node>();
  
  function dfs(node: Node): Node {
    if (map.has(node)) return map.get(node)!;
    
    const clone = new Node(node.val);
    map.set(node, clone);
    
    for (const neighbor of node.neighbors) {
      clone.neighbors.push(dfs(neighbor));
    }
    
    return clone;
  }
  
  return dfs(node);
}`;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentStepIndex(0)} disabled={currentStepIndex === 0}><RotateCcw className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))} disabled={currentStepIndex === 0}><SkipBack className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))} disabled={currentStepIndex === steps.length - 1}><SkipForward className="h-4 w-4" /></Button>
          </div>
          <div className="text-sm">Step {currentStepIndex + 1} / {steps.length}</div>
        </div>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Clone Graph</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Original Graph:</div>
              <div className="flex items-center justify-center gap-8 p-6 bg-muted/30 rounded">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${currentStep.currentNode === 1 ? 'bg-primary text-primary-foreground ring-4 ring-primary' : 'bg-secondary'}`}>1</div>
                <div className="text-2xl">—</div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${currentStep.currentNode === 2 ? 'bg-primary text-primary-foreground ring-4 ring-primary' : 'bg-secondary'}`}>2</div>
              </div>
              <div className="flex items-center justify-center gap-8 p-6 bg-muted/30 rounded mt-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${currentStep.currentNode === 4 ? 'bg-primary text-primary-foreground ring-4 ring-primary' : 'bg-secondary'}`}>4</div>
                <div className="text-2xl">—</div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${currentStep.currentNode === 3 ? 'bg-primary text-primary-foreground ring-4 ring-primary' : 'bg-secondary'}`}>3</div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Cloned Nodes:</div>
              <div className="flex gap-2 flex-wrap">
                {currentStep.cloned.length === 0 ? (
                  <div className="text-sm text-muted-foreground">None yet</div>
                ) : (
                  currentStep.cloned.map((node, idx) => (
                    <div key={idx} className="px-4 py-2 rounded-full bg-green-500/20 text-green-600 font-bold">{node}</div>
                  ))
                )}
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded text-sm">{currentStep.message}</div>
            <div className="p-3 bg-blue-500/10 rounded text-xs">
              <strong>Key:</strong> Use HashMap to track cloned nodes. Prevents infinite loops in cyclic graphs.
            </div>
          </div>
        </Card>
        <Card className="p-6 overflow-hidden flex flex-col">
          <h3 className="text-lg font-semibold mb-4">TypeScript</h3>
          <div className="flex-1 overflow-auto">
            <SyntaxHighlighter language="typescript" style={vscDarkPlus} showLineNumbers lineProps={(lineNumber) => ({ style: { backgroundColor: lineNumber === currentStep.lineNumber ? 'rgba(255, 255, 0, 0.2)' : 'transparent', display: 'block' } })}>
              {code}
            </SyntaxHighlighter>
          </div>
        </Card>
      </div>
    </div>
  );
};
