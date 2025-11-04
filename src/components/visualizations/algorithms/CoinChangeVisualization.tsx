import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

export const CoinChangeVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const coins = [1, 2, 5];
  const amount = 11;
  
  const steps = [
    {
      array: [0, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
      highlighting: [0],
      variables: { amount: 0, coins: '[1,2,5]', minCoins: 0 },
      explanation: "Initialize: dp[0] = 0 (0 coins needed for amount 0). Rest = infinity",
      highlightedLine: 1
    },
    {
      array: [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3],
      highlighting: [1, 2],
      variables: { amount: '1-2', coins: '[1,2,5]', minCoins: 'calculating...' },
      explanation: "For amounts 1-2: try each coin and take minimum",
      highlightedLine: 4
    },
    {
      array: [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3],
      highlighting: [5],
      variables: { amount: 5, coins: '[1,2,5]', minCoins: 1 },
      explanation: "For amount 5: can use one coin of value 5 → dp[5] = 1",
      highlightedLine: 6
    },
    {
      array: [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3],
      highlighting: [11],
      variables: { amount: 11, coins: '[1,2,5]', minCoins: 3 },
      explanation: "Amount 11: min(dp[10]+1, dp[9]+1, dp[6]+1) = 3. Answer: 3 coins (5+5+1)",
      highlightedLine: 9
    }
  ];

  const code = `function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;  // 0 coins for amount 0
  
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  
  return dp[amount] === Infinity ? -1 : dp[amount];
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
            <h3 className="text-sm font-semibold mb-3">DP Array - Minimum Coins for Each Amount</h3>
            <div className="flex items-center gap-1 overflow-x-auto">
              {step.array.map((value, index) => (
                <div key={index} className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                      step.highlighting.includes(index)
                        ? 'bg-primary text-primary-foreground scale-110'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {value === Infinity ? '∞' : value}
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
