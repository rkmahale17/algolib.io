import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

interface Step {
  nums: number[];
  st: number[][]; // [i][j]
  k: number;
  n: number;
  highlightedLines: number[];
  explanation: string;
  variables: Record<string, any>;
  activeIndices: number[]; // indices in nums currently being processed
  activeSTCells: [number, number][]; // [i, j] cells in st currently being processed/updated
  queryRange: [number, number] | null;
  overlappingRanges: [[number, number], [number, number]] | null;
}

export const SparseTableVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nums = [7, 2, 3, 0, 5, 10, 3, 12, 18];
  const L = 1;
  const R = 6;

  const steps: Step[] = useMemo(() => {
    const s: Step[] = [];
    const n = nums.length;
    const log2 = (x: number) => Math.log(x) / Math.log(2);
    const k = Math.floor(log2(n));
    const st: number[][] = Array.from({ length: n }, () => new Array(k + 1).fill(null as any));

    s.push({
      nums, st: st.map(row => [...row]), k, n,
      highlightedLines: [1, 2, 3],
      explanation: "Helper function to calculate base-2 logarithm.",
      variables: {},
      activeIndices: [], activeSTCells: [], queryRange: null, overlappingRanges: null
    });

    s.push({
      nums, st: st.map(row => [...row]), k, n,
      highlightedLines: [5],
      explanation: `Starting solution with nums=[${nums.join(', ')}], L=${L}, R=${R}.`,
      variables: { nums, L, R },
      activeIndices: [], activeSTCells: [], queryRange: null, overlappingRanges: null
    });

    s.push({
      nums, st: st.map(row => [...row]), k, n,
      highlightedLines: [6],
      explanation: `Set n = nums.length = ${n}.`,
      variables: { n, L, R },
      activeIndices: [], activeSTCells: [], queryRange: null, overlappingRanges: null
    });

    s.push({
      nums, st: st.map(row => [...row]), k, n,
      highlightedLines: [7],
      explanation: `Calculate k = floor(log2(${n})) = ${k}. Sparse table will have ${k + 1} columns.`,
      variables: { n, k, L, R },
      activeIndices: [], activeSTCells: [], queryRange: null, overlappingRanges: null
    });

    s.push({
      nums, st: st.map(row => [...row]), k, n,
      highlightedLines: [8],
      explanation: `Initialize sparse table 'st' with size ${n} x ${k + 1}.`,
      variables: { n, k, L, R },
      activeIndices: [], activeSTCells: [], queryRange: null, overlappingRanges: null
    });

    for (let i = 0; i < n; i++) {
      st[i][0] = nums[i];
      s.push({
        nums, st: st.map(row => [...row]), k, n,
        highlightedLines: [10, 11, 12],
        explanation: `Base case: st[${i}][0] = nums[${i}] = ${nums[i]}. Level 0 represents ranges of length 2^0 = 1.`,
        variables: { i, n, k },
        activeIndices: [i], activeSTCells: [[i, 0]], queryRange: null, overlappingRanges: null
      });
    }

    for (let j = 1; j <= k; j++) {
      for (let i = 0; i + (1 << j) <= n; i++) {
        const leftIdx = i;
        const rightIdx = i + (1 << (j - 1));
        st[i][j] = Math.min(st[leftIdx][j - 1], st[rightIdx][j - 1]);

        s.push({
          nums, st: st.map(row => [...row]), k, n,
          highlightedLines: [14, 15, 16],
          explanation: `Level ${j} (length 2^${j}=${1 << j}): st[${i}][${j}] = min(st[${leftIdx}][${j - 1}], st[${rightIdx}][${j - 1}]) = min(${st[leftIdx][j - 1]}, ${st[rightIdx][j - 1]}) = ${st[i][j]}.`,
          variables: { i, j, '2^j': 1 << j, '2^(j-1)': 1 << (j - 1) },
          activeIndices: Array.from({ length: 1 << j }, (_, idx) => i + idx),
          activeSTCells: [[leftIdx, j - 1], [rightIdx, j - 1], [i, j]],
          queryRange: null, overlappingRanges: null
        });
      }
    }

    const len = R - L + 1;
    s.push({
      nums, st: st.map(row => [...row]), k, n,
      highlightedLines: [20],
      explanation: `Query length = R - L + 1 = ${R} - ${L} + 1 = ${len}.`,
      variables: { L, R, len },
      activeIndices: [], activeSTCells: [], queryRange: [L, R], overlappingRanges: null
    });

    const queryJ = Math.floor(log2(len));
    s.push({
      nums, st: st.map(row => [...row]), k, n,
      highlightedLines: [21],
      explanation: `Largest power of 2 <= length: j = floor(log2(${len})) = ${queryJ}.`,
      variables: { L, R, len, j: queryJ },
      activeIndices: [], activeSTCells: [], queryRange: [L, R], overlappingRanges: null
    });

    const result = Math.min(st[L][queryJ], st[R - (1 << queryJ) + 1][queryJ]);
    const overlap1: [number, number] = [L, L + (1 << queryJ) - 1];
    const overlap2: [number, number] = [R - (1 << queryJ) + 1, R];

    s.push({
      nums, st: st.map(row => [...row]), k, n,
      highlightedLines: [23],
      explanation: `Range [${L}, ${R}] is covered by two overlapping segments of length 2^${queryJ}=${1 << queryJ}: [${overlap1[0]}, ${overlap1[1]}] (st[${L}][${queryJ}]) and [${overlap2[0]}, ${overlap2[1]}] (st[${overlap2[0]}][${queryJ}]). Minimum is ${result}.`,
      variables: { L, R, j: queryJ, result },
      activeIndices: [],
      activeSTCells: [[L, queryJ], [overlap2[0], queryJ]],
      queryRange: [L, R],
      overlappingRanges: [overlap1, overlap2]
    });

    return s;
  }, [nums, L, R]);

  const code = `function log2(x: number): number {
  return Math.log(x) / Math.log(2);
}

function solution(nums: number[], L: number, R: number): number {
  const n = nums.length;
  const k = Math.floor(log2(n));
  const st: number[][] = Array.from({ length: n }, () => new Array(k + 1).fill(0));

  for (let i = 0; i < n; i++) {
    st[i][0] = nums[i];
  }

  for (let j = 1; j <= k; j++) {
    for (let i = 0; i + (1 << j) <= n; i++) {
      st[i][j] = Math.min(st[i][j - 1], st[i + (1 << (j - 1))][j - 1]);
    }
  }

  const len = R - L + 1;
  const j = Math.floor(log2(len));

  return Math.min(st[L][j], st[R - (1 << j) + 1][j]);
}`;

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 overflow-hidden">
            <h3 className="text-sm font-semibold mb-6 text-muted-foreground uppercase tracking-wider">Sparse Table (Range Minimum Query)</h3>

            <div className="mb-8">
              <div className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Input Array (nums)</div>
              <div className="flex flex-wrap gap-2">
                {nums.map((val, idx) => {
                  const isActive = step.activeIndices.includes(idx);
                  const isQuery = step.queryRange && idx >= step.queryRange[0] && idx <= step.queryRange[1];
                  const inOverlap1 = step.overlappingRanges && idx >= step.overlappingRanges[0][0] && idx <= step.overlappingRanges[0][1];
                  const inOverlap2 = step.overlappingRanges && idx >= step.overlappingRanges[1][0] && idx <= step.overlappingRanges[1][1];

                  return (
                    <div
                      key={idx}
                      className={`relative w-10 h-10 flex flex-col items-center justify-center rounded-lg border-2 font-mono text-sm transition-all duration-300
                        ${isActive ? 'bg-primary border-primary text-primary-foreground scale-110 z-10' :
                          isQuery ? 'bg-blue-500/20 border-blue-500 text-foreground' :
                            'bg-muted/30 border-border text-muted-foreground opacity-60'}
                      `}
                    >
                      <span className="text-[10px] absolute -top-4 text-muted-foreground">{idx}</span>
                      {val}
                      <AnimatePresence>
                        {inOverlap1 && (
                          <motion.div
                            initial={{ height: 0 }} animate={{ height: '4px' }}
                            className="absolute -bottom-1 left-0 right-0 bg-orange-500 rounded-full"
                          />
                        )}
                        {inOverlap2 && (
                          <motion.div
                            initial={{ height: 0 }} animate={{ height: '4px' }}
                            className="absolute -bottom-2 left-0 right-0 bg-green-500 rounded-full"
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <div className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Dynamic Programming Table (st[i][j])</div>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-1 border border-border text-[10px] text-muted-foreground bg-muted/20">i \ j</th>
                    {Array.from({ length: step.k + 1 }).map((_, j) => (
                      <th key={j} className="p-1 border border-border text-[10px] text-muted-foreground bg-muted/20">
                        2<sup>{j}</sup>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {step.st.map((row, i) => (
                    <tr key={i}>
                      <td className="p-1 border border-border text-center font-mono text-[10px] bg-muted/10 font-bold">{i}</td>
                      {row.map((val, j) => {
                        const isActive = step.activeSTCells.some(([ci, cj]) => ci === i && cj === j);
                        const isUpdate = isActive && step.activeSTCells[step.activeSTCells.length - 1][0] === i && step.activeSTCells[step.activeSTCells.length - 1][1] === j;

                        return (
                          <td
                            key={j}
                            className={`p-1 border border-border text-center font-mono text-[10px] transition-colors duration-300
                              ${val === null ? 'text-transparent' : 'text-foreground'}
                              ${isUpdate ? 'bg-green-500/30 font-black' : isActive ? 'bg-primary/20' : 'bg-transparent'}
                            `}
                          >
                            {val ?? '-'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Range 1</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Range 2</span>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-primary/5 border-primary/20">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Step Explanation</h4>
            <p className="text-sm text-foreground leading-relaxed font-medium">{step.explanation}</p>
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
