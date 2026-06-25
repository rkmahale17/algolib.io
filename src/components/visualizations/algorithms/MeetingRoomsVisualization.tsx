import React, { useState, useMemo } from 'react';
import { VariablePanel } from '../shared/VariablePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Interval {
  start: number;
  end: number;
  originalIndex: number;
}

interface Step {
  intervals: Interval[];
  current: number;
  previous: number;
  hasOverlap: boolean;
  isSorted: boolean;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const USE_CASES = [
  {
    id: 'overlapping',
    label: 'Case 1: Overlapping',
    intervals: [[0, 30], [5, 10], [15, 20]],
  },
  {
    id: 'non-overlapping',
    label: 'Case 2: Clear Schedule',
    intervals: [[7, 10], [2, 4], [15, 20]],
  }
];

const languages: VisualizationLanguageMap = {
  typescript: `function canAttendMeetings(intervals: number[][]): boolean {
  if (intervals.length <= 1) return true;
  intervals.sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < intervals[i - 1][1]) {
      return false;
    }
  }
  return true;
}`,

  python: `def canAttendMeetings(intervals: list[list[int]]) -> bool:
  if len(intervals) <= 1:
    return True
  intervals.sort(key=lambda x: x[0])
  for i in range(1, len(intervals)):
    if intervals[i][0] < intervals[i - 1][1]:
      return False
  return True`,

  java: `public boolean canAttendMeetings(int[][] intervals) {
  if (intervals.length <= 1) {
    return true;
  }
  Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
  for (int i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < intervals[i - 1][1]) {
      return false;
    }
  }
  return true;
}`,

  cpp: `bool canAttendMeetings(vector<vector<int>>& intervals) {
  if (intervals.size() <= 1) return true;
  sort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) {
    return a[0] < b[0];
  });
  for (size_t i = 1; i < intervals.size(); i++) {
    if (intervals[i][0] < intervals[i - 1][1]) {
      return false;
    }
  }
  return true;
}`
};

function generateVisualizationData(rawIntervals: number[][]) {
  const intervals: Interval[] = rawIntervals.map((arr, index) => ({
    start: arr[0],
    end: arr[1],
    originalIndex: index,
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

  steps.push({
    intervals: [...intervals],
    current: -1,
    previous: -1,
    hasOverlap: false,
    isSorted: false,
    explanation: "First, verify list size. If there's 0 or 1 meetings, the schedule is instantly valid.",
    pseudoStep: "IF intervals.length <= 1 RETURN true",
    variables: { "intervals.length": intervals.length }
  });
  addLines(2, 2, 2, 2);

  steps.push({
    intervals: [...intervals],
    current: -1,
    previous: -1,
    hasOverlap: false,
    isSorted: false,
    explanation: "Sort all meetings by start time to evaluate intervals sequentially.",
    pseudoStep: "SORT intervals BY start_time ASC",
    variables: { "action": "sorting" }
  });
  addLines(3, 4, 5, 3);

  const sortedIntervals = [...intervals].sort((a, b) => a.start - b.start);
  steps.push({
    intervals: sortedIntervals,
    current: -1,
    previous: -1,
    hasOverlap: false,
    isSorted: true,
    explanation: "Meetings are successfully sorted by start time.",
    pseudoStep: "SORT COMPLETE",
    variables: { "sorted": true }
  });
  addLines(3, 4, 5, 3);

  for (let i = 1; i < sortedIntervals.length; i++) {
    const prev = sortedIntervals[i - 1];
    const cur = sortedIntervals[i];
    const overlap = cur.start < prev.end;

    steps.push({
      intervals: sortedIntervals,
      current: i,
      previous: i - 1,
      hasOverlap: false,
      isSorted: true,
      explanation: `Iteration i = ${i}: Compare meeting ${i} ([${cur.start}, ${cur.end}]) with meeting ${i - 1} ([${prev.start}, ${prev.end}]).`,
      pseudoStep: `FOR i = ${i} TO intervals.length - 1`,
      variables: { i, "current_meeting": `[${cur.start}, ${cur.end}]`, "previous_meeting": `[${prev.start}, ${prev.end}]` }
    });
    addLines(4, 5, 6, 6);

    steps.push({
      intervals: sortedIntervals,
      current: i,
      previous: i - 1,
      hasOverlap: false,
      isSorted: true,
      explanation: `Check if current start (${cur.start}) is less than previous end (${prev.end}): ${cur.start} < ${prev.end}?`,
      pseudoStep: `IF current.start < previous.end`,
      variables: { i, "curr.start": cur.start, "prev.end": prev.end }
    });
    addLines(5, 6, 7, 7);

    if (overlap) {
      steps.push({
        intervals: sortedIntervals,
        current: i,
        previous: i - 1,
        hasOverlap: true,
        isSorted: true,
        explanation: `Overlap detected! Meeting starts at ${cur.start} before previous finishes at ${prev.end}. Return false.`,
        pseudoStep: `RETURN false`,
        variables: { "conflict": true, "return": false }
      });
      addLines(6, 7, 8, 8);
      return { steps, stepLineNumbers };
    }
  }

  steps.push({
    intervals: sortedIntervals,
    current: -1,
    previous: -1,
    hasOverlap: false,
    isSorted: true,
    explanation: "Checked all consecutive intervals. No overlaps found. Return true.",
    pseudoStep: "RETURN true",
    variables: { "return": true }
  });
  addLines(9, 8, 11, 11);

  return { steps, stepLineNumbers };
}

export const MeetingRoomsVisualization: React.FC = () => {
  const [useCaseIdx, setUseCaseIdx] = useState(0);
  const currentCase = USE_CASES[useCaseIdx];
  const { steps, stepLineNumbers } = useMemo(() => generateVisualizationData(currentCase.intervals), [useCaseIdx]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  const handleUseCaseChange = (idx: number) => {
    setUseCaseIdx(idx);
    setCurrentStepIndex(0);
  };

  const currentStep = steps[currentStepIndex] || steps[steps.length - 1];
  const pseudoSteps = steps.map((s) => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {USE_CASES.map((uc, idx) => (
              <Button
                key={uc.id}
                variant={useCaseIdx === idx ? "default" : "outline"}
                size="sm"
                onClick={() => handleUseCaseChange(idx)}
                className={`text-xs h-8 px-4 rounded-full transition-all duration-200 ${useCaseIdx === idx ? "shadow-md scale-105" : "hover:bg-muted"}`}
              >
                {uc.label}
              </Button>
            ))}
          </div>

          <div className="bg-card rounded-xl p-6 border border-border/50 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Timeline</h3>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-primary/25 border border-primary"></div>
                  <span className="text-muted-foreground text-[10px]">Comparing</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500"></div>
                  <span className="text-muted-foreground text-[10px]">Conflict</span>
                </div>
              </div>
            </div>

            <div className="relative pt-8 pb-4 px-2 min-h-[160px]">
              <div className="absolute top-0 left-0 right-0 flex justify-between text-[10px] text-muted-foreground border-b pb-1">
                {[0, 5, 10, 15, 20, 25, 30].map(t => <span key={t}>{t}</span>)}
              </div>

              <div className="space-y-3 mt-4">
                {currentStep.intervals.map((interval, idx) => {
                  const isCurrent = idx === currentStep.current;
                  const isPrevious = idx === currentStep.previous;
                  const isConflicting = (isCurrent || isPrevious) && currentStep.hasOverlap;

                  return (
                    <div key={idx} className="relative h-8 flex items-center">
                      <span className="w-8 text-[10px] font-mono text-muted-foreground">M{idx}</span>
                      <div className="flex-1 relative h-full bg-muted/20 rounded-sm">
                        <div
                          className={`absolute inset-y-1 rounded border shadow-sm flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                            isConflicting
                              ? "bg-red-500/25 border-red-500 text-red-600 dark:text-red-400 z-20 scale-[1.03]"
                              : isCurrent || isPrevious
                              ? "bg-primary/20 border-primary text-primary z-10 scale-[1.01]"
                              : "bg-muted border-border text-foreground/50 opacity-60"
                          }`}
                          style={{
                            left: `${(interval.start / 30) * 100}%`,
                            width: `${((interval.end - interval.start) / 30) * 100}%`,
                          }}
                        >
                          <span className="truncate px-1">{interval.start}-{interval.end}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {currentStep.previous !== -1 && currentStep.current !== -1 && (
                <div
                  className={`absolute top-0 bottom-0 border-l-2 border-dashed transition-all duration-500 z-30 ${currentStep.hasOverlap ? 'border-red-500' : 'border-primary/50'}`}
                  style={{
                    left: `calc(32px + ${(currentStep.intervals[currentStep.previous].end / 30) * (100 - (32 / 400 * 100))}%`
                  }}
                >
                  <div className={`text-[8px] font-bold px-1 rounded-sm -ml-2 mb-1 ${currentStep.hasOverlap ? 'bg-red-500 text-white' : 'bg-primary text-white'}`}>
                    End: {currentStep.intervals[currentStep.previous].end}
                  </div>
                </div>
              )}
            </div>
          </div>

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

          <VariablePanel variables={currentStep.variables} />
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

export default MeetingRoomsVisualization;