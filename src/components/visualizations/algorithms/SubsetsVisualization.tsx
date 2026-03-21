import React, { useEffect, useRef, useState } from "react";

import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";

interface Step {
  nums: number[];
  subset: number[];
  i: number;
  res: number[][];
  message: string;
  lineNumber: number;
}

export const SubsetsVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function subsets(nums: number[]): number[][] {
    const res: number[][] = [];
    const subset: number[] = [];

    function dfs(i: number) {
        if (i >= nums.length) {
            res.push([...subset]);
            return;
        }

        subset.push(nums[i]);
        dfs(i + 1);

        subset.pop();
        dfs(i + 1);
    }

    dfs(0);
    return res;
}`;

  const generateSteps = () => {
    const nums = [1, 2, 3];
    const newSteps: Step[] = [];
    const res: number[][] = [];
    const subset: number[] = [];

    newSteps.push({
      nums, subset: [...subset], i: 0, res: [...res],
      message: 'Initialize res and subset arrays',
      lineNumber: 2
    });

    function dfs(i: number) {
      newSteps.push({
        nums, subset: [...subset], i, res: res.map((s) => [...s]),
        message: `dfs(${i}) called`,
        lineNumber: 5
      });

      newSteps.push({
        nums, subset: [...subset], i, res: res.map((s) => [...s]),
        message: `Check base case: i >= nums.length -> ${i} >= ${nums.length}`,
        lineNumber: 6
      });

      if (i >= nums.length) {
        res.push([...subset]);
        newSteps.push({
          nums, subset: [...subset], i, res: res.map((s) => [...s]),
          message: `Base case met! Push copy of current subset [${subset.join(', ')}] to res`,
          lineNumber: 7
        });

        newSteps.push({
          nums, subset: [...subset], i, res: res.map((s) => [...s]),
          message: `Return from dfs(${i})`,
          lineNumber: 8
        });
        return;
      }

      subset.push(nums[i]);
      newSteps.push({
        nums, subset: [...subset], i, res: res.map((s) => [...s]),
        message: `Include nums[${i}] (${nums[i]}) in subset. subset is now [${subset.join(', ')}]`,
        lineNumber: 11
      });

      newSteps.push({
        nums, subset: [...subset], i, res: res.map((s) => [...s]),
        message: `Recursive call dfs(${i + 1}) to explore inclusion branch`,
        lineNumber: 12
      });
      dfs(i + 1);

      const popped = subset.pop();
      newSteps.push({
        nums, subset: [...subset], i, res: res.map((s) => [...s]),
        message: `Backtrack: pop ${popped} from subset. subset is now [${subset.join(', ')}]`,
        lineNumber: 14
      });

      newSteps.push({
        nums, subset: [...subset], i, res: res.map((s) => [...s]),
        message: `Recursive call dfs(${i + 1}) to explore exclusion branch`,
        lineNumber: 15
      });
      dfs(i + 1);

      newSteps.push({
        nums, subset: [...subset], i, res: res.map((s) => [...s]),
        message: `dfs(${i}) execution finished, returning to caller.`,
        lineNumber: 16
      });
    }

    newSteps.push({
      nums, subset: [...subset], i: 0, res: [...res],
      message: 'Start initial DFS call from index 0',
      lineNumber: 18
    });
    dfs(0);

    newSteps.push({
      nums, subset: [...subset], i: 0, res: [...res],
      message: 'DFS complete. Return final result.',
      lineNumber: 19
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
        <div className="bg-card rounded-lg p-6 border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Input Array (nums)</h3>
          <div className="flex gap-2 mb-6">
            {currentStep.nums.map((val, idx) => (
              <div
                key={idx}
                className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold transition-all ${idx === currentStep.i
                  ? "bg-primary/20 border-primary scale-110 z-10"
                  : "bg-card border-border"
                  }`}
              >
                {val}
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold mb-4">Current Subset</h3>
          <div className="flex gap-2 mb-6 min-h-[3rem]">
            {currentStep.subset.length > 0 ? (
              currentStep.subset.map((val, idx) => (
                <div
                  key={idx}
                  className="w-12 h-12 flex items-center justify-center text-primary-foreground font-bold rounded-lg border-2 bg-primary border-primary transition-all animate-in zoom-in"
                >
                  {val}
                </div>
              ))
            ) : (
              <div className="text-muted-foreground italic flex items-center h-12 px-2">Empty []</div>
            )}
          </div>

          <h3 className="text-lg font-semibold mb-4">
            Result Array `res` ({currentStep.res.length})
          </h3>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto w-full p-2 border rounded-lg bg-muted/20 min-h-[6rem]">
            {currentStep.res.map((sub, idx) => (
              <div
                key={idx}
                className="px-3 py-1 bg-green-500/10 text-green-700 dark:text-green-400 font-mono rounded border border-green-500 text-sm animate-in fade-in"
              >
                [{sub.join(", ")}]
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-muted/60 border rounded-lg shadow-inner">
            <p className="text-sm font-medium">{currentStep.message}</p>
          </div>
          <div className="rounded-lg mt-4">
            <VariablePanel
              variables={{
                "i (index)": currentStep.i,
                "subset": `[${currentStep.subset.join(", ")}]`,
                "res.length": currentStep.res.length,
              }}
            />
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
