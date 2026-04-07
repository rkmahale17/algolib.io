import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';

interface Step {
  nums: number[];
  numSet: Set<number>;
  currentNum: number | null;
  checking: number | null;
  longestStreak: number;
  currentStreak: number;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const LongestConsecutiveSequenceVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nums = [100, 4, 200, 1, 3, 2];

  const steps: Step[] = [
    {
      nums,
      numSet: new Set(),
      currentNum: null,
      checking: null,
      longestStreak: 0,
      currentStreak: 0,
      variables: { nums: '[100,4,200,1,3,2]' },
      explanation: "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.",
      highlightedLines: [1],
      lineExecution: "function longestConsecutive(nums: number[]): number"
    },
    {
      nums,
      numSet: new Set(),
      currentNum: null,
      checking: null,
      longestStreak: 0,
      currentStreak: 0,
      variables: { length: 6 },
      explanation: "Check edge case: nums.length > 0, continue.",
      highlightedLines: [2],
      lineExecution: "if (nums.length === 0) return 0; // false"
    },
    {
      nums,
      numSet: new Set([100, 4, 200, 1, 3, 2]),
      currentNum: null,
      checking: null,
      longestStreak: 0,
      currentStreak: 0,
      variables: { numSet: '{1,2,3,4,100,200}' },
      explanation: "Create a Set from the array. This allows us to check if a number exists in O(1) time, which is key to maintaining O(n) overall complexity.",
      highlightedLines: [4],
      lineExecution: "const numSet = new Set(nums);"
    },
    {
      nums,
      numSet: new Set([100, 4, 200, 1, 3, 2]),
      currentNum: null,
      checking: null,
      longestStreak: 0,
      currentStreak: 0,
      variables: { longestStreak: 0 },
      explanation: "Initialize longestStreak = 0 to track maximum consecutive length found.",
      highlightedLines: [5],
      lineExecution: "let longestStreak = 0;"
    },
    {
      nums,
      numSet: new Set([100, 4, 200, 1, 3, 2]),
      currentNum: 1,
      checking: 0,
      longestStreak: 0,
      currentStreak: 0,
      variables: { num: 1, 'num-1': 0 },
      explanation: "We only start counting a sequence from its smallest element. Since 0 is not in the set, 1 must be the start of a potential sequence.",
      highlightedLines: [7, 8],
      lineExecution: "for (const num of numSet) if (!numSet.has(num - 1)) // !has(0) -> true"
    },
    {
      nums,
      numSet: new Set([100, 4, 200, 1, 3, 2]),
      currentNum: 1,
      checking: null,
      longestStreak: 0,
      currentStreak: 1,
      variables: { currentNum: 1, currentStreak: 1 },
      explanation: "1 starts sequence. Initialize: currentNum=1, currentStreak=1.",
      highlightedLines: [9, 10],
      lineExecution: "let currentNum = num; let currentStreak = 1;"
    },
    {
      nums,
      numSet: new Set([100, 4, 200, 1, 3, 2]),
      currentNum: 2,
      checking: 2,
      longestStreak: 0,
      currentStreak: 2,
      variables: { 'checking': 2, found: true },
      explanation: "Check the set for the next consecutive number (2). It exists! We increment the current streak to 2.",
      highlightedLines: [12, 13, 14],
      lineExecution: "while (numSet.has(currentNum + 1)) currentNum++; // 2 exists"
    },
    {
      nums,
      numSet: new Set([100, 4, 200, 1, 3, 2]),
      currentNum: 3,
      checking: 3,
      longestStreak: 0,
      currentStreak: 3,
      variables: { currentNum: 3, currentStreak: 3 },
      explanation: "Check: does 3 exist? Yes! Increment: currentNum=3, currentStreak=3.",
      highlightedLines: [12, 13, 14],
      lineExecution: "while (numSet.has(3 + 1)) // 3 exists"
    },
    {
      nums,
      numSet: new Set([100, 4, 200, 1, 3, 2]),
      currentNum: 4,
      checking: 4,
      longestStreak: 0,
      currentStreak: 4,
      variables: { currentNum: 4, currentStreak: 4 },
      explanation: "Check: does 4 exist? Yes! Increment: currentNum=4, currentStreak=4.",
      highlightedLines: [12, 13, 14],
      lineExecution: "while (numSet.has(4 + 1)) // 4 exists"
    },
    {
      nums,
      numSet: new Set([100, 4, 200, 1, 3, 2]),
      currentNum: 4,
      checking: 5,
      longestStreak: 0,
      currentStreak: 4,
      variables: { 'checking': 5, found: false },
      explanation: "Check for 5. It's not in the set, so the current sequence [1, 2, 3, 4] is complete with a length of 4.",
      highlightedLines: [12],
      lineExecution: "while (numSet.has(4 + 1)) // false, exit loop"
    },
    {
      nums,
      numSet: new Set([100, 4, 200, 1, 3, 2]),
      currentNum: 4,
      checking: null,
      longestStreak: 4,
      currentStreak: 4,
      variables: { longestStreak: 4 },
      explanation: "Update longestStreak: max(0, 4) = 4. Found sequence [1,2,3,4].",
      highlightedLines: [17],
      lineExecution: "longestStreak = Math.max(longestStreak, currentStreak); // max(0,4) = 4"
    },
    {
      nums,
      numSet: new Set([100, 4, 200, 1, 3, 2]),
      currentNum: 2,
      checking: 1,
      longestStreak: 4,
      currentStreak: 0,
      variables: { num: 2, 'num-1': 1 },
      explanation: "Check num=2. Since 1 is in the set, 2 is already part of a sequence we've either processed or will process from its start. Skip it to avoid redundant work.",
      highlightedLines: [7, 8],
      lineExecution: "if (!numSet.has(num - 1)) // !has(1) -> false, skip"
    },
    {
      nums,
      numSet: new Set([100, 4, 200, 1, 3, 2]),
      currentNum: 3,
      checking: 2,
      longestStreak: 4,
      currentStreak: 0,
      variables: { num: 3 },
      explanation: "Checking 3. Since 2 is in the set, we know 3 is part of a sequence that starts at a number smaller than 3. We skip it, knowing we've already counted it when we processed its sequence starting from 1.",
      highlightedLines: [7, 8],
      lineExecution: "if (!numSet.has(2)) // false, skip"
    },
    {
      nums,
      numSet: new Set([100, 4, 200, 1, 3, 2]),
      currentNum: 4,
      checking: 3,
      longestStreak: 4,
      currentStreak: 0,
      variables: { num: 4 },
      explanation: "Checking 4. Since 3 is in the set, 4 is not the start of a sequence. Skipping to maintain O(n) complexity, ensuring each number is only part of one while-loop iteration.",
      highlightedLines: [7, 8],
      lineExecution: "if (!numSet.has(3)) // false, skip"
    },
    {
      nums,
      numSet: new Set([100, 4, 200, 1, 3, 2]),
      currentNum: 100,
      checking: 99,
      longestStreak: 4,
      currentStreak: 1,
      variables: { num: 100 },
      explanation: "Checking 100. 99 is not in the set, so 100 starts a sequence. We check for 101, which isn't there, so this sequence has length 1.",
      highlightedLines: [7, 8, 9, 10, 12],
      lineExecution: "!numSet.has(99) -> true; !numSet.has(101) -> exit; streak = 1"
    },
    {
      nums,
      numSet: new Set([100, 4, 200, 1, 3, 2]),
      currentNum: 200,
      checking: 199,
      longestStreak: 4,
      currentStreak: 1,
      variables: { num: 200 },
      explanation: "Checking 200. Since 199 is not in the set, 200 starts its own sequence. We check for 201, find it's also missing, so this sequence length is 1.",
      highlightedLines: [7, 8, 9, 10, 12],
      lineExecution: "!numSet.has(199) -> true; !numSet.has(201) -> exit; streak = 1"
    },
    {
      nums,
      numSet: new Set([100, 4, 200, 1, 3, 2]),
      currentNum: null,
      checking: null,
      longestStreak: 4,
      currentStreak: 0,
      variables: { result: 4, sequence: '[1,2,3,4]' },
      explanation: "All numbers in the set have been checked. The longest consecutive sequence found was [1, 2, 3, 4] with a length of 4.",
      highlightedLines: [21],
      lineExecution: "return longestStreak; // 4"
    },
    {
      nums,
      numSet: new Set([100, 4, 200, 1, 3, 2]),
      currentNum: null,
      checking: null,
      longestStreak: 4,
      currentStreak: 0,
      variables: { length: 4, complexity: 'O(n)' },
      explanation: "Visualization complete. By only starting sequences from elements with no predecessor, we ensure each element is visited at most twice (once in the main loop, once in a while loop), achieving O(n) time complexity.",
      highlightedLines: [21],
      lineExecution: "Result: 4"
    }
  ];

