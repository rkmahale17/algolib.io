import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  array: number[];
  highlights: number[];
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function search(nums: number[], target: number): number {
    let left = 0, right = nums.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] === target) {
            return mid;
        }
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    return -1;
}`,
  python: `def search(nums: List[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1`,
  java: `public static class Solution {
    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) {
                return mid;
            }
            if (nums[left] <= nums[mid]) {
                if (nums[left] <= target && target < nums[mid]) {
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            } else {
                if (nums[mid] < target && target <= nums[right]) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
        }
        return -1;
    }
}`,
  cpp: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        int left = 0, right = nums.size() - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) {
                return mid;
            }
            if (nums[left] <= nums[mid]) {
                if (nums[left] <= target && target < nums[mid]) {
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            } else {
                if (nums[mid] < target && target <= nums[right]) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
        }
        return -1;
    }
};`
};

export const SearchInRotatedSortedArrayVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepLineNumbers, setStepLineNumbers] = useState<StepLineNumberMap>({
    typescript: [],
    python: [],
    java: [],
    cpp: []
  });
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const target = 0;

  useEffect(() => {
    const nums = [4, 5, 6, 7, 0, 1, 2];
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

    // Function entry
    generatedSteps.push({
      array: [...nums],
      highlights: [],
      variables: { left: '-', right: '-', mid: '-', target },
      explanation: `Search for target ${target} in the rotated sorted array using modified binary search.`,
      pseudoStep: "FUNCTION search(nums, target)"
    });
    addLines(1, 1, 2, 3);

    let left = 0;
    let right = nums.length - 1;

    // Pointer Init
    generatedSteps.push({
      array: [...nums],
      highlights: [left, right],
      variables: { left, right, mid: '-', target },
      explanation: `Initialize pointers: left = ${left}, right = ${right}. Search range: [${left}...${right}].`,
      pseudoStep: "SET left = 0, right = nums.length - 1"
    });
    addLines(2, 2, 3, 4);

    while (left <= right) {
      // Loop Check
      generatedSteps.push({
        array: [...nums],
        highlights: [left, right],
        variables: { left, right, mid: '-', target },
        explanation: `Condition left (${left}) <= right (${right}) is True. Continue search loop.`,
        pseudoStep: "WHILE left <= right"
      });
      addLines(3, 3, 4, 5);

      const mid = Math.floor((left + right) / 2);

      // Mid calculation
      generatedSteps.push({
        array: [...nums],
        highlights: [left, mid, right],
        variables: { left, right, mid, target },
        explanation: `Calculate middle index: mid = floor((${left} + ${right}) / 2) = ${mid}. nums[mid] = ${nums[mid]}.`,
        pseudoStep: "SET mid = (left + right) / 2"
      });
      addLines(4, 4, 5, 6);

      // Target Check
      generatedSteps.push({
        array: [...nums],
        highlights: [mid],
        variables: { left, right, mid, target },
        explanation: `Compare nums[mid] (${nums[mid]}) with target (${target}).`,
        pseudoStep: "IF nums[mid] == target"
      });
      addLines(5, 5, 6, 7);

      if (nums[mid] === target) {
        generatedSteps.push({
          array: [...nums],
          highlights: [mid],
          variables: { left, right, mid, target, result: mid },
          explanation: `Target found at index ${mid}! Return ${mid}.`,
          pseudoStep: "RETURN mid"
        });
        addLines(6, 6, 7, 8);
        break;
      }

      // Check which half is sorted
      generatedSteps.push({
        array: [...nums],
        highlights: [left, mid],
        variables: { left, right, mid, target },
        explanation: `Determine which half of the array is sorted. Check if nums[left] (${nums[left]}) <= nums[mid] (${nums[mid]}).`,
        pseudoStep: "IF nums[left] <= nums[mid]"
      });
      addLines(8, 7, 9, 10);

      if (nums[left] <= nums[mid]) {
        // Left half is sorted
        generatedSteps.push({
          array: [...nums],
          highlights: [left, mid],
          variables: { left, right, mid, target },
          explanation: `Left half is sorted. Check if target (${target}) lies in the range [nums[left], nums[mid]).`,
          pseudoStep: "IF nums[left] <= target AND target < nums[mid]"
        });
        addLines(9, 8, 10, 11);

        if (nums[left] <= target && target < nums[mid]) {
          right = mid - 1;
          generatedSteps.push({
            array: [...nums],
            highlights: [left, right],
            variables: { left, right, mid, target },
            explanation: `Target lies in left half. Shrink search space to left side by updating right = mid - 1 = ${right}.`,
            pseudoStep: "SET right = mid - 1"
          });
          addLines(10, 9, 11, 12);
        } else {
          left = mid + 1;
          generatedSteps.push({
            array: [...nums],
            highlights: [left, right],
            variables: { left, right, mid, target },
            explanation: `Target does not lie in left half. Search right side by updating left = mid + 1 = ${left}.`,
            pseudoStep: "SET left = mid + 1"
          });
          addLines(12, 11, 13, 14);
        }
      } else {
        // Right half is sorted
        generatedSteps.push({
          array: [...nums],
          highlights: [mid, right],
          variables: { left, right, mid, target },
          explanation: `Right half is sorted. Check if target (${target}) lies in the range (nums[mid], nums[right]].`,
          pseudoStep: "IF nums[mid] < target AND target <= nums[right]"
        });
        addLines(15, 13, 16, 17);

        if (nums[mid] < target && target <= nums[right]) {
          left = mid + 1;
          generatedSteps.push({
            array: [...nums],
            highlights: [left, right],
            variables: { left, right, mid, target },
            explanation: `Target lies in right half. Search right side by updating left = mid + 1 = ${left}.`,
            pseudoStep: "SET left = mid + 1"
          });
          addLines(16, 14, 17, 18);
        } else {
          right = mid - 1;
          generatedSteps.push({
            array: [...nums],
            highlights: [left, right],
            variables: { left, right, mid, target },
            explanation: `Target does not lie in right half. Search left side by updating right = mid - 1 = ${right}.`,
            pseudoStep: "SET right = mid - 1"
          });
          addLines(18, 16, 19, 20);
        }
      }
    }

    if (left > right) {
      // Loop Terminated
      generatedSteps.push({
        array: [...nums],
        highlights: [],
        variables: { left, right, mid: '-', target },
        explanation: `Condition left (${left}) <= right (${right}) is False. Loop terminated.`,
        pseudoStep: "WHILE left <= right"
      });
      addLines(3, 3, 4, 5);

      // Return -1
      generatedSteps.push({
        array: [...nums],
        highlights: [],
        variables: { left, right, mid: '-', target, result: -1 },
        explanation: `Target ${target} was not found in the array. Return -1.`,
        pseudoStep: "RETURN -1"
      });
      addLines(22, 17, 23, 24);
    }

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
              <h3 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-widest text-center">
                Search in Rotated Sorted Array
              </h3>
              <div className="text-xs font-semibold text-center text-primary bg-primary/10 border border-primary/20 py-1 px-3 rounded-full mx-auto w-fit mb-4">
                Target: {target}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-center text-muted-foreground">Rotated Array (nums)</div>
                  <div className="flex items-center justify-center gap-2 flex-wrap min-h-[80px]">
                    {currentStep.array.map((value, index) => {
                      const l = currentStep.variables.left;
                      const r = currentStep.variables.right;
                      const m = currentStep.variables.mid;

                      const isL = index === l;
                      const isR = index === r;
                      const isM = index === m;

                      return (
                        <div key={index} className="flex flex-col items-center gap-1 relative pt-6">
                          <div className="absolute top-0 flex gap-0.5 text-[9px] font-bold">
                            {isL && <span className="bg-green-500/10 border border-green-500/30 text-green-500 px-1 rounded">L</span>}
                            {isM && <span className="bg-purple-500/10 border border-purple-500/30 text-purple-500 px-1 rounded">M</span>}
                            {isR && <span className="bg-blue-500/10 border border-blue-500/30 text-blue-500 px-1 rounded">R</span>}
                          </div>
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${
                            currentStep.highlights.includes(index)
                              ? 'bg-primary/20 border-primary text-primary scale-110 shadow-lg'
                              : 'bg-muted/50 border-border text-foreground'
                          } ${value === target && currentStep.variables.result !== undefined ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                            {value}
                          </div>
                          <span className="text-[10px] text-muted-foreground">[{index}]</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-auto space-y-4">
            <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Step Explanation</h4>
              <p className="text-sm font-medium leading-relaxed min-h-[40px]">{currentStep.explanation}</p>
            </Card>
            <VariablePanel variables={currentStep.variables} />
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

