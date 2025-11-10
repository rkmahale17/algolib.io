import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { SimpleStepControls } from '../shared/SimpleStepControls';

interface Step {
  intervals: [number, number][];
  currentIdx: number;
  canAttend: boolean | null;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const MeetingRoomsVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const intervals: [number, number][] = [[0, 30], [5, 10], [15, 20]];

  const steps: Step[] = [
    {
      intervals: [[0, 30], [5, 10], [15, 20]],
      currentIdx: -1,
      canAttend: null,
      variables: { intervals: '[[0,30],[5,10],[15,20]]' },
      explanation: "Given meeting intervals with start and end times. Check if a person can attend all meetings without overlap.",
      highlightedLines: [1],
      lineExecution: "function canAttendMeetings(intervals)"
    },
    {
      intervals: [[0, 30], [5, 10], [15, 20]],
      currentIdx: -1,
      canAttend: null,
      variables: { length: 3, check: 'length > 0' },
      explanation: "Check if intervals array is empty. We have 3 meetings, so continue processing.",
      highlightedLines: [2],
      lineExecution: "if (intervals.length === 0) return true;"
    },
    {
      intervals: [[0, 30], [5, 10], [15, 20]],
      currentIdx: -1,
      canAttend: null,
      variables: { action: 'sorting by start time' },
      explanation: "Sort intervals by start time to check meetings chronologically.",
      highlightedLines: [4],
      lineExecution: "intervals.sort((a, b) => a[0] - b[0]);"
    },
    {
      intervals: [[0, 30], [5, 10], [15, 20]],
      currentIdx: -1,
      canAttend: null,
      variables: { sorted: '[[0,30],[5,10],[15,20]]' },
      explanation: "After sorting: [0,30], [5,10], [15,20]. Now we'll check each consecutive pair for overlap.",
      highlightedLines: [4],
      lineExecution: "// After sort"
    },
    {
      intervals: [[0, 30], [5, 10], [15, 20]],
      currentIdx: 1,
      canAttend: null,
      variables: { i: 1, comparing: '[5,10] vs [0,30]' },
      explanation: "Start checking from second meeting (i=1). Compare [5,10] with previous [0,30].",
      highlightedLines: [6],
      lineExecution: "for (let i = 1; i < intervals.length; i++) // i=1"
    },
    {
      intervals: [[0, 30], [5, 10], [15, 20]],
      currentIdx: 1,
      canAttend: null,
      variables: { check: '5 < 30?', result: 'true' },
      explanation: "Check if [5,10] starts before [0,30] ends. Since 5 < 30, meetings overlap!",
      highlightedLines: [7],
      lineExecution: "if (intervals[i][0] < intervals[i-1][1]) // 5 < 30? true"
    },
    {
      intervals: [[0, 30], [5, 10], [15, 20]],
      currentIdx: 1,
      canAttend: false,
      variables: { result: false, reason: 'overlap detected' },
      explanation: "Found an overlap between [0,30] and [5,10]. Cannot attend all meetings!",
      highlightedLines: [8],
      lineExecution: "return false; // overlap found"
    },
    {
      intervals: [[0, 30], [5, 10], [15, 20]],
      currentIdx: 1,
      canAttend: false,
      variables: { result: false, time: 'O(n log n)', space: 'O(1)' },
      explanation: "Algorithm complete! Result: Cannot attend all meetings. Time: O(n log n) for sorting. Space: O(1) only constant space.",
      highlightedLines: [8],
      lineExecution: "Result: false"
    }
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Meeting Rooms</h3>
          <div className="space-y-4">
            <motion.div 
              key={`intervals-${currentStepIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <div className="text-sm font-medium text-muted-foreground">Intervals (sorted by start):</div>
              <div className="flex gap-2 flex-wrap">
                {currentStep.intervals.map((interval, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`px-3 py-2 rounded font-mono transition-all ${
                      idx === currentStep.currentIdx 
                        ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                        : idx < currentStep.currentIdx 
                        ? 'bg-secondary/50 text-secondary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    [{interval[0]}, {interval[1]}]
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {currentStep.canAttend !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-lg border-2 ${
                  currentStep.canAttend 
                    ? 'bg-primary/20 border-primary' 
                    : 'bg-destructive/20 border-destructive'
                }`}
              >
                <div className={`text-2xl font-bold ${
                  currentStep.canAttend ? 'text-primary' : 'text-destructive'
                }`}>
                  {currentStep.canAttend ? '✓ Can attend' : '✗ Cannot attend'}
                </div>
              </motion.div>
            )}

            <motion.div
              key={`execution-${currentStepIndex}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 bg-secondary/30 rounded border-l-4 border-secondary"
            >
              <div className="text-xs font-semibold text-secondary-foreground mb-1">Executing:</div>
              <code className="text-xs text-foreground font-mono">{currentStep.lineExecution}</code>
            </motion.div>

            <motion.div
              key={`explanation-${currentStepIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-muted/50 rounded text-sm leading-relaxed"
            >
              {currentStep.explanation}
            </motion.div>

            <motion.div
              key={`variables-${currentStepIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <VariablePanel variables={currentStep.variables} />
            </motion.div>
          </div>
        </Card>

        <Card className="p-6 overflow-hidden flex flex-col">
          <h3 className="text-lg font-semibold mb-4">TypeScript Implementation</h3>
          <div className="flex-1 overflow-auto">
            <AnimatedCodeEditor 
              code={code} 
              language="typescript" 
              highlightedLines={currentStep.highlightedLines}
            />
          </div>
        </Card>
      </div>

      <SimpleStepControls
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        onStepChange={setCurrentStepIndex}
      />
    </div>
  );
};