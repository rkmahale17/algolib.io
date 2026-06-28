import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  array: number[];
  i: number;
  left: number;
  right: number;
  currentSum: number | '-';
  target: number | '-';
  result: number[][];
  explanation: string;
  pseudoStep: string;
  highlights: number[];
}

const languages: VisualizationLanguageMap = {
  typescript: `function threeSum(nums: number[]): number[][] {
    nums.sort((a, b) => a - b);
    const result: number[][] = [];
    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) {
            continue;
        }
        let left = i + 1, right = nums.length - 1;
        const target = -nums[i];
        while (left < right) {
            const currentSum = nums[left] + nums[right];
            if (currentSum === target) {
                result.push([nums[i], nums[left], nums[right]]);
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                left++;
                right--;
            } else if (currentSum < target) {
                left++;
            } else {
                right--;
            }
        }
    }
    return result;
}`,
  python: `def threeSum(nums: List[int]) -> List[List[int]]:
    nums.sort()
    result = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        left, right = i + 1, len(nums) - 1
        target = -nums[i]
        while left < right:
            current_sum = nums[left] + nums[right]
            if current_sum == target:
                result.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
            elif current_sum < target:
                left += 1
            else:
                right -= 1
    return result`,
  java: `public static class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) {
                continue;
            }
            int left = i + 1, right = nums.length - 1;
            int target = -nums[i];
            while (left < right) {
                int currentSum = nums[left] + nums[right];
                if (currentSum == target) {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++;
                    right--;
                } else if (currentSum < target) {
                    left++;
                } else {
                    right--;
                }
            }
        }
        return result;
    }
}`,
  cpp: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> result;
        for (int i = 0; i < nums.size() - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) {
                continue;
            }
            int left = i + 1, right = nums.size() - 1;
            int target = -nums[i];
            while (left < right) {
                int currentSum = nums[left] + nums[right];
                if (currentSum == target) {
                    result.push_back({nums[i], nums[left], nums[right]});
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++;
                    right--;
                } else if (currentSum < target) {
                    left++;
                } else {
                    right--;
                }
            }
        }
        return result;
    }
};`
};

export const ThreeSumVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepLineNumbers, setStepLineNumbers] = useState<StepLineNumberMap>({
    typescript: [],
    python: [],
    java: [],
    cpp: []
  });
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const nums = [-1, 0, 1, 2, -1, -4];
    const generatedSteps: Step[] = [];
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

    // Initial state / Sort
    generatedSteps.push({
      array: [...nums],
      i: -1,
      left: -1,
      right: -1,
      currentSum: '-',
      target: '-',
      result: [],
      explanation: "Sort the input array to enable the two-pointer strategy and easily skip duplicates.",
      pseudoStep: "SORT nums",
      highlights: []
    });
    addLines(2, 2, 3, 4);

    nums.sort((a, b) => a - b);
    const result: number[][] = [];

    // Result init
    generatedSteps.push({
      array: [...nums],
      i: -1,
      left: -1,
      right: -1,
      currentSum: '-',
      target: '-',
      result: [],
      explanation: "Initialize an empty list to store the unique triplets that sum to 0.",
      pseudoStep: "SET result = []",
      highlights: []
    });
    addLines(3, 3, 4, 5);

    for (let i = 0; i < nums.length - 2; i++) {
      // Loop Check i
      generatedSteps.push({
        array: [...nums],
        i,
        left: -1,
        right: -1,
        currentSum: '-',
        target: '-',
        result: [...result.map(r => [...r])],
        explanation: `Outer loop: Fix first element at index i = ${i} (value = ${nums[i]}).`,
        pseudoStep: `FOR i = ${i} to ${nums.length - 3}`,
        highlights: [i]
      });
      addLines(4, 4, 5, 6);

      if (i > 0 && nums[i] === nums[i - 1]) {
        generatedSteps.push({
          array: [...nums],
          i,
          left: -1,
          right: -1,
          currentSum: '-',
          target: '-',
          result: [...result.map(r => [...r])],
          explanation: `Duplicate starting element detected (nums[i] === nums[i - 1] === ${nums[i]}). Skip to avoid duplicates.`,
          pseudoStep: `IF i > 0 AND nums[i] == nums[i - 1]`,
          highlights: [i, i - 1]
        });
        addLines(5, 5, 6, 7);
        continue;
      }

      let left = i + 1;
      let right = nums.length - 1;
      let targetVal = -nums[i];

      // Pointer Init
      generatedSteps.push({
        array: [...nums],
        i,
        left,
        right,
        currentSum: '-',
        target: targetVal,
        result: [...result.map(r => [...r])],
        explanation: `Initialize two pointers: left = ${left} (index after i), right = ${right} (end of array).`,
        pseudoStep: `SET left = i + 1, right = nums.length - 1`,
        highlights: [i, left, right]
      });
      addLines(8, 7, 9, 10);

      // Target Init
      generatedSteps.push({
        array: [...nums],
        i,
        left,
        right,
        currentSum: '-',
        target: targetVal,
        result: [...result.map(r => [...r])],
        explanation: `Target sum for the two pointers is negative of the fixed element: target = -(${nums[i]}) = ${targetVal}.`,
        pseudoStep: `SET target = -nums[i]`,
        highlights: [i]
      });
      addLines(9, 8, 10, 11);

      while (left < right) {
        // Inner Loop Check
        generatedSteps.push({
          array: [...nums],
          i,
          left,
          right,
          currentSum: '-',
          target: targetVal,
          result: [...result.map(r => [...r])],
          explanation: `Inner loop check: left (${left}) < right (${right}). Continue searching.`,
          pseudoStep: "WHILE left < right",
          highlights: [left, right]
        });
        addLines(10, 9, 11, 12);

        const currentSum = nums[left] + nums[right];

        // Sum Calculation
        generatedSteps.push({
          array: [...nums],
          i,
          left,
          right,
          currentSum,
          target: targetVal,
          result: [...result.map(r => [...r])],
          explanation: `Calculate sum of the elements at left and right pointers: nums[left] (${nums[left]}) + nums[right] (${nums[right]}) = ${currentSum}.`,
          pseudoStep: "SET currentSum = nums[left] + nums[right]",
          highlights: [left, right]
        });
        addLines(11, 10, 12, 13);

        // Compare Sum with Target
        generatedSteps.push({
          array: [...nums],
          i,
          left,
          right,
          currentSum,
          target: targetVal,
          result: [...result.map(r => [...r])],
          explanation: `Compare currentSum (${currentSum}) with target (${targetVal}).`,
          pseudoStep: "IF currentSum == target",
          highlights: [left, right]
        });
        addLines(12, 11, 13, 14);

        if (currentSum === targetVal) {
          result.push([nums[i], nums[left], nums[right]]);

          generatedSteps.push({
            array: [...nums],
            i,
            left,
            right,
            currentSum,
            target: targetVal,
            result: [...result.map(r => [...r])],
            explanation: `Found triplet: [${nums[i]}, ${nums[left]}, ${nums[right]}]. Add to results.`,
            pseudoStep: `result.push([nums[i], nums[left], nums[right]])`,
            highlights: [i, left, right]
          });
          addLines(13, 12, 14, 15);

          // Skip Duplicate Left
          if (left < right && nums[left] === nums[left + 1]) {
            generatedSteps.push({
              array: [...nums],
              i,
              left,
              right,
              currentSum,
              target: targetVal,
              result: [...result.map(r => [...r])],
              explanation: `Duplicate left value detected: nums[left] === nums[left+1] === ${nums[left]}. Skip duplicate lefts.`,
              pseudoStep: "WHILE left < right AND nums[left] == nums[left + 1]",
              highlights: [left, left + 1]
            });
            addLines(14, 13, 15, 16);
            while (left < right && nums[left] === nums[left + 1]) left++;
          }

          // Skip Duplicate Right
          if (left < right && nums[right] === nums[right - 1]) {
            generatedSteps.push({
              array: [...nums],
              i,
              left,
              right,
              currentSum,
              target: targetVal,
              result: [...result.map(r => [...r])],
              explanation: `Duplicate right value detected: nums[right] === nums[right-1] === ${nums[right]}. Skip duplicate rights.`,
              pseudoStep: "WHILE left < right AND nums[right] == nums[right - 1]",
              highlights: [right, right - 1]
            });
            addLines(15, 15, 16, 17);
            while (left < right && nums[right] === nums[right - 1]) right--;
          }

          left++;
          right--;
          generatedSteps.push({
            array: [...nums],
            i,
            left,
            right,
            currentSum: '-',
            target: targetVal,
            result: [...result.map(r => [...r])],
            explanation: `Move left and right pointers inward to find new unique pairs.`,
            pseudoStep: "SET left = left + 1, right = right - 1",
            highlights: [left, right]
          });
          addLines(16, 17, 17, 18);

        } else if (currentSum < targetVal) {
          generatedSteps.push({
            array: [...nums],
            i,
            left,
            right,
            currentSum,
            target: targetVal,
            result: [...result.map(r => [...r])],
            explanation: `Since currentSum (${currentSum}) < target (${targetVal}), we need a larger sum. Move left pointer right.`,
            pseudoStep: "ELSE IF currentSum < target",
            highlights: [left]
          });
          addLines(18, 19, 19, 20);

          left++;
          generatedSteps.push({
            array: [...nums],
            i,
            left,
            right,
            currentSum: '-',
            target: targetVal,
            result: [...result.map(r => [...r])],
            explanation: `Increment left to ${left}.`,
            pseudoStep: "SET left = left + 1",
            highlights: [left]
          });
          addLines(19, 20, 20, 21);

        } else {
          // currentSum > target
          generatedSteps.push({
            array: [...nums],
            i,
            left,
            right,
            currentSum,
            target: targetVal,
            result: [...result.map(r => [...r])],
            explanation: `Since currentSum (${currentSum}) > target (${targetVal}), we need a smaller sum. Move right pointer left.`,
            pseudoStep: "ELSE right--",
            highlights: [right]
          });
          addLines(18, 19, 19, 20);

          right--;
          generatedSteps.push({
            array: [...nums],
            i,
            left,
            right,
            currentSum: '-',
            target: targetVal,
            result: [...result.map(r => [...r])],
            explanation: `Decrement right to ${right}.`,
            pseudoStep: "SET right = right - 1",
            highlights: [right]
          });
          addLines(21, 22, 22, 23);
        }
      }
    }

    // Done
    generatedSteps.push({
      array: [...nums],
      i: -1,
      left: -1,
      right: -1,
      currentSum: '-',
      target: '-',
      result: [...result.map(r => [...r])],
      explanation: `Algorithm finished. Unique triplets that sum to 0: [${result.map(r => `[${r.join(', ')}]`).join(', ')}].`,
      pseudoStep: "RETURN result",
      highlights: []
    });
    addLines(25, 23, 26, 27);

    setSteps(generatedSteps);
    setStepLineNumbers(stepLines);
  }, []);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      controls={
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
      }
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 mb-4">
              <h3 className="text-xs font-semibold mb-6 text-muted-foreground uppercase tracking-widest text-center">
                3Sum Triplet Finder
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-center text-muted-foreground">Sorted Array</div>
                  <div className="flex items-center justify-center gap-2 flex-wrap min-h-[90px]">
                    {currentStep.array.map((value, index) => {
                      const isI = index === currentStep.i;
                      const isL = index === currentStep.left;
                      const isR = index === currentStep.right;

                      return (
                        <div key={index} className="flex flex-col items-center gap-1 relative pt-6">
                          <div className="absolute top-0 flex gap-0.5 text-[9px] font-bold">
                            {isI && <span className="bg-orange-500/10 border border-orange-500/30 text-orange-500 px-1 rounded">i</span>}
                            {isL && <span className="bg-green-500/10 border border-green-500/30 text-green-500 px-1 rounded">L</span>}
                            {isR && <span className="bg-blue-500/10 border border-blue-500/30 text-blue-500 px-1 rounded">R</span>}
                          </div>
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${
                            currentStep.highlights.includes(index)
                              ? 'bg-primary/20 border-primary text-primary scale-110 shadow-lg'
                              : 'bg-muted/50 border-border text-foreground'
                          } ${isI ? 'border-orange-500 text-orange-500' : ''} ${isL ? 'border-green-500 text-green-500' : ''} ${isR ? 'border-blue-500 text-blue-500' : ''}`}>
                            {value}
                          </div>
                          <span className="text-[10px] text-muted-foreground">[{index}]</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {currentStep.result.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-center text-muted-foreground">Unique Triplets Found</div>
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      {currentStep.result.map((triplet, index) => (
                        <div key={index} className="px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-md font-mono text-xs font-bold text-primary">
                          [{triplet.join(', ')}]
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="mt-auto space-y-4">
            <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Step Explanation</h4>
              <p className="text-sm font-medium leading-relaxed min-h-[40px]">{currentStep.explanation}</p>
            </Card>

            <VariablePanel
              variables={{
                i: currentStep.i === -1 ? '-' : `${currentStep.i} (val: ${currentStep.array[currentStep.i]})`,
                left: currentStep.left === -1 ? '-' : `${currentStep.left} (val: ${currentStep.array[currentStep.left]})`,
                right: currentStep.right === -1 ? '-' : `${currentStep.right} (val: ${currentStep.array[currentStep.right]})`,
                currentSum: currentStep.currentSum,
                target: currentStep.target,
                tripletsFound: currentStep.result.length
              }}
            />
          </div>
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
    />
  );
};
;
