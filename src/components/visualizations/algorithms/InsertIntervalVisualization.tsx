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
  const newIntervalInput: [number, number] = [2, 5];

  const steps: Step[] = [
    {
      intervals,
      newInterval: newIntervalInput,
      result: [],
      currentIdx: -1,
      merged: null,
      variables: { intervals: '[[1,3],[6,9]]', newInterval: '[2,5]' },
      explanation: "Insert new interval [2,5] into sorted intervals [[1,3],[6,9]].",
      highlightedLines: [1],
      lineExecution: "function insert(intervals, newInterval)"
    },
    {
      intervals,
      newInterval: newIntervalInput,
      result: [],
      currentIdx: -1,
      merged: null,
      variables: { res: '[]' },
      explanation: "Initialize empty result array.",
      highlightedLines: [2],
      lineExecution: "const res: number[][] = [];"
    },
    {
      intervals,
      newInterval: newIntervalInput,
      result: [],
      currentIdx: 0,
      merged: null,
      variables: { i: 0, curr: '[1,3]' },
      explanation: "Start loop. i=0, current interval is [1,3].",
      highlightedLines: [4, 5],
      lineExecution: "for (let i = 0; i < intervals.length; i++)"
    },
    {
      intervals,
      newInterval: newIntervalInput,
      result: [],
      currentIdx: 0,
      merged: null,
      variables: { 'newInterval[1]': 5, 'curr[0]': 1 },
      explanation: "Check Case 1: newInterval[1] (5) < curr[0] (1)? False.",
      highlightedLines: [8],
      lineExecution: "if (newInterval[1] < curr[0]) // 5 < 1 -> false"
    },
    {
      intervals,
      newInterval: newIntervalInput,
      result: [],
      currentIdx: 0,
      merged: null,
      variables: { 'newInterval[0]': 2, 'curr[1]': 3 },
      explanation: "Check Case 2: newInterval[0] (2) > curr[1] (3)? False.",
      highlightedLines: [14],
      lineExecution: "else if (newInterval[0] > curr[1]) // 2 > 3 -> false"
    },
    {
      intervals,
      newInterval: [1, 5],
      result: [],
      currentIdx: 0,
      merged: [1, 5],
      variables: { newInterval: '[1,5]' },
      explanation: "Case 3: Overlap. Merge intervals. newInterval becomes [min(2,1), max(5,3)] = [1,5].",
      highlightedLines: [20, 21, 22, 23],
      lineExecution: "newInterval = [Math.min(...), Math.max(...)]"
    },
    {
      intervals,
      newInterval: [1, 5],
      result: [],
      currentIdx: 1,
      merged: [1, 5],
      variables: { i: 1, curr: '[6,9]' },
      explanation: "Next iteration. i=1, current interval is [6,9].",
      highlightedLines: [4, 5],
      lineExecution: "i++ // i=1, curr=[6,9]"
    },
    {
      intervals,
      newInterval: [1, 5],
      result: [],
      currentIdx: 1,
      merged: [1, 5],
      variables: { 'newInterval[1]': 5, 'curr[0]': 6 },
      explanation: "Check Case 1: newInterval[1] (5) < curr[0] (6)? True.",
      highlightedLines: [8],
      lineExecution: "if (newInterval[1] < curr[0]) // 5 < 6 -> true"
    },
    {
      intervals,
      newInterval: [1, 5],
      result: [[1, 5]],
      currentIdx: 1,
      merged: [1, 5],
      variables: { res: '[[1,5]]' },
      explanation: "Case 1 met: Push newInterval [1,5] to result.",
      highlightedLines: [9],
      lineExecution: "res.push(newInterval);"
    },
    {
      intervals,
      newInterval: [1, 5],
      result: [[1, 5], [6, 9]],
      currentIdx: 1,
      merged: null,
      variables: { res: '[[1,5], [6,9]]' },
      explanation: "Return result mixed with remaining intervals starting from i.",
      highlightedLines: [10],
      lineExecution: "return res.concat(intervals.slice(i));"
    },
    {
      intervals,
      newInterval: [1, 5],
      result: [[1, 5], [6, 9]],
      currentIdx: -1,
      merged: null,
      variables: { final: '[[1,5], [6,9]]' },
      explanation: "Algorithm complete.",
      highlightedLines: [],
      lineExecution: "Finished"
    }
  ];

  const code = `function insert(intervals: number[][], newInterval: number[]): number[][] {
    const res: number[][] = [];

    for (let i = 0; i < intervals.length; i++) {
        const curr = intervals[i];

        // Case 1: newInterval comes before current interval
        if (newInterval[1] < curr[0]) {
            res.push(newInterval);
            return res.concat(intervals.slice(i));
        }

        // Case 2: newInterval comes after current interval
        else if (newInterval[0] > curr[1]) {
            res.push(curr);
        }

        // Case 3: Overlapping intervals → merge
        else {
            newInterval = [
                Math.min(newInterval[0], curr[0]),
                Math.max(newInterval[1], curr[1])
            ];
        }
    }

    // Add the merged interval if not placed yet
    res.push(newInterval);
    return res;
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
