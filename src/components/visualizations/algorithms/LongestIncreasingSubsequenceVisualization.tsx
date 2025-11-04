import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

export const LongestIncreasingSubsequenceVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const nums = [10, 9, 2, 5, 3, 7, 101, 18];
  
  const steps = [
    {
      dpArray: [1, 1, 1, 1, 1, 1, 1, 1],
      numsArray: nums,
      highlighting: [],
      variables: { n: 8, maxLen: 1 },
      explanation: "Initialize: Create dp array of size n. Each element starts with 1 (every number is a subsequence of length 1)",
      highlightedLine: 1
    },
    {
      dpArray: [1, 1, 1, 1, 1, 1, 1, 1],
      numsArray: nums,
      highlighting: [0],
      variables: { i: 0, 'nums[i]': 10, 'dp[i]': 1 },
      explanation: "i=0: nums[0]=10. No previous elements, dp[0] stays 1",
      highlightedLine: 2
    },
    {
      dpArray: [1, 1, 1, 1, 1, 1, 1, 1],
      numsArray: nums,
      highlighting: [1],
      variables: { i: 1, 'nums[i]': 9, j: 0, 'nums[j]': 10 },
      explanation: "i=1: nums[1]=9. Check j=0: nums[0]=10 > 9, can't extend. dp[1] stays 1",
      highlightedLine: 3
    },
    {
      dpArray: [1, 1, 1, 1, 1, 1, 1, 1],
      numsArray: nums,
      highlighting: [2],
      variables: { i: 2, 'nums[i]': 2, j: '0,1', comparison: '10>2, 9>2' },
      explanation: "i=2: nums[2]=2. Check all j<2: all previous nums > 2, can't extend. dp[2] stays 1",
      highlightedLine: 3
    },
    {
      dpArray: [1, 1, 1, 2, 1, 1, 1, 1],
      numsArray: nums,
      highlighting: [3],
      variables: { i: 3, 'nums[i]': 5, j: 2, 'nums[j]': 2, 'dp[j]': 1 },
      explanation: "i=3: nums[3]=5. Check j=2: nums[2]=2 < 5 ✓. Can extend! dp[3] = dp[2] + 1 = 2",
      highlightedLine: 4
    },
    {
      dpArray: [1, 1, 1, 2, 2, 1, 1, 1],
      numsArray: nums,
      highlighting: [4],
      variables: { i: 4, 'nums[i]': 3, j: 2, 'nums[j]': 2, 'dp[j]': 1 },
      explanation: "i=4: nums[4]=3. Check j=2: nums[2]=2 < 3 ✓. dp[4] = dp[2] + 1 = 2",
      highlightedLine: 4
    },
    {
      dpArray: [1, 1, 1, 2, 2, 3, 1, 1],
      numsArray: nums,
      highlighting: [5],
      variables: { i: 5, 'nums[i]': 7, j: 3, 'nums[j]': 5, 'dp[j]': 2 },
      explanation: "i=5: nums[5]=7. Best: j=3, nums[3]=5 < 7. dp[5] = max(dp[2]+1, dp[3]+1, dp[4]+1) = 3",
      highlightedLine: 4
    },
    {
      dpArray: [1, 1, 1, 2, 2, 3, 4, 1],
      numsArray: nums,
      highlighting: [6],
      variables: { i: 6, 'nums[i]': 101, j: 5, 'nums[j]': 7, 'dp[j]': 3 },
      explanation: "i=6: nums[6]=101. Best: j=5, nums[5]=7 < 101. dp[6] = dp[5] + 1 = 4",
      highlightedLine: 4
    },
    {
      dpArray: [1, 1, 1, 2, 2, 3, 4, 4],
      numsArray: nums,
      highlighting: [7],
      variables: { i: 7, 'nums[i]': 18, j: 5, 'nums[j]': 7, 'dp[j]': 3 },
      explanation: "i=7: nums[7]=18. Best: j=5, nums[5]=7 < 18. dp[7] = dp[5] + 1 = 4",
      highlightedLine: 4
    },
    {
      dpArray: [1, 1, 1, 2, 2, 3, 4, 4],
      numsArray: nums,
      highlighting: [6],
      variables: { maxLen: 4, sequence: '[2,5,7,101] or [2,3,7,18]' },
      explanation: "Complete! Max length = 4. Example sequence: [2, 5, 7, 101] or [2, 3, 7, 18]",
      highlightedLine: 5
    }
  ];

  const code = `function lengthOfLIS(nums: number[]): number {
  const n = nums.length;
  const dp = new Array(n).fill(1);
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  return Math.max(...dp);
}`;

  const step = steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setCurrentStep(0);
                setIsPlaying(false);
              }}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} / {steps.length}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Visualization */}
        <div className="space-y-4">
          <Card className="p-6">
            <div className="text-xs font-semibold text-center mb-2">Input Array (nums)</div>
            <div className="flex items-center gap-2 justify-center">
              {step.numsArray.map((value, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-12 h-12 rounded flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      step.highlighting.includes(index)
                        ? 'bg-primary text-primary-foreground scale-110'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {value}
                  </div>
                  <span className="text-xs text-muted-foreground">{index}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-xs font-semibold text-center mb-2">DP Array (length of LIS ending at each index)</div>
            <div className="flex items-center gap-2 justify-center">
              {step.dpArray.map((value, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-12 h-12 rounded flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      step.highlighting.includes(index)
                        ? 'bg-secondary text-secondary-foreground scale-110'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {value}
                  </div>
                  <span className="text-xs text-muted-foreground">{index}</span>
                </div>
              ))}
            </div>
          </Card>
          
          <Card className="p-4">
            <p className="text-sm font-medium">{step.explanation}</p>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-2 text-sm">Algorithm:</h3>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>• dp[i] = length of LIS ending at index i</p>
              <p>• For each i, check all j {'<'} i</p>
              <p>• If nums[j] {'<'} nums[i], we can extend: dp[i] = max(dp[i], dp[j] + 1)</p>
              <p>• Time: O(n²), Space: O(n)</p>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Variables</h3>
            <div className="space-y-2">
              {Object.entries(step.variables).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="font-mono text-muted-foreground">{key}</span>
                  <span className="font-mono font-bold text-primary">
                    {Array.isArray(value) ? `[${value.join(', ')}]` : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Code */}
        <Card className="p-6">
          <div className="mb-4">
            <span className="text-xs font-semibold text-muted-foreground">TypeScript</span>
          </div>
          <div className="overflow-x-auto">
            <pre className="text-sm">
              {code.split('\n').map((line, index) => (
                <div
                  key={index}
                  className={`flex ${
                    index === step.highlightedLine
                      ? 'bg-primary/20 border-l-2 border-primary'
                      : ''
                  } transition-colors duration-300`}
                >
                  <span className="inline-block w-8 text-right pr-3 text-muted-foreground select-none">
                    {index + 1}
                  </span>
                  <code className={index === step.highlightedLine ? 'font-bold' : ''}>
                    {line || ' '}
                  </code>
                </div>
              ))}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
};
