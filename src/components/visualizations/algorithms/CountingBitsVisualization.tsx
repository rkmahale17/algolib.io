import { useState } from 'react';
import { SimpleArrayVisualization } from '../shared/SimpleArrayVisualization';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { Card } from '@/components/ui/card';

interface Step {
  array: number[];
  highlighting: number[];
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
}

export const CountingBitsVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: Step[] = [
    {
      array: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      highlighting: [],
      variables: { n: 8 },
      explanation: "Starting countBits with n = 8.",
      highlightedLines: [1]
    },
    {
      array: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      highlighting: [],
      variables: { n: 8, dp: "[0,0,0,0,0,0,0,0,0]" },
      explanation: "Initialize dp array of size n + 1 (9) with zeros.",
      highlightedLines: [2]
    },
    {
      array: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      highlighting: [],
      variables: { n: 8, dp: "[0,0,0,0,0,0,0,0,0]", offset: 1 },
      explanation: "Initialize offset = 1.",
      highlightedLines: [3]
    },
    {
      array: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      highlighting: [1],
      variables: { n: 8, dp: "[0,...]", offset: 1, i: 1 },
      explanation: "Start loop at i = 1.",
      highlightedLines: [5]
    },
    {
      array: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      highlighting: [1],
      variables: { n: 8, dp: "[0,...]", offset: 1, i: 1 },
      explanation: "Check power of 2: offset * 2 (2) === i (1)? False.",
      highlightedLines: [6]
    },
    {
      array: [0, 1, 0, 0, 0, 0, 0, 0, 0],
      highlighting: [1, 0],
      variables: { n: 8, dp: "[0,1,...]", offset: 1, i: 1 },
      explanation: "dp[1] = 1 + dp[1 - 1] = 1 + dp[0] = 1 + 0 = 1.",
      highlightedLines: [9]
    },
    {
      array: [0, 1, 0, 0, 0, 0, 0, 0, 0],
      highlighting: [2],
      variables: { n: 8, dp: "[0,1,...]", offset: 1, i: 2 },
      explanation: "Loop i = 2.",
      highlightedLines: [5]
    },
    {
      array: [0, 1, 0, 0, 0, 0, 0, 0, 0],
      highlighting: [2],
      variables: { n: 8, dp: "[0,1,...]", offset: 1, i: 2 },
      explanation: "Check power of 2: offset * 2 (2) === i (2)? True.",
      highlightedLines: [6]
    },
    {
      array: [0, 1, 0, 0, 0, 0, 0, 0, 0],
      highlighting: [2],
      variables: { n: 8, dp: "[0,1,...]", offset: 2, i: 2 },
      explanation: "Update offset = i = 2.",
      highlightedLines: [7]
    },
    {
      array: [0, 1, 1, 0, 0, 0, 0, 0, 0],
      highlighting: [2, 0],
      variables: { n: 8, dp: "[0,1,1,...]", offset: 2, i: 2 },
      explanation: "dp[2] = 1 + dp[2 - 2] = 1 + dp[0] = 1 + 0 = 1.",
      highlightedLines: [9]
    },
    {
      array: [0, 1, 1, 0, 0, 0, 0, 0, 0],
      highlighting: [3],
      variables: { n: 8, dp: "[0,1,1,...]", offset: 2, i: 3 },
      explanation: "Loop i = 3.",
      highlightedLines: [5]
    },
    {
      array: [0, 1, 1, 0, 0, 0, 0, 0, 0],
      highlighting: [3],
      variables: { n: 8, dp: "[0,1,1,...]", offset: 2, i: 3 },
      explanation: "Check power of 2: offset * 2 (4) === i (3)? False.",
      highlightedLines: [6]
    },
    {
      array: [0, 1, 1, 2, 0, 0, 0, 0, 0],
      highlighting: [3, 1],
      variables: { n: 8, dp: "[0,1,1,2,...]", offset: 2, i: 3 },
      explanation: "dp[3] = 1 + dp[3 - 2] = 1 + dp[1] = 1 + 1 = 2.",
      highlightedLines: [9]
    },
    {
      array: [0, 1, 1, 2, 0, 0, 0, 0, 0],
      highlighting: [4],
      variables: { n: 8, dp: "[0,1,1,2,...]", offset: 2, i: 4 },
      explanation: "Loop i = 4.",
      highlightedLines: [5]
    },
    {
      array: [0, 1, 1, 2, 0, 0, 0, 0, 0],
      highlighting: [4],
      variables: { n: 8, dp: "[0,1,1,2,...]", offset: 2, i: 4 },
      explanation: "Check power of 2: offset * 2 (4) === i (4)? True.",
      highlightedLines: [6]
    },
    {
      array: [0, 1, 1, 2, 0, 0, 0, 0, 0],
      highlighting: [4],
      variables: { n: 8, dp: "[0,1,1,2,...]", offset: 4, i: 4 },
      explanation: "Update offset = i = 4.",
      highlightedLines: [7]
    },
    {
      array: [0, 1, 1, 2, 1, 0, 0, 0, 0],
      highlighting: [4, 0],
      variables: { n: 8, dp: "[0,1,1,2,1,...]", offset: 4, i: 4 },
      explanation: "dp[4] = 1 + dp[4 - 4] = 1 + dp[0] = 1 + 0 = 1.",
      highlightedLines: [9]
    },
    {
      array: [0, 1, 1, 2, 1, 0, 0, 0, 0],
      highlighting: [5],
      variables: { n: 8, dp: "[0,1,1,2,1,...]", offset: 4, i: 5 },
      explanation: "Loop i = 5.",
      highlightedLines: [5]
    },
    {
      array: [0, 1, 1, 2, 1, 2, 0, 0, 0],
      highlighting: [5, 1],
      variables: { n: 8, dp: "[0,1,1,2,1,2,...]", offset: 4, i: 5 },
      explanation: "dp[5] = 1 + dp[5 - 4] = 1 + dp[1] = 1 + 1 = 2.",
      highlightedLines: [9]
    },
    {
      array: [0, 1, 1, 2, 1, 2, 0, 0, 0],
      highlighting: [6],
      variables: { n: 8, dp: "[0,1,1,2,1,2,...]", offset: 4, i: 6 },
      explanation: "Loop i = 6.",
      highlightedLines: [5]
    },
    {
      array: [0, 1, 1, 2, 1, 2, 2, 0, 0],
      highlighting: [6, 2],
      variables: { n: 8, dp: "[0,1,1,2,1,2,2,...]", offset: 4, i: 6 },
      explanation: "dp[6] = 1 + dp[6 - 4] = 1 + dp[2] = 1 + 1 = 2.",
      highlightedLines: [9]
    },
    {
      array: [0, 1, 1, 2, 1, 2, 2, 0, 0],
      highlighting: [7],
      variables: { n: 8, dp: "[0,1,1,2,1,2,2,...]", offset: 4, i: 7 },
      explanation: "Loop i = 7.",
      highlightedLines: [5]
    },
    {
      array: [0, 1, 1, 2, 1, 2, 2, 3, 0],
      highlighting: [7, 3],
      variables: { n: 8, dp: "[0,1,1,2,1,2,2,3,...]", offset: 4, i: 7 },
      explanation: "dp[7] = 1 + dp[7 - 4] = 1 + dp[3] = 1 + 2 = 3.",
      highlightedLines: [9]
    },
    {
      array: [0, 1, 1, 2, 1, 2, 2, 3, 0],
      highlighting: [8],
      variables: { n: 8, dp: "[0,1,1,2,1,2,2,3,...]", offset: 4, i: 8 },
      explanation: "Loop i = 8.",
      highlightedLines: [5]
    },
    {
      array: [0, 1, 1, 2, 1, 2, 2, 3, 0],
      highlighting: [8],
      variables: { n: 8, dp: "[0,1,1,2,1,2,2,3,...]", offset: 4, i: 8 },
      explanation: "Check power of 2: offset * 2 (8) === i (8)? True.",
      highlightedLines: [6]
    },
    {
      array: [0, 1, 1, 2, 1, 2, 2, 3, 0],
      highlighting: [8],
      variables: { n: 8, dp: "[0,1,1,2,1,2,2,3,...]", offset: 8, i: 8 },
      explanation: "Update offset = i = 8.",
      highlightedLines: [7]
    },
    {
      array: [0, 1, 1, 2, 1, 2, 2, 3, 1],
      highlighting: [8, 0],
      variables: { n: 8, dp: "[0,1,1,2,1,2,2,3,1]", offset: 8, i: 8 },
      explanation: "dp[8] = 1 + dp[8 - 8] = 1 + dp[0] = 1 + 0 = 1.",
      highlightedLines: [9]
    },
    {
      array: [0, 1, 1, 2, 1, 2, 2, 3, 1],
      highlighting: [],
      variables: { n: 8, dp: "[0,1,1,2,1,2,2,3,1]", offset: 8, i: 9 },
      explanation: "Loop condition i <= n (9 <= 8) is false. Exit loop.",
      highlightedLines: [5]
    },
    {
      array: [0, 1, 1, 2, 1, 2, 2, 3, 1],
      highlighting: [],
      variables: { n: 8, dp: "[0,1,1,2,1,2,2,3,1]" },
      explanation: "Return dp array.",
      highlightedLines: [11]
    }
  ];

  const code = `function countBits(n: number): number[] {
    const dp: number[] = new Array(n + 1).fill(0);
    let offset = 1;

    for (let i = 1; i <= n; i++) {
        if (offset * 2 === i) {
            offset = i;
        }
        dp[i] = 1 + dp[i - offset];
    }
    return dp;
}`;

  const step = steps[currentStep];

  return (
    <div className="space-y-6">
      <StepControls
        isPlaying={false}
        onPlay={() => { }}
        onPause={() => { }}
        onStepForward={() => currentStep < steps.length - 1 && setCurrentStep(prev => prev + 1)}
        onStepBack={() => currentStep > 0 && setCurrentStep(prev => prev - 1)}
        onReset={() => setCurrentStep(0)}
        speed={1}
        onSpeedChange={() => { }}
        currentStep={currentStep}
        totalSteps={steps.length - 1}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-6">
            <SimpleArrayVisualization
              array={step.array}
              highlights={step.highlighting}
              label="dp[] - Number of set bits"
            />
          </Card>

          <Card className="p-4 bg-muted/50">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-primary">Explanation:</div>
              <div className="text-sm text-muted-foreground">
                {step.explanation}
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-muted/50">
            <h3 className="font-semibold mb-2 text-sm">DP Strategy (Offset):</h3>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>• Offset tracks the largest power of 2 less than or equal to i.</p>
              <p>• Bits for i = 1 (most significant bit) + bits for (i - offset).</p>
            </div>
          </Card>

          <VariablePanel variables={step.variables} />
        </div>

        <AnimatedCodeEditor
          code={code}
          highlightedLines={[step.highlightedLines[0]]}
          language="typescript"
        />
      </div>
    </div>
  );
};