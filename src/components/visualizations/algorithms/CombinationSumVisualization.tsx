import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  candidates: number[];
  target: number;
  current: number[];
  sum: number;
  start: number;
  allCombinations: number[][];
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
  lineExecution: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function combinationSum(candidates: number[], target: number): number[][] {
  const result: number[][] = [];
  function backtrack(start: number, current: number[], sum: number) {
    if (sum === target) {
      result.push([...current]);
      return;
    }
    if (sum > target) return;
    for (let i = start; i < candidates.length; i++) {
      current.push(candidates[i]);
      backtrack(i, current, sum + candidates[i]);
      current.pop();
    }
  }
  backtrack(0, [], 0);
  return result;
}`,
  python: `def combinationSum(candidates: list[int], target: int) -> list[list[int]]:
    res = []
    def dfs(i, cur, total):
        if total == target:
            res.append(cur.copy())
            return
        if i >= len(candidates) or total > target:
            return
        cur.append(candidates[i])
        dfs(i, cur, total + candidates[i])
        cur.pop()
        dfs(i + 1, cur, total)
    dfs(0, [], 0)
    return res`,
  java: `public static class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> res = new ArrayList<>();
        dfs(0, new ArrayList<>(), 0, candidates, target, res);
        return res;
    }
    private void dfs(int i, List<Integer> cur, int total, int[] candidates, int target, List<List<Integer>> res) {
        if (total == target) {
            res.add(new ArrayList<>(cur));
            return;
        }
        if (i >= candidates.length || total > target) {
            return;
        }
        cur.add(candidates[i]);
        dfs(i, cur, total + candidates[i], candidates, target, res);
        cur.remove(cur.size() - 1);
        dfs(i + 1, cur, total, candidates, target, res);
    }
}`,
  cpp: `class Solution {
public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        vector<vector<int>> result;
        vector<int> current;
        backtrack(candidates, target, 0, current, 0, result);
        return result;
    }
    void backtrack(vector<int>& candidates, int target, int start, 
                   vector<int>& current, int total, 
                   vector<vector<int>>& result) {
        if (total == target) {
            result.push_back(current);
            return;
        }
        if (total > target) {
            return;
        }
        for (int i = start; i < candidates.size(); i++) {
            current.push_back(candidates[i]);
            backtrack(candidates, target, i, current, total + candidates[i], result);
            current.pop_back();
        }
    }
};`
};

const stepLineNumbers: StepLineNumberMap = {
  typescript: [1, 2, 3, 10, 11, 4, 5, 12, 4, 8, 10, 11, 8, 4, 5, 16, 16],
  python: [1, 2, 3, 9, 10, 4, 5, 11, 4, 7, 9, 10, 7, 4, 5, 14, 14],
  java: [2, 3, 7, 15, 16, 8, 9, 17, 8, 12, 15, 16, 12, 8, 9, 5, 5],
  cpp: [3, 4, 9, 20, 21, 12, 13, 22, 12, 16, 20, 21, 16, 12, 13, 7, 7]
};

export const CombinationSumVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const candidates = [2, 3, 6, 7];
  const target = 7;

  const steps: Step[] = [
    {
      candidates,
      target,
      current: [],
      sum: 0,
      start: 0,
      allCombinations: [],
      variables: { candidates: '[2,3,6,7]', target: 7 },
      explanation: "Starting with candidates [2,3,6,7] and target 7. Find all unique combinations that sum to target.",
      pseudoStep: "canFinish(candidates=[2,3,6,7], target=7)",
      lineExecution: "function combinationSum(candidates: number[], target: number): number[][]"
    },
    {
      candidates,
      target,
      current: [],
      sum: 0,
      start: 0,
      allCombinations: [],
      variables: { result: '[]' },
      explanation: "Initialize empty result array to store all valid combinations.",
      pseudoStep: "SET result = []",
      lineExecution: "const result: number[][] = [];"
    },
    {
      candidates,
      target,
      current: [],
      sum: 0,
      start: 0,
      allCombinations: [],
      variables: { start: 0, current: '[]', sum: 0 },
      explanation: "Define backtrack helper function. Start with empty combination and sum 0.",
      pseudoStep: "CALL backtrack(start=0, current=[], sum=0)",
      lineExecution: "function backtrack(start: number, current: number[], sum: number)"
    },
    {
      candidates,
      target,
      current: [2],
      sum: 2,
      start: 0,
      allCombinations: [],
      variables: { start: 0, current: '[2]', sum: 2 },
      explanation: "Choose first candidate 2. Sum = 2, need 5 more to reach target 7.",
      pseudoStep: "current.push(2)",
      lineExecution: "current.push(candidates[i]); // current = [2], sum = 2"
    },
    {
      candidates,
      target,
      current: [2, 2],
      sum: 4,
      start: 0,
      allCombinations: [],
      variables: { current: '[2,2]', sum: 4 },
      explanation: "Choose another 2. Sum = 4, need 3 more. We can reuse same number.",
      pseudoStep: "CALL backtrack(start=0, current=[2], sum=2)",
      lineExecution: "backtrack(i, current, sum + candidates[i]); // sum = 4"
    },
    {
      candidates,
      target,
      current: [2, 2, 3],
      sum: 7,
      start: 1,
      allCombinations: [],
      variables: { sum: 7, target: 7 },
      explanation: "Choose 3. Sum = 7 equals target! Found valid combination.",
      pseudoStep: "IF sum == target  →  NO",
      lineExecution: "if (sum === target) // 7 === 7 -> true"
    },
    {
      candidates,
      target,
      current: [2, 2, 3],
      sum: 7,
      start: 1,
      allCombinations: [[2, 2, 3]],
      variables: { result: '[[2,2,3]]' },
      explanation: "Add [2,2,3] to result. Return and backtrack to explore other paths.",
      pseudoStep: "result.push([2,2,3])",
      lineExecution: "result.push([...current]); // result = [[2,2,3]]"
    },
    {
      candidates,
      target,
      current: [2, 3],
      sum: 5,
      start: 1,
      allCombinations: [[2, 2, 3]],
      variables: { current: '[2,3]', sum: 5 },
      explanation: "Backtrack: try [2,3]. Sum = 5, need 2 more.",
      pseudoStep: "current.pop() (backtrack)",
      lineExecution: "current.pop(); // after exploring [2,2,3], try different path"
    },
    {
      candidates,
      target,
      current: [2, 3, 2],
      sum: 7,
      start: 0,
      allCombinations: [[2, 2, 3]],
      variables: { sum: 7 },
      explanation: "Add another 2. Sum = 7! But this is duplicate of [2,2,3] in different order.",
      pseudoStep: "IF sum == target  →  YES",
      lineExecution: "if (sum === target) // 7 === 7 -> true"
    },
    {
      candidates,
      target,
      current: [2, 6],
      sum: 8,
      start: 2,
      allCombinations: [[2, 2, 3]],
      variables: { sum: 8, target: 7 },
      explanation: "Try [2,6]. Sum = 8 exceeds target 7. Prune this branch.",
      pseudoStep: "IF sum > target  →  YES (prune)",
      lineExecution: "if (sum > target) return; // 8 > 7 -> prune"
    },
    {
      candidates,
      target,
      current: [3],
      sum: 3,
      start: 1,
      allCombinations: [[2, 2, 3]],
      variables: { current: '[3]', sum: 3 },
      explanation: "Backtrack to root. Try starting with 3. Sum = 3, need 4 more.",
      pseudoStep: "current.push(3)",
      lineExecution: "current.push(candidates[1]); // current = [3]"
    },
    {
      candidates,
      target,
      current: [3, 3],
      sum: 6,
      start: 1,
      allCombinations: [[2, 2, 3]],
      variables: { sum: 6 },
      explanation: "Add another 3. Sum = 6, need 1 more.",
      pseudoStep: "CALL backtrack(start=1, current=[3], sum=3)",
      lineExecution: "backtrack(i, current, sum + candidates[i]); // sum = 6"
    },
    {
      candidates,
      target,
      current: [3, 3, 3],
      sum: 9,
      start: 1,
      allCombinations: [[2, 2, 3]],
      variables: { sum: 9, target: 7 },
      explanation: "Add third 3. Sum = 9 exceeds target. Prune this branch.",
      pseudoStep: "IF sum > target  →  YES (prune)",
      lineExecution: "if (sum > target) return; // 9 > 7 -> prune"
    },
    {
      candidates,
      target,
      current: [7],
      sum: 7,
      start: 3,
      allCombinations: [[2, 2, 3]],
      variables: { sum: 7, target: 7 },
      explanation: "Try starting with 7. Sum = 7 equals target immediately!",
      pseudoStep: "IF sum == target  →  YES",
      lineExecution: "if (sum === target) // 7 === 7 -> true"
    },
    {
      candidates,
      target,
      current: [7],
      sum: 7,
      start: 3,
      allCombinations: [[2, 2, 3], [7]],
      variables: { result: '[[2,2,3],[7]]' },
      explanation: "Add [7] to result. Found second valid combination.",
      pseudoStep: "result.push([7])",
      lineExecution: "result.push([...current]); // result = [[2,2,3],[7]]"
    },
    {
      candidates,
      target,
      current: [],
      sum: 0,
      start: 4,
      allCombinations: [[2, 2, 3], [7]],
      variables: { result: '[[2,2,3],[7]]' },
      explanation: "Explored all candidates. Return result with 2 unique combinations.",
      pseudoStep: "RETURN result",
      lineExecution: "return result; // [[2,2,3],[7]]"
    },
    {
      candidates,
      target,
      current: [],
      sum: 0,
      start: 0,
      allCombinations: [[2, 2, 3], [7]],
      variables: { combinations: 2, complexity: 'O(N^(T/M))' },
      explanation: "Algorithm complete! Found 2 combinations. Time: O(N^(T/M)) where N=candidates, T=target, M=min candidate.",
      pseudoStep: "RETURN result",
      lineExecution: "Result: [[2,2,3],[7]]"
    }
  ];

  const step = steps[currentStep];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), []);

  return (
    <VisualizationLayout
      controls={
        <SimpleStepControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onStepChange={setCurrentStep}
        />
      }
      leftContent={
        <div className="space-y-6">
          <motion.div
            key={`viz-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Combination Sum</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Candidates: {JSON.stringify(step.candidates)}</div>
                  <div className="text-xs text-muted-foreground mb-2">Target: {step.target}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold mb-2">Current Combination (sum={step.sum}):</div>
                  <div className="flex gap-2 flex-wrap">
                    {step.current.length === 0 ? (
                      <div className="px-3 py-1 rounded bg-muted text-sm">[]</div>
                    ) : (
                      step.current.map((num, idx) => (
                        <div key={idx} className="px-3 py-2 rounded bg-primary text-primary-foreground font-mono text-sm">
                          {num}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold mb-2">Valid Combinations Found:</div>
                  <div className="space-y-1">
                    {step.allCombinations.length === 0 ? (
                      <div className="text-xs text-muted-foreground">None yet</div>
                    ) : (
                      step.allCombinations.map((combo, idx) => (
                        <div key={idx} className="p-2 rounded bg-green-500/10 text-xs font-mono">
                          {JSON.stringify(combo)}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`execution-${currentStep}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="p-4 bg-muted/50">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-primary">Current Execution:</div>
                <div className="text-sm font-mono bg-background/50 p-2 rounded">
                  {step.lineExecution}
                </div>
                <div className="text-sm text-muted-foreground pt-2">
                  {step.explanation}
                </div>
              </div>
            </Card>
          </motion.div>

        </div>
      }
      rightContent={
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStep}
            onLanguageChange={() => setCurrentStep(0)}
          />
          <VariablePanel variables={step.variables} />
        </div>
      }
    />
  );
};
