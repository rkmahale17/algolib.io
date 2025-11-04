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
  canAttend: boolean;
  message: string;
  lineNumber: number;
}

export const MeetingRoomsVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function canAttendMeetings(intervals: number[][]): boolean {
  if (intervals.length === 0) return true;
  
  // Sort intervals by start time
  intervals.sort((a, b) => a[0] - b[0]);
  
  // Check for overlaps
  for (let i = 1; i < intervals.length; i++) {
    // If current meeting starts before previous ends
    if (intervals[i][0] < intervals[i-1][1]) {
      return false;  // Overlap detected
    }
  }
  
  return true;  // No overlaps
}`;

  const generateSteps = () => {
    const intervals: [number, number][] = [[0, 30], [5, 10], [15, 20]];
    const newSteps: Step[] = [];

    // Initial state
    newSteps.push({
      intervals: [...intervals],
      sorted: [],
      currentIdx: -1,
      canAttend: true,
      message: "Input: [[0,30],[5,10],[15,20]]. Can a person attend all meetings?",
      lineNumber: 0
    });

    // Sort by start time
    const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
    newSteps.push({
      intervals: [...intervals],
      sorted: [...sorted],
      currentIdx: -1,
      canAttend: true,
      message: `Sort by start time: [[${sorted[0]}],[${sorted[1]}],[${sorted[2]}]]`,
      lineNumber: 4
    });

    // Check for overlaps
    let canAttend = true;
    for (let i = 1; i < sorted.length; i++) {
      newSteps.push({
        intervals: [...intervals],
        sorted: [...sorted],
        currentIdx: i,
        canAttend: canAttend,
        message: `Check meeting ${i}: [${sorted[i]}]. Does it start (${sorted[i][0]}) before previous ends (${sorted[i-1][1]})?`,
        lineNumber: 8
      });

      if (sorted[i][0] < sorted[i-1][1]) {
        canAttend = false;
        newSteps.push({
          intervals: [...intervals],
          sorted: [...sorted],
          currentIdx: i,
          canAttend: canAttend,
          message: `Yes! ${sorted[i][0]} < ${sorted[i-1][1]}. Overlap detected! Cannot attend all meetings.`,
          lineNumber: 10
        });
        break;
      } else {
        newSteps.push({
          intervals: [...intervals],
          sorted: [...sorted],
          currentIdx: i,
          canAttend: canAttend,
          message: `No overlap. ${sorted[i][0]} >= ${sorted[i-1][1]}. Continue checking...`,
          lineNumber: 8
        });
      }
    }

    // Final
    newSteps.push({
      intervals: [...intervals],
      sorted: [...sorted],
      currentIdx: -1,
      canAttend: canAttend,
      message: canAttend 
        ? "All meetings checked. No overlaps found! Can attend all meetings." 
        : "Overlap found! Cannot attend all meetings. Time: O(n log n), Space: O(1)",
      lineNumber: canAttend ? 14 : 10
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

  const renderInterval = (interval: [number, number], idx: number) => {
    const hasOverlap = !currentStep.canAttend && idx <= currentStep.currentIdx && currentStep.currentIdx > 0;
    
    return (
      <div
        key={idx}
        className={`px-4 py-2 rounded font-mono text-sm ${
          idx === currentStep.currentIdx || (idx === currentStep.currentIdx - 1 && currentStep.currentIdx > 0)
            ? hasOverlap
              ? 'bg-red-500/20 border border-red-500'
              : 'bg-primary text-primary-foreground'
            : hasOverlap && idx < currentStep.currentIdx
            ? 'bg-red-500/20 border border-red-500'
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
            <h3 className="text-lg font-semibold mb-4">Meeting Rooms</h3>
            
            <div className="space-y-4">
              {/* Original/Sorted Intervals */}
              <div>
                <div className="text-sm font-semibold mb-2">
                  {currentStep.sorted.length === 0 ? 'Meetings:' : 'Sorted by Start Time:'}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(currentStep.sorted.length === 0 ? currentStep.intervals : currentStep.sorted).map((interval, idx) => 
                    renderInterval(interval, idx)
                  )}
                </div>
              </div>

              {/* Result */}
              <div className="p-4 bg-muted/50 rounded">
                <div className="text-sm font-semibold mb-2">Can Attend All Meetings?</div>
                <div className={`text-2xl font-bold ${currentStep.canAttend ? 'text-green-500' : 'text-red-500'}`}>
                  {currentStep.canAttend ? 'YES ✓' : 'NO ✗'}
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
