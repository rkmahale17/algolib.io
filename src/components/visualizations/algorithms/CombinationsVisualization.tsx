import React, { useState, useEffect, useRef } from "react";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";
import { VisualizationCodePanel } from "../shared/VisualizationCodePanel";
import type { StepLineNumberMap, VisualizationLanguageMap } from "@/types/visualization";

interface Step {
  n: number;
  k: number;
  comb: number[];
  i: number | null;
  res: number[][];
  message: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function combine(n: number, k: number): number[][] {
  const res: number[][] = [];
  function backtrack(start: number, comb: number[]) {
    if (comb.length === k) {
      res.push([...comb]);
      return;
    }
    for (let i = start; i <= n; i++) {
      comb.push(i);
      backtrack(i + 1, comb);
      comb.pop();
    }
  }
  backtrack(1, []);
  return res;
}`,
  python: `def combine(n: int, k: int) -> list[list[int]]:
    res: list[list[int]] = []
    def backtrack(start: int, comb: list[int]) -> None:
        if len(comb) == k:
            res.append(comb.copy())
            return
        for i in range(start, n + 1):
            comb.append(i)
            backtrack(i + 1, comb)
            comb.pop()
    backtrack(1, [])
    return res`,
  java: `public static class Solution {
    public List<List<Integer>> combine(int n, int k) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(n, k, 1, new ArrayList<>(), res);
        return res;
    }
    private void backtrack(int n, int k, int start, List<Integer> comb, List<List<Integer>> res) {
        if (comb.size() == k) {
            res.add(new ArrayList<>(comb));
            return;
        }
        for (int i = start; i <= n; i++) {
            comb.add(i);
            backtrack(n, k, i + 1, comb, res);
            comb.remove(comb.size() - 1);
        }
    }
}`,
  cpp: `class Solution {
public:
    vector<vector<int>> combine(int n, int k) {
        vector<vector<int>> res;
        vector<int> comb;
        backtrack(n, k, 1, comb, res);
        return res;
    }
private:
    void backtrack(int n, int k, int start, vector<int>& comb, vector<vector<int>>& res) {
        if (comb.size() == k) {
            res.push_back(comb);
            return;
        }
        for (int i = start; i <= n; i++) {
            comb.push_back(i);
            backtrack(n, k, i + 1, comb, res);
            comb.pop_back();
        }
    }
};`
};

export const CombinationsVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateStepsData = () => {
    const n = 4;
    const k = 2;
    const steps: Step[] = [];
    const res: number[][] = [];
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
      n, k, comb: [], i: null, res: [],
      message: "Initialize result array res = []",
      pseudoStep: "SET res = []"
    });
    addLines(2, 2, 3, 4);

    steps.push({
      n, k, comb: [], i: null, res: [],
      message: "Initiate backtracking from index 1",
      pseudoStep: "CALL backtrack(start = 1, comb = [])"
    });
    addLines(14, 11, 4, 6);

    function backtrack(start: number, comb: number[]) {
      steps.push({
        n, k, comb: [...comb], i: null, res: res.map(r => [...r]),
        message: `Calling backtrack(start=${start}, comb=[${comb.join(", ")}])`,
        pseudoStep: `CALL backtrack(start = ${start}, comb = [${comb.join(", ")}])`
      });
      addLines(3, 3, 7, 10);

      steps.push({
        n, k, comb: [...comb], i: null, res: res.map(r => [...r]),
        message: `Condition check: comb.length === k (${comb.length} === ${k})`,
        pseudoStep: `IF comb.length === k  →  ${comb.length} === ${k} ?`
      });
      addLines(4, 4, 8, 11);

      if (comb.length === k) {
        res.push([...comb]);
        steps.push({
          n, k, comb: [...comb], i: null, res: res.map(r => [...r]),
          message: `Base case reached. Added [${comb.join(", ")}] to result.`,
          pseudoStep: `ADD comb copy to res  →  res.push([${comb.join(", ")}])`
        });
        addLines(5, 5, 9, 12);

        steps.push({
          n, k, comb: [...comb], i: null, res: res.map(r => [...r]),
          message: "Return from recursive call",
          pseudoStep: "RETURN"
        });
        addLines(6, 6, 10, 13);
        return;
      }

      for (let i = start; i <= n; i++) {
        steps.push({
          n, k, comb: [...comb], i: i, res: res.map(r => [...r]),
          message: `Iterating: i = ${i}`,
          pseudoStep: `FOR i = ${i} to ${n}`
        });
        addLines(8, 7, 12, 15);

        comb.push(i);
        steps.push({
          n, k, comb: [...comb], i: i, res: res.map(r => [...r]),
          message: `Included ${i} in current combination`,
          pseudoStep: `ADD i (${i}) to comb`
        });
        addLines(9, 8, 13, 16);

        steps.push({
          n, k, comb: [...comb], i: i, res: res.map(r => [...r]),
          message: `Recursive call backtrack(i + 1 = ${i + 1})`,
          pseudoStep: `CALL backtrack(start = ${i + 1}, comb)`
        });
        addLines(10, 9, 14, 17);

        backtrack(i + 1, comb);

        const popped = comb.pop();
        steps.push({
          n, k, comb: [...comb], i: i, res: res.map(r => [...r]),
          message: `Backtracked: Removed ${popped} from current combination`,
          pseudoStep: `REMOVE last element (${popped}) from comb (backtrack)`
        });
        addLines(11, 10, 15, 18);
      }
    }

    backtrack(1, []);

    steps.push({
      n, k, comb: [], i: null, res: res.map(r => [...r]),
      message: "End backtracking. Return all combinations.",
      pseudoStep: "RETURN res"
    });
    addLines(15, 12, 5, 7);

    const lastStep = steps[steps.length - 1];
    steps.push({
      ...lastStep,
      message: "Algorithm Complete!",
      pseudoStep: "DONE"
    });
    addLines(15, 12, 5, 7);

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
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Numbers: 1 to {currentStep.n}, Select {currentStep.k}</h3>
            <div className="flex gap-2 mb-6 flex-wrap">
              {Array.from({ length: currentStep.n }, (_, i) => i + 1).map((val) => (
                <div
                  key={val}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 text-xs font-bold transition-all ${
                    val === currentStep.i
                      ? "bg-primary/20 border-primary scale-110 text-foreground"
                      : currentStep.comb.includes(val)
                      ? "bg-green-500/20 border-green-500 text-foreground"
                      : "bg-card border-border text-foreground"
                  }`}
                >
                  {val}
                </div>
              ))}
            </div>

            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Current Combination ({currentStep.comb.length}/{currentStep.k})</h3>
            <div className="flex gap-2 mb-6 min-h-[2rem] flex-wrap">
              {currentStep.comb.length > 0 ? (
                currentStep.comb.map((val, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border-2 bg-blue-500/20 border-blue-500 text-foreground text-xs font-bold animate-in zoom-in"
                  >
                    {val}
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground italic h-8 flex items-center text-xs">Empty</div>
              )}
            </div>

            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Result (res) - Total: {currentStep.res.length}</h3>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg bg-muted/20">
              {currentStep.res.length > 0 ? (
                currentStep.res.map((comb, idx) => (
                  <div key={idx} className="px-3 py-1 bg-muted rounded border text-sm text-foreground animate-in fade-in">
                    [{comb.join(', ')}]
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground italic text-sm">No combinations found yet.</div>
              )}
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
              'n': currentStep.n,
              'k': currentStep.k,
              'i': currentStep.i ?? 'null',
              'comb': `[${currentStep.comb.join(', ')}]`,
              'res.length': currentStep.res.length
            }}
          />
        </div>
      </div>
    </div>
  );
};
