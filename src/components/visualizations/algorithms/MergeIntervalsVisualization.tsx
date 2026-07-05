import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Layers } from 'lucide-react';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  intervals: [number, number][];
  merged: [number, number][];
  currentInterval: [number, number] | null;
  nextInterval: [number, number] | null;
  currentIdx: number;
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function merge(intervals: number[][]): number[][] {
  if (!intervals || intervals.length === 0) {
    return [];
  }
  intervals.sort((a, b) => a[0] - b[0]);
  const merged: number[][] = [];
  let currentInterval = intervals[0];
  for (let i = 1; i < intervals.length; i++) {
    const nextInterval = intervals[i];
    if (currentInterval[1] >= nextInterval[0]) {
      currentInterval[1] = Math.max(currentInterval[1], nextInterval[1]);
    } else {
      merged.push(currentInterval);
      currentInterval = nextInterval;
    }
  }
  merged.push(currentInterval);
  return merged;
}`,
  python: `def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = []
    for interval in intervals:
        if not merged or interval[0] > merged[-1][1]:
            merged.append(interval)
        else:
            merged[-1][1] = max(merged[-1][1], interval[1])
    return merged`,
  java: `public static class Solution {
    public int[][] merge(int[][] intervals) {
        if (intervals.length <= 1) {
            return intervals;
        }
        java.util.Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        java.util.List<int[]> mergedIntervals = new java.util.ArrayList<>();
        int[] currentInterval = intervals[0];
        mergedIntervals.add(currentInterval);
        for (int i = 1; i < intervals.length; i++) {
            int[] nextInterval = intervals[i];
            int currentEnd = currentInterval[1];
            int nextStart = nextInterval[0];
            int nextEnd = nextInterval[1];
            if (currentEnd >= nextStart) {
                currentInterval[1] = Math.max(currentEnd, nextEnd);
            } else {
                currentInterval = nextInterval;
                mergedIntervals.add(currentInterval);
            }
        }
        return mergedIntervals.toArray(new int[mergedIntervals.size()][]);
    }
}`,
  cpp: `class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        if (intervals.empty()) {
            return {};
        }
        sort(intervals.begin(), intervals.end(), [](const vector<int>& a, const vector<int>& b) {
            return a[0] < b[0];
        });
        vector<vector<int>> output;
        output.push_back(intervals[0]);
        for (size_t i = 1; i < intervals.size(); ++i) {
            int start = intervals[i][0];
            int end = intervals[i][1];
            int& lastEnd = output.back()[1];
            if (start <= lastEnd) {
                lastEnd = max(lastEnd, end);
            } else {
                output.push_back({start, end});
            }
        }
        return output;
    }
};`
};

export const MergeIntervalsVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [caseType, setCaseType] = useState<'case1' | 'case2'>('case1');

  const initialIntervals: [number, number][] = useMemo(() => 
    caseType === 'case1' 
      ? [[1, 3], [2, 6], [8, 10], [15, 18]] 
      : [[1, 4], [2, 3], [8, 12], [9, 10]], 
  [caseType]);

  const { steps, stepLineNumbers } = useMemo(() => {
    const stepsList: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const intervals = initialIntervals.map(it => [...it] as [number, number]);

    const addStep = (
      intervals: [number, number][],
      merged: [number, number][],
      currentInterval: [number, number] | null,
      nextInterval: [number, number] | null,
      currentIdx: number,
      variables: Record<string, any>,
      explanation: string,
      pseudo: string,
      ts: number, py: number, java: number, cpp: number
    ) => {
      stepsList.push({
        intervals,
        merged,
        currentInterval,
        nextInterval,
        currentIdx,
        variables,
        explanation,
        pseudoStep: pseudo
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(java);
      lines.cpp!.push(cpp);
    };

    addStep(
      intervals.map(it => [...it] as [number, number]),
      [],
      null,
      null,
      -1,
      { intervals: JSON.stringify(initialIntervals) },
      "Given a collection of intervals, we want to merge all overlapping ones into a set of disjoint intervals.",
      "merge(intervals)",
      1, 1, 2, 3
    );

    addStep(
      intervals.map(it => [...it] as [number, number]),
      [],
      null,
      null,
      -1,
      { "!intervals": !intervals, "intervals.length": intervals.length },
      "First, we check if the input is empty or null.",
      "IF NOT intervals OR intervals.length == 0",
      2, 1, 3, 4
    );

    const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
    addStep(
      sorted.map(it => [...it] as [number, number]),
      [],
      null,
      null,
      -1,
      { action: "Sorting by start time" },
      "We sort the intervals by their start times to process them in chronological order.",
      "intervals.sort(key=start_time)",
      5, 2, 6, 7
    );

    const merged: [number, number][] = [];
    let currentInterval: [number, number] = [...sorted[0]];
    addStep(
      sorted.map(it => [...it] as [number, number]),
      [],
      [...currentInterval],
      null,
      0,
      { currentInterval: JSON.stringify(currentInterval) },
      `Initialize 'merged' as empty and set 'currentInterval' to the first interval: [${currentInterval[0]}, ${currentInterval[1]}].`,
      "SET merged = [], currentInterval = intervals[0]",
      6, 3, 7, 10
    );

    for (let i = 1; i < sorted.length; i++) {
      const nextInterval = [...sorted[i]] as [number, number];

      addStep(
        sorted.map(it => [...it] as [number, number]),
        merged.map(it => [...it] as [number, number]),
        [...currentInterval],
        [...nextInterval],
        i,
        { i, nextInterval: JSON.stringify(nextInterval) },
        `Comparing currentInterval [${currentInterval[0]}, ${currentInterval[1]}] with nextInterval [${nextInterval[0]}, ${nextInterval[1]}].`,
        `SET nextInterval = intervals[${i}]`,
        8, 4, 10, 12
      );

      const overlaps = currentInterval[1] >= nextInterval[0];

      addStep(
        sorted.map(it => [...it] as [number, number]),
        merged.map(it => [...it] as [number, number]),
        [...currentInterval],
        [...nextInterval],
        i,
        { 
          "currentInterval.end": currentInterval[1], 
          "nextInterval.start": nextInterval[0],
          "overlaps": overlaps 
        },
        overlaps 
          ? `Overlapping detected: currentInterval end (${currentInterval[1]}) ≥ nextInterval start (${nextInterval[0]}).`
          : `No overlap: currentInterval end (${currentInterval[1]}) < nextInterval start (${nextInterval[0]}).`,
        `IF currentInterval.end >= nextInterval.start  →  ${overlaps ? 'YES ✓' : 'NO ✗'}`,
        10, 5, 15, 16
      );

      if (overlaps) {
        const oldEnd = currentInterval[1];
        currentInterval[1] = Math.max(currentInterval[1], nextInterval[1]);
        addStep(
          sorted.map(it => [...it] as [number, number]),
          merged.map(it => [...it] as [number, number]),
          [...currentInterval],
          [...nextInterval],
          i,
          { 
            "prev_end": oldEnd, 
            "next_end": nextInterval[1], 
            "new_end": currentInterval[1] 
          },
          `Merge the intervals by extending the end of currentInterval to max(${oldEnd}, ${nextInterval[1]}) = ${currentInterval[1]}.`,
          `SET currentInterval.end = max(currentInterval.end, nextInterval.end)`,
          11, 8, 16, 17
        );
      } else {
        merged.push([...currentInterval]);
        const prevCurrent = [...currentInterval];
        currentInterval = [...nextInterval];
        addStep(
          sorted.map(it => [...it] as [number, number]),
          merged.map(it => [...it] as [number, number]),
          [...currentInterval],
          [...nextInterval],
          i,
          { 
            "added_to_merged": JSON.stringify(prevCurrent), 
            "new_currentInterval": JSON.stringify(currentInterval) 
          },
          `Push currentInterval [${prevCurrent[0]}, ${prevCurrent[1]}] to 'merged' and update currentInterval to the next one.`,
          `CALL merged.push(currentInterval); SET currentInterval = nextInterval`,
          13, 6, 19, 19
        );
      }
    }

    merged.push([...currentInterval]);
    addStep(
      sorted.map(it => [...it] as [number, number]),
      merged.map(it => [...it] as [number, number]),
      [...currentInterval],
      null,
      sorted.length,
      { action: "Final push" },
      `Add the last remaining 'currentInterval' [${currentInterval[0]}, ${currentInterval[1]}] to the merged list.`,
      "CALL merged.push(currentInterval)",
      17, 9, 22, 22
    );

    addStep(
      sorted.map(it => [...it] as [number, number]),
      merged.map(it => [...it] as [number, number]),
      null,
      null,
      sorted.length,
      { result: JSON.stringify(merged) },
      "Algorithm complete. Returning the list of merged intervals.",
      "RETURN merged",
      18, 9, 22, 22
    );

    return { steps: stepsList, stepLineNumbers: lines };
  }, [initialIntervals]);

  const handleCaseToggle = (type: 'case1' | 'case2') => {
    setCaseType(type);
    setCurrentStep(0);
  };

  const step = steps[currentStep];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);
  const TIMELINE_MAX = useMemo(() => Math.max(...initialIntervals.flat(), 1) + 2, [initialIntervals]);

  const renderIntervalBar = (interval: [number, number], colorClass: string, label?: string, isLarge = false, key?: string | number) => {
    const leftPct = (interval[0] / TIMELINE_MAX) * 100;
    const widthPct = ((interval[1] - interval[0]) / TIMELINE_MAX) * 100;

    return (
      <div key={key || label || undefined} className={`flex items-center gap-3 w-full group ${isLarge ? 'h-12' : 'h-8'}`}>
        {label && <span className="w-10 text-[10px] font-bold text-muted-foreground uppercase">{label}</span>}
        <div className="flex-1 relative h-full">
          <div className="absolute inset-0 bg-muted/20 rounded-md"></div>
          <div
            className={`absolute h-[80%] top-[10%] rounded flex items-center justify-center text-[11px] font-mono font-bold transition-all border shadow-sm px-2 ${colorClass}`}
            style={{
              left: `${leftPct}%`,
              width: `${Math.max(widthPct, 12)}%`,
              minWidth: '60px',
            }}
          >
            <span className="whitespace-nowrap overflow-visible">
              {interval[0]}-{interval[1]}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <VisualizationLayout
      controls={
        <div className="flex items-center gap-4 w-full justify-between">
          <SimpleStepControls
            currentStep={currentStep}
            totalSteps={steps.length}
            onStepChange={setCurrentStep}
          />
          <div className="flex gap-2">
            <button 
              onClick={() => handleCaseToggle('case1')}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                caseType === 'case1' ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Case 1
            </button>
            <button 
              onClick={() => handleCaseToggle('case2')}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                caseType === 'case2' ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Case 2
            </button>
          </div>
        </div>
      }
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-foreground opacity-90 flex items-center gap-2">
              <Layers size={16} className="text-primary" />
              Interval Processing
            </h2>
            
            <Card className="p-6 bg-card/60 backdrop-blur border-border/50 shadow-sm space-y-8">
              <div className="space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sorted Input Intervals</div>
                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                  {step.intervals.map((interval, idx) => (
                    renderIntervalBar(
                      interval,
                      idx === step.currentIdx 
                        ? 'bg-primary/20 border-primary text-primary z-10 scale-[1.02] shadow-md' 
                        : idx < step.currentIdx 
                          ? 'bg-secondary/30 border-transparent text-muted-foreground/60' 
                          : 'bg-muted/50 border-transparent text-muted-foreground/80',
                      `I${idx}`
                    )
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border/50">
                <div className="space-y-3">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-primary font-black">Current Interval</div>
                  <div className="min-h-[50px] flex items-center">
                    {step.currentInterval ? (
                      renderIntervalBar(step.currentInterval, 'bg-primary border-primary text-primary-foreground shadow-lg', undefined, true)
                    ) : (
                      <div className="text-[11px] italic text-muted-foreground bg-muted/20 w-full py-3 text-center rounded-md border border-dashed border-muted">None</div>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-orange-600 font-black">Next Interval</div>
                  <div className="min-h-[50px] flex items-center">
                    {step.nextInterval ? (
                      renderIntervalBar(step.nextInterval, 'bg-orange-500/20 border-orange-500 text-orange-700 dark:text-orange-400 shadow-sm', undefined, true)
                    ) : (
                      <div className="text-[11px] italic text-muted-foreground bg-muted/20 w-full py-3 text-center rounded-md border border-dashed border-muted">None</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-border/50">
                <div className="text-[10px] font-bold uppercase tracking-widest text-green-600 flex items-center gap-2">
                  Merged Results
                  <span className="text-[8px] bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20 font-black">{step.merged.length} intervals</span>
                </div>
                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
                  {step.merged.map((interval, idx) => (
                    renderIntervalBar(interval, 'bg-green-500/10 border-green-500/40 text-green-700 dark:text-green-400 shadow-sm', `M${idx}`)
                  ))}
                  {step.merged.length === 0 && (
                    <div className="text-[11px] italic text-muted-foreground bg-muted/20 w-full py-3 text-center rounded-md">Empty</div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-4 border-l-4 border-primary bg-primary/5 shadow-sm">
            <div className="space-y-2">
              <h4 className="text-[9px] font-bold uppercase tracking-[0.1em] text-primary/80">
                Commentary
              </h4>
              <p className="text-[13px] font-medium leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {step.explanation}
              </p>
            </div>
          </Card>
        </div>
      }
      rightContent={
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStep}
            onLanguageChange={() => setCurrentStep(0)}
          />
          <VariablePanel variables={step.variables} />
        </div>
      }
    />
  );
};
export default MergeIntervalsVisualization;