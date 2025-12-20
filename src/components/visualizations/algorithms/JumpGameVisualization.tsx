import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';

interface Step {
  nums: number[];
  i: number;
  maxReach: number;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const JumpGameVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nums = [2, 3, 1, 1, 4];

  const steps: Step[] = [
    {
      nums,
      i: -1,
      maxReach: 4, // reusing maxReach field as 'goal' for visualization convenience
      variables: { nums: '[2,3,1,1,4]' },
      explanation: "Given jump array [2,3,1,1,4]. We want to see if we can reach the last index (4). We'll use a Greedy approach starting from the back.",
      highlightedLines: [1],
      lineExecution: "function canJump(nums: number[]): boolean"
    },
    {
      nums,
      i: -1,
      maxReach: 4,
      variables: { goal: 4, 'nums.length': 5 },
      explanation: "Initialize 'goal' to the last index (4). This is the target we need to reach.",
      highlightedLines: [4],
      lineExecution: "let goal = nums.length - 1;"
    },
    {
      nums,
      i: 4,
      maxReach: 4,
      variables: { i: 4, goal: 4 },
      explanation: "Start loop from the last index (4) down to 0.",
      highlightedLines: [7],
      lineExecution: "for (let i = nums.length - 1; i >= 0; i--) // i=4"
    },
    {
      nums,
      i: 4,
      maxReach: 4,
      variables: { i: 4, goal: 4, jump: 4, calc: '4+4 >= 4' },
      explanation: "Check: Can index 4 reach the goal (4)? 4 + nums[4] = 8 >= 4. Yes. It's already the goal.",
      highlightedLines: [12],
      lineExecution: "if (i + nums[i] >= goal) // 4 + 4 >= 4"
    },
    {
      nums,
      i: 4,
      maxReach: 4,
      variables: { goal: 4 },
      explanation: "Update goal found. New goal is index 4.",
      highlightedLines: [13],
      lineExecution: "goal = i; // goal = 4"
    },
    {
      nums,
      i: 3,
      maxReach: 4,
      variables: { i: 3, goal: 4 },
      explanation: "Move to index 3. Goal is still 4.",
      highlightedLines: [7],
      lineExecution: "for (let i = nums.length - 1; i >= 0; i--) // i=3"
    },
    {
      nums,
      i: 3,
      maxReach: 4,
      variables: { i: 3, goal: 4, jump: 1, calc: '3+1 >= 4' },
      explanation: "Check: Can index 3 reach goal (4)? 3 + nums[3] (1) = 4. 4 >= 4. Yes!",
      highlightedLines: [12],
      lineExecution: "if (i + nums[i] >= goal) // 3 + 1 >= 4"
    },
    {
      nums,
      i: 3,
      maxReach: 3,
      variables: { goal: 3 },
      explanation: "Since index 3 can reach the goal, index 3 becomes the new goal.",
      highlightedLines: [13],
      lineExecution: "goal = i; // goal = 3"
    },
    {
      nums,
      i: 2,
      maxReach: 3,
      variables: { i: 2, goal: 3 },
      explanation: "Move to index 2. Goal is now 3.",
      highlightedLines: [7],
      lineExecution: "for ... i=2"
    },
    {
      nums,
      i: 2,
      maxReach: 3,
      variables: { i: 2, goal: 3, jump: 1, calc: '2+1 >= 3' },
      explanation: "Check: Can index 2 reach goal (3)? 2 + 1 = 3. 3 >= 3. Yes!",
      highlightedLines: [12],
      lineExecution: "if (i + nums[i] >= goal) // 2 + 1 >= 3"
    },
    {
      nums,
      i: 2,
      maxReach: 2,
      variables: { goal: 2 },
      explanation: "Index 2 becomes the new goal.",
      highlightedLines: [13],
      lineExecution: "goal = i; // goal = 2"
    },
    {
      nums,
      i: 1,
      maxReach: 2,
      variables: { i: 1, goal: 2 },
      explanation: "Move to index 1. Goal is 2.",
      highlightedLines: [7],
      lineExecution: "for ... i=1"
    },
    {
      nums,
      i: 1,
      maxReach: 2,
      variables: { i: 1, goal: 2, jump: 3, calc: '1+3 >= 2' },
      explanation: "Check: Can index 1 reach goal (2)? 1 + 3 = 4. 4 >= 2. Yes!",
      highlightedLines: [12],
      lineExecution: "if (i + nums[i] >= goal) // 1 + 3 >= 2"
    },
    {
      nums,
      i: 1,
      maxReach: 1,
      variables: { goal: 1 },
      explanation: "Index 1 becomes the new goal.",
      highlightedLines: [13],
      lineExecution: "goal = i; // goal = 1"
    },
    {
      nums,
      i: 0,
      maxReach: 1,
      variables: { i: 0, goal: 1 },
      explanation: "Move to index 0. Goal is 1.",
      highlightedLines: [7],
      lineExecution: "for ... i=0"
    },
    {
      nums,
      i: 0,
      maxReach: 1,
      variables: { i: 0, goal: 1, jump: 2, calc: '0+2 >= 1' },
      explanation: "Check: Can index 0 reach goal (1)? 0 + 2 = 2. 2 >= 1. Yes!",
      highlightedLines: [12],
      lineExecution: "if (i + nums[i] >= goal) // 0 + 2 >= 1"
    },
    {
      nums,
      i: 0,
      maxReach: 0,
      variables: { goal: 0 },
      explanation: "Index 0 becomes the new goal.",
      highlightedLines: [13],
      lineExecution: "goal = i; // goal = 0"
    },
    {
      nums,
      i: -1,
      maxReach: 0,
      variables: { i: -1, goal: 0 },
      explanation: "Loop finished.",
      highlightedLines: [7],
      lineExecution: "i < 0 -> exit loop"
    },
    {
      nums,
      i: -1,
      maxReach: 0,
      variables: { result: true, goal: 0 },
      explanation: "Final check: Is goal == 0? Yes. We found a path from 0 to the end!",
      highlightedLines: [19],
      lineExecution: "return goal === 0; // true"
    }
  ];

