import React, { useState, useEffect, useRef } from 'react';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  array: number[];
  index: number;
  xorResult: number;
  binary: string;
  message: string;
  lineNumber: number;
}

export const XORTrickVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function findSingleNumber(nums: number[]): number {
  let result = 0;
  
  // XOR all numbers
  // Duplicates cancel out (a ^ a = 0)
  // Single number remains (a ^ 0 = a)
  for (const num of nums) {
    result ^= num;
  }
  
  return result;
}`;

  const generateSteps = () => {
    const arr = [4, 2, 4, 5, 2];
    const newSteps: Step[] = [];
    let xorResult = 0;

    newSteps.push({
      array: arr,
      index: -1,
      xorResult: 0,
      binary: '0000',
      message: 'Initialize result = 0. XOR property: a ^ a = 0, a ^ 0 = a',
      lineNumber: 1
    });

    for (let i = 0; i < arr.length; i++) {
      const num = arr[i];
      const prevXor = xorResult;
      xorResult ^= num;
      
      newSteps.push({
        array: arr,
        index: i,
        xorResult,
        binary: xorResult.toString(2).padStart(4, '0'),
        message: `${prevXor} ^ ${num} = ${xorResult} (binary: ${prevXor.toString(2)} ^ ${num.toString(2)} = ${xorResult.toString(2)})`,
        lineNumber: 7
      });
    }

    newSteps.push({
      array: arr,
      index: -1,
      xorResult,
      binary: xorResult.toString(2).padStart(4, '0'),
      message: `Result: ${xorResult} (the single number that appears once)`,
      lineNumber: 10
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
        <h3 className="text-lg font-semibold mb-4">Array (Find Single Number)</h3>
        <div className="flex gap-2 mb-6">
          {currentStep.array.map((val, idx) => (
            <div
              key={idx}
              className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold transition-all ${
                idx === currentStep.index
                  ? 'bg-primary/20 border-primary'
                  : 'bg-card border-border'
              }`}
            >
              {val}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-muted rounded border">
            <div className="text-sm text-muted-foreground mb-1">XOR Result (Decimal)</div>
            <div className="text-2xl font-bold">{currentStep.xorResult}</div>
          </div>
          <div className="p-4 bg-muted rounded border">
            <div className="text-sm text-muted-foreground mb-1">XOR Result (Binary)</div>
            <div className="text-2xl font-mono font-bold">{currentStep.binary}</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-muted rounded">
          <p className="text-sm">{currentStep.message}</p>
        </div>
      </div>

      <VariablePanel
        variables={{
          'current index': currentStep.index >= 0 ? currentStep.index : 'done',
          'xor result': currentStep.xorResult,
          'binary': currentStep.binary
        }}
      />

      <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
    </div>
  );
};
