import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

export const ClimbingStairsVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  
  const steps = [
    {
      array: [1, 2],
      variables: { step: 0, prev2: 1, prev1: 2, current: '-' },
      explanation: "Base cases: 1 step = 1 way, 2 steps = 2 ways (1+1 or 2)",
      highlightedLine: 1
    },
    {
      array: [1, 2, 3],
      variables: { step: 3, prev2: 1, prev1: 2, current: 3 },
      explanation: "Step 3: ways = prev1 + prev2 = 2 + 1 = 3 ways",
      highlightedLine: 6
    },
    {
      array: [1, 2, 3, 5],
      variables: { step: 4, prev2: 2, prev1: 3, current: 5 },
      explanation: "Step 4: ways = 3 + 2 = 5 ways",
      highlightedLine: 7
    },
    {
      array: [1, 2, 3, 5, 8],
      variables: { step: 5, prev2: 3, prev1: 5, current: 8 },
      explanation: "Step 5: ways = 5 + 3 = 8 ways. This follows Fibonacci!",
      highlightedLine: 11
    }
  ];

  const code = `function climbStairs(n: number): number {
  if (n <= 2) return n;
  
  let prev2 = 1;  // ways to reach step 1
  let prev1 = 2;  // ways to reach step 2
  
  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  
  return prev1;
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
            <h3 className="text-sm font-semibold mb-3 text-center">Climbing Stairs - Number of Ways</h3>
            <div className="flex justify-center gap-2">
              {step.array.map((ways, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center border-2 border-primary">
                    <span className="font-bold text-xl">{ways}</span>
                  </div>
                  <span className="text-xs mt-2 text-muted-foreground">Step {idx === 0 ? 1 : idx === 1 ? 2 : idx + 1}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-medium">{step.explanation}</p>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-2 text-sm">Pattern:</h3>
            <p className="text-xs text-muted-foreground">
              ways(n) = ways(n-1) + ways(n-2) - just like Fibonacci!
            </p>
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
