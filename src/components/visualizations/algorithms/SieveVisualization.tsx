import React, { useState, useEffect, useRef } from 'react';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  n: number;
  sieve: boolean[];
  current: number;
  primes: number[];
  message: string;
  lineNumber: number;
}

export const SieveVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const intervalRef = useRef<number | null>(null);

  const code = `function sieveOfEratosthenes(n: number): number[] {
  const sieve = new Array(n + 1).fill(true);
  sieve[0] = sieve[1] = false;
  
  for (let i = 2; i * i <= n; i++) {
    if (sieve[i]) {
      // Mark multiples of i as not prime
      for (let j = i * i; j <= n; j += i) {
        sieve[j] = false;
      }
    }
  }
  
  return sieve.map((isPrime, i) => isPrime ? i : -1).filter(x => x > 0);
}`;

  const generateSteps = () => {
    const n = 20;
    const newSteps: Step[] = [];
    const sieve = new Array(n + 1).fill(true);
    sieve[0] = sieve[1] = false;

    newSteps.push({
      n,
      sieve: [...sieve],
      current: -1,
      primes: [],
      message: 'Initialize: 0 and 1 are not prime',
      lineNumber: 2
    });

    for (let i = 2; i * i <= n; i++) {
      if (sieve[i]) {
        newSteps.push({
          n,
          sieve: [...sieve],
          current: i,
          primes: [],
          message: `${i} is prime, marking its multiples as composite`,
          lineNumber: 5
        });

        for (let j = i * i; j <= n; j += i) {
          sieve[j] = false;
          newSteps.push({
            n,
            sieve: [...sieve],
            current: i,
            primes: [],
            message: `Mark ${j} as composite (multiple of ${i})`,
            lineNumber: 8
          });
        }
      }
    }

    const primes = sieve.map((isPrime, i) => isPrime ? i : -1).filter(x => x > 0);
    
    newSteps.push({
      n,
      sieve: [...sieve],
      current: -1,
      primes,
      message: `Found ${primes.length} primes: ${primes.join(', ')}`,
      lineNumber: 13
    });

    setSteps(newSteps);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

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
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) setCurrentStepIndex(currentStepIndex + 1);
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
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
        <h3 className="text-lg font-semibold mb-4">Sieve Array (2 to {currentStep.n})</h3>
        
        <div className="grid grid-cols-10 gap-2 mb-6">
          {currentStep.sieve.slice(2).map((isPrime, idx) => {
            const num = idx + 2;
            return (
              <div
                key={num}
                className={`aspect-square flex items-center justify-center rounded border-2 font-bold text-sm transition-all ${
                  num === currentStep.current
                    ? 'bg-primary/20 border-primary scale-110'
                    : isPrime
                    ? 'bg-green-500/20 border-green-500'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                {num}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 text-sm mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-green-500/20 border-2 border-green-500"></div>
            <span>Prime</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-red-500/10 border-2 border-red-500/30"></div>
            <span>Composite</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary/20 border-2 border-primary"></div>
            <span>Current</span>
          </div>
        </div>

        {currentStep.primes.length > 0 && (
          <div className="mb-4 p-4 bg-green-500/10 border border-green-500 rounded">
            <p className="text-sm font-semibold">Primes found: {currentStep.primes.join(', ')}</p>
          </div>
        )}

        <div className="mt-4 p-4 bg-muted rounded">
          <p className="text-sm">{currentStep.message}</p>
        </div>
      </div>

      <VariablePanel
        variables={{
          'n': currentStep.n,
          'current': currentStep.current >= 0 ? currentStep.current : 'done',
          'primes found': currentStep.primes.length
        }}
      />

      <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
    </div>
  );
};
