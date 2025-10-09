import React, { useEffect, useRef, useState } from 'react';

import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  array: number[];
  table: number[][];
  building: boolean;
  queryL: number;
  queryR: number;
  result: number | null;
  message: string;
  lineNumber: number;
}

export const SparseTableVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `class SparseTable {
  table: number[][];
  n: number;
  
  constructor(arr: number[]) {
    this.n = arr.length;
    const logN = Math.floor(Math.log2(this.n)) + 1;
    this.table = Array(this.n).fill(0).map(() => Array(logN).fill(0));
    
    // Base case: intervals of length 1
    for (let i = 0; i < this.n; i++) {
      this.table[i][0] = arr[i];
    }
    
    // Build table for intervals of length 2^j
    for (let j = 1; j < logN; j++) {
      for (let i = 0; i + (1 << j) <= this.n; i++) {
        this.table[i][j] = Math.min(
          this.table[i][j - 1],
          this.table[i + (1 << (j - 1))][j - 1]
        );
      }
    }
  }
  
  query(l: number, r: number): number {
    const j = Math.floor(Math.log2(r - l + 1));
    return Math.min(this.table[l][j], this.table[r - (1 << j) + 1][j]);
  }
}`;

  const generateSteps = () => {
    const arr = [2, 4, 3, 1, 6, 7, 8, 9];
    const newSteps: Step[] = [];
    const n = arr.length;
    const logN = Math.floor(Math.log2(n)) + 1;
    const table: number[][] = Array(n).fill(0).map(() => Array(logN).fill(0));

    newSteps.push({
      array: arr,
      table: table.map(row => [...row]),
      building: true,
      queryL: -1,
      queryR: -1,
      result: null,
      message: 'Building Sparse Table for range minimum queries',
      lineNumber: 5
    });

    // Base case
    for (let i = 0; i < n; i++) {
      table[i][0] = arr[i];
    }

    newSteps.push({
      array: arr,
      table: table.map(row => [...row]),
      building: true,
      queryL: -1,
      queryR: -1,
      result: null,
      message: 'Base case: intervals of length 1',
      lineNumber: 11
    });

    // Build table
    for (let j = 1; j < logN; j++) {
      for (let i = 0; i + (1 << j) <= n; i++) {
        table[i][j] = Math.min(
          table[i][j - 1],
          table[i + (1 << (j - 1))][j - 1]
        );
      }
      newSteps.push({
        array: arr,
        table: table.map(row => [...row]),
        building: true,
        queryL: -1,
        queryR: -1,
        result: null,
        message: `Built intervals of length ${1 << j}`,
        lineNumber: 17
      });
    }

    // Perform a query
    const l = 2, r = 5;
    const j = Math.floor(Math.log2(r - l + 1));
    const result = Math.min(table[l][j], table[r - (1 << j) + 1][j]);

    newSteps.push({
      array: arr,
      table: table.map(row => [...row]),
      building: false,
      queryL: l,
      queryR: r,
      result,
      message: `Query min in range [${l}, ${r}]: result = ${result}`,
      lineNumber: 27
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
        <h3 className="text-lg font-semibold mb-4">Array</h3>
        <div className="flex gap-2 mb-6">
          {currentStep.array.map((val, idx) => (
            <div
              key={idx}
              className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold transition-all ${
                idx >= currentStep.queryL && idx <= currentStep.queryR && currentStep.queryL >= 0
                  ? 'bg-primary/20 border-primary'
                  : 'bg-card border-border'
              }`}
            >
              {val}
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-4">Sparse Table (2D: [index][power])</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border p-2 bg-muted">i\j</th>
                {currentStep.table[0].map((_, j) => (
                  <th key={j} className="border p-2 bg-muted">2^{j}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentStep.table.map((row, i) => (
                <tr key={i}>
                  <td className="border p-2 bg-muted font-bold">{i}</td>
                  {row.map((val, j) => (
                    <td
                      key={j}
                      className={`border p-2 text-center ${
                        val !== 0 ? 'bg-blue-500/10 font-bold' : ''
                      }`}
                    >
                      {val !== 0 ? val : '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {currentStep.result !== null && (
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500 rounded">
            <p className="text-sm font-semibold">
              Query [{currentStep.queryL}, {currentStep.queryR}]: Minimum = {currentStep.result}
            </p>
          </div>
        )}

        <div className="mt-4 p-4 bg-muted rounded">
          <p className="text-sm">{currentStep.message}</p>
        </div>
        
        <div className="mt-4 p-4 bg-muted rounded">
               <VariablePanel
        variables={{
          'array size': currentStep.array.length,
          'query range': currentStep.queryL >= 0 ? `[${currentStep.queryL}, ${currentStep.queryR}]` : 'none',
          'result': currentStep.result !== null ? currentStep.result : 'building'
        }}
      />
        </div>

      </div>
      <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />

      </div>


    </div>
  );
};
