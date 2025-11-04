import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  intervals: [number, number][];
  newInterval: [number, number];
  result: [number, number][];
  currentIdx: number;
  merged: [number, number] | null;
  message: string;
  lineNumber: number;
}

export const InsertIntervalVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function insert(
  intervals: number[][], 
  newInterval: number[]
): number[][] {
  const result: number[][] = [];
  let i = 0;
  const n = intervals.length;
  
  // Add all intervals before newInterval
  while (i < n && intervals[i][1] < newInterval[0]) {
    result.push(intervals[i]);
    i++;
  }
  
  // Merge overlapping intervals
  while (i < n && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;
  }
  result.push(newInterval);
  
  // Add remaining intervals
  while (i < n) {
    result.push(intervals[i]);
    i++;
  }
  
  return result;
}`;

  const generateSteps = () => {
    const intervals: [number, number][] = [[1, 3], [6, 9]];
    const newInterval: [number, number] = [2, 5];
    const newSteps: Step[] = [];

    // Initial state
    newSteps.push({
      intervals: [...intervals],
      newInterval: [...newInterval] as [number, number],
      result: [],
      currentIdx: -1,
      merged: null,
      message: "Insert new interval [2,5] into [[1,3],[6,9]]",
      lineNumber: 0
    });

    const result: [number, number][] = [];
    let i = 0;
    let currentNew: [number, number] = [...newInterval];

    // Add intervals before newInterval
    while (i < intervals.length && intervals[i][1] < newInterval[0]) {
      newSteps.push({
        intervals: [...intervals],
        newInterval: [...currentNew] as [number, number],
        result: [...result],
        currentIdx: i,
        merged: null,
        message: `Interval [${intervals[i]}] ends before [${newInterval[0]},${newInterval[1]}] starts. Add to result.`,
        lineNumber: 10
      });
      
      result.push(intervals[i]);
      
      newSteps.push({
        intervals: [...intervals],
        newInterval: [...currentNew] as [number, number],
        result: [...result],
        currentIdx: i,
        merged: null,
        message: `Added [${intervals[i]}] to result.`,
        lineNumber: 11
      });
      
      i++;
    }

    // Merge overlapping intervals
    if (i < intervals.length) {
      newSteps.push({
        intervals: [...intervals],
        newInterval: [...currentNew] as [number, number],
        result: [...result],
        currentIdx: i,
        merged: null,
        message: `Interval [${intervals[i]}] overlaps with [${currentNew}]. Start merging.`,
        lineNumber: 15
      });
    }

    while (i < intervals.length && intervals[i][0] <= currentNew[1]) {
      const oldNew = [...currentNew];
      currentNew[0] = Math.min(currentNew[0], intervals[i][0]);
      currentNew[1] = Math.max(currentNew[1], intervals[i][1]);
      
      newSteps.push({
        intervals: [...intervals],
        newInterval: [...currentNew] as [number, number],
        result: [...result],
        currentIdx: i,
        merged: [...currentNew] as [number, number],
        message: `Merge [${oldNew}] with [${intervals[i]}] → [${currentNew}]`,
        lineNumber: 16
      });
      
      i++;
    }

    // Add merged interval
    result.push([...currentNew]);
    newSteps.push({
      intervals: [...intervals],
      newInterval: [...currentNew] as [number, number],
      result: [...result],
      currentIdx: i,
      merged: [...currentNew] as [number, number],
      message: `Add merged interval [${currentNew}] to result.`,
      lineNumber: 20
    });

    // Add remaining intervals
    while (i < intervals.length) {
      newSteps.push({
        intervals: [...intervals],
        newInterval: [...currentNew] as [number, number],
        result: [...result],
        currentIdx: i,
        merged: null,
        message: `Interval [${intervals[i]}] is after merged interval. Add to result.`,
        lineNumber: 23
      });
      
      result.push(intervals[i]);
      
      newSteps.push({
        intervals: [...intervals],
        newInterval: [...currentNew] as [number, number],
        result: [...result],
        currentIdx: i,
        merged: null,
        message: `Added [${intervals[i]}] to result.`,
        lineNumber: 24
      });
      
      i++;
    }

    // Final
    newSteps.push({
      intervals: [...intervals],
      newInterval: [...currentNew] as [number, number],
      result: [...result],
      currentIdx: -1,
      merged: null,
      message: `Complete! Result: [[1,5],[6,9]]. Time: O(n), Space: O(n)`,
      lineNumber: 28
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

  const renderInterval = (interval: [number, number], label: string, color: string) => (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium w-20">{label}</span>
      <div className={`px-4 py-2 rounded ${color} font-mono text-sm`}>
        [{interval[0]}, {interval[1]}]
      </div>
    </div>
  );

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
            <h3 className="text-lg font-semibold mb-4">Insert Interval</h3>
            
            <div className="space-y-4">
              {/* Original Intervals */}
              <div>
                <div className="text-sm font-semibold mb-2">Original Intervals:</div>
                <div className="space-y-2">
                  {currentStep.intervals.map((interval, idx) => (
                    <div key={idx}>
                      {renderInterval(
                        interval,
                        `[${idx}]`,
                        idx === currentStep.currentIdx
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* New Interval */}
              <div>
                <div className="text-sm font-semibold mb-2">New Interval:</div>
                {renderInterval(
                  currentStep.newInterval,
                  'Insert',
                  'bg-accent text-accent-foreground'
                )}
              </div>

              {/* Result */}
              <div>
                <div className="text-sm font-semibold mb-2">Result:</div>
                <div className="space-y-2">
                  {currentStep.result.length > 0 ? (
                    currentStep.result.map((interval, idx) => (
                      <div key={idx}>
                        {renderInterval(
                          interval,
                          `[${idx}]`,
                          currentStep.merged && 
                          interval[0] === currentStep.merged[0] && 
                          interval[1] === currentStep.merged[1]
                            ? 'bg-green-500/20 border border-green-500'
                            : 'bg-secondary/50'
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">Empty</div>
                  )}
                </div>
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
