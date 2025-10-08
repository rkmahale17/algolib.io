import { useState, useEffect, useRef } from 'react';
import { VariablePanel } from '../shared/VariablePanel';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';

interface Step {
  dp: boolean[][];
  nums: number[];
  i: number;
  j: number;
  sum: number;
  message: string;
  lineNumber: number;
}

export const PartitionEqualSubsetVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function canPartition(nums) {
  const sum = nums.reduce((a, b) => a + b);
  if (sum % 2 !== 0) return false;
  
  const target = sum / 2;
  const dp = Array(nums.length + 1)
    .fill(false)
    .map(() => Array(target + 1).fill(false));
  
  for (let i = 0; i <= nums.length; i++) {
    dp[i][0] = true;
  }
  
  for (let i = 1; i <= nums.length; i++) {
    for (let j = 1; j <= target; j++) {
      dp[i][j] = dp[i-1][j];
      if (j >= nums[i-1]) {
        dp[i][j] = dp[i][j] || dp[i-1][j-nums[i-1]];
      }
    }
  }
  return dp[nums.length][target];
}`;

  const generateSteps = () => {
    const nums = [1, 5, 11, 5];
    const sum = nums.reduce((a, b) => a + b);

    const newSteps: Step[] = [];

    if (sum % 2 !== 0) {
      newSteps.push({
        dp: [],
        nums,
        i: -1,
        j: -1,
        sum,
        message: `Sum ${sum} is odd, cannot partition equally`,
        lineNumber: 2
      });
      setSteps(newSteps);
      setCurrentStepIndex(0);
      return;
    }

    const target = sum / 2;
    const dp = Array(nums.length + 1)
      .fill(false)
      .map(() => Array(target + 1).fill(false));

    newSteps.push({
      dp: dp.map(row => [...row]),
      nums,
      i: -1,
      j: -1,
      sum: target,
      message: `Sum is ${sum}, target is ${target}. Initialize DP table`,
      lineNumber: 5
    });

    for (let i = 0; i <= nums.length; i++) {
      dp[i][0] = true;
    }

    newSteps.push({
      dp: dp.map(row => [...row]),
      nums,
      i: -1,
      j: 0,
      sum: target,
      message: 'Base case: sum of 0 is always achievable',
      lineNumber: 10
    });

    for (let i = 1; i <= nums.length; i++) {
      for (let j = 1; j <= target; j++) {
        dp[i][j] = dp[i - 1][j];

        newSteps.push({
          dp: dp.map(row => [...row]),
          nums,
          i,
          j,
          sum: target,
          message: `Check if we can make sum ${j} using first ${i} numbers`,
          lineNumber: 15
        });

        if (j >= nums[i - 1]) {
          const canInclude = dp[i - 1][j - nums[i - 1]];
          dp[i][j] = dp[i][j] || canInclude;

          newSteps.push({
            dp: dp.map(row => [...row]),
            nums,
            i,
            j,
            sum: target,
            message: `Include ${nums[i - 1]}: dp[${i}][${j}] = ${dp[i][j]}`,
            lineNumber: 17
          });
        }
      }
    }

    newSteps.push({
      dp: dp.map(row => [...row]),
      nums,
      i: nums.length,
      j: target,
      sum: target,
      message: `Result: ${dp[nums.length][target] ? 'Can partition' : 'Cannot partition'}`,
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
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 overflow-x-auto">
            {currentStep.dp.length > 0 && (
              <table className="mx-auto border-collapse text-xs">
                <thead>
                  <tr>
                    <th className="border border-border p-2">i\j</th>
                    {currentStep.dp[0].map((_, j) => (
                      <th key={j} className="border border-border p-2">{j}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentStep.dp.map((row, i) => (
                    <tr key={i}>
                      <td className="border border-border p-2 font-bold">{i}</td>
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          className={`border border-border p-2 text-center transition-all duration-300 ${
                            i === currentStep.i && j === currentStep.j
                              ? 'bg-primary text-white'
                              : cell
                              ? 'bg-green-500/30'
                              : 'bg-muted/20'
                          }`}
                        >
                          {cell ? 'T' : 'F'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>
        </div>

        <div className="space-y-4">
          <VariablePanel
            variables={{
              nums: currentStep.nums,
              target: currentStep.sum,
              i: currentStep.i >= 0 ? currentStep.i : 'N/A',
              j: currentStep.j >= 0 ? currentStep.j : 'N/A'
            }}
          />
          <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
        </div>
      </div>
    </div>
  );
};
