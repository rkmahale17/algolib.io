import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';

interface Step {
  intervals: [number, number][];
  newInterval: [number, number];
  result: [number, number][];
  currentIdx: number;
  merged: [number, number] | null;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const InsertIntervalVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const intervals: [number, number][] = [[1, 3], [6, 9]];
  const newInterval: [number, number] = [2, 5];

  const steps: Step[] = [
    {
      intervals,
      newInterval,
      result: [],
      currentIdx: -1,
      merged: null,
      variables: { intervals: '[[1,3],[6,9]]', newInterval: '[2,5]' },
      explanation: "Insert new interval [2,5] into sorted intervals [[1,3],[6,9]]. Merge if overlapping.",
      highlightedLines: [1, 2, 3, 4],
      lineExecution: "function insert(intervals: number[][], newInterval: number[][]): number[][]"
    },
    {
      intervals,
      newInterval,
      result: [],
      currentIdx: -1,
      merged: null,
      variables: { result: '[]' },
      explanation: "Initialize empty result array.",
      highlightedLines: [5],
      lineExecution: "const result: number[][] = [];"
    },
    {
      intervals,
      newInterval,
      result: [],
      currentIdx: 0,
      merged: null,
      variables: { i: 0, n: 2 },
      explanation: "Initialize index i = 0, n = 2.",
      highlightedLines: [6, 7],
      lineExecution: "let i = 0; const n = intervals.length;"
    },
    {
      intervals,
      newInterval,
      result: [],
      currentIdx: 0,
      merged: null,
      variables: { i: 0, 'intervals[0][1]': 3, 'newInterval[0]': 2 },
      explanation: "Check: intervals[0][1] (3) < newInterval[0] (2)? No. Skip this phase.",
      highlightedLines: [10],
      lineExecution: "while (i < n && intervals[i][1] < newInterval[0]) // 3 < 2 -> false"
    },
    {
      intervals,
      newInterval,
      result: [],
      currentIdx: 0,
      merged: null,
      variables: { 'intervals[0][0]': 1, 'newInterval[1]': 5 },
      explanation: "Check overlap: intervals[0][0] (1) <= newInterval[1] (5)? Yes! Overlapping.",
      highlightedLines: [16],
      lineExecution: "while (i < n && intervals[i][0] <= newInterval[1]) // 1 <= 5 -> true"
    },
    {
      intervals,
      newInterval: [1, 5],
      result: [],
      currentIdx: 0,
      merged: [1, 5],
      variables: { 'newInterval[0]': 1, merged: '[1,5]' },
      explanation: "Merge: newInterval[0] = min(2, 1) = 1. Update newInterval to [1,5].",
      highlightedLines: [17],
      lineExecution: "newInterval[0] = Math.min(newInterval[0], intervals[i][0]); // min(2,1) = 1"
    },
    {
      intervals,
      newInterval: [1, 5],
      result: [],
      currentIdx: 0,
      merged: [1, 5],
      variables: { 'newInterval[1]': 5, merged: '[1,5]' },
      explanation: "Merge: newInterval[1] = max(5, 3) = 5. Merged interval: [1,5].",
      highlightedLines: [18],
      lineExecution: "newInterval[1] = Math.max(newInterval[1], intervals[i][1]); // max(5,3) = 5"
    },
    {
      intervals,
      newInterval: [1, 5],
      result: [],
      currentIdx: 1,
      merged: [1, 5],
      variables: { i: 1 },
      explanation: "Increment i = 1. Check next interval.",
      highlightedLines: [19],
      lineExecution: "i++; // i = 1"
    },
    {
      intervals,
      newInterval: [1, 5],
      result: [],
      currentIdx: 1,
      merged: [1, 5],
      variables: { 'intervals[1][0]': 6, 'newInterval[1]': 5 },
      explanation: "Check: intervals[1][0] (6) <= newInterval[1] (5)? No. Exit merge loop.",
      highlightedLines: [16],
      lineExecution: "while (i < n && intervals[i][0] <= newInterval[1]) // 6 <= 5 -> false"
    },
    {
      intervals,
      newInterval: [1, 5],
      result: [[1, 5]],
      currentIdx: 1,
      merged: [1, 5],
      variables: { result: '[[1,5]]' },
      explanation: "Push merged interval [1,5] to result.",
      highlightedLines: [21],
      lineExecution: "result.push(newInterval); // result = [[1,5]]"
    },
    {
      intervals,
      newInterval: [1, 5],
      result: [[1, 5]],
      currentIdx: 1,
      merged: null,
      variables: { i: 1, n: 2 },
      explanation: "Add remaining intervals: Check i (1) < n (2)? Yes.",
      highlightedLines: [24],
      lineExecution: "while (i < n) // 1 < 2 -> true"
    },
    {
      intervals,
      newInterval: [1, 5],
      result: [[1, 5], [6, 9]],
      currentIdx: 1,
      merged: null,
      variables: { result: '[[1,5],[6,9]]' },
      explanation: "Push intervals[1] = [6,9] to result. No overlap with merged interval.",
      highlightedLines: [25, 26],
      lineExecution: "result.push(intervals[i]); i++; // result = [[1,5],[6,9]]"
    },
    {
      intervals,
      newInterval: [1, 5],
      result: [[1, 5], [6, 9]],
      currentIdx: 2,
      merged: null,
      variables: { i: 2, n: 2 },
      explanation: "Check: i (2) < n (2)? No. Exit loop.",
      highlightedLines: [24],
      lineExecution: "while (i < n) // 2 < 2 -> false"
    },
    {
      intervals,
      newInterval: [1, 5],
      result: [[1, 5], [6, 9]],
      currentIdx: -1,
      merged: null,
      variables: { result: '[[1,5],[6,9]]' },
      explanation: "Return result: [[1,5],[6,9]]. Original [1,3] merged with [2,5].",
      highlightedLines: [26],
      lineExecution: "return result; // [[1,5],[6,9]]"
    },
    {
      intervals,
      newInterval: [1, 5],
      result: [[1, 5], [6, 9]],
      currentIdx: -1,
      merged: null,
      variables: { intervals: 2, complexity: 'O(n)' },
      explanation: "Algorithm complete! Three phases: add before, merge overlapping, add after. Time: O(n), Space: O(n).",
      highlightedLines: [26],
      lineExecution: "Result: [[1,5],[6,9]]"
    }
  ];

