import React, { useState, useEffect, useRef } from 'react';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface Activity {
  start: number;
  end: number;
  index: number;
}

interface Step {
  activities: Activity[];
  selected: number[];
  current: number;
  lastEnd: number;
  message: string;
  lineNumber: number;
}

export const ActivitySelectionVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function activitySelection(activities: Activity[]): Activity[] {
  // Sort by end time
  activities.sort((a, b) => a.end - b.end);
  
  const selected: Activity[] = [];
  let lastEnd = 0;
  
  for (const activity of activities) {
    if (activity.start >= lastEnd) {
      selected.push(activity);
      lastEnd = activity.end;
    }
  }
  
  return selected;
}`;

  const generateSteps = () => {
    const activities: Activity[] = [
      { start: 1, end: 4, index: 0 },
      { start: 3, end: 5, index: 1 },
      { start: 0, end: 6, index: 2 },
      { start: 5, end: 7, index: 3 },
      { start: 8, end: 9, index: 4 },
      { start: 5, end: 9, index: 5 }
    ];
    const newSteps: Step[] = [];

    activities.sort((a, b) => a.end - b.end);
    
    newSteps.push({
      activities: [...activities],
      selected: [],
      current: -1,
      lastEnd: 0,
      message: 'Sort activities by end time',
      lineNumber: 2
    });

    const selected: number[] = [];
    let lastEnd = 0;

    for (let i = 0; i < activities.length; i++) {
      const activity = activities[i];
      
      newSteps.push({
        activities: [...activities],
        selected: [...selected],
        current: i,
        lastEnd,
        message: `Checking activity ${i}: [${activity.start}, ${activity.end}]`,
        lineNumber: 7
      });

      if (activity.start >= lastEnd) {
        selected.push(i);
        lastEnd = activity.end;
        newSteps.push({
          activities: [...activities],
          selected: [...selected],
          current: i,
          lastEnd,
          message: `Selected activity ${i}! No overlap with previous (ends at ${lastEnd})`,
          lineNumber: 9
        });
      } else {
        newSteps.push({
          activities: [...activities],
          selected: [...selected],
          current: i,
          lastEnd,
          message: `Skipped activity ${i}: overlaps with previous`,
          lineNumber: 8
        });
      }
    }

    newSteps.push({
      activities: [...activities],
      selected: [...selected],
      current: -1,
      lastEnd,
      message: `Total selected: ${selected.length} activities`,
      lineNumber: 13
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
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) setCurrentStepIndex(currentStepIndex + 1);
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
  };
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="space-y-6">
      <StepControls
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        isPlaying={isPlaying}
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 border space-y-4">
          <h3 className="text-lg font-semibold">Activity Selection Timeline</h3>
          <div className="space-y-2">
            {currentStep.activities.map((activity, idx) => (
              <div key={idx} className="relative">
                <div className="flex items-center gap-2 text-xs mb-1">
                  <span className="w-8">A{idx}</span>
                  <div className="flex-1 relative h-10">
                    <div className="w-full h-2 bg-muted rounded"></div>
                  </div>
                  <div
                    className={`absolute h-8 rounded border-2 flex items-center justify-center text-xs font-bold transition-all ${
                      currentStep.selected.includes(idx)
                        ? 'bg-green-500/20 border-green-500'
                        : idx === currentStep.current
                        ? 'bg-primary/20 border-primary'
                        : 'bg-blue-500/10 border-blue-500/50'
                    }`}
                    style={{
                      left: `${(activity.start / 10) * 100}%`,
                      width: `${((activity.end - activity.start) / 10) * 100}%`
                    }}
                  >
                    {activity.start}-{activity.end}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-green-500/20 border-2 border-green-500"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary/20 border-2 border-primary"></div>
              <span>Current</span>
            </div>
          </div>

          <div className="p-4 bg-muted rounded">
            <p className="text-sm">{currentStep.message}</p>
          </div>
        </div>

        <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
      </div>

      <VariablePanel
        variables={{
          'current': currentStep.current >= 0 ? currentStep.current : 'done',
          'last end': currentStep.lastEnd,
          'selected count': currentStep.selected.length
        }}
      />
    </div>
  );
};
