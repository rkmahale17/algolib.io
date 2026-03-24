import React, { useEffect, useRef, useState } from 'react';

import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  n: number;
  k: number;
  comb: number[];
  i: number | null;
  res: number[][];
  message: string;
  lineNumber: number;
}

export const CombinationsVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function combine(n: number, k: number): number[][] {
  const res: number[][] = [];

  function backtrack(start: number, comb: number[]) {
    if (comb.length === k) {
      res.push([...comb]);
      return;
    }

    for (let i = start; i <= n; i++) {
      comb.push(i);
      backtrack(i + 1, comb);
      comb.pop();
    }
  }

  backtrack(1, []);
  return res;
}`;

  const generateSteps = () => {
    const n = 4;
    const k = 2;
    const newSteps: Step[] = [];
    const res: number[][] = [];

    newSteps.push({
      n, k, comb: [], i: null, res: [],
      message: "Initialize result array res = []",
      lineNumber: 2
    });

    function backtrack(start: number, comb: number[]) {
      newSteps.push({
        n, k, comb: [...comb], i: null, res: res.map(r => [...r]),
        message: `Calling backtrack(start=${start}, comb=[${comb.join(", ")}])`,
        lineNumber: 4
      });

      newSteps.push({
        n, k, comb: [...comb], i: null, res: res.map(r => [...r]),
        message: `Condition check: comb.length === k (${comb.length} === ${k})`,
        lineNumber: 5
      });

      if (comb.length === k) {
        res.push([...comb]);
        newSteps.push({
          n, k, comb: [...comb], i: null, res: res.map(r => [...r]),
          message: `Base case reached. Added [${comb.join(", ")}] to result.`,
          lineNumber: 6
        });
        newSteps.push({
          n, k, comb: [...comb], i: null, res: res.map(r => [...r]),
          message: "Return from recursive call",
          lineNumber: 7
        });
        return;
      }

      for (let i = start; i <= n; i++) {
        newSteps.push({
          n, k, comb: [...comb], i: i, res: res.map(r => [...r]),
          message: `Iterating: i = ${i}`,
          lineNumber: 10
        });

        comb.push(i);
        newSteps.push({
          n, k, comb: [...comb], i: i, res: res.map(r => [...r]),
          message: `Included ${i} in current combination`,
          lineNumber: 11
        });

        backtrack(i + 1, comb);

        const popped = comb.pop();
        newSteps.push({
          n, k, comb: [...comb], i: i, res: res.map(r => [...r]),
          message: `Backtracked: Removed ${popped} from current combination`,
          lineNumber: 13
        });
      }
    }

    newSteps.push({
      n, k, comb: [], i: null, res: [],
      message: "Initiate backtracking from 1",
      lineNumber: 17
    });
    backtrack(1, []);

    newSteps.push({
      n, k, comb: [], i: null, res: res.map(r => [...r]),
      message: "End backtracking. Return all combinations.",
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
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-card rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">Numbers: 1 to {currentStep.n}, Select {currentStep.k}</h3>
          <div className="flex gap-2 mb-6 flex-wrap">
            {Array.from({ length: currentStep.n }, (_, i) => i + 1).map((val) => (
              <div
                key={val}
                className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold transition-all ${val === currentStep.i ? 'bg-primary/20 border-primary scale-110' :
                  currentStep.comb.includes(val) ? 'bg-green-500/20 border-green-500' :
                    'bg-card border-border'
                  }`}
              >
                {val}
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold mb-4">Current Combination ({currentStep.comb.length}/{currentStep.k})</h3>
          <div className="flex gap-2 mb-6 min-h-[3rem] flex-wrap">
            {currentStep.comb.length > 0 ? (
              currentStep.comb.map((val, idx) => (
                <div
                  key={idx}
                  className="w-12 h-12 flex items-center justify-center rounded-lg border-2 bg-blue-500/20 border-blue-500 font-bold animate-in zoom-in"
                >
                  {val}
                </div>
              ))
            ) : (
              <div className="text-muted-foreground italic h-12 flex items-center">Empty</div>
            )}
          </div>

          <h3 className="text-lg font-semibold mb-4">Result (res) - Total: {currentStep.res.length}</h3>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg bg-muted/20">
            {currentStep.res.length > 0 ? (
              currentStep.res.map((comb, idx) => (
                <div key={idx} className="px-3 py-1 bg-muted rounded border text-sm animate-in fade-in slide-in-from-bottom-1">
                  [{comb.join(', ')}]
                </div>
              ))
            ) : (
              <div className="text-muted-foreground italic text-sm">No combinations found yet.</div>
            )}
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-sm font-medium text-foreground leading-relaxed italic">{currentStep.message}</p>
          </div>

          <div className="mt-4">
            <VariablePanel
              variables={{
                'n': currentStep.n,
                'k': currentStep.k,
                'i': currentStep.i ?? 'null',
                'comb': `[${currentStep.comb.join(', ')}]`,
                'res.length': currentStep.res.length
              }}
            />
          </div>
        </div>
        <AnimatedCodeEditor code={code} highlightedLines={[currentStep.lineNumber]} language="typescript" />

      </div>
    </div>
  );
};
