import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

export const ReverseBitsVisualization = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      variables: { n: '43261596', result: 0, i: 0, bit: '-' },
      explanation: "Start: n = 43261596 (shown as 8 bits for simplicity). result = 0. Process 32 bits total",
      highlightedLine: 0,
      bitsN: ['0', '0', '0', '0', '1', '0', '1', '1'],
      bitsResult: ['0', '0', '0', '0', '0', '0', '0', '0']
    },
    {
      variables: { n: '43261596', result: 0, i: 0, bit: '-' },
      explanation: "Enter loop: i = 0 (will process 32 iterations, showing first 8)",
      highlightedLine: 1,
      bitsN: ['0', '0', '0', '0', '1', '0', '1', '1'],
      bitsResult: ['0', '0', '0', '0', '0', '0', '0', '0']
    },
    {
      variables: { n: '43261596', result: 0, i: 0, bit: 1 },
      explanation: "Extract rightmost bit: bit = n & 1 = 1",
      highlightedLine: 2,
      bitsN: ['0', '0', '0', '0', '1', '0', '1', '1'],
      bitsResult: ['0', '0', '0', '0', '0', '0', '0', '0'],
      extractBit: 7
    },
    {
      variables: { n: '43261596', result: 0, i: 0, bit: 1 },
      explanation: "Shift result left: result = (0 << 1) = 0",
      highlightedLine: 3,
      bitsN: ['0', '0', '0', '0', '1', '0', '1', '1'],
      bitsResult: ['0', '0', '0', '0', '0', '0', '0', '0']
    },
    {
      variables: { n: '43261596', result: 1, i: 0, bit: 1 },
      explanation: "Add bit: result = 0 | 1 = 1",
      highlightedLine: 3,
      bitsN: ['0', '0', '0', '0', '1', '0', '1', '1'],
      bitsResult: ['0', '0', '0', '0', '0', '0', '0', '1']
    },
    {
      variables: { n: '21630798', result: 1, i: 0, bit: 1 },
      explanation: "Shift n right: n >>>= 1. Remove processed bit",
      highlightedLine: 4,
      bitsN: ['0', '0', '0', '0', '0', '1', '0', '1'],
      bitsResult: ['0', '0', '0', '0', '0', '0', '0', '1']
    },
    {
      variables: { n: '21630798', result: 1, i: 1, bit: 1 },
      explanation: "Loop: i = 1. Extract bit: n & 1 = 1",
      highlightedLine: 2,
      bitsN: ['0', '0', '0', '0', '0', '1', '0', '1'],
      bitsResult: ['0', '0', '0', '0', '0', '0', '0', '1'],
      extractBit: 7
    },
    {
      variables: { n: '21630798', result: 2, i: 1, bit: 1 },
      explanation: "Shift result left: result = (1 << 1) = 2",
      highlightedLine: 3,
      bitsN: ['0', '0', '0', '0', '0', '1', '0', '1'],
      bitsResult: ['0', '0', '0', '0', '0', '0', '1', '0']
    },
    {
      variables: { n: '21630798', result: 3, i: 1, bit: 1 },
      explanation: "Add bit: result = 2 | 1 = 3",
      highlightedLine: 3,
      bitsN: ['0', '0', '0', '0', '0', '1', '0', '1'],
      bitsResult: ['0', '0', '0', '0', '0', '0', '1', '1']
    },
    {
      variables: { n: '10815399', result: 3, i: 1, bit: 1 },
      explanation: "Shift n right: n >>>= 1",
      highlightedLine: 4,
      bitsN: ['0', '0', '0', '0', '0', '0', '1', '0'],
      bitsResult: ['0', '0', '0', '0', '0', '0', '1', '1']
    },
    {
      variables: { n: '10815399', result: 3, i: 2, bit: 0 },
      explanation: "Loop: i = 2. Extract bit: n & 1 = 0",
      highlightedLine: 2,
      bitsN: ['0', '0', '0', '0', '0', '0', '1', '0'],
      bitsResult: ['0', '0', '0', '0', '0', '0', '1', '1'],
      extractBit: 7
    },
    {
      variables: { n: '10815399', result: 6, i: 2, bit: 0 },
      explanation: "Shift result left: result = (3 << 1) = 6",
      highlightedLine: 3,
      bitsN: ['0', '0', '0', '0', '0', '0', '1', '0'],
      bitsResult: ['0', '0', '0', '0', '0', '1', '1', '0']
    },
    {
      variables: { n: '10815399', result: 6, i: 2, bit: 0 },
      explanation: "Add bit: result = 6 | 0 = 6 (no change)",
      highlightedLine: 3,
      bitsN: ['0', '0', '0', '0', '0', '0', '1', '0'],
      bitsResult: ['0', '0', '0', '0', '0', '1', '1', '0']
    },
    {
      variables: { n: '5407699', result: 6, i: 2, bit: 0 },
      explanation: "Shift n right: n >>>= 1",
      highlightedLine: 4,
      bitsN: ['0', '0', '0', '0', '0', '0', '0', '1'],
      bitsResult: ['0', '0', '0', '0', '0', '1', '1', '0']
    },
    {
      variables: { n: '5407699', result: 6, i: 3, bit: 1 },
      explanation: "Loop: i = 3. Extract bit: n & 1 = 1",
      highlightedLine: 2,
      bitsN: ['0', '0', '0', '0', '0', '0', '0', '1'],
      bitsResult: ['0', '0', '0', '0', '0', '1', '1', '0'],
      extractBit: 7
    },
    {
      variables: { n: '5407699', result: 12, i: 3, bit: 1 },
      explanation: "Shift result left: result = (6 << 1) = 12",
      highlightedLine: 3,
      bitsN: ['0', '0', '0', '0', '0', '0', '0', '1'],
      bitsResult: ['0', '0', '0', '0', '1', '1', '0', '0']
    },
    {
      variables: { n: '5407699', result: 13, i: 3, bit: 1 },
      explanation: "Add bit: result = 12 | 1 = 13",
      highlightedLine: 3,
      bitsN: ['0', '0', '0', '0', '0', '0', '0', '1'],
      bitsResult: ['0', '0', '0', '0', '1', '1', '0', '1']
    },
    {
      variables: { result: 964176192, iterations: 32 },
      explanation: "Continue for all 32 bits... Final result after 32 iterations: 964176192",
      highlightedLine: 5,
      bitsN: ['0', '0', '0', '0', '0', '0', '0', '0'],
      bitsResult: ['1', '1', '0', '1', '0', '0', '0', '0']
    }
  ];

  const code = `function reverseBits(n: number): number {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    const bit = n & 1;
    result = (result << 1) | bit;
    n >>>= 1;
  }
  return result >>> 0;
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
          <Card className="p-4">
            <h3 className="font-semibold mb-2 text-sm">Original n (rightmost 8 bits)</h3>
            <div className="flex gap-1 justify-center">
              {step.bitsN.map((bit, idx) => (
                <div key={idx} className={`w-10 h-10 flex items-center justify-center font-mono text-lg border-2 rounded transition-all duration-300 ${
                  bit === '1' ? 'bg-primary/30 border-primary' : 'bg-muted border-border'
                } ${idx === step.extractBit ? 'ring-2 ring-accent scale-110' : ''}`}>
                  {bit}
                </div>
              ))}
            </div>
            <p className="text-xs text-center mt-2 text-muted-foreground">
              {step.extractBit >= 0 && '↑ Extracting this bit'}
            </p>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-2 text-sm">Reversed result (rightmost 8 bits)</h3>
            <div className="flex gap-1 justify-center">
              {step.bitsResult.map((bit, idx) => (
                <div key={idx} className={`w-10 h-10 flex items-center justify-center font-mono text-lg border-2 rounded transition-all duration-300 ${
                  bit === '1' ? 'bg-secondary/30 border-secondary' : 'bg-muted border-border'
                }`}>
                  {bit}
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
              <p>• Extract rightmost bit: <code>bit = n & 1</code></p>
              <p>• Shift result left: <code>result = result {'<'}{'<'} 1</code></p>
              <p>• Add extracted bit: <code>result = result | bit</code></p>
              <p>• Shift n right: <code>n {'>'}{'>'}{'>'}= 1</code></p>
              <p>• Repeat 32 times to process all bits</p>
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