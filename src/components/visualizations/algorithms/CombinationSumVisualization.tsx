import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';

interface Step {
  candidates: number[];
  target: number;
  current: number[];
  sum: number;
  start: number;
  allCombinations: number[][];
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

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
      highlightedLines: [1, 2, 3],
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
      highlightedLines: [4],
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
      highlightedLines: [6],
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
      highlightedLines: [14, 15],
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
      highlightedLines: [15, 16],
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
      highlightedLines: [7],
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
      highlightedLines: [8, 9],
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
      highlightedLines: [17],
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
      highlightedLines: [7],
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
      highlightedLines: [11],
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
      highlightedLines: [14, 15],
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
      highlightedLines: [15, 16],
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
      highlightedLines: [11],
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
      highlightedLines: [7],
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
      highlightedLines: [8, 9],
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
      highlightedLines: [21],
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
      highlightedLines: [21],
      lineExecution: "Result: [[2,2,3],[7]]"
    }
  ];

  const code = `function combinationSum(
  candidates: number[], 
  target: number
): number[][] {
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
}`;

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <>
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

          <motion.div
            key={`variables-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <VariablePanel variables={step.variables} />
          </motion.div>
        </>
      }
      rightContent={
        <AnimatedCodeEditor
          code={code}
          language="typescript"
          highlightedLines={step.highlightedLines}
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
