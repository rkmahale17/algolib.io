import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  nums: number[];
  range: string;
  dp: number[];
  i: number;
  message: string;
  lineNumber: number;
}

export const HouseRobberIIVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    { nums: [2, 3, 2], range: "", dp: [], i: -1, message: "Houses arranged in circle. Can't rob first AND last", lineNumber: 1 },
    { nums: [2, 3, 2], range: "[0..1]", dp: [2, 3], i: -1, message: "Case 1: Rob houses [0..n-2], excluding last house", lineNumber: 14 },
    { nums: [2, 3, 2], range: "[0..1]", dp: [2, 3], i: 1, message: "Houses 0-1: max = 3", lineNumber: 14 },
    { nums: [2, 3, 2], range: "[1..2]", dp: [3, 3], i: -1, message: "Case 2: Rob houses [1..n-1], excluding first house", lineNumber: 15 },
    { nums: [2, 3, 2], range: "[1..2]", dp: [3, 3], i: 2, message: "Houses 1-2: max(3, 2+0) = 3", lineNumber: 15 },
    { nums: [2, 3, 2], range: "both", dp: [3, 3], i: -1, message: "Result = max(3, 3) = 3. Time: O(n), Space: O(1)", lineNumber: 16 }
  ];

  const code = `function rob(nums: number[]): number {
  if (nums.length === 1) return nums[0];
  
  function robLinear(start: number, end: number): number {
    let prev = 0, curr = 0;
    for (let i = start; i <= end; i++) {
      const temp = Math.max(curr, nums[i] + prev);
      prev = curr;
      curr = temp;
    }
    return curr;
  }
  
  return Math.max(
    robLinear(0, nums.length - 2),
    robLinear(1, nums.length - 1)
  );
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
          <h3 className="text-lg font-semibold mb-4">House Robber II (Circular)</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Houses in Circle:</div>
              <div className="flex gap-2 flex-wrap items-center">
                {currentStep.nums.map((num, idx) => (
                  <div key={idx} className={`px-4 py-3 rounded font-mono text-center ${
                    currentStep.range === "[0..1]" && idx <= 1 ? 'bg-primary text-primary-foreground' :
                    currentStep.range === "[1..2]" && idx >= 1 ? 'bg-primary text-primary-foreground' :
                    'bg-muted'
                  }`}>
                    <div className="text-xs">House {idx}</div>
                    <div className="font-bold">${num}</div>
                  </div>
                ))}
                <div className="text-xl">🔄</div>
              </div>
              {currentStep.range && currentStep.range !== "both" && (
                <div className="text-xs mt-2 text-muted-foreground">Current range: {currentStep.range}</div>
              )}
            </div>
            {currentStep.dp.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-2">Max Money for Range:</div>
                <div className="p-4 bg-green-500/20 rounded text-center">
                  <div className="text-3xl font-bold text-green-600">${currentStep.dp[currentStep.dp.length - 1]}</div>
                </div>
              </div>
            )}
            <div className="p-4 bg-muted/50 rounded text-sm">{currentStep.message}</div>
            <div className="p-3 bg-blue-500/10 rounded text-xs">
              <strong>Key Insight:</strong> Houses form a circle, so we can't rob both house 0 and house n-1. 
              Solution: Run linear rob twice - once excluding last house, once excluding first house.
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
