import React, { useEffect, useRef, useState } from "react";

import { CodeHighlighter } from "../shared/CodeHighlighter";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";

interface Step {
  base: number;
  exp: number;
  mod: number;
  result: number;
  currentExp: number;
  currentBase: number;
  message: string;
  lineNumber: number;
}

export const ModularExpVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function modularExponentiation(base: number, exp: number, mod: number): number {
  let result = 1;
  base = base % mod;
  
  while (exp > 0) {
    // If exp is odd, multiply base with result
    if (exp % 2 === 1) {
      result = (result * base) % mod;
    }
    
    // exp must be even now
    exp = Math.floor(exp / 2);
    base = (base * base) % mod;
  }
  
  return result;
}`;

  const generateSteps = () => {
    const originalBase = 3;
    const originalExp = 13;
    const mod = 7;
    const newSteps: Step[] = [];

    let result = 1;
    let base = originalBase % mod;
    let exp = originalExp;

    newSteps.push({
      base: originalBase,
      exp: originalExp,
      mod,
      result: 1,
      currentExp: exp,
      currentBase: base,
      message: `Calculate ${originalBase}^${originalExp} mod ${mod}`,
      lineNumber: 1,
    });

    while (exp > 0) {
      if (exp % 2 === 1) {
        const oldResult = result;
        result = (result * base) % mod;
        newSteps.push({
          base: originalBase,
          exp: originalExp,
          mod,
          result,
          currentExp: exp,
          currentBase: base,
          message: `Exp is odd: result = (${oldResult} * ${base}) mod ${mod} = ${result}`,
          lineNumber: 7,
        });
      }

      exp = Math.floor(exp / 2);
      const oldBase = base;
      base = (base * base) % mod;

      newSteps.push({
        base: originalBase,
        exp: originalExp,
        mod,
        result,
        currentExp: exp,
        currentBase: base,
        message: `Square base: (${oldBase}^2) mod ${mod} = ${base}, exp = ${exp}`,
        lineNumber: 12,
      });
    }

    newSteps.push({
      base: originalBase,
      exp: originalExp,
      mod,
      result,
      currentExp: 0,
      currentBase: base,
      message: `Final result: ${originalBase}^${originalExp} mod ${mod} = ${result}`,
      lineNumber: 15,
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
            Modular Exponentiation: {currentStep.base}^{currentStep.exp} mod{" "}
            {currentStep.mod}
          </h3>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-muted rounded border">
              <div className="text-sm text-muted-foreground mb-1">
                Current Base
              </div>
              <div className="text-2xl font-bold text-primary">
                {currentStep.currentBase}
              </div>
            </div>
            <div className="p-4 bg-muted rounded border">
              <div className="text-sm text-muted-foreground mb-1">
                Current Exp
              </div>
              <div className="text-2xl font-bold text-blue-500">
                {currentStep.currentExp}
              </div>
            </div>
            <div className="p-4 bg-muted rounded border">
              <div className="text-sm text-muted-foreground mb-1">Modulo</div>
              <div className="text-2xl font-bold">{currentStep.mod}</div>
            </div>
            <div className="p-4 bg-muted rounded border">
              <div className="text-sm text-muted-foreground mb-1">Result</div>
              <div className="text-2xl font-bold text-green-500">
                {currentStep.result}
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-muted rounded">
            <p className="text-sm">{currentStep.message}</p>
          </div>
          <div className="rounded-lg">
            <VariablePanel
              variables={{
                original: `${currentStep.base}^${currentStep.exp} mod ${currentStep.mod}`,
                "current base": currentStep.currentBase,
                "current exp": currentStep.currentExp,
                result: currentStep.result,
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
