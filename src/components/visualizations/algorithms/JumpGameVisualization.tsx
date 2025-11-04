import { useState } from 'react';
import { SimpleArrayVisualization } from '../shared/SimpleArrayVisualization';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VisualizationLayout } from '../shared/VisualizationLayout';

export const JumpGameVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const nums = [2, 3, 1, 1, 4];
  
  const steps = [
    {
      array: nums,
      highlighting: [0],
      maxReach: 0,
      variables: { i: 0, maxReach: 0, 'nums[i]': 2 },
      explanation: "Start at index 0. Value is 2, so can jump 1 or 2 steps. Track farthest reachable index.",
      highlightedLine: 2
    },
    {
      array: nums,
      highlighting: [0],
      maxReach: 2,
      variables: { i: 0, maxReach: 2, 'i+nums[i]': '0+2=2' },
      explanation: "From i=0: maxReach = max(0, 0+2) = 2. Can reach up to index 2.",
      highlightedLine: 9
    },
    {
      array: nums,
      highlighting: [1],
      maxReach: 4,
      variables: { i: 1, maxReach: 4, 'i+nums[i]': '1+3=4' },
      explanation: "i=1: maxReach = max(2, 1+3) = 4. Can reach index 4 (the end)!",
      highlightedLine: 9
    },
    {
      array: nums,
      highlighting: [4],
      maxReach: 4,
      variables: { i: 1, maxReach: 4, 'target': 4, canReach: true },
      explanation: "maxReach >= last index (4). Early exit: can reach the end! Time: O(n), Space: O(1).",
      highlightedLine: 13
    }
  ];

  const code = `function canJump(nums: number[]): boolean {
  // Track the farthest position we can reach
  let maxReach = 0;
  
  for (let i = 0; i < nums.length; i++) {
    // If current position is beyond max reach, can't proceed
    if (i > maxReach) {
      return false;
    }
    
    // Update max reach from current position
    maxReach = Math.max(maxReach, i + nums[i]);
    
    // Early exit if we can reach the end
    if (maxReach >= nums.length - 1) {
      return true;
    }
  }
  
  return true;
}`;

  const leftContent = (
    <>
      <SimpleArrayVisualization
        array={steps[currentStep].array}
        highlights={steps[currentStep].highlighting}
        label="Jump distances from each index"
      />
      
      <div className="p-4 bg-primary/20 rounded-lg border border-primary/30">
        <p className="text-sm font-medium">{steps[currentStep].explanation}</p>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg border">
        <div className="text-xs font-semibold mb-2">Max Reach Visualization</div>
        <div className="flex gap-1">
          {nums.map((_, i) => (
            <div key={i} className={`flex-1 h-8 rounded flex items-center justify-center text-xs font-bold ${
              i <= steps[currentStep].maxReach ? 'bg-green-500/30' : 'bg-muted'
            }`}>
              {i}
            </div>
          ))}
        </div>
        <div className="text-xs text-center mt-1 text-muted-foreground">
          Can reach up to index {steps[currentStep].maxReach}
        </div>
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
