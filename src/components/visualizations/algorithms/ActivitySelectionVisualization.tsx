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
    const rawIntervals = [[1, 4], [3, 5], [0, 6], [5, 7], [8, 9], [5, 9]];
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
      lastEndTime: 0,
      message: "Check if intervals array is empty.",
      lineNumber: 2,
    });

    intervals.sort((a, b) => a.end - b.end);

    newSteps.push({
      intervals: [...intervals],
      selected: [],
      removed: [],
      current: -1,
      lastEndTime: 0,
      message: "Sort intervals based on their end times in ascending order.",
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
      message: `Initialize nonOverlappingCount = 1 and lastEndTime = ${lastEndTime} (from first interval).`,
      lineNumber: 8,
    });

    for (let i = 1; i < intervals.length; i++) {
      const currentStartTime = intervals[i].start;
      const currentEndTime = intervals[i].end;

      newSteps.push({
        intervals: [...intervals],
        selected: [...selected],
        removed: [...removed],
        current: i,
        lastEndTime,
        message: `Checking interval ${i}: [${currentStartTime}, ${currentEndTime}] against lastEndTime ${lastEndTime}.`,
        lineNumber: 11,
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
          message: `currentStartTime (${currentStartTime}) >= lastEndTime. Increment count to ${nonOverlappingCount} and update lastEndTime to ${lastEndTime}.`,
          lineNumber: 16,
        });
      } else {
        removed.push(i);
        newSteps.push({
          intervals: [...intervals],
          selected: [...selected],
          removed: [...removed],
          current: i,
          lastEndTime,
          message: `currentStartTime (${currentStartTime}) < lastEndTime. It overlaps, so we skip it (counts towards removals).`,
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
      message: `Finished loop. Minimum intervals to remove = total (${intervals.length}) - nonOverlappingCount (${nonOverlappingCount}) = ${intervals.length - nonOverlappingCount}.`,
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
        totalSteps={steps.length}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 border space-y-4">
          <h3 className="text-lg font-semibold">Activity Selection Timeline</h3>
          <div className="space-y-2">
            {currentStep.intervals.map((activity, idx) => (
              <div key={idx} className="relative">
                <div className="flex items-center gap-2 text-xs mb-1">
                  <span className="w-8">I{idx}</span>
                  <div className="flex-1 relative h-10">
                    <div className="w-full h-2 bg-muted rounded absolute top-1/2 -translate-y-1/2"></div>
                    <div
                      className={`absolute h-8 rounded border-2 flex items-center justify-center text-xs font-bold transition-all ${currentStep.selected.includes(idx)
                          ? "bg-green-500/20 border-green-500 text-green-700 dark:text-green-400"
                          : currentStep.removed.includes(idx)
                            ? "bg-red-500/20 border-red-500 text-red-700 dark:text-red-400 opacity-60 line-through"
                            : idx === currentStep.current
                              ? "bg-primary/20 border-primary text-primary scale-105"
                              : "bg-blue-500/10 border-blue-500/50"
                        }`}
                      style={{
                        left: `${(activity.start / 10) * 100}%`,
                        width: `${((activity.end - activity.start) / 10) * 100}%`,
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                    >
                      {activity.start}-{activity.end}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm mt-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-green-500/20 border-2 border-green-500"></div>
              <span>nonOverlapping (Kept)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-red-500/20 border-2 border-red-500 opacity-60"></div>
              <span>Overlapping (Removed)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary/20 border-2 border-primary"></div>
              <span>Current Search</span>
            </div>
          </div>

          <div className="p-4 bg-muted rounded mt-4">
            <p className="text-sm">{currentStep.message}</p>
          </div>
          <div className="rounded-lg mt-4">
            <VariablePanel
              variables={{
                "current interval (i)": currentStep.current >= 0 ? currentStep.current : "N/A",
                "lastEndTime": currentStep.lastEndTime,
                "nonOverlappingCount": currentStep.selected.length,
              }}
            />
          </div>
        </div>

        <AnimatedCodeEditor
          code={code}
          highlightedLines={[currentStep.lineNumber]}
          language="typescript"
        />
      </div>
    </div>
  );
};