  const code = `function longestConsecutive(nums: number[]): number {
  if (nums.length === 0) return 0;
  
  const numSet = new Set(nums);
  let longestStreak = 0;
  
  for (const num of numSet) {
    if (!numSet.has(num - 1)) {
      let currentNum = num;
      let currentStreak = 1;
      
      while (numSet.has(currentNum + 1)) {
        currentNum++;
        currentStreak++;
      }
      
      longestStreak = Math.max(longestStreak, currentStreak);
    }
  }
  
  return longestStreak;
}`;

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <>
          <div
            key={`array-${currentStep}`}
          >
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Original Array</h3>
              <div className="flex gap-2 flex-wrap">
                {step.nums.map((num, idx) => (
                  <div
                    key={idx}
                    className={`w-14 h-14 rounded flex items-center justify-center font-mono text-sm ${num === step.currentNum
                      ? 'bg-primary text-primary-foreground'
                      : num === step.checking
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted'
                      }`}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {step.numSet.size > 0 && (
            <div
              key={`set-${currentStep}`}
            >
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-3">Number Set (O(1) lookup)</h3>
                <div className="flex gap-2 flex-wrap">
                  {Array.from(step.numSet)
                    .sort((a, b) => a - b)
                    .map((num, idx) => (
                      <div
                        key={idx}
                        className={`w-14 h-14 rounded flex items-center justify-center font-mono text-sm ${num === step.currentNum
                          ? 'bg-primary text-primary-foreground'
                          : num === step.checking
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-secondary/50'
                          }`}
                      >
                        {num}
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          )}

          {step.longestStreak > 0 && (
            <div
              key={`streak-${currentStep}`}
            >
              <Card className="p-4">
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-semibold">Longest Streak:</span> {step.longestStreak}
                  </div>
                  {step.currentStreak > 0 && (
                    <div className="text-sm">
                      <span className="font-semibold">Current Streak:</span> {step.currentStreak}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          <div
            key={`execution-${currentStep}`}
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
          </div>

          <div
            key={`variables-${currentStep}`}
          >
            <VariablePanel variables={step.variables} />
          </div>
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
