import { useEffect, useRef, useState, useMemo } from 'react';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  parent: number[];
  rank: number[];
  result: number;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
  activeNodes: number[];
  phase: 'init' | 'find' | 'union' | 'done';
}

const N = 6;
const EDGES: number[][] = [[0, 1], [0, 2], [3, 4], [3, 5]];

const languages: VisualizationLanguageMap = {
  typescript: `function countComponents(n: number, edges: number[][]): number {
    const parent: number[] = Array.from({ length: n }, (_, i) => i);
    const rank: number[] = new Array(n).fill(1);
    function find(node: number): number {
        let res = node;
        while (res !== parent[res]) {
            parent[res] = parent[parent[res]];
            res = parent[res];
        }
        return res;
    }
    function union(n1: number, n2: number): number {
        const p1 = find(n1);
        const p2 = find(n2);
        if (p1 === p2) return 0;
        if (rank[p2] > rank[p1]) {
            parent[p1] = p2;
            rank[p2] += rank[p1];
        } else {
            parent[p2] = p1;
            rank[p1] += rank[p2];
        }
        return 1;
    }
    let result = n;
    for (const [n1, n2] of edges) {
        result -= union(n1, n2);
    }
    return result;
}`,
  python: `def countComponents(n: int, edges: list[list[int]]) -> int:
    parent = list(range(n))
    rank = [1] * n
    def find(node: int) -> int:
        res = node
        while res != parent[res]:
            parent[res] = parent[parent[res]]
            res = parent[res]
        return res
    def union(n1: int, n2: int) -> int:
        p1 = find(n1)
        p2 = find(n2)
        if p1 == p2:
            return 0
        if rank[p2] > rank[p1]:
            parent[p1] = p2
            rank[p2] += rank[p1]
        else:
            parent[p2] = p1
            rank[p1] += rank[p2]
        return 1
    result = n
    for n1, n2 in edges:
        result -= union(n1, n2)
    return result`,
  java: `class Solution {
    private int find(int node, int[] parent) {
        int res = node;
        while (res != parent[res]) {
            parent[res] = parent[parent[res]];
            res = parent[res];
        }
        return res;
    }
    private int union(int n1, int n2, int[] parent, int[] rank) {
        int p1 = find(n1, parent);
        int p2 = find(n2, parent);
        if (p1 == p2) return 0;
        if (rank[p2] > rank[p1]) {
            parent[p1] = p2;
            rank[p2] += rank[p1];
        } else {
            parent[p2] = p1;
            rank[p1] += rank[p2];
        }
        return 1;
    }
    public int countComponents(int n, int[][] edges) {
        int[] parent = new int[n];
        int[] rank = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            rank[i] = 1;
        }
        int result = n;
        for (int[] edge : edges) {
            result -= union(edge[0], edge[1], parent, rank);
        }
        return result;
    }
}`,
  cpp: `class Solution {
private:
    int find(int node, vector<int>& parent) {
        int res = node;
        while (res != parent[res]) {
            parent[res] = parent[parent[res]];
            res = parent[res];
        }
        return res;
    }
    int unite(int n1, int n2, vector<int>& parent, vector<int>& rank) {
        int p1 = find(n1, parent);
        int p2 = find(n2, parent);
        if (p1 == p2) return 0;
        if (rank[p2] > rank[p1]) {
            parent[p1] = p2;
            rank[p2] += rank[p1];
        } else {
            parent[p2] = p1;
            rank[p1] += rank[p2];
        }
        return 1;
    }
public:
    int countComponents(int n, vector<vector<int>>& edges) {
        vector<int> parent(n);
        vector<int> rank(n, 1);
        for (int i = 0; i < n; i++) parent[i] = i;
        int result = n;
        for (auto& edge : edges) {
            result -= unite(edge[0], edge[1], parent, rank);
        }
        return result;
    }
};`,
};

