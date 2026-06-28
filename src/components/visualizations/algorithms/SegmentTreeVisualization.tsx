import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  nums: number[];
  tree: (number | null)[];
  node: number;
  start: number;
  end: number;
  mid?: number;
  left?: number;
  right?: number;
  p1?: number;
  p2?: number;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
  phase: 'init' | 'build' | 'query' | 'result' | 'done';
}

const languages: VisualizationLanguageMap = {
  typescript: `function solution(nums: number[], left: number, right: number): number {
  const n = nums.length;
  const tree = new Array<number>(4 * n).fill(0);
  buildTree(tree, nums, 0, 0, n - 1);
  return queryTree(tree, 0, 0, n - 1, left, right);
}
function buildTree(
  tree: number[],
  nums: number[],
  node: number,
  start: number,
  end: number
): void {
  if (start === end) {
    tree[node] = nums[start];
    return;
  }
  const mid = Math.floor((start + end) / 2);
  buildTree(tree, nums, 2 * node + 1, start, mid);
  buildTree(tree, nums, 2 * node + 2, mid + 1, end);
  tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
}
function queryTree(
  tree: number[],
  node: number,
  start: number,
  end: number,
  left: number,
  right: number
): number {
  if (left > end || right < start) return 0;
  if (left <= start && end <= right) return tree[node];
  const mid = Math.floor((start + end) / 2);
  const p1 = queryTree(tree, 2 * node + 1, start, mid, left, right);
  const p2 = queryTree(tree, 2 * node + 2, mid + 1, end, left, right);
  return p1 + p2;
}`,
  python: `def buildTree(tree, nums, node, start, end):
    if start == end:
        tree[node] = nums[start]
        return
    mid = (start + end) // 2
    buildTree(tree, nums, 2 * node + 1, start, mid)
    buildTree(tree, nums, 2 * node + 2, mid + 1, end)
    tree[node] = tree[2 * node + 1] + tree[2 * node + 2]
def queryTree(tree, node, start, end, left, right):
    if left > end or right < start:
        return 0
    if left <= start and end <= right:
        return tree[node]
    mid = (start + end) // 2
    p1 = queryTree(tree, 2 * node + 1, start, mid, left, right)
    p2 = queryTree(tree, 2 * node + 2, mid + 1, end, left, right)
    return p1 + p2
def solution(nums, left, right):
    n = len(nums)
    tree = [0] * (4 * n)
    buildTree(tree, nums, 0, 0, n - 1)
    return queryTree(tree, 0, 0, n - 1, left, right)`,
  java: `public static class Solution {
    public int solution(int[] nums, int left, int right) {
        int n = nums.length;
        int[] tree = new int[4 * n];
        buildTree(tree, nums, 0, 0, n - 1);
        return queryTree(tree, 0, 0, n - 1, left, right);
    }
    void buildTree(int[] tree, int[] nums, int node, int start, int end) {
        if (start == end) {
            tree[node] = nums[start];
            return;
        }
        int mid = (start + end) / 2;
        buildTree(tree, nums, 2 * node + 1, start, mid);
        buildTree(tree, nums, 2 * node + 2, mid + 1, end);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }
    int queryTree(int[] tree, int node, int start, int end, int left, int right) {
        if (left > end || right < start)
            return 0;
        if (left <= start && end <= right)
            return tree[node];
        int mid = (start + end) / 2;
        int p1 = queryTree(tree, 2 * node + 1, start, mid, left, right);
        int p2 = queryTree(tree, 2 * node + 2, mid + 1, end, left, right);
        return p1 + p2;
    }
}`,
  cpp: `class Solution {
    public:
    int solution(vector<int>& nums, int left, int right) {
        int n = nums.size();
        vector<int> tree(4 * n, 0);
        buildTree(tree, nums, 0, 0, n - 1);
        return queryTree(tree, 0, 0, n - 1, left, right);
    }
    void buildTree(vector<int>& tree, vector<int>& nums, int node, int start, int end) {
        if (start == end) {
            tree[node] = nums[start];
            return;
        }
        int mid = (start + end) / 2;
        buildTree(tree, nums, 2 * node + 1, start, mid);
        buildTree(tree, nums, 2 * node + 2, mid + 1, end);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }
    int queryTree(vector<int>& tree, int node, int start, int end, int left, int right) {
        if (left > end || right < start)
            return 0;
        if (left <= start && end <= right)
            return tree[node];
        int mid = (start + end) / 2;
        int p1 = queryTree(tree, 2 * node + 1, start, mid, left, right);
        int p2 = queryTree(tree, 2 * node + 2, mid + 1, end, left, right);
        return p1 + p2;
    }
};`
};

