import React, { useEffect, useRef, useState } from "react";

import { CodeHighlighter } from "../shared/CodeHighlighter";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";

interface Step {
  dp: number[];
  amount: number;
  coin: number;
  message: string;
  lineNumber: number;
}

export const CoinChangeVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  
  for (let coin of coins) {
    for (let i = coin; i <= amount; i++) {
      dp[i] = Math.min(
        dp[i],
        dp[i - coin] + 1
      );
    }
  }
  
  return dp[amount] === Infinity ? -1 : dp[amount];
}`;

  const generateSteps = () => {
    const coins = [1, 2, 5];
    const amount = 11;
    const dp = Array(amount + 1).fill(Infinity);
    dp[0] = 0;

    const newSteps: Step[] = [];

    newSteps.push({
      dp: [...dp],
      amount: 0,
      coin: 0,
      message: "Initialize: dp[0] = 0, all others = Infinity",
      lineNumber: 2,
    });

    for (let coin of coins) {
      for (let i = coin; i <= amount; i++) {
        const prev = dp[i];
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);

        if (prev !== dp[i]) {
          newSteps.push({
            dp: [...dp],
            amount: i,
            coin,
            message: `Using coin ${coin}: dp[${i}] = min(${
              prev === Infinity ? "∞" : prev
            }, dp[${i - coin}] + 1) = ${dp[i]}`,
            lineNumber: 7,
          });
        }
      }
    }

    newSteps.push({
      dp: [...dp],
      amount,
      coin: 0,
      message: `Minimum coins needed: ${
        dp[amount] === Infinity ? "Not possible" : dp[amount]
      }`,
      lineNumber: 13,
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
          <h3 className="text-lg font-semibold">DP Array (Coins: [1, 2, 5])</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {currentStep.dp.map((val, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="text-xs text-muted-foreground mb-1">{idx}</div>
                <div
                  className={`w-12 h-12 rounded border-2 flex items-center justify-center font-bold text-sm transition-all ${
                    idx === currentStep.amount
                      ? "bg-primary/20 border-primary text-primary scale-110"
                      : val === Infinity
                      ? "bg-muted border-border text-muted-foreground"
                      : "bg-green-500/20 border-green-500 text-green-500"
                  }`}
                >
                  {val === Infinity ? "∞" : val}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-muted rounded">
            <p className="text-sm">{currentStep.message}</p>
          </div>

          <div className="rounded">
            <VariablePanel
              variables={{
                currentCoin: currentStep.coin,
                targetAmount: currentStep.amount,
                minCoins:
                  currentStep.dp[currentStep.amount] === Infinity
                    ? "Not possible"
                    : currentStep.dp[currentStep.amount],
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
