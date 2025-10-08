import React, { useState, useEffect, useRef } from 'react';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  a: number;
  b: number;
  remainder: number | null;
  message: string;
  lineNumber: number;
}

export const GCDVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function gcd(a: number, b: number): number {
  // Euclidean Algorithm
  while (b !== 0) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  return a;
}`;

  const generateSteps = () => {
    let a = 48;
    let b = 18;
    const newSteps: Step[] = [];

    newSteps.push({
      a,
      b,
      remainder: null,
      message: `Find GCD of ${a} and ${b} using Euclidean Algorithm`,
      lineNumber: 1
    });

    while (b !== 0) {
      const remainder = a % b;
      
      newSteps.push({
        a,
        b,
        remainder,
        message: `${a} mod ${b} = ${remainder}`,
        lineNumber: 3
      });

      a = b;
      b = remainder;

      newSteps.push({
        a,
        b,
        remainder: null,
        message: `Update: a = ${a}, b = ${b}`,
        lineNumber: 5
      });
    }

    newSteps.push({
      a,
      b,
      remainder: null,
      message: `GCD found: ${a}`,
      lineNumber: 8
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
          <h3 className="text-lg font-semibold">Euclidean Algorithm</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded border">
              <div className="text-sm text-muted-foreground mb-1">a</div>
              <div className="text-3xl font-bold text-primary">{currentStep.a}</div>
            </div>
            <div className="p-4 bg-muted rounded border">
              <div className="text-sm text-muted-foreground mb-1">b</div>
              <div className="text-3xl font-bold text-blue-500">{currentStep.b}</div>
            </div>
            <div className="p-4 bg-muted rounded border">
              <div className="text-sm text-muted-foreground mb-1">remainder</div>
              <div className="text-3xl font-bold text-green-500">
                {currentStep.remainder !== null ? currentStep.remainder : '-'}
              </div>
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
          'a': currentStep.a,
          'b': currentStep.b,
          'remainder': currentStep.remainder !== null ? currentStep.remainder : 'none'
        }}
      />
    </div>
  );
};
