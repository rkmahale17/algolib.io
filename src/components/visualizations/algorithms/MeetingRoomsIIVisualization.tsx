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
  rooms: number[];
  minRooms: number;
  message: string;
  lineNumber: number;
}

export const MeetingRoomsIIVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function minMeetingRooms(intervals: number[][]): number {
  if (intervals.length === 0) return 0;
  
  // Sort by start time
  intervals.sort((a, b) => a[0] - b[0]);
  
  // Min heap to track end times of meetings
  const endTimes: number[] = [];
  
  for (const interval of intervals) {
    // If earliest meeting has ended, reuse the room
    if (endTimes.length > 0 && endTimes[0] <= interval[0]) {
      endTimes.shift();  // Remove the earliest end time
    }
    
    // Add current meeting's end time
    endTimes.push(interval[1]);
    endTimes.sort((a, b) => a - b);  // Keep sorted
  }
  
  return endTimes.length;  // Number of rooms needed
}`;

  const generateSteps = () => {
    const intervals: [number, number][] = [[0, 30], [5, 10], [15, 20]];
    const newSteps: Step[] = [];

    // Initial state
    newSteps.push({
      intervals: [...intervals],
      sorted: [],
      currentIdx: -1,
      rooms: [],
      minRooms: 0,
      message: "Input: [[0,30],[5,10],[15,20]]. Find minimum meeting rooms required.",
      lineNumber: 0
    });

    // Sort by start time
    const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
    newSteps.push({
      intervals: [...intervals],
      sorted: [...sorted],
      currentIdx: -1,
      rooms: [],
      minRooms: 0,
      message: `Sort by start time: [[${sorted[0]}],[${sorted[1]}],[${sorted[2]}]]`,
      lineNumber: 4
    });

    const endTimes: number[] = [];

    // Process each meeting
    sorted.forEach((interval, idx) => {
      newSteps.push({
        intervals: [...intervals],
        sorted: [...sorted],
        currentIdx: idx,
        rooms: [...endTimes],
        minRooms: endTimes.length,
        message: `Process meeting [${interval}]. Current rooms in use: ${endTimes.length}`,
        lineNumber: 8
      });

      // Check if we can reuse a room
      if (endTimes.length > 0 && endTimes[0] <= interval[0]) {
        const freedRoom = endTimes.shift()!;
        newSteps.push({
          intervals: [...intervals],
          sorted: [...sorted],
          currentIdx: idx,
          rooms: [...endTimes],
          minRooms: endTimes.length + 1,
          message: `Meeting ended at ${freedRoom} <= ${interval[0]}. Reuse that room!`,
          lineNumber: 11
        });
      } else if (endTimes.length > 0) {
        newSteps.push({
          intervals: [...intervals],
          sorted: [...sorted],
          currentIdx: idx,
          rooms: [...endTimes],
          minRooms: endTimes.length,
          message: `Earliest meeting ends at ${endTimes[0]} > ${interval[0]}. Need a new room!`,
          lineNumber: 11
        });
      }

      // Add current meeting's end time
      endTimes.push(interval[1]);
      endTimes.sort((a, b) => a - b);

      newSteps.push({
        intervals: [...intervals],
        sorted: [...sorted],
        currentIdx: idx,
        rooms: [...endTimes],
        minRooms: endTimes.length,
        message: `Add meeting end time ${interval[1]}. Total rooms needed: ${endTimes.length}`,
        lineNumber: 15
      });
    });

    // Final
    newSteps.push({
      intervals: [...intervals],
      sorted: [...sorted],
      currentIdx: -1,
      rooms: [...endTimes],
      minRooms: endTimes.length,
      message: `Complete! Minimum rooms required: ${endTimes.length}. Time: O(n log n), Space: O(n)`,
      lineNumber: 20
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
            <h3 className="text-lg font-semibold mb-4">Meeting Rooms II</h3>
            
            <div className="space-y-4">
              {/* Meetings */}
              <div>
                <div className="text-sm font-semibold mb-2">
                  {currentStep.sorted.length === 0 ? 'Meetings:' : 'Sorted by Start Time:'}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(currentStep.sorted.length === 0 ? currentStep.intervals : currentStep.sorted).map((interval, idx) => (
                    <div
                      key={idx}
                      className={`px-4 py-2 rounded font-mono text-sm ${
                        idx === currentStep.currentIdx
                          ? 'bg-primary text-primary-foreground'
                          : idx < currentStep.currentIdx
                          ? 'bg-secondary/50'
                          : 'bg-muted'
                      }`}
                    >
                      [{interval[0]}, {interval[1]}]
                    </div>
                  ))}
                </div>
              </div>

              {/* Rooms (End Times) */}
              <div>
                <div className="text-sm font-semibold mb-2">Active Rooms (End Times):</div>
                <div className="flex gap-2 flex-wrap">
                  {currentStep.rooms.length > 0 ? (
                    currentStep.rooms.map((endTime, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-2 rounded bg-accent text-accent-foreground font-mono text-sm"
                      >
                        Ends: {endTime}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">No active rooms</div>
                  )}
                </div>
              </div>

              {/* Min Rooms */}
              <div className="p-4 bg-muted/50 rounded">
                <div className="text-sm font-semibold mb-2">Minimum Rooms Required:</div>
                <div className="text-3xl font-bold text-primary">
                  {currentStep.minRooms}
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
