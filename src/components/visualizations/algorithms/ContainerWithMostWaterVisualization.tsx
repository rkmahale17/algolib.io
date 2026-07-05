import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  left: number;
  right: number;
  maxArea: number;
  width: number | '-';
  currentHeight: number | '-';
  currentArea: number | '-';
  explanation: string;
  pseudoStep: string;
  highlights: number[];
}

const languages: VisualizationLanguageMap = {
  typescript: `function maxArea(height: number[]): number {
    let left = 0, right = height.length - 1;
    let maxArea = 0;
    while (left < right) {
        const width = right - left;
        const h = Math.min(height[left], height[right]);
        const area = width * h;
        maxArea = Math.max(maxArea, area);
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    return maxArea;
}`,
  python: `def maxArea(height: List[int]) -> int:
    left, right = 0, len(height) - 1
    max_area = 0
    while left < right:
        width = right - left
        h = min(height[left], height[right])
        area = width * h
        max_area = max(max_area, area)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_area`,
  java: `public static class Solution {
    public int maxArea(int[] height) {
        int left = 0, right = height.length - 1;
        int maxArea = 0;
        while (left < right) {
            int width = right - left;
            int h = Math.min(height[left], height[right]);
            int area = width * h;
            maxArea = Math.max(maxArea, area);
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return maxArea;
    }
}`,
  cpp: `class Solution {
public:
    int maxArea(vector<int>& height) {
        int left = 0, right = height.size() - 1;
        int maxArea = 0;
        while (left < right) {
            int width = right - left;
            int h = min(height[left], height[right]);
            int area = width * h;
            maxArea = max(maxArea, area);
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return maxArea;
    }
};`
};

