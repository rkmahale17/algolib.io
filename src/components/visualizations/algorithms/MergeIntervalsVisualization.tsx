import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  intervals: [number, number][];
  merged: [number, number][];
  currentIdx: number;
  variables: Record<string, any>;
  message: string;
  lineNumber: number;
}

export const MergeIntervalsVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const intervals: [number, number][] = [[1, 3], [2, 6], [8, 10], [15, 18]];
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);

  const steps: Step[] = [
    { intervals: sorted, merged: [], currentIdx: -1, variables: {}, message: "Sort intervals by start time", lineNumber: 2 },
    { intervals: sorted, merged: [[1, 3]], currentIdx: 0, variables: { merged: '[[1,3]]' }, message: "Initialize with first interval [1,3]", lineNumber: 3 },
    { intervals: sorted, merged: [[1, 6]], currentIdx: 1, variables: { current: '[2,6]', overlap: true }, message: "[2,6] overlaps [1,3]. Merge to [1,6]", lineNumber: 8 },
    { intervals: sorted, merged: [[1, 6], [8, 10]], currentIdx: 2, variables: { current: '[8,10]', overlap: false }, message: "[8,10] doesn't overlap. Add as new interval", lineNumber: 11 },
    { intervals: sorted, merged: [[1, 6], [8, 10], [15, 18]], currentIdx: 3, variables: { result: 3 }, message: "Complete! 3 merged intervals. Time: O(n log n), Space: O(n)", lineNumber: 14 }
  ];

  const code = `function merge(intervals: number[][]): number[][] {
  if (intervals.length === 0) return [];
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
          <h3 className="text-lg font-semibold mb-4">Merge Intervals</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold mb-2">Intervals:</div>
              <div className="flex gap-2 flex-wrap">
                {currentStep.intervals.map((interval, idx) => (
                  <div key={idx} className={`px-3 py-2 rounded font-mono ${idx === currentStep.currentIdx ? 'bg-primary text-primary-foreground' : idx < currentStep.currentIdx ? 'bg-secondary/50' : 'bg-muted'}`}>
                    [{interval[0]}, {interval[1]}]
                  </div>
                ))}
              </div>
            </div>
            {currentStep.merged.length > 0 && (
              <div>
                <div className="text-sm font-semibold mb-2">Merged:</div>
                <div className="flex gap-2 flex-wrap">
                  {currentStep.merged.map((interval, idx) => (
                    <div key={idx} className="px-3 py-2 rounded bg-green-500/20 text-green-600 font-mono">
                      [{interval[0]}, {interval[1]}]
                    </div>
                  ))}
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
