import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  intervals: [number, number][];
  newInterval: [number, number];
  result: [number, number][];
  currentIdx: number;
  merged: [number, number] | null;
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function insert(intervals: number[][], newInterval: number[]): number[][] {
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
}`,

  python: `def insert(intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
  res: List[List[int]] = []
  for i in range(len(intervals)):
    curr = intervals[i]
    if newInterval[1] < curr[0]:
      res.append(newInterval)
      return res + intervals[i:]
    elif newInterval[0] > curr[1]:
      res.append(curr)
    else:
      newInterval = [
        min(newInterval[0], curr[0]),
        max(newInterval[1], curr[1])
      ]
  res.append(newInterval)
  return res`,

  java: `public static class Solution {
    public int[][] insert(int[][] intervals, int[] newInterval) {
        List<int[]> result = new ArrayList<>();
        for (int i = 0; i < intervals.length; i++) {
            int[] current = intervals[i];
            if (newInterval[1] < current[0]) {
                result.add(newInterval);
                for (int j = i; j < intervals.length; j++) {
                    result.add(intervals[j]);
                }
                return result.toArray(new int[result.size()][]);
            } else if (newInterval[0] > current[1]) {
                result.add(current);
            } else {
                newInterval = new int[]{
                    Math.min(newInterval[0], current[0]),
                    Math.max(newInterval[1], current[1])
                };
            }
        }
        result.add(newInterval);
        return result.toArray(new int[result.size()][]);
    }
}`,

  cpp: `class Solution {
public:
    vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
        vector<vector<int>> res;
        for (int i = 0; i < intervals.size(); i++) {
            if (newInterval[1] < intervals[i][0]) {
                res.push_back(newInterval);
                res.insert(res.end(), intervals.begin() + i, intervals.end());
                return res;
            } else if (newInterval[0] > intervals[i][1]) {
                res.push_back(intervals[i]);
            } else {
                newInterval = {
                    min(newInterval[0], intervals[i][0]),
                    max(newInterval[1], intervals[i][1])
                };
            }
        }
        res.push_back(newInterval);
        return res;
    }
};`
};

function generateVisualizationData() {
  const intervals: [number, number][] = [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]];
  let newInterval: [number, number] = [4, 8];

  const steps: Step[] = [];
  const res: [number, number][] = [];
  const stepLineNumbers: StepLineNumberMap = {
    typescript: [],
    python: [],
    java: [],
    cpp: []
  };

  const addLines = (ts: number, py: number, java: number, cpp: number) => {
    stepLineNumbers.typescript!.push(ts);
    stepLineNumbers.python!.push(py);
    stepLineNumbers.java!.push(java);
    stepLineNumbers.cpp!.push(cpp);
  };

  steps.push({
    intervals: [...intervals],
    newInterval: [...newInterval],
    result: [...res],
    currentIdx: -1,
    merged: null,
    variables: { intervals: JSON.stringify(intervals), newInterval: JSON.stringify(newInterval) },
    explanation: `Insert new interval [${newInterval[0]}, ${newInterval[1]}] into sorted intervals.`,
    pseudoStep: `START insert(newInterval=[${newInterval[0]}, ${newInterval[1]}])`,
  });
  addLines(1, 1, 2, 3);

  steps.push({
    intervals: [...intervals],
    newInterval: [...newInterval],
    result: [...res],
    currentIdx: -1,
    merged: null,
    variables: { res: JSON.stringify(res) },
    explanation: 'Initialize empty result array.',
    pseudoStep: 'SET res = []',
  });
  addLines(2, 2, 3, 4);

  for (let i = 0; i < intervals.length; i++) {
    const curr = intervals[i];

    steps.push({
      intervals: [...intervals],
      newInterval: [...newInterval],
      result: [...res],
      currentIdx: i,
      merged: null,
      variables: { i, curr: JSON.stringify(curr) },
      explanation: `Iteration ${i}: Current interval under review is [${curr[0]}, ${curr[1]}].`,
      pseudoStep: `FOR i = ${i} (curr = [${curr[0]}, ${curr[1]}])`,
    });
    addLines(3, 3, 4, 5);

    steps.push({
      intervals: [...intervals],
      newInterval: [...newInterval],
      result: [...res],
      currentIdx: i,
      merged: null,
      variables: { 'newInterval[1]': newInterval[1], 'curr[0]': curr[0] },
      explanation: `Check if newInterval ends before current starts (newInterval[1] < curr[0]): ${newInterval[1]} < ${curr[0]}?`,
      pseudoStep: `IF newInterval.end (${newInterval[1]}) < curr.start (${curr[0]})`,
    });
    addLines(5, 5, 6, 6);

    if (newInterval[1] < curr[0]) {
      res.push([...newInterval]);
      steps.push({
        intervals: [...intervals],
        newInterval: [...newInterval],
        result: [...res],
        currentIdx: i,
        merged: null,
        variables: { res: JSON.stringify(res) },
        explanation: `True! newInterval [${newInterval[0]}, ${newInterval[1]}] finishes before current [${curr[0]}, ${curr[1]}]. Push newInterval to result.`,
        pseudoStep: `PUSH newInterval [${newInterval[0]}, ${newInterval[1]}]`,
      });
      addLines(6, 6, 7, 7);

      const finalRes = res.concat(intervals.slice(i)) as [number, number][];
      steps.push({
        intervals: [...intervals],
        newInterval: [...newInterval],
        result: [...finalRes],
        currentIdx: i,
        merged: null,
        variables: { res: JSON.stringify(finalRes) },
        explanation: 'All subsequent intervals can be appended directly. Concatenate remainder and return.',
        pseudoStep: 'RETURN res + remaining_intervals',
      });
      addLines(7, 7, 11, 9);

      return { steps, stepLineNumbers };
    }

    steps.push({
      intervals: [...intervals],
      newInterval: [...newInterval],
      result: [...res],
      currentIdx: i,
      merged: null,
      variables: { 'newInterval[0]': newInterval[0], 'curr[1]': curr[1] },
      explanation: `Check if newInterval starts after current ends (newInterval[0] > curr[1]): ${newInterval[0]} > ${curr[1]}?`,
      pseudoStep: `ELSE IF newInterval.start (${newInterval[0]}) > curr.end (${curr[1]})`,
    });
    addLines(8, 8, 12, 10);

    if (newInterval[0] > curr[1]) {
      res.push([...curr]);
      steps.push({
        intervals: [...intervals],
        newInterval: [...newInterval],
        result: [...res],
        currentIdx: i,
        merged: null,
        variables: { res: JSON.stringify(res) },
        explanation: `True! Push current interval [${curr[0]}, ${curr[1]}] to result as it lies entirely before newInterval.`,
        pseudoStep: `PUSH curr [${curr[0]}, ${curr[1]}]`,
      });
      addLines(9, 9, 13, 11);
    } else {
      steps.push({
        intervals: [...intervals],
        newInterval: [...newInterval],
        result: [...res],
        currentIdx: i,
        merged: null,
        variables: {},
        explanation: `Neither before nor after -> Overlap! Merge current [${curr[0]}, ${curr[1]}] and newInterval [${newInterval[0]}, ${newInterval[1]}].`,
        pseudoStep: 'ELSE → OVERLAP!',
      });
      addLines(10, 10, 14, 12);

      const minStart = Math.min(newInterval[0], curr[0]);
      const maxEnd = Math.max(newInterval[1], curr[1]);
      const prevStart = newInterval[0];
      const prevEnd = newInterval[1];
      newInterval = [minStart, maxEnd];

      steps.push({
        intervals: [...intervals],
        newInterval: [...newInterval],
        result: [...res],
        currentIdx: i,
        merged: [...newInterval],
        variables: { newInterval: JSON.stringify(newInterval) },
        explanation: `Merged newInterval becomes: [min(${prevStart}, ${curr[0]}), max(${prevEnd}, ${curr[1]})] = [${newInterval[0]}, ${newInterval[1]}].`,
        pseudoStep: `SET newInterval = [min_start, max_end] → [${newInterval[0]}, ${newInterval[1]}]`,
      });
      addLines(11, 11, 15, 13);
    }
  }

  res.push([...newInterval]);
  steps.push({
    intervals: [...intervals],
    newInterval: [...newInterval],
    result: [...res],
    currentIdx: -1,
    merged: [...newInterval],
    variables: { res: JSON.stringify(res) },
    explanation: `Loop completed. Push the final merged newInterval [${newInterval[0]}, ${newInterval[1]}] to result.`,
    pseudoStep: `PUSH newInterval [${newInterval[0]}, ${newInterval[1]}]`,
  });
  addLines(17, 15, 21, 19);

  steps.push({
    intervals: [...intervals],
    newInterval: [...newInterval],
    result: [...res],
    currentIdx: -1,
    merged: null,
    variables: { final: JSON.stringify(res) },
    explanation: 'Return final merged intervals list.',
    pseudoStep: 'RETURN res',
  });
  addLines(18, 16, 22, 20);

  return { steps, stepLineNumbers };
}

export const InsertIntervalVisualization: React.FC = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map((s) => s.pseudoStep);
  const TIMELINE_MAX = 20;

  const renderTimelineInterval = (label: string, interval: [number, number], colorClass: string) => {
    const leftPct = (interval[0] / TIMELINE_MAX) * 100;
    const widthPct = ((interval[1] - interval[0]) / TIMELINE_MAX) * 100;

    return (
      <div className="flex items-center gap-2 text-xs w-full">
        <span className="w-8 whitespace-nowrap font-mono text-muted-foreground">{label}</span>
        <div className="flex-1 relative h-8">
          <div className="w-full h-1 bg-muted/40 rounded absolute top-1/2 -translate-y-1/2"></div>
          <div
            className={`absolute h-6 rounded flex items-center justify-center text-[10px] font-mono font-bold transition-all shadow-sm ${colorClass}`}
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
        <div className="space-y-6">
          <div className="bg-card rounded-xl p-6 border border-border/50 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b border-primary/20 pb-2">Original Intervals</h3>
            <div className="space-y-1 flex flex-col w-full">
              {currentStep.intervals.map((interval, idx) => (
                <div key={idx} className="w-full">
                  {renderTimelineInterval(
                    `I${idx}`,
                    interval,
                    idx === currentStep.currentIdx
                      ? 'bg-primary/20 border border-primary text-primary scale-[1.01] z-10'
                      : 'bg-muted/40 border border-border text-foreground/80'
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border/50 shadow-sm space-y-2">
            <h3 className="text-sm font-semibold text-foreground border-b border-primary/20 pb-2">New Interval</h3>
            {renderTimelineInterval(
              'New',
              currentStep.newInterval,
              'bg-accent/20 border border-accent text-accent-foreground'
            )}
          </div>

          {currentStep.result.length > 0 && (
            <div className="bg-card rounded-xl p-6 border border-border/50 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-foreground border-b border-primary/20 pb-2">Result</h3>
              <div className="space-y-1 flex flex-col w-full">
                {currentStep.result.map((interval, idx) => {
                  const isMerged =
                    currentStep.merged &&
                    interval[0] === currentStep.merged[0] &&
                    interval[1] === currentStep.merged[1];
                  return (
                    <div key={idx} className="w-full">
                      {renderTimelineInterval(
                        `R${idx}`,
                        interval,
                        isMerged
                          ? 'bg-green-500/20 border border-green-500 text-green-600 dark:text-green-400 font-bold'
                          : 'bg-blue-500/10 border border-blue-500/40 text-blue-600 dark:text-blue-400'
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Commentary Panel */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 relative overflow-hidden transition-all duration-300 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75 rounded-full" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                    Algorithm Commentary
                  </span>
                </div>
                <div className="font-mono text-[10px] tracking-tight bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full border border-border/40">
                  Step {currentStepIndex + 1} of {steps.length}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Info className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary/70">
                    Current Action
                  </h4>
                  <div className="text-sm font-medium leading-relaxed text-foreground/90 select-none">
                    {currentStep.explanation}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      }
      rightContent={
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={handleReset}
          />
          <VariablePanel variables={currentStep.variables} />
        </div>
      }
      controls={
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
      }
    />
  );
};

export default InsertIntervalVisualization;
