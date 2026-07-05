import React, { useState, useMemo } from "react";
import { SimpleStepControls } from "../shared/SimpleStepControls";
import { VariablePanel } from "../shared/VariablePanel";
import { VisualizationCodePanel } from "../shared/VisualizationCodePanel";
import { VisualizationLayout } from "../shared/VisualizationLayout";
import { Card } from "@/components/ui/card";
import type { StepLineNumberMap, VisualizationLanguageMap } from "@/types/visualization";

interface Step {
  array: number[];
  tree: number[];
  operation: string;
  index: number | string;
  value: number | string;
  sum: number | string;
  message: string;
  pseudoStep: string;
  highlightedTreeIndex: number | null;
  highlightedArrayIndex: number | null;
}

const languages: VisualizationLanguageMap = {
  typescript: `function solution(nums: number[]): number {
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
}`,
  python: `def solution(nums):
    n = len(nums)
    tree = [0] * (n + 1)
    def update(index, value):
        index += 1
        while index <= n:
            tree[index] += value
            index += index & -index
    def query(index):
        index += 1
        s = 0
        while index > 0:
            s += tree[index]
            index -= index & -index
        return s
    for i in range(n):
        update(i, nums[i])
    return query(n - 1)`,
  java: `public static class Solution {
    public int solution(int[] nums) {
        int n = nums.length;
        int[] tree = new int[n + 1];
        for (int i = 0; i < n; i++) {
            update(tree, n, i, nums[i]);
        }
        return query(tree, n, n - 1);
    }
    void update(int[] tree, int n, int index, int value) {
        index++;
        while (index <= n) {
            tree[index] += value;
            index += index & -index;
        }
    }
    int query(int[] tree, int n, int index) {
        index++;
        int sum = 0;
        while (index > 0) {
            sum += tree[index];
            index -= index & -index;
        }
        return sum;
    }
}`,
  cpp: `class Solution {
public:
int update(vector<int>& tree, int n, int index, int value) {
    index++;
    while (index <= n) {
        tree[index] += value;
        index += index & -index;
    }
    return 0;
}
int query(vector<int>& tree, int index) {
    index++;
    int sum = 0;
    while (index > 0) {
        sum += tree[index];
        index -= index & -index;
    }
    return sum;
}
int solution(vector<int>& nums) {
    int n = nums.size();
    vector<int> tree(n + 1, 0);
    for (let i = 0; i < n; i++) {
        update(tree, n, i, nums[i]);
    }
    return query(tree, n - 1);
}
};`
};

