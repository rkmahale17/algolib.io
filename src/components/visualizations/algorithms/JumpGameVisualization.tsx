import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  nums: number[];
  i: number;
  maxReach: number;
  message: string;
  lineNumber: number;
}

export const JumpGameVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    { nums: [2, 3, 1, 1, 4], i: -1, maxReach: 0, message: "Can we reach the last index? Each value = max jump from that position", lineNumber: 2 },
    { nums: [2, 3, 1, 1, 4], i: 0, maxReach: 2, message: "Index 0: value=2, can reach up to index 2. maxReach=2", lineNumber: 8 },
    { nums: [2, 3, 1, 1, 4], i: 1, maxReach: 4, message: "Index 1: value=3, can reach up to index 4. maxReach=4 (reached end!)", lineNumber: 8 },
    { nums: [2, 3, 1, 1, 4], i: 2, maxReach: 4, message: "Index 2: value=1, can reach up to index 3. maxReach stays 4", lineNumber: 8 },
    { nums: [2, 3, 1, 1, 4], i: 3, maxReach: 4, message: "Index 3: value=1, can reach up to index 4. maxReach=4", lineNumber: 8 },
    { nums: [2, 3, 1, 1, 4], i: 5, maxReach: 4, message: "Success! Can reach last index (4). Time: O(n), Space: O(1)", lineNumber: 13 }
  ];

  const code = `function canJump(nums: number[]): boolean {
  let maxReach = 0;
  
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
    if (maxReach >= nums.length - 1) return true;
  }
  
  return false;
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
          <h3 className="text-lg font-semibold mb-4">Jump Game</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Array (max jump from each index):</div>
              <div className="flex gap-2 flex-wrap">
                {currentStep.nums.map((num, idx) => (
                  <div key={idx} className={`px-4 py-3 rounded font-mono text-center relative ${
                    idx === currentStep.i ? 'bg-primary text-primary-foreground ring-2 ring-primary' :
                    idx < currentStep.i ? 'bg-secondary' :
                    idx <= currentStep.maxReach && currentStep.i >= 0 ? 'bg-green-500/20' :
                    'bg-muted'
                  }`}>
                    <div className="text-xs">Index {idx}</div>
                    <div className="font-bold text-xl">{num}</div>
                    {idx === currentStep.nums.length - 1 && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">🎯</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Max Reachable Index:</div>
              <div className="p-4 bg-green-500/20 rounded text-center">
                <div className="text-3xl font-bold text-green-600">{currentStep.maxReach}</div>
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded text-sm">{currentStep.message}</div>
            <div className="p-3 bg-blue-500/10 rounded text-xs">
              <strong>Greedy Approach:</strong> Track the furthest index we can reach. If current index &gt; maxReach, we're stuck!
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