function generateVisualizationData() {
  const steps: Step[] = [];
  const parent = Array.from({ length: N }, (_, i) => i);
  const rank = new Array(N).fill(1);
  let result = N;

  const stepLineNumbers: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
  const addLines = (ts: number, py: number, java: number, cpp: number) => {
    stepLineNumbers.typescript!.push(ts);
    stepLineNumbers.python!.push(py);
    stepLineNumbers.java!.push(java);
    stepLineNumbers.cpp!.push(cpp);
  };

  steps.push({
    parent: [...parent], rank: [...rank], result,
    explanation: `Start countComponents with n=${N} nodes. Result component count initialized to ${N}.`,
    pseudoStep: `SET result = n  →  ${N}`,
    variables: { n: N, result },
    activeNodes: [],
    phase: 'init'
  });
  addLines(25, 22, 30, 29);

  steps.push({
    parent: [...parent], rank: [...rank], result,
    explanation: `Initialize parent: each node is its own representative.`,
    pseudoStep: `SET parent[i] = i  →  [${parent.join(',')}]`,
    variables: { parent: `[${parent.join(',')}]` },
    activeNodes: parent,
    phase: 'init'
  });
  addLines(2, 2, 27, 28);

  steps.push({
    parent: [...parent], rank: [...rank], result,
    explanation: `Initialize rank: each set starts with size/rank 1.`,
    pseudoStep: `SET rank[i] = 1  →  [${rank.join(',')}]`,
    variables: { rank: `[${rank.join(',')}]` },
    activeNodes: [],
    phase: 'init'
  });
  addLines(3, 3, 28, 27);

  const findFn = (node: number): number => {
    steps.push({
      parent: [...parent], rank: [...rank], result,
      explanation: `find(${node}): starting traversal to find root of node ${node}.`,
      pseudoStep: `CALL find(${node}): res = ${node}`,
      variables: { node, res: node },
      activeNodes: [node],
      phase: 'find'
    });
    addLines(4, 4, 2, 3);

    let res = node;
    while (res !== parent[res]) {
      const oldParent = parent[res];
      const gParent = parent[oldParent];
      steps.push({
        parent: [...parent], rank: [...rank], result,
        explanation: `res=${res} is not root (parent[res]=${oldParent}). Path compression: update parent[${res}] to grandparent ${gParent}.`,
        pseudoStep: `parent[${res}] = parent[parent[${res}]]  →  ${gParent}`,
        variables: { res, 'parent[res]': oldParent, 'grandparent': gParent },
        activeNodes: [res, oldParent, gParent],
        phase: 'find'
      });
      addLines(7, 7, 5, 6);
      parent[res] = gParent;
      res = parent[res];
    }

    steps.push({
      parent: [...parent], rank: [...rank], result,
      explanation: `Found root of node ${node} is ${res}.`,
      pseudoStep: `RETURN root  →  ${res}`,
      variables: { root: res },
      activeNodes: [res],
      phase: 'find'
    });
    addLines(10, 9, 8, 8);
    return res;
  };

  const unionFn = (n1: number, n2: number): number => {
    steps.push({
      parent: [...parent], rank: [...rank], result,
      explanation: `union(${n1}, ${n2}): find roots of both nodes to merge.`,
      pseudoStep: `CALL union(${n1}, ${n2})`,
      variables: { n1, n2 },
      activeNodes: [n1, n2],
      phase: 'union'
    });
    addLines(12, 10, 10, 11);

    const p1 = findFn(n1);
    const p2 = findFn(n2);

    steps.push({
      parent: [...parent], rank: [...rank], result,
      explanation: `p1 = find(${n1}) → ${p1}. p2 = find(${n2}) → ${p2}.`,
      pseudoStep: `IF p1 (${p1}) == p2 (${p2})`,
      variables: { p1, p2 },
      activeNodes: [p1, p2],
      phase: 'union'
    });
    addLines(15, 13, 13, 14);

    if (p1 === p2) return 0;

    steps.push({
      parent: [...parent], rank: [...rank], result,
      explanation: `p1 and p2 are different roots. Compare ranks: rank[${p2}] (${rank[p2]}) and rank[${p1}] (${rank[p1]}).`,
      pseudoStep: `IF rank[${p2}] > rank[${p1}]`,
      variables: { p1, p2, [`rank[${p1}]`]: rank[p1], [`rank[${p2}]`]: rank[p2] },
      activeNodes: [p1, p2],
      phase: 'union'
    });
    addLines(16, 15, 14, 15);

    if (rank[p2] > rank[p1]) {
      parent[p1] = p2;
      rank[p2] += rank[p1];
      steps.push({
        parent: [...parent], rank: [...rank], result,
        explanation: `rank[${p2}] > rank[${p1}]. Attach root ${p1} to root ${p2}. rank[${p2}] becomes ${rank[p2]}.`,
        pseudoStep: `SET parent[${p1}] = ${p2}; rank[${p2}] += rank[${p1}]`,
        variables: { [`parent[${p1}]`]: p2, [`rank[${p2}]`]: rank[p2] },
        activeNodes: [p1, p2],
        phase: 'union'
      });
      addLines(17, 16, 15, 16);
    } else {
      parent[p2] = p1;
      rank[p1] += rank[p2];
      steps.push({
        parent: [...parent], rank: [...rank], result,
        explanation: `rank[${p1}] >= rank[${p2}]. Attach root ${p2} to root ${p1}. rank[${p1}] becomes ${rank[p1]}.`,
        pseudoStep: `ELSE: parent[${p2}] = ${p1}; rank[${p1}] += rank[${p2}]`,
        variables: { [`parent[${p2}]`]: p1, [`rank[${p1}]`]: rank[p1] },
        activeNodes: [p1, p2],
        phase: 'union'
      });
      addLines(20, 19, 18, 19);
    }
    return 1;
  };

  for (const [n1, n2] of EDGES) {
    steps.push({
      parent: [...parent], rank: [...rank], result,
      explanation: `Process edge [${n1}, ${n2}] in the graph.`,
      pseudoStep: `FOR edge IN edges  →  inspect [${n1}, ${n2}]`,
      variables: { edge: `[${n1},${n2}]`, result },
      activeNodes: [n1, n2],
      phase: 'union'
    });
    addLines(26, 23, 31, 30);

    const decrement = unionFn(n1, n2);
    result -= decrement;

    steps.push({
      parent: [...parent], rank: [...rank], result,
      explanation: `Edge processed. Reduced number of connected components by ${decrement}. Current result = ${result}.`,
      pseudoStep: `result -= union(${n1}, ${n2})  →  ${result}`,
      variables: { decrement, result },
      activeNodes: [],
      phase: 'union'
    });
    addLines(27, 24, 32, 31);
  }

  steps.push({
    parent: [...parent], rank: [...rank], result,
    explanation: `Finished processing all edges. Remaining components: ${result}.`,
    pseudoStep: `RETURN result  →  ${result}`,
    variables: { result },
    activeNodes: [],
    phase: 'done'
  });
  addLines(29, 25, 34, 33);

  return { steps, stepLineNumbers };
}

