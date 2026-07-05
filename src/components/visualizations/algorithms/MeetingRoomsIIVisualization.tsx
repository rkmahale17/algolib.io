import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { Button } from '@/components/ui/button';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Meeting {
  start: number;
  end: number;
  id: number;
}

interface Step {
  startTimes: number[];
  endTimes: number[];
  s: number;
  e: number;
  count: number;
  res: number;
  activeMeetings: Meeting[];
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const USE_CASES = [
  {
    id: 'standard',
    label: 'Case 1: Standard',
    intervals: [[0, 30], [5, 10], [15, 20]],
  },
  {
    id: 'heavy-overlap',
    label: 'Case 2: Heavy Overlap',
    intervals: [[1, 10], [2, 7], [3, 19], [8, 12]],
  },
  {
    id: 'sequential',
    label: 'Case 3: Sequential',
    intervals: [[1, 5], [5, 10], [10, 15]],
  }
];

const languages: VisualizationLanguageMap = {
  python: `def minMeetingRooms(intervals):
    start = sorted([i[0] for i in intervals])
    end = sorted([i[1] for i in intervals])
    res = 0
    count = 0
    s = 0
    e = 0
    while s < len(intervals):
        if start[s] < end[e]:
            s += 1
            count += 1
        else:
            e += 1
            count -= 1
        res = max(res, count)
    return res`,
  typescript: `function minMeetingRooms(intervals: number[][]): number {
  const start = intervals.map(i => i[0]).sort((a, b) => a - b);
  const end = intervals.map(i => i[1]).sort((a, b) => a - b);
  let res = 0, count = 0;
  let s = 0, e = 0;
  while (s < intervals.length) {
    if (start[s] < end[e]) {
      s++;
      count++;
    } else {
      e++;
      count--;
    }
    res = Math.max(res, count);
  }
  return res;
}`,
  java: `public class Solution {
    public int minMeetingRooms(int[][] intervals) {
        int[] start = new int[intervals.length];
        int[] end = new int[intervals.length];
        for (int i = 0; i < intervals.length; i++) {
            start[i] = intervals[i][0];
            end[i] = intervals[i][1];
        }
        Arrays.sort(start);
        Arrays.sort(end);
        int res = 0;
        int count = 0;
        int s = 0;
        int e = 0;
        while (s < intervals.length) {
            if (start[s] < end[e]) {
                s++;
                count++;
            } else {
                e++;
                count--;
            }
            res = Math.max(res, count);
        }
        return res;
    }
}`,
  cpp: `class Solution {
public:
    int minMeetingRooms(vector<vector<int>>& intervals) {
        int n = intervals.size();
        vector<int> start(n), end(n);
        for (int i = 0; i < n; i++) {
            start[i] = intervals[i][0];
            end[i] = intervals[i][1];
        }
        sort(start.begin(), start.end());
        sort(end.begin(), end.end());
        int res = 0;
        int count = 0;
        int s = 0;
        int e = 0;
        while (s < n) {
            if (start[s] < end[e]) {
                s++;
                count++;
            } else {
                e++;
                count--;
            }
            res = max(res, count);
        }
        return res;
    }
};`,
};

const generateVisualizationData = (intervals: number[][]) => {
  const startArr = [...intervals.map(i => i[0])].sort((a, b) => a - b);
  const endArr = [...intervals.map(i => i[1])].sort((a, b) => a - b);

  const steps: Step[] = [];
  const stepLineNumbers: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };

  const addLines = (ts: number, py: number, java: number, cpp: number) => {
    stepLineNumbers.typescript!.push(ts);
    stepLineNumbers.python!.push(py);
    stepLineNumbers.java!.push(java);
    stepLineNumbers.cpp!.push(cpp);
  };

  // 1. Initial State / Signature
  steps.push({
    startTimes: startArr,
    endTimes: endArr,
    s: 0,
    e: 0,
    count: 0,
    res: 0,
    activeMeetings: [],
    explanation: "Initialize the meeting rooms manager.",
    pseudoStep: "CALL minMeetingRooms(intervals)",
    variables: { intervals: JSON.stringify(intervals) }
  });
  addLines(1, 1, 2, 3);

