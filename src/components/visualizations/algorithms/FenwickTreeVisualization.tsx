import React, { useState, useEffect, useRef } from 'react';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  array: number[];
  tree: number[];
  operation: string;
  index: number;
  value: number;
  result: number | null;
  message: string;
  lineNumber: number;
}

export const FenwickTreeVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `class FenwickTree {
  tree: number[];
  n: number;
  
  constructor(arr: number[]) {
    this.n = arr.length;
    this.tree = new Array(this.n + 1).fill(0);
    for (let i = 0; i < this.n; i++) {
      this.update(i, arr[i]);
    }
  }
  
  update(index: number, delta: number) {
    index++; // 1-indexed
    while (index <= this.n) {
      this.tree[index] += delta;
      index += index & (-index); // Add last set bit
    }
  }
  
  query(index: number): number {
    index++; // 1-indexed
    let sum = 0;
    while (index > 0) {
      sum += this.tree[index];
      index -= index & (-index); // Remove last set bit
    }
    return sum;
  }
}`;

  const generateSteps = () => {
    const arr = [3, 2, -1, 6, 5];
    const newSteps: Step[] = [];
    const n = arr.length;
    const tree: number[] = new Array(n + 1).fill(0);

    newSteps.push({
      array: [...arr],
      tree: [...tree],
      operation: 'init',
      index: -1,
      value: 0,
      result: null,
      message: 'Initialize Fenwick Tree (Binary Indexed Tree)',
      lineNumber: 5
    });

    function update(index: number, delta: number) {
      let idx = index + 1;
      newSteps.push({
        array: [...arr],
        tree: [...tree],
        operation: 'update',
        index,
        value: delta,
        result: null,
        message: `Update index ${index} with value ${delta}`,
        lineNumber: 12
      });

      while (idx <= n) {
        tree[idx] += delta;
        newSteps.push({
          array: [...arr],
          tree: [...tree],
          operation: 'update',
          index: idx - 1,
          value: tree[idx],
          result: null,
          message: `tree[${idx}] += ${delta}, now = ${tree[idx]}`,
          lineNumber: 14
        });
        idx += idx & (-idx);
      }
    }

    // Build tree
    for (let i = 0; i < n; i++) {
      update(i, arr[i]);
    }

    // Perform prefix sum query
    function query(index: number): number {
      let idx = index + 1;
      let sum = 0;
      newSteps.push({
        array: [...arr],
        tree: [...tree],
        operation: 'query',
        index,
        value: 0,
        result: null,
        message: `Query prefix sum up to index ${index}`,
        lineNumber: 19
      });

      while (idx > 0) {
        sum += tree[idx];
        newSteps.push({
          array: [...arr],
          tree: [...tree],
          operation: 'query',
          index: idx - 1,
          value: tree[idx],
          result: sum,
          message: `sum += tree[${idx}] = ${tree[idx]}, total = ${sum}`,
          lineNumber: 23
        });
        idx -= idx & (-idx);
      }

      newSteps.push({
        array: [...arr],
        tree: [...tree],
        operation: 'query',
        index,
        value: 0,
        result: sum,
        message: `Prefix sum result: ${sum}`,
        lineNumber: 26
      });

      return sum;
    }

    query(3);

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
        <div className="bg-card rounded-lg p-6 border space-y-4">
          <h3 className="text-lg font-semibold">Fenwick Tree</h3>
          <h3 className="text-lg font-semibold">Original Array</h3>
          <div className="flex gap-2">
            {currentStep.array.map((val, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="text-xs text-muted-foreground mb-1">[{idx}]</div>
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold transition-all ${
                    idx === currentStep.index
                      ? 'bg-primary/20 border-primary'
                      : 'bg-blue-500/20 border-blue-500'
                  }`}
                >
                  {val}
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold">Fenwick Tree (1-indexed)</h3>
          <div className="flex gap-2">
            {currentStep.tree.slice(1).map((val, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="text-xs text-muted-foreground mb-1">[{idx + 1}]</div>
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold transition-all ${
                    idx === currentStep.index && currentStep.operation !== 'init'
                      ? 'bg-green-500/20 border-green-500'
                      : val !== 0
                      ? 'bg-blue-500/20 border-blue-500'
                      : 'bg-card border-border'
                  }`}
                >
                  {val}
                </div>
              </div>
            ))}
          </div>

          {currentStep.result !== null && (
            <div className="p-4 bg-green-500/10 border border-green-500 rounded">
              <p className="text-sm font-semibold">Prefix Sum Result: {currentStep.result}</p>
            </div>
          )}

          <div className="p-4 bg-muted rounded">
            <p className="text-sm">{currentStep.message}</p>
          </div>
        </div>

        <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
      </div>

      <VariablePanel
        variables={{
          'operation': currentStep.operation,
          'index': currentStep.index >= 0 ? currentStep.index : 'none',
          'value': currentStep.value,
          'result': currentStep.result !== null ? currentStep.result : 'pending'
        }}
      />
    </div>
  );
};
