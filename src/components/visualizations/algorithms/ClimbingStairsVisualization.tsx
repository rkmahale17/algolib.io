import { useState } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VisualizationLayout } from '../shared/VisualizationLayout';

export const ClimbingStairsVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      array: [1, 2],
      variables: { step: 0, prev2: 1, prev1: 2, current: '-' },
      explanation: "Base cases: 1 step = 1 way, 2 steps = 2 ways (1+1 or 2)",
      highlightedLine: 2
    },
    {
      array: [1, 2, 3],
      variables: { step: 3, prev2: 1, prev1: 2, current: 3 },
      explanation: "Step 3: ways = prev1 + prev2 = 2 + 1 = 3 ways",
      highlightedLine: 7
    },
    {
      array: [1, 2, 3, 5],
      variables: { step: 4, prev2: 2, prev1: 3, current: 5 },
      explanation: "Step 4: ways = 3 + 2 = 5 ways",
      highlightedLine: 8
    },
    {
      array: [1, 2, 3, 5, 8],
      variables: { step: 5, prev2: 3, prev1: 5, current: 8 },
      explanation: "Step 5: ways = 5 + 3 = 8 ways. This follows Fibonacci!",
      highlightedLine: 12
    }
  ];

  const code = `function climbStairs(n: number): number {
  if (n <= 2) return n;
  
  let prev2 = 1;  // ways to reach step 1
  let prev1 = 2;  // ways to reach step 2
  
  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  
  return prev1;
}`;

  const leftContent = (
    <>
      <div className="flex justify-center gap-2">
        {steps[currentStep].array.map((ways, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center border-2 border-primary">
              <span className="font-bold text-xl">{ways}</span>
            </div>
            <span className="text-xs mt-2 text-muted-foreground">Step {idx === 0 ? 1 : idx === 1 ? 2 : idx + 1}</span>
          </div>
        ))}
      </div>

      <div className="p-4 bg-primary/20 rounded-lg border border-primary/30">
        <p className="text-sm font-medium">{steps[currentStep].explanation}</p>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg border">
        <h3 className="font-semibold mb-2 text-sm">Pattern:</h3>
        <p className="text-xs text-muted-foreground">
          ways(n) = ways(n-1) + ways(n-2) - just like Fibonacci!
        </p>
      </div>

      <VariablePanel variables={steps[currentStep].variables} />
    </>
  );

  const rightContent = (
    <>
      <div className="text-sm font-semibold text-muted-foreground mb-2">TypeScript</div>
      <CodeHighlighter 
        code={code} 
        language="typescript"
        highlightedLine={steps[currentStep].highlightedLine}
      />
    </>
  );

  const controls = (
    <SimpleStepControls
      currentStep={currentStep}
      totalSteps={steps.length}
      onStepChange={setCurrentStep}
    />
  );

  return (
    <VisualizationLayout
      leftContent={leftContent}
      rightContent={rightContent}
      controls={controls}
    />
  );
};
