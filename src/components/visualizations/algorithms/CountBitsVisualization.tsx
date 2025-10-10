import React, { useEffect, useRef, useState } from "react";

import { CodeHighlighter } from "../shared/CodeHighlighter";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";

interface Step {
  n: number;
  current: number;
  result: number[];
  binary: string;
  bitCount: number;
  message: string;
  lineNumber: number;
}

export const CountBitsVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function countBits(n: number): number[] {
  const result = new Array(n + 1);
  result[0] = 0;
  
  for (let i = 1; i <= n; i++) {
    // i >> 1 removes last bit
    // i & 1 checks if last bit is 1
    result[i] = result[i >> 1] + (i & 1);
  }
  
  return result;
}`;

  const generateSteps = () => {
    const n = 8;
    const newSteps: Step[] = [];
    const result = new Array(n + 1);
    result[0] = 0;

    newSteps.push({
      n,
      current: 0,
      result: [0],
      binary: "0",
      bitCount: 0,
      message: "Initialize result[0] = 0 (zero has 0 ones)",
      lineNumber: 2,
    });

    for (let i = 1; i <= n; i++) {
      const prevIndex = i >> 1;
      const lastBit = i & 1;
      result[i] = result[prevIndex] + lastBit;

      newSteps.push({
        n,
        current: i,
        result: [...result.slice(0, i + 1)],
        binary: i.toString(2),
        bitCount: result[i],
        message: `${i} (${i.toString(
          2
        )}): result[${prevIndex}] + ${lastBit} = ${result[i]}`,
        lineNumber: 7,
      });
    }

    newSteps.push({
      n,
      current: -1,
      result: [...result],
      binary: "",
      bitCount: 0,
      message:
        "Complete! Each index contains count of 1s in its binary representation",
      lineNumber: 10,
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
    if (currentStepIndex < steps.length - 1)
      setCurrentStepIndex(currentStepIndex + 1);
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
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">
            Count Bits for 0 to {currentStep.n}
          </h3>

          {currentStep.current >= 0 && (
            <div className="mb-6 p-4 bg-muted rounded border">
              <div className="text-sm text-muted-foreground mb-2">
                Current Number: {currentStep.current}
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Binary</div>
                  <div className="text-xl font-mono font-bold">
                    {currentStep.binary}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Count of 1s
                  </div>
                  <div className="text-xl font-bold text-primary">
                    {currentStep.bitCount}
                  </div>
                </div>
              </div>
            </div>
          )}

          <h3 className="text-lg font-semibold mb-4">Result Array</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {currentStep.result.map((val, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="text-xs text-muted-foreground mb-1">
                  [{idx}]
                </div>
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold transition-all ${
                    idx === currentStep.current
                      ? "bg-primary/20 border-primary"
                      : "bg-blue-500/10 border-blue-500/50"
                  }`}
                >
                  {val}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {idx.toString(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-muted rounded">
            <p className="text-sm">{currentStep.message}</p>
          </div>
          <div className="rounded-lg">
            <VariablePanel
              variables={{
                n: currentStep.n,
                current:
                  currentStep.current >= 0 ? currentStep.current : "done",
                binary: currentStep.binary || "none",
                "bit count": currentStep.bitCount,
              }}
            />
          </div>
        </div>

        <CodeHighlighter
          code={code}
          highlightedLine={currentStep.lineNumber}
          language="typescript"
        />
      </div>
    </div>
  );
};
