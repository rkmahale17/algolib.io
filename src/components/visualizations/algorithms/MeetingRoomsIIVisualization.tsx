import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { SimpleStepControls } from '../shared/SimpleStepControls';

interface Step {
  intervals: [number, number][];
  currentIdx: number;
  rooms: number[];
  minRooms: number;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const MeetingRoomsIIVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const intervals: [number, number][] = [[0, 30], [5, 10], [15, 20]];

  const steps: Step[] = [
    {
      intervals: [[0, 30], [5, 10], [15, 20]],
      currentIdx: -1,
      rooms: [],
      minRooms: 0,
      variables: { intervals: '[[0,30],[5,10],[15,20]]' },
      explanation: "Given meetings with start and end times. Need to find minimum conference rooms required.",
      highlightedLines: [1],
      lineExecution: "function minMeetingRooms(intervals)"
    },
    {
      intervals: [[0, 30], [5, 10], [15, 20]],
      currentIdx: -1,
      rooms: [],
      minRooms: 0,
      variables: { length: 3, check: 'length > 0' },
      explanation: "Check if intervals array is empty. We have 3 meetings, so continue.",
      highlightedLines: [2],
      lineExecution: "if (intervals.length === 0) return 0;"
    },
    {
      intervals: [[0, 30], [5, 10], [15, 20]],
      currentIdx: -1,
      rooms: [],
      minRooms: 0,
      variables: { action: 'sorting by start time' },
      explanation: "Sort intervals by start time to process meetings in chronological order.",
      highlightedLines: [4],
      lineExecution: "intervals.sort((a, b) => a[0] - b[0]);"
    },
    {
      intervals: [[0, 30], [5, 10], [15, 20]],
      currentIdx: -1,
      rooms: [],
      minRooms: 0,
      variables: { sorted: '[[0,30],[5,10],[15,20]]' },
      explanation: "Intervals are now sorted by start time: [0,30], [5,10], [15,20].",
      highlightedLines: [4],
      lineExecution: "// After sort"
    },
    {
      intervals: [[0, 30], [5, 10], [15, 20]],
      currentIdx: -1,
      rooms: [],
      minRooms: 0,
      variables: { endTimes: '[]' },
      explanation: "Initialize endTimes array to track when each room becomes available.",
      highlightedLines: [5],
      lineExecution: "const endTimes: number[] = [];"
    },
    {
      intervals: [[0, 30], [5, 10], [15, 20]],
      currentIdx: 0,
      rooms: [],
      minRooms: 0,
      variables: { processing: '[0,30]', i: 0 },
      explanation: "Start processing first meeting [0,30]. Check if any room is available.",
      highlightedLines: [7],
      lineExecution: "for (const interval of intervals) // i=0"
    },
    {
      intervals: [[0, 30], [5, 10], [15, 20]],
      currentIdx: 0,
      rooms: [],
      minRooms: 0,
      variables: { endTimes: '[]', check: 'length=0' },
      explanation: "No rooms exist yet (endTimes is empty). Skip the reuse check.",
      highlightedLines: [8],
      lineExecution: "if (endTimes.length > 0 && ...) // false"
    },
    {
      intervals: [[0, 30], [5, 10], [15, 20]],
      currentIdx: 0,
      rooms: [30],
      minRooms: 1,
      variables: { endTimes: '[30]', action: 'add room' },
      explanation: "Allocate a new room for meeting [0,30]. Room will be free at time 30.",
      highlightedLines: [11],
      lineExecution: "endTimes.push(interval[1]); // push 30"
    },
    {
      intervals: [[0, 30], [5, 10], [15, 20]],
      currentIdx: 0,
      rooms: [30],
      minRooms: 1,
      variables: { endTimes: '[30]', rooms: 1 },
      explanation: "Sort endTimes to keep earliest available room first. Current rooms needed: 1.",
      highlightedLines: [12],
      lineExecution: "endTimes.sort((a, b) => a - b);"
    },
    {
      intervals: [[0, 30], [5, 10], [15, 20]],
      currentIdx: 1,
      rooms: [30],
      minRooms: 1,
      variables: { processing: '[5,10]', i: 1 },
      explanation: "Process second meeting [5,10]. Check if we can reuse any room.",
      highlightedLines: [7],
      lineExecution: "for (const interval of intervals) // i=1"
    },
    {
      intervals: [[0, 30], [5, 10], [15, 20]],
      currentIdx: 1,
      rooms: [30],
      minRooms: 1,
      variables: { check: '30 <= 5?', result: 'false' },
      explanation: "Earliest room frees at 30, but meeting starts at 5. Room not available (30 > 5).",
      highlightedLines: [8],
      lineExecution: "if (endTimes[0] <= interval[0]) // 30 <= 5? false"
    },
    {
      intervals: [[0, 30], [5, 10], [15, 20]],
      currentIdx: 1,
      rooms: [30, 10],
      minRooms: 2,
      variables: { endTimes: '[30,10]', action: 'new room' },
      explanation: "Need a second room for meeting [5,10] as first room is still occupied.",
      highlightedLines: [11],
      lineExecution: "endTimes.push(interval[1]); // push 10"
    },
    {
      intervals: [[0, 30], [5, 10], [15, 20]],
      currentIdx: 1,
      rooms: [10, 30],
      minRooms: 2,
      variables: { endTimes: '[10,30]', rooms: 2 },
      explanation: "Sort endTimes. Room ending at 10 is now earliest available. Current rooms: 2.",
      highlightedLines: [12],
      lineExecution: "endTimes.sort((a, b) => a - b); // [10,30]"
    },
    {
      intervals: [[0, 30], [5, 10], [15, 20]],
      currentIdx: 2,
      rooms: [10, 30],
      minRooms: 2,
      variables: { processing: '[15,20]', i: 2 },
      explanation: "Process third meeting [15,20]. Check if we can reuse a room.",
      highlightedLines: [7],
      lineExecution: "for (const interval of intervals) // i=2"
    },
    {
      intervals: [[0, 30], [5, 10], [15, 20]],
      currentIdx: 2,
      rooms: [10, 30],
      minRooms: 2,
      variables: { check: '10 <= 15?', result: 'true' },
      explanation: "Earliest room frees at 10, meeting starts at 15. Room is available! (10 ≤ 15)",
      highlightedLines: [8],
      lineExecution: "if (endTimes[0] <= interval[0]) // 10 <= 15? true"
    },
    {
      intervals: [[0, 30], [5, 10], [15, 20]],
      currentIdx: 2,
      rooms: [30],
      minRooms: 2,
      variables: { endTimes: '[30]', action: 'remove 10' },
      explanation: "Reuse the room! Remove the earliest end time (10) from tracking.",
      highlightedLines: [9],
      lineExecution: "endTimes.shift(); // remove 10, now [30]"
    },
    {
      intervals: [[0, 30], [5, 10], [15, 20]],
      currentIdx: 2,
      rooms: [30, 20],
      minRooms: 2,
      variables: { endTimes: '[30,20]', action: 'add 20' },
      explanation: "Add end time 20 for meeting [15,20] to the reused room.",
      highlightedLines: [11],
      lineExecution: "endTimes.push(interval[1]); // push 20"
    },
    {
      intervals: [[0, 30], [5, 10], [15, 20]],
      currentIdx: 2,
      rooms: [20, 30],
      minRooms: 2,
      variables: { endTimes: '[20,30]', rooms: 2 },
      explanation: "Sort endTimes. We have 2 ongoing meetings, so still need 2 rooms.",
      highlightedLines: [12],
      lineExecution: "endTimes.sort((a, b) => a - b); // [20,30]"
    },
    {
      intervals: [[0, 30], [5, 10], [15, 20]],
      currentIdx: 2,
      rooms: [20, 30],
      minRooms: 2,
      variables: { result: 2, final: 'endTimes.length' },
      explanation: "All meetings processed. The size of endTimes is the minimum rooms needed: 2.",
      highlightedLines: [15],
      lineExecution: "return endTimes.length; // 2"
    },
    {
      intervals: [[0, 30], [5, 10], [15, 20]],
      currentIdx: 2,
      rooms: [20, 30],
      minRooms: 2,
      variables: { minRooms: 2, time: 'O(n log n)', space: 'O(n)' },
      explanation: "Algorithm complete! Minimum 2 conference rooms needed. Time complexity: O(n log n) due to sorting. Space: O(n) for endTimes array.",
      highlightedLines: [15],
      lineExecution: "Result: 2 rooms"
    }
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Meeting Rooms II</h3>
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

            <motion.div
              key={`rooms-${currentStepIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-primary/20 rounded-lg border-2 border-primary"
            >
              <div className="text-sm font-medium text-muted-foreground mb-1">Minimum Rooms Required:</div>
              <div className="text-3xl font-bold text-primary">{currentStep.minRooms}</div>
              {currentStep.rooms.length > 0 && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Active end times: [{currentStep.rooms.join(', ')}]
                </div>
              )}
            </motion.div>

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