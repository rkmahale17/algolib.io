import React, { useState, useMemo } from 'react';
import { Info } from 'lucide-react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Card } from '@/components/ui/card';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  dp: number[];
  currentNumIdx: number;
  currentVal: number | null;
  nextDp: number[];
  target: number;
  totalSum: number;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function canPartition(nums: number[]): boolean {
  const totalSum = nums.reduce((a, b) => a + b, 0);
  if (totalSum % 2 !== 0) return false;
  const target = totalSum / 2;
  let reachableSums = new Set<number>();
  reachableSums.add(0);
  for (const num of nums) {
    const newReachableSums = new Set<number>();
    for (const currentSum of reachableSums) {
      newReachableSums.add(currentSum);
      const sumIncludingNum = currentSum + num;
      if (sumIncludingNum === target) {
        return true;
      }
      if (sumIncludingNum < target) {
        newReachableSums.add(sumIncludingNum);
      }
    }
    reachableSums = newReachableSums;
  }
  return reachableSums.has(target);
}`,

  python: `def canPartition(nums: list[int]) -> bool:
    total = sum(nums)
    if total % 2 != 0:
        return False
    target = total // 2
    dp = {0}
    for num in nums:
        next_dp = set()
        for t in dp:
            next_dp.add(t)
            current_sum_with_num = t + num
            if current_sum_with_num == target:
                return True
            if current_sum_with_num < target:
                next_dp.add(current_sum_with_num)
        dp = next_dp
    return target in dp`,

  java: `public static class Solution {
    public boolean canPartition(int[] nums) {
        int totalSum = 0;
        for (int num : nums) {
            totalSum += num;
        }
        if (totalSum % 2 != 0) {
            return false;
        }
        int target = totalSum / 2;
        Set<Integer> reachableSums = new HashSet<>();
        reachableSums.add(0); 
        for (int num : nums) {
            Set<Integer> newReachableSums = new HashSet<>();
            for (int currentSum : reachableSums) {
                newReachableSums.add(currentSum);
                int sumIncludingNum = currentSum + num;
                if (sumIncludingNum == target) {
                    return true;
                }
                if (sumIncludingNum < target) {
                    newReachableSums.add(sumIncludingNum);
                }
            }
            reachableSums = newReachableSums;
        }
        return reachableSums.contains(target);
    }
}`,

  cpp: `class Solution {
public:
    bool canPartition(vector<int>& nums) {
        int totalSum = 0;
        for (int num : nums) {
            totalSum += num;
        }
        if (totalSum % 2 != 0) {
            return false;
        }
        int target = totalSum / 2;
        vector<bool> dp(target + 1, false);
        dp[0] = true;
        for (int num : nums) {
            for (int j = target; j >= num; --j) {
                dp[j] = dp[j] || dp[j - num];
            }
        }
        return dp[target];
    }
};`
};

export const PartitionEqualSubsetVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const nums = useMemo(() => [3, 2, 2, 4, 5], []);
  const total = 16;
  const target = 8;

  const { steps, stepLineNumbers } = useMemo(() => {
    const stepsList: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };

    const addLines = (ts: number, py: number, java: number, cpp: number) => {
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(java);
      lines.cpp!.push(cpp);
    };

    let dp = new Set<number>();
    dp.add(0);

    stepsList.push({
      dp: Array.from(dp),
      currentNumIdx: -1,
      currentVal: null,
      nextDp: [],
      target,
      totalSum: total,
      explanation: 'Sum of nums: 3+2+2+4+5 = 16. Target subset sum is 16 / 2 = 8.',
      pseudoStep: `canPartition(target=${target})`,
    });
    addLines(2, 2, 3, 4);

    stepsList.push({
      dp: Array.from(dp),
      currentNumIdx: -1,
      currentVal: null,
      nextDp: [],
      target,
      totalSum: total,
      explanation: 'Initialize reachable sums Set (dp) with 0. A sum of 0 is always possible by taking no items.',
      pseudoStep: 'SET dp = {0}',
    });
    addLines(5, 5, 11, 12);

    for (let i = 0; i < nums.length; i++) {
      const num = nums[i];
      const nextDP = new Set<number>();

      stepsList.push({
        dp: Array.from(dp),
        currentNumIdx: i,
        currentVal: num,
        nextDp: [],
        target,
        totalSum: total,
        explanation: `Examine num = ${num} at index ${i}. Create nextDP Set to accumulate new sums.`,
        pseudoStep: `FOR num IN nums  →  num = ${num}`,
      });
      addLines(7, 6, 13, 14);

      let foundTarget = false;
      for (const t of dp) {
        nextDP.add(t);
        const sumWithNum = t + num;
        
        if (sumWithNum === target) {
          foundTarget = true;
          nextDP.add(sumWithNum);
          stepsList.push({
            dp: Array.from(dp),
            currentNumIdx: i,
            currentVal: num,
            nextDp: Array.from(nextDP),
            target,
            totalSum: total,
            explanation: `Add current number ${num} to sum ${t} -> ${sumWithNum}. This matches our target ${target}!`,
            pseudoStep: `IF ${t} + ${num} == ${target}  →  True`,
          });
          addLines(12, 11, 18, 16);
          break;
        } else {
          if (sumWithNum < target) {
            nextDP.add(sumWithNum);
          }
          stepsList.push({
            dp: Array.from(dp),
            currentNumIdx: i,
            currentVal: num,
            nextDp: Array.from(nextDP),
            target,
            totalSum: total,
            explanation: `Add ${num} to sum ${t} -> ${sumWithNum}. Add to nextDP if it's less than target (${target}).`,
            pseudoStep: `IF ${t} + ${num} < ${target}  →  ${sumWithNum} < ${target}`,
          });
          addLines(15, 13, 21, 16);
        }
      }

      dp = nextDP;
      if (foundTarget) {
        break;
      }

      stepsList.push({
        dp: Array.from(dp),
        currentNumIdx: i,
        currentVal: num,
        nextDp: [],
        target,
        totalSum: total,
        explanation: `Update dp Set with nextDP values: {${Array.from(dp).join(', ')}}.`,
        pseudoStep: 'SET dp = nextDP',
      });
      addLines(19, 15, 25, 17);
    }

    if (dp.has(target)) {
      stepsList.push({
        dp: Array.from(dp),
        currentNumIdx: -1,
        currentVal: null,
        nextDp: [],
        target,
        totalSum: total,
        explanation: `Subset partition target ${target} found! Return true.`,
        pseudoStep: 'RETURN True',
      });
      addLines(21, 16, 28, 19);
    } else {
      stepsList.push({
        dp: Array.from(dp),
        currentNumIdx: -1,
        currentVal: null,
        nextDp: [],
        target,
        totalSum: total,
        explanation: `Target subset sum ${target} was not reachable. Return false.`,
        pseudoStep: 'RETURN False',
      });
      addLines(21, 16, 28, 19);
    }

    return { steps: stepsList, stepLineNumbers: lines };
  }, [nums, total, target]);

  const step = steps[currentStepIndex];
  const pseudoSteps = useMemo(() => steps.map((s) => s.pseudoStep), [steps]);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="bg-card rounded-xl p-6 border border-border/50 shadow-sm space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Input Numbers
              </h4>
              <div className="flex gap-2 justify-center">
                {nums.map((num, idx) => {
                  const isCurrent = idx === step.currentNumIdx;
                  return (
                    <div
                      key={idx}
                      className={`w-12 h-12 rounded-lg border-2 flex flex-col items-center justify-center font-mono transition-all duration-300 ${
                        isCurrent
                          ? 'border-orange-500 bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold scale-105 shadow-md ring-4 ring-orange-500/10'
                          : 'border-border bg-muted/20 text-foreground'
                      }`}
                    >
                      <span className="text-sm font-semibold">{num}</span>
                      <span className="text-[9px] opacity-60">i={idx}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border/40 pt-4">
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Current reachable sums (dp)
                </h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {step.dp.map((sum) => (
                    <div
                      key={sum}
                      className={`w-10 h-10 rounded-full border flex items-center justify-center font-mono text-xs font-semibold transition-all duration-300 ${
                        sum === step.target
                          ? 'border-green-500 bg-green-500/20 text-green-600 dark:text-green-400 shadow-md font-bold'
                          : 'border-border bg-muted/40 text-foreground/80'
                      }`}
                    >
                      {sum}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Updated sums (nextDp)
                </h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {step.nextDp.length > 0 ? (
                    step.nextDp.map((sum) => (
                      <div
                        key={sum}
                        className={`w-10 h-10 rounded-full border border-dashed flex items-center justify-center font-mono text-xs font-semibold transition-all duration-300 ${
                          sum === step.target
                            ? 'border-green-500 bg-green-500/20 text-green-600 dark:text-green-400 shadow-md font-bold'
                            : 'border-blue-500/40 bg-blue-500/5 text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        {sum}
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground italic mt-2">-</span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-primary/5 border border-primary/20">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Algorithm Logic</h4>
            <p className="text-sm text-foreground leading-relaxed font-medium">{step.explanation}</p>
          </Card>

          <VariablePanel
            variables={{
              i: step.currentNumIdx !== -1 ? step.currentNumIdx : '-',
              num: step.currentVal !== null ? step.currentVal : '-',
              target: step.target,
              total_sum: step.totalSum
            }}
          />
        </div>
      }
      rightContent={
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={() => setCurrentStepIndex(0)}
        />
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

export default PartitionEqualSubsetVisualization;
