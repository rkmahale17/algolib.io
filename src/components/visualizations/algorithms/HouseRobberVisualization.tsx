import React, { useState, useEffect, useRef } from 'react';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  houses: number[];
  dp: number[];
  currentIndex: number;
  rob: number;
  notRob: number;
  message: string;
  lineNumber: number;
}

export const HouseRobberVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function rob(nums) {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];
  
  const dp = Array(nums.length);
  dp[0] = nums[0];
  dp[1] = Math.max(nums[0], nums[1]);
  
  for (let i = 2; i < nums.length; i++) {
    // Rob current house + max from i-2
    const robCurrent = nums[i] + dp[i-2];
    // Don't rob current, take max from i-1
    const skipCurrent = dp[i-1];
    
    dp[i] = Math.max(robCurrent, skipCurrent);
  }
  
  return dp[nums.length - 1];
}`;

  const generateSteps = () => {
    const houses = [2, 7, 9, 3, 1];
    const n = houses.length;
    const dp = Array(n).fill(0);
    const newSteps: Step[] = [];

    dp[0] = houses[0];
    newSteps.push({
      houses: [...houses],
      dp: [...dp],
      currentIndex: 0,
      rob: houses[0],
      notRob: 0,
      message: 'Base case: Rob first house, money = ' + houses[0],
      lineNumber: 6
    });

    dp[1] = Math.max(houses[0], houses[1]);
    newSteps.push({
      houses: [...houses],
      dp: [...dp],
      currentIndex: 1,
      rob: houses[1],
      notRob: houses[0],
      message: `Base case: max(${houses[0]}, ${houses[1]}) = ${dp[1]}`,
      lineNumber: 7
    });

    for (let i = 2; i < n; i++) {
      const robCurrent = houses[i] + dp[i-2];
      const skipCurrent = dp[i-1];
      dp[i] = Math.max(robCurrent, skipCurrent);
      
      newSteps.push({
        houses: [...houses],
        dp: [...dp],
        currentIndex: i,
        rob: robCurrent,
        notRob: skipCurrent,
        message: `House ${i}: Rob(${houses[i]} + ${dp[i-2]} = ${robCurrent}) vs Skip(${skipCurrent}) → ${dp[i]}`,
        lineNumber: 15
      });
    }

    newSteps.push({
      houses: [...houses],
      dp: [...dp],
      currentIndex: n - 1,
      rob: 0,
      notRob: 0,
      message: `Maximum money robbed: $${dp[n - 1]}`,
      lineNumber: 18
    });

    setSteps(newSteps);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="space-y-6">
      <StepControls
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        isPlaying={isPlaying}
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">House Robber</h3>
        
        <div className="space-y-6">
          <div>
            <div className="text-sm text-muted-foreground mb-2">Houses ($ value)</div>
            <div className="flex gap-3 justify-center">
              {currentStep.houses.map((value, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-16 h-20 rounded border-2 flex flex-col items-center justify-center transition-all ${
                      idx === currentStep.currentIndex
                        ? 'bg-primary/20 border-primary text-primary scale-110'
                        : 'bg-card border-border'
                    }`}
                  >
                    <div className="text-2xl">🏠</div>
                    <div className="text-xs font-bold">${value}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{idx}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-2">Max Money (DP Array)</div>
            <div className="flex gap-3 justify-center">
              {currentStep.dp.map((value, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-16 h-16 rounded border-2 flex items-center justify-center font-bold text-lg transition-all ${
                      idx === currentStep.currentIndex
                        ? 'bg-green-500/20 border-green-500 text-green-500 scale-110'
                        : value > 0
                        ? 'bg-green-500/10 border-green-500/50'
                        : 'bg-card border-border'
                    }`}
                  >
                    ${value}
                  </div>
                  <div className="text-xs text-muted-foreground">{idx}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-muted rounded">
          <p className="text-sm">{currentStep.message}</p>
        </div>
      </div>

      <VariablePanel
        variables={{
          currentHouse: currentStep.currentIndex,
          houseValue: currentStep.houses[currentStep.currentIndex],
          robCurrent: `$${currentStep.rob}`,
          skipCurrent: `$${currentStep.notRob}`,
          maxMoney: `$${currentStep.dp[currentStep.dp.length - 1]}`
        }}
      />

      <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
    </div>
  );
};
