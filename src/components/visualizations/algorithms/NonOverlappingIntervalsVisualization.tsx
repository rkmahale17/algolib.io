import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { SimpleStepControls } from '../shared/SimpleStepControls';

interface Step {
  intervals: [number, number][];
  currentIdx: number;
  prevEnd: number;
  removals: number;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
  removed?: boolean;
}

export const NonOverlappingIntervalsVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const intervals: [number, number][] = [[1, 2], [2, 3], [3, 4], [1, 3]];

  const steps: Step[] = [
    {
      intervals: [[1, 2], [2, 3], [3, 4], [1, 3]],
      currentIdx: -1,
      prevEnd: 0,
      removals: 0,
      variables: { intervals: '[[1,2],[2,3],[3,4],[1,3]]' },
      explanation: "Given overlapping intervals. Find minimum number of intervals to remove so remaining intervals don't overlap.",
      highlightedLines: [1],
      lineExecution: "function eraseOverlapIntervals(intervals)"
    },
    {
      intervals: [[1, 2], [2, 3], [3, 4], [1, 3]],
      currentIdx: -1,
      prevEnd: 0,
      removals: 0,
      variables: { length: 4, check: 'length > 0' },
      explanation: "Check if empty. We have 4 intervals, so continue processing.",
      highlightedLines: [2],
      lineExecution: "if (intervals.length === 0) return 0;"
    },
    {
      intervals: [[1, 2], [2, 3], [3, 4], [1, 3]],
      currentIdx: -1,
      prevEnd: 0,
      removals: 0,
      variables: { action: 'sorting by end time' },
      explanation: "Sort by END time (greedy strategy). This helps us keep maximum non-overlapping intervals.",
      highlightedLines: [4],
      lineExecution: "intervals.sort((a, b) => a[1] - b[1]);"
    },
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: -1,
      prevEnd: 0,
      removals: 0,
      variables: { sorted: '[[1,2],[1,3],[2,3],[3,4]]' },
      explanation: "After sorting by end time: [[1,2],[1,3],[2,3],[3,4]]. Intervals ending earlier come first.",
      highlightedLines: [4],
      lineExecution: "// After sort"
    },
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: -1,
      prevEnd: 0,
      removals: 0,
      variables: { removals: 0 },
      explanation: "Initialize removals counter to track how many intervals we remove.",
      highlightedLines: [6],
      lineExecution: "let removals = 0;"
    },
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: 0,
      prevEnd: 2,
      removals: 0,
      variables: { prevEnd: 2, interval: '[1,2]' },
      explanation: "Initialize prevEnd with first interval's end time (2). This is our baseline.",
      highlightedLines: [7],
      lineExecution: "let prevEnd = intervals[0][1]; // 2"
    },
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: 1,
      prevEnd: 2,
      removals: 0,
      variables: { i: 1, checking: '[1,3]' },
      explanation: "Start loop from second interval (i=1). Check [1,3] against prevEnd.",
      highlightedLines: [9],
      lineExecution: "for (let i = 1; i < intervals.length; i++) // i=1"
    },
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: 1,
      prevEnd: 2,
      removals: 0,
      variables: { check: '1 < 2?', result: 'true' },
      explanation: "Check if [1,3] overlaps: does it start (1) before prevEnd (2)? Yes! 1 < 2, so overlap detected.",
      highlightedLines: [10],
      lineExecution: "if (intervals[i][0] < prevEnd) // 1 < 2? true"
    },
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: 1,
      prevEnd: 2,
      removals: 1,
      removed: true,
      variables: { removals: 1, action: 'remove [1,3]' },
      explanation: "Remove [1,3] since it overlaps with [1,2]. Increment removals to 1. Keep prevEnd=2.",
      highlightedLines: [11],
      lineExecution: "removals++; // removals = 1"
    },
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: 2,
      prevEnd: 2,
      removals: 1,
      variables: { i: 2, checking: '[2,3]' },
      explanation: "Continue to next interval (i=2). Check [2,3] against prevEnd=2.",
      highlightedLines: [9],
      lineExecution: "for (let i = 1; i < intervals.length; i++) // i=2"
    },
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: 2,
      prevEnd: 2,
      removals: 1,
      variables: { check: '2 < 2?', result: 'false' },
      explanation: "Check if [2,3] overlaps: does it start (2) before prevEnd (2)? No! 2 >= 2, no overlap.",
      highlightedLines: [10],
      lineExecution: "if (intervals[i][0] < prevEnd) // 2 < 2? false"
    },
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: 2,
      prevEnd: 3,
      removals: 1,
      variables: { prevEnd: 3, action: 'keep [2,3]' },
      explanation: "No overlap! Keep [2,3] and update prevEnd to 3 (end of current interval).",
      highlightedLines: [13],
      lineExecution: "prevEnd = intervals[i][1]; // prevEnd = 3"
    },
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: 3,
      prevEnd: 3,
      removals: 1,
      variables: { i: 3, checking: '[3,4]' },
      explanation: "Continue to last interval (i=3). Check [3,4] against prevEnd=3.",
      highlightedLines: [9],
      lineExecution: "for (let i = 1; i < intervals.length; i++) // i=3"
    },
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: 3,
      prevEnd: 3,
      removals: 1,
      variables: { check: '3 < 3?', result: 'false' },
      explanation: "Check if [3,4] overlaps: does it start (3) before prevEnd (3)? No! 3 >= 3, no overlap.",
      highlightedLines: [10],
      lineExecution: "if (intervals[i][0] < prevEnd) // 3 < 3? false"
    },
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: 3,
      prevEnd: 4,
      removals: 1,
      variables: { prevEnd: 4, action: 'keep [3,4]' },
      explanation: "No overlap! Keep [3,4] and update prevEnd to 4. Final non-overlapping set: [1,2], [2,3], [3,4].",
      highlightedLines: [13],
      lineExecution: "prevEnd = intervals[i][1]; // prevEnd = 4"
    },
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: 3,
      prevEnd: 4,
      removals: 1,
      variables: { result: 1 },
      explanation: "Return removals count: 1 interval removed ([1,3]).",
      highlightedLines: [16],
      lineExecution: "return removals; // 1"
    },
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: 3,
      prevEnd: 4,
      removals: 1,
      variables: { result: 1, time: 'O(n log n)', space: 'O(1)' },
      explanation: "Algorithm complete! Minimum 1 interval to remove. Time: O(n log n) for sorting. Space: O(1) constant space.",
      highlightedLines: [16],
      lineExecution: "Result: 1"
    }
  ];

  const code = `function eraseOverlapIntervals(intervals: number[][]): number {
  if (intervals.length === 0) return 0;
  
  intervals.sort((a, b) => a[1] - b[1]);
  
  let removals = 0;
  let prevEnd = intervals[0][1];
  
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < prevEnd) {
      removals++;
    } else {
      prevEnd = intervals[i][1];
    }
  }
  
  return removals;
}`;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Non-Overlapping Intervals</h3>
          <div className="space-y-4">
            <motion.div 
              key={`intervals-${currentStepIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <div className="text-sm font-medium text-muted-foreground">Intervals (sorted by end):</div>
              <div className="flex gap-2 flex-wrap">
                {currentStep.intervals.map((interval, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`px-3 py-2 rounded font-mono transition-all ${
                      idx === currentStep.currentIdx && currentStep.removed
                        ? 'bg-destructive/80 text-destructive-foreground line-through shadow-lg'
                        : idx === currentStep.currentIdx 
                        ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                        : idx < currentStep.currentIdx 
                        ? 'bg-secondary/50 text-secondary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    [{interval[0]}, {interval[1]}]
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              key={`removals-${currentStepIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-primary/20 rounded-lg border-2 border-primary"
            >
              <div className="text-sm font-medium text-muted-foreground mb-1">Intervals Removed:</div>
              <div className="text-3xl font-bold text-primary">{currentStep.removals}</div>
              {currentStep.prevEnd > 0 && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Previous end time: {currentStep.prevEnd}
                </div>
              )}
            </motion.div>

            <motion.div
              key={`execution-${currentStepIndex}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 bg-secondary/30 rounded border-l-4 border-secondary"
            >
              <div className="text-xs font-semibold text-secondary-foreground mb-1">Executing:</div>
              <code className="text-xs text-foreground font-mono">{currentStep.lineExecution}</code>
            </motion.div>

            <motion.div
              key={`explanation-${currentStepIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-muted/50 rounded text-sm leading-relaxed"
            >
              {currentStep.explanation}
            </motion.div>

            <motion.div
              key={`variables-${currentStepIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <VariablePanel variables={currentStep.variables} />
            </motion.div>
          </div>
        </Card>

        <Card className="p-6 overflow-hidden flex flex-col">
          <h3 className="text-lg font-semibold mb-4">TypeScript Implementation</h3>
          <div className="flex-1 overflow-auto">
            <AnimatedCodeEditor 
              code={code} 
              language="typescript" 
              highlightedLines={currentStep.highlightedLines}
            />
          </div>
        </Card>
      </div>

      <SimpleStepControls
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        onStepChange={setCurrentStepIndex}
      />
    </div>
  );
};