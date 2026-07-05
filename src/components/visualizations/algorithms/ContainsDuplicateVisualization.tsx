import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  nums: number[];
  highlights: number[];
  seen: Set<number>;
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function containsDuplicate(nums: number[]): boolean {
    const seen = new Set<number>();
    for (const num of nums) {
        if (seen.has(num)) {
            return true;
        }
        seen.add(num);
    }
    return false;
}`,

  python: `def containsDuplicate(nums: List[int]) -> bool:
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False`,

  java: `public static class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int num : nums) {
            if (seen.contains(num)) {
                return true;
            }
            seen.add(num);
        }
        return false;
    }
}`,

  cpp: `class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        unordered_set<int> seen;
        for (int num : nums) {
            if (seen.count(num)) {
                return true;
            }
            seen.insert(num);
        }
        return false;
    }
};`,
};

function generateVisualizationData() {
  const nums = [1, 2, 3, 1];
  const steps: Step[] = [];
  const seen = new Set<number>();

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

  // 1. Initial State
  steps.push({
    nums,
    highlights: [],
    seen: new Set(seen),
    variables: { nums: `[${nums.join(', ')}]`, seen: '{}' },
    explanation: "Given an array of integers, check if any value appears at least twice.",
    pseudoStep: "CALL containsDuplicate(nums)"
  });
  addLines(1, 1, 2, 3);

  // 2. Initialize Set
  steps.push({
    nums,
    highlights: [],
    seen: new Set(seen),
    variables: { nums: `[${nums.join(', ')}]`, seen: '{}' },
    explanation: "Initialize an empty set to keep track of the numbers we have seen so far.",
    pseudoStep: "SET seen = {} (empty set)"
  });
  addLines(2, 2, 3, 4);

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];

    // Loop header
    steps.push({
      nums,
      highlights: [i],
      seen: new Set(seen),
      variables: { i, num, seen: `{${Array.from(seen).join(', ')}}` },
      explanation: `Examine the next number in the array: ${num} at index ${i}.`,
      pseudoStep: `FOR num = ${num} in nums`
    });
    addLines(3, 3, 4, 5);

    const isDuplicate = seen.has(num);

    // Check condition
    steps.push({
      nums,
      highlights: [i],
      seen: new Set(seen),
      variables: { i, num, seen: `{${Array.from(seen).join(', ')}}`, "seen.has(num)": isDuplicate },
      explanation: `Check if ${num} is already present in our 'seen' set.`,
      pseudoStep: `IF num (${num}) IN seen  →  ${isDuplicate ? 'YES ✓' : 'NO ✗'}`
    });
    addLines(4, 4, 5, 6);

    if (isDuplicate) {
      steps.push({
        nums,
        highlights: [i],
        seen: new Set(seen),
        variables: { i, num, seen: `{${Array.from(seen).join(', ')}}`, result: true },
        explanation: `Found a duplicate! Since ${num} is already in the set, we return true.`,
        pseudoStep: `RETURN true`
      });
      addLines(5, 5, 6, 7);
      return { steps, stepLineNumbers };
    }

    seen.add(num);

    // Add to set
    steps.push({
      nums,
      highlights: [i],
      seen: new Set(seen),
      variables: { i, num, seen: `{${Array.from(seen).join(', ')}}` },
      explanation: `${num} is not a duplicate. Add it to the 'seen' set and continue.`,
      pseudoStep: `CALL seen.add(${num})`
    });
    addLines(7, 6, 8, 9);
  }

  // Return false if no duplicates
  steps.push({
    nums,
    highlights: [],
    seen: new Set(seen),
    variables: { seen: `{${Array.from(seen).join(', ')}}`, result: false },
    explanation: "Finished iterating through the array without finding any duplicates. Return false.",
    pseudoStep: "RETURN false"
  });
  addLines(9, 7, 10, 11);

  return { steps, stepLineNumbers };
}

export const ContainsDuplicateVisualization: React.FC = () => {
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
              Contains Duplicate (Hash Set)
            </h2>
            <Card className="p-8 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative">
              <div className="mb-10">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-6">Input Array</h4>
                <div className="flex gap-3 justify-center">
                  {currentStep.nums.map((num, idx) => {
                    const isCurrent = currentStep.highlights.includes(idx);
                    return (
                      <div key={idx} className="flex flex-col items-center gap-2">
                        <div 
                          className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 font-black transition-colors duration-0 shadow-sm ${
                            isCurrent ? "border-orange-500 bg-orange-100 text-black scale-110 z-10 shadow-lg" :
                            "border-gray-100 bg-white text-black"
                          }`}
                        >
                          <span className="text-xs font-semibold">{num}</span>
                        </div>
                        {isCurrent && <div className="text-[9px] font-black text-orange-700 bg-orange-200 px-1.5 rounded uppercase tracking-tighter">i</div>}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">Seen Set Content</h4>
                <div className="min-h-[60px] p-4 bg-muted/20 border border-dashed border-gray-200 rounded-xl flex flex-wrap gap-2 items-center justify-center">
                  {currentStep.seen.size === 0 ? (
                    <span className="text-xs text-gray-400 italic">Empty Set</span>
                  ) : (
                    Array.from(currentStep.seen).map((val) => (
                      <div key={val} className="px-3 py-1 bg-green-100 border border-green-300 text-green-800 rounded-full font-bold text-sm shadow-sm ring-1 ring-green-500/10">
                        {val}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-auto space-y-4">
            <Card className="p-5 border-l-4 border-primary bg-primary/5 shadow-sm">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-2">
                Commentary
              </h4>
              <p className="text-[14px] font-medium leading-relaxed text-foreground/90 whitespace-pre-wrap">
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
