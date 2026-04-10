import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { StepControls } from '../shared/StepControls';
import { Button } from '@/components/ui/button';

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
  message: string;
  highlightedLines: number[];
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

export const MeetingRoomsVisualization = () => {
  const [useCaseIdx, setUseCaseIdx] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // Changed to 1-3x as per StepControls

  const currentCase = USE_CASES[useCaseIdx];

  const generateSteps = (rawIntervals: number[][]): Step[] => {
    const intervals: Interval[] = rawIntervals.map((arr, index) => ({
      start: arr[0],
      end: arr[1],
      originalIndex: index,
    }));

    const steps: Step[] = [];

    // Step: Initial State
    steps.push({
      intervals: [...intervals],
      current: -1,
      previous: -1,
      hasOverlap: false,
      isSorted: false,
      message: "Check if we have 0 or 1 meetings. If so, return true immediately.",
      highlightedLines: [2],
      variables: { "intervals.length": intervals.length, "Result": "Continue" }
    });

    // Step: Sorting (before)
    steps.push({
      intervals: [...intervals],
      current: -1,
      previous: -1,
      hasOverlap: false,
      isSorted: false,
      message: "Sort the meetings by start time to process them chronologically.",
      highlightedLines: [4],
      variables: { "Action": "Sorting..." }
    });

    // Step: Sorting (after)
    const sortedIntervals = [...intervals].sort((a, b) => a.start - b.start);
    steps.push({
      intervals: sortedIntervals,
      current: -1,
      previous: -1,
      hasOverlap: false,
      isSorted: true,
      message: "Meetings are now sorted by their start times.",
      highlightedLines: [4],
      variables: { "Sorted": "True" }
    });

    // Loop steps
    for (let i = 1; i < sortedIntervals.length; i++) {
      const prev = sortedIntervals[i - 1];
      const cur = sortedIntervals[i];
      const overlap = cur.start < prev.end;

      // i check
      steps.push({
        intervals: sortedIntervals,
        current: i,
        previous: i - 1,
        hasOverlap: false,
        isSorted: true,
        message: `Loop iteration i = ${i}. Comparing meeting ${i} with meeting ${i - 1}.`,
        highlightedLines: [6],
        variables: { "i": i, "intervals.length": sortedIntervals.length }
      });

      // destructure cur
      steps.push({
        intervals: sortedIntervals,
        current: i,
        previous: i - 1,
        hasOverlap: false,
        isSorted: true,
        message: `Current meeting: [${cur.start}, ${cur.end}].`,
        highlightedLines: [7],
        variables: { "start": cur.start, "end": cur.end }
      });

      // destructure prev
      steps.push({
        intervals: sortedIntervals,
        current: i,
        previous: i - 1,
        hasOverlap: false,
        isSorted: true,
        message: `Previous meeting: [${prev.start}, ${prev.end}].`,
        highlightedLines: [8],
        variables: { "prevStart": prev.start, "prevEnd": prev.end }
      });

      // if check
      steps.push({
        intervals: sortedIntervals,
        current: i,
        previous: i - 1,
        hasOverlap: false,
        isSorted: true,
        message: `Is start (${cur.start}) < previous end (${prev.end})?`,
        highlightedLines: [10],
        variables: { "check": `${cur.start} < ${prev.end}`, "result": overlap.toString() }
      });

      if (overlap) {
        steps.push({
          intervals: sortedIntervals,
          current: i,
          previous: i - 1,
          hasOverlap: true,
          isSorted: true,
          message: `OVERLAP! Person cannot attend both meetings.`,
          highlightedLines: [11],
          variables: { "Conflict": "Overlap found", "Return": "false" }
        });
        return steps;
      }
    }

    // Final Success
    steps.push({
      intervals: sortedIntervals,
      current: -1,
      previous: -1,
      hasOverlap: false,
      isSorted: true,
      message: "Checked all consecutive pairs. No overlaps found!",
      highlightedLines: [15],
      variables: { "Return": "true" }
    });

    return steps;
  };

  const steps = generateSteps(currentCase.intervals);
  const currentStep = steps[currentStepIndex] || steps[steps.length - 1];

  const code = `function canAttendMeetings(intervals: number[][]): boolean {
  if (intervals.length <= 1) return true;
  
  intervals.sort((a, b) => a[0] - b[0]);
  
  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    const [prevStart, prevEnd] = intervals[i - 1];
    
    if (start < prevEnd) {
      return false;
    }
  }
  
  return true;
}`;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentStepIndex < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 2000 / speed);
    } else {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handleUseCaseChange = (idx: number) => {
    setUseCaseIdx(idx);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 bg-muted/30 p-6 rounded-xl border border-border shadow-sm">
        <div className="flex flex-wrap gap-2">
          {USE_CASES.map((uc, idx) => (
            <Button
              key={uc.id}
              variant={useCaseIdx === idx ? "default" : "outline"}
              size="sm"
              onClick={() => handleUseCaseChange(idx)}
              className={`text-xs h-8 px-4 rounded-full transition-all duration-200 ${useCaseIdx === idx ? "shadow-md scale-105" : "hover:bg-muted"
                }`}
            >
              {uc.label}
            </Button>
          ))}
        </div>

        <div className="w-full pt-4 border-t border-border/50">
          <StepControls
            currentStep={currentStepIndex}
            totalSteps={steps.length - 1}
            onStepForward={() => setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
            onStepBack={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
            isPlaying={isPlaying}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onReset={() => {
              setCurrentStepIndex(0);
              setIsPlaying(false);
            }}
            speed={speed}
            onSpeedChange={setSpeed}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
        <Card className="p-6 flex flex-col gap-6 overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-primary/20 border border-primary"></div>
                <span className="text-foreground">Normal</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-destructive/20 border border-destructive"></div>
                <span className="text-foreground">Conflict</span>
              </div>
            </div>
          </div>

          <div className="relative pt-8 pb-4 px-2 min-h-[300px]">
            <div className="absolute top-0 left-0 right-0 flex justify-between text-[10px] text-muted-foreground border-b pb-1">
              {[0, 5, 10, 15, 20, 25, 30].map(t => <span key={t} className="text-muted-foreground">{t}</span>)}
            </div>

            <div className="space-y-4 mt-4">
              {currentStep.intervals.map((interval, idx) => {
                const isCurrent = idx === currentStep.current;
                const isPrevious = idx === currentStep.previous;
                const isConflicting = (isCurrent || isPrevious) && currentStep.hasOverlap;

                return (
                  <div key={`${useCaseIdx}-${idx}`} className="relative h-8 flex items-center">
                    <span className="w-8 text-[10px] font-mono text-muted-foreground">M{idx}</span>
                    <div className="flex-1 relative h-full bg-muted/20 rounded-sm">
                      <div
                        className={`absolute inset-y-1 rounded border shadow-sm flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${isConflicting
                          ? "bg-destructive/20 border-destructive text-destructive z-20 scale-[1.05]"
                          : isCurrent || isPrevious
                            ? "bg-primary/20 border-primary text-primary z-10 scale-[1.02]"
                            : "bg-secondary border-border text-foreground opacity-60"
                          }`}
                        style={{
                          left: `${(interval.start / 30) * 100}%`,
                          width: `${((interval.end - interval.start) / 30) * 100}%`,
                        }}
                      >
                        <span className="truncate px-1 text-foreground">{interval.start}-{interval.end}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {currentStep.previous !== -1 && currentStep.current !== -1 && (
              <div
                className={`absolute top-0 bottom-0 border-l-2 border-dashed transition-all duration-500 z-30 ${currentStep.hasOverlap ? 'border-destructive' : 'border-primary/50'
                  }`}
                style={{
                  left: `calc(32px + ${(currentStep.intervals[currentStep.previous].end / 30) * (100 - (32 / 400 * 100))}%`
                }}
              >
                <div className={`text-[8px] font-bold px-1 rounded-sm -ml-2 mb-1 ${currentStep.hasOverlap ? 'bg-destructive text-white' : 'bg-primary text-white'
                  }`}>
                  End: {currentStep.intervals[currentStep.previous].end}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-muted/50 rounded-lg text-sm leading-relaxed text-foreground border border-border/50">
            {currentStep.message}
          </div>

          <VariablePanel variables={currentStep.variables} />
        </Card>

        <AnimatedCodeEditor
          code={code}
          language="typescript"
          highlightedLines={currentStep.highlightedLines}
        />
      </div>
    </div>
  );
};