import React, { useState, useEffect, useRef } from "react";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";
import { VisualizationCodePanel } from "../shared/VisualizationCodePanel";
import type { StepLineNumberMap, VisualizationLanguageMap } from "@/types/visualization";

interface Step {
  nums: number[];
  subset: number[];
  i: number;
  res: number[][];
  message: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function subsets(nums: number[]): number[][] {
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
}`,
  python: `def subsets(nums):
    res = []
    subset = []
    def dfs(i):
        if i >= len(nums):
            res.append(subset.copy())
            return
        subset.append(nums[i])
        dfs(i + 1)
        subset.pop()
        dfs(i + 1)
    dfs(0)
    return res`,
  java: `public static class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        dfs(0, nums, new ArrayList<>(), res);
        return res;
    }
    private void dfs(int i, int[] nums, List<Integer> subset, List<List<Integer>> res) {
        if (i == nums.length) {
            res.add(new ArrayList<>(subset));
            return;
        }
        subset.add(nums[i]);
        dfs(i + 1, nums, subset, res);
        subset.remove(subset.size() - 1);
        dfs(i + 1, nums, subset, res);
    }
}`,
  cpp: `class Solution {
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        vector<vector<int>> res;
        vector<int> subset;
        dfs(0, nums, subset, res);
        return res;
    }
private:
    void dfs(int i, vector<int>& nums, vector<int>& subset, vector<vector<int>>& res) {
        if (i == nums.size()) {
            res.push_back(subset);
            return;
        }
        subset.push_back(nums[i]);
        dfs(i + 1, nums, subset, res);
        subset.pop_back();
        dfs(i + 1, nums, subset, res);
    }
};`
};

export const SubsetsVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateStepsData = () => {
    const nums = [1, 2, 3];
    const steps: Step[] = [];
    const res: number[][] = [];
    const subset: number[] = [];
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

    steps.push({
      nums, subset: [...subset], i: 0, res: [...res],
      message: 'Initialize res and subset arrays',
      pseudoStep: 'SET res = [], subset = []'
    });
    addLines(2, 2, 3, 4);

    steps.push({
      nums, subset: [...subset], i: 0, res: [...res],
      message: 'Start initial DFS call from index 0',
      pseudoStep: 'CALL dfs(0)'
    });
    addLines(14, 12, 4, 6);

    function dfs(i: number) {
      steps.push({
        nums, subset: [...subset], i, res: res.map((s) => [...s]),
        message: `dfs(${i}) called`,
        pseudoStep: `CALL dfs(i = ${i})`
      });
      addLines(4, 4, 7, 10);

      steps.push({
        nums, subset: [...subset], i, res: res.map((s) => [...s]),
        message: `Check base case: i >= nums.length -> ${i} >= ${nums.length}`,
        pseudoStep: `IF i >= nums.length  →  ${i} >= ${nums.length} ?`
      });
      addLines(5, 5, 8, 11);

      if (i >= nums.length) {
        res.push([...subset]);
        steps.push({
          nums, subset: [...subset], i, res: res.map((s) => [...s]),
          message: `Base case met! Push copy of current subset [${subset.join(', ')}] to res`,
          pseudoStep: `ADD subset copy to res  →  res.push([${subset.join(', ')}])`
        });
        addLines(6, 6, 9, 12);

        steps.push({
          nums, subset: [...subset], i, res: res.map((s) => [...s]),
          message: `Return from dfs(${i})`,
          pseudoStep: `RETURN`
        });
        addLines(7, 7, 10, 13);
        return;
      }

      subset.push(nums[i]);
      steps.push({
        nums, subset: [...subset], i, res: res.map((s) => [...s]),
        message: `Include nums[${i}] (${nums[i]}) in subset. subset is now [${subset.join(', ')}]`,
        pseudoStep: `ADD nums[${i}] (${nums[i]}) to subset`
      });
      addLines(9, 8, 12, 15);

      steps.push({
        nums, subset: [...subset], i, res: res.map((s) => [...s]),
        message: `Recursive call dfs(${i + 1}) to explore inclusion branch`,
        pseudoStep: `CALL dfs(i + 1 = ${i + 1})`
      });
      addLines(10, 9, 13, 16);
      dfs(i + 1);

      const popped = subset.pop();
      steps.push({
        nums, subset: [...subset], i, res: res.map((s) => [...s]),
        message: `Backtrack: pop ${popped} from subset. subset is now [${subset.join(', ')}]`,
        pseudoStep: `REMOVE last element (${popped}) from subset (backtrack)`
      });
      addLines(11, 10, 14, 17);

      steps.push({
        nums, subset: [...subset], i, res: res.map((s) => [...s]),
        message: `Recursive call dfs(${i + 1}) to explore exclusion branch`,
        pseudoStep: `CALL dfs(i + 1 = ${i + 1})`
      });
      addLines(12, 11, 15, 18);
      dfs(i + 1);

      steps.push({
        nums, subset: [...subset], i, res: res.map((s) => [...s]),
        message: `dfs(${i}) execution finished, returning to caller.`,
        pseudoStep: `RETURN`
      });
      addLines(13, 12, 16, 19);
    }

    dfs(0);

    steps.push({
      nums, subset: [...subset], i: 0, res: [...res],
      message: 'DFS complete. Return final result.',
      pseudoStep: 'RETURN res'
    });
    addLines(15, 13, 5, 7);

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
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Input Array (nums)</h3>
            <div className="flex gap-2 mb-6">
              {currentStep.nums.map((val, idx) => (
                <div
                  key={idx}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 text-xs font-bold transition-all ${
                    idx === currentStep.i
                      ? "bg-primary/20 border-primary scale-110 z-10 text-foreground"
                      : "bg-card border-border text-foreground"
                  }`}
                >
                  {val}
                </div>
              ))}
            </div>

            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Current Subset</h3>
            <div className="flex gap-2 mb-6 min-h-[2rem]">
              {currentStep.subset.length > 0 ? (
                currentStep.subset.map((val, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 flex items-center justify-center text-primary-foreground text-xs font-bold rounded-lg border-2 bg-primary border-primary transition-all animate-in zoom-in"
                  >
                    {val}
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground italic flex items-center h-8 px-2 text-xs">Empty []</div>
              )}
            </div>

            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
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
              "i (index)": currentStep.i,
              "subset": `[${currentStep.subset.join(", ")}]`,
              "res.length": currentStep.res.length,
            }}
          />
        </div>
      </div>
    </div>
  );
};
