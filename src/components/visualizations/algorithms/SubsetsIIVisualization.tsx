import React, { useEffect, useState, useMemo } from "react";
import { SimpleStepControls } from "../shared/SimpleStepControls";
import { VariablePanel } from "../shared/VariablePanel";
import { VisualizationCodePanel } from "../shared/VisualizationCodePanel";
import { VisualizationLayout } from "../shared/VisualizationLayout";
import { Card } from "@/components/ui/card";
import type { VisualizationLanguageMap, StepLineNumberMap } from "@/types/visualization";

interface Step {
  nums: number[];
  subset: number[];
  i: number;
  j: number | null;
  res: number[][];
  message: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function subsetsWithDup(nums: number[]): number[][] {
  const res: number[][] = [];
  nums.sort((a, b) => a - b);
  function backtrack(i: number, subset: number[]) {
    res.push([...subset]);
    for (let j = i; j < nums.length; j++) {
      if (j > i && nums[j] === nums[j - 1]) {
        continue;
      }
      subset.push(nums[j]);
      backtrack(j + 1, subset);
      subset.pop();
    }
  }
  backtrack(0, []);
  return res;
}`,
  python: `def subsetsWithDup(nums):
    res = []
    nums.sort()
    def backtrack(i, subset):
        if i == len(nums):
            res.append(subset[:])
            return
        subset.append(nums[i])
        backtrack(i + 1, subset)
        subset.pop()
        while i + 1 < len(nums) and nums[i] == nums[i + 1]:
            i += 1
        backtrack(i + 1, subset)
    backtrack(0, [])
    return res`,
  java: `public static class Solution {
    public List<List<Integer>> subsetsWithDup(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        Arrays.sort(nums);
        backtrack(0, nums, new ArrayList<>(), res);
        return res;
    }
    private void backtrack(int i, int[] nums, List<Integer> subset, List<List<Integer>> res) {
        res.add(new ArrayList<>(subset));
        for (int j = i; j < nums.length; j++) {
            if (j > i && nums[j] == nums[j - 1]) {
                continue;
            }
            subset.add(nums[j]);
            backtrack(j + 1, nums, subset, res);
            subset.remove(subset.size() - 1);
        }
    }
}`,
  cpp: `class Solution {
public:
    vector<vector<int>> subsetsWithDup(vector<int>& nums) {
        vector<vector<int>> res;
        vector<int> subset;
        sort(nums.begin(), nums.end());
        backtrack(0, nums, subset, res);
        return res;
    }
private:
    void backtrack(int i, vector<int>& nums, vector<int>& subset,
                   vector<vector<int>>& res) {
        res.push_back(subset);
        for (int j = i; j < nums.size(); j++) {
            if (j > i && nums[j] == nums[j - 1]) {
                continue;
            }
            subset.push_back(nums[j]);
            backtrack(j + 1, nums, subset, res);
            subset.pop_back();
        }
    }
};`
};

export const SubsetsIIVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { stepLineNumbers } = useMemo(() => {
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    return { stepLineNumbers: lines };
  }, []);

  const generated = useMemo(() => {
    const nums = [1, 2, 2];
    const newSteps: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const res: number[][] = [];
    const subset: number[] = [];

    const addStep = (
      i: number,
      j: number | null,
      message: string,
      pseudo: string,
      vars: any,
      ts: number, py: number, jv: number, cp: number
    ) => {
      newSteps.push({
        nums,
        subset: [...subset],
        i,
        j,
        res: res.map((s) => [...s]),
        message,
        pseudoStep: pseudo,
        variables: vars
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    addStep(
      0, null,
      "Initialize subsets-ii calculation.",
      "subsetsWithDup(nums=[1,2,2])",
      { nums: "[1,2,2]" },
      1, 1, 2, 3
    );

    addStep(
      0, null,
      "Initialize empty result array to hold the generated subsets.",
      "SET res = []",
      { res: "[]" },
      2, 2, 3, 4
    );

    addStep(
      0, null,
      "Sort input array to group identical numbers together: [1, 2, 2].",
      "nums.sort()  →  [1, 2, 2]",
      { nums: "[1,2,2]" },
      3, 3, 4, 6
    );

    function backtrackCall(i: number) {
      addStep(
        i, null,
        `Call backtrack(i=${i}) with current subset: [${subset.join(", ")}].`,
        `CALL backtrack(i=${i}, subset=[${subset.join(",")}])`,
        { i, subset: `[${subset.join(",")}]` },
        4, 4, 8, 11
      );

      res.push([...subset]);
      addStep(
        i, null,
        `Add copy of current subset [${subset.join(", ")}] to result list.`,
        `res.push([${subset.join(",")}])`,
        { i, subset: `[${subset.join(",")}]`, res: JSON.stringify(res) },
        5, 6, 9, 13
      );

      for (let j = i; j < nums.length; j++) {
        addStep(
          i, j,
          `Loop index j = ${j} (value: ${nums[j]}).`,
          `FOR j FROM ${i} TO 2  →  j = ${j}`,
          { i, j, val: nums[j] },
          6, 8, 10, 14
        );

        addStep(
          i, j,
          `Check duplicate condition: j > i (${j} > ${i}) AND nums[j] == nums[j-1] (${nums[j]} == ${nums[j - 1] ?? 'N/A'}).`,
          `IF j > i AND nums[j] == nums[j-1]  →  ${j} > ${i} AND ${nums[j]} == ${nums[j - 1] ?? '?'}`,
          { i, j, duplicate: j > i && nums[j] === nums[j - 1] },
          7, 11, 11, 15
        );

        if (j > i && nums[j] === nums[j - 1]) {
          addStep(
            i, j,
            `Duplicate found! nums[${j}] (${nums[j]}) == nums[${j - 1}] (${nums[j - 1]}). Skip it to avoid duplicate subsets.`,
            "CONTINUE",
            { i, j },
            8, 12, 12, 16
          );
          continue;
        }

        subset.push(nums[j]);
        addStep(
          i, j,
          `Include nums[${j}] (${nums[j]}) in current subset. Subset is now [${subset.join(", ")}].`,
          `subset.push(${nums[j]})`,
          { i, j, subset: `[${subset.join(",")}]` },
          10, 8, 14, 18
        );

        backtrackCall(j + 1);

        subset.pop();
        addStep(
          i, j,
          `Backtrack: pop last element to explore other combinations. Subset is now [${subset.join(", ")}].`,
          "subset.pop()",
          { i, j, subset: `[${subset.join(",")}]` },
          12, 10, 16, 20
        );
      }
    }

    addStep(
      0, null,
      "Start backtracking process from index 0 with empty subset.",
      "CALL backtrack(i=0, subset=[])",
      { i: 0, subset: "[]" },
      15, 14, 5, 7
    );

    backtrackCall(0);

    addStep(
      0, null,
      `Backtracking complete. Return final subsets list: ${JSON.stringify(res)}.`,
      `RETURN res  →  ${JSON.stringify(res)}`,
      { res: JSON.stringify(res) },
      16, 15, 6, 8
    );

    return { steps: newSteps, stepLineNumbers: lines };
  }, []);

  useEffect(() => {
    setSteps(generated.steps);
  }, [generated]);

  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  if (steps.length === 0) return null;
  const currentStep = steps[currentStepIndex];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <Card className="p-6 bg-card border border-border shadow-sm flex flex-col">
            <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Input Array (nums)</h3>
            <div className="flex gap-2 mb-6">
              {currentStep.nums.map((val, idx) => {
                const isI = idx === currentStep.i;
                const isJ = idx === currentStep.j;

                let highlightClass = "bg-card border-border";
                if (isJ && isI) {
                  highlightClass = "bg-purple-500/20 border-purple-500 scale-105 z-10 text-purple-600 dark:text-purple-400";
                } else if (isJ) {
                  highlightClass = "bg-blue-500/20 border-blue-500 scale-105 z-10 text-blue-600 dark:text-blue-400";
                } else if (isI) {
                  highlightClass = "bg-primary/20 border-primary scale-105 z-10 text-primary";
                }

                return (
                  <div
                    key={idx}
                    className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold transition-all relative ${highlightClass}`}
                  >
                    <span>{val}</span>
                    {(isI || isJ) && (
                      <div className="absolute -bottom-6 text-[10px] font-bold uppercase font-mono text-muted-foreground">
                        {isI && isJ ? "i,j" : isJ ? "j" : "i"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Current Subset</h3>
            <div className="flex gap-2 mb-6 min-h-[3rem]">
              {currentStep.subset.length > 0 ? (
                currentStep.subset.map((val, idx) => (
                  <div
                    key={idx}
                    className="w-12 h-12 flex items-center justify-center text-primary-foreground font-bold rounded-lg border bg-primary border-primary transition-all animate-in zoom-in"
                  >
                    {val}
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground italic flex items-center h-12 px-2 text-sm">
                  Empty []
                </div>
              )}
            </div>

            <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">
              Result Subsets ({currentStep.res.length})
            </h3>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto w-full p-3 border rounded-lg bg-muted/20 min-h-[6rem]">
              {currentStep.res.map((sub, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1 bg-green-500/10 text-green-700 dark:text-green-400 font-mono rounded border border-green-500/30 text-xs font-bold animate-in fade-in"
                >
                  [{sub.join(", ")}]
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 bg-primary/5 border border-primary/20 mt-auto">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Algorithm Logic</h4>
            <p className="text-sm text-foreground leading-relaxed font-medium">{currentStep.message}</p>
          </Card>

        </div>
      }
      rightContent={
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={generated.stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={() => setCurrentStepIndex(0)}
          />
          <VariablePanel
            variables={{
              "i (backtrack index)": currentStep.i,
              "j (loop index)": currentStep.j !== null ? currentStep.j : "null",
              "subset": `[${currentStep.subset.join(", ")}]`,
              "res.length": currentStep.res.length,
            }}
          />
        </div>
      }
      controls={
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
      }
    />
  );
};
export default SubsetsIIVisualization;
