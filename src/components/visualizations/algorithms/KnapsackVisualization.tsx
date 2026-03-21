import React, { useEffect, useRef, useState } from "react";

import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";

interface Step {
  dp: number[][];
  rowLabels: string[];
  i: number;
  coinValue: number;
  w: number;
  value: number;
  message: string;
  lineNumber: number;
}

export const KnapsackVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function change(amount: number, coins: number[]): number {
  let dp: number[] = new Array(amount + 1).fill(0);
  dp[0] = 1;

  for (let i = coins.length - 1; i >= 0; i--) {
    const nextDP: number[] = new Array(amount + 1).fill(0);
    nextDP[0] = 1;

    for (let a = 1; a <= amount; a++) {
      nextDP[a] = dp[a];

      if (a - coins[i] >= 0) {
        nextDP[a] += nextDP[a - coins[i]];
      }
    }
    dp = nextDP;
  }
  return dp[amount];
}`;

  const generateSteps = () => {
    const coins = [1, 2, 5];
    const amount = 5;
    const n = coins.length;

    let historicalDP: number[][] = [];
    let rowLabels: string[] = ["Init"];
    const newSteps: Step[] = [];

    let currentDP: number[] = new Array(amount + 1).fill(0);
    currentDP[0] = 1;
    historicalDP.push([...currentDP]);

    newSteps.push({
      dp: historicalDP.map((row) => [...row]),
      rowLabels: [...rowLabels],
      i: -1,
      coinValue: 0,
      w: 0,
      value: currentDP[0],
      message: "Initialize dp array. Base case: 1 way to make amount 0.",
      lineNumber: 3,
    });

    for (let i = n - 1; i >= 0; i--) {
      const coin = coins[i];
      const nextDP: number[] = new Array(amount + 1).fill(0);
      nextDP[0] = 1;

      historicalDP.push([...nextDP]);
      rowLabels.push(`Coin ${coin}`);

      newSteps.push({
        dp: historicalDP.map((row) => [...row]),
        rowLabels: [...rowLabels],
        i,
        coinValue: coin,
        w: 0,
        value: nextDP[0],
        message: `Processing coin ${coin}: Initialize nextDP base case for 0 amount.`,
        lineNumber: 7,
      });

      for (let a = 1; a <= amount; a++) {
        nextDP[a] = currentDP[a];
        historicalDP[historicalDP.length - 1][a] = nextDP[a];

        newSteps.push({
          dp: historicalDP.map((row) => [...row]),
          rowLabels: [...rowLabels],
          i,
          coinValue: coin,
          w: a,
          value: nextDP[a],
          message: `Amount ${a}: Exclude coin ${coin}, inherit ${currentDP[a]} ways from prev DP row.`,
          lineNumber: 10,
        });

        if (a - coin >= 0) {
          nextDP[a] += nextDP[a - coin];
          historicalDP[historicalDP.length - 1][a] = nextDP[a];

          newSteps.push({
            dp: historicalDP.map((row) => [...row]),
            rowLabels: [...rowLabels],
            i,
            coinValue: coin,
            w: a,
            value: nextDP[a],
            message: `Amount ${a}: Include coin ${coin}, adding ${nextDP[a - coin]} ways -> Total: ${nextDP[a]}`,
            lineNumber: 13,
          });
        }
      }

      currentDP = [...nextDP];
      newSteps.push({
        dp: historicalDP.map((row) => [...row]),
        rowLabels: [...rowLabels],
        i,
        coinValue: coin,
        w: amount,
        value: currentDP[amount],
        message: `Finished passes for coin ${coin}, dp = nextDP.`,
        lineNumber: 16,
      });
    }

    newSteps.push({
      dp: historicalDP.map((row) => [...row]),
      rowLabels: [...rowLabels],
      i: -1,
      coinValue: 0,
      w: amount,
      value: currentDP[amount],
      message: `Finished computations. Total ways to make ${amount} is ${currentDP[amount]}.`,
      lineNumber: 18,
    });

    setSteps(newSteps);
    setCurrentStepIndex(0);
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
        <div className="bg-card rounded-lg p-6 border overflow-hidden flex justify-center w-full">
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4 text-center">Ways DP Table</h3>
            <div className="inline-block min-w-full overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="border border-border p-2 bg-muted">Coins \ Amt</th>
                    {currentStep.dp[0].map((_, w) => (
                      <th key={w} className="border border-border p-2 bg-muted">
                        {w}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentStep.dp.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      <td className="border border-border p-2 bg-muted font-semibold whitespace-nowrap">
                        {currentStep.rowLabels[rowIdx]}
                      </td>
                      {row.map((val, a) => (
                        <td
                          key={a}
                          className={`border border - border p - 2 text - center transition - all ${rowIdx === currentStep.dp.length - 1 && a === currentStep.w
                              ? "bg-primary/20 font-bold"
                              : rowIdx === currentStep.dp.length - 2 && a === currentStep.w
                                ? "bg-blue-500/10 italic text-muted-foreground"
                                : rowIdx === currentStep.dp.length - 1 && currentStep.coinValue > 0 && a === currentStep.w - currentStep.coinValue
                                  ? "bg-green-500/20 font-bold text-green-500"
                                  : val > 0
                                    ? "bg-green-500/5"
                                    : ""
                            } `}
                        >
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-4 bg-muted rounded">
              <p className="text-sm">{currentStep.message}</p>
            </div>
            <div className="rounded-lg mt-4">
              <VariablePanel
                variables={{
                  "Current Coin": currentStep.coinValue,
                  "Target Amount (a)": currentStep.w,
                  "Total Ways NextDP[a]": currentStep.value,
                }}
              />
            </div>
          </div>
        </div>

        <AnimatedCodeEditor
          code={code}
          highlightedLines={[currentStep.lineNumber]}
          language="typescript"
        />
      </div>
    </div>
  );
};
