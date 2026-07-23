import { useState } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';
import { Card } from '@/components/ui/card';

interface Step {
  nums: number[];
  i: number | null;
  k: number;
  currentSum: number;
  diff: number | null;
  result: number;
  prefixSums: { sum: number; count: number }[];
  highlightPrefixRange: [number, number] | null; // [start, end] indices in original array
  highlightSubarrayRange: [number, number] | null; // [start, end] indices of valid subarray
  phase: 'init' | 'scan' | 'update_map' | 'result' | 'finished';
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

// ─── Hardcoded code per language ─────────────────────────────────────────────

const languages: VisualizationLanguageMap = {
  typescript: `function subarraySum(nums: number[], k: number): number {
    let result = 0;
    let currentSum = 0;
    const prefixSums = new Map<number, number>();
    prefixSums.set(0, 1);
    for (const num of nums) {
        currentSum += num;
        const diff = currentSum - k;
        result += prefixSums.get(diff) ?? 0;
        prefixSums.set(currentSum, (prefixSums.get(currentSum) ?? 0) + 1);
    }
    return result;
}`,

  python: `def subarraySum(nums: list[int], k: int) -> int:
    result = 0
    current_sum = 0
    prefix_sums = {0: 1}
    for num in nums:
        current_sum += num
        diff = current_sum - k
        result += prefix_sums.get(diff, 0)
        prefix_sums[current_sum] = prefix_sums.get(current_sum, 0) + 1
    return result`,

  java: `public int subarraySum(int[] nums, int k) {
    int result = 0;
    int currentSum = 0;
    Map<Integer, Integer> prefixSums = new HashMap<>();
    prefixSums.put(0, 1);
    for (int num : nums) {
        currentSum += num;
        int diff = currentSum - k;
        result += prefixSums.getOrDefault(diff, 0);
        prefixSums.put(currentSum, prefixSums.getOrDefault(currentSum, 0) + 1);
    }
    return result;
}`,

  cpp: `int subarraySum(vector<int>& nums, int k) {
    int result = 0;
    long long currentSum = 0; 
    unordered_map<long long, int> prefixSums;
    prefixSums[0] = 1; 
    for (int num : nums) {
        currentSum += num;
        long long diff = currentSum - k; 
        if (prefixSums.count(diff)) {
            result += prefixSums[diff];
        }
        prefixSums[currentSum]++;
    }
    return result;
}`,
};

// ─── Step generator ──────────────────────────────────────────────────────────

function generateVisualizationData() {
  const nums = [1, 2, 3, -2, 2];
  const k = 3;
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

  let result = 0;
  let currentSum = 0;
  const activePrefixSums = new Map<number, number>();
  activePrefixSums.set(0, 1);

  // Store history of prefix sums with their indices to reconstruct subarray ranges
  const prefixHistory: { index: number; sum: number }[] = [{ index: -1, sum: 0 }];

  const getPrefixList = () => 
    Array.from(activePrefixSums.entries()).map(([sum, count]) => ({ sum, count }));

  // Step 0: Init
  steps.push({
    nums,
    i: null,
    k,
    currentSum: 0,
    diff: null,
    result: 0,
    prefixSums: getPrefixList(),
    highlightPrefixRange: null,
    highlightSubarrayRange: null,
    phase: 'init',
    variables: { result: 0, currentSum: 0, prefixSums: '{0: 1}', i: '-', diff: '-' },
    explanation: 'Initialize result = 0, currentSum = 0. Set prefixSums[0] = 1 to handle subarrays starting from index 0.',
    pseudoStep: 'SET result = 0, currentSum = 0, prefixSums = {0: 1}'
  });
  addLines(5, 4, 5, 5);

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];

    // Loop Header
    steps.push({
      nums,
      i,
      k,
      currentSum,
      diff: null,
      result,
      prefixSums: getPrefixList(),
      highlightPrefixRange: null,
      highlightSubarrayRange: null,
      phase: 'scan',
      variables: { result, currentSum, prefixSums: JSON.stringify(Object.fromEntries(activePrefixSums)), i, num },
      explanation: `Process element nums[${i}] = ${num}.`,
      pseudoStep: `FOR num = ${num}:`
    });
    addLines(6, 5, 6, 6);

    // Update currentSum
    currentSum += num;
    prefixHistory.push({ index: i, sum: currentSum });

