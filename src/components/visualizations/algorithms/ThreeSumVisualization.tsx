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

export const ThreeSumVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<Step[]>([]);

  const code = `function threeSum(nums: number[]): number[][] {
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
}`;

  useEffect(() => {
    const generateSteps = () => {
      const originalArray = [-1, 0, 1, 2, -1, -4];
      const newSteps: Step[] = [];
      
      const nums = [...originalArray];
      
      // Initial state
      newSteps.push({
        array: [...nums],
        highlights: [],
        variables: { i: '-', left: '-', right: '-', currentSum: '-', result: '[]' },
        explanation: `Start with original array. First step is to sort it in ascending order.`,
        highlightedLine: 2
      });

      nums.sort((a, b) => a - b);

      newSteps.push({
        array: [...nums],
        highlights: [],
        variables: { i: '-', left: '-', right: '-', currentSum: '-', result: '[]' },
        explanation: `Array sorted. Initialize empty result array.`,
        highlightedLine: 3
      });

      const result: number[][] = [];
      const n = nums.length;

      for (let i = 0; i < n - 2; i++) {
        newSteps.push({
          array: [...nums],
          highlights: [i],
          variables: { i, left: '-', right: '-', currentSum: '-', result: JSON.stringify(result) },
          explanation: `Outer loop: i=${i}, nums[i]=${nums[i]}. Loop condition i < ${n - 2} is True.`,
          highlightedLine: 4
        });

        // Line 5: Check duplicate
        newSteps.push({
          array: [...nums],
          highlights: [i],
          variables: { i, left: '-', right: '-', currentSum: '-', result: JSON.stringify(result) },
          explanation: `Check if nums[i] is a duplicate of the previous number to avoid duplicate triplets.`,
          highlightedLine: 5
        });

        if (i > 0 && nums[i] === nums[i - 1]) {
          newSteps.push({
            array: [...nums],
            highlights: [i, i - 1],
            variables: { i, left: '-', right: '-', currentSum: '-', result: JSON.stringify(result) },
            explanation: `nums[${i}] === nums[${i - 1}] (${nums[i]} === ${nums[i - 1]}). Duplicate found, skip.`,
            highlightedLine: 6
          });
          continue;
        }

        let left = i + 1;
        let right = n - 1;
        const target = -nums[i];

        // Line 8 & 9: Init pointers
        newSteps.push({
          array: [...nums],
          highlights: [i, left, right],
          variables: { i, left, right, currentSum: '-', result: JSON.stringify(result) },
          explanation: `Initialize left=${left}, right=${right}, target=-nums[i]=${target}.`,
          highlightedLine: 8
        });

        while (left < right) {
          // Line 10: Loop condition
          newSteps.push({
            array: [...nums],
            highlights: [i, left, right],
            variables: { i, left, right, currentSum: '-', result: JSON.stringify(result) },
            explanation: `Condition left (${left}) < right (${right}) is True.`,
            highlightedLine: 10
          });

          const currentSum = nums[left] + nums[right];

          // Line 11: Current sum
          newSteps.push({
            array: [...nums],
            highlights: [i, left, right],
            variables: { i, left, right, currentSum, result: JSON.stringify(result) },
            explanation: `Calculate currentSum = nums[left] + nums[right] = ${nums[left]} + ${nums[right]} = ${currentSum}.`,
            highlightedLine: 11
          });

          // Line 12: Check sum matches target
          newSteps.push({
            array: [...nums],
            highlights: [i, left, right],
            variables: { i, left, right, currentSum, result: JSON.stringify(result) },
            explanation: `Check if currentSum (${currentSum}) === target (${target}).`,
            highlightedLine: 12
          });

          if (currentSum === target) {
            result.push([nums[i], nums[left], nums[right]]);
            
            // Line 13: Push
            newSteps.push({
              array: [...nums],
              highlights: [i, left, right],
              variables: { i, left, right, currentSum, result: JSON.stringify(result) },
              explanation: `Match found! Added triplet [${nums[i]}, ${nums[left]}, ${nums[right]}] to result.`,
              highlightedLine: 13
            });

            // Line 14: Loop left dupes
            newSteps.push({
              array: [...nums],
              highlights: [left, left + 1],
              variables: { i, left, right, currentSum, result: JSON.stringify(result) },
              explanation: `Skip duplicate elements for the left pointer.`,
              highlightedLine: 14
            });

            while (left < right && nums[left] === nums[left + 1]) left++;
            
            // Line 15: Loop right dupes
            newSteps.push({
              array: [...nums],
              highlights: [right, right - 1],
              variables: { i, left, right, currentSum, result: JSON.stringify(result) },
              explanation: `Skip duplicate elements for the right pointer.`,
              highlightedLine: 15
            });

            while (left < right && nums[right] === nums[right - 1]) right--;

            left++;
            right--;

            // Line 16 & 17: Advance pointers
            newSteps.push({
              array: [...nums],
              highlights: [i, left, right],
              variables: { i, left, right, currentSum, result: JSON.stringify(result) },
              explanation: `Advanced pointers after finding a triplet. left=${left}, right=${right}.`,
              highlightedLine: 16
            });

          } else if (currentSum < target) {
            // Line 18: < target check
            newSteps.push({
              array: [...nums],
              highlights: [i, left, right],
              variables: { i, left, right, currentSum, result: JSON.stringify(result) },
              explanation: `currentSum (${currentSum}) < target (${target}). Need a larger sum, so move left pointer.`,
              highlightedLine: 18
            });

            left++;

            newSteps.push({
              array: [...nums],
              highlights: [i, left, right],
              variables: { i, left, right, currentSum, result: JSON.stringify(result) },
              explanation: `Incremented left to ${left}.`,
              highlightedLine: 19
            });
          } else {
            // Line 20: > target check
            newSteps.push({
              array: [...nums],
              highlights: [i, left, right],
              variables: { i, left, right, currentSum, result: JSON.stringify(result) },
              explanation: `currentSum (${currentSum}) > target (${target}). Need a smaller sum, so move right pointer.`,
              highlightedLine: 20
            });

            right--;

            newSteps.push({
              array: [...nums],
              highlights: [i, left, right],
              variables: { i, left, right, currentSum, result: JSON.stringify(result) },
              explanation: `Decremented right to ${right}.`,
              highlightedLine: 21
            });
          }
        }

        // Line 10: Loop breaks
        newSteps.push({
          array: [...nums],
          highlights: [i, left, Math.max(0, right)],
          variables: { i, left, right, currentSum: '-', result: JSON.stringify(result) },
          explanation: `Condition left (${left}) < right (${right}) is False. Loop ends.`,
          highlightedLine: 10
        });
      }

      // Line 25: Return result
      newSteps.push({
        array: [...nums],
        highlights: [],
        variables: { i: '-', left: '-', right: '-', currentSum: '-', result: JSON.stringify(result) },
        explanation: `Outer loop complete. Return final result: ${JSON.stringify(result)}.`,
        highlightedLine: 25
      });

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
              <h3 className="text-lg font-semibold text-center">3Sum - Two Pointer Approach</h3>
              <div className="flex items-center justify-center gap-2 min-h-[100px] flex-wrap mt-8">
                {step.array.map((value, index) => {
                  const iPointer = step.variables.i;
                  const lPointer = step.variables.left;
                  const rPointer = step.variables.right;
                  
                  const isI = index === iPointer;
                  const isL = index === lPointer;
                  const isR = index === rPointer;

                  return (
                    <div key={index} className="flex flex-col items-center gap-1 sm:gap-2 relative">
                      <div className="absolute -top-8 flex flex-col items-center text-[10px] font-bold">
                        {isI && <span className="text-orange-500">i</span>}
                        {isL && <span className="text-green-500">L</span>}
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
