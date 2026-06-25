import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Interval {
  start: number;
  end: number;
  index: number;
}

interface Step {
  intervals: Interval[];
  selected: number[];
  removed: number[];
  current: number;
  lastEndTime: number;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function eraseOverlapIntervals(intervals: number[][]): number {
  if (!intervals || intervals.length === 0) {
    return 0;
  }
  intervals.sort((a, b) => a[1] - b[1]);
  let nonOverlappingCount = 1;
  let lastEndTime = intervals[0][1];
  for (let i = 1; i < intervals.length; i++) {
    const currentStartTime = intervals[i][0];
    const currentEndTime = intervals[i][1];
    if (currentStartTime >= lastEndTime) {
      nonOverlappingCount++;
      lastEndTime = currentEndTime;
    }
  }
  return intervals.length - nonOverlappingCount;
}`,

  python: `def eraseOverlapIntervals(intervals: List[List[int]]) -> int:
  if not intervals:
    return 0
  intervals.sort(key=lambda x: x[1])
  count = 1
  end = intervals[0][1]
  for i in range(1, len(intervals)):
    if intervals[i][0] >= end:
      count += 1
      end = intervals[i][1]
  return len(intervals) - count`,

  java: `public int eraseOverlapIntervals(int[][] intervals) {
    if (intervals == null || intervals.length == 0) {
        return 0;
    }
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
    int count = 1;
    int end = intervals[0][1];
    for (int i = 1; i < intervals.length; i++) {
        if (intervals[i][0] >= end) {
            count++;
            end = intervals[i][1];
        }
    }
    return intervals.length - count;
}`,

  cpp: `int eraseOverlapIntervals(vector<vector<int>>& intervals) {
    if (intervals.empty()) {
        return 0;
    }
    sort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) {
        return a[1] < b[1];
    });
    int count = 1;
    int end = intervals[0][1];
    for (int i = 1; i < intervals.size(); i++) {
        if (intervals[i][0] >= end) {
            count++;
            end = intervals[i][1];
        }
    }
    return intervals.size() - count;
}`
};

function generateVisualizationData() {
  const rawIntervals = [
    [1, 4],
    [2, 3],
    [3, 5],
    [0, 6],
    [5, 7],
    [8, 9],
    [5, 9],
    [6, 8]
  ];
  const intervals: Interval[] = rawIntervals.map((arr, index) => ({
    start: arr[0],
    end: arr[1],
    index
  }));

  const steps: Step[] = [];
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

  // Initial State
  steps.push({
    intervals: [...intervals],
    selected: [],
    removed: [],
    current: -1,
    lastEndTime: -1,
    explanation: 'Start activity selection. We want to find the minimum intervals to remove to eliminate overlap.',
    pseudoStep: 'START eraseOverlapIntervals(intervals)',
  });
  addLines(1, 1, 1, 1);

  // Sorting
  intervals.sort((a, b) => a.end - b.end);
  steps.push({
    intervals: [...intervals],
    selected: [],
    removed: [],
    current: -1,
    lastEndTime: -1,
    explanation: 'Greedy Choice: Sort the intervals by their end times in ascending order. Choosing activities that end earliest leaves maximum room for subsequent activities.',
    pseudoStep: 'SORT intervals BY end_time ASC',
  });
  addLines(5, 4, 5, 5);

  let nonOverlappingCount = 1;
  let lastEndTime = intervals[0].end;
  const selected: number[] = [0];
  const removed: number[] = [];

  steps.push({
    intervals: [...intervals],
    selected: [...selected],
    removed: [...removed],
    current: 0,
    lastEndTime,
    explanation: `Select the first sorted interval (ends at ${lastEndTime}). This is our baseline non-overlapping activity.`,
    pseudoStep: `SET count = 1, end = intervals[0].end (${lastEndTime})`,
  });
  addLines(7, 6, 7, 9);

  for (let i = 1; i < intervals.length; i++) {
    const currentStartTime = intervals[i].start;
    const currentEndTime = intervals[i].end;

    steps.push({
      intervals: [...intervals],
      selected: [...selected],
      removed: [...removed],
      current: i,
      lastEndTime,
      explanation: `Check interval ${i} ([${currentStartTime}, ${currentEndTime}]): Does its start time (${currentStartTime}) come after or equal to the last activity's end time (${lastEndTime})?`,
      pseudoStep: `IF intervals[${i}].start (${currentStartTime}) >= end (${lastEndTime})`,
    });
    addLines(11, 8, 9, 11);

    if (currentStartTime >= lastEndTime) {
      nonOverlappingCount++;
      lastEndTime = currentEndTime;
      selected.push(i);

      steps.push({
        intervals: [...intervals],
        selected: [...selected],
        removed: [...removed],
        current: i,
        lastEndTime,
        explanation: `Yes! ${currentStartTime} >= ${lastEndTime - (intervals[i].end === lastEndTime ? 0 : 0)}. Select this interval and update the lastEndTime to ${lastEndTime}.`,
        pseudoStep: `SET count = ${nonOverlappingCount}, end = ${lastEndTime}`,
      });
      addLines(13, 10, 11, 13);
    } else {
      removed.push(i);
      steps.push({
        intervals: [...intervals],
        selected: [...selected],
        removed: [...removed],
        current: i,
        lastEndTime,
        explanation: `No! ${currentStartTime} < ${lastEndTime}. This activity overlaps with our selected set. We must remove it to resolve overlapping.`,
        pseudoStep: `OVERLAP! Remove interval ${i}`,
      });
      addLines(11, 8, 9, 11);
    }
  }

  steps.push({
    intervals: [...intervals],
    selected: [...selected],
    removed: [...removed],
    current: -1,
    lastEndTime,
    explanation: `Completed loop. Total non-overlapping = ${nonOverlappingCount}. Minimum intervals to remove is total length (${intervals.length}) - non-overlapping (${nonOverlappingCount}) = ${intervals.length - nonOverlappingCount}.`,
    pseudoStep: `RETURN total_len - count → ${intervals.length} - ${nonOverlappingCount} = ${intervals.length - nonOverlappingCount}`,
  });
  addLines(16, 11, 14, 16);

  return { steps, stepLineNumbers };
}

