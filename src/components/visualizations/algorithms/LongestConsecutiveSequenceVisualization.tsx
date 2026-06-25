import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';
import { Info } from 'lucide-react';

interface Step {
  nums: number[];
  numSet: number[];
  currentNum: number | null;
  checking: number | null;
  longestStreak: number;
  currentStreak: number;
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function longestConsecutive(nums: number[]): number {
  if (nums.length === 0) return 0;
  const numSet = new Set(nums);
  let longest = 0;
  for (const num of nums) {
    if (!numSet.has(num - 1)) {
      let currentNum = num;
      let currentStreak = 1;
      while (numSet.has(currentNum + 1)) {
        currentNum++;
        currentStreak++;
      }
      longest = Math.max(longest, currentStreak);
    }
  }
  return longest;
}`,

  python: `def longestConsecutive(nums: list[int]) -> int:
    if not nums:
        return 0
    numSet = set(nums)
    longest = 0
    for num in nums:
        if (num - 1) not in numSet:
            currentNum = num
            currentStreak = 1
            while (currentNum + 1) in numSet:
                currentNum += 1
                currentStreak += 1
            longest = max(longest, currentStreak)
    return longest`,

  java: `public static class Solution {
    public int longestConsecutive(int[] nums) {
        if (nums == null || nums.length == 0) return 0;
        Set<Integer> numSet = new HashSet<>();
        for (int num : nums) {
            numSet.add(num);
        }
        int longest = 0;
        for (int num : nums) {
            if (!numSet.contains(num - 1)) {
                int currentNum = num;
                int currentStreak = 1;
                while (numSet.contains(currentNum + 1)) {
                    currentNum++;
                    currentStreak++;
                }
                longest = Math.max(longest, currentStreak);
            }
        }
        return longest;
    }
}`,

  cpp: `class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        unordered_set<int> numSet(nums.begin(), nums.end());
        int longest = 0;
        for (int num : nums) {
            if (!numSet.count(num - 1)) {
                int currentNum = num;
                int currentStreak = 1;
                while (numSet.count(currentNum + 1)) {
                    currentNum++;
                    currentStreak++;
                }
                longest = max(longest, currentStreak);
            }
        }
        return longest;
    }
};`
};

export const LongestConsecutiveSequenceVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const nums = useMemo(() => [100, 4, 200, 1, 3, 2], []);

  const { steps, stepLineNumbers } = useMemo(() => {
    const stepsList: Step[] = [];
    const stepLines: StepLineNumberMap = {
      typescript: [],
      python: [],
      java: [],
      cpp: []
    };

    const addLines = (ts: number, py: number, java: number, cpp: number) => {
      stepLines.typescript!.push(ts);
      stepLines.python!.push(py);
      stepLines.java!.push(java);
      stepLines.cpp!.push(cpp);
    };

    let longestStreak = 0;
    const numSet = Array.from(new Set(nums)).sort((a, b) => a - b);
    const setObj = new Set(nums);

    const makeSnapshot = (
      msg: string, 
      pseudo: string, 
      ts: number, 
      py: number, 
      java: number, 
      cpp: number, 
      currentNum: number | null, 
      checking: number | null, 
      currentStreak: number,
      vars: Record<string, any>
    ) => {
      stepsList.push({
        nums,
        numSet: ts >= 3 ? numSet : [],
        currentNum,
        checking,
        longestStreak,
        currentStreak,
        variables: {
          ...vars,
          longest: longestStreak,
          streak: currentStreak
        },
        explanation: msg,
        pseudoStep: pseudo
      });
      addLines(ts, py, java, cpp);
    };

    // Step 1: Start
    makeSnapshot(
      "Find the length of the longest consecutive elements sequence in the unsorted array.",
      "START longestConsecutive(nums)",
      1, 1, 2, 3, null, null, 0, {}
    );

    // Step 2: Check empty
    makeSnapshot(
      "Check if input array is empty.",
      "IF nums is empty → NO ✗",
      2, 2, 3, 4, null, null, 0, {}
    );

    // Step 3: Create set
    makeSnapshot(
      "Insert all numbers into a HashSet to allow O(1) time complexity lookups.",
      "SET numSet = Set(nums)",
      3, 3, 4, 5, null, null, 0, { numSet: `{${numSet.join(',')}}` }
    );

    // Step 4: Initialize longest
    makeSnapshot(
      "Initialize longest streak counter to 0.",
      "SET longest = 0",
      4, 4, 10, 6, null, null, 0, {}
    );

    // Loop elements
    for (const num of nums) {
      makeSnapshot(
        `Iterate array: check element ${num}.`,
        `FOR num = ${num}`,
        5, 5, 11, 7, num, null, 0, {}
      );

      const hasPrev = setObj.has(num - 1);
      makeSnapshot(
        `Check if ${num} is the start of a consecutive sequence (i.e. ${num - 1} is NOT in set).`,
        `IF num - 1 NOT in numSet → ${num - 1} not in set? → ${!hasPrev ? "YES ✓" : "NO ✗"}`,
        6, 6, 12, 8, num, num - 1, 0, {}
      );

      if (!hasPrev) {
        let currentNum = num;
        let currentStreak = 1;

        makeSnapshot(
          `Since ${num - 1} is not in the set, ${num} is the start of a sequence. Initialize current sequence state.`,
          `SET currentNum = ${num}, currentStreak = 1`,
          7, 7, 13, 9, num, null, currentStreak, { currentNum }
        );

        while (setObj.has(currentNum + 1)) {
          const nextVal = currentNum + 1;
          makeSnapshot(
            `Check if next consecutive value ${nextVal} exists in set.`,
            `IF currentNum + 1 in numSet → ${nextVal} in set? → YES ✓`,
            9, 10, 15, 11, num, nextVal, currentStreak, { currentNum }
          );

          currentNum++;
          currentStreak++;

          makeSnapshot(
            `Found ${currentNum}. Increment currentNum to ${currentNum} and currentStreak to ${currentStreak}.`,
            `SET currentNum = ${currentNum}, currentStreak = ${currentStreak}`,
            10, 11, 15, 12, num, null, currentStreak, { currentNum }
          );
        }

        const nextVal = currentNum + 1;
        makeSnapshot(
          `Check if next consecutive value ${nextVal} exists in set.`,
          `IF currentNum + 1 in numSet → ${nextVal} in set? → NO ✗`,
          9, 10, 15, 11, num, nextVal, currentStreak, { currentNum }
        );

        const oldLongest = longestStreak;
        longestStreak = Math.max(longestStreak, currentStreak);
        makeSnapshot(
          `Update longest streak: max(${oldLongest}, ${currentStreak}) = ${longestStreak}.`,
          `SET longest = max(longest, currentStreak) → ${longestStreak}`,
          13, 13, 18, 14, num, null, currentStreak, { currentNum }
        );
      } else {
        makeSnapshot(
          `Since ${num - 1} exists in the set, ${num} cannot be the start of a consecutive sequence (it is processed in a larger sequence). Skip.`,
          `Skip ${num}`,
          6, 6, 12, 8, num, null, 0, {}
        );
      }
    }

    makeSnapshot(
      `Finished checking all numbers. Return the longest consecutive sequence length: ${longestStreak}.`,
      `RETURN longest → ${longestStreak}`,
      16, 15, 22, 17, null, null, 0, {}
    );

    return { steps: stepsList, stepLineNumbers: stepLines };
  }, [nums]);

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  const step = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-sm overflow-hidden relative">
            <h3 className="text-sm font-semibold mb-4 text-center text-foreground font-sans">
              Array Elements & Visited States
            </h3>
            <div className="flex gap-2.5 flex-wrap justify-center py-4">
              {nums.map((num, idx) => {
                const isCurrent = num === step.currentNum;
                const isChecking = num === step.checking;
                return (
                  <div
                    key={idx}
                    className={`w-12 h-12 rounded-lg flex items-center justify-center font-mono text-sm border-2 transition-all duration-300 ${
                      isCurrent ? "border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold scale-105" :
                      isChecking ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold scale-105" :
                      "border-border bg-muted/20 text-muted-foreground"
                    }`}
                  >
                    {num}
                  </div>
                );
              })}
            </div>
          </Card>

          {step.numSet.length > 0 && (
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50 shadow-sm overflow-hidden relative animate-in fade-in duration-300">
              <h3 className="text-sm font-semibold mb-4 text-center text-foreground font-sans">
                Number HashSet (O(1) lookups)
              </h3>
              <div className="flex gap-2.5 flex-wrap justify-center py-2">
                {step.numSet.map((num, idx) => {
                  const isCurrent = num === step.currentNum;
                  const isChecking = num === step.checking;
                  return (
                    <div
                      key={idx}
                      className={`w-12 h-12 rounded-lg flex items-center justify-center font-mono text-sm border-2 transition-all duration-300 ${
                        isCurrent ? "border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold scale-105" :
                        isChecking ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold scale-105" :
                        "border-border bg-secondary/50 text-foreground/80"
                      }`}
                    >
                      {num}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Commentary Panel */}
          <Card className="p-6 bg-card border-border/50 shadow-sm relative overflow-hidden transition-all duration-300">
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
                    {step.explanation}
                  </div>
                </div>
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
          activeStepIndex={currentStepIndex}
          onLanguageChange={handleReset}
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
