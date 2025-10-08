import { useState, useEffect, useRef } from 'react';
import { VariablePanel } from '../shared/VariablePanel';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';

interface Step {
  heights: number[];
  left: number;
  right: number;
  area: number;
  maxArea: number;
  message: string;
  lineNumber: number;
}

export const ContainerWithMostWaterVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function maxArea(heights) {
  let left = 0;
  let right = heights.length - 1;
  let maxArea = 0;
  
  while (left < right) {
    const width = right - left;
    const height = Math.min(heights[left], heights[right]);
    const area = width * height;
    maxArea = Math.max(maxArea, area);
    
    if (heights[left] < heights[right]) {
      left++;
    } else {
      right--;
    }
  }
  
  return maxArea;
}`;

  const generateSteps = () => {
    const heights = [1, 8, 6, 2, 5, 4, 8, 3, 7];
    const newSteps: Step[] = [];
    let left = 0;
    let right = heights.length - 1;
    let maxArea = 0;

    newSteps.push({
      heights: [...heights],
      left,
      right,
      area: 0,
      maxArea: 0,
      message: 'Initialize left=0, right=end. Find container with most water',
      lineNumber: 1
    });

    while (left < right) {
      const width = right - left;
      const height = Math.min(heights[left], heights[right]);
      const area = width * height;

      newSteps.push({
        heights: [...heights],
        left,
        right,
        area,
        maxArea,
        message: `width=${width}, height=min(${heights[left]},${heights[right]})=${height}, area=${area}`,
        lineNumber: 6
      });

      if (area > maxArea) {
        maxArea = area;
        newSteps.push({
          heights: [...heights],
          left,
          right,
          area,
          maxArea,
          message: `New max area found: ${maxArea}`,
          lineNumber: 9
        });
      }

      if (heights[left] < heights[right]) {
        newSteps.push({
          heights: [...heights],
          left,
          right,
          area,
          maxArea,
          message: `heights[${left}]=${heights[left]} < heights[${right}]=${heights[right]}. Move left pointer`,
          lineNumber: 11
        });
        left++;
      } else {
        newSteps.push({
          heights: [...heights],
          left,
          right,
          area,
          maxArea,
          message: `heights[${left}]=${heights[left]} ≥ heights[${right}]=${heights[right]}. Move right pointer`,
          lineNumber: 13
        });
        right--;
      }
    }

    newSteps.push({
      heights: [...heights],
      left,
      right,
      area: maxArea,
      maxArea,
      message: `Complete! Maximum water container area = ${maxArea}`,
      lineNumber: 17
    });

    setSteps(newSteps);
    setCurrentStepIndex(0);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(prev => prev + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(prev => prev - 1);
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    generateSteps();
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const getMaxHeight = () => Math.max(...currentStep.heights);
  const containerHeight = Math.min(currentStep.heights[currentStep.left], currentStep.heights[currentStep.right]);

  return (
    <div className="space-y-6">
      <StepControls
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={setSpeed}
        currentStep={currentStepIndex}
        totalSteps={steps.length - 1}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6">
            <div className="relative flex items-end justify-center gap-1 h-64">
              {currentStep.heights.map((height, index) => {
                const isLeft = index === currentStep.left;
                const isRight = index === currentStep.right;
                const isInContainer = index >= currentStep.left && index <= currentStep.right;

                return (
                  <div key={index} className="flex flex-col items-center gap-2 flex-1 max-w-[50px] relative">
                    {isLeft && (
                      <div className="absolute -top-8 text-xs font-bold text-blue-500">LEFT</div>
                    )}
                    {isRight && (
                      <div className="absolute -top-8 text-xs font-bold text-blue-500">RIGHT</div>
                    )}
                    <div className="relative w-full" style={{ height: `${(height / getMaxHeight()) * 100}%`, minHeight: '20px' }}>
                      <div
                        className={`absolute bottom-0 w-full rounded-t transition-all duration-300 ${
                          isLeft || isRight
                            ? 'bg-primary shadow-lg shadow-primary/50'
                            : 'bg-gradient-to-t from-gray-400 to-gray-300'
                        }`}
                        style={{ height: '100%' }}
                      />
                      {isInContainer && index !== currentStep.left && index !== currentStep.right && (
                        <div
                          className="absolute bottom-0 w-full bg-blue-400/40"
                          style={{ height: `${(containerHeight / getMaxHeight()) * 100}%` }}
                        />
                      )}
                    </div>
                    <span className={`text-xs font-mono ${isLeft || isRight ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                      {height}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Current Area</div>
                <div className="font-mono font-bold text-lg">{currentStep.area}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Max Area</div>
                <div className="font-mono font-bold text-lg text-green-500">{currentStep.maxArea}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <VariablePanel
            variables={{
              left: currentStep.left,
              right: currentStep.right,
              'heights[left]': currentStep.heights[currentStep.left],
              'heights[right]': currentStep.heights[currentStep.right],
              width: currentStep.right - currentStep.left,
              height: containerHeight,
              area: currentStep.area,
              maxArea: currentStep.maxArea
            }}
          />
          <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="TypeScript" />
        </div>
      </div>
    </div>
  );
};
