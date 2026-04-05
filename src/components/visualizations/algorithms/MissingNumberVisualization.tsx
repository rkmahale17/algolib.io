import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";

export const MissingNumberVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nums = [3, 0, 1];

  const steps = [
    {
      array: nums,
      highlighting: [],
      variables: { res: 3, n: 3 },
      explanation: "Initialize res = n = 3. This accounts for the missing index n in the 0..n range.",
      highlightedLine: 2
    },
    {
      array: nums,
      highlighting: [],
      variables: { res: 3, i: 0, 'nums[0]': 3 },
      explanation: "Start loop at i = 0. We will compute diff = i - nums[i].",
      highlightedLine: 3
    },
    {
      array: nums,
      highlighting: [0],
      variables: { res: 3, i: 0, 'nums[0]': 3, diff: -3 },
      explanation: "Calculate difference: i - nums[i] = 0 - 3 = -3.",
      highlightedLine: 4,
      calc: '0 - 3 = -3'
    },
    {
      array: nums,
      highlighting: [0],
      variables: { res: 0, i: 0, 'nums[i]': 3, prevRes: 3 },
      explanation: "Update res: res += -3 → 3 + (-3) = 0.",
      highlightedLine: 4,
      calc: '3 + (-3) = 0'
    },
    {
      array: nums,
      highlighting: [],
      variables: { res: 0, i: 1, 'nums[1]': 0 },
      explanation: "Loop: i = 1. We will compute diff = i - nums[i].",
      highlightedLine: 3
    },
    {
      array: nums,
      highlighting: [1],
      variables: { res: 0, i: 1, 'nums[1]': 0, diff: 1 },
      explanation: "Calculate difference: i - nums[i] = 1 - 0 = 1.",
      highlightedLine: 4,
      calc: '1 - 0 = 1'
    },
    {
      array: nums,
      highlighting: [1],
      variables: { res: 1, i: 1, 'nums[i]': 0, prevRes: 0 },
      explanation: "Update res: res += 1 → 0 + 1 = 1.",
      highlightedLine: 4,
      calc: '0 + 1 = 1'
    },
    {
      array: nums,
      highlighting: [],
      variables: { res: 1, i: 2, 'nums[2]': 1 },
      explanation: "Loop: i = 2. We will compute diff = i - nums[i].",
      highlightedLine: 3
    },
    {
      array: nums,
      highlighting: [2],
      variables: { res: 1, i: 2, 'nums[2]': 1, diff: 1 },
      explanation: "Calculate difference: i - nums[i] = 2 - 1 = 1.",
      highlightedLine: 4,
      calc: '2 - 1 = 1'
    },
    {
      array: nums,
      highlighting: [2],
      variables: { res: 2, i: 2, 'nums[i]': 1, prevRes: 1 },
      explanation: "Update res: res += 1 → 1 + 1 = 2.",
      highlightedLine: 4,
      calc: '1 + 1 = 2'
    },
    {
      array: nums,
      highlighting: [],
      variables: { res: 2 },
      explanation: "Loop finished. The accumulated result is the missing number: 2.",
      highlightedLine: 6,
      calc: 'Result: 2'
    }
  ];

  const code = `function missingNumber(nums: number[]): number {
    let res = nums.length;
    for (let i = 0; i < nums.length; i++) {
        res += i - nums[i];
    }
    return res;
}`;

  const step = steps[currentStep];

  return (
    <div className="space-y-6">
      <StepControls
        isPlaying={false}
        onPlay={() => {}}
        onPause={() => {}}
        onStepForward={() => currentStep < steps.length - 1 && setCurrentStep(prev => prev + 1)}
        onStepBack={() => currentStep > 0 && setCurrentStep(prev => prev - 1)}
        onReset={() => setCurrentStep(0)}
        speed={1}
        onSpeedChange={() => {}}
        currentStep={currentStep}
        totalSteps={steps.length - 1}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-sm font-semibold mb-3">Input Array (nums)</h3>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {step.array.map((value, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-14 h-14 rounded flex items-center justify-center font- transition-all duration-300 ${step.highlighting.includes(index)
                      ? 'bg-primary text-primary-foreground scale-110'
                      : 'bg-muted text-foreground'
                      }`}
                  >
                    {value}
                  </div>
                  <span className="text-xs text-muted-foreground">i = {index}</span>
                </div>
              ))}
              <div className="flex flex-col items-center gap-2 opacity-50 border border-dashed rounded p-1">
                <div className="w-12 h-12 flex items-center justify-center text-xs text-center text-muted-foreground">
                  n = {nums.length}
                </div>
              </div>
            </div>
          </Card>

          {step.calc && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2 text-sm">Calculation</h3>
              <p className="font-mono text-center text-lg">{step.calc}</p>
            </Card>
          )}

          <Card className="p-4 bg-muted/50">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-primary">Explanation:</div>
              <div className="text-sm text-muted-foreground">
                {step.explanation}
              </div>
            </div>
          </Card>

          <VariablePanel variables={step.variables} />

          <Card className="p-4 bg-muted/20">
            <h3 className="font-semibold mb-2 text-sm">Why this works?</h3>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>Consider the sum of indices [0...n] and sum of values in array.</p>
              <p>Missing Number = Sum(0...n) - Sum(nums)</p>
              <p>This approach computes this difference incrementally to avoid separate loops or potential overflow (though less of an issue here than complex multiplication).</p>
              <p>res ends up being accumulating `n + (0-nums[0]) + (1-nums[1]) ...` which effectively re-arranges to `(n + 0 + 1 + ... ) - (nums[0] + nums[1] + ...)`.</p>
            </div>
          </Card>
        </div>

        <AnimatedCodeEditor
          code={code}
          highlightedLines={[step.highlightedLine]}
          language="typescript"
        />
      </div>
    </div>
  );
};