import React, { useEffect, useRef, useState } from 'react';

import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  array: number[];
  tree: (number | null)[];
  queryLeft: number;
  queryRight: number;
  result: number | null;
  message: string;
  lineNumber: number;
}

export const SegmentTreeVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `class SegmentTree {
  tree: number[];
  n: number;
  
  constructor(arr: number[]) {
    this.n = arr.length;
    this.tree = new Array(4 * this.n);
    this.build(arr, 0, 0, this.n - 1);
  }
  
  build(arr: number[], node: number, start: number, end: number) {
    if (start === end) {
      this.tree[node] = arr[start];
    } else {
      const mid = Math.floor((start + end) / 2);
      this.build(arr, 2 * node + 1, start, mid);
      this.build(arr, 2 * node + 2, mid + 1, end);
      this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
    }
  }
  
  query(node: number, start: number, end: number, l: number, r: number): number {
    if (r < start || end < l) return 0;
    if (l <= start && end <= r) return this.tree[node];
    const mid = Math.floor((start + end) / 2);
    return this.query(2 * node + 1, start, mid, l, r) + 
           this.query(2 * node + 2, mid + 1, end, l, r);
  }
}`;

  const generateSteps = () => {
    const arr = [1, 3, 5, 7, 9, 11];
    const newSteps: Step[] = [];
    const n = arr.length;
    const tree: (number | null)[] = new Array(4 * n).fill(null);

    function build(node: number, start: number, end: number) {
      if (start === end) {
        tree[node] = arr[start];
        newSteps.push({
          array: arr,
          tree: [...tree],
          queryLeft: -1,
          queryRight: -1,
          result: null,
          message: `Leaf node ${node}: arr[${start}] = ${arr[start]}`,
          lineNumber: 11
        });
      } else {
        const mid = Math.floor((start + end) / 2);
        build(2 * node + 1, start, mid);
        build(2 * node + 2, mid + 1, end);
        tree[node] = (tree[2 * node + 1] || 0) + (tree[2 * node + 2] || 0);
        newSteps.push({
          array: arr,
          tree: [...tree],
          queryLeft: -1,
          queryRight: -1,
          result: null,
          message: `Internal node ${node}: sum of children = ${tree[node]}`,
          lineNumber: 16
        });
      }
    }

    build(0, 0, n - 1);

    // Perform a range query
    const queryL = 1;
    const queryR = 4;
    newSteps.push({
      array: arr,
      tree: [...tree],
      queryLeft: queryL,
      queryRight: queryR,
      result: null,
      message: `Query sum from index ${queryL} to ${queryR}`,
      lineNumber: 20
    });

    function query(node: number, start: number, end: number, l: number, r: number): number {
      if (r < start || end < l) return 0;
      if (l <= start && end <= r) {
        newSteps.push({
          array: arr,
          tree: [...tree],
          queryLeft: l,
          queryRight: r,
          result: tree[node] || 0,
          message: `Node ${node} fully covered, return ${tree[node]}`,
          lineNumber: 22
        });
        return tree[node] || 0;
      }
      const mid = Math.floor((start + end) / 2);
      const leftSum = query(2 * node + 1, start, mid, l, r);
      const rightSum = query(2 * node + 2, mid + 1, end, l, r);
      return leftSum + rightSum;
    }

    const result = query(0, 0, n - 1, queryL, queryR);
    newSteps.push({
      array: arr,
      tree: [...tree],
      queryLeft: queryL,
      queryRight: queryR,
      result,
      message: `Query result: ${result}`,
      lineNumber: 26
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
        <h3 className="text-lg font-semibold mb-4">Input Array</h3>
        <div className="flex gap-2 mb-6">
          {currentStep.array.map((val, idx) => (
            <div
              key={idx}
              className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold transition-all ${
                idx >= currentStep.queryLeft && idx <= currentStep.queryRight && currentStep.queryLeft >= 0
                  ? 'bg-primary/20 border-primary'
                  : 'bg-card border-border'
              }`}
            >
              {val}
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-4">Segment Tree (Array Representation)</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {currentStep.tree.slice(0, 15).map((val, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="text-xs text-muted-foreground mb-1">[{idx}]</div>
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold transition-all ${
                  val !== null ? 'bg-blue-500/20 border-blue-500' : 'bg-muted/20 border-border'
                }`}
              >
                {val !== null ? val : '-'}
              </div>
            </div>
          ))}
        </div>

        {currentStep.result !== null && (
          <div className="mb-4 p-4 bg-green-500/10 border border-green-500 rounded">
            <p className="text-sm font-semibold">Query Result: {currentStep.result}</p>
          </div>
        )}

        <div className="mt-4 p-4 bg-muted rounded">
          <p className="text-sm">{currentStep.message}</p>
        </div>
                <div className="mt-4 p-4 bg-muted rounded">
  
      <VariablePanel
        variables={{
          'array size': currentStep.array.length,
          'query range': currentStep.queryLeft >= 0 ? `[${currentStep.queryLeft}, ${currentStep.queryRight}]` : 'none',
          'result': currentStep.result !== null ? currentStep.result : 'pending'
        }}
      />
        </div>
      </div>
      <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />

      </div>

    </div>
  );
};
