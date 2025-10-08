import React, { useState, useEffect, useRef } from 'react';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  original: string;
  transformed: string;
  center: number;
  radius: number[];
  maxLen: number;
  maxCenter: number;
  message: string;
  lineNumber: number;
}

export const ManachersVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function longestPalindrome(s: string): string {
  // Transform string: "abc" -> "^#a#b#c#$"
  const t = '^#' + s.split('').join('#') + '#$';
  const n = t.length;
  const radius = new Array(n).fill(0);
  let center = 0, right = 0;
  
  for (let i = 1; i < n - 1; i++) {
    // Mirror of i
    if (i < right) {
      radius[i] = Math.min(right - i, radius[2 * center - i]);
    }
    
    // Expand around center i
    while (t[i + radius[i] + 1] === t[i - radius[i] - 1]) {
      radius[i]++;
    }
    
    // Update center if palindrome extends past right
    if (i + radius[i] > right) {
      center = i;
      right = i + radius[i];
    }
  }
  
  // Find longest palindrome
  const maxLen = Math.max(...radius);
  const maxCenter = radius.indexOf(maxLen);
  const start = (maxCenter - maxLen) / 2;
  return s.substring(start, start + maxLen);
}`;

  const generateSteps = () => {
    const s = 'babad';
    const t = '^#' + s.split('').join('#') + '#$';
    const n = t.length;
    const radius = new Array(n).fill(0);
    let center = 0, right = 0;
    const newSteps: Step[] = [];

    newSteps.push({
      original: s,
      transformed: t,
      center: 0,
      radius: [...radius],
      maxLen: 0,
      maxCenter: 0,
      message: `Transform "${s}" to "${t}" with boundaries`,
      lineNumber: 2
    });

    for (let i = 1; i < n - 1; i++) {
      if (i < right) {
        radius[i] = Math.min(right - i, radius[2 * center - i]);
      }

      while (t[i + radius[i] + 1] === t[i - radius[i] - 1]) {
        radius[i]++;
      }

      newSteps.push({
        original: s,
        transformed: t,
        center: i,
        radius: [...radius],
        maxLen: Math.max(...radius),
        maxCenter: radius.indexOf(Math.max(...radius)),
        message: `Center at ${i} (${t[i]}), radius = ${radius[i]}`,
        lineNumber: 14
      });

      if (i + radius[i] > right) {
        center = i;
        right = i + radius[i];
      }
    }

    const maxLen = Math.max(...radius);
    const maxCenter = radius.indexOf(maxLen);
    const start = (maxCenter - maxLen) / 2;
    const result = s.substring(start, start + maxLen);

    newSteps.push({
      original: s,
      transformed: t,
      center: maxCenter,
      radius: [...radius],
      maxLen,
      maxCenter,
      message: `Longest palindrome: "${result}" (length ${maxLen})`,
      lineNumber: 29
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

      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">Original String: "{currentStep.original}"</h3>
        
        <h3 className="text-lg font-semibold mb-4">Transformed String</h3>
        <div className="flex gap-1 mb-6 overflow-x-auto">
          {currentStep.transformed.split('').map((char, idx) => (
            <div
              key={idx}
              className={`w-10 h-10 flex items-center justify-center rounded border-2 font-mono transition-all ${
                idx === currentStep.center
                  ? 'bg-primary/20 border-primary scale-110'
                  : idx === currentStep.maxCenter
                  ? 'bg-green-500/20 border-green-500'
                  : 'bg-card border-border'
              }`}
            >
              {char}
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-4">Radius Array</h3>
        <div className="flex gap-1 mb-6 overflow-x-auto">
          {currentStep.radius.map((r, idx) => (
            <div
              key={idx}
              className={`w-10 h-10 flex items-center justify-center rounded border font-mono text-sm ${
                idx === currentStep.center
                  ? 'bg-primary/10 border-primary'
                  : r > 0
                  ? 'bg-blue-500/10 border-blue-500/50'
                  : 'bg-card border-border'
              }`}
            >
              {r}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-muted rounded border">
            <div className="text-sm text-muted-foreground mb-1">Current Center</div>
            <div className="text-2xl font-bold text-primary">{currentStep.center}</div>
          </div>
          <div className="p-4 bg-muted rounded border">
            <div className="text-sm text-muted-foreground mb-1">Max Palindrome Length</div>
            <div className="text-2xl font-bold text-green-500">{currentStep.maxLen}</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-muted rounded">
          <p className="text-sm">{currentStep.message}</p>
        </div>
      </div>

      <VariablePanel
        variables={{
          'center': currentStep.center,
          'max length': currentStep.maxLen,
          'max center': currentStep.maxCenter
        }}
      />

      <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
    </div>
  );
};
