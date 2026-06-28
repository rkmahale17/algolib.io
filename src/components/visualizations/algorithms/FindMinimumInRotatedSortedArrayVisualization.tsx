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
  typescript: `function findMin(nums: number[]): number {
    let left = 0, right = nums.length - 1;
    if (nums.length === 0) return 0;
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] > nums[right]) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    return nums[left];
}`,
  python: `def findMin(nums: List[int]) -> int:
    left, right = 0, len(nums) - 1
    if len(nums) == 0:
        return 0
    while left < right:
        mid = (left + right) // 2
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid
    return nums[left]`,
  java: `public static class Solution {
    public int findMin(int[] nums) {
        int left = 0, right = nums.length - 1;
        if (nums.length == 0) return 0;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] > nums[right]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return nums[left];
    }
}`,
  cpp: `class Solution {
public:
    int findMin(vector<int>& nums) {
        int left = 0, right = nums.size() - 1;
        if (nums.size() == 0) return 0;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] > nums[right]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return nums[left];
    }
};`
};

export const FindMinimumInRotatedSortedArrayVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepLineNumbers, setStepLineNumbers] = useState<StepLineNumberMap>({
    typescript: [],
    python: [],
    java: [],
    cpp: []
  });
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const nums = [4, 5, 6, 7, 0, 1, 2];
    const n = nums.length;
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

    // Function Entry
    generatedSteps.push({
      array: [...nums],
      highlights: [],
      variables: { left: '-', right: '-', mid: '-' },
      explanation: "Initialize binary search to find the minimum element in the rotated sorted array.",
      pseudoStep: "FUNCTION findMin(nums)"
    });
    addLines(1, 1, 2, 3);

    // Pointer Init
    let left = 0;
    let right = n - 1;
    generatedSteps.push({
      array: [...nums],
      highlights: [left, right],
      variables: { left, right, mid: '-' },
      explanation: `Initialize two pointers: left = ${left}, right = ${right}. Search space: [${left}...${right}].`,
      pseudoStep: `SET left = 0, right = nums.length - 1`
    });
    addLines(2, 2, 3, 4);

    // Empty array check
    generatedSteps.push({
      array: [...nums],
      highlights: [],
      variables: { left, right, mid: '-' },
      explanation: `Check if the array is empty: nums.length (${n}) === 0? False.`,
      pseudoStep: "IF nums.length == 0"
    });
    addLines(3, 3, 4, 5);

    let mid = 0;
    while (left < right) {
      // Loop Check
      generatedSteps.push({
        array: [...nums],
        highlights: [left, right],
        variables: { left, right, mid: mid || '-' },
        explanation: `Check if left (${left}) < right (${right}): Yes, continue search.`,
        pseudoStep: "WHILE left < right"
      });
      addLines(4, 5, 5, 6);

      mid = Math.floor((left + right) / 2);
      generatedSteps.push({
        array: [...nums],
        highlights: [left, mid, right],
        variables: { left, right, mid },
        explanation: `Calculate middle index: mid = (${left} + ${right}) / 2 = ${mid}.`,
        pseudoStep: `SET mid = (left + right) / 2`
      });
      addLines(5, 6, 6, 7);

      // Check condition
      generatedSteps.push({
        array: [...nums],
        highlights: [mid, right],
        variables: { left, right, mid },
        explanation: `Compare nums[mid] (${nums[mid]}) > nums[right] (${nums[right]}) to determine which half is sorted.`,
        pseudoStep: `IF nums[mid] > nums[right]`
      });
      addLines(6, 7, 7, 8);

      if (nums[mid] > nums[right]) {
        left = mid + 1;
        generatedSteps.push({
          array: [...nums],
          highlights: [left, right],
          variables: { left, right, mid },
          explanation: `Since nums[mid] (${nums[mid]}) > nums[right] (${nums[right - 1 === mid ? right : right]}), the pivot is in the right half. Minimum must be after mid. Set left = mid + 1 = ${left}.`,
          pseudoStep: "SET left = mid + 1"
        });
        addLines(7, 8, 8, 9);
      } else {
        right = mid;
        generatedSteps.push({
          array: [...nums],
          highlights: [left, right],
          variables: { left, right, mid },
          explanation: `Since nums[mid] (${nums[mid]}) <= nums[right] (${nums[right]}), the right half is sorted normally. Minimum is at or before mid. Set right = mid = ${right}.`,
          pseudoStep: "SET right = mid"
        });
        addLines(9, 10, 10, 11);
      }
    }

    // Loop End Check
    generatedSteps.push({
      array: [...nums],
      highlights: [left, right],
      variables: { left, right, mid },
      explanation: `Check loop condition: left (${left}) < right (${right}): False. Loop terminates.`,
      pseudoStep: "WHILE left < right"
    });
    addLines(4, 5, 5, 6);

    // Return
    generatedSteps.push({
      array: [...nums],
      highlights: [left],
      variables: { left, right, mid, result: nums[left] },
      explanation: `Pointers converged. Minimum element is nums[left] = nums[${left}] = ${nums[left]}.`,
      pseudoStep: "RETURN nums[left]"
    });
    addLines(12, 11, 13, 14);

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
              <h3 className="text-xs font-semibold mb-4 text-muted-foreground uppercase tracking-widest text-center">
                Find Minimum in Rotated Sorted Array
              </h3>

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
                          }`}>
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

