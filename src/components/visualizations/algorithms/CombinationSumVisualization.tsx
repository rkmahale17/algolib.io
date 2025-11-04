import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  candidates: number[];
  target: number;
  current: number[];
  sum: number;
  start: number;
  allCombinations: number[][];
  message: string;
  lineNumber: number;
}

export const CombinationSumVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    { candidates: [2, 3, 6, 7], target: 7, current: [], sum: 0, start: 0, allCombinations: [], message: "Initialize: Find all combinations that sum to 7", lineNumber: 1 },
    { candidates: [2, 3, 6, 7], target: 7, current: [2], sum: 2, start: 0, allCombinations: [], message: "Choose 2 (sum=2, need 5 more)", lineNumber: 9 },
    { candidates: [2, 3, 6, 7], target: 7, current: [2, 2], sum: 4, start: 0, allCombinations: [], message: "Choose another 2 (sum=4, need 3 more)", lineNumber: 9 },
    { candidates: [2, 3, 6, 7], target: 7, current: [2, 2, 2], sum: 6, start: 0, allCombinations: [], message: "Choose third 2 (sum=6, need 1 more)", lineNumber: 9 },
    { candidates: [2, 3, 6, 7], target: 7, current: [2, 2, 2, 2], sum: 8, start: 0, allCombinations: [], message: "Sum exceeds target! Backtrack", lineNumber: 7 },
    { candidates: [2, 3, 6, 7], target: 7, current: [2, 2, 3], sum: 7, start: 1, allCombinations: [[2, 2, 3]], message: "Found combination: [2,2,3]! ✓", lineNumber: 5 },
    { candidates: [2, 3, 6, 7], target: 7, current: [2, 3], sum: 5, start: 1, allCombinations: [[2, 2, 3]], message: "Try [2,3] (sum=5, need 2 more)", lineNumber: 9 },
    { candidates: [2, 3, 6, 7], target: 7, current: [2, 3, 2], sum: 7, start: 0, allCombinations: [[2, 2, 3], [2, 3, 2]], message: "Found: [2,3,2] (same as [2,2,3])", lineNumber: 5 },
    { candidates: [2, 3, 6, 7], target: 7, current: [7], sum: 7, start: 3, allCombinations: [[2, 2, 3], [7]], message: "Found combination: [7]! ✓", lineNumber: 5 },
    { candidates: [2, 3, 6, 7], target: 7, current: [], sum: 0, start: 4, allCombinations: [[2, 2, 3], [7]], message: "Complete! Found 2 unique combinations. Time: O(n^target), Space: O(target)", lineNumber: 12 }
  ];

  const code = `function combinationSum(candidates: number[], target: number): number[][] {
  const result: number[][] = [];
  
  function backtrack(start: number, current: number[], sum: number) {
    if (sum === target) {
      result.push([...current]);
      return;
    }
    if (sum > target) return;
    
    for (let i = start; i < candidates.length; i++) {
      current.push(candidates[i]);
      backtrack(i, current, sum + candidates[i]);
      current.pop();
    }
  }
  
  backtrack(0, [], 0);
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
          <h3 className="text-lg font-semibold mb-4">Combination Sum</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Candidates: {JSON.stringify(currentStep.candidates)}</div>
              <div className="text-sm font-medium mb-2">Target: {currentStep.target}</div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Current Combination (sum={currentStep.sum}):</div>
              <div className="flex gap-2 flex-wrap">
                {currentStep.current.length === 0 ? (
                  <div className="px-3 py-2 rounded bg-muted text-sm">[]</div>
                ) : (
                  currentStep.current.map((num, idx) => (
                    <div key={idx} className="px-3 py-2 rounded bg-primary text-primary-foreground font-mono">{num}</div>
                  ))
                )}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Valid Combinations Found:</div>
              <div className="space-y-2">
                {currentStep.allCombinations.length === 0 ? (
                  <div className="text-sm text-muted-foreground">None yet</div>
                ) : (
                  currentStep.allCombinations.map((combo, idx) => (
                    <div key={idx} className="p-2 rounded bg-green-500/20 text-sm font-mono">{JSON.stringify(combo)}</div>
                  ))
                )}
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
