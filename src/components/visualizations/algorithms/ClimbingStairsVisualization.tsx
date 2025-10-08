import React, { useState, useEffect, useRef } from 'react';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  n: number;
  currentStep: number;
  dp: number[];
  ways: number;
  message: string;
  lineNumber: number;
}

export const ClimbingStairsVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function climbStairs(n) {
  if (n <= 2) return n;
  
  const dp = Array(n + 1);
  dp[1] = 1;  // 1 way to climb 1 step
  dp[2] = 2;  // 2 ways to climb 2 steps
  
  for (let i = 3; i <= n; i++) {
    // Ways to reach step i = 
    // ways from (i-1) + ways from (i-2)
    dp[i] = dp[i-1] + dp[i-2];
  }
  
  return dp[n];
}`;

  const generateSteps = () => {
    const n = 6;
    const dp = Array(n + 1).fill(0);
    const newSteps: Step[] = [];

    newSteps.push({
      n,
      currentStep: 0,
      dp: [...dp],
      ways: 0,
      message: 'Start: Calculate ways to climb ' + n + ' stairs',
      lineNumber: 1
    });

    dp[1] = 1;
    newSteps.push({
      n,
      currentStep: 1,
      dp: [...dp],
      ways: 1,
      message: 'Base case: 1 way to climb 1 step',
      lineNumber: 5
    });

    dp[2] = 2;
    newSteps.push({
      n,
      currentStep: 2,
      dp: [...dp],
      ways: 2,
      message: 'Base case: 2 ways to climb 2 steps (1+1 or 2)',
      lineNumber: 6
    });

    for (let i = 3; i <= n; i++) {
      dp[i] = dp[i-1] + dp[i-2];
      
      newSteps.push({
        n,
        currentStep: i,
        dp: [...dp],
        ways: dp[i],
        message: `Step ${i}: dp[${i}] = dp[${i-1}] + dp[${i-2}] = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]} ways`,
        lineNumber: 11
      });
    }

    newSteps.push({
      n,
      currentStep: n,
      dp: [...dp],
      ways: dp[n],
      message: `Total ways to climb ${n} stairs: ${dp[n]}`,
      lineNumber: 14
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
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
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
          <h3 className="text-lg font-semibold">Climbing Stairs</h3>
          <div className="relative">
            <div className="flex items-end justify-center gap-2">
              {currentStep.dp.slice(1).map((ways, idx) => {
                const step = idx + 1;
                const maxWays = Math.max(...currentStep.dp.slice(1));
                return (
                  <div key={step} className="flex flex-col items-center gap-2">
                    <div className="text-sm font-bold text-primary">{ways}</div>
                    <div
                      className={`w-12 rounded-t transition-all duration-300 ${
                        step === currentStep.currentStep
                          ? 'bg-primary scale-110'
                          : 'bg-primary/40'
                      }`}
                      style={{ height: `${(ways / maxWays) * 120}px`, minHeight: '30px' }}
                    />
                    <div className="text-xs text-muted-foreground">{step}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            {currentStep.dp.slice(1).map((ways, idx) => {
              const step = idx + 1;
              return (
                <div key={step} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-12 h-12 rounded border-2 flex items-center justify-center font-bold text-sm transition-all ${
                      step === currentStep.currentStep
                        ? 'bg-primary/20 border-primary text-primary scale-110'
                        : ways > 0
                        ? 'bg-green-500/20 border-green-500 text-green-500'
                        : 'bg-card border-border text-muted-foreground'
                    }`}
                  >
                    {ways || '0'}
                  </div>
                  <div className="text-xs text-muted-foreground">{step}</div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-muted rounded">
            <p className="text-sm">{currentStep.message}</p>
          </div>
        </div>

        <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
      </div>

      <VariablePanel
        variables={{
          n: currentStep.n,
          currentStep: currentStep.currentStep,
          ways: currentStep.ways,
          totalWays: currentStep.dp[currentStep.n] || 0
        }}
      />
    </div>
  );
};
