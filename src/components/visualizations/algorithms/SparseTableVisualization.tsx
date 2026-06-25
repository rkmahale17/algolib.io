import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  nums: number[];
  st: number[][]; // [i][j]
  k: number;
  n: number;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
  activeIndices: number[]; // indices in nums currently being processed
  activeSTCells: [number, number][]; // [i, j] cells in st currently being processed/updated
  queryRange: [number, number] | null;
  overlappingRanges: [[number, number], [number, number]] | null;
}

const languages: VisualizationLanguageMap = {
  typescript: `function log2(x: number): number {
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
}`,
  python: `import math
def solution(nums, L, R):
    if not nums:
        return None
    n = len(nums)
    k = int(math.log2(n))
    st = [[0] * (k + 1) for _ in range(n)]
    for i in range(n):
        st[i][0] = nums[i]
    j = 1
    while (1 << j) <= n:
        i = 0
        while i + (1 << j) <= n:
            st[i][j] = min(st[i][j - 1], st[i + (1 << (j - 1))][j - 1])
            i += 1
        j += 1
    length = R - L + 1
    j = int(math.log2(length))
    return min(st[L][j], st[R - (1 << j) + 1][j])`,
  java: `public static class Solution {
    public int solution(int[] nums, int L, int R) {
        if (nums.length == 0)
            return -1;
        int n = nums.length;
        int k = (int)(Math.log(n) / Math.log(2));
        int[][] st = new int[n][k + 1];
        for (int i = 0; i < n; i++) {
            st[i][0] = nums[i];
        }
        for (int j = 1; j <= k; j++) {
            for (int i = 0; i + (1 << j) <= n; i++) {
                st[i][j] = Math.min(
                        st[i][j - 1],
                        st[i + (1 << (j - 1))][j - 1]
                );
            }
        }
        int len = R - L + 1;
        int j = (int)(Math.log(len) / Math.log(2));
        return Math.min(st[L][j], st[R - (1 << j) + 1][j]);
    }
}`,
  cpp: `class Solution {
public:
    int solution(vector<int>& nums, int L, int R) {
        int n = nums.size();
        vector<int> log(n + 1);
        log[1] = 0;
        for (int i = 2; i <= n; i++)
            log[i] = log[i / 2] + 1;
        int k = log[n];
        vector<vector<int>> st(n, vector<int>(k + 1));
        for (int i = 0; i < n; i++)
            st[i][0] = nums[i];
        for (int j = 1; j <= k; j++) {
            for (int i = 0; i + (1 << j) <= n; i++) {
                st[i][j] = min(
                    st[i][j - 1],
                    st[i + (1 << (j - 1))][j - 1]
                );
            }
        }
        int j = log[R - L + 1];
        return min(st[L][j], st[R - (1 << j) + 1][j]);
    }
};`
};