    steps.push({
      nums,
      i,
      k,
      currentSum,
      diff: null,
      result,
      prefixSums: getPrefixList(),
      highlightPrefixRange: null,
      highlightSubarrayRange: null,
      phase: 'scan',
      variables: { result, currentSum, prefixSums: JSON.stringify(Object.fromEntries(activePrefixSums)), i, num },
      explanation: `Add current element to cumulative sum: currentSum becomes ${currentSum}.`,
      pseudoStep: `SET currentSum = currentSum + ${num} → ${currentSum}`
    });
    addLines(7, 6, 7, 7);

    // Compute diff
    const diff = currentSum - k;
    steps.push({
      nums,
      i,
      k,
      currentSum,
      diff,
      result,
      prefixSums: getPrefixList(),
      highlightPrefixRange: null,
      highlightSubarrayRange: null,
      phase: 'scan',
      variables: { result, currentSum, prefixSums: JSON.stringify(Object.fromEntries(activePrefixSums)), i, diff },
      explanation: `Calculate target prefix sum diff = currentSum - k = ${currentSum} - ${k} = ${diff}.`,
      pseudoStep: `SET diff = currentSum - k → ${diff}`
    });
    addLines(8, 7, 8, 8);

    // Check map & update result
    const occurrences = activePrefixSums.get(diff) ?? 0;
    const nextResult = result + occurrences;

    if (occurrences > 0) {
      // Reconstruct ranges to highlight
      // Find historical indices where the sum was equal to 'diff'
      const match = prefixHistory.find(h => h.sum === diff);
      const prevIdx = match ? match.index : -1;

      steps.push({
        nums,
        i,
        k,
        currentSum,
        diff,
        result: nextResult,
        prefixSums: getPrefixList(),
        highlightPrefixRange: prevIdx >= 0 ? [0, prevIdx] : null,
        highlightSubarrayRange: [prevIdx + 1, i],
        phase: 'result',
        variables: { result: nextResult, currentSum, prefixSums: JSON.stringify(Object.fromEntries(activePrefixSums)), i, diff, occurrences },
        explanation: `Found diff (${diff}) in prefixSums with count = ${occurrences}. Add to result. Valid subarray [${prevIdx + 1}...${i}] sums to k = ${k}.`,
        pseudoStep: `SET result = result + prefixSums[${diff}] → ${nextResult}`
      });
      addLines(9, 8, 9, 10);
    } else {
      steps.push({
        nums,
        i,
        k,
        currentSum,
        diff,
        result,
        prefixSums: getPrefixList(),
        highlightPrefixRange: null,
        highlightSubarrayRange: null,
        phase: 'scan',
        variables: { result, currentSum, prefixSums: JSON.stringify(Object.fromEntries(activePrefixSums)), i, diff, occurrences: 0 },
        explanation: `diff (${diff}) is not present in prefixSums. No new subarrays found ending at index ${i}.`,
        pseudoStep: `IF diff (${diff}) in prefixSums → NO ✗`
      });
      addLines(9, 8, 9, 9);
    }

    result = nextResult;

    // Add currentSum to map
    activePrefixSums.set(currentSum, (activePrefixSums.get(currentSum) ?? 0) + 1);
    steps.push({
      nums,
      i,
      k,
      currentSum,
      diff,
      result,
      prefixSums: getPrefixList(),
      highlightPrefixRange: null,
      highlightSubarrayRange: null,
      phase: 'update_map',
      variables: { result, currentSum, prefixSums: JSON.stringify(Object.fromEntries(activePrefixSums)), i },
      explanation: `Add/increment currentSum (${currentSum}) in prefixSums. Map count becomes ${activePrefixSums.get(currentSum)}.`,
      pseudoStep: `SET prefixSums[${currentSum}] = prefixSums[${currentSum}] + 1`
    });
    addLines(10, 9, 10, 12);
  }

  // End return step
  steps.push({
    nums,
    i: null,
    k,
    currentSum,
    diff: null,
    result,
    prefixSums: getPrefixList(),
    highlightPrefixRange: null,
    highlightSubarrayRange: null,
    phase: 'finished',
    variables: { result },
    explanation: `Array fully scanned. Return total count of subarrays = ${result}.`,
    pseudoStep: `RETURN result → ${result}`
  });
  addLines(12, 10, 12, 14);

  return { steps, stepLineNumbers };
}

// ─── Component ───────────────────────────────────────────────────────────────

