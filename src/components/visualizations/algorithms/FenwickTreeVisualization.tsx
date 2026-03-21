import React, { useEffect, useRef, useState } from "react";

import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";

interface Step {
  array: number[];
  tree: number[];
  operation: string;
  index: number | string;
  value: number | string;
  sum: number | string;
  message: string;
  lineNumber: number;
  highlightedTreeIndex: number | null;
  highlightedArrayIndex: number | null;
}

export const FenwickTreeVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function solution(nums: number[]): number {
  const n = nums.length;
  const tree = new Array<number>(n + 1).fill(0);

  function update(index: number, value: number) {
    index++;
    while (index <= n) {
      tree[index] += value;
      index += index & -index;
    }
  }

  function query(index: number): number {
    index++;
    let sum = 0;
    while (index > 0) {
      sum += tree[index];
      index -= index & -index;
    }
    return sum;
  }

  for (let i = 0; i < n; i++) {
    update(i, nums[i]);
  }

  return query(n - 1);
}`;

  const generateSteps = () => {
    const nums = [3, 2, -1, 6, 5];
    const newSteps: Step[] = [];
    const n = nums.length;
    const tree: number[] = new Array(n + 1).fill(0);

    // Initial state
    newSteps.push({
      array: [...nums],
      tree: [...tree],
      operation: "init",
      index: "none",
      value: "none",
      sum: "none",
      message: "Initialize the Fenwick Tree process.",
      lineNumber: 1,
      highlightedTreeIndex: null,
      highlightedArrayIndex: null,
    });

    newSteps.push({
      array: [...nums],
      tree: [...tree],
      operation: "init",
      index: "none",
      value: "none",
      sum: "none",
      message: `Set n = nums.length (${n}).`,
      lineNumber: 2,
      highlightedTreeIndex: null,
      highlightedArrayIndex: null,
    });

    newSteps.push({
      array: [...nums],
      tree: [...tree],
      operation: "init",
      index: "none",
      value: "none",
      sum: "none",
      message: "Initialize tree array with size n+1, filled with 0s.",
      lineNumber: 3,
      highlightedTreeIndex: null,
      highlightedArrayIndex: null,
    });

    // Build phase
    for (let i = 0; i < n; i++) {
      newSteps.push({
        array: [...nums],
        tree: [...tree],
        operation: "build",
        index: i,
        value: nums[i],
        sum: "none",
        message: `Loop iteration i = ${i}. Preparing to update tree with nums[${i}] = ${nums[i]}.`,
        lineNumber: 23,
        highlightedTreeIndex: null,
        highlightedArrayIndex: i,
      });

      newSteps.push({
        array: [...nums],
        tree: [...tree],
        operation: "build",
        index: i,
        value: nums[i],
        sum: "none",
        message: `Call update(${i}, ${nums[i]}).`,
        lineNumber: 24,
        highlightedTreeIndex: null,
        highlightedArrayIndex: i,
      });

      // Update function
      let idx = i;
      let val = nums[i];

      newSteps.push({
        array: [...nums],
        tree: [...tree],
        operation: "update",
        index: idx,
        value: val,
        sum: "none",
        message: `Inside update(index=${idx}, value=${val}).`,
        lineNumber: 5,
        highlightedTreeIndex: null,
        highlightedArrayIndex: idx,
      });

      idx++;
      newSteps.push({
        array: [...nums],
        tree: [...tree],
        operation: "update",
        index: idx,
        value: val,
        sum: "none",
        message: `Increment index by 1 for 1-based indexing. index = ${idx}.`,
        lineNumber: 6,
        highlightedTreeIndex: idx,
        highlightedArrayIndex: null,
      });

      while (idx <= n) {
        newSteps.push({
          array: [...nums],
          tree: [...tree],
          operation: "update",
          index: idx,
          value: val,
          sum: "none",
          message: `Check if index (${idx}) <= n (${n}).`,
          lineNumber: 7,
          highlightedTreeIndex: idx,
          highlightedArrayIndex: null,
        });

        tree[idx] += val;
        newSteps.push({
          array: [...nums],
          tree: [...tree],
          operation: "update",
          index: idx,
          value: val,
          sum: "none",
          message: `Add value ${val} to tree[${idx}]. tree[${idx}] is now ${tree[idx]}.`,
          lineNumber: 8,
          highlightedTreeIndex: idx,
          highlightedArrayIndex: null,
        });

        const oldIdx = idx;
        idx += idx & -idx;
        newSteps.push({
          array: [...nums],
          tree: [...tree],
          operation: "update",
          index: idx,
          value: val,
          sum: "none",
          message: `Update index: ${oldIdx} + (${oldIdx} & ${-oldIdx}) = ${idx}.`,
          lineNumber: 9,
          highlightedTreeIndex: idx <= n ? idx : null,
          highlightedArrayIndex: null,
        });
      }

      newSteps.push({
        array: [...nums],
        tree: [...tree],
        operation: "update",
        index: idx,
        value: val,
        sum: "none",
        message: `index (${idx}) > n (${n}), loop terminates.`,
        lineNumber: 7,
        highlightedTreeIndex: null,
        highlightedArrayIndex: null,
      });
    }

    // Query phase
    const queryIdx = n - 1;
    newSteps.push({
      array: [...nums],
      tree: [...tree],
      operation: "query",
      index: queryIdx,
      value: "none",
      sum: "none",
      message: `Finished building tree. Now query prefix sum up to index ${queryIdx}.`,
      lineNumber: 27,
      highlightedTreeIndex: null,
      highlightedArrayIndex: queryIdx,
    });

    let qIdx = queryIdx;
    newSteps.push({
      array: [...nums],
      tree: [...tree],
      operation: "query",
      index: qIdx,
      value: "none",
      sum: "none",
      message: `Inside query(index=${qIdx}).`,
      lineNumber: 13,
      highlightedTreeIndex: null,
      highlightedArrayIndex: null,
    });

    qIdx++;
    newSteps.push({
      array: [...nums],
      tree: [...tree],
      operation: "query",
      index: qIdx,
      value: "none",
      sum: "none",
      message: `Increment index by 1. index = ${qIdx}.`,
      lineNumber: 14,
      highlightedTreeIndex: qIdx,
      highlightedArrayIndex: null,
    });

    let currentSum = 0;
    newSteps.push({
      array: [...nums],
      tree: [...tree],
      operation: "query",
      index: qIdx,
      value: "none",
      sum: currentSum,
      message: `Initialize sum = 0.`,
      lineNumber: 15,
      highlightedTreeIndex: qIdx,
      highlightedArrayIndex: null,
    });

    while (qIdx > 0) {
      newSteps.push({
        array: [...nums],
        tree: [...tree],
        operation: "query",
        index: qIdx,
        value: "none",
        sum: currentSum,
        message: `Check if index (${qIdx}) > 0.`,
        lineNumber: 16,
        highlightedTreeIndex: qIdx,
        highlightedArrayIndex: null,
      });

      currentSum += tree[qIdx];
      newSteps.push({
        array: [...nums],
        tree: [...tree],
        operation: "query",
        index: qIdx,
        value: "none",
        sum: currentSum,
        message: `Add tree[${qIdx}] (${tree[qIdx]}) to sum. sum = ${currentSum}.`,
        lineNumber: 17,
        highlightedTreeIndex: qIdx,
        highlightedArrayIndex: null,
      });

      const oldQIdx = qIdx;
      qIdx -= qIdx & -qIdx;
      newSteps.push({
        array: [...nums],
        tree: [...tree],
        operation: "query",
        index: qIdx,
        value: "none",
        sum: currentSum,
        message: `Update index: ${oldQIdx} - (${oldQIdx} & ${-oldQIdx}) = ${qIdx}.`,
        lineNumber: 18,
        highlightedTreeIndex: qIdx > 0 ? qIdx : null,
        highlightedArrayIndex: null,
      });
    }

    newSteps.push({
      array: [...nums],
      tree: [...tree],
      operation: "query",
      index: qIdx,
      value: "none",
      sum: currentSum,
      message: `index is 0, loop terminates.`,
      lineNumber: 16,
      highlightedTreeIndex: null,
      highlightedArrayIndex: null,
    });

    newSteps.push({
      array: [...nums],
      tree: [...tree],
      operation: "query",
      index: qIdx,
      value: "none",
      sum: currentSum,
      message: `Return final sum: ${currentSum}.`,
      lineNumber: 20,
      highlightedTreeIndex: null,
      highlightedArrayIndex: null,
    });

    newSteps.push({
      array: [...nums],
      tree: [...tree],
      operation: "query",
      index: queryIdx,
      value: "none",
      sum: currentSum,
      message: `Prefix sum result for index ${queryIdx} is ${currentSum}.`,
      lineNumber: 27,
      highlightedTreeIndex: null,
      highlightedArrayIndex: null,
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
    if (currentStepIndex < steps.length - 1)
      setCurrentStepIndex(currentStepIndex + 1);
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
        <div className="bg-card rounded-xl p-6 border shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Original Array</h3>
            <div className="flex flex-wrap gap-2">
              {currentStep.array.map((val, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    [{idx}]
                  </div>
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-medium transition-all duration-300 ${idx === currentStep.highlightedArrayIndex
                      ? "bg-primary/20 border-primary scale-110 shadow-md"
                      : "bg-muted/30 border-border"
                      }`}
                  >
                    {val}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Fenwick Tree (1-indexed)</h3>
            <div className="flex flex-wrap gap-2">
              {currentStep.tree.slice(1).map((val, idx) => {
                const treeIdx = idx + 1;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="text-xs text-muted-foreground mb-1">
                      [{treeIdx}]
                    </div>
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-medium transition-all duration-300 ${treeIdx === currentStep.highlightedTreeIndex
                        ? "bg-green-500/20 border-green-500 scale-110 shadow-md"
                        : val !== 0
                          ? "bg-blue-500/10 border-blue-500/30"
                          : "bg-muted/10 border-border/50"
                        }`}
                    >
                      {val}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-sm leading-relaxed">{currentStep.message}</p>
          </div>

          <div className="rounded-lg">
            <VariablePanel
              variables={{
                operation: currentStep.operation,
                index: currentStep.index,
                value: currentStep.value,
                currentSum: currentStep.sum,
              }}
            />
          </div>
        </div>

        <AnimatedCodeEditor
          code={code}
          highlightedLines={[currentStep.lineNumber]}
          language="typescript"
        />
      </div>
    </div>
  );
};
