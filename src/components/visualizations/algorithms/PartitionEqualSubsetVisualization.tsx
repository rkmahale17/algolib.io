import { useEffect, useRef, useState } from "react";

import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";

interface Step {
  dp: number[];
  nextDP: number[];
  nums: number[];
  i: number;
  t: number | null;
  target: number;
  message: string;
  lineNumber: number;
}

export const PartitionEqualSubsetVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function canPartition(nums: number[]): boolean {
    const sum = nums.reduce((a, b) => a + b, 0);
    if (sum % 2 !== 0) return false;
    const target = sum / 2;

    const dp: boolean[] = new Array(target + 1).fill(false);
    dp[0] = true;

    for (const num of nums) {
        for (let i = target; i >= num; i--) {
            if (dp[i - num]) {
                dp[i] = true;
            }
        }
    }

    return dp[target];
}`;

  const generateSteps = () => {
    const nums = [1, 5, 11, 5];
    const sum = nums.reduce((a, b) => a + b, 0);
    const newSteps: Step[] = [];

    if (sum % 2 !== 0) {
      newSteps.push({
        dp: [],
        nextDP: [],
        nums,
        i: -1,
        t: null,
        target: sum / 2,
        message: `Sum is ${sum} (odd), impossible to partition equally.`,
        lineNumber: 3,
      });
      setSteps(newSteps);
      return;
    }

    const target = sum / 2;
    const dp = new Array(target + 1).fill(false);
    dp[0] = true;

    newSteps.push({
      dp: [...dp.map(v => v ? 1 : 0)],
      nextDP: [],
      nums,
      i: -1,
      t: 0,
      target,
      message: `Total sum is ${sum}, target sum is ${target}. Initialize dp[0] = true.`,
      lineNumber: 7,
    });

    for (let idx = 0; idx < nums.length; idx++) {
      const num = nums[idx];
      newSteps.push({
        dp: [...dp.map(v => v ? 1 : 0)],
        nextDP: [],
        nums,
        i: idx,
        t: null,
        target,
        message: `Considering number: ${num}`,
        lineNumber: 9,
      });

      for (let i = target; i >= num; i--) {
        newSteps.push({
          dp: [...dp.map(v => v ? 1 : 0)],
          nextDP: [],
          nums,
          i: idx,
          t: i,
          target,
          message: `Checking if sum ${i} is reachable: checking if dp[i - ${num}] (dp[${i - num}]) is true.`,
          lineNumber: 11,
        });

        if (dp[i - num]) {
          dp[i] = true;
          newSteps.push({
            dp: [...dp.map(v => v ? 1 : 0)],
            nextDP: [],
            nums,
            i: idx,
            t: i,
            target,
            message: `Reachable! dp[${i - num}] is true, so dp[${i}] becomes true.`,
            lineNumber: 12,
          });
        }
      }
    }

    newSteps.push({
      dp: [...dp.map(v => v ? 1 : 0)],
      nextDP: [],
      nums,
      i: -1,
      t: null,
      target,
      message: `Done! dp[target] (dp[${target}]) is ${dp[target]}. Result: ${dp[target]}`,
      lineNumber: 17,
    });

    setSteps(newSteps);
    setCurrentStepIndex(0);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () =>
    currentStepIndex < steps.length - 1 &&
    setCurrentStepIndex((prev) => prev + 1);
  const handleStepBack = () =>
    currentStepIndex > 0 && setCurrentStepIndex((prev) => prev - 1);
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    generateSteps();
  };

  if (steps.length === 0) return null;
  const currentStep = steps[currentStepIndex];

  return (
    <div className="space-y-6">
      <StepControls
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={setSpeed}
        currentStep={currentStepIndex}
        totalSteps={steps.length - 1}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 overflow-hidden flex justify-center w-full">
            <div className="space-y-6 w-full">
              <div className="bg-card w-full p-6 rounded-md shadow-sm border border-border/40">
                <h4 className="text-sm font-semibold mb-4 flex justify-between items-center">
                  Reachable Sums (DP Array)
                  <span className="text-xs font-normal text-muted-foreground">Target: {currentStep.target}</span>
                </h4>
                <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
                  {currentStep.dp.map((reachable, idx) => {
                    const isCurrent = currentStep.t === idx;
                    const isDependency = currentStep.i !== -1 && currentStep.t !== null && idx === currentStep.t - currentStep.nums[currentStep.i];
                    return (
                      <div
                        key={idx}
                        className={`flex flex-col items-center gap-1 p-1 rounded transition-all ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                      >
                        <div className="text-[8px] text-muted-foreground font-mono">{idx}</div>
                        <div
                          className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold border-2 transition-all ${reachable
                            ? 'bg-green-500 border-green-500 text-white'
                            : isDependency
                              ? 'bg-primary/20 border-primary text-primary animate-pulse'
                              : 'bg-muted border-border text-muted-foreground'
                            }`}
                        >
                          {reachable ? 'T' : 'F'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-accent/50 rounded-lg border border-accent p-4">
                <p className="text-sm text-foreground leading-relaxed">
                  {currentStep.message}
                </p>
              </div>

              <div className="rounded-lg mt-4">
                <VariablePanel
                  variables={{
                    nums: `[${currentStep.nums.join(', ')}]`,
                    "target sum": currentStep.target,
                    "current index (i)": currentStep.i >= 0 ? currentStep.i : "N/A",
                    "current num (nums[i])": currentStep.i >= 0 ? currentStep.nums[currentStep.i] : "N/A",
                    "current subset sum (t)": currentStep.t !== null ? currentStep.t : "N/A",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <AnimatedCodeEditor
            code={code}
            highlightedLines={[currentStep.lineNumber]}
            language="TypeScript"
          />
        </div>
      </div>
    </div>
  );
};
