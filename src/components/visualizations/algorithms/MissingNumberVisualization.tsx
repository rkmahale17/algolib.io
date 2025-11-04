import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

export const MissingNumberVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const nums = [3, 0, 1];
  
  const steps = [
    {
      array: nums,
      highlighting: [],
      variables: { result: 3, resultBinary: '11', operation: 'Initialize' },
      explanation: "XOR approach: result = n (array length) = 3. Array: [3, 0, 1], range should be [0,1,2,3]",
      highlightedLine: 1
    },
    {
      array: nums,
      highlighting: [],
      variables: { result: 3, i: 0, 'nums[0]': 3 },
      explanation: "Start loop: i = 0. Will XOR with index 0 and value nums[0] = 3",
      highlightedLine: 2
    },
    {
      array: nums,
      highlighting: [0],
      variables: { result: 3, i: 0, operation: 'result ^= 0' },
      explanation: "Step 1: result ^= i → 3 ^ 0 = 3 (XOR with index)",
      highlightedLine: 3,
      calc: '11 ^ 00 = 11'
    },
    {
      array: nums,
      highlighting: [0],
      variables: { result: 0, i: 0, operation: 'result ^= nums[0]', resultBinary: '00' },
      explanation: "Step 2: result ^= nums[0] → 3 ^ 3 = 0 (XOR with value). 3 cancels out!",
      highlightedLine: 3,
      calc: '11 ^ 11 = 00'
    },
    {
      array: nums,
      highlighting: [],
      variables: { result: 0, i: 1, 'nums[1]': 0 },
      explanation: "Loop: i = 1. Will XOR with index 1 and value nums[1] = 0",
      highlightedLine: 2
    },
    {
      array: nums,
      highlighting: [1],
      variables: { result: 1, i: 1, operation: 'result ^= 1', resultBinary: '01' },
      explanation: "Step 1: result ^= i → 0 ^ 1 = 1 (XOR with index)",
      highlightedLine: 3,
      calc: '00 ^ 01 = 01'
    },
    {
      array: nums,
      highlighting: [1],
      variables: { result: 1, i: 1, operation: 'result ^= nums[1]', resultBinary: '01' },
      explanation: "Step 2: result ^= nums[1] → 1 ^ 0 = 1 (XOR with value). 0 cancels out!",
      highlightedLine: 3,
      calc: '01 ^ 00 = 01'
    },
    {
      array: nums,
      highlighting: [],
      variables: { result: 1, i: 2, 'nums[2]': 1 },
      explanation: "Loop: i = 2. Will XOR with index 2 and value nums[2] = 1",
      highlightedLine: 2
    },
    {
      array: nums,
      highlighting: [2],
      variables: { result: 3, i: 2, operation: 'result ^= 2', resultBinary: '11' },
      explanation: "Step 1: result ^= i → 1 ^ 2 = 3 (XOR with index)",
      highlightedLine: 3,
      calc: '01 ^ 10 = 11'
    },
    {
      array: nums,
      highlighting: [2],
      variables: { result: 2, i: 2, operation: 'result ^= nums[2]', resultBinary: '10' },
      explanation: "Step 2: result ^= nums[2] → 3 ^ 1 = 2 (XOR with value). 1 cancels out!",
      highlightedLine: 3,
      calc: '11 ^ 01 = 10'
    },
    {
      array: nums,
      highlighting: [],
      variables: { result: 2, answer: 2 },
      explanation: "Exit loop. Return result = 2. The missing number is 2! All others cancelled via XOR.",
      highlightedLine: 4,
      calc: 'Result: 10 (binary) = 2 (decimal)'
    }
  ];

  const code = `function missingNumber(nums: number[]): number {
  let result = nums.length;
  for (let i = 0; i < nums.length; i++) {
    result ^= i ^ nums[i];
  }
  return result;
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
            <h3 className="text-sm font-semibold mb-3">Input Array</h3>
            <div className="flex items-center justify-center gap-2">
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
                  <span className="text-xs text-muted-foreground">{index}</span>
                </div>
              ))}
            </div>
          </Card>

          {step.calc && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2 text-sm">Binary Calculation</h3>
              <p className="font-mono text-center text-lg">{step.calc}</p>
            </Card>
          )}
          
          <Card className="p-4">
            <p className="text-sm font-medium">{step.explanation}</p>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-2 text-sm">XOR Properties:</h3>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>• a ^ a = 0 (any number XOR itself = 0)</p>
              <p>• a ^ 0 = a (any number XOR 0 = itself)</p>
              <p>• XOR is commutative: order doesn't matter</p>
              <p>• We XOR all indices [0,1,2,3] with all values [3,0,1]</p>
              <p>• Duplicates cancel out, leaving only the missing number!</p>
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