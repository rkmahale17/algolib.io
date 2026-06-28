import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
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
}`,

  python: `def canPartition(nums: list[int]) -> bool:
  total = sum(nums)
  if total % 2 != 0:
    return False
  dp = {0}
  target = total / 2
  for i in range(len(nums) - 1, -1, -1):
    next_dp = set()
    for t in dp:
      if t + nums[i] == target:
        return True
      next_dp.add(t + nums[i])
      next_dp.add(t)
    dp = next_dp
  return target in dp`,

  java: `public static class Solution {
    public boolean canPartition(int[] nums) {
        int total = 0;
        for (int num : nums) {
            total += num;
        }
        if (total % 2 != 0) return false;
        Set<Integer> dp = new HashSet<>();
        dp.add(0);
        int target = total / 2;
        for (int i = nums.length - 1; i >= 0; i--) {
            Set<Integer> nextDP = new HashSet<>();
            for (int t : dp) {
                if (t + nums[i] == target) {
                    return true;
                }
                nextDP.add(t + nums[i]);
                nextDP.add(t);
            }
            dp = nextDP;
        }
        return dp.contains(target);
    }
}`,

  cpp: `class Solution {
public:
    bool canPartition(vector<int>& nums) {
        int total = 0;
        for (int num : nums) {
            total += num;
        }
        if (total % 2 != 0) return false;
        unordered_set<int> dp;
        dp.insert(0);
        int target = total / 2;
        for (int i = nums.size() - 1; i >= 0; i--) {
            unordered_set<int> nextDP;
            for (int t : dp) {
                if (t + nums[i] == target) {
                    return true;
                }
                nextDP.insert(t + nums[i]);
                nextDP.insert(t);
            }
            dp = nextDP;
        }
        return dp.count(target);
    }
};`
};

function generateVisualizationData() {
  const nums = [3, 2, 2, 4, 5];
  const total = 16;
  const target = 8;

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

  let dp = new Set<number>();
  dp.add(0);

  steps.push({
    dp: Array.from(dp),
    currentNumIdx: -1,
    currentVal: null,
    nextDp: [],
    target,
    totalSum: total,
    explanation: 'Sum of nums: 3+2+2+4+5 = 16. Sum is even. Target subset sum is 16 / 2 = 8.',
    pseudoStep: `START canPartition() -> target = ${target}`,
  });
  addLines(2, 2, 3, 4);

  steps.push({
    dp: Array.from(dp),
    currentNumIdx: -1,
    currentVal: null,
    nextDp: [],
    target,
    totalSum: total,
    explanation: 'Initialize reachable sums Set (dp) with 0. A sum of 0 is always possible by taking no items.',
    pseudoStep: 'SET dp = {0}',
  });
  addLines(5, 5, 9, 10);

  for (let i = nums.length - 1; i >= 0; i--) {
    const num = nums[i];
    const nextDP = new Set<number>();

    steps.push({
      dp: Array.from(dp),
      currentNumIdx: i,
      currentVal: num,
      nextDp: [],
      target,
      totalSum: total,
      explanation: `Examine num = ${num} at index ${i}. Create nextDP Set to accumulate new sums.`,
      pseudoStep: `FOR i = ${i} (num = ${num})`,
    });
    addLines(7, 7, 11, 12);

    let foundTarget = false;
    for (const t of dp) {
      const sumWithNum = t + num;
      if (sumWithNum === target) {
        foundTarget = true;
        nextDP.add(sumWithNum);
        nextDP.add(t);
        steps.push({
          dp: Array.from(dp),
          currentNumIdx: i,
          currentVal: num,
          nextDp: Array.from(nextDP),
          target,
          totalSum: total,
          explanation: `Add current number ${num} to sum ${t} -> ${sumWithNum}. This matches our target ${target}!`,
          pseudoStep: `IF ${t} + ${num} == ${target} → YES ✓`,
        });
        addLines(11, 11, 15, 15);
        break;
      } else {
        nextDP.add(sumWithNum);
        nextDP.add(t);
        steps.push({
          dp: Array.from(dp),
          currentNumIdx: i,
          currentVal: num,
          nextDp: Array.from(nextDP),
          target,
          totalSum: total,
          explanation: `Add ${num} to sum ${t} -> ${sumWithNum} (not target). Add both ${sumWithNum} and ${t} to nextDP.`,
          pseudoStep: `ADD ${sumWithNum} and ${t} to nextDP`,
        });
        addLines(13, 12, 17, 18);
      }
    }

    dp = nextDP;
    if (foundTarget) {
      break;
    }

    steps.push({
      dp: Array.from(dp),
      currentNumIdx: i,
      currentVal: num,
      nextDp: [],
      target,
      totalSum: total,
      explanation: `Update dp Set with nextDP values: {${Array.from(dp).join(', ')}}.`,
      pseudoStep: 'SET dp = nextDP',
    });
    addLines(16, 14, 20, 21);
  }

  if (dp.has(target)) {
    steps.push({
      dp: Array.from(dp),
      currentNumIdx: -1,
      currentVal: null,
      nextDp: [],
      target,
      totalSum: total,
      explanation: `LCS subset partition target ${target} found! Return true.`,
      pseudoStep: 'RETURN true',
    });
    addLines(18, 15, 22, 23);
  } else {
    steps.push({
      dp: Array.from(dp),
      currentNumIdx: -1,
      currentVal: null,
      nextDp: [],
      target,
      totalSum: total,
      explanation: `Target subset sum ${target} was not reachable. Return false.`,
      pseudoStep: 'RETURN false',
    });
    addLines(18, 15, 22, 23);
  }

  return { steps, stepLineNumbers };
}

export const PartitionEqualSubsetVisualization: React.FC = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map((s) => s.pseudoStep);
  const numsList = [3, 2, 2, 4, 5];

  return (
    <div className="w-full space-y-6">
      <SimpleStepControls
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        onStepChange={setCurrentStepIndex}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual State */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card rounded-xl p-6 border border-border/50 shadow-sm space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Input Numbers
              </h4>
              <div className="flex gap-2 justify-center">
                {numsList.map((num, idx) => {
                  const isCurrent = idx === currentStep.currentNumIdx;
                  return (
                    <div
                      key={idx}
                      className={`w-12 h-12 rounded-lg border-2 flex flex-col items-center justify-center font-mono transition-all duration-300 ${
                        isCurrent
                          ? 'border-orange-500 bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold scale-105 shadow-md'
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
                  {currentStep.dp.map((sum) => (
                    <div
                      key={sum}
                      className={`w-10 h-10 rounded-full border flex items-center justify-center font-mono text-xs font-semibold transition-all duration-300 ${
                        sum === currentStep.target
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
                  {currentStep.nextDp.length > 0 ? (
                    currentStep.nextDp.map((sum) => (
                      <div
                        key={sum}
                        className={`w-10 h-10 rounded-full border border-dashed flex items-center justify-center font-mono text-xs font-semibold transition-all duration-300 ${
                          sum === currentStep.target
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
          </div>

          {/* Commentary Panel */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 relative overflow-hidden transition-all duration-300 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75 rounded-full" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                    Algorithm Commentary
                  </span>
                </div>
                <div className="font-mono text-[10px] tracking-tight bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full border border-border/40">
                  Step {currentStepIndex + 1} of {steps.length}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Info className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary/70">
                    Current Action
                  </h4>
                  <div className="text-sm font-medium leading-relaxed text-foreground/90 select-none">
                    {currentStep.explanation}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <VariablePanel
            variables={{
              i: currentStep.currentNumIdx !== -1 ? currentStep.currentNumIdx : '-',
              num: currentStep.currentVal !== null ? currentStep.currentVal : '-',
              target: currentStep.target,
              total_sum: currentStep.totalSum
            }}
          />
        </div>

        {/* Right Column: Code Display */}
        <div className="lg:col-span-5">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={handleReset}
          />
        </div>
      </div>
    </div>
  );
};

export default PartitionEqualSubsetVisualization;