export const SegmentTreeVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const nums = [1, 3, 5, 7];
  const queryRange = { left: 1, right: 3 };

  const { steps, stepLineNumbers } = useMemo(() => {
    const s: Step[] = [];
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

    const tree: (number | null)[] = new Array(4 * nums.length).fill(null);

    // Initial step
    s.push({
      nums, tree: [...tree], node: 0, start: 0, end: nums.length - 1,
      explanation: "Initialize input array and empty segment tree.",
      pseudoStep: "SET tree = [0, ..., 0] (size = 4 * n)",
      variables: { nums: `[${nums.join(',')}]`, n: nums.length },
      phase: 'init'
    });
    addLines(3, 20, 4, 5);

    const buildTree = (treeArr: number[], numsArr: number[], node: number, start: number, end: number) => {
      s.push({
        nums: numsArr, tree: [...treeArr], node, start, end,
        explanation: `Building tree for range [${start}, ${end}] at node ${node}.`,
        pseudoStep: `CALL buildTree(node = ${node}, start = ${start}, end = ${end})`,
        variables: { node, start, end },
        phase: 'build'
      });
      addLines(13, 1, 8, 9);

      if (start === end) {
        treeArr[node] = numsArr[start];
        s.push({
          nums: numsArr, tree: [...treeArr], node, start, end,
          explanation: `Leaf node reached: index ${start} (value ${numsArr[start]}). Setting tree[${node}] = ${numsArr[start]}.`,
          pseudoStep: `IF start == end → SET tree[${node}] = nums[${start}] (${numsArr[start]})`,
          variables: { node, start, value: numsArr[start] },
          phase: 'build'
        });
        addLines(15, 3, 10, 11);
        return;
      }

      const mid = Math.floor((start + end) / 2);
      s.push({
        nums: numsArr, tree: [...treeArr], node, start, end, mid,
        explanation: `Calculate mid = floor((${start} + ${end}) / 2) = ${mid}.`,
        pseudoStep: `SET mid = (start + end) / 2 (mid = ${mid})`,
        variables: { start, end, mid },
        phase: 'build'
      });
      addLines(18, 5, 13, 14);

      s.push({
        nums: numsArr, tree: [...treeArr], node, start, end, mid,
        explanation: `Recursively build left subtree for range [${start}, ${mid}].`,
        pseudoStep: `CALL buildTree(leftChild = ${2 * node + 1}, start = ${start}, mid = ${mid})`,
        variables: { node: 2 * node + 1, start, end: mid },
        phase: 'build'
      });
      addLines(19, 6, 14, 15);
      buildTree(treeArr, numsArr, 2 * node + 1, start, mid);

      s.push({
        nums: numsArr, tree: [...treeArr], node, start, end, mid,
        explanation: `Recursively build right subtree for range [${mid + 1}, ${end}].`,
        pseudoStep: `CALL buildTree(rightChild = ${2 * node + 2}, mid+1 = ${mid + 1}, end = ${end})`,
        variables: { node: 2 * node + 2, start: mid + 1, end },
        phase: 'build'
      });
      addLines(20, 7, 15, 16);
      buildTree(treeArr, numsArr, 2 * node + 2, mid + 1, end);

      treeArr[node] = treeArr[2 * node + 1] + treeArr[2 * node + 2];
      s.push({
        nums: numsArr, tree: [...treeArr], node, start, end, mid,
        explanation: `Set node tree[${node}] to sum of children: ${treeArr[2 * node + 1]} + ${treeArr[2 * node + 2]} = ${treeArr[node]}.`,
        pseudoStep: `SET tree[${node}] = tree[left] + tree[right] (${treeArr[2 * node + 1]} + ${treeArr[2 * node + 2]} = ${treeArr[node]})`,
        variables: { node, leftChild: treeArr[2 * node + 1], rightChild: treeArr[2 * node + 2], sum: treeArr[node] },
        phase: 'build'
      });
      addLines(21, 8, 16, 17);
    };

    const queryTree = (treeArr: number[], node: number, start: number, end: number, left: number, right: number): number => {
      s.push({
        nums, tree: [...treeArr], node, start, end, left, right,
        explanation: `Querying range [${left}, ${right}] against node ${node} (range [${start}, ${end}]).`,
        pseudoStep: `CALL queryTree(node = ${node}, [${start}, ${end}], query = [${left}, ${right}])`,
        variables: { node, start, end, left, right },
        phase: 'query'
      });
      addLines(30, 9, 18, 19);

      if (left > end || right < start) {
        s.push({
          nums, tree: [...treeArr], node, start, end, left, right,
          explanation: `Query range [${left}, ${right}] is completely outside segment [${start}, ${end}]. Returning 0.`,
          pseudoStep: "IF query outside segment → RETURN 0",
          variables: { left, right, start, end },
          phase: 'query'
        });
        addLines(31, 10, 19, 20);
        return 0;
      }

      if (left <= start && end <= right) {
        s.push({
          nums, tree: [...treeArr], node, start, end, left, right,
          explanation: `Query range [${left}, ${right}] fully covers segment [${start}, ${end}]. Returning tree[${node}] = ${treeArr[node]}.`,
          pseudoStep: `IF segment fully inside query → RETURN tree[${node}] (${treeArr[node]})`,
          variables: { left, start, end, right, value: treeArr[node] },
          phase: 'query'
        });
        addLines(32, 12, 21, 22);
        return treeArr[node];
      }

      const mid = Math.floor((start + end) / 2);
      s.push({
        nums, tree: [...treeArr], node, start, end, left, right, mid,
        explanation: `Partial overlap. Split range using mid = ${mid}.`,
        pseudoStep: `SET mid = (start + end) / 2 (mid = ${mid})`,
        variables: { mid },
        phase: 'query'
      });
      addLines(33, 14, 23, 24);

      s.push({
        nums, tree: [...treeArr], node, start, end, left, right, mid,
        explanation: `Recursively query left child for range [${left}, ${right}].`,
        pseudoStep: `SET p1 = CALL queryTree(leftChild = ${2 * node + 1}, [${start}, ${mid}])`,
        variables: { node: 2 * node + 1, start, end: mid },
        phase: 'query'
      });
      addLines(34, 15, 24, 25);
      const p1 = queryTree(treeArr, 2 * node + 1, start, mid, left, right);

      s.push({
        nums, tree: [...treeArr], node, start, end, left, right, mid, p1,
        explanation: `Recursively query right child for range [${left}, ${right}].`,
        pseudoStep: `SET p2 = CALL queryTree(rightChild = ${2 * node + 2}, [${mid + 1}, ${end}])`,
        variables: { node: 2 * node + 2, start: mid + 1, end, p1 },
        phase: 'query'
      });
      addLines(35, 16, 25, 26);
      const p2 = queryTree(treeArr, 2 * node + 2, mid + 1, end, left, right);

      s.push({
        nums, tree: [...treeArr], node, start, end, left, right, mid, p1, p2,
        explanation: `Combine results from children: ${p1} + ${p2} = ${p1 + p2}.`,
        pseudoStep: `RETURN p1 + p2 (${p1} + ${p2} = ${p1 + p2})`,
        variables: { p1, p2, sum: p1 + p2 },
        phase: 'query'
      });
      addLines(36, 17, 26, 27);
      return p1 + p2;
    };

    const tempTree = new Array(4 * nums.length).fill(0);
    buildTree(tempTree, nums, 0, 0, nums.length - 1);

    s.push({
      nums, tree: [...tempTree], node: 0, start: 0, end: nums.length - 1, left: queryRange.left, right: queryRange.right,
      explanation: `Starting range sum query from index ${queryRange.left} to ${queryRange.right}.`,
      pseudoStep: `CALL queryTree(0, query = [${queryRange.left}, ${queryRange.right}])`,
      variables: { left: queryRange.left, right: queryRange.right },
      phase: 'query'
    });
    addLines(5, 22, 6, 7);
    const result = queryTree(tempTree, 0, 0, nums.length - 1, queryRange.left, queryRange.right);

    s.push({
      nums, tree: [...tempTree], node: 0, start: 0, end: nums.length - 1, left: queryRange.left, right: queryRange.right,
      explanation: `Query result: ${result}. Segment Tree operations complete.`,
      pseudoStep: `RETURN result (${result})`,
      variables: { result },
      phase: 'done'
    });
    addLines(5, 22, 6, 7);

    return { steps: s, stepLineNumbers: lines };
  }, []);

  const step = steps[currentStepIndex] || steps[0];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  const renderTree = (node: number, start: number, end: number, x: number, y: number, level: number) => {
    const isLeaf = start === end;
    const value = step.tree[node];
    const isActive = step.node === node;
    const isQueryOverlap = step.left !== undefined && step.right !== undefined &&
      !(step.right < start || step.left > end);
    const isFullCover = step.left !== undefined && step.right !== undefined &&
      (step.left <= start && end <= step.right);

    const horizontalSpread = level === 0 ? 100 : 100 / (Math.pow(1.8, level));

    return (
      <g key={node}>
        {!isLeaf && (
          <>
            <line
              x1={x} y1={y} x2={x - horizontalSpread} y2={y + 60}
              stroke="#84cc16" strokeWidth="2" strokeOpacity="0.5"
            />
            <line
              x1={x} y1={y} x2={x + horizontalSpread} y2={y + 60}
              stroke="#84cc16" strokeWidth="2" strokeOpacity="0.5"
            />
            {renderTree(2 * node + 1, start, Math.floor((start + end) / 2), x - horizontalSpread, y + 60, level + 1)}
            {renderTree(2 * node + 2, Math.floor((start + end) / 2) + 1, end, x + horizontalSpread, y + 60, level + 1)}
          </>
        )}
        <motion.g
          animate={{
            scale: isActive ? 1.2 : 1,
          }}
        >
          <circle
            cx={x} cy={y} r="18"
            fill={isActive ? '#84cc16' : (isFullCover ? 'rgba(132,204,22,0.3)' : (isQueryOverlap ? 'rgba(132,204,22,0.12)' : '#2a2a2a'))}
            stroke={isActive ? '#84cc16' : '#444'}
            strokeWidth="2"
          />
          <text
            x={x} y={y} dy=".3em"
            textAnchor="middle"
            fontSize="10"
            fontWeight="bold"
            fill={isActive ? '#000' : '#e5e5e5'}
          >
            {value !== null ? value : ''}
          </text>
          <text x={x} y={y - 25} textAnchor="middle" fontSize="8" fill="#888" fontFamily="monospace">
            {node}
          </text>
          <text x={x} y={y + 30} textAnchor="middle" fontSize="7" fill="#888" fontWeight="600">
            [{start},{end}]
          </text>
        </motion.g>
      </g>
    );
  };

  return (
    <VisualizationLayout
      leftContent={
        <div className="flex flex-col h-full justify-between gap-6">
          <div className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 relative overflow-hidden">
              <h3 className="text-sm font-semibold mb-8 text-muted-foreground uppercase tracking-widest">Segment Tree</h3>

              <div className="flex justify-center mb-8">
                <svg width="400" height="300" viewBox="0 0 400 300">
                  {renderTree(0, 0, nums.length - 1, 200, 40, 0)}
                </svg>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Input Array</h4>
                <div className="flex gap-2">
                  {nums.map((num, idx) => {
                    const isFocus = idx >= step.start && idx <= step.end;
                    const isQuery = step.left !== undefined && idx >= step.left && idx <= step.right!;
                    return (
                      <div
                        key={idx}
                        className={`w-10 h-10 border-2 rounded-lg flex flex-col items-center justify-center transition-all
                            ${isFocus ? 'border-primary bg-primary/10' : 'border-border'}
                            ${isQuery && isFocus ? 'ring-2 ring-primary ring-offset-2' : ''}
                          `}
                      >
                        <span className="text-xs font-bold">{num}</span>
                        <span className="text-[8px] opacity-40 font-mono">{idx}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4 mt-auto">
            <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Step Explanation</h4>
              <p className="text-sm font-medium min-h-[40px]">{step.explanation}</p>
            </Card>

            <VariablePanel variables={step.variables} />
          </div>
        </div>
      }
      rightContent={
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={() => setCurrentStepIndex(0)}
        />
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