  const code = `function canJump(nums: number[]): boolean {
    // 'goal' stores the leftmost index
    // that must be reachable to eventually reach the end
    let goal = nums.length - 1;

    // Iterate from the last index to the first index
    for (let i = nums.length - 1; i >= 0; i--) {

        // nums[i] tells us the maximum jump length from index i
        // If index i can jump to the current goal or beyond,
        // then index i becomes the new goal.
        if (i + nums[i] >= goal) {
            goal = i;
        }
    }

    // If the goal has moved back to index 0,
    // then it is possible to reach the last index.
    return goal === 0;
}`;

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <>
          <motion.div
            key={`array-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Jump Game Array (Goal Strategy)</h3>
              <div className="flex gap-2 flex-wrap justify-center">
                {step.nums.map((num, idx) => (
                  <div
                    key={idx}
                    className={`px-4 py-3 rounded font-mono text-center relative transition-all duration-300 ${
                      // Current index i
                      idx === step.i
                        ? 'ring-2 ring-primary scale-110 z-10'
                        : ''
                    } ${
                      // Goal index coloration
                      idx === step.maxReach 
                        ? 'bg-green-500 text-white shadow-lg' 
                        : idx > step.maxReach 
                        ? 'bg-green-100 opacity-50' // Already solved part (right of goal)
                        : 'bg-muted'
                    }`}
                  >
                    <div className="text-[10px] uppercase font-bold mb-1 opacity-70">
                        {idx === step.maxReach ? 'GOAL' : `IDX ${idx}`}
                    </div>
                    <div className="font-bold text-xl">{num}</div>
                    
                    {/* Visualizing Jump Range */}
                    {idx === step.i && step.i >= 0 && (
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-primary whitespace-nowrap font-semibold">
                            Reaches {idx + num}
                        </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`goal-tracker-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4"
          >
             {/* Simple visualization of the goal moving */}
             <Card className="p-4 bg-orange-50/50 border-orange-200">
                <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-muted-foreground">Current Goal Post:</span>
                    <span className="font-bold text-xl text-orange-600">Index {step.maxReach}</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
                    <div 
                        className="bg-orange-500 h-full transition-all duration-500"
                        style={{ width: `${100 - (step.maxReach / (step.nums.length - 1)) * 100}%` }}
                    />
                </div>
                <div className="text-xs text-right mt-1 text-muted-foreground">
                    dist to start: {step.maxReach} steps
                </div>
             </Card>
          </motion.div>

          <motion.div
            key={`execution-${currentStep}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-4"
          >
            <Card className="p-4 bg-muted/50">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-primary">Current Execution:</div>
                <div className="text-sm font-mono bg-background/50 p-2 rounded">
                  {step.lineExecution}
                </div>
                <div className="text-sm text-muted-foreground pt-2">
                  {step.explanation}
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`variables-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="mt-4"
          >
            <VariablePanel variables={step.variables} />
          </motion.div>
        </>
      }
      rightContent={
        <AnimatedCodeEditor
          code={code}
          language="typescript"
          highlightedLines={step.highlightedLines}
        />
      }
      controls={
        <SimpleStepControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onStepChange={setCurrentStep}
        />
      }
    />
  );
};
