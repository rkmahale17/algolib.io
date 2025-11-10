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
      explanation: "Given unsorted array [100,4,200,1,3,2]. Find longest consecutive sequence (e.g., 1→2→3→4).",
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
      explanation: "Create set for O(1) lookups: {1,2,3,4,100,200}. Sorted for display.",
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
      explanation: "Check num=1. Does 0 exist in set? No! So 1 starts a sequence.",
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
      explanation: "Check: does 2 exist? Yes! Increment: currentNum=2, currentStreak=2.",
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
      explanation: "Check: does 5 exist? No! Sequence [1,2,3,4] ends. Length = 4.",
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
      explanation: "Check num=2. Does 1 exist? Yes! So 2 is NOT a sequence start. Skip.",
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
      explanation: "Check num=3. Does 2 exist? Yes! Skip (not sequence start).",
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
      explanation: "Check num=4. Does 3 exist? Yes! Skip (not sequence start).",
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
      explanation: "Check num=100. Does 99 exist? No! 100 starts sequence. Check 101: No. Length = 1.",
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
      explanation: "Check num=200. Does 199 exist? No! 200 starts sequence. Check 201: No. Length = 1.",
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
      explanation: "Return longestStreak = 4. Longest consecutive sequence: [1,2,3,4].",
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
      explanation: "Algorithm complete! Only check sequence starts (when num-1 doesn't exist). Time: O(n), Space: O(n).",
      highlightedLines: [21],
      lineExecution: "Result: 4 (sequence [1,2,3,4])"
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
          <motion.div
            key={`array-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Original Array</h3>
              <div className="flex gap-2 flex-wrap">
                {step.nums.map((num, idx) => (
                  <div
                    key={idx}
                    className={`w-14 h-14 rounded flex items-center justify-center font-mono text-sm font-bold ${
                      num === step.currentNum
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
          </motion.div>

          {step.numSet.size > 0 && (
            <motion.div
              key={`set-${currentStep}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-3">Number Set (O(1) lookup)</h3>
                <div className="flex gap-2 flex-wrap">
                  {Array.from(step.numSet)
                    .sort((a, b) => a - b)
                    .map((num, idx) => (
                      <div
                        key={idx}
                        className={`w-14 h-14 rounded flex items-center justify-center font-mono text-sm font-bold ${
                          num === step.currentNum
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
            </motion.div>
          )}

          {step.longestStreak > 0 && (
            <motion.div
              key={`streak-${currentStep}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
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
            </motion.div>
          )}

          <motion.div
            key={`execution-${currentStep}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
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