  const code = `function insert(
  intervals: number[][], 
  newInterval: number[]
): number[][] {
  const result: number[][] = [];
  let i = 0;
  const n = intervals.length;
  
  while (i < n && intervals[i][1] < newInterval[0]) {
    result.push(intervals[i]);
    i++;
  }
  
  while (i < n && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;
  }
  result.push(newInterval);
  
  while (i < n) {
    result.push(intervals[i]);
    i++;
  }
  
  return result;
}`;

  const step = steps[currentStep];

  const renderInterval = (interval: [number, number], color: string) => (
    <div className={`px-4 py-2 rounded ${color} font-mono text-sm`}>
      [{interval[0]}, {interval[1]}]
    </div>
  );

  return (
    <VisualizationLayout
      leftContent={
        <>
          <motion.div
            key={`intervals-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Original Intervals</h3>
              <div className="space-y-2">
                {step.intervals.map((interval, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs w-12">[{idx}]</span>
                    {renderInterval(
                      interval,
                      idx === step.currentIdx
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`new-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">New Interval</h3>
              {renderInterval(step.newInterval, 'bg-accent text-accent-foreground')}
            </Card>
          </motion.div>

          {step.result.length > 0 && (
            <motion.div
              key={`result-${currentStep}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-3">Result</h3>
                <div className="space-y-2">
                  {step.result.map((interval, idx) => (
                    <div key={idx}>
                      {renderInterval(
                        interval,
                        step.merged &&
                        interval[0] === step.merged[0] &&
                        interval[1] === step.merged[1]
                          ? 'bg-green-500/20 border border-green-500'
                          : 'bg-secondary/50'
                      )}
                    </div>
                  ))}
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
