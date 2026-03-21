import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';

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
  highlightedLines: number[];
  variables: Record<string, any>;
  phase: 'init' | 'build' | 'query' | 'result' | 'done';
}

export const SegmentTreeVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const nums = [1, 3, 5, 7];
  const queryRange = { left: 1, right: 3 };

  const steps: Step[] = useMemo(() => {
    const s: Step[] = [];
    const tree: (number | null)[] = new Array(4 * nums.length).fill(null);

    // Initial step
    s.push({
      nums, tree: [...tree], node: 0, start: 0, end: nums.length - 1,
      explanation: "Initialize input array and empty segment tree.",
      highlightedLines: [1, 2, 3],
      variables: { nums: `[${nums.join(',')}]`, n: nums.length },
      phase: 'init'
    });

    const buildTree = (tree: number[], nums: number[], node: number, start: number, end: number) => {
      s.push({
        nums, tree: [...tree], node, start, end,
        explanation: `Building tree for range [${start}, ${end}] at node ${node}.`,
        highlightedLines: [8],
        variables: { node, start, end },
        phase: 'build'
      });

      if (start === end) {
        tree[node] = nums[start];
        s.push({
          nums, tree: [...tree], node, start, end,
          explanation: `Leaf node reached: index ${start} (value ${nums[start]}). Setting tree[${node}] = ${nums[start]}.`,
          highlightedLines: [9, 10, 11],
          variables: { node, start, value: nums[start] },
          phase: 'build'
        });
        return;
      }

      const mid = Math.floor((start + end) / 2);
      s.push({
        nums, tree: [...tree], node, start, end, mid,
        explanation: `Calculate mid = floor((${start} + ${end}) / 2) = ${mid}.`,
        highlightedLines: [14],
        variables: { start, end, mid },
        phase: 'build'
      });

      s.push({
        nums, tree: [...tree], node, start, end, mid,
        explanation: `Recursively build left subtree for range [${start}, ${mid}].`,
        highlightedLines: [15],
        variables: { node: 2 * node + 1, start, end: mid },
        phase: 'build'
      });
      buildTree(tree, nums, 2 * node + 1, start, mid);

      s.push({
        nums, tree: [...tree], node, start, end, mid,
        explanation: `Recursively build right subtree for range [${mid + 1}, ${end}].`,
        highlightedLines: [16],
        variables: { node: 2 * node + 2, start: mid + 1, end },
        phase: 'build'
      });
      buildTree(tree, nums, 2 * node + 2, mid + 1, end);

      tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
      s.push({
        nums, tree: [...tree], node, start, end, mid,
        explanation: `Set tree[${node}] = tree[${2 * node + 1}] (${tree[2 * node + 1]}) + tree[${2 * node + 2}] (${tree[2 * node + 2]}) = ${tree[node]}.`,
        highlightedLines: [17],
        variables: { node, leftChild: tree[2 * node + 1], rightChild: tree[2 * node + 2], sum: tree[node] },
        phase: 'build'
      });
    };

    const queryTree = (tree: number[], node: number, start: number, end: number, left: number, right: number): number => {
      s.push({
        nums, tree: [...tree], node, start, end, left, right,
        explanation: `Querying range [${left}, ${right}] against node ${node} (range [${start}, ${end}]).`,
        highlightedLines: [20],
        variables: { node, start, end, left, right },
        phase: 'query'
      });

      if (left > end || right < start) {
        s.push({
          nums, tree: [...tree], node, start, end, left, right,
          explanation: `Query range [${left}, ${right}] is outside segment [${start}, ${end}]. Returning 0.`,
          highlightedLines: [21],
          variables: { left, right, start, end },
          phase: 'query'
        });
        return 0;
      }

      if (left <= start && end <= right) {
        s.push({
          nums, tree: [...tree], node, start, end, left, right,
          explanation: `Query range [${left}, ${right}] fully covers segment [${start}, ${end}]. Returning tree[${node}] = ${tree[node]}.`,
          highlightedLines: [22],
          variables: { left, start, end, right, value: tree[node] },
          phase: 'query'
        });
        return tree[node];
      }

      const mid = Math.floor((start + end) / 2);
      s.push({
        nums, tree: [...tree], node, start, end, left, right, mid,
        explanation: `Partial overlap. Calculate mid = ${mid}.`,
        highlightedLines: [24],
        variables: { mid },
        phase: 'query'
      });

      s.push({
        nums, tree: [...tree], node, start, end, left, right, mid,
        explanation: `Recursively query left child for range [${left}, ${right}].`,
        highlightedLines: [25],
        variables: { node: 2 * node + 1, start, end: mid },
        phase: 'query'
      });
      const p1 = queryTree(tree, 2 * node + 1, start, mid, left, right);

      s.push({
        nums, tree: [...tree], node, start, end, left, right, mid, p1,
        explanation: `Recursively query right child for range [${left}, ${right}].`,
        highlightedLines: [26],
        variables: { node: 2 * node + 2, start: mid + 1, end, p1 },
        phase: 'query'
      });
      const p2 = queryTree(tree, 2 * node + 2, mid + 1, end, left, right);

      s.push({
        nums, tree: [...tree], node, start, end, left, right, mid, p1, p2,
        explanation: `Combine results from children: ${p1} + ${p2} = ${p1 + p2}.`,
        highlightedLines: [28],
        variables: { p1, p2, sum: p1 + p2 },
        phase: 'query'
      });
      return p1 + p2;
    };

    const tempTree = new Array(4 * nums.length).fill(0);
    buildTree(tempTree, nums, 0, 0, nums.length - 1);

    s.push({
      nums, tree: [...tempTree], node: 0, start: 0, end: nums.length - 1, left: queryRange.left, right: queryRange.right,
      explanation: `Starting range sum query from index ${queryRange.left} to ${queryRange.right}.`,
      highlightedLines: [5],
      variables: { left: queryRange.left, right: queryRange.right },
      phase: 'query'
    });
    const result = queryTree(tempTree, 0, 0, nums.length - 1, queryRange.left, queryRange.right);

    s.push({
      nums, tree: [...tempTree], node: 0, start: 0, end: nums.length - 1, left: queryRange.left, right: queryRange.right,
      explanation: `Query result: ${result}. Segment Tree operations complete.`,
      highlightedLines: [5],
      variables: { result },
      phase: 'done'
    });

    return s;
  }, []);

  const code = `function solution(nums: number[], left: number, right: number): number {
    const n = nums.length;
    const tree = new Array<number>(4 * n).fill(0);
    buildTree(tree, nums, 0, 0, n - 1);
    return queryTree(tree, 0, 0, n - 1, left, right);
}

function buildTree(tree: number[], nums: number[], node: number, start: number, end: number): void {
    if (start === end) {
        tree[node] = nums[start];
        return;
    }
    const mid = Math.floor((start + end) / 2);
    buildTree(tree, nums, 2 * node + 1, start, mid);
    buildTree(tree, nums, 2 * node + 2, mid + 1, end);
    tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
}

function queryTree(tree: number[], node: number, start: number, end: number, left: number, right: number): number {
    if (left > end || right < start) return 0;
    if (left <= start && end <= right) return tree[node];
    const mid = Math.floor((start + end) / 2);
    const p1 = queryTree(tree, 2 * node + 1, start, mid, left, right);
    const p2 = queryTree(tree, 2 * node + 2, mid + 1, end, left, right);
    return p1 + p2;
}`;

  const step = steps[currentStep] || steps[0];

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

          <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Step Explanation</h4>
            <p className="text-sm font-medium">{step.explanation}</p>
          </Card>

          <VariablePanel variables={step.variables} />
        </div>
      }
      rightContent={
        <AnimatedCodeEditor
          code={code}
          language="typescript"
          highlightedLines={step.highlightedLines}
        />
      }
      controls={
        <SimpleStepControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onStepChange={setCurrentStep}
        />
      }
    />
  );
};
