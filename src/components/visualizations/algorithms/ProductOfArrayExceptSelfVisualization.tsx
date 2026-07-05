import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  array: number[];
  result: number[];
  highlights: number[];
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function productExceptSelf(nums: number[]): number[] {
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
}`,
  python: `def productExceptSelf(nums: List[int]) -> List[int]:
    n = len(nums)
    result = [1] * n
    left_product = 1
    for i in range(n):
        result[i] = left_product
        left_product *= nums[i]
    right_product = 1
    for i in range(n - 1, -1, -1):
        result[i] *= right_product
        right_product *= nums[i]
    return result`,
  java: `public static class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        for (int i = 0; i < n; i++) {
            result[i] = 1;
        }
        int leftProduct = 1;
        for (int i = 0; i < n; i++) {
            result[i] = leftProduct;
            leftProduct *= nums[i];
        }
        int rightProduct = 1;
        for (int i = n - 1; i >= 0; i--) {
            result[i] *= rightProduct;
            rightProduct *= nums[i];
        }
        return result;
    }
}`,
  cpp: `class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n = nums.size();
        vector<int> result(n, 1);
        int leftProduct = 1;
        for (int i = 0; i < n; i++) {
            result[i] = leftProduct;
            leftProduct *= nums[i];
        }
        int rightProduct = 1;
        for (int i = n - 1; i >= 0; i--) {
            result[i] *= rightProduct;
            rightProduct *= nums[i];
        }
        return result;
    }
};`
};

export const ProductOfArrayExceptSelfVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepLineNumbers, setStepLineNumbers] = useState<StepLineNumberMap>({
    typescript: [],
    python: [],
    java: [],
    cpp: []
  });
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const array = [1, 2, 3, 4];
    const n = array.length;
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

    let result = [1, 1, 1, 1];
    let leftProduct = 1;
    let rightProduct = 1;

    // Get length
    generatedSteps.push({
      array,
      result: [...result],
      highlights: [],
      variables: { i: '-', leftProduct: '-', rightProduct: '-' },
      explanation: `Get the length of the array: n = ${n}`,
      pseudoStep: `SET n = nums.length`
    });
    addLines(2, 2, 3, 4);

    // Initialize result
    generatedSteps.push({
      array,
      result: [...result],
      highlights: [],
      variables: { i: '-', leftProduct: '-', rightProduct: '-' },
      explanation: `Initialize result array of size ${n} with 1s.`,
      pseudoStep: `SET result = [1, 1, 1, 1]`
    });
    addLines(3, 3, 4, 5);

    // Initialize leftProduct
    generatedSteps.push({
      array,
      result: [...result],
      highlights: [],
      variables: { i: '-', leftProduct, rightProduct: '-' },
      explanation: `Initialize leftProduct variable to 1.`,
      pseudoStep: `SET leftProduct = 1`
    });
    addLines(4, 4, 8, 6);

    for (let i = 0; i < n; i++) {
      // Loop condition
      generatedSteps.push({
        array,
        result: [...result],
        highlights: [i],
        variables: { i, leftProduct, rightProduct: '-' },
        explanation: `Left pass: processing index i = ${i}.`,
        pseudoStep: `FOR i = ${i} to ${n - 1}`
      });
      addLines(5, 5, 9, 7);

      // result[i] = leftProduct
      result = [...result];
      result[i] = leftProduct;
      generatedSteps.push({
        array,
        result: [...result],
        highlights: [i],
        variables: { i, leftProduct, rightProduct: '-' },
        explanation: `Store current leftProduct in result[${i}] = ${leftProduct}.`,
        pseudoStep: `SET result[${i}] = leftProduct`
      });
      addLines(6, 6, 10, 8);

      // leftProduct *= nums[i]
      leftProduct *= array[i];
      generatedSteps.push({
        array,
        result: [...result],
        highlights: [i],
        variables: { i, leftProduct, rightProduct: '-' },
        explanation: `Multiply leftProduct by current element array[${i}] (${array[i]}) to get next leftProduct = ${leftProduct}.`,
        pseudoStep: `SET leftProduct = leftProduct * nums[${i}]`
      });
      addLines(7, 7, 11, 9);
    }

    // Initialize rightProduct
    generatedSteps.push({
      array,
      result: [...result],
      highlights: [],
      variables: { i: '-', leftProduct, rightProduct },
      explanation: `Initialize rightProduct variable to 1.`,
      pseudoStep: `SET rightProduct = 1`
    });
    addLines(9, 8, 13, 11);

    for (let i = n - 1; i >= 0; i--) {
      // Loop condition
      generatedSteps.push({
        array,
        result: [...result],
        highlights: [i],
        variables: { i, leftProduct, rightProduct },
        explanation: `Right pass: processing index i = ${i} from the end.`,
        pseudoStep: `FOR i = ${i} down to 0`
      });
      addLines(10, 9, 14, 12);

      // result[i] *= rightProduct
      result = [...result];
      result[i] *= rightProduct;
      generatedSteps.push({
        array,
        result: [...result],
        highlights: [i],
        variables: { i, leftProduct, rightProduct },
        explanation: `Multiply current result[${i}] by rightProduct. result[${i}] = ${result[i]}.`,
        pseudoStep: `SET result[${i}] = result[${i}] * rightProduct`
      });
      addLines(11, 10, 15, 13);

      // rightProduct *= nums[i]
      rightProduct *= array[i];
      generatedSteps.push({
        array,
        result: [...result],
        highlights: [i],
        variables: { i, leftProduct, rightProduct },
        explanation: `Multiply rightProduct by current element array[${i}] (${array[i]}) to get next rightProduct = ${rightProduct}.`,
        pseudoStep: `SET rightProduct = rightProduct * nums[${i}]`
      });
      addLines(12, 11, 16, 14);
    }

    // Return result
    generatedSteps.push({
      array,
      result: [...result],
      highlights: [],
      variables: { i: '-', leftProduct, rightProduct },
      explanation: `Final result computed: [${result.join(', ')}].`,
      pseudoStep: `RETURN result`
    });
    addLines(14, 12, 18, 16);

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
                Product of Array Except Self
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-center text-muted-foreground">Original Array (nums)</div>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {currentStep.array.map((value, index) => (
                      <div key={index} className="flex flex-col items-center gap-1">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border-2 transition-all duration-300 ${
                          currentStep.highlights.includes(index)
                            ? 'bg-primary/20 border-primary text-primary scale-110 shadow-lg'
                            : 'bg-muted/50 border-border text-foreground'
                        }`}>
                          {value}
                        </div>
                        <span className="text-[10px] text-muted-foreground">[{index}]</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-center text-muted-foreground">Result Array</div>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {currentStep.result.map((value, index) => (
                      <div key={index} className="flex flex-col items-center gap-1">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs border-2 transition-all duration-300 ${
                          currentStep.highlights.includes(index)
                            ? 'bg-primary/25 border-primary text-primary scale-110 shadow-lg'
                            : 'bg-muted/50 border-border text-foreground'
                        }`}>
                          {value}
                        </div>
                        <span className="text-[10px] text-muted-foreground">[{index}]</span>
                      </div>
                    ))}
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
    />
  );
};
