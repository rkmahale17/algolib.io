import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';

interface Step {
  intervals: [number, number][];
  currentIdx: number;
  rooms: number[];
  minRooms: number;
  message: string;
  lineNumber: number;
}

export const MeetingRoomsIIVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const intervals: [number, number][] = [[0, 30], [5, 10], [15, 20]];
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);

  const steps: Step[] = [
    { intervals: sorted, currentIdx: -1, rooms: [], minRooms: 0, message: "Sort by start time", lineNumber: 4 },
    { intervals: sorted, currentIdx: 0, rooms: [30], minRooms: 1, message: "Meeting [0,30]: Need 1 room", lineNumber: 15 },
    { intervals: sorted, currentIdx: 1, rooms: [10, 30], minRooms: 2, message: "Meeting [5,10]: Need 2 rooms (overlaps)", lineNumber: 15 },
    { intervals: sorted, currentIdx: 2, rooms: [20, 30], minRooms: 2, message: "Meeting [15,20]: Reuse room (10≤15). Still need 2. Time: O(n log n)", lineNumber: 11 }
  ];

  const code = `function minMeetingRooms(intervals: number[][]): number {
  if (intervals.length === 0) return 0;
  
  intervals.sort((a, b) => a[0] - b[0]);
  const endTimes: number[] = [];
  
  for (const interval of intervals) {
    if (endTimes.length > 0 && endTimes[0] <= interval[0]) {
      endTimes.shift();
    }
    endTimes.push(interval[1]);
    endTimes.sort((a, b) => a - b);
  }
  
  return endTimes.length;
}`;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentStepIndex(0)} disabled={currentStepIndex === 0}><RotateCcw className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))} disabled={currentStepIndex === 0}><SkipBack className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))} disabled={currentStepIndex === steps.length - 1}><SkipForward className="h-4 w-4" /></Button>
          </div>
          <div className="text-sm">Step {currentStepIndex + 1} / {steps.length}</div>
        </div>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Meeting Rooms II</h3>
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {currentStep.intervals.map((interval, idx) => (
                <div key={idx} className={`px-3 py-2 rounded font-mono ${idx === currentStep.currentIdx ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  [{interval[0]}, {interval[1]}]
                </div>
              ))}
            </div>
            <div className="p-4 bg-primary/20 rounded border-2 border-primary"><div className="text-2xl font-bold text-primary">{currentStep.minRooms} rooms</div></div>
            <div className="p-4 bg-muted/50 rounded text-sm animate-fade-in">{currentStep.message}</div>
            <div className="mt-4 animate-fade-in">
              <VariablePanel
                variables={{
                  step: `${currentStepIndex + 1}/${steps.length}`,
                  currentIdx: currentStep.currentIdx,
                  rooms: `[${currentStep.rooms.join(', ')}]`,
                  minRooms: currentStep.minRooms,
                }}
              />
            </div>
          </div>
        </Card>
        <Card className="p-6 overflow-hidden flex flex-col">
          <h3 className="text-lg font-semibold mb-4">TypeScript</h3>
          <div className="flex-1 overflow-auto animate-fade-in">
            <AnimatedCodeEditor code={code} language="typescript" highlightedLines={[currentStep.lineNumber]} />
          </div>
        </Card>
      </div>
    </div>
  );
};
