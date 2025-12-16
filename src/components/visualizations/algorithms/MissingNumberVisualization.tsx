import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

export const MissingNumberVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const nums = [3, 0, 1];
  
  // Code line mapping (1-based):
  // 1: function...
  // 2:   // Start...
  // 3:   let res = nums.length;
  // 4: 
  // 5:   // Loop...
  // 6:   for (let i = 0; i < nums.length; i++) {
  // 7:       // Add...
  // 8:       res += i - nums[i];
  // 9:   }
  // 10:
  // 11:  // Remaining...
  // 12:  return res;
  // 13: }

  const steps = [
    {
      array: nums,
      highlighting: [],
      variables: { res: 3, n: 3 },
      explanation: "Initialize res = n = 3. This accounts for the missing index n in the 0..n range.",
      highlightedLine: 3 // Fixed: Points to 'let res...'
    },
    {
      array: nums,
      highlighting: [],
      variables: { res: 3, i: 0, 'nums[0]': 3 },
      explanation: "Start loop at i = 0. We will compute diff = i - nums[i].",
      highlightedLine: 6 // Fixed: Points to 'for loop'
    },
    {
      array: nums,
      highlighting: [0],
      variables: { res: 3, i: 0, 'nums[0]': 3, diff: -3 },
      explanation: "Calculate difference: i - nums[i] = 0 - 3 = -3.",
      highlightedLine: 8, // Fixed: Points to 'res += ...'
      calc: '0 - 3 = -3'
    },
    {
      array: nums,
      highlighting: [0],
      variables: { res: 0, i: 0, 'nums[i]': 3, prevRes: 3 },
      explanation: "Update res: res += -3 → 3 + (-3) = 0.",
      highlightedLine: 8,
      calc: '3 + (-3) = 0'
    },
    {
      array: nums,
      highlighting: [],
      variables: { res: 0, i: 1, 'nums[1]': 0 },
      explanation: "Loop: i = 1. We will compute diff = i - nums[i].",
      highlightedLine: 6
    },
    {
      array: nums,
      highlighting: [1],
      variables: { res: 0, i: 1, 'nums[1]': 0, diff: 1 },
      explanation: "Calculate difference: i - nums[i] = 1 - 0 = 1.",
      highlightedLine: 8,
      calc: '1 - 0 = 1'
    },
    {
      array: nums,
      highlighting: [1],
      variables: { res: 1, i: 1, 'nums[i]': 0, prevRes: 0 },
      explanation: "Update res: res += 1 → 0 + 1 = 1.",
      highlightedLine: 8,
      calc: '0 + 1 = 1'
    },
    {
      array: nums,
      highlighting: [],
      variables: { res: 1, i: 2, 'nums[2]': 1 },
      explanation: "Loop: i = 2. We will compute diff = i - nums[i].",
      highlightedLine: 6
    },
    {
      array: nums,
      highlighting: [2],
      variables: { res: 1, i: 2, 'nums[2]': 1, diff: 1 },
      explanation: "Calculate difference: i - nums[i] = 2 - 1 = 1.",
      highlightedLine: 8,
      calc: '2 - 1 = 1'
    },
    {
      array: nums,
      highlighting: [2],
      variables: { res: 2, i: 2, 'nums[i]': 1, prevRes: 1 },
      explanation: "Update res: res += 1 → 1 + 1 = 2.",
      highlightedLine: 8,
      calc: '1 + 1 = 2'
    },
    {
      array: nums,
      highlighting: [],
      variables: { res: 2 },
      explanation: "Loop finished. The accumulated result is the missing number: 2.",
      highlightedLine: 12, // Fixed: Points to 'return res'
      calc: 'Result: 2'
    }
  ];

  const code = `function missingNumber(nums: number[]): number {
    // Start with n (array length)
    let res = nums.length;

    // Loop through all indices
    for (let i = 0; i < nums.length; i++) {
        // Add difference between index and value
        res += i - nums[i];
    }

    // Remaining value is the missing number
    return res;
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
            <h3 className="text-sm font-semibold mb-3">Input Array (nums)</h3>
            {/* Added flex-wrap for responsiveness */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {step.array.map((value, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-14 h-14 rounded flex items-center justify-center font-bold transition-all duration-300 ${
                      step.highlighting.includes(index)
                        ? 'bg-primary text-primary-foreground scale-110'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {value}
                  </div>
                  <span className="text-xs text-muted-foreground">i = {index}</span>
                </div>
              ))}
              {/* Virtual Nth element explanation visual */}
              <div className="flex flex-col items-center gap-2 opacity-50 border border-dashed rounded p-1">
                 <div className="w-12 h-12 flex items-center justify-center text-xs text-center text-muted-foreground">
                    n = {nums.length}
                 </div>
              </div>
            </div>
          </Card>

          {step.calc && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2 text-sm">Calculation</h3>
              <p className="font-mono text-center text-lg">{step.calc}</p>
            </Card>
          )}
          
          <Card className="p-4">
            <p className="text-sm font-medium">{step.explanation}</p>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Variables</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(step.variables).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between text-sm border-b pb-1">
                  <span className="font-mono text-muted-foreground">{key}</span>
                  <span className="font-mono font-bold text-primary">
                    {Array.isArray(value) ? `[${value.join(', ')}]` : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
          
           <Card className="p-4 bg-muted/20">
            <h3 className="font-semibold mb-2 text-sm">Why this works?</h3>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>Consider the sum of indices [0...n] and sum of values in array.</p>
              <p>Missing Number = Sum(0...n) - Sum(nums)</p>
              <p>This approach computes this difference incrementally to avoid separate loops or potential overflow (though less of an issue here than complex multiplication).</p>
              <p>res ends up being accumulating `n + (0-nums[0]) + (1-nums[1]) ...` which effectively re-arranges to `(n + 0 + 1 + ... ) - (nums[0] + nums[1] + ...)`.</p>
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
                    index + 1 === step.highlightedLine // Adjust for 1-based index vs 0-based loop
                      ? 'bg-primary/20 border-l-2 border-primary'
                      : ''
                  } transition-colors duration-300`}
                >
                  <span className="inline-block w-8 text-right pr-3 text-muted-foreground select-none">
                    {index + 1}
                  </span>
                  <code className={index + 1 === step.highlightedLine ? 'font-bold' : ''}>
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