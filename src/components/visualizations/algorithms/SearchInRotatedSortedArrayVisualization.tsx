import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";

interface Step {
  array: number[];
  highlights: number[];
  variables: Record<string, any>;
  explanation: string;
  highlightedLine: number;
}

export const SearchInRotatedSortedArrayVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const target = 0;

  const code = `function search(nums: number[], target: number): number {
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
}`;

  useEffect(() => {
    const generateSteps = () => {
      const nums = [4, 5, 6, 7, 0, 1, 2];
      const newSteps: Step[] = [];

      let left = 0;
      let right = nums.length - 1;

      // Line 2
      newSteps.push({
        array: [...nums],
        highlights: [left, right],
        variables: { left, right, mid: '-', target, found: 'false' },
        explanation: `Initialize pointers: left=${left}, right=${right}. Search range: [${left}...${right}].`,
        highlightedLine: 2
      });

      while (left <= right) {
        // Line 3: while check
        newSteps.push({
          array: [...nums],
          highlights: [left, right],
          variables: { left, right, mid: '-', target, found: 'false' },
          explanation: `Condition left (${left}) <= right (${right}) is True. Enter loop.`,
          highlightedLine: 3
        });

        const mid = Math.floor((left + right) / 2);
        
        // Line 4: Calculate mid
        newSteps.push({
          array: [...nums],
          highlights: [left, mid, right],
          variables: { left, right, mid, target, found: 'false' },
          explanation: `Calculate mid = floor((${left} + ${right}) / 2) = ${mid}. nums[mid] = ${nums[mid]}.`,
          highlightedLine: 4
        });

        // Line 5: if (nums[mid] === target)
        newSteps.push({
          array: [...nums],
          highlights: [mid],
          variables: { left, right, mid, target, found: 'false' },
          explanation: `Check if nums[mid] (${nums[mid]}) === target (${target}).`,
          highlightedLine: 5
        });

        if (nums[mid] === target) {
          // Line 6
          newSteps.push({
            array: [...nums],
            highlights: [mid],
            variables: { left, right, mid, target, found: 'true' },
            explanation: `Yes! Found target at index ${mid}. Return ${mid}.`,
            highlightedLine: 6
          });
          break; // Stop generator here as we return
        }

        // Line 8: if (nums[left] <= nums[mid])
        newSteps.push({
          array: [...nums],
          highlights: [left, mid],
          variables: { left, right, mid, target, found: 'false' },
          explanation: `Since not target, determine which half is sorted. Is left half sorted? Check nums[left] (${nums[left]}) <= nums[mid] (${nums[mid]}).`,
          highlightedLine: 8
        });

        if (nums[left] <= nums[mid]) {
          // Left half is sorted
          // Line 9: if (nums[left] <= target && target < nums[mid])
          newSteps.push({
            array: [...nums],
            highlights: [left, mid],
            variables: { left, right, mid, target, found: 'false' },
            explanation: `Left half is sorted. Is target in this range? Check ${nums[left]} <= ${target} < ${nums[mid]}.`,
            highlightedLine: 9
          });

          if (nums[left] <= target && target < nums[mid]) {
            right = mid - 1;
            // Line 10
            newSteps.push({
              array: [...nums],
              highlights: [left, right], // right changed
              variables: { left, right, mid, target, found: 'false' },
              explanation: `Target is in the left sorted half. Move right pointer to mid - 1 = ${right}.`,
              highlightedLine: 10
            });
          } else {
            left = mid + 1;
            // Line 12
            newSteps.push({
              array: [...nums],
              highlights: [left, right], // left changed
              variables: { left, right, mid, target, found: 'false' },
              explanation: `Target is NOT in the left sorted half. Move left pointer to mid + 1 = ${left}.`,
              highlightedLine: 12
            });
          }
        } else {
          // Right half is sorted
          // Line 15: if (nums[mid] < target && target <= nums[right])
          newSteps.push({
            array: [...nums],
            highlights: [mid, right],
            variables: { left, right, mid, target, found: 'false' },
            explanation: `Right half is sorted. Is target in this range? Check ${nums[mid]} < ${target} <= ${nums[right]}.`,
            highlightedLine: 15
          });

          if (nums[mid] < target && target <= nums[right]) {
            left = mid + 1;
            // Line 16
            newSteps.push({
              array: [...nums],
              highlights: [left, right],
              variables: { left, right, mid, target, found: 'false' },
              explanation: `Target is in the right sorted half. Move left pointer to mid + 1 = ${left}.`,
              highlightedLine: 16
            });
          } else {
            right = mid - 1;
            // Line 18
            newSteps.push({
              array: [...nums],
              highlights: [left, right],
              variables: { left, right, mid, target, found: 'false' },
              explanation: `Target is NOT in the right sorted half. Move right pointer to mid - 1 = ${right}.`,
              highlightedLine: 18
            });
          }
        }
      }

      if (left > right) {
        // Line 3: Failed condition
        newSteps.push({
          array: [...nums],
          highlights: [left, right],
          variables: { left, right, mid: '-', target, found: 'false' },
          explanation: `Condition left (${left}) <= right (${right}) is False. Loop ends.`,
          highlightedLine: 3
        });

        // Line 22
        newSteps.push({
          array: [...nums],
          highlights: [],
          variables: { left, right, mid: '-', target, found: 'false' },
          explanation: `Target not found in array. Return -1.`,
          highlightedLine: 22
        });
      }

      setSteps(newSteps);
    };

    generateSteps();
  }, []);

  if (steps.length === 0) return null;

  const step = steps[currentStepIndex];

  return (
    <VisualizationLayout
      leftContent={
        <>
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Search in Rotated Sorted Array</h3>
              <div className="text-sm font-medium text-center text-primary bg-primary/10 border border-primary/20 py-1.5 px-3 rounded-full mx-auto w-fit">
                Target: {target}
              </div>
              <div className="flex items-center justify-center gap-2 min-h-[100px] flex-wrap mt-8">
                {step.array.map((value, index) => {
                  const l = step.variables.left;
                  const r = step.variables.right;
                  const m = step.variables.mid;
                  
                  const isL = index === l;
                  const isR = index === r;
                  const isM = index === m;

                  return (
                    <div key={index} className="flex flex-col items-center gap-1 sm:gap-2 relative">
                      <div className="absolute -top-8 flex flex-col items-center text-[10px] font-bold">
                        {isL && <span className="text-green-500">L</span>}
                        {isM && <span className="text-purple-500">M</span>}
                        {isR && <span className="text-blue-500">R</span>}
                      </div>
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm sm:text-base border-2 transition-all duration-300 ${step.highlights.includes(index)
                          ? 'bg-primary border-primary text-primary-foreground scale-110 shadow-lg'
                          : 'bg-muted/50 border-border text-foreground'
                          }`}
                      >
                        {value}
                      </div>
                      <span className="text-[10px] sm:text-xs text-muted-foreground">[{index}]</span>
                    </div>
                  );
                })}
              </div>
              <div className="text-sm text-center p-4 bg-muted/50 border rounded-lg font-medium">
                {step.explanation}
              </div>
            </div>
          </Card>
          <VariablePanel variables={step.variables} />
        </>
      }
      rightContent={
        <AnimatedCodeEditor
          code={code}
          highlightedLines={[step.highlightedLine]}
          language="typescript"
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
