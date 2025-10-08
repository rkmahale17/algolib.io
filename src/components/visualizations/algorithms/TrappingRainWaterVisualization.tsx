import { useState, useEffect, useRef } from 'react';
import { VariablePanel } from '../shared/VariablePanel';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';

interface Step {
  heights: number[];
  left: number;
  right: number;
  leftMax: number;
  rightMax: number;
  water: number;
  totalWater: number;
  message: string;
  lineNumber: number;
}

export const TrappingRainWaterVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function trap(heights) {
  let left = 0, right = heights.length - 1;
  let leftMax = 0, rightMax = 0;
  let totalWater = 0;
  
  while (left < right) {
    if (heights[left] < heights[right]) {
      if (heights[left] >= leftMax) {
        leftMax = heights[left];
      } else {
        totalWater += leftMax - heights[left];
      }
      left++;
    } else {
      if (heights[right] >= rightMax) {
        rightMax = heights[right];
      } else {
        totalWater += rightMax - heights[right];
      }
      right--;
    }
  }
  return totalWater;
}`;

  const generateSteps = () => {
    const heights = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
    const newSteps: Step[] = [];
    let left = 0, right = heights.length - 1;
    let leftMax = 0, rightMax = 0;
    let totalWater = 0;

    newSteps.push({
      heights: [...heights],
      left, right, leftMax, rightMax,
      water: 0, totalWater,
      message: 'Initialize: Two pointers from both ends',
      lineNumber: 1
    });

    while (left < right) {
      if (heights[left] < heights[right]) {
        if (heights[left] >= leftMax) {
          leftMax = heights[left];
          newSteps.push({
            heights: [...heights],
            left, right, leftMax, rightMax,
            water: 0, totalWater,
            message: `heights[${left}]=${heights[left]} ≥ leftMax. Update leftMax=${leftMax}`,
            lineNumber: 8
          });
        } else {
          const water = leftMax - heights[left];
          totalWater += water;
          newSteps.push({
            heights: [...heights],
            left, right, leftMax, rightMax,
            water, totalWater,
            message: `Trap ${water} water at index ${left}. Total=${totalWater}`,
            lineNumber: 10
          });
        }
        left++;
      } else {
        if (heights[right] >= rightMax) {
          rightMax = heights[right];
          newSteps.push({
            heights: [...heights],
            left, right, leftMax, rightMax,
            water: 0, totalWater,
            message: `heights[${right}]=${heights[right]} ≥ rightMax. Update rightMax=${rightMax}`,
            lineNumber: 15
          });
        } else {
          const water = rightMax - heights[right];
          totalWater += water;
          newSteps.push({
            heights: [...heights],
            left, right, leftMax, rightMax,
            water, totalWater,
            message: `Trap ${water} water at index ${right}. Total=${totalWater}`,
            lineNumber: 17
          });
        }
        right--;
      }
    }

    newSteps.push({
      heights: [...heights],
      left, right, leftMax, rightMax,
      water: 0, totalWater,
      message: `Complete! Total trapped water = ${totalWater} units`,
      lineNumber: 22
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
  const getMaxHeight = () => Math.max(...currentStep.heights, currentStep.leftMax, currentStep.rightMax);

  // Calculate water at each position for visualization
  const waterLevels = currentStep.heights.map((h, i) => {
    if (i < currentStep.left || i > currentStep.right) return 0;
    const maxHeight = i <= currentStep.left ? currentStep.leftMax : currentStep.rightMax;
    return Math.max(0, maxHeight - h);
  });

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
            <div className="flex items-end justify-center gap-1 h-64">
              {currentStep.heights.map((height, index) => {
                const isLeft = index === currentStep.left;
                const isRight = index === currentStep.right;
                const waterLevel = waterLevels[index];

                return (
                  <div key={index} className="flex flex-col items-center gap-2 flex-1 max-w-[50px] relative">
                    {isLeft && (
                      <div className="absolute -top-8 text-xs font-bold text-blue-500">L</div>
                    )}
                    {isRight && (
                      <div className="absolute -top-8 text-xs font-bold text-purple-500">R</div>
                    )}
                    <div className="relative w-full flex-1 flex flex-col justify-end">
                      {waterLevel > 0 && (
                        <div
                          className="w-full bg-blue-400 rounded-t animate-in fade-in"
                          style={{ height: `${(waterLevel / getMaxHeight()) * 100}%` }}
                        />
                      )}
                      <div
                        className={`w-full rounded-t transition-all duration-300 ${
                          isLeft || isRight
                            ? 'bg-primary shadow-lg'
                            : 'bg-gradient-to-t from-gray-600 to-gray-400'
                        }`}
                        style={{ height: `${(height / getMaxHeight()) * 100}%`, minHeight: height > 0 ? '10px' : '0' }}
                      />
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
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Total Trapped Water</div>
              <div className="font-mono font-bold text-2xl text-blue-500">{currentStep.totalWater} units</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <VariablePanel
            variables={{
              left: currentStep.left,
              right: currentStep.right,
              leftMax: currentStep.leftMax,
              rightMax: currentStep.rightMax,
              'heights[left]': currentStep.heights[currentStep.left],
              'heights[right]': currentStep.heights[currentStep.right],
              waterAdded: currentStep.water,
              totalWater: currentStep.totalWater
            }}
          />
          <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="TypeScript" />
        </div>
      </div>
    </div>
  );
};
