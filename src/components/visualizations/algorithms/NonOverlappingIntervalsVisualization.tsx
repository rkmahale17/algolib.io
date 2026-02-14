import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { SimpleStepControls } from '../shared/SimpleStepControls';

interface Step {
  intervals: [number, number][];
  currentIdx: number;
  lastEndTime: number;
  nonOverlappingCount: number;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
  removed?: boolean;
}

export const NonOverlappingIntervalsVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Intervals: [1,2], [2,3], [3,4], [1,3]
  // Sorted: [1,2], [1,3], [2,3], [3,4] (Sorted by end time)

  const steps: Step[] = [
    {
      intervals: [[1, 2], [2, 3], [3, 4], [1, 3]],
      currentIdx: -1,
      lastEndTime: 0,
      nonOverlappingCount: 1,
      variables: { intervals: '[[1,2],[2,3],[3,4],[1,3]]' },
      explanation: "Given overlapping intervals. We want to find the minimum number of intervals to remove.",
      highlightedLines: [1],
      lineExecution: "function eraseOverlapIntervals(intervals: number[][]): number"
    },
    {
      intervals: [[1, 2], [2, 3], [3, 4], [1, 3]],
      currentIdx: -1,
      lastEndTime: 0,
      nonOverlappingCount: 1,
      variables: { length: 4, check: 'length > 0' },
      explanation: "Check if the input array is empty. It has 4 intervals, so we proceed.",
      highlightedLines: [3],
      lineExecution: "if (!intervals || intervals.length === 0) return 0;"
    },
    {
      intervals: [[1, 2], [2, 3], [3, 4], [1, 3]],
      currentIdx: -1,
      lastEndTime: 0,
      nonOverlappingCount: 1,
      variables: { action: 'sorting by end time' },
      explanation: "Sort the intervals based on their end times in ascending order. This is the key greedy choice.",
      highlightedLines: [8],
      lineExecution: "intervals.sort((a, b) => a[1] - b[1]);"
    },
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: -1,
      lastEndTime: 0,
      nonOverlappingCount: 1,
      variables: { sorted: '[[1,2],[1,3],[2,3],[3,4]]' },
      explanation: "Intervals are now sorted: [[1,2], [1,3], [2,3], [3,4]].",
      highlightedLines: [8],
      lineExecution: "// Sorted"
    },
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: -1,
      lastEndTime: 0,
      nonOverlappingCount: 1,
      variables: { count: 1 },
      explanation: "Initialize the count of non-overlapping intervals to 1 (counting the first one implicitly).",
      highlightedLines: [11],
      lineExecution: "let nonOverlappingCount = 1;"
    },
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: 0,
      lastEndTime: 2,
      nonOverlappingCount: 1,
      variables: { lastEnd: 2, first: '[1,2]' },
      explanation: "Initialize lastEndTime with the end time of the first interval [1,2]. So lastEndTime is 2.",
      highlightedLines: [14],
      lineExecution: "let lastEndTime = intervals[0][1]; // 2"
    },
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: 1,
      lastEndTime: 2,
      nonOverlappingCount: 1,
      variables: { i: 1, current: '[1,3]' },
      explanation: "Start iterating from the second interval (index 1), which is [1,3].",
      highlightedLines: [17],
      lineExecution: "for (let i = 1; i < intervals.length; i++) // i=1"
    },
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: 1,
      lastEndTime: 2,
      nonOverlappingCount: 1,
      variables: { start: 1, end: 3 },
      explanation: "Get current interval [1,3] start (1) and end (3).",
      highlightedLines: [19, 20],
      lineExecution: "const currentStartTime = intervals[i][0]; // 1"
    },
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: 1,
      lastEndTime: 2,
      nonOverlappingCount: 1,
      variables: { check: '1 >= 2?', result: 'false' },
      explanation: "Check: Is current start (1) >= lastEndTime (2)? No. This means they overlap.",
      highlightedLines: [23],
      lineExecution: "if (currentStartTime >= lastEndTime) // 1 >= 2? false"
    },
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: 1,
      lastEndTime: 2,
      nonOverlappingCount: 1,
      removed: true,
      variables: { action: 'skip/remove', reason: 'overlap' },
      explanation: "Since they overlap, we do NOT increment count. We effectively 'remove' this interval.",
      highlightedLines: [23],
      lineExecution: "// Overlap detected, skipping"
    },
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: 2,
      lastEndTime: 2,
      nonOverlappingCount: 1,
      variables: { i: 2, current: '[2,3]' },
      explanation: "Next iteration (i=2). Current interval is [2,3].",
      highlightedLines: [17],
      lineExecution: "for (let i = 1; i < intervals.length; i++) // i=2"
    },
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: 2,
      lastEndTime: 2,
      nonOverlappingCount: 1,
      variables: { start: 2, end: 3 },
      explanation: "Current start is 2, end is 3.",
      highlightedLines: [19, 20],
      lineExecution: "const currentStartTime = intervals[i][0]; // 2"
    },
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: 2,
      lastEndTime: 2,
      nonOverlappingCount: 1,
      variables: { check: '2 >= 2?', result: 'true' },
      explanation: "Check: Is current start (2) >= lastEndTime (2)? Yes! (2 >= 2). Value fits.",
      highlightedLines: [23],
      lineExecution: "if (currentStartTime >= lastEndTime) // 2 >= 2? true"
    },
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: 2,
      lastEndTime: 3,
      nonOverlappingCount: 2,
      variables: { count: 2, lastEnd: 3 },
      explanation: "No overlap! Increment nonOverlappingCount to 2. Update lastEndTime to current end (3).",
      highlightedLines: [25, 27],
      lineExecution: "nonOverlappingCount++; lastEndTime = currentEndTime;"
    },
    // i=3, [3,4]
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: 3,
      lastEndTime: 3,
      nonOverlappingCount: 2,
      variables: { i: 3, current: '[3,4]' },
      explanation: "Next iteration (i=3). Current interval is [3,4].",
      highlightedLines: [17],
      lineExecution: "for (let i = 1; i < intervals.length; i++) // i=3"
    },
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: 3,
      lastEndTime: 3,
      nonOverlappingCount: 2,
      variables: { start: 3, end: 4 },
      explanation: "Current start is 3, end is 4.",
      highlightedLines: [19, 20],
      lineExecution: "const currentStartTime = intervals[i][0]; // 3"
    },
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: 3,
      lastEndTime: 3,
      nonOverlappingCount: 2,
      variables: { check: '3 >= 3?', result: 'true' },
      explanation: "Check: Is current start (3) >= lastEndTime (3)? Yes! (3 >= 3).",
      highlightedLines: [23],
      lineExecution: "if (currentStartTime >= lastEndTime) // 3 >= 3? true"
    },
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: 3,
      lastEndTime: 4,
      nonOverlappingCount: 3,
      variables: { count: 3, lastEnd: 4 },
      explanation: "No overlap! Increment nonOverlappingCount to 3. Update lastEndTime to 4.",
      highlightedLines: [25, 27],
      lineExecution: "nonOverlappingCount++; lastEndTime = currentEndTime;"
    },
    {
      intervals: [[1, 2], [1, 3], [2, 3], [3, 4]],
      currentIdx: 3,
      lastEndTime: 4,
      nonOverlappingCount: 3,
      variables: { total: 4, keep: 3, remove: 1 },
      explanation: "Loop finished. Total intervals: 4. Non-overlapping: 3. Result = 4 - 3 = 1.",
      highlightedLines: [33],
      lineExecution: "return intervals.length - nonOverlappingCount; // 4 - 3 = 1"
    }
  ];

  const code = `function eraseOverlapIntervals(intervals: number[][]): number {
  // If the input array is empty, there are no intervals to remove
  if (!intervals || intervals.length === 0) {
    return 0;
  }

  // Sort the intervals based on their end times in ascending order
  intervals.sort((a, b) => a[1] - b[1]);

  // Initialize the count of non-overlapping intervals to 1
  let nonOverlappingCount = 1;

  // Initialize the end time of the last non-overlapping interval
  let lastEndTime = intervals[0][1];

  // Iterate through the sorted intervals starting from the second interval
  for (let i = 1; i < intervals.length; i++) {
    // Get the start and end times of the current interval
    const currentStartTime = intervals[i][0];
    const currentEndTime = intervals[i][1];

    // Check if the current interval overlaps with the last non-overlapping interval
    if (currentStartTime >= lastEndTime) {
      // If the current interval does not overlap, increment the count
      nonOverlappingCount++;
      // Update the end time of the last non-overlapping interval
      lastEndTime = currentEndTime;
    }
  }

  // The minimum number of intervals to remove is the total number of intervals
  // minus the number of non-overlapping intervals
  return intervals.length - nonOverlappingCount;
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
                        ? 'bg-destructive/80 text-destructive-foreground line-through shadow-lg opacity-50'
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

            <div className="grid grid-cols-2 gap-4">
                 <motion.div
                  key={`kept-${currentStepIndex}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-green-500/10 rounded-lg border-2 border-green-500/20"
                >
                  <div className="text-sm font-medium text-muted-foreground mb-1">Non-Overlapping (Kept):</div>
                  <div className="text-3xl font-bold text-green-600">{currentStep.nonOverlappingCount}</div>
                  {currentStep.lastEndTime > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Last End Time: <span className="font-mono text-foreground font-semibold">{currentStep.lastEndTime}</span>
                    </div>
                  )}
                </motion.div>

                <motion.div
                  key={`removals-${currentStepIndex}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-destructive/10 rounded-lg border-2 border-destructive/20"
                >
                  <div className="text-sm font-medium text-muted-foreground mb-1">ToRemove (Result):</div>
                  <div className="text-3xl font-bold text-destructive">
                     {Math.max(0, currentStep.intervals.length - currentStep.nonOverlappingCount)}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                     Total - Kept
                  </div>
                </motion.div>
            </div>

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