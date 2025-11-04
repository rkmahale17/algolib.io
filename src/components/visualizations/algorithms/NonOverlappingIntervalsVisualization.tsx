import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  intervals: [number, number][];
  sorted: [number, number][];
  currentIdx: number;
  prevEnd: number;
  removals: number;
  message: string;
  lineNumber: number;
}

export const NonOverlappingIntervalsVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function eraseOverlapIntervals(intervals: number[][]): number {
  if (intervals.length === 0) return 0;
  
  // Sort by end time (greedy choice)
  intervals.sort((a, b) => a[1] - b[1]);
  
  let removals = 0;
  let prevEnd = intervals[0][1];
  
  for (let i = 1; i < intervals.length; i++) {
    // If current interval starts before previous ends
    if (intervals[i][0] < prevEnd) {
      removals++;  // Remove current interval
    } else {
      prevEnd = intervals[i][1];  // Update end time
    }
  }
  
  return removals;
}`;

  const generateSteps = () => {
    const intervals: [number, number][] = [[1, 2], [2, 3], [3, 4], [1, 3]];
    const newSteps: Step[] = [];

    // Initial state
    newSteps.push({
      intervals: [...intervals],
      sorted: [],
      currentIdx: -1,
      prevEnd: -1,
      removals: 0,
      message: "Input: [[1,2],[2,3],[3,4],[1,3]]. Find minimum removals for non-overlapping intervals.",
      lineNumber: 0
    });

    // Sort by end time
    const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
    newSteps.push({
      intervals: [...intervals],
      sorted: [...sorted],
      currentIdx: -1,
      prevEnd: -1,
      removals: 0,
      message: "Sort intervals by end time: [[1,2],[2,3],[1,3],[3,4]]",
      lineNumber: 4
    });

    let removals = 0;
    let prevEnd = sorted[0][1];

    newSteps.push({
      intervals: [...intervals],
      sorted: [...sorted],
      currentIdx: 0,
      prevEnd: prevEnd,
      removals: removals,
      message: `Start with first interval [${sorted[0]}]. prevEnd = ${prevEnd}`,
      lineNumber: 7
    });

    // Check each interval
    for (let i = 1; i < sorted.length; i++) {
      newSteps.push({
        intervals: [...intervals],
        sorted: [...sorted],
        currentIdx: i,
        prevEnd: prevEnd,
        removals: removals,
        message: `Check interval [${sorted[i]}]. Does it start (${sorted[i][0]}) before prevEnd (${prevEnd})?`,
        lineNumber: 10
      });

      if (sorted[i][0] < prevEnd) {
        removals++;
        newSteps.push({
          intervals: [...intervals],
          sorted: [...sorted],
          currentIdx: i,
          prevEnd: prevEnd,
          removals: removals,
          message: `Yes! ${sorted[i][0]} < ${prevEnd}. Overlap detected. Remove [${sorted[i]}]. Removals: ${removals}`,
          lineNumber: 12
        });
      } else {
        prevEnd = sorted[i][1];
        newSteps.push({
          intervals: [...intervals],
          sorted: [...sorted],
          currentIdx: i,
          prevEnd: prevEnd,
          removals: removals,
          message: `No overlap! ${sorted[i][0]} >= ${prevEnd}. Keep interval. Update prevEnd = ${prevEnd}`,
          lineNumber: 14
        });
      }
    }

    // Final
    newSteps.push({
      intervals: [...intervals],
      sorted: [...sorted],
      currentIdx: -1,
      prevEnd: prevEnd,
      removals: removals,
      message: `Complete! Minimum removals: ${removals}. Time: O(n log n), Space: O(1)`,
      lineNumber: 18
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
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0) {
    return <div>Loading...</div>;
  }

  const currentStep = steps[currentStepIndex];

  const renderInterval = (interval: [number, number], idx: number, isSorted: boolean) => {
    const isRemoved = isSorted && 
      currentStep.currentIdx >= idx && 
      idx > 0 && 
      interval[0] < (idx === 0 ? -1 : currentStep.sorted[idx - 1][1]);
    
    return (
      <div
        key={idx}
        className={`px-4 py-2 rounded font-mono text-sm ${
          idx === currentStep.currentIdx
            ? 'bg-primary text-primary-foreground'
            : isRemoved
            ? 'bg-red-500/20 border border-red-500 line-through'
            : 'bg-muted'
        }`}
      >
        [{interval[0]}, {interval[1]}]
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      {/* Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              disabled={currentStepIndex === 0}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleStepBack}
              disabled={currentStepIndex === 0}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={isPlaying ? handlePause : handlePlay}
              disabled={currentStepIndex === steps.length - 1}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleStepForward}
              disabled={currentStepIndex === steps.length - 1}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Speed:</span>
            <Button
              variant={speed === 2000 ? "default" : "outline"}
              size="sm"
              onClick={() => setSpeed(2000)}
            >
              0.5x
            </Button>
            <Button
              variant={speed === 1000 ? "default" : "outline"}
              size="sm"
              onClick={() => setSpeed(1000)}
            >
              1x
            </Button>
            <Button
              variant={speed === 500 ? "default" : "outline"}
              size="sm"
              onClick={() => setSpeed(500)}
            >
              2x
            </Button>
          </div>
          <div className="text-sm font-medium">
            Step {currentStepIndex + 1} / {steps.length}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Visualization */}
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Non-overlapping Intervals</h3>
            
            <div className="space-y-4">
              {/* Original Intervals */}
              {currentStep.sorted.length === 0 && (
                <div>
                  <div className="text-sm font-semibold mb-2">Original Intervals:</div>
                  <div className="flex gap-2 flex-wrap">
                    {currentStep.intervals.map((interval, idx) => renderInterval(interval, idx, false))}
                  </div>
                </div>
              )}

              {/* Sorted Intervals */}
              {currentStep.sorted.length > 0 && (
                <div>
                  <div className="text-sm font-semibold mb-2">Sorted by End Time:</div>
                  <div className="flex gap-2 flex-wrap">
                    {currentStep.sorted.map((interval, idx) => renderInterval(interval, idx, true))}
                  </div>
                </div>
              )}

              {/* Variables */}
              <div className="space-y-2 p-4 bg-muted/50 rounded">
                <div className="text-sm">
                  <span className="font-semibold">Removals:</span> {currentStep.removals}
                </div>
                {currentStep.prevEnd !== -1 && (
                  <div className="text-sm">
                    <span className="font-semibold">Previous End:</span> {currentStep.prevEnd}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 p-4 bg-muted/50 rounded text-sm">
              {currentStep.message}
            </div>
          </Card>
        </div>

        {/* Code */}
        <Card className="p-6 overflow-hidden flex flex-col">
          <h3 className="text-lg font-semibold mb-4">TypeScript Code</h3>
          <div className="flex-1 overflow-auto">
            <SyntaxHighlighter
              language="typescript"
              style={vscDarkPlus}
              showLineNumbers
              wrapLines
              lineProps={(lineNumber) => ({
                style: {
                  backgroundColor: lineNumber === currentStep.lineNumber ? 'rgba(255, 255, 0, 0.2)' : 'transparent',
                  display: 'block',
                  width: '100%'
                }
              })}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </Card>
      </div>
    </div>
  );
};
