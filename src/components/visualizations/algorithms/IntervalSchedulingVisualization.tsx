import React, { useState, useEffect, useRef } from 'react';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface Interval {
  start: number;
  end: number;
  id: number;
}

interface Step {
  intervals: Interval[];
  selected: number[];
  current: number;
  lastEnd: number;
  message: string;
  lineNumber: number;
}

export const IntervalSchedulingVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function intervalScheduling(intervals: Interval[]): Interval[] {
  // Sort by end time (greedy choice)
  intervals.sort((a, b) => a.end - b.end);
  
  const selected: Interval[] = [];
  let lastEnd = 0;
  
  for (const interval of intervals) {
    if (interval.start >= lastEnd) {
      selected.push(interval);
      lastEnd = interval.end;
    }
  }
  
  return selected;
}`;

  const generateSteps = () => {
    const intervals: Interval[] = [
      { start: 1, end: 3, id: 0 },
      { start: 2, end: 5, id: 1 },
      { start: 4, end: 6, id: 2 },
      { start: 6, end: 8, id: 3 },
      { start: 5, end: 7, id: 4 },
      { start: 8, end: 9, id: 5 }
    ];
    const newSteps: Step[] = [];

    intervals.sort((a, b) => a.end - b.end);
    
    newSteps.push({
      intervals: [...intervals],
      selected: [],
      current: -1,
      lastEnd: 0,
      message: 'Sort intervals by end time (greedy strategy)',
      lineNumber: 2
    });

    const selected: number[] = [];
    let lastEnd = 0;

    for (let i = 0; i < intervals.length; i++) {
      const interval = intervals[i];
      
      newSteps.push({
        intervals: [...intervals],
        selected: [...selected],
        current: i,
        lastEnd,
        message: `Checking interval ${i}: [${interval.start}, ${interval.end}]`,
        lineNumber: 7
      });

      if (interval.start >= lastEnd) {
        selected.push(i);
        lastEnd = interval.end;
        newSteps.push({
          intervals: [...intervals],
          selected: [...selected],
          current: i,
          lastEnd,
          message: `Selected! No overlap with previous (ended at ${interval.end})`,
          lineNumber: 9
        });
      } else {
        newSteps.push({
          intervals: [...intervals],
          selected: [...selected],
          current: i,
          lastEnd,
          message: `Skipped: overlaps with previous ending at ${lastEnd}`,
          lineNumber: 8
        });
      }
    }

    newSteps.push({
      intervals: [...intervals],
      selected: [...selected],
      current: -1,
      lastEnd,
      message: `Maximum ${selected.length} non-overlapping intervals selected`,
      lineNumber: 13
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
    if (currentStepIndex < steps.length - 1) setCurrentStepIndex(currentStepIndex + 1);
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

      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">Intervals Timeline</h3>
        
        <div className="space-y-3 mb-6">
          {currentStep.intervals.map((interval, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-16 text-sm font-mono">I{idx}</div>
              <div className="flex-1 relative h-12">
                <div className="absolute inset-y-0 left-0 right-0 flex items-center">
                  <div className="w-full h-2 bg-muted rounded"></div>
                </div>
                <div
                  className={`absolute h-8 rounded border-2 flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep.selected.includes(idx)
                      ? 'bg-green-500/20 border-green-500'
                      : idx === currentStep.current
                      ? 'bg-primary/20 border-primary'
                      : 'bg-blue-500/10 border-blue-500/50'
                  }`}
                  style={{
                    left: `${(interval.start / 10) * 100}%`,
                    width: `${((interval.end - interval.start) / 10) * 100}%`
                  }}
                >
                  {interval.start}-{interval.end}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-green-500/20 border-2 border-green-500"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary/20 border-2 border-primary"></div>
            <span>Current</span>
          </div>
        </div>

        <div className="mt-4 p-4 bg-muted rounded">
          <p className="text-sm">{currentStep.message}</p>
        </div>
      </div>

      <VariablePanel
        variables={{
          'current': currentStep.current >= 0 ? currentStep.current : 'done',
          'last end': currentStep.lastEnd,
          'selected count': currentStep.selected.length
        }}
      />

      <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
    </div>
  );
};
