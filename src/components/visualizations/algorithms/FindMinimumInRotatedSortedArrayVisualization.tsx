import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { motion } from 'framer-motion';

interface Step {
  array: number[];
  highlights: number[];
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const FindMinimumInRotatedSortedArrayVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<Step[]>([]);

  const code = `function findMin(nums: number[]): number {
  let left = 0, right = nums.length - 1;
  
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    
    if (nums[mid] > nums[right]) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  
  return nums[left];
}`;

  useEffect(() => {
    const generateSteps = () => {
      const nums = [4, 5, 6, 7, 0, 1, 2];
      const newSteps: Step[] = [];
      let left = 0;
      let right = nums.length - 1;
      let mid = 0;

      // Step 1: Initialization(Start)
      newSteps.push({
        array: [...nums],
        highlights: [],
        variables: { left: '?', right: '?', mid: '?' },
        explanation: "Starting with rotated sorted array [4,5,6,7,0,1,2]. Goal: Find minimum in O(log n) time.",
        highlightedLines: [1],
        lineExecution: "function findMin(nums: number[]): number {"
      });

      // Step 2: Declare pointers
      newSteps.push({
        array: [...nums],
        highlights: [left, right],
        variables: { left, right, mid: '?' },
        explanation: `Initialize pointers: left = ${left}, right = ${right} (last index). Search space: [${left}...${right}].`,
        highlightedLines: [2],
        lineExecution: `let left = 0, right = nums.length - 1;`
      });

      while (left < right) {
        // Loop check
        newSteps.push({
          array: [...nums],
          highlights: [left, right],
          variables: { left, right, mid: mid || '?' },
          explanation: `Check loop condition: left (${left}) < right (${right})? Yes.`,
          highlightedLines: [4],
          lineExecution: "while (left < right)"
        });

        mid = Math.floor((left + right) / 2);

        // Calc mid
        newSteps.push({
          array: [...nums],
          highlights: [left, mid, right],
          variables: { left, right, mid },
          explanation: `Calculate mid index: Math.floor((${left} + ${right}) / 2) = ${mid}.`,
          highlightedLines: [5],
          lineExecution: "const mid = Math.floor((left + right) / 2);"
        });

        // Check condition
        newSteps.push({
          array: [...nums],
          highlights: [mid, right],
          variables: { left, right, mid },
          explanation: `Compare nums[mid] (${nums[mid]}) > nums[right] (${nums[right]})? ${nums[mid] > nums[right] ? 'Yes' : 'No'}.`,
          highlightedLines: [7],
          lineExecution: `if (nums[mid] > nums[right])`
        });

        if (nums[mid] > nums[right]) {
          newSteps.push({
            array: [...nums],
            highlights: [left, right],
            variables: { left, right, mid },
            explanation: `Since ${nums[mid]} > ${nums[right]}, minimum is strictly to the right. New left = mid + 1 = ${mid + 1}.`,
            highlightedLines: [8],
            lineExecution: "left = mid + 1;"
          });
          left = mid + 1;
        } else {
          newSteps.push({
            array: [...nums],
            highlights: [left, right],
            variables: { left, right, mid },
            explanation: `Since ${nums[mid]} <= ${nums[right]}, minimum is to the left (or is mid). New right = mid = ${mid}.`,
            highlightedLines: [10],
            lineExecution: "right = mid;"
          });
          right = mid;
        }
      }

      // Loop exit
      newSteps.push({
        array: [...nums],
        highlights: [left, right],
        variables: { left, right, mid },
        explanation: `Check loop condition: left (${left}) < right (${right})? No. Loop terminates.`,
        highlightedLines: [4],
        lineExecution: "while (left < right)"
      });

      // Return
      newSteps.push({
        array: [...nums],
        highlights: [left],
        variables: { left, right, mid, result: nums[left] },
        explanation: `Return nums[left] = nums[${left}] = ${nums[left]}. Found minimum!`,
        highlightedLines: [14],
        lineExecution: "return nums[left];"
      });

      setSteps(newSteps);
    };

    generateSteps();
  }, []);

  if (steps.length === 0) return null;

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <>
          <motion.div
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">Find Minimum in Rotated Sorted Array</h3>
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
                        <div className="absolute -top-8 flex flex-col text-[10px] font-bold">
                          {isL && <span className="text-green-500 text-center">L</span>}
                          {isM && <span className="text-purple-500 text-center">M</span>}
                          {isR && <span className="text-blue-500 text-center">R</span>}
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
              </div>
            </Card>
          </motion.div>

          <motion.div
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="p-4 bg-muted/50">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-primary">Current Execution:</div>
                <div className="text-sm font-mono bg-background/50 p-2 rounded">
                  {step.lineExecution}
                </div>
                <div className="text-sm text-muted-foreground pt-2">
                  {step.explanation}
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <VariablePanel variables={step.variables} />
          </motion.div>
        </>
      }
      rightContent={
        <AnimatedCodeEditor
          code={code}
          language="typescript"
          highlightedLines={step.highlightedLines}
        />
      }
      controls={
        <SimpleStepControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onStepChange={setCurrentStep}
        />
      }
    />
  );
};
