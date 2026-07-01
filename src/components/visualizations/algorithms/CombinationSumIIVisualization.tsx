import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  candidates: number[];
  target: number;
  current: number[];
  sum: number;
  i: number;
  allCombinations: number[][];
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function combinationSum2(candidates: number[], target: number): number[][] {
  const result: number[][] = [];
  candidates.sort((a, b) => a - b);
  function dfs(i: number, current: number[], total: number): void {
    if (total === target) {
      result.push([...current]);
      return;
    }
    if (total > target || i === candidates.length) {
      return;
    }
    current.push(candidates[i]);
    dfs(i + 1, current, total + candidates[i]);
    current.pop();
    while (i + 1 < candidates.length && candidates[i] === candidates[i + 1]) {
      i++;
    }
    dfs(i + 1, current, total);
  }
  dfs(0, [], 0);
  return result;
}`,
  python: `def combinationSum2(candidates, target):
    result = []
    candidates.sort()
    def dfs(i, current, total):
        if total == target:
            result.append(current[:])
            return
        if total > target or i == len(candidates):
            return
        current.append(candidates[i])
        dfs(i + 1, current, total + candidates[i])
        current.pop()
        while i + 1 < len(candidates) and candidates[i] == candidates[i + 1]:
            i += 1
        dfs(i + 1, current, total)
    dfs(0, [], 0)
    return result`,
  java: `public static class Solution {
    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        List<List<Integer>> result = new ArrayList<>();
        Arrays.sort(candidates);
        dfs(candidates, target, 0, new ArrayList<>(), result);
        return result;
    }
    private void dfs(int[] candidates, int target, int start, List<Integer> current, List<List<Integer>> result) {
        if (target == 0) {
            result.add(new ArrayList<>(current));
            return;
        }
        if (target < 0) {
            return;
        }
        for (int i = start; i < candidates.length; i++) {
            if (i > start && candidates[i] == candidates[i - 1]) {
                continue;
            }
            current.add(candidates[i]);
            dfs(candidates, target - candidates[i], i + 1, current, result);
            current.remove(current.size() - 1);
        }
    }
}`,
  cpp: `class Solution {
public:
    vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
        vector<vector<int>> result;
        vector<int> current;
        sort(candidates.begin(), candidates.end());
        function<void(int, int)> dfs = [&](int i, int total) {
            if (total == target) {
                result.push_back(current);
                return;
            }
            if (total > target || i == candidates.size()) {
                return;
            }
            current.push_back(candidates[i]);
            dfs(i + 1, total + candidates[i]);
            current.pop_back();
            while (i + 1 < candidates.size() && candidates[i] == candidates[i + 1]) {
                i++;
            }
            dfs(i + 1, total);
        };
        dfs(0, 0);
        return result;
    }
};`
};

export const CombinationSumIIVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const generatedSteps: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const candidates = [2, 5, 2, 1, 2];
    const target = 5;
    
    const sortedCandidates = [...candidates].sort((a, b) => a - b);
    const result: number[][] = [];
    
    const addStep = (
      current: number[],
      sum: number,
      i: number,
      explanation: string,
      pseudo: string,
      vars: any,
      ts: number, py: number, java: number, cpp: number
    ) => {
      generatedSteps.push({
        candidates: sortedCandidates,
        target,
        current: [...current],
        sum,
        i,
        allCombinations: JSON.parse(JSON.stringify(result)),
        explanation,
        pseudoStep: pseudo,
        variables: vars
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(java);
      lines.cpp!.push(cpp);
    };

    addStep(
      [], 0, 0,
      "Start with candidates [1,2,2,2,5] and target 5.",
      "combinationSum2(candidates=[1,2,2,2,5], target=5)",
      { candidates: "[1,2,2,2,5]", target },
      1, 1, 2, 3
    );

    addStep(
      [], 0, 0,
      "Initialize empty result array to store all unique combinations.",
      "SET result = []",
      { result: "[]" },
      2, 2, 3, 4
    );

    addStep(
      [], 0, 0,
      "Sort the candidates array in ascending order to easily handle duplicates.",
      "candidates.sort() → [1, 2, 2, 2, 5]",
      { candidates: "[1,2,2,2,5]" },
      3, 3, 4, 6
    );

    addStep(
      [], 0, 0,
      "Start the depth-first search traversal from index 0 with an empty combination.",
      "CALL dfs(i=0, current=[], total=0)",
      { i: 0, current: "[]", total: 0 },
      20, 16, 5, 23
    );

    function dfsCall(i: number, current: number[], total: number) {
      const found = total === target;
      if (found) {
        result.push([...current]);
        addStep(
          current, total, i,
          `Found valid combination [${current.join(', ')}] summing to target 5! Add to result.`,
          `IF total == target  →  ${total} == 5 (YES)  →  result.push([${current.join(',')}])`,
          { total, target, current: `[${current.join(',')}]`, result: JSON.stringify(result) },
          6, 6, 10, 9
        );
        return;
      }

      const outOfBounds = total > target || i === sortedCandidates.length;
      if (outOfBounds) {
        addStep(
          current, total, i,
          total > target 
            ? `Sum (${total}) exceeds target (5). Backtrack.`
            : `Reached end of candidates list at index ${i}. Backtrack.`,
          total > target 
            ? `IF total > target  →  ${total} > 5 (YES)  →  RETURN`
            : `IF i == len(candidates)  →  ${i} == 5 (YES)  →  RETURN`,
          { total, target, i },
          10, 9, 14, 13
        );
        return;
      }

      addStep(
        current, total, i,
        `Validate state: total (${total}) < target (5) and index ${i} < length (5). Continuing search.`,
        `IF total == target (NO) | IF total > target OR i == len (NO)`,
        { total, target, i },
        9, 8, 13, 12
      );

      const chosen = sortedCandidates[i];
      current.push(chosen);
      addStep(
        current, total + chosen, i,
        `Include candidate at index ${i} (value ${chosen}). New combination: [${current.join(', ')}]. Recursively explore.`,
        `current.push(candidates[${i}] = ${chosen})  →  CALL dfs(i=${i + 1}, total=${total + chosen})`,
        { i, chosen, current: `[${current.join(',')}]`, total: total + chosen },
        12, 10, 20, 15
      );

      dfsCall(i + 1, current, total + chosen);

      current.pop();
      addStep(
        current, total, i,
        `Backtrack: remove last added element ${chosen} to explore other combinations.`,
        "current.pop()",
        { current: `[${current.join(',')}]`, total },
        14, 12, 22, 17
      );

      let nextI = i;
      while (nextI + 1 < sortedCandidates.length && sortedCandidates[nextI] === sortedCandidates[nextI + 1]) {
        addStep(
          current, total, nextI,
          `Duplicate detected: candidates[${nextI}] (${sortedCandidates[nextI]}) == candidates[${nextI + 1}] (${sortedCandidates[nextI + 1]}). Skip to avoid duplicate combinations.`,
          `WHILE candidates[${nextI}] == candidates[${nextI + 1}]  →  Skip index ${nextI}`,
          { i: nextI, "candidates[i]": sortedCandidates[nextI] },
          16, 14, 18, 19
        );
        nextI++;
      }

      addStep(
        current, total, nextI,
        `Exclude candidates[${i}] (${chosen}) and continue exploring from index ${nextI + 1}.`,
        `CALL dfs(i=${nextI + 1}, total=${total})`,
        { i: nextI + 1, current: `[${current.join(',')}]`, total },
        18, 15, 16, 21
      );

      dfsCall(nextI + 1, current, total);
    }

    dfsCall(0, [], 0);
    
    addStep(
      [], 0, sortedCandidates.length,
      `Algorithm complete. Found all unique combinations: ${JSON.stringify(result)}.`,
      `RETURN result  →  ${JSON.stringify(result)}`,
      { result: JSON.stringify(result) },
      21, 17, 6, 24
    );

    return { steps: generatedSteps, stepLineNumbers: lines };
  }, []);

  const step = steps[currentStep];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-4">Combination Sum II</h3>
            <div className="space-y-6">
              
              <div>
                <div className="flex justify-between items-end mb-2">
                  <div className="text-xs font-semibold">Candidates & Pointer &apos;i&apos;</div>
                  <div className="text-xs text-muted-foreground">Target: <span className="font-mono text-foreground font-bold">{step.target}</span></div>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                  {step.candidates.map((num, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <div className={`w-8 h-8 flex items-center justify-center rounded border-2 transition-colors ${idx === step.i ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm' : 'border-border bg-muted/30 text-muted-foreground'}`}>
                        {num}
                      </div>
                      <div className="h-3 flex items-center justify-center">
                        {idx === step.i && (
                          <div className="text-[10px] font-bold text-primary animate-bounce">↑</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <div className="text-xs font-semibold">Current Combination</div>
                  <div className="text-xs text-muted-foreground">Sum: <span className={`font-mono font-bold ${step.sum === step.target ? 'text-green-500' : step.sum > step.target ? 'text-red-500' : 'text-foreground'}`}>{step.sum}</span> / {step.target}</div>
                </div>
                
                <div className="w-full bg-muted rounded-full h-1.5 mb-3 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${step.sum === step.target ? 'bg-green-500' : step.sum > step.target ? 'bg-red-500' : 'bg-primary'}`} 
                    style={{ width: `${Math.min(100, (step.sum / step.target) * 100)}%` }}
                  />
                </div>

                <div className="flex gap-2 flex-wrap min-h-8">
                  {step.current.length === 0 ? (
                    <div className="h-8 px-3 flex items-center justify-center rounded border border-dashed border-muted-foreground/40 text-muted-foreground text-xs italic">
                      Empty
                    </div>
                  ) : (
                    step.current.map((num, idx) => (
                      <div key={idx} className="w-8 h-8 flex items-center justify-center rounded bg-primary text-primary-foreground font-bold shadow-sm">
                        {num}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold mb-2">Unique Combinations Found:</div>
                <div className="flex flex-wrap gap-2">
                  {step.allCombinations.length === 0 ? (
                    <div className="text-xs text-muted-foreground italic">None yet</div>
                  ) : (
                    step.allCombinations.map((combo, idx) => (
                      <div key={idx} className="flex gap-1 p-1.5 rounded-md bg-green-500/10 border border-green-500/20">
                        {combo.map((num, nIdx) => (
                          <div key={nIdx} className="w-6 h-6 flex items-center justify-center rounded bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-bold">
                            {num}
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-muted/30 border-primary/20">
            <div className="space-y-3">
              <div className="text-sm font-semibold text-primary flex items-center gap-2">
                <span>Explanation</span>
              </div>
              <div className="text-sm leading-relaxed">
                {step.explanation}
              </div>
            </div>
          </Card>

          <VariablePanel variables={step.variables} />
        </div>
      }
      rightContent={
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStep}
          onLanguageChange={() => setCurrentStep(0)}
        />
      }
      controls={
        <SimpleStepControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onStepChange={setCurrentStep}
        />
      }
    />
  );
};
export default CombinationSumIIVisualization;