export const FenwickTreeVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const nums = [3, 2, -1, 6, 5];
    const newSteps: Step[] = [];
    const n = nums.length;
    const tree: number[] = new Array(n + 1).fill(0);

    const lines: StepLineNumberMap = {
      typescript: [],
      python: [],
      java: [],
      cpp: []
    };

    const addLines = (ts: number, py: number, java: number, cpp: number) => {
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(java);
      lines.cpp!.push(cpp);
    };

    // Initial state
    newSteps.push({
      array: [...nums],
      tree: [...tree],
      operation: "init",
      index: "none",
      value: "none",
      sum: "none",
      message: "Initialize empty Fenwick Tree of size n+1 with all 0s.",
      pseudoStep: "SET tree = [0, 0, 0, 0, 0, 0] (size = n + 1)",
      highlightedTreeIndex: null,
      highlightedArrayIndex: null,
    });
    addLines(3, 3, 4, 22);

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
        pseudoStep: `FOR i = 0 TO n-1 (i = ${i})`,
        highlightedTreeIndex: null,
        highlightedArrayIndex: i,
      });
      addLines(20, 16, 5, 23);

      newSteps.push({
        array: [...nums],
        tree: [...tree],
        operation: "build",
        index: i,
        value: nums[i],
        sum: "none",
        message: `Call update(index = ${i}, value = ${nums[i]}).`,
        pseudoStep: `CALL update(index = ${i}, value = ${nums[i]})`,
        highlightedTreeIndex: null,
        highlightedArrayIndex: i,
      });
      addLines(21, 17, 6, 24);

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
        message: `Inside update(index = ${idx}, value = ${val}).`,
        pseudoStep: `FUNCTION update(index = ${idx}, value = ${val})`,
        highlightedTreeIndex: null,
        highlightedArrayIndex: idx,
      });
      addLines(4, 4, 10, 3);

      idx++;
      newSteps.push({
        array: [...nums],
        tree: [...tree],
        operation: "update",
        index: idx,
        value: val,
        sum: "none",
        message: `Convert to 1-based indexing: index = index + 1 = ${idx}.`,
        pseudoStep: `SET index = index + 1 (${idx})`,
        highlightedTreeIndex: idx,
        highlightedArrayIndex: null,
      });
      addLines(5, 5, 11, 4);

      while (idx <= n) {
        newSteps.push({
          array: [...nums],
          tree: [...tree],
          operation: "update",
          index: idx,
          value: val,
          sum: "none",
          message: `Check loop condition: index (${idx}) <= n (${n}).`,
          pseudoStep: `WHILE index <= n (${idx} <= ${n}) → YES ✓`,
          highlightedTreeIndex: idx,
          highlightedArrayIndex: null,
        });
        addLines(6, 6, 12, 5);

        tree[idx] += val;
        newSteps.push({
          array: [...nums],
          tree: [...tree],
          operation: "update",
          index: idx,
          value: val,
          sum: "none",
          message: `Add value ${val} to tree[${idx}]. tree[${idx}] becomes ${tree[idx]}.`,
          pseudoStep: `SET tree[${idx}] = tree[${idx}] + value (${tree[idx]})`,
          highlightedTreeIndex: idx,
          highlightedArrayIndex: null,
        });
        addLines(7, 7, 13, 6);

        const oldIdx = idx;
        idx += idx & -idx;
        newSteps.push({
          array: [...nums],
          tree: [...tree],
          operation: "update",
          index: idx,
          value: val,
          sum: "none",
          message: `Add LSB of index: ${oldIdx} + (${oldIdx} & -${oldIdx}) = ${idx}.`,
          pseudoStep: `SET index = index + (index & -index) (${idx})`,
          highlightedTreeIndex: idx <= n ? idx : null,
          highlightedArrayIndex: null,
        });
        addLines(8, 8, 14, 7);
      }

      newSteps.push({
        array: [...nums],
        tree: [...tree],
        operation: "update",
        index: idx,
        value: val,
        sum: "none",
        message: `Loop condition check: index (${idx}) <= n (${n}) → false. Loop terminates.`,
        pseudoStep: `WHILE index <= n (${idx} <= ${n}) → NO ✗`,
        highlightedTreeIndex: null,
        highlightedArrayIndex: null,
      });
      addLines(6, 6, 12, 5);
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
      message: `Fenwick Tree built. Now perform query to get sum up to index ${queryIdx}.`,
      pseudoStep: `CALL query(index = ${queryIdx})`,
      highlightedTreeIndex: null,
      highlightedArrayIndex: queryIdx,
    });
    addLines(23, 18, 8, 26);

    let qIdx = queryIdx;
    newSteps.push({
      array: [...nums],
      tree: [...tree],
      operation: "query",
      index: qIdx,
      value: "none",
      sum: "none",
      message: `Inside query(index = ${qIdx}).`,
      pseudoStep: `FUNCTION query(index = ${qIdx})`,
      highlightedTreeIndex: null,
      highlightedArrayIndex: null,
    });
    addLines(11, 9, 17, 11);

    qIdx++;
    newSteps.push({
      array: [...nums],
      tree: [...tree],
      operation: "query",
      index: qIdx,
      value: "none",
      sum: "none",
      message: `Convert to 1-based indexing: index = index + 1 = ${qIdx}.`,
      pseudoStep: `SET index = index + 1 (${qIdx})`,
      highlightedTreeIndex: qIdx,
      highlightedArrayIndex: null,
    });
    addLines(12, 10, 18, 12);

    let currentSum = 0;
    newSteps.push({
      array: [...nums],
      tree: [...tree],
      operation: "query",
      index: qIdx,
      value: "none",
      sum: currentSum,
      message: "Initialize prefix sum accumulator variable sum = 0.",
      pseudoStep: "SET sum = 0",
      highlightedTreeIndex: qIdx,
      highlightedArrayIndex: null,
    });
    addLines(13, 11, 19, 13);

    while (qIdx > 0) {
      newSteps.push({
        array: [...nums],
        tree: [...tree],
        operation: "query",
        index: qIdx,
        value: "none",
        sum: currentSum,
        message: `Check query condition: index (${qIdx}) > 0.`,
        pseudoStep: `WHILE index > 0 (${qIdx} > 0) → YES ✓`,
        highlightedTreeIndex: qIdx,
        highlightedArrayIndex: null,
      });
      addLines(14, 12, 20, 14);

      currentSum += tree[qIdx];
      newSteps.push({
        array: [...nums],
        tree: [...tree],
        operation: "query",
        index: qIdx,
        value: "none",
        sum: currentSum,
        message: `Add tree[${qIdx}] (${tree[qIdx]}) to sum. sum is now ${currentSum}.`,
        pseudoStep: `SET sum = sum + tree[${qIdx}] (${currentSum})`,
        highlightedTreeIndex: qIdx,
        highlightedArrayIndex: null,
      });
      addLines(15, 13, 21, 15);

      const oldQIdx = qIdx;
      qIdx -= qIdx & -qIdx;
      newSteps.push({
        array: [...nums],
        tree: [...tree],
        operation: "query",
        index: qIdx,
        value: "none",
        sum: currentSum,
        message: `Subtract LSB of index: ${oldQIdx} - (${oldQIdx} & -${oldQIdx}) = ${qIdx}.`,
        pseudoStep: `SET index = index - (index & -index) (${qIdx})`,
        highlightedTreeIndex: qIdx > 0 ? qIdx : null,
        highlightedArrayIndex: null,
      });
      addLines(16, 14, 22, 16);
    }

    newSteps.push({
      array: [...nums],
      tree: [...tree],
      operation: "query",
      index: qIdx,
      value: "none",
      sum: currentSum,
      message: `Loop condition check: index (${qIdx}) > 0 → false. Loop terminates.`,
      pseudoStep: `WHILE index > 0 (${qIdx} > 0) → NO ✗`,
      highlightedTreeIndex: null,
      highlightedArrayIndex: null,
    });
    addLines(14, 12, 20, 14);

    newSteps.push({
      array: [...nums],
      tree: [...tree],
      operation: "query",
      index: qIdx,
      value: "none",
      sum: currentSum,
      message: `Return prefix sum result: ${currentSum}.`,
      pseudoStep: `RETURN sum (${currentSum})`,
      highlightedTreeIndex: null,
      highlightedArrayIndex: null,
    });
    addLines(18, 15, 24, 18);

    newSteps.push({
      array: [...nums],
      tree: [...tree],
      operation: "query",
      index: queryIdx,
      value: "none",
      sum: currentSum,
      message: `Prefix sum query completed for index ${queryIdx}. Result is ${currentSum}.`,
      pseudoStep: `RETURN sum (${currentSum})`,
      highlightedTreeIndex: null,
      highlightedArrayIndex: null,
    });
    addLines(23, 18, 8, 26);

    return { steps: newSteps, stepLineNumbers: lines };
  }, []);

  const step = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  if (!step) return null;

  return (
    <VisualizationLayout
      leftContent={
        <div className="flex flex-col h-full justify-between gap-6">
          <div className="space-y-6">
            <Card className="bg-card rounded-xl p-6 border shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-widest">Original Array</h3>
                <div className="flex flex-wrap gap-2">
                  {step.array.map((val, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="text-[10px] text-muted-foreground mb-1 font-mono">
                        [{idx}]
                      </div>
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 text-xs font-bold transition-all duration-200 ${idx === step.highlightedArrayIndex
                          ? "bg-primary/20 border-primary scale-105 shadow-md"
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
                <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-widest">Fenwick Tree (1-indexed)</h3>
                <div className="flex flex-wrap gap-2">
                  {step.tree.slice(1).map((val, idx) => {
                    const treeIdx = idx + 1;
                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <div className="text-[10px] text-muted-foreground mb-1 font-mono">
                          [{treeIdx}]
                        </div>
                        <div
                          className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 text-xs font-bold transition-all duration-200 ${treeIdx === step.highlightedTreeIndex
                            ? "bg-green-500/20 border-green-500 scale-105 shadow-md"
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
            </Card>
          </div>

          <div className="space-y-4 mt-auto">
            <Card className="p-4 bg-primary/5 border-primary/20">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Step Explanation</h4>
              <p className="text-sm text-foreground leading-relaxed font-medium min-h-[40px]">{step.message}</p>
            </Card>
          </div>
        </div>
      }
      rightContent={
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={() => setCurrentStepIndex(0)}
          />
          <VariablePanel
            variables={{
              operation: step.operation,
              index: step.index,
              value: step.value,
              currentSum: step.sum,
            }}
          />
        </div>
      }
      controls={
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
      }
    />
  );
};