  // 2. Sort start times
  steps.push({
    startTimes: startArr,
    endTimes: endArr,
    s: 0,
    e: 0,
    count: 0,
    res: 0,
    activeMeetings: [],
    explanation: "Sort all start times in ascending order to process meetings chronologically.",
    pseudoStep: "SET start = sorted(start_times)",
    variables: { start: JSON.stringify(startArr) }
  });
  addLines(2, 2, 9, 10);

  // 3. Sort end times
  steps.push({
    startTimes: startArr,
    endTimes: endArr,
    s: 0,
    e: 0,
    count: 0,
    res: 0,
    activeMeetings: [],
    explanation: "Sort all end times in ascending order to know when rooms become available.",
    pseudoStep: "SET end = sorted(end_times)",
    variables: { end: JSON.stringify(endArr) }
  });
  addLines(3, 3, 10, 11);

  // 4. Initialize res, count
  steps.push({
    startTimes: startArr,
    endTimes: endArr,
    s: 0,
    e: 0,
    count: 0,
    res: 0,
    activeMeetings: [],
    explanation: "Initialize peak occupancy (res) and current active count to 0.",
    pseudoStep: "SET res = 0, count = 0",
    variables: { res: 0, count: 0 }
  });
  addLines(4, 4, 11, 12);

  // 5. Initialize pointers s, e
  steps.push({
    startTimes: startArr,
    endTimes: endArr,
    s: 0,
    e: 0,
    count: 0,
    res: 0,
    activeMeetings: [],
    explanation: "Initialize pointers s (for start times) and e (for end times) to 0.",
    pseudoStep: "SET s = 0, e = 0",
    variables: { s: 0, e: 0 }
  });
  addLines(5, 6, 13, 14);

  let res = 0;
  let count = 0;
  let s = 0;
  let e = 0;
  const activeMeetings: Meeting[] = [];

  while (s < intervals.length) {
    // 6. Loop Condition Check
    steps.push({
      startTimes: startArr,
      endTimes: endArr,
      s,
      e,
      count,
      res,
      activeMeetings: [...activeMeetings],
      explanation: `Check if there are remaining meetings to start (s = ${s} < ${intervals.length}).`,
      pseudoStep: `WHILE s < ${intervals.length} → s = ${s}`,
      variables: { s, e, count, res }
    });
    addLines(6, 8, 15, 16);

    const isStartBeforeEnd = startArr[s] < endArr[e];

    // 7. If Condition Check
    steps.push({
      startTimes: startArr,
      endTimes: endArr,
      s,
      e,
      count,
      res,
      activeMeetings: [...activeMeetings],
      explanation: `Compare next start time (${startArr[s]}) with earliest ending time (${endArr[e]}).`,
      pseudoStep: `IF start[${s}] < end[${e}] → ${startArr[s]} < ${endArr[e]} ?`,
      variables: { "start[s]": startArr[s], "end[e]": endArr[e], "result": isStartBeforeEnd }
    });
    addLines(7, 9, 16, 17);

    if (isStartBeforeEnd) {
      s++;
      count++;
      activeMeetings.push({ start: startArr[s - 1], end: endArr[e], id: s - 1 });

      // 8. If True Branch (Allocate Room)
      steps.push({
        startTimes: startArr,
        endTimes: endArr,
        s,
        e,
        count,
        res,
        activeMeetings: [...activeMeetings],
        explanation: "Yes. Next meeting starts before the earliest ends. Allocate a new room. Increment count and s.",
        pseudoStep: `SET s = ${s}, count = ${count} → allocate room`,
        variables: { s, e, count, res }
      });
      addLines(8, 10, 17, 18);
    } else {
      e++;
      count--;
      if (activeMeetings.length > 0) activeMeetings.shift();

      // 9. If False Branch (Free Room)
      steps.push({
        startTimes: startArr,
        endTimes: endArr,
        s,
        e,
        count,
        res,
        activeMeetings: [...activeMeetings],
        explanation: "No. A meeting ended before or at the same time the next one starts. Free a room. Decrement count and increment e.",
        pseudoStep: `SET e = ${e}, count = ${count} → free room`,
        variables: { s, e, count, res }
      });
      addLines(11, 13, 20, 21);
    }

    res = Math.max(res, count);

    // 10. Update res
    steps.push({
      startTimes: startArr,
      endTimes: endArr,
      s,
      e,
      count,
      res,
      activeMeetings: [...activeMeetings],
      explanation: `Update peak occupancy: max(res, count) = max(${res}, ${count}) = ${res}.`,
      pseudoStep: `SET res = MAX(res, count) → res = ${res}`,
      variables: { s, e, count, res }
    });
    addLines(14, 15, 23, 24);
  }

