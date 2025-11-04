import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';

interface Step {
  heights: number[];
  left: number;
  right: number;
  variables: Record<string, any>;
  explanation: string;
  highlightedLine: number;
}

export const ContainerWithMostWaterVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const heights = [1, 8, 6, 2, 5, 4, 8, 3, 7];

  const steps: Step[] = [
    {
      heights,
      left: 0,
      right: 8,
      variables: { left: 0, right: 8, maxArea: 0, width: -1, height: -1, currentArea: -1 },
      explanation: "Initialize: left=0, right=8. Use two pointers from both ends. We'll calculate area and move the shorter line.",
      highlightedLine: 1
    },
    {
      heights,
      left: 0,
      right: 8,
      variables: { left: 0, right: 8, maxArea: 0, width: 8, height: 1, currentArea: 8 },
      explanation: "width=8, height=min(1,7)=1. area=8×1=8. Update maxArea=8. heights[left]=1 < heights[right]=7.",
      highlightedLine: 7
    },
    {
      heights,
      left: 1,
      right: 8,
      variables: { left: 1, right: 8, maxArea: 8, width: -1, height: -1, currentArea: -1 },
      explanation: "Move left++ (shorter line). Now left=1, right=8.",
      highlightedLine: 10
    },
    {
      heights,
      left: 1,
      right: 8,
      variables: { left: 1, right: 8, maxArea: 49, width: 7, height: 7, currentArea: 49 },
      explanation: "width=7, height=min(8,7)=7. area=7×7=49! Update maxArea=49. heights[left]=8 > heights[right]=7.",
      highlightedLine: 11
    },
    {
      heights,
      left: 1,
      right: 7,
      variables: { left: 1, right: 7, maxArea: 49, width: -1, height: -1, currentArea: -1 },
      explanation: "Move right-- (shorter line). Now left=1, right=7.",
      highlightedLine: 13
    },
    {
      heights,
      left: 1,
      right: 7,
      variables: { left: 1, right: 7, maxArea: 49, width: 6, height: 3, currentArea: 18 },
      explanation: "width=6, height=min(8,3)=3. area=6×3=18. maxArea stays 49. heights[left]=8 > heights[right]=3.",
      highlightedLine: 11
    },
    {
      heights,
      left: 1,
      right: 6,
      variables: { left: 1, right: 6, maxArea: 49, width: 5, height: 8, currentArea: 40 },
      explanation: "Move right--. left=1, right=6. width=5, height=min(8,8)=8. area=5×8=40. maxArea stays 49.",
      highlightedLine: 11
    },
    {
      heights,
      left: 2,
      right: 6,
      variables: { left: 2, right: 6, maxArea: 49, width: 4, height: 6, currentArea: 24 },
      explanation: "Move left++. left=2, right=6. width=4, height=min(6,8)=6. area=4×6=24. maxArea stays 49.",
      highlightedLine: 10
    },
    {
      heights,
      left: 3,
      right: 6,
      variables: { left: 3, right: 6, maxArea: 49, width: 3, height: 2, currentArea: 6 },
      explanation: "Move left++. left=3, right=6. width=3, height=min(2,8)=2. area=3×2=6. maxArea stays 49.",
      highlightedLine: 10
    },
    {
      heights,
      left: 4,
      right: 6,
      variables: { left: 4, right: 6, maxArea: 49, width: 2, height: 5, currentArea: 10 },
      explanation: "Move left++. left=4, right=6. width=2, height=min(5,8)=5. area=2×5=10. maxArea stays 49.",
      highlightedLine: 10
    },
    {
      heights,
      left: 5,
      right: 6,
      variables: { left: 5, right: 6, maxArea: 49, width: 1, height: 4, currentArea: 4 },
      explanation: "Move left++. left=5, right=6. width=1, height=min(4,8)=4. area=1×4=4. maxArea stays 49.",
      highlightedLine: 10
    },
    {
      heights,
      left: 6,
      right: 6,
      variables: { left: 6, right: 6, maxArea: 49, width: 0, height: 0, currentArea: 0 },
      explanation: "left==right, loop ends. Maximum area = 49 (between indices 1 and 8). Time: O(n), Space: O(1).",
      highlightedLine: 16
    }
  ];

  const code = `function maxArea(height: number[]): number {
  let left = 0, right = height.length - 1;
  let maxArea = 0;
  
  while (left < right) {
    // Calculate current area
    const width = right - left;
    const currentHeight = Math.min(height[left], height[right]);
    const currentArea = width * currentHeight;
    
    // Update maximum area
    maxArea = Math.max(maxArea, currentArea);
    
    // Move pointer with smaller height
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  
  return maxArea;
}`;

  const step = steps[currentStep];
  const maxHeight = Math.max(...heights);

  return (
    <VisualizationLayout
      leftContent={
        <>
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Container With Most Water</h3>
              <div className="relative flex items-end justify-center gap-1 h-64">
                {step.heights.map((height, index) => {
                  const isLeft = index === step.left;
                  const isRight = index === step.right;
                  const isInContainer = index >= step.left && index <= step.right;
                  const containerHeight = Math.min(
                    step.heights[step.left],
                    step.heights[step.right]
                  );

                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center gap-2 flex-1 max-w-[50px] relative"
                    >
                      {isLeft && (
                        <div className="absolute -top-8 text-xs font-bold text-primary">
                          LEFT
                        </div>
                      )}
                      {isRight && (
                        <div className="absolute -top-8 text-xs font-bold text-primary">
                          RIGHT
                        </div>
                      )}
                      <div
                        className="relative w-full"
                        style={{
                          height: `${(height / maxHeight) * 100}%`,
                          minHeight: '20px',
                        }}
                      >
                        <div
                          className={`absolute bottom-0 w-full rounded-t transition-all duration-300 ${
                            isLeft || isRight
                              ? 'bg-primary shadow-lg shadow-primary/50'
                              : 'bg-muted'
                          }`}
                          style={{ height: '100%' }}
                        />
                        {isInContainer &&
                          index !== step.left &&
                          index !== step.right && (
                            <div
                              className="absolute bottom-0 w-full bg-primary/20"
                              style={{
                                height: `${(containerHeight / maxHeight) * 100}%`,
                              }}
                            />
                          )}
                      </div>
                      <span
                        className={`text-xs font-mono ${
                          isLeft || isRight
                            ? 'text-primary font-bold'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {height}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="text-sm text-center p-4 bg-muted/50 rounded">
                {step.explanation}
              </div>
            </div>
          </Card>
          <VariablePanel variables={step.variables} />
        </>
      }
      rightContent={
        <CodeHighlighter
          code={code}
          highlightedLine={step.highlightedLine}
          language="TypeScript"
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
