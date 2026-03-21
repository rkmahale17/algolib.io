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
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;

  let dp = new Set<number>();
  dp.add(0);

  const target = total / 2;

  for (let i = nums.length - 1; i >= 0; i--) {
    const nextDP = new Set<number>();

    for (const t of dp) {
      if (t + nums[i] === target) {
        return true;
      }

      nextDP.add(t + nums[i]);
      nextDP.add(t);
    }

    dp = nextDP;
  }

  return dp.has(target);
}`;

  const generateSteps = () => {
    const nums = [1, 5, 11, 5];
    const total = nums.reduce((a, b) => a + b, 0);

    const newSteps: Step[] = [];

    if (total % 2 !== 0) {
      newSteps.push({
        dp: [],
        nextDP: [],
        nums,
        i: -1,
        t: null,
        target: total,
        message: `Sum is ${total} (odd), impossible to partition.`,
        lineNumber: 3,
      });
      setSteps(newSteps);
      setCurrentStepIndex(0);
      return;
    }

    let dp = new Set<number>();
    dp.add(0);

    const target = total / 2;

    newSteps.push({
      dp: Array.from(dp),
      nextDP: [],
      nums,
      i: -1,
      t: null,
      target,
      message: `Initialize DP set with {0} and set target to ${target}.`,
      lineNumber: 6,
    });

    for (let i = nums.length - 1; i >= 0; i--) {
      newSteps.push({
        dp: Array.from(dp),
        nextDP: [],
        nums,
        i,
        t: null,
        target,
        message: `Starting outer loop for index i = ${i} (value: ${nums[i]}).`,
        lineNumber: 10,
      });

      const nextDP = new Set<number>();

      newSteps.push({
        dp: Array.from(dp),
        nextDP: Array.from(nextDP),
        nums,
        i,
        t: null,
        target,
        message: `Initialize empty nextDP set for this iteration.`,
        lineNumber: 11,
      });

      for (const t of Array.from(dp)) {
        newSteps.push({
          dp: Array.from(dp),
          nextDP: Array.from(nextDP),
          nums,
          i,
          t,
          target,
          message: `Check sum t=${t} from dp. Adding nums[i] (${nums[i]}) gives ${t + nums[i]}. Is it equal to target (${target})?`,
          lineNumber: 14,
        });

        if (t + nums[i] === target) {
          newSteps.push({
            dp: Array.from(dp),
            nextDP: Array.from(nextDP),
            nums,
            i,
            t,
            target,
            message: `Found partition! ${t} + ${nums[i]} == ${target}. Returning true!`,
            lineNumber: 15,
          });
          setSteps(newSteps);
          setCurrentStepIndex(0);
          return;
        }

        nextDP.add(t + nums[i]);

        newSteps.push({
          dp: Array.from(dp),
          nextDP: Array.from(nextDP),
          nums,
          i,
          t,
          target,
          message: `It is not the target. Add t + nums[i] = ${t + nums[i]} to nextDP (include current number).`,
          lineNumber: 18,
        });

        nextDP.add(t);

        newSteps.push({
          dp: Array.from(dp),
          nextDP: Array.from(nextDP),
          nums,
          i,
          t,
          target,
          message: `Also add the existing t = ${t} to nextDP (exclude current number).`,
          lineNumber: 19,
        });
      }

      dp = nextDP;

      newSteps.push({
        dp: Array.from(dp),
        nextDP: [],
        nums,
        i,
        t: null,
        target,
        message: `Inner loop complete. Update dp set to be nextDP.`,
        lineNumber: 22,
      });
    }

    newSteps.push({
      dp: Array.from(dp),
      nextDP: [],
      nums,
      i: -1,
      t: null,
      target,
      message: `Loop completed. Does final dp set contain target ${target}? ${dp.has(target)}.`,
      lineNumber: 25,
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
              <div className="bg-card w-full p-4 rounded-md shadow-sm border border-border/40">
                <h4 className="text-sm font-semibold mb-3">dp (Set)</h4>
                <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
                  {currentStep.dp.length === 0 && <span className="text-xs italic text-muted-foreground">Empty Set</span>}
                  {currentStep.dp.map((s) => (
                    <div
                      key={s}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${s === currentStep.t
                        ? 'bg-primary border-primary text-primary-foreground scale-110 shadow-md'
                        : 'bg-secondary/50 border-secondary text-foreground'
                        }`}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card w-full p-4 rounded-md shadow-sm border border-border/40">
                <h4 className="text-sm font-semibold mb-3">nextDP (Set)</h4>
                <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
                  {currentStep.nextDP.length === 0 && <span className="text-xs italic text-muted-foreground">Empty Set</span>}
                  {currentStep.nextDP.map((s) => {
                    const isNew = currentStep.t !== null && (s === currentStep.t || s === currentStep.t + currentStep.nums[currentStep.i]);
                    return (
                      <div
                        key={s}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${isNew
                          ? 'bg-green-500/20 border-green-500 text-green-700 dark:text-green-400 scale-105 shadow-sm'
                          : 'bg-secondary/50 border-secondary text-foreground'
                          }`}
                      >
                        {s}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">
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

        <div className="space-y-4">
          <AnimatedCodeEditor
            code={code}
            highlightedLines={[currentStep.lineNumber]}
            language="typescript"
          />
        </div>
      </div>
    </div>
  );
};