export const SparseTableVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const nums = [7, 2, 3, 0, 5, 10, 3, 12, 18];
  const L = 1;
  const R = 6;

  const { steps, stepLineNumbers } = useMemo(() => {
    const s: Step[] = [];
    const n = nums.length;
    const log2 = (x: number) => Math.log(x) / Math.log(2);
    const k = Math.floor(log2(n));
    const st: number[][] = Array.from({ length: n }, () => new Array(k + 1).fill(null as any));

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

    s.push({
      nums, st: st.map(row => [...row]), k, n,
      explanation: "Define base-2 logarithm function for lookup range math.",
      pseudoStep: "FUNCTION log2(x)",
      variables: {},
      activeIndices: [], activeSTCells: [], queryRange: null, overlappingRanges: null
    });
    addLines(1, 1, 1, 1);

    s.push({
      nums, st: st.map(row => [...row]), k, n,
      explanation: `Starting sparse table construction for nums = [${nums.join(', ')}], L = ${L}, R = ${R}.`,
      pseudoStep: `CALL solution(nums, L = ${L}, R = ${R})`,
      variables: { nums, L, R },
      activeIndices: [], activeSTCells: [], queryRange: null, overlappingRanges: null
    });
    addLines(4, 2, 2, 3);

    s.push({
      nums, st: st.map(row => [...row]), k, n,
      explanation: `Determine size n = ${n}.`,
      pseudoStep: `SET n = length(nums) (n = ${n})`,
      variables: { n, L, R },
      activeIndices: [], activeSTCells: [], queryRange: null, overlappingRanges: null
    });
    addLines(5, 5, 5, 4);

    s.push({
      nums, st: st.map(row => [...row]), k, n,
      explanation: `Calculate sparse table columns count: k = floor(log2(n)) = floor(log2(${n})) = ${k}.`,
      pseudoStep: `SET k = floor(log2(n)) (k = ${k})`,
      variables: { n, k, L, R },
      activeIndices: [], activeSTCells: [], queryRange: null, overlappingRanges: null
    });
    addLines(6, 6, 6, 9);

    s.push({
      nums, st: st.map(row => [...row]), k, n,
      explanation: `Initialize empty sparse table 'st' of size ${n} x ${k + 1}.`,
      pseudoStep: `SET st = empty 2D array (${n} x ${k + 1})`,
      variables: { n, k, L, R },
      activeIndices: [], activeSTCells: [], queryRange: null, overlappingRanges: null
    });
    addLines(7, 7, 7, 10);

    for (let i = 0; i < n; i++) {
      st[i][0] = nums[i];
      s.push({
        nums, st: st.map(row => [...row]), k, n,
        explanation: `Base Case: st[${i}][0] = nums[${i}] = ${nums[i]}. j=0 represents range length 2^0 = 1.`,
        pseudoStep: `SET st[${i}][0] = nums[${i}] (${nums[i]})`,
        variables: { i, n, k },
        activeIndices: [i], activeSTCells: [[i, 0]], queryRange: null, overlappingRanges: null
      });
      addLines(9, 9, 9, 12);
    }

    for (let j = 1; j <= k; j++) {
      for (let i = 0; i + (1 << j) <= n; i++) {
        const leftIdx = i;
        const rightIdx = i + (1 << (j - 1));
        st[i][j] = Math.min(st[leftIdx][j - 1], st[rightIdx][j - 1]);

        s.push({
          nums, st: st.map(row => [...row]), k, n,
          explanation: `Level ${j} (length 2^${j}=${1 << j}): st[${i}][${j}] = min(st[${leftIdx}][${j - 1}], st[${rightIdx}][${j - 1}]) = min(${st[leftIdx][j - 1]}, ${st[rightIdx][j - 1]}) = ${st[i][j]}.`,
          pseudoStep: `SET st[${i}][${j}] = min(st[${i}][${j-1}], st[${i + (1<<(j-1))}][${j-1}])`,
          variables: { i, j, '2^j': 1 << j, '2^(j-1)': 1 << (j - 1) },
          activeIndices: Array.from({ length: 1 << j }, (_, idx) => i + idx),
          activeSTCells: [[leftIdx, j - 1], [rightIdx, j - 1], [i, j]],
          queryRange: null, overlappingRanges: null
        });
        addLines(13, 14, 13, 15);
      }
    }

    const len = R - L + 1;
    s.push({
      nums, st: st.map(row => [...row]), k, n,
      explanation: `Query length = R - L + 1 = ${R} - ${L} + 1 = ${len}.`,
      pseudoStep: `SET len = R - L + 1 (len = ${len})`,
      variables: { L, R, len },
      activeIndices: [], activeSTCells: [], queryRange: [L, R], overlappingRanges: null
    });
    addLines(16, 17, 19, 21);

    const queryJ = Math.floor(log2(len));
    s.push({
      nums, st: st.map(row => [...row]), k, n,
      explanation: `Largest power of 2 fitting in range: j = floor(log2(${len})) = ${queryJ}.`,
      pseudoStep: `SET j = floor(log2(len)) (j = ${queryJ})`,
      variables: { L, R, len, j: queryJ },
      activeIndices: [], activeSTCells: [], queryRange: [L, R], overlappingRanges: null
    });
    addLines(17, 18, 20, 21);

    const result = Math.min(st[L][queryJ], st[R - (1 << queryJ) + 1][queryJ]);
    const overlap1: [number, number] = [L, L + (1 << queryJ) - 1];
    const overlap2: [number, number] = [R - (1 << queryJ) + 1, R];

    s.push({
      nums, st: st.map(row => [...row]), k, n,
      explanation: `Query range [${L}, ${R}] covered by two overlapping ranges of size 2^${queryJ}=${1 << queryJ}: [${overlap1[0]}, ${overlap1[1]}] (st[${L}][${queryJ}] = ${st[L][queryJ]}) and [${overlap2[0]}, ${overlap2[1]}] (st[${overlap2[0]}][${queryJ}] = ${st[overlap2[0]][queryJ]}). Minimum is ${result}.`,
      pseudoStep: `RETURN min(st[L][j], st[R - 2^j + 1][j]) (min(${st[L][queryJ]}, ${st[overlap2[0]][queryJ]}) = ${result})`,
      variables: { L, R, j: queryJ, result },
      activeIndices: [],
      activeSTCells: [[L, queryJ], [overlap2[0], queryJ]],
      queryRange: [L, R],
      overlappingRanges: [overlap1, overlap2]
    });
    addLines(18, 19, 21, 22);

    return { steps: s, stepLineNumbers: lines };
  }, [nums, L, R]);

  const step = steps[currentStepIndex] || steps[0];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="flex flex-col h-full justify-between gap-6">
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
                          ${isActive ? 'bg-primary border-primary text-primary-foreground scale-105 z-10' :
                            isQuery ? 'bg-blue-500/20 border-blue-500 text-foreground' :
                              'bg-muted/30 border-border text-muted-foreground opacity-60'}
                        `}
                      >
                        <span className="text-[9px] absolute -top-4 text-muted-foreground font-mono">{idx}</span>
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
                              className={`p-1 border border-border text-center font-mono text-[10px] transition-colors duration-200
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
          </div>

          <div className="space-y-4 mt-auto">
            <Card className="p-4 bg-primary/5 border-primary/20">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Step Explanation</h4>
              <p className="text-sm text-foreground leading-relaxed font-medium min-h-[40px]">{step.explanation}</p>
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