export const ActivitySelectionVisualization: React.FC = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map((s) => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <div className="bg-card rounded-xl p-6 border border-border/50 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Timeline Visualization</h3>
              <div className="flex items-center gap-4 text-[10px]">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500"></div>
                  <span>Keep</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500 opacity-60"></div>
                  <span>Remove</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <div className="w-3 h-3 border-l-2 border-dashed border-primary"></div>
                  <span>Last End</span>
                </div>
              </div>
            </div>

            <div className="relative pt-6 pb-2 px-2 min-h-[300px]">
              {/* Time markers */}
              <div className="absolute top-0 left-0 right-0 flex justify-between text-[10px] text-muted-foreground border-b border-border pb-1">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>

              {/* Intervals List */}
              <div className="space-y-3 mt-4">
                {currentStep.intervals.map((activity, idx) => {
                  const isCurrent = idx === currentStep.current;
                  const isSelected = currentStep.selected.includes(idx);
                  const isRemoved = currentStep.removed.includes(idx);

                  return (
                    <div key={idx} className="relative group">
                      <div className="flex items-center h-8">
                        <span
                          className={`w-8 text-[10px] font-mono ${
                            isCurrent ? 'text-primary font-bold' : 'text-muted-foreground'
                          }`}
                        >
                          I{idx}
                        </span>
                        <div className="flex-1 relative h-full">
                          {/* Background guide */}
                          <div className="absolute inset-y-0 left-0 right-0 bg-muted/20 rounded-sm"></div>

                          {/* Interval Box */}
                          <div
                            className={`absolute inset-y-1 rounded border shadow-sm flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-300 ${
                              isSelected
                                ? 'bg-green-500/25 border-green-500 text-green-600 dark:text-green-400 z-10'
                                : isRemoved
                                ? 'bg-red-500/10 border-red-500/30 text-red-500/50 line-through grayscale-[0.5]'
                                : isCurrent
                                ? 'bg-primary/20 border-primary text-primary-foreground scale-[1.02] shadow-md z-20 ring-2 ring-primary/20'
                                : 'bg-muted/50 border-border text-muted-foreground'
                            }`}
                            style={{
                              left: `${(activity.start / 10) * 100}%`,
                              width: `${((activity.end - activity.start) / 10) * 100}%`
                            }}
                          >
                            <span className="truncate px-1">
                              {activity.start}-{activity.end}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* lastEndTime Indicator */}
              {currentStep.lastEndTime !== -1 && (
                <div
                  className="absolute top-0 bottom-0 border-l-2 border-dashed border-primary z-30 pointer-events-none transition-all duration-500 flex flex-col items-center"
                  style={{
                    left: `calc(32px + ${(currentStep.lastEndTime / 10) * (100 - (32 / 400) * 100)}%)`
                  }}
                >
                  <div className="bg-primary text-primary-foreground text-[8px] font-bold px-1 rounded-sm -ml-2 mb-1 shadow-sm">
                    {currentStep.lastEndTime}
                  </div>
                </div>
              )}
            </div>
          </div>

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

          <VariablePanel
            variables={{
              current_activity: currentStep.current !== -1 ? `Interval ${currentStep.current}` : 'None',
              last_valid_end_time: currentStep.lastEndTime === -1 ? '-' : currentStep.lastEndTime,
              non_overlapping_count: currentStep.selected.length,
              removals_count: currentStep.removed.length
            }}
          />
        </div>
      }
      rightContent={
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={handleReset}
        />
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

export default ActivitySelectionVisualization;
