import React, { useState, useEffect } from 'react';
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
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const code = `function insert(intervals: number[][], newInterval: number[]): number[][] {
  const res: number[][] = [];

  for (let i = 0; i < intervals.length; i++) {
    const curr = intervals[i];

    if (newInterval[1] < curr[0]) {
      res.push(newInterval);
      return res.concat(intervals.slice(i));
    } else if (newInterval[0] > curr[1]) {
      res.push(curr);
    } else {
      newInterval = [
        Math.min(newInterval[0], curr[0]),
        Math.max(newInterval[1], curr[1])
      ];
    }
  }

  res.push(newInterval);
  return res;
}`;

  const generateSteps = () => {
    // Example tailored for rich step demonstration: overlapping and non-overlapping edges
    const intervals: [number, number][] = [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]];
    let newInterval: [number, number] = [4, 8];
    const initialNewInterval: [number, number] = [...newInterval];

    const newSteps: Step[] = [];
    const res: [number, number][] = [];

    newSteps.push({
      intervals: [...intervals],
      newInterval: [...newInterval],
      result: [...res],
      currentIdx: -1,
      merged: null,
      variables: { intervals: JSON.stringify(intervals), newInterval: JSON.stringify(newInterval) },
      explanation: `Insert new interval [${newInterval[0]}, ${newInterval[1]}] into sorted intervals.`,
      highlightedLines: [1],
      lineExecution: "function insert(intervals, newInterval)"
    });

    newSteps.push({
      intervals: [...intervals],
      newInterval: [...newInterval],
      result: [...res],
      currentIdx: -1,
      merged: null,
      variables: { res: JSON.stringify(res) },
      explanation: "Initialize empty result array.",
      highlightedLines: [2],
      lineExecution: "const res: number[][] = [];"
    });

    for (let i = 0; i < intervals.length; i++) {
      const curr = intervals[i];

      newSteps.push({
        intervals: [...intervals],
        newInterval: [...newInterval],
        result: [...res],
        currentIdx: i,
        merged: null,
        variables: { i, curr: JSON.stringify(curr) },
        explanation: `Iteration ${i}: current array interval is [${curr[0]}, ${curr[1]}].`,
        highlightedLines: [4],
        lineExecution: `for (let i = ${i}; ...)`
      });

      // Case 1 step
      newSteps.push({
        intervals: [...intervals],
        newInterval: [...newInterval],
        result: [...res],
        currentIdx: i,
        merged: null,
        variables: { 'newInterval[1]': newInterval[1], 'curr[0]': curr[0] },
        explanation: `Check if newInterval comes before current (newInterval[1] < curr[0]): ${newInterval[1]} < ${curr[0]} -> ${newInterval[1] < curr[0]}`,
        highlightedLines: [7],
        lineExecution: `if (${newInterval[1]} < ${curr[0]})`
      });

      if (newInterval[1] < curr[0]) {
        res.push([...newInterval]);
        newSteps.push({
          intervals: [...intervals],
          newInterval: [...newInterval],
          result: [...res],
          currentIdx: i,
          merged: null,
          variables: { res: JSON.stringify(res) },
          explanation: `True. Push newInterval [${newInterval[0]}, ${newInterval[1]}] into result.`,
          highlightedLines: [8],
          lineExecution: "res.push(newInterval);"
        });

        const finalRes = res.concat(intervals.slice(i)) as [number, number][];
        newSteps.push({
          intervals: [...intervals],
          newInterval: [...newInterval],
          result: [...finalRes],
          currentIdx: i,
          merged: null,
          variables: { res: JSON.stringify(finalRes) },
          explanation: `Return result concatenated with remaining intervals.`,
          highlightedLines: [9],
          lineExecution: "return res.concat(intervals.slice(i));"
        });

        setSteps(newSteps);
        setCurrentStep(0);
        return;
      }

      // Case 2 step
      newSteps.push({
        intervals: [...intervals],
        newInterval: [...newInterval],
        result: [...res],
        currentIdx: i,
        merged: null,
        variables: { 'newInterval[0]': newInterval[0], 'curr[1]': curr[1] },
        explanation: `Check if newInterval comes after current (newInterval[0] > curr[1]): ${newInterval[0]} > ${curr[1]} -> ${newInterval[0] > curr[1]}`,
        highlightedLines: [10],
        lineExecution: `else if (${newInterval[0]} > ${curr[1]})`
      });

      if (newInterval[0] > curr[1]) {
        res.push([...curr]);
        newSteps.push({
          intervals: [...intervals],
          newInterval: [...newInterval],
          result: [...res],
          currentIdx: i,
          merged: null,
          variables: { res: JSON.stringify(res) },
          explanation: `True. Push current interval [${curr[0]}, ${curr[1]}] into result.`,
          highlightedLines: [11],
          lineExecution: "res.push(curr);"
        });
      }
      else {
        // Case 3 step
        newSteps.push({
          intervals: [...intervals],
          newInterval: [...newInterval],
          result: [...res],
          currentIdx: i,
          merged: null,
          variables: {},
          explanation: `Neither before nor after -> Overlap! We must merge them.`,
          highlightedLines: [12],
          lineExecution: "else { // overlapping logic"
        });

        const minStart = Math.min(newInterval[0], curr[0]);
        const maxEnd = Math.max(newInterval[1], curr[1]);

        // To illustrate the change purely for the explanation
        const prevStart = newInterval[0];
        const prevEnd = newInterval[1];

        newInterval = [minStart, maxEnd];

        newSteps.push({
          intervals: [...intervals],
          newInterval: [...newInterval],
          result: [...res],
          currentIdx: i,
          merged: [...newInterval],
          variables: { newInterval: JSON.stringify(newInterval) },
          explanation: `Merged newInterval becomes [Math.min(${prevStart}, ${curr[0]}), Math.max(${prevEnd}, ${curr[1]})] = [${newInterval[0]}, ${newInterval[1]}].`,
          highlightedLines: [13, 14, 15, 16],
          lineExecution: `newInterval = [${newInterval[0]}, ${newInterval[1]}]`
        });
      }
    }

    res.push([...newInterval]);
    newSteps.push({
      intervals: [...intervals],
      newInterval: [...newInterval],
      result: [...res],
      currentIdx: -1,
      merged: [...newInterval],
      variables: { res: JSON.stringify(res) },
      explanation: `Loop ended. Push the finalized newInterval [${newInterval[0]}, ${newInterval[1]}] to result.`,
      highlightedLines: [20],
      lineExecution: "res.push(newInterval);"
    });

    newSteps.push({
      intervals: [...intervals],
      newInterval: [...newInterval],
      result: [...res],
      currentIdx: -1,
      merged: null,
      variables: { final: JSON.stringify(res) },
      explanation: `Return final result.`,
      highlightedLines: [21],
      lineExecution: "return res;"
    });

    setSteps(newSteps);
    setCurrentStep(0);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  if (steps.length === 0) return null;
  const step = steps[currentStep];

  const TIMELINE_MAX = 20;

  const renderTimelineInterval = (label: string, interval: [number, number], colorClass: string) => {
    const leftPct = (interval[0] / TIMELINE_MAX) * 100;
    const widthPct = ((interval[1] - interval[0]) / TIMELINE_MAX) * 100;

    return (
      <div className="flex items-center gap-2 text-xs mb-1 w-full">
        <span className="w-8 whitespace-nowrap">{label}</span>
        <div className="flex-1 relative h-10">
          <div className="w-full h-1.5 bg-muted rounded absolute top-1/2 -translate-y-1/2"></div>
          <div
            className={`absolute h-8 rounded flex items-center justify-center text-xs font-medium transition-all shadow-sm ${colorClass}`}
            style={{
              left: `${leftPct}%`,
              width: `${Math.max(widthPct, 2)}%`,
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          >
            {interval[0]}-{interval[1]}
          </div>
        </div>
      </div>
    );
  };

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-4">
          <div key={`intervals-${currentStep}`}>
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Original Intervals</h3>
              <div className="space-y-2 flex flex-col w-full">
                {step.intervals.map((interval, idx) => (
                  <div key={idx} className="w-full">
                    {renderTimelineInterval(
                      `I${idx}`,
                      interval,
                      idx === step.currentIdx
                        ? 'bg-primary/20 border-2 border-primary text-primary scale-105 z-10'
                        : 'bg-secondary/50 border-2 border-secondary text-foreground'
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div key={`new-${currentStep}`}>
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">New Interval</h3>
              {renderTimelineInterval(
                'New',
                step.newInterval,
                'bg-accent/20 border-2 border-accent text-accent-foreground'
              )}
            </Card>
          </div>

          {step.result.length > 0 && (
            <div key={`result-${currentStep}`}>
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-3">Result</h3>
                <div className="space-y-2 flex flex-col w-full">
                  {step.result.map((interval, idx) => (
                    <div key={idx} className="w-full">
                      {renderTimelineInterval(
                        `R${idx}`,
                        interval,
                        step.merged &&
                          interval[0] === step.merged[0] &&
                          interval[1] === step.merged[1]
                          ? 'bg-green-500/20 border-2 border-green-500 text-green-700 dark:text-green-400'
                          : 'bg-blue-500/20 border-2 border-blue-500 text-blue-700 dark:text-blue-400'
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          <div key={`execution-${currentStep}`}>
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

          <div key={`variables-${currentStep}`}>
            <VariablePanel variables={step.variables} />
          </div>
        </div>
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
