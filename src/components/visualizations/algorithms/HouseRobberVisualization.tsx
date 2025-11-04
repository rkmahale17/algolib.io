import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  nums: number[];
  dp: number[];
  i: number;
  message: string;
  lineNumber: number;
}

export const HouseRobberVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    { nums: [2, 7, 9, 3, 1], dp: [0, 0, 0, 0, 0], i: -1, message: "Initialize DP array. dp[i] = max money robbing up to house i", lineNumber: 3 },
    { nums: [2, 7, 9, 3, 1], dp: [2, 0, 0, 0, 0], i: 0, message: "House 0: Rob it! dp[0] = 2", lineNumber: 5 },
    { nums: [2, 7, 9, 3, 1], dp: [2, 7, 0, 0, 0], i: 1, message: "House 1: max(2, 7) = 7. Rob house 1", lineNumber: 6 },
    { nums: [2, 7, 9, 3, 1], dp: [2, 7, 11, 0, 0], i: 2, message: "House 2: max(7, 9+2) = 11. Rob houses 0 and 2", lineNumber: 9 },
    { nums: [2, 7, 9, 3, 1], dp: [2, 7, 11, 11, 0], i: 3, message: "House 3: max(11, 3+7) = 11. Skip house 3", lineNumber: 9 },
    { nums: [2, 7, 9, 3, 1], dp: [2, 7, 11, 11, 12], i: 4, message: "House 4: max(11, 1+11) = 12. Rob houses 0,2,4", lineNumber: 9 },
    { nums: [2, 7, 9, 3, 1], dp: [2, 7, 11, 11, 12], i: 5, message: "Complete! Maximum money = $12. Time: O(n), Space: O(n)", lineNumber: 13 }
  ];

  const code = `function rob(nums: number[]): number {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];
  
  const dp = new Array(nums.length);
  dp[0] = nums[0];
  dp[1] = Math.max(nums[0], nums[1]);
  
  for (let i = 2; i < nums.length; i++) {
    dp[i] = Math.max(dp[i-1], nums[i] + dp[i-2]);
  }
  
  return dp[nums.length - 1];
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
          <h3 className="text-lg font-semibold mb-4">House Robber</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Houses (money in each):</div>
              <div className="flex gap-2 flex-wrap">
                {currentStep.nums.map((num, idx) => (
                  <div key={idx} className={`px-4 py-3 rounded font-mono text-center ${idx === currentStep.i ? 'bg-primary text-primary-foreground ring-2 ring-primary' : idx < currentStep.i ? 'bg-secondary' : 'bg-muted'}`}>
                    <div className="text-xs">House {idx}</div>
                    <div className="font-bold">${num}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">DP Array (max money up to house i):</div>
              <div className="flex gap-2 flex-wrap">
                {currentStep.dp.map((val, idx) => (
                  <div key={idx} className={`px-4 py-3 rounded font-mono text-center ${idx === currentStep.i ? 'bg-green-500/20 ring-2 ring-green-500' : idx < currentStep.i ? 'bg-green-500/10' : 'bg-muted'}`}>
                    <div className="text-xs">dp[{idx}]</div>
                    <div className="font-bold">${val}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded text-sm">{currentStep.message}</div>
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
