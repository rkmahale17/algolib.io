import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';

interface Step {
  intervals: [number, number][];
  currentIdx: number;
  prevEnd: number;
  removals: number;
  variables: Record<string, any>;
  message: string;
  lineNumber: number;
}

export const NonOverlappingIntervalsVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const intervals: [number, number][] = [[1, 2], [2, 3], [3, 4], [1, 3]];
  const sorted = [...intervals].sort((a, b) => a[1] - b[1]);

  const steps: Step[] = [
    { intervals: sorted, currentIdx: -1, prevEnd: 0, removals: 0, variables: {}, message: "Sort by end time (greedy)", lineNumber: 4 },
    { intervals: sorted, currentIdx: 0, prevEnd: 2, removals: 0, variables: { prevEnd: 2 }, message: "First interval [1,2]: prevEnd=2", lineNumber: 7 },
    { intervals: sorted, currentIdx: 1, prevEnd: 2, removals: 1, variables: { overlap: true }, message: "[1,3] starts at 1 < prevEnd(2). Remove it!", lineNumber: 11 },
    { intervals: sorted, currentIdx: 2, prevEnd: 3, removals: 1, variables: { prevEnd: 3 }, message: "[2,3] starts at 2 ≥ prevEnd(2). Keep it, update prevEnd=3", lineNumber: 13 },
    { intervals: sorted, currentIdx: 3, prevEnd: 4, removals: 1, variables: { result: 1 }, message: "Complete! Removed 1 interval. Time: O(n log n), Space: O(1)", lineNumber: 16 }
  ];

  const code = `function eraseOverlapIntervals(intervals: number[][]): number {
  if (intervals.length === 0) return 0;
  
  intervals.sort((a, b) => a[1] - b[1]);
  
  let removals = 0;
  let prevEnd = intervals[0][1];
  
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < prevEnd) {
      removals++;
    } else {
      prevEnd = intervals[i][1];
    }
  }
  
  return removals;
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
          <h3 className="text-lg font-semibold mb-4">Non-Overlapping Intervals</h3>
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {currentStep.intervals.map((interval, idx) => (
                <div key={idx} className={`px-3 py-2 rounded font-mono ${idx === currentStep.currentIdx ? 'bg-primary text-primary-foreground' : idx < currentStep.currentIdx ? 'bg-secondary/50' : 'bg-muted'}`}>
                  [{interval[0]}, {interval[1]}]
                </div>
              ))}
            </div>
            <div className="p-4 bg-muted/50 rounded text-sm animate-fade-in">{currentStep.message}</div>
            <div className="mt-4 animate-fade-in">
              <VariablePanel
                variables={{
                  step: `${currentStepIndex + 1}/${steps.length}`,
                  currentIdx: currentStep.currentIdx,
                  prevEnd: currentStep.prevEnd,
                  removals: currentStep.removals,
                  current: currentStep.currentIdx >= 0 ? `[${currentStep.intervals[currentStep.currentIdx][0]}, ${currentStep.intervals[currentStep.currentIdx][1]}]` : 'none',
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
