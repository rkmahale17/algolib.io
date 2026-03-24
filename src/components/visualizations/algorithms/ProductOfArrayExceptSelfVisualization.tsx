import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";

interface Step {
  array: number[];
  result: number[];
  highlights: number[];
  variables: Record<string, any>;
  explanation: string;
  highlightedLine: number;
}

export const ProductOfArrayExceptSelfVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const code = `function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array(n).fill(1);
  let leftProduct = 1;
  for (let i = 0; i < n; i++) {
    result[i] = leftProduct;
    leftProduct *= nums[i];
  }
  let rightProduct = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= rightProduct;
    rightProduct *= nums[i];
  }
  return result;
}`;

  const generateSteps = () => {
    const array = [1, 2, 3, 4];
    const n = array.length;
    const newSteps: Step[] = [];

    let result = [1, 1, 1, 1];
    let leftProduct = 1;
    let rightProduct = 1;

    // Line 2
    newSteps.push({
      array, result: [...result],
      highlights: [], variables: { i: '-', leftProduct: '-', rightProduct: '-' },
      explanation: `Get length of array: n = ${n}`,
      highlightedLine: 2
    });

    // Line 3
    newSteps.push({
      array, result: [...result],
      highlights: [], variables: { i: '-', leftProduct: '-', rightProduct: '-' },
      explanation: `Initialize result array of size ${n} with 1s.`,
      highlightedLine: 3
    });

    // Line 4
    newSteps.push({
      array, result: [...result],
      highlights: [], variables: { i: '-', leftProduct, rightProduct: '-' },
      explanation: `Initialize leftProduct to 1.`,
      highlightedLine: 4
    });

    for (let i = 0; i < n; i++) {
        // Line 5
        newSteps.push({
          array, result: [...result],
          highlights: [i], variables: { i, leftProduct, rightProduct: '-' },
          explanation: `Left Pass (i=${i}): Check loop condition.`,
          highlightedLine: 5
        });

        // Line 6
        result = [...result];
        result[i] = leftProduct;
        newSteps.push({
          array, result: [...result],
          highlights: [i], variables: { i, leftProduct, rightProduct: '-' },
          explanation: `Store current leftProduct in result[${i}]. result[${i}] = ${leftProduct}.`,
          highlightedLine: 6
        });

        // Line 7
        leftProduct *= array[i];
        newSteps.push({
          array, result: [...result],
          highlights: [i], variables: { i, leftProduct, rightProduct: '-' },
          explanation: `Update leftProduct by multiplying with nums[${i}]. leftProduct = ${leftProduct}.`,
          highlightedLine: 7
        });
    }

    // Line 9
    newSteps.push({
      array, result: [...result],
      highlights: [], variables: { i: '-', leftProduct, rightProduct },
      explanation: `Initialize rightProduct to 1.`,
      highlightedLine: 9
    });

    for (let i = n - 1; i >= 0; i--) {
        // Line 10
        newSteps.push({
          array, result: [...result],
          highlights: [i], variables: { i, leftProduct, rightProduct },
          explanation: `Right Pass (i=${i}): Check loop condition.`,
          highlightedLine: 10
        });

        // Line 11
        result = [...result];
        result[i] *= rightProduct;
        newSteps.push({
          array, result: [...result],
          highlights: [i], variables: { i, leftProduct, rightProduct },
          explanation: `Multiply result[${i}] by rightProduct. result[${i}] = ${result[i]}.`,
          highlightedLine: 11
        });

        // Line 12
        rightProduct *= array[i];
        newSteps.push({
          array, result: [...result],
          highlights: [i], variables: { i, leftProduct, rightProduct },
          explanation: `Update rightProduct by multiplying with nums[${i}]. rightProduct = ${rightProduct}.`,
          highlightedLine: 12
        });
    }

    // Line 14
    newSteps.push({
      array, result: [...result],
      highlights: [], variables: { i: '-', leftProduct, rightProduct },
      explanation: `Return the final result array: [${result.join(', ')}].`,
      highlightedLine: 14
    });

    setSteps(newSteps);
    setCurrentStepIndex(0);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

  return (
    <VisualizationLayout
      leftContent={
        <>
          <Card className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-center">Product of Array Except Self</h3>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-center">Original Array</div>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {currentStep.array.map((value, index) => (
                    <div key={index} className="flex flex-col items-center gap-1">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm border-2 transition-all duration-300 ${currentStep.highlights.includes(index) ? 'bg-primary border-primary text-primary-foreground scale-110 shadow-lg' : 'bg-muted/50 border-border'
                        }`}>
                        {value}
                      </div>
                      <span className="text-[10px] sm:text-xs text-muted-foreground">[{index}]</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-center">Result Array</div>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {currentStep.result.map((value, index) => (
                    <div key={index} className="flex flex-col items-center gap-1">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm border-2 transition-all duration-300 ${currentStep.highlights.includes(index) ? 'bg-primary border-primary text-primary-foreground scale-110 shadow-lg' : 'bg-muted/50 border-border'
                        }`}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-sm font-medium text-center p-4 bg-accent/50 border border-accent rounded-lg">
                {currentStep.explanation}
              </div>
            </div>
          </Card>
          <VariablePanel variables={currentStep.variables} />
        </>
      }
      rightContent={
        <AnimatedCodeEditor
          code={code}
          highlightedLines={[currentStep.highlightedLine]}
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