  // 11. Loop Terminated
  steps.push({
    startTimes: startArr,
    endTimes: endArr,
    s,
    e,
    count,
    res,
    activeMeetings: [],
    explanation: "All start times processed. Loop terminates.",
    pseudoStep: `WHILE s < ${intervals.length} → FALSE ✗`,
    variables: { s, e, count, res }
  });
  addLines(6, 8, 15, 16);

  // 12. Return result
  steps.push({
    startTimes: startArr,
    endTimes: endArr,
    s,
    e,
    count,
    res,
    activeMeetings: [],
    explanation: `Return the peak number of rooms required: ${res}.`,
    pseudoStep: `RETURN res → ${res}`,
    variables: { return: res }
  });
  addLines(16, 16, 25, 26);

  return { steps, stepLineNumbers };
};

export const MeetingRoomsIIVisualization = () => {
  const [useCaseIdx, setUseCaseIdx] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentCase = USE_CASES[useCaseIdx];

  const { steps, stepLineNumbers } = useMemo(() => {
    return generateVisualizationData(currentCase.intervals);
  }, [currentCase]);

  const currentStep = steps[currentStepIndex] || steps[steps.length - 1];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  const handleUseCaseChange = (idx: number) => {
    setUseCaseIdx(idx);
    setCurrentStepIndex(0);
  };

  return (
    <div className="space-y-6">
      {/* Controls at Top */}
      <div className="flex flex-col gap-6 bg-card p-6 rounded-xl border border-border shadow-sm overflow-x-auto">
        <div className="flex flex-wrap gap-2">
          {USE_CASES.map((uc, idx) => (
            <Button
              key={uc.id}
              variant={useCaseIdx === idx ? "default" : "outline"}
              size="sm"
              onClick={() => handleUseCaseChange(idx)}
              className={`text-xs h-8 px-4 rounded-full transition-all duration-200 ${
                useCaseIdx === idx ? "shadow-md scale-105" : "hover:bg-muted"
              }`}
            >
              {uc.label}
            </Button>
          ))}
        </div>
        <div className="w-full pt-4 border-t border-border">
          <SimpleStepControls
            currentStep={currentStepIndex}
            totalSteps={steps.length}
            onStepChange={setCurrentStepIndex}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column: Visual Representation & Variables & Commentary */}
        <Card className="p-4 flex flex-col gap-6 overflow-hidden border border-border shadow-lg bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <div className="flex flex-col items-center px-2 py-0.5 bg-primary/10 rounded-lg border border-primary/20 min-w-[50px]">
                <span className="text-[8px] font-bold text-primary/70 uppercase">Peak</span>
                <span className="text-sm font-bold text-primary">{currentStep.res}</span>
              </div>
              <div className="flex flex-col items-center px-2 py-0.5 bg-secondary/30 rounded-lg border border-secondary/50 min-w-[50px]">
                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">Active</span>
                <span className="text-sm font-bold text-foreground">{currentStep.count}</span>
              </div>
            </div>
          </div>

          <div className="space-y-8 flex-1">
            <div className="space-y-4">
              {/* Start Times Row */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Start Times</span>
                  <span className="text-[10px] font-mono text-muted-foreground">s: {currentStep.s}</span>
                </div>
                <div className="flex gap-2 overflow-x-auto py-2 px-1 w-full no-scrollbar">
                  {currentStep.startTimes.map((time, idx) => (
                    <div
                      key={`start-${idx}`}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 font-mono font-bold text-xs transition-all duration-300 ${
                        idx === currentStep.s
                          ? "bg-primary text-primary-foreground border-primary scale-110 shadow-lg z-10"
                          : idx < currentStep.s
                          ? "bg-primary/5 border-primary/10 text-primary/30"
                          : "bg-muted/50 border-border text-foreground/70"
                      }`}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>

              {/* End Times Row */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">End Times</span>
                  <span className="text-[10px] font-mono text-muted-foreground">e: {currentStep.e}</span>
                </div>
                <div className="flex gap-2 overflow-x-auto py-2 px-1 no-scrollbar">
                  {currentStep.endTimes.map((time, idx) => (
                    <div
                      key={`end-${idx}`}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 font-mono font-bold text-xs transition-all duration-300 ${
                        idx === currentStep.e
                          ? "bg-orange-500 text-white border-orange-600 scale-110 shadow-lg z-10"
                          : idx < currentStep.e
                          ? "bg-orange-500/5 border-orange-200/30 text-orange-400/40"
                          : "bg-muted/50 border-border text-foreground/70"
                      }`}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual Action Indicator */}
            <div className="bg-muted/40 rounded-2xl p-4 border border-border/50 min-h-[140px] flex flex-col justify-center gap-4">
              <div className="flex justify-center items-center gap-6">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`text-xl font-bold ${currentStep.s < currentStep.startTimes.length ? 'text-primary' : 'text-muted-foreground/30'}`}>
                    {currentStep.s < currentStep.startTimes.length ? currentStep.startTimes[currentStep.s] : '—'}
                  </div>
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Next Start</div>
                </div>

                <div className="text-2xl font-light text-muted-foreground/30">
                  {currentStep.s < currentStep.startTimes.length && currentStep.e < currentStep.endTimes.length ? (
                    currentStep.startTimes[currentStep.s] < currentStep.endTimes[currentStep.e] ? '<' : '≥'
                  ) : ''}
                </div>

                <div className="flex flex-col items-center gap-1.5">
                  <div className={`text-xl font-bold ${currentStep.e < currentStep.endTimes.length ? 'text-orange-500' : 'text-muted-foreground/30'}`}>
                    {currentStep.e < currentStep.endTimes.length ? currentStep.endTimes[currentStep.e] : '—'}
                  </div>
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Earliest End</div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className={`px-4 py-1.5 rounded-full font-bold text-xs tracking-tight transition-all duration-300 ${
                  currentStep.s < currentStep.startTimes.length && currentStep.e < currentStep.endTimes.length
                    ? (currentStep.startTimes[currentStep.s] < currentStep.endTimes[currentStep.e]
                      ? "bg-primary text-white shadow-sm border border-primary/20"
                      : "bg-orange-500 text-white shadow-sm border border-orange-600")
                    : "opacity-0 invisible"
                }`}>
                  {currentStep.s < currentStep.startTimes.length && currentStep.e < currentStep.endTimes.length
                    ? (currentStep.startTimes[currentStep.s] < currentStep.endTimes[currentStep.e]
                      ? "Allocate New Room"
                      : "Free Available Room")
                    : ""
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Descriptive Commentary Box (at the bottom) */}
          <div className="p-3 bg-muted/50 rounded-lg text-xs leading-relaxed text-foreground border border-border shadow-inner">
            <div className="flex items-center gap-2 mb-1 text-primary font-bold text-[10px] uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Process Step
            </div>
            {currentStep.explanation}
          </div>
        </Card>

        {/* Right Column: Code panel & VariablePanel */}
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={() => setCurrentStepIndex(0)}
          />
          <VariablePanel variables={currentStep.variables} />
        </div>
      </div>
    </div>
  );
};