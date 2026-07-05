import React, { useState, useEffect, useRef } from "react";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";
import { VisualizationCodePanel } from "../shared/VisualizationCodePanel";
import type { StepLineNumberMap, VisualizationLanguageMap } from "@/types/visualization";

interface Step {
  nums: number[];
  n: number | null;
  perms: number[][];
  result: number[][];
  message: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function permute(nums: number[]): number[][] {
    const result: number[][] = [];
    if (nums.length === 1) {
        return [nums.slice()];
    }
    for (let i = 0; i < nums.length; i++) {
        const n = nums.shift()!;
        const perms = permute(nums);
        for (const perm of perms) {
            perm.push(n);
        }
        result.push(...perms);
        nums.push(n);
    }
    return result;
}`,
  python: `def permute(nums):
    result = []
    if len(nums) == 1:
        return [nums[:]]
    for i in range(len(nums)):
        n = nums.pop(0)
        perms = permute(nums)
        for perm in perms:
            perm.append(n)
        result.extend(perms)
        nums.append(n)
    return result`,
  java: `public static class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        if (nums.length == 1) {
            List<Integer> baseList = new ArrayList<>();
            baseList.add(nums[0]);
            List<List<Integer>> baseResult = new ArrayList<>();
            baseResult.add(new ArrayList<>(baseList));
            return baseResult;
        }
        for (int i = 0; i < nums.length; i++) {
            int[] remainingNums = new int[nums.length - 1];
            int index = 0;
            for (int j = 0; j < nums.length; j++) {
                if (i != j) {
                    remainingNums[index++] = nums[j];
                }
            }
            List<List<Integer>> subPermutations = permute(remainingNums);
            for (List<Integer> subPermutation : subPermutations) {
                subPermutation.add(nums[i]);
            }
            result.addAll(subPermutations);
        }
        return result;
    }
}`,
  cpp: `class Solution {
public:
    vector<vector<int>> permute(vector<int>& nums) {
        vector<vector<int>> result;
        if (nums.size() == 1) {
            return {nums};
        }
        for (int i = 0; i < nums.size(); i++) {
            vector<int> remainingNums;
            for (int j = 0; j < nums.size(); j++) {
                if (i != j) {
                    remainingNums.push_back(nums[j]);
                }
            }
            vector<vector<int>> subPermutations = permute(remainingNums);
            for (auto &perm : subPermutations) {
                perm.push_back(nums[i]);
            }
            result.insert(result.end(), subPermutations.begin(), subPermutations.end());
        }
        return result;
    }
};`
};

export const PermutationsVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateStepsData = () => {
    const originalArr = [1, 2, 3];
    const steps: Step[] = [];
    const stepLineNumbers: StepLineNumberMap = {
      typescript: [],
      python: [],
      java: [],
      cpp: []
    };

    const addLines = (ts: number, py: number, java: number, cpp: number) => {
      stepLineNumbers.typescript!.push(ts);
      stepLineNumbers.python!.push(py);
      stepLineNumbers.java!.push(java);
      stepLineNumbers.cpp!.push(cpp);
    };

    function runPermute(numsRef: number[]) {
      function simulatePermute(currentNums: number[]): number[][] {
        const result: number[][] = [];

        steps.push({
          nums: [...currentNums], n: null, perms: [], result: [...result],
          message: `Call permute([${currentNums.join(', ')}])`,
          pseudoStep: `CALL permute(nums = [${currentNums.join(', ')}])`
        });
        addLines(1, 1, 2, 3);

        steps.push({
          nums: [...currentNums], n: null, perms: [], result: [...result],
          message: `Initialize frame result array`,
          pseudoStep: 'SET result = []'
        });
        addLines(2, 2, 3, 4);

        steps.push({
          nums: [...currentNums], n: null, perms: [], result: [...result],
          message: `Check base case: nums.length === 1`,
          pseudoStep: `IF nums.length === 1  →  ${currentNums.length === 1 ? 'YES ✓' : 'NO ✗'}`
        });
        addLines(3, 3, 4, 5);

        if (currentNums.length === 1) {
          const baseReturn = [currentNums.slice()];
          steps.push({
            nums: [...currentNums], n: null, perms: [], result: [...result],
            message: `Base case met! Return copy [[${currentNums[0]}]]`,
            pseudoStep: `RETURN [[${currentNums[0]}]]`
          });
          addLines(4, 4, 9, 6);
          return baseReturn;
        }

        const initialLen = currentNums.length;
        for (let i = 0; i < initialLen; i++) {
          steps.push({
            nums: [...currentNums], n: null, perms: [], result: [...result],
            message: `Iterate i = ${i} over nums`,
            pseudoStep: `FOR i = ${i} to ${initialLen - 1}`
          });
          addLines(6, 5, 11, 8);

          const n = currentNums.shift()!;
          steps.push({
            nums: [...currentNums], n, perms: [], result: [...result],
            message: `Shift out head element n = ${n}. Remaining: [${currentNums.join(', ')}]`,
            pseudoStep: `SET n = nums.shift()  →  n = ${n}`
          });
          addLines(7, 6, 16, 13);

          steps.push({
            nums: [...currentNums], n, perms: [], result: [...result],
            message: `Recursively calculate perms for remaining [${currentNums.join(', ')}]`,
            pseudoStep: `CALL permute([${currentNums.join(', ')}])`
          });
          addLines(8, 7, 19, 15);

          const perms = simulatePermute(currentNums);

          steps.push({
            nums: [...currentNums], n, perms: perms.map(p => [...p]), result: [...result],
            message: `Received child perms. Appending n = ${n} to each.`,
            pseudoStep: `FOR each perm IN perms`
          });
          addLines(9, 8, 20, 16);

          for (const perm of perms) {
            perm.push(n);
          }

          steps.push({
            nums: [...currentNums], n, perms: perms.map(p => [...p]), result: [...result],
            message: `Appended n = ${n} to permutations.`,
            pseudoStep: `APPEND n (${n}) to perm`
          });
          addLines(10, 9, 21, 17);

          result.push(...perms);
          steps.push({
            nums: [...currentNums], n, perms: perms.map(p => [...p]), result: [...result],
            message: `Pushed merged perms into current frame result array.`,
            pseudoStep: `PUSH perms to result`
          });
          addLines(12, 10, 23, 19);

          currentNums.push(n);
          steps.push({
            nums: [...currentNums], n: null, perms: [], result: [...result],
            message: `Restore n = ${n} back to tail of nums: [${currentNums.join(', ')}]`,
            pseudoStep: `RESTORE nums.push(n)`
          });
          addLines(13, 11, 24, 20);
        }

        steps.push({
          nums: [...currentNums], n: null, perms: [], result: [...result],
          message: `Frame loop complete, returning result matrix.`,
          pseudoStep: 'RETURN result'
        });
        addLines(15, 12, 25, 21);
        return result;
      }

      simulatePermute(numsRef);
    }

    runPermute(originalArr);

    const lastStep = steps[steps.length - 1];
    steps.push({
      ...lastStep,
      message: 'Algorithm Complete!',
      pseudoStep: 'DONE'
    });
    addLines(15, 12, 25, 21);

    return { steps, stepLineNumbers };
  };

  const { steps, stepLineNumbers } = generateStepsData();

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
  const pseudoSteps = steps.map((s) => s.pseudoStep);

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
        totalSteps={steps.length - 1}
        speed={speed}
        onSpeedChange={setSpeed}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-card rounded-lg p-6 border shadow-sm">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Frame nums</h3>
            <div className="flex gap-2 mb-6 min-h-[2rem]">
              {currentStep.nums.length > 0 ? (
                currentStep.nums.map((val, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border-2 text-xs font-bold bg-card border-border text-foreground transition-all animate-in zoom-in"
                  >
                    {val}
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground italic flex items-center px-2 text-xs">Empty Array</div>
              )}
            </div>

            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Extracted 'n'</h3>
            <div className="flex gap-2 mb-6 min-h-[2rem]">
              {currentStep.n !== null ? (
                <div className="w-8 h-8 flex items-center justify-center rounded-lg border-2 bg-accent/20 border-accent text-xs font-bold text-accent-foreground transition-all animate-in slide-in-from-left">
                  {currentStep.n}
                </div>
              ) : (
                <div className="text-muted-foreground italic flex items-center px-2 text-xs">None</div>
              )}
            </div>

            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Frame Result ({currentStep.result.length})</h3>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto w-full p-2 border rounded-lg bg-muted/20 min-h-[6rem]">
              {currentStep.result.map((perm, idx) => (
                <div key={idx} className="px-3 py-1 bg-green-500/10 text-green-700 dark:text-green-400 font-mono rounded border border-green-500 text-sm animate-in fade-in">
                  [{perm.join(', ')}]
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Algorithm Logic</h4>
            <p className="text-sm text-foreground leading-relaxed font-medium">
              {currentStep.message}
            </p>
          </div>

        </div>

        {/* Right Column: Code & Pseudocode Display and Variables */}
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={handleReset}
          />
          <VariablePanel
            variables={{
              'nums.length': currentStep.nums.length,
              'n value': currentStep.n !== null ? currentStep.n : 'null',
              'child perms': currentStep.perms.length,
              'result.length': currentStep.result.length
            }}
          />
        </div>
      </div>
    </div>
  );
};