export const UnionFindVisualization = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) { setIsPlaying(false); return prev; }
          return prev + 1;
        });
      }, 1000 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(p => p + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(p => p - 1);
  const handleReset = () => { setCurrentStepIndex(0); setIsPlaying(false); };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  const computePositions = useMemo<{ x: number; y: number }[]>(() => {
    const children: Record<number, number[]> = {};
    for (let i = 0; i < N; i++) {
      if (currentStep.parent[i] !== i) {
        if (!children[currentStep.parent[i]]) children[currentStep.parent[i]] = [];
        children[currentStep.parent[i]].push(i);
      }
    }

    const rootNodes = Array.from({ length: N }, (_, i) => i).filter(i => currentStep.parent[i] === i);
    const pos: { x: number; y: number }[] = new Array(N).fill(null).map(() => ({ x: 0, y: 0 }));

    const svgW = 400;
    const colW = svgW / (rootNodes.length + 1);

    rootNodes.forEach((root, idx) => {
      const rx = colW * (idx + 1);
      pos[root] = { x: rx, y: 50 };

      const kids = children[root] || [];
      const spread = Math.min(colW * 0.8, 60);
      const startX = kids.length > 1 ? rx - spread / 2 : rx;
      const stepX = kids.length > 1 ? spread / (kids.length - 1) : 0;

      kids.forEach((k, ki) => {
        const kx = startX + stepX * ki;
        pos[k] = { x: kx, y: 130 };

        const grandkids = children[k] || [];
        const gSpread = 40;
        const gStartX = grandkids.length > 1 ? kx - gSpread / 2 : kx;
        const gStepX = grandkids.length > 1 ? gSpread / (grandkids.length - 1) : 0;
        grandkids.forEach((gk, gi) => {
          pos[gk] = { x: gStartX + gStepX * gi, y: 200 };
        });
      });
    });

    return pos;
  }, [currentStep.parent]);

  const getNodeStyle = (i: number) => {
    if (currentStep.activeNodes.includes(i)) return { fill: 'rgba(132, 204, 22, 0.2)', stroke: '#84cc16', text: '#84cc16' };
    if (currentStep.parent[i] === i) return { fill: 'rgba(52, 211, 153, 0.1)', stroke: '#34d399', text: '#34d399' };
    return { fill: 'transparent', stroke: 'currentColor', text: 'currentColor' };
  };

  return (
    <div className="space-y-6">
      <StepControls
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={setSpeed}
        currentStep={currentStepIndex}
        totalSteps={steps.length - 1}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 flex flex-col items-center justify-center relative">
            <h4 className="text-sm font-semibold mb-4 text-foreground uppercase tracking-wider text-center">Disjoint Set Forest</h4>
            <svg viewBox="0 0 400 240" className="w-full max-w-[400px] h-auto">
              {/* Lines */}
              {currentStep.parent.map((p, i) => {
                if (p === i) return null;
                const src = computePositions[i];
                const dst = computePositions[p];
                if (!src || !dst) return null;
                const active = currentStep.activeNodes.includes(i) || currentStep.activeNodes.includes(p);
                return (
                  <line
                    key={`edge-${i}`}
                    x1={src.x} y1={src.y} x2={dst.x} y2={dst.y}
                    className={`transition-colors duration-200 ${active ? 'stroke-green-500 stroke-2' : 'stroke-border stroke-1'}`}
                  />
                );
              })}

              {/* Circles */}
              {Array.from({ length: N }, (_, i) => i).map(i => {
                const pos = computePositions[i];
                if (!pos) return null;
                const s = getNodeStyle(i);
                const isActive = currentStep.activeNodes.includes(i);
                const isRoot = currentStep.parent[i] === i;
                const r = isActive ? 15 : 12;

                return (
                  <g key={`node-${i}`}>
                    {isRoot && (
                      <text x={pos.x} y={pos.y - r - 4} textAnchor="middle" className="fill-green-400 text-[8px] font-bold">
                        ROOT
                      </text>
                    )}
                    <circle
                      cx={pos.x} cy={pos.y} r={r}
                      fill={s.fill}
                      stroke={s.stroke}
                      strokeWidth="2"
                    />
                    <text x={pos.x} y={pos.y} dy=".33em" textAnchor="middle" fill={s.text} className="text-[10px] font-bold">
                      {i}
                    </text>
                    <text x={pos.x} y={pos.y + r + 10} textAnchor="middle" className="fill-muted-foreground text-[8px]">
                      rank:{currentStep.rank[i]}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="flex justify-center gap-4 mt-4 text-[10px] text-muted-foreground border-t pt-2 w-full">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full border border-green-500 bg-green-500/20" /> Root</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full border border-[#84cc16] bg-[#84cc16]/20" /> Active</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full border border-muted bg-transparent" /> Node</span>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm font-medium text-foreground">{currentStep.explanation}</p>
          </div>

          <VariablePanel variables={{ ...currentStep.variables, 'Components': currentStep.result }} />
        </div>

        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={handleReset}
        />
      </div>
    </div>
  );
};
