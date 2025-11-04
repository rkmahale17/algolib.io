import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  tree: (number | null)[];
  queue: number[];
  result: number[][];
  currentLevel: number[];
  message: string;
  lineNumber: number;
}

export const BinaryTreeLevelOrderVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    { tree: [3,9,20,null,null,15,7], queue: [3], result: [], currentLevel: [], message: "Start BFS from root. Queue: [3]", lineNumber: 5 },
    { tree: [3,9,20,null,null,15,7], queue: [], result: [[3]], currentLevel: [3], message: "Level 0: Process node 3. Add children 9,20 to queue", lineNumber: 9 },
    { tree: [3,9,20,null,null,15,7], queue: [9,20], result: [[3]], currentLevel: [], message: "Queue now: [9, 20]. Start level 1", lineNumber: 11 },
    { tree: [3,9,20,null,null,15,7], queue: [], result: [[3],[9,20]], currentLevel: [9,20], message: "Level 1: Process 9 and 20. Add children 15,7", lineNumber: 9 },
    { tree: [3,9,20,null,null,15,7], queue: [15,7], result: [[3],[9,20]], currentLevel: [], message: "Queue now: [15, 7]. Start level 2", lineNumber: 11 },
    { tree: [3,9,20,null,null,15,7], queue: [], result: [[3],[9,20],[15,7]], currentLevel: [15,7], message: "Level 2: Process 15 and 7 (leaves). Complete! Time: O(n), Space: O(n)", lineNumber: 14 }
  ];

  const code = `function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  
  const result: number[][] = [];
  const queue: TreeNode[] = [root];
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel: number[] = [];
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      currentLevel.push(node.val);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(currentLevel);
  }
  
  return result;
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
          <h3 className="text-lg font-semibold mb-4">Binary Tree Level Order Traversal</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Tree Structure:</div>
              <div className="flex flex-col items-center p-4 bg-muted/30 rounded gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-secondary">3</div>
                <div className="flex gap-12">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-secondary">9</div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-secondary">20</div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-secondary">15</div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-secondary">7</div>
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Queue:</div>
              <div className="flex gap-2 min-h-[40px]">
                {currentStep.queue.length === 0 ? (
                  <div className="text-sm text-muted-foreground">Empty</div>
                ) : (
                  currentStep.queue.map((val, idx) => (
                    <div key={idx} className="px-4 py-2 rounded bg-blue-500/20 text-blue-600 font-bold">{val}</div>
                  ))
                )}
              </div>
            </div>
            {currentStep.currentLevel.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-2">Current Level:</div>
                <div className="flex gap-2">
                  {currentStep.currentLevel.map((val, idx) => (
                    <div key={idx} className="px-4 py-2 rounded bg-green-500/20 text-green-600 font-bold">{val}</div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <div className="text-sm font-medium mb-2">Result:</div>
              <div className="p-3 bg-muted/50 rounded font-mono text-sm">
                {currentStep.result.length === 0 ? '[]' : JSON.stringify(currentStep.result)}
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded text-sm">{currentStep.message}</div>
            <div className="p-3 bg-blue-500/10 rounded text-xs">
              <strong>BFS Pattern:</strong> Use queue to process nodes level by level. Process all nodes at current level before moving to next.
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
