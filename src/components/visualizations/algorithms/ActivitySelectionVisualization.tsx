import React, { useEffect, useRef, useState } from "react";

import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";

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
  message: string;
  lineNumber: number;
}

export const ActivitySelectionVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function eraseOverlapIntervals(intervals: number[][]): number {
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
}`;

  const generateSteps = () => {
    const rawIntervals = [
      [1, 4],
      [3, 5],
      [0, 6],
      [5, 7],
      [8, 9],
      [5, 9],
    ];
    const intervals: Interval[] = rawIntervals.map((arr, index) => ({
      start: arr[0],
      end: arr[1],
      index,
    }));

    const newSteps: Step[] = [];

    newSteps.push({
      intervals: [...intervals],
      selected: [],
      removed: [],
      current: -1,
      lastEndTime: -1,
      message: "Initial set of intervals. We want to find the maximum number of non-overlapping intervals.",
      lineNumber: 1,
    });

    // Sorting Step
    intervals.sort((a, b) => a.end - b.end);

    newSteps.push({
      intervals: [...intervals],
      selected: [],
      removed: [],
      current: -1,
      lastEndTime: -1,
      message: "Greedy Strategy: Sort intervals by their end times (earliest end time first) to leave as much room as possible for others.",
      lineNumber: 6,
    });

    let nonOverlappingCount = 1;
    let lastEndTime = intervals[0].end;
    const selected: number[] = [0];
    const removed: number[] = [];

    newSteps.push({
      intervals: [...intervals],
      selected: [...selected],
      removed: [...removed],
      current: 0,
      lastEndTime,
      message: `Pick the first interval (ends at ${lastEndTime}). This interval ends earliest, so it's a safe greedy choice.`,
      lineNumber: 9,
    });

    for (let i = 1; i < intervals.length; i++) {
      const currentStartTime = intervals[i].start;
      const currentEndTime = intervals[i].end;

      // STEP: Comparison
      newSteps.push({
        intervals: [...intervals],
        selected: [...selected],
        removed: [...removed],
        current: i,
        lastEndTime,
        message: `Checking interval ${i}: Does its start time (${currentStartTime}) come after or at the last end time (${lastEndTime})?`,
        lineNumber: 15,
      });

      if (currentStartTime >= lastEndTime) {
        nonOverlappingCount++;
        lastEndTime = currentEndTime;
        selected.push(i);

        newSteps.push({
          intervals: [...intervals],
          selected: [...selected],
          removed: [...removed],
          current: i,
          lastEndTime,
          message: `Yes! ${currentStartTime} >= ${lastEndTime - (intervals[i - 1].end === lastEndTime ? 0 : 0)}. Update lastEndTime to ${lastEndTime} and increment count.`,
          lineNumber: 17,
        });
      } else {
        removed.push(i);
        newSteps.push({
          intervals: [...intervals],
          selected: [...selected],
          removed: [...removed],
          current: i,
          lastEndTime,
          message: `No, ${currentStartTime} < ${lastEndTime}. This interval overlaps with our selected set, so we must remove it.`,
          lineNumber: 15,
        });
      }
    }

    newSteps.push({
      intervals: [...intervals],
      selected: [...selected],
      removed: [...removed],
      current: -1,
      lastEndTime,
      message: `Done! Maximum non-overlapping intervals = ${nonOverlappingCount}. Minimum removals = ${intervals.length} - ${nonOverlappingCount} = ${intervals.length - nonOverlappingCount}.`,
      lineNumber: 21,
    });

    setSteps(newSteps);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1)
      setCurrentStepIndex(currentStepIndex + 1);
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
  };
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="space-y-6">
      <StepControls
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        isPlaying={isPlaying}
        currentStep={currentStepIndex}
        totalSteps={steps.length - 1}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 border space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Timeline Visualization</h3>
            <div className="flex items-center gap-4 text-[10px] sm:text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500"></div>
                <span>Keep</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500 opacity-60"></div>
                <span>Remove</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border-l-2 border-dashed border-primary"></div>
                <span>Last End</span>
              </div>
            </div>
          </div>

          <div className="relative pt-6 pb-2 px-2 min-h-[400px]">
            {/* Time markers */}
            <div className="absolute top-0 left-0 right-0 flex justify-between text-[10px] text-muted-foreground border-b border-border pb-1">
              {[0, 2, 4, 6, 8, 10].map(t => <span key={t}>{t}</span>)}
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
                      <span className={`w-8 text-[10px] font-mono ${isCurrent ? 'text-primary font-bold' : 'text-muted-foreground'}`}>I{idx}</span>
                      <div className="flex-1 relative h-full">
                        {/* Background guide */}
                        <div className="absolute inset-y-0 left-0 right-0 bg-muted/20 rounded-sm"></div>

                        {/* Interval Box */}
                        <div
                          className={`absolute inset-y-1 rounded border shadow-sm flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${isSelected
                            ? "bg-green-500/20 border-green-500 text-green-700 dark:text-green-400 z-10"
                            : isRemoved
                              ? "bg-red-500/10 border-red-500/30 text-red-500/50 line-through grayscale-[0.5]"
                              : isCurrent
                                ? "bg-primary/20 border-primary text-primary-foreground scale-[1.02] shadow-md z-20 ring-2 ring-primary/20"
                                : "bg-secondary border-border text-muted-foreground"
                            }`}
                          style={{
                            left: `${(activity.start / 10) * 100}%`,
                            width: `${((activity.end - activity.start) / 10) * 100}%`,
                          }}
                        >
                          <span className="truncate px-1">{activity.start}-{activity.end}</span>
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
                style={{ left: `calc(32px + ${(currentStep.lastEndTime / 10) * (100 - (32 / 400 * 100))}%` }}
              >
                <div className="bg-primary text-white text-[8px] font-bold px-1 rounded-sm -ml-2 mb-1">
                  {currentStep.lastEndTime}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-accent/30 rounded-lg border border-accent/20">
            <p className="text-sm font-medium leading-relaxed">{currentStep.message}</p>
          </div>

          <VariablePanel
            variables={{
              "Current Activity": currentStep.current !== -1 ? `Interval ${currentStep.current}` : "None",
              "Last Valid End Time": currentStep.lastEndTime === -1 ? "N/A" : currentStep.lastEndTime,
              "Selected Count": currentStep.selected.length,
              "Removals Required": currentStep.removed.length,
            }}
          />
        </div>

        <AnimatedCodeEditor
          code={code}
          highlightedLines={[currentStep.lineNumber]}
          language="TypeScript"
        />
      </div>
    </div>
  );
};
