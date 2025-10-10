import { useEffect, useRef, useState } from 'react';

import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Interval {
  start: number;
  end: number;
}

interface Step {
  intervals: Interval[];
  merged: Interval[];
  currentIndex: number;
  message: string;
  lineNumber: number;
}

export const MergeIntervalsVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  
  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const last = merged[merged.length - 1];
    
    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push(current);
    }
  }
  
  return merged;
}`;

  const generateSteps = () => {
    const intervals: Interval[] = [
      { start: 1, end: 3 },
      { start: 2, end: 6 },
      { start: 8, end: 10 },
      { start: 15, end: 18 },
      { start: 16, end: 20 }
    ];
    
    const newSteps: Step[] = [];
    const sorted = [...intervals].sort((a, b) => a.start - b.start);
    
    newSteps.push({
      intervals: sorted.map(i => ({ ...i })),
      merged: [],
      currentIndex: -1,
      message: 'Step 1: Sort intervals by start time',
      lineNumber: 1
    });

    const merged: Interval[] = [{ ...sorted[0] }];
    
    newSteps.push({
      intervals: sorted.map(i => ({ ...i })),
      merged: merged.map(i => ({ ...i })),
      currentIndex: 0,
      message: 'Initialize merged with first interval',
      lineNumber: 2
    });

    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      const last = merged[merged.length - 1];
      
      if (current.start <= last.end) {
        newSteps.push({
          intervals: sorted.map(i => ({ ...i })),
          merged: merged.map(i => ({ ...i })),
          currentIndex: i,
          message: `Interval [${current.start}, ${current.end}] overlaps with [${last.start}, ${last.end}]`,
          lineNumber: 8
        });
        
        last.end = Math.max(last.end, current.end);
        
        newSteps.push({
          intervals: sorted.map(i => ({ ...i })),
          merged: merged.map(i => ({ ...i })),
          currentIndex: i,
          message: `Merge: update end to ${last.end}`,
          lineNumber: 9
        });
      } else {
        newSteps.push({
          intervals: sorted.map(i => ({ ...i })),
          merged: merged.map(i => ({ ...i })),
          currentIndex: i,
          message: `No overlap. Add [${current.start}, ${current.end}] as new interval`,
          lineNumber: 11
        });
        
        merged.push({ ...current });
      }
    }

    newSteps.push({
      intervals: sorted.map(i => ({ ...i })),
      merged: merged.map(i => ({ ...i })),
      currentIndex: sorted.length - 1,
      message: `Complete! ${merged.length} merged intervals`,
      lineNumber: 15
    });

    setSteps(newSteps);
    setCurrentStepIndex(0);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(prev => prev + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(prev => prev - 1);
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    generateSteps();
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const timelineMax = Math.max(...currentStep.intervals.map(i => i.end), ...currentStep.merged.map(i => i.end)) + 2;

  return (
    <div className="space-y-6">
      <StepControls
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={setSpeed}
        currentStep={currentStepIndex}
        totalSteps={steps.length - 1}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 space-y-6">
            <div>
              <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Original Intervals</h4>
              <div className="space-y-2">
                {currentStep.intervals.map((interval, index) => {
                  const isCurrent = index === currentStep.currentIndex;
                  return (
                    <div key={index} className="relative h-10">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full h-1 bg-border"></div>
                        {Array.from({ length: timelineMax + 1 }, (_, i) => (
                          <div key={i} className="absolute w-px h-2 bg-border" style={{ left: `${(i / timelineMax) * 100}%` }}></div>
                        ))}
                      </div>
                      <div
                        className={`absolute h-8 rounded flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          isCurrent ? 'bg-primary text-primary-foreground shadow-lg scale-105' : 'bg-accent/60 text-accent-foreground'
                        }`}
                        style={{
                          left: `${(interval.start / timelineMax) * 100}%`,
                          width: `${((interval.end - interval.start) / timelineMax) * 100}%`
                        }}
                      >
                        [{interval.start}, {interval.end}]
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {currentStep.merged.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3 text-green-500">Merged Result</h4>
                <div className="space-y-2">
                  {currentStep.merged.map((interval, index) => (
                    <div key={index} className="relative h-10">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full h-1 bg-border"></div>
                      </div>
                      <div
                        className="absolute h-8 bg-green-500 rounded flex items-center justify-center text-xs font-bold text-white shadow-lg"
                        style={{
                          left: `${(interval.start / timelineMax) * 100}%`,
                          width: `${((interval.end - interval.start) / timelineMax) * 100}%`
                        }}
                      >
                        [{interval.start}, {interval.end}]
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>

            <div className="rounded-lg  p-4">
               <VariablePanel
            variables={{
              i: currentStep.currentIndex >= 0 ? currentStep.currentIndex : 'init',
              currentInterval: currentStep.currentIndex >= 0 ? `[${currentStep.intervals[currentStep.currentIndex].start}, ${currentStep.intervals[currentStep.currentIndex].end}]` : 'N/A',
              mergedCount: currentStep.merged.length,
              lastMerged: currentStep.merged.length > 0 ? `[${currentStep.merged[currentStep.merged.length - 1].start}, ${currentStep.merged[currentStep.merged.length - 1].end}]` : 'N/A'
            }}
          />
          </div>
        </div>

        <div className="space-y-4">
         
          <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="TypeScript" />
        </div>
      </div>
    </div>
  );
};
