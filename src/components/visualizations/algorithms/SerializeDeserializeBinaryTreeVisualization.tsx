import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  tree: (number | null)[];
  serialized: string;
  currentNode: number;
  operation: string;
  message: string;
  lineNumber: number;
}

export const SerializeDeserializeBinaryTreeVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    { tree: [1,2,3,null,null,4,5], serialized: "", currentNode: -1, operation: "serialize", message: "Serialize tree using preorder DFS (root, left, right)", lineNumber: 1 },
    { tree: [1,2,3,null,null,4,5], serialized: "1", currentNode: 0, operation: "serialize", message: "Visit root 1, add to string: '1'", lineNumber: 3 },
    { tree: [1,2,3,null,null,4,5], serialized: "1,2", currentNode: 1, operation: "serialize", message: "Visit left child 2, append: '1,2'", lineNumber: 3 },
    { tree: [1,2,3,null,null,4,5], serialized: "1,2,null,null", currentNode: -1, operation: "serialize", message: "Node 2 has no children, add 'null,null'", lineNumber: 4 },
    { tree: [1,2,3,null,null,4,5], serialized: "1,2,null,null,3,4,null,null,5,null,null", currentNode: 2, operation: "serialize", message: "Visit right subtree, complete serialization", lineNumber: 3 },
    { tree: [1,2,3,null,null,4,5], serialized: "1,2,null,null,3,4,null,null,5,null,null", currentNode: -1, operation: "deserialize", message: "Deserialize: Split string and rebuild tree using same preorder pattern. Time: O(n), Space: O(n)", lineNumber: 10 }
  ];

  const code = `function serialize(root: TreeNode | null): string {
  if (!root) return 'null';
  return \`\${root.val},\${serialize(root.left)},\${serialize(root.right)}\`;
}

function deserialize(data: string): TreeNode | null {
  const values = data.split(',');
  let index = 0;
  
  function build(): TreeNode | null {
    if (values[index] === 'null') {
      index++;
      return null;
    }
    
    const node = new TreeNode(parseInt(values[index++]));
    node.left = build();
    node.right = build();
    return node;
  }
  
  return build();
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
          <h3 className="text-lg font-semibold mb-4">Serialize & Deserialize Binary Tree</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Tree:</div>
              <div className="flex flex-col items-center p-4 bg-muted/30 rounded gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  currentStep.currentNode === 0 ? 'bg-primary text-primary-foreground ring-4 ring-primary' : 'bg-secondary'
                }`}>1</div>
                <div className="flex gap-12">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep.currentNode === 1 ? 'bg-primary text-primary-foreground ring-4 ring-primary' : 'bg-secondary'
                  }`}>2</div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep.currentNode === 2 ? 'bg-primary text-primary-foreground ring-4 ring-primary' : 'bg-secondary'
                  }`}>3</div>
                </div>
                <div className="flex gap-16">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted text-xs">∅</div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted text-xs">∅</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-secondary">4</div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-secondary">5</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Operation: <span className="text-primary font-bold">{currentStep.operation}</span></div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Serialized String:</div>
              <div className="p-3 bg-muted/50 rounded font-mono text-xs break-all">
                {currentStep.serialized || "—"}
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded text-sm">{currentStep.message}</div>
            <div className="p-3 bg-blue-500/10 rounded text-xs">
              <strong>Strategy:</strong> Preorder DFS for serialize. Use 'null' markers for empty nodes. Deserialize by rebuilding tree in same order.
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
