import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { SimpleStepControls } from '../shared/SimpleStepControls';

interface Step {
  intervals: [number, number][];
  merged: [number, number][];
  currentIdx: number;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const MergeIntervalsVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const intervals: [number, number][] = [[1, 3], [2, 6], [8, 10], [15, 18]];

  const steps: Step[] = [
    {
      intervals: [[1, 3], [2, 6], [8, 10], [15, 18]],
      merged: [],
      currentIdx: -1,
      variables: { intervals: '[[1,3],[2,6],[8,10],[15,18]]' },
      explanation: "Given a collection of intervals. Merge all overlapping intervals into non-overlapping intervals.",
      highlightedLines: [1],
      lineExecution: "function merge(intervals)"
    },
    {
      intervals: [[1, 3], [2, 6], [8, 10], [15, 18]],
      merged: [],
      currentIdx: -1,
      variables: { length: 4, check: 'length > 0' },
      explanation: "Check if intervals array is empty. We have 4 intervals, so continue.",
      highlightedLines: [2],
      lineExecution: "if (intervals.length === 0) return [];"
    },
    {
      intervals: [[1, 3], [2, 6], [8, 10], [15, 18]],
      merged: [],
      currentIdx: -1,
      variables: { action: 'sorting by start time' },
      explanation: "Sort intervals by start time to process them in order.",
      highlightedLines: [3],
      lineExecution: "intervals.sort((a, b) => a[0] - b[0]);"
    },
    {
      intervals: [[1, 3], [2, 6], [8, 10], [15, 18]],
      merged: [],
      currentIdx: -1,
      variables: { sorted: '[[1,3],[2,6],[8,10],[15,18]]' },
      explanation: "After sorting by start time: [[1,3],[2,6],[8,10],[15,18]]. Already sorted in this case!",
      highlightedLines: [3],
      lineExecution: "// After sort"
    },
    {
      intervals: [[1, 3], [2, 6], [8, 10], [15, 18]],
      merged: [[1, 3]],
      currentIdx: 0,
      variables: { merged: '[[1,3]]', action: 'initialize' },
      explanation: "Initialize merged array with first interval [1,3]. This is our starting point.",
      highlightedLines: [4],
      lineExecution: "const merged = [intervals[0]]; // [[1,3]]"
    },
    {
      intervals: [[1, 3], [2, 6], [8, 10], [15, 18]],
      merged: [[1, 3]],
      currentIdx: 1,
      variables: { i: 1, current: '[2,6]' },
      explanation: "Start loop from second interval (i=1). Process [2,6].",
      highlightedLines: [6],
      lineExecution: "for (let i = 1; i < intervals.length; i++) // i=1"
    },
    {
      intervals: [[1, 3], [2, 6], [8, 10], [15, 18]],
      merged: [[1, 3]],
      currentIdx: 1,
      variables: { current: '[2,6]', last: '[1,3]' },
      explanation: "Get current interval [2,6] and last merged interval [1,3].",
      highlightedLines: [7, 8],
      lineExecution: "const current = intervals[i]; const last = merged[merged.length - 1];"
    },
    {
      intervals: [[1, 3], [2, 6], [8, 10], [15, 18]],
      merged: [[1, 3]],
      currentIdx: 1,
      variables: { check: '2 <= 3?', result: 'true' },
      explanation: "Check if [2,6] overlaps with [1,3]: does 2 <= 3? Yes! They overlap.",
      highlightedLines: [10],
      lineExecution: "if (current[0] <= last[1]) // 2 <= 3? true"
    },
    {
      intervals: [[1, 3], [2, 6], [8, 10], [15, 18]],
      merged: [[1, 6]],
      currentIdx: 1,
      variables: { merged: '[[1,6]]', action: 'extend last' },
      explanation: "Merge overlapping intervals! Extend last interval's end to max(3, 6) = 6. Now merged = [[1,6]].",
      highlightedLines: [11],
      lineExecution: "last[1] = Math.max(last[1], current[1]); // max(3,6)=6"
    },
    {
      intervals: [[1, 3], [2, 6], [8, 10], [15, 18]],
      merged: [[1, 6]],
      currentIdx: 2,
      variables: { i: 2, current: '[8,10]' },
      explanation: "Continue to next interval (i=2). Process [8,10].",
      highlightedLines: [6],
      lineExecution: "for (let i = 1; i < intervals.length; i++) // i=2"
    },
    {
      intervals: [[1, 3], [2, 6], [8, 10], [15, 18]],
      merged: [[1, 6]],
      currentIdx: 2,
      variables: { current: '[8,10]', last: '[1,6]' },
      explanation: "Get current interval [8,10] and last merged interval [1,6].",
      highlightedLines: [7, 8],
      lineExecution: "const current = intervals[i]; const last = merged[merged.length - 1];"
    },
    {
      intervals: [[1, 3], [2, 6], [8, 10], [15, 18]],
      merged: [[1, 6]],
      currentIdx: 2,
      variables: { check: '8 <= 6?', result: 'false' },
      explanation: "Check if [8,10] overlaps with [1,6]: does 8 <= 6? No! No overlap (gap between them).",
      highlightedLines: [10],
      lineExecution: "if (current[0] <= last[1]) // 8 <= 6? false"
    },
    {
      intervals: [[1, 3], [2, 6], [8, 10], [15, 18]],
      merged: [[1, 6], [8, 10]],
      currentIdx: 2,
      variables: { merged: '[[1,6],[8,10]]', action: 'add new' },
      explanation: "No overlap! Add [8,10] as a new separate interval. Now merged = [[1,6],[8,10]].",
      highlightedLines: [13],
      lineExecution: "merged.push(current); // push [8,10]"
    },
    {
      intervals: [[1, 3], [2, 6], [8, 10], [15, 18]],
      merged: [[1, 6], [8, 10]],
      currentIdx: 3,
      variables: { i: 3, current: '[15,18]' },
      explanation: "Continue to last interval (i=3). Process [15,18].",
      highlightedLines: [6],
      lineExecution: "for (let i = 1; i < intervals.length; i++) // i=3"
    },
    {
      intervals: [[1, 3], [2, 6], [8, 10], [15, 18]],
      merged: [[1, 6], [8, 10]],
      currentIdx: 3,
      variables: { current: '[15,18]', last: '[8,10]' },
      explanation: "Get current interval [15,18] and last merged interval [8,10].",
      highlightedLines: [7, 8],
      lineExecution: "const current = intervals[i]; const last = merged[merged.length - 1];"
    },
    {
      intervals: [[1, 3], [2, 6], [8, 10], [15, 18]],
      merged: [[1, 6], [8, 10]],
      currentIdx: 3,
      variables: { check: '15 <= 10?', result: 'false' },
      explanation: "Check if [15,18] overlaps with [8,10]: does 15 <= 10? No! No overlap.",
      highlightedLines: [10],
      lineExecution: "if (current[0] <= last[1]) // 15 <= 10? false"
    },
    {
      intervals: [[1, 3], [2, 6], [8, 10], [15, 18]],
      merged: [[1, 6], [8, 10], [15, 18]],
      currentIdx: 3,
      variables: { merged: '[[1,6],[8,10],[15,18]]', action: 'add new' },
      explanation: "No overlap! Add [15,18] as a new interval. Final merged = [[1,6],[8,10],[15,18]].",
      highlightedLines: [13],
      lineExecution: "merged.push(current); // push [15,18]"
    },
    {
      intervals: [[1, 3], [2, 6], [8, 10], [15, 18]],
      merged: [[1, 6], [8, 10], [15, 18]],
      currentIdx: 3,
      variables: { result: '[[1,6],[8,10],[15,18]]' },
      explanation: "Return merged intervals: [[1,6],[8,10],[15,18]].",
      highlightedLines: [17],
      lineExecution: "return merged; // [[1,6],[8,10],[15,18]]"
    },
    {
      intervals: [[1, 3], [2, 6], [8, 10], [15, 18]],
      merged: [[1, 6], [8, 10], [15, 18]],
      currentIdx: 3,
      variables: { result: 3, time: 'O(n log n)', space: 'O(n)' },
      explanation: "Algorithm complete! Merged 4 intervals into 3 non-overlapping intervals. Time: O(n log n) for sorting. Space: O(n) for merged array.",
      highlightedLines: [17],
      lineExecution: "Result: [[1,6],[8,10],[15,18]]"
    }
  ];

  const code = `function merge(intervals: number[][]): number[][] {
  if (intervals.length === 0) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  
  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const last = merged[merged.length - 1];
    
    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push(current);
    }
  }
  
  return merged;
}`;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Merge Intervals</h3>
          <div className="space-y-4">
            <motion.div 
              key={`intervals-${currentStepIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <div className="text-sm font-medium text-muted-foreground">Original Intervals:</div>
              <div className="flex gap-2 flex-wrap">
                {currentStep.intervals.map((interval, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`px-3 py-2 rounded font-mono transition-all ${
                      idx === currentStep.currentIdx 
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

            {currentStep.merged.length > 0 && (
              <motion.div
                key={`merged-${currentStepIndex}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-2"
              >
                <div className="text-sm font-medium text-muted-foreground">Merged Intervals:</div>
                <div className="flex gap-2 flex-wrap">
                  {currentStep.merged.map((interval, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="px-3 py-2 rounded font-mono bg-primary/20 text-primary border-2 border-primary"
                    >
                      [{interval[0]}, {interval[1]}]
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

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