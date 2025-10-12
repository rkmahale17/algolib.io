import React, { useEffect, useRef, useState } from 'react';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  num1: string;
  num2: string;
  depth: number;
  operation: string;
  result: string;
  message: string;
  lineNumber: number;
  parts?: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
}

export const KaratsubaVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function karatsuba(x: bigint, y: bigint): bigint {
  // Base case
  if (x < 10n || y < 10n) {
    return x * y;
  }
  
  // Calculate size and split point
  const n = Math.max(x.toString().length, y.toString().length);
  const m = Math.floor(n / 2);
  const power = 10n ** BigInt(m);
  
  // Split numbers
  const a = x / power;
  const b = x % power;
  const c = y / power;
  const d = y % power;
  
  // Three recursive multiplications
  const ac = karatsuba(a, c);
  const bd = karatsuba(b, d);
  const adbc = karatsuba(a + b, c + d) - ac - bd;
  
  // Combine results
  return ac * (10n ** BigInt(2 * m)) + adbc * power + bd;
}`;

  const generateSteps = () => {
    const newSteps: Step[] = [];
    
    const multiply = (x: bigint, y: bigint, depth: number): bigint => {
      newSteps.push({
        num1: x.toString(),
        num2: y.toString(),
        depth,
        operation: 'start',
        result: '',
        message: `Multiplying ${x} × ${y} (depth: ${depth})`,
        lineNumber: 1
      });

      if (x < 10n || y < 10n) {
        const result = x * y;
        newSteps.push({
          num1: x.toString(),
          num2: y.toString(),
          depth,
          operation: 'base',
          result: result.toString(),
          message: `Base case: ${x} × ${y} = ${result}`,
          lineNumber: 3
        });
        return result;
      }

      const n = Math.max(x.toString().length, y.toString().length);
      const m = Math.floor(n / 2);
      const power = 10n ** BigInt(m);

      const a = x / power;
      const b = x % power;
      const c = y / power;
      const d = y % power;

      newSteps.push({
        num1: x.toString(),
        num2: y.toString(),
        depth,
        operation: 'split',
        result: '',
        message: `Split: ${x} = ${a} × 10^${m} + ${b}, ${y} = ${c} × 10^${m} + ${d}`,
        lineNumber: 13,
        parts: { a: a.toString(), b: b.toString(), c: c.toString(), d: d.toString() }
      });

      const ac = multiply(a, c, depth + 1);
      const bd = multiply(b, d, depth + 1);
      const adbc = multiply(a + b, c + d, depth + 1) - ac - bd;

      const result = ac * (10n ** BigInt(2 * m)) + adbc * power + bd;

      newSteps.push({
        num1: x.toString(),
        num2: y.toString(),
        depth,
        operation: 'combine',
        result: result.toString(),
        message: `Combine: ${ac} × 10^${2*m} + ${adbc} × 10^${m} + ${bd} = ${result}`,
        lineNumber: 23
      });

      return result;
    };

    multiply(1234n, 5678n, 0);
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">Karatsuba Multiplication</h3>
          
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border-2 ${
              currentStep.operation === 'start' ? 'bg-primary/10 border-primary' : 'bg-muted/30 border-border'
            }`}>
              <div className="text-xs text-muted-foreground mb-2">Input</div>
              <div className="font-mono text-2xl font-bold">
                {currentStep.num1} × {currentStep.num2}
              </div>
              <div className="text-xs text-muted-foreground mt-2">Depth: {currentStep.depth}</div>
            </div>

            {currentStep.parts && (
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded bg-blue-500/10 border border-blue-500/20">
                  <div className="text-xs text-muted-foreground">High (a)</div>
                  <div className="font-mono font-bold text-blue-400">{currentStep.parts.a}</div>
                </div>
                <div className="p-3 rounded bg-blue-500/10 border border-blue-500/20">
                  <div className="text-xs text-muted-foreground">Low (b)</div>
                  <div className="font-mono font-bold text-blue-400">{currentStep.parts.b}</div>
                </div>
                <div className="p-3 rounded bg-green-500/10 border border-green-500/20">
                  <div className="text-xs text-muted-foreground">High (c)</div>
                  <div className="font-mono font-bold text-green-400">{currentStep.parts.c}</div>
                </div>
                <div className="p-3 rounded bg-green-500/10 border border-green-500/20">
                  <div className="text-xs text-muted-foreground">Low (d)</div>
                  <div className="font-mono font-bold text-green-400">{currentStep.parts.d}</div>
                </div>
              </div>
            )}

            {currentStep.result && (
              <div className="p-4 rounded-lg bg-green-500/10 border-2 border-green-500">
                <div className="text-xs text-muted-foreground mb-2">Result</div>
                <div className="font-mono text-xl font-bold text-green-400">
                  {currentStep.result}
                </div>
              </div>
            )}

            <div className="p-4 bg-muted rounded">
              <p className="text-sm">{currentStep.message}</p>
            </div>
          </div>

          <div className="mt-4">
            <VariablePanel
              variables={{
                operation: currentStep.operation,
                depth: currentStep.depth,
                result: currentStep.result || 'computing...'
              }}
            />
          </div>
        </div>

        <CodeHighlighter 
          code={code} 
          highlightedLine={currentStep.lineNumber} 
          language="typescript" 
        />
      </div>
    </div>
  );
};