export const SubarraySumEqualsKVisualization = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 opacity-90">
              Subarray Sum Equals K (Prefix Sum Map)
            </h2>
            
            <Card className="p-6 bg-card/60 backdrop-blur border-border/50 shadow-sm flex flex-col gap-6">
              
              {/* Array State */}
              <div>
                <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-3">Array & prefix sums</h4>
                <div className="flex flex-col gap-6 relative pt-4 pb-2">
                  <div className="flex justify-start gap-4">
                    {currentStep.nums.map((value, idx) => {
                      let borderClass = 'border-border';
                      let bgClass = 'bg-muted/50';
                      let textClass = 'text-foreground';
                      let labelText = '';

                      // Highlight current active element
                      if (currentStep.i === idx) {
                        borderClass = 'border-primary';
                        bgClass = 'bg-primary/10';
                      }

                      // Subarray ranges highlighting
                      const inPrefix = currentStep.highlightPrefixRange && 
                                       idx >= currentStep.highlightPrefixRange[0] && 
                                       idx <= currentStep.highlightPrefixRange[1];
                      
                      const inSubarray = currentStep.highlightSubarrayRange && 
                                         idx >= currentStep.highlightSubarrayRange[0] && 
                                         idx <= currentStep.highlightSubarrayRange[1];

                      if (inPrefix) {
                        bgClass = 'bg-blue-500/20';
                        borderClass = 'border-blue-500/50';
                        labelText = 'diff';
                      } else if (inSubarray) {
                        bgClass = 'bg-emerald-500 border-emerald-500 scale-105 shadow-md';
                        textClass = 'text-white';
                        labelText = 'sum = k';
                      }

                      return (
                        <div key={idx} className="relative flex flex-col items-center">
                          {/* Pointer labels */}
                          {currentStep.i === idx && (
                            <span className="absolute -top-7 text-[9px] font-bold text-primary whitespace-nowrap bg-background px-1 py-0.2 rounded border shadow-sm z-20 animate-pulse">
                              i (num={value})
                            </span>
                          )}

                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 transition-all ${bgClass} ${borderClass}`}>
                            <span className={`font-semibold text-xs ${textClass}`}>{value}</span>
                          </div>

                          {/* Highlight context tags */}
                          {labelText && (
                            <span className={`absolute -bottom-5 text-[8px] font-bold px-1 rounded whitespace-nowrap ${
                              labelText === 'diff' 
                                ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' 
                                : 'bg-emerald-500 text-white animate-pulse'
                            }`}>
                              {labelText}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Prefix Sum Map Trace */}
              <div className="border-t border-border/50 pt-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Prefix Sum Map</h4>
                  <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    target diff: {currentStep.diff !== null ? currentStep.diff : '-'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentStep.prefixSums.map((ps, idx) => {
                    const isDiffMatch = currentStep.diff !== null && ps.sum === currentStep.diff;
                    const isSumAdded = currentStep.phase === 'update_map' && ps.sum === currentStep.currentSum;

                    let bgClass = 'bg-background';
                    let borderClass = 'border-border';

                    if (isDiffMatch) {
                      bgClass = 'bg-blue-500/10 dark:bg-blue-500/20';
                      borderClass = 'border-blue-500 animate-pulse';
                    } else if (isSumAdded) {
                      bgClass = 'bg-primary/10';
                      borderClass = 'border-primary';
                    }

                    return (
                      <div
                        key={idx}
                        className={`flex items-center border rounded-lg overflow-hidden text-xs font-mono shadow-sm transition-all duration-300 ${bgClass} ${borderClass}`}
                      >
                        <div className="px-2.5 py-1 bg-muted border-r border-border/50 text-foreground font-bold">
                          {ps.sum}
                        </div>
                        <div className="px-2 py-1 text-muted-foreground">
                          {ps.count}x
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </Card>
          </div>

          <div className="mt-auto space-y-4">
            <Card className="p-5 border-l-4 border-primary bg-primary/5 shadow-sm">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-2">
                Commentary
              </h4>
              <p className="text-[14px] font-medium leading-relaxed text-foreground/90 whitespace-pre-wrap animate-fade-in">
                {currentStep.explanation}
              </p>
            </Card>
          </div>
        </div>
      }
      rightContent={
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={() => setCurrentStepIndex(0)}
          />
          <VariablePanel variables={currentStep.variables} />
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