export const ContainerWithMostWaterVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepLineNumbers, setStepLineNumbers] = useState<StepLineNumberMap>({
    typescript: [],
    python: [],
    java: [],
    cpp: []
  });
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const heights = [1, 8, 6, 2, 5, 4, 8, 3, 7];
  const maxHeight = Math.max(...heights);

  useEffect(() => {
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
      left: 0,
      right: heights.length - 1,
      maxArea: 0,
      width: '-',
      currentHeight: '-',
      currentArea: '-',
      explanation: "Find the container that holds the most water using the two-pointer approach.",
      pseudoStep: "FUNCTION maxArea(height)",
      highlights: []
    });
    addLines(1, 1, 2, 3);

    let left = 0;
    let right = heights.length - 1;

    // Pointer Init
    generatedSteps.push({
      left,
      right,
      maxArea: 0,
      width: '-',
      currentHeight: '-',
      currentArea: '-',
      explanation: `Initialize pointers to outer boundary lines: left = ${left}, right = ${right}.`,
      pseudoStep: "SET left = 0, right = height.length - 1",
      highlights: [left, right]
    });
    addLines(2, 2, 3, 4);

    let maxArea = 0;

    // maxArea Init
    generatedSteps.push({
      left,
      right,
      maxArea,
      width: '-',
      currentHeight: '-',
      currentArea: '-',
      explanation: `Initialize maxArea to ${maxArea}.`,
      pseudoStep: "SET maxArea = 0",
      highlights: []
    });
    addLines(3, 3, 4, 5);

    while (left < right) {
      // Loop Check
      generatedSteps.push({
        left,
        right,
        maxArea,
        width: '-',
        currentHeight: '-',
        currentArea: '-',
        explanation: `Loop check: left (${left}) < right (${right}). Proceed to compute container capacity.`,
        pseudoStep: "WHILE left < right",
        highlights: [left, right]
      });
      addLines(4, 4, 5, 6);

      const width = right - left;

      // Width calculation
      generatedSteps.push({
        left,
        right,
        maxArea,
        width,
        currentHeight: '-',
        currentArea: '-',
        explanation: `Calculate container width: right (${right}) - left (${left}) = ${width}.`,
        pseudoStep: "SET width = right - left",
        highlights: [left, right]
      });
      addLines(5, 5, 6, 7);

      const h = Math.min(heights[left], heights[right]);

      // Height calculation
      generatedSteps.push({
        left,
        right,
        maxArea,
        width,
        currentHeight: h,
        currentArea: '-',
        explanation: `Calculate container height (limited by the shorter line): min(heights[left], heights[right]) = min(${heights[left]}, ${heights[right]}) = ${h}.`,
        pseudoStep: "SET h = min(height[left], height[right])",
        highlights: [left, right]
      });
      addLines(6, 6, 7, 8);

      const area = width * h;

      // Area calculation
      generatedSteps.push({
        left,
        right,
        maxArea,
        width,
        currentHeight: h,
        currentArea: area,
        explanation: `Calculate current container area: width (${width}) * height (${h}) = ${area}.`,
        pseudoStep: "SET area = width * h",
        highlights: [left, right]
      });
      addLines(7, 7, 8, 9);

      const oldMaxArea = maxArea;
      maxArea = Math.max(maxArea, area);

      // maxArea Update
      generatedSteps.push({
        left,
        right,
        maxArea,
        width,
        currentHeight: h,
        currentArea: area,
        explanation: area > oldMaxArea
          ? `Current area ${area} is greater than maxArea (${oldMaxArea}). Update maxArea = ${maxArea}.`
          : `Current area ${area} is not greater than maxArea (${oldMaxArea}). Keep maxArea = ${maxArea}.`,
        pseudoStep: "SET maxArea = max(maxArea, area)",
        highlights: [left, right]
      });
      addLines(8, 8, 9, 10);

      // Pointer decision check
      generatedSteps.push({
        left,
        right,
        maxArea,
        width,
        currentHeight: h,
        currentArea: area,
        explanation: `Decide which pointer to move: Is heights[left] (${heights[left]}) < heights[right] (${heights[right]})?`,
        pseudoStep: "IF height[left] < height[right]",
        highlights: [left, right]
      });
      addLines(9, 9, 10, 11);

      if (heights[left] < heights[right]) {
        left++;
        generatedSteps.push({
          left,
          right,
          maxArea,
          width: '-',
          currentHeight: '-',
          currentArea: '-',
          explanation: `Since the left line is shorter, we shift the left pointer right to try and find a taller line. Set left = ${left}.`,
          pseudoStep: "SET left = left + 1",
          highlights: [left, right]
        });
        addLines(10, 10, 11, 12);
      } else {
        right--;
        generatedSteps.push({
          left,
          right,
          maxArea,
          width: '-',
          currentHeight: '-',
          currentArea: '-',
          explanation: `Since the right line is shorter or equal, we shift the right pointer left to try and find a taller line. Set right = ${right}.`,
          pseudoStep: "SET right = right - 1",
          highlights: [left, right]
        });
        addLines(12, 12, 13, 14);
      }
    }

    // Done
    generatedSteps.push({
      left,
      right,
      maxArea,
      width: '-',
      currentHeight: '-',
      currentArea: '-',
      explanation: `Pointers met. Loop terminated. The maximum container area found is ${maxArea}.`,
      pseudoStep: "RETURN maxArea",
      highlights: []
    });
    addLines(15, 13, 16, 17);

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
                Container Volume Maximizer
              </h3>

              {/* Water Visualizer Box */}
              <div className="relative h-64 border-b-2 border-border mb-6">
                {/* Visual Area Overlay */}
                {currentStep.currentArea !== '-' && currentStep.width !== '-' && currentStep.left < currentStep.right && (
                  <div
                    className="absolute bottom-0 bg-blue-500/20 border-x-2 border-t-2 border-blue-400/50 transition-all duration-300"
                    style={{
                      left: `${(currentStep.left / (heights.length - 1)) * 100}%`,
                      width: `${((currentStep.right - currentStep.left) / (heights.length - 1)) * 100}%`,
                      height: `${(Number(currentStep.currentHeight) / maxHeight) * 100}%`
                    }}
                  />
                )}

                {/* Bars */}
                <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-between items-end px-2">
                  {heights.map((h, i) => {
                    const isLeft = i === currentStep.left;
                    const isRight = i === currentStep.right;
                    const isPointer = isLeft || isRight;
                    const barHeight = (h / maxHeight) * 100;

                    return (
                      <div key={i} className="flex flex-col items-center w-6 relative h-full justify-end">
                        {/* Pointer Label */}
                        {isPointer && (
                          <div className={`absolute -top-6 px-1.5 py-0.5 rounded-sm text-[8px] font-black text-white shadow-lg z-20 ${
                            isLeft ? 'bg-orange-500' : 'bg-blue-500'
                          }`}>
                            {isLeft ? 'L' : 'R'}
                          </div>
                        )}

                        {/* Line height number */}
                        <div className={`text-[10px] font-bold mb-1 transition-all ${
                          isPointer ? 'text-primary scale-110 font-black' : 'text-muted-foreground/40'
                        }`}>
                          {h}
                        </div>

                        {/* Bar Pillar */}
                        <div
                          className={`w-2.5 rounded-t-sm transition-all duration-300 ${
                            isPointer
                              ? isLeft
                                ? 'bg-orange-500 shadow-md shadow-orange-500/35'
                                : 'bg-blue-500 shadow-md shadow-blue-500/35'
                              : 'bg-muted/70 border border-border/50'
                          }`}
                          style={{ height: `${barHeight - 12}%` }}
                        />

                        {/* Index */}
                        <span className="text-[9px] text-muted-foreground/60 mt-1">[{i}]</span>
                      </div>
                    );
                  })}
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
          <VariablePanel
            variables={{
              left: currentStep.left,
              right: currentStep.right,
              width: currentStep.width,
              currentHeight: currentStep.currentHeight,
              currentArea: currentStep.currentArea,
              maxArea: currentStep.maxArea
            }}
          />
        </div>
      }
    />
  );
};

