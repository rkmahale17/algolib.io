import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  intervals: [number, number][];
  currentIdx: number;
  canAttend: boolean | null;
  variables: Record<string, any>;
  message: string;
  lineNumber: number;
}

export const MeetingRoomsVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const intervals: [number, number][] = [[0, 30], [5, 10], [15, 20]];
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);

  const steps: Step[] = [
    { intervals: sorted, currentIdx: -1, canAttend: null, variables: {}, message: "Sort intervals by start time", lineNumber: 4 },
    { intervals: sorted, currentIdx: 1, canAttend: null, variables: { check: '[5,10] vs [0,30]', overlap: true }, message: "[5,10] starts at 5 < 30 (prev end). Overlap!", lineNumber: 8 },
    { intervals: sorted, currentIdx: 1, canAttend: false, variables: { result: false }, message: "Cannot attend all meetings. Time: O(n log n), Space: O(1)", lineNumber: 9 }
  ];

  const code = `function canAttendMeetings(intervals: number[][]): boolean {
  if (intervals.length === 0) return true;
  
  intervals.sort((a, b) => a[0] - b[0]);
  
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < intervals[i-1][1]) {
      return false;
    }
  }
  
  return true;
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
          <h3 className="text-lg font-semibold mb-4">Meeting Rooms</h3>
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {currentStep.intervals.map((interval, idx) => (
                <div key={idx} className={`px-3 py-2 rounded font-mono ${idx === currentStep.currentIdx ? 'bg-primary text-primary-foreground' : idx < currentStep.currentIdx ? 'bg-secondary/50' : 'bg-muted'}`}>
                  [{interval[0]}, {interval[1]}]
                </div>
              ))}
            </div>
            {currentStep.canAttend !== null && (
              <div className={`p-4 rounded ${currentStep.canAttend ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                <div className={`text-2xl font-bold ${currentStep.canAttend ? 'text-green-600' : 'text-red-600'}`}>
                  {currentStep.canAttend ? '✓ Can attend' : '✗ Cannot attend'}
                </div>
              </div>
            )}
            <div className="p-4 bg-muted/50 rounded text-sm">{currentStep.message}</div>
          </div>
        </Card>
        <Card className="p-6 overflow-hidden flex flex-col">
          <h3 className="text-lg font-semibold mb-4">TypeScript</h3>
          <div className="flex-1 overflow-auto">
            <SyntaxHighlighter language="typescript" style={vscDarkPlus} showLineNumbers lineProps={(lineNumber) => ({ style: { backgroundColor: lineNumber === currentStep.lineNumber ? 'rgba(255, 255, 0, 0.2)' : 'transparent', display: 'block' } })}>
              {code}
            </SyntaxHighlighter>
          </div>
        </Card>
      </div>
    </div>
  );
};
