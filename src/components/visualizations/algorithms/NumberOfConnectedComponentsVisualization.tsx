import React, { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Card } from '@/components/ui/card';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';
import { Info, CheckCircle2 } from 'lucide-react';

interface Step {
  parent: number[];
  rank: number[];
  result: number;
  explanation: string;
  variables: Record<string, any>;
  activeNodes: number[];
  pseudoStep: string;
}

const N = 5;
const EDGES: number[][] = [[0, 1], [1, 2], [3, 4]];

const languages: VisualizationLanguageMap = {
  typescript: `function countComponents(n: number, edges: number[][]): number {
  const par: number[] = Array.from({ length: n }, (_, i) => i);
  const rank: number[] = new Array(n).fill(1);
  const find = (n1: number): number => {
    let res = n1;
    while (res !== par[res]) {
      par[res] = par[par[res]];
      res = par[res];
    }
    return res;
  };
  const union = (n1: number, n2: number): number => {
    const p1 = find(n1);
    const p2 = find(n2);
    if (p1 === p2) return 0;
    if (rank[p2] > rank[p1]) {
      par[p1] = p2;
      rank[p2] += rank[p1];
    } else {
      par[p2] = p1;
      rank[p1] += rank[p2];
    }
    return 1;
  };
  let res = n;
  for (const [n1, n2] of edges) {
    res -= union(n1, n2);
  }
  return res;
}`,

  python: `def count_components(n: int, edges: list[list[int]]) -> int:
    par = list(range(n))
    rank = [1] * n
    def find(n1: int) -> int:
        res = n1
        while res != par[res]:
            par[res] = par[par[res]]
            res = par[res]
        return res
    def union(n1: int, n2: int) -> int:
        p1 = find(n1)
        p2 = find(n2)
        if p1 == p2:
            return 0
        if rank[p2] > rank[p1]:
            par[p1] = p2
            rank[p2] += rank[p1]
        else:
            par[p2] = p1
            rank[p1] += rank[p2]
        return 1
    res = n
    for n1, n2 in edges:
        res -= union(n1, n2)
    return res`,

  java: `public static class Solution {
    public int countComponents(int n, int[][] edges) {
        int[] par = new int[n];
        int[] rank = new int[n];
        for (int i = 0; i < n; i++) {
            par[i] = i;
            rank[i] = 1;
        }
        int res = n;
        for (int[] edge : edges) {
            res -= union(edge[0], edge[1], par, rank);
        }
        return res;
    }
    private int union(int n1, int n2, int[] par, int[] rank) {
        int p1 = find(n1, par);
        int p2 = find(n2, par);
        if (p1 == p2) return 0;
        if (rank[p2] > rank[p1]) {
            par[p1] = p2;
            rank[p2] += rank[p1];
        } else {
            par[p2] = p1;
            rank[p1] += rank[p2];
        }
        return 1;
    }
    private int find(int n1, int[] par) {
        int res = n1;
        while (res != par[res]) {
            par[res] = par[par[res]];
            res = par[res];
        }
        return res;
    }
}`,

  cpp: `class Solution {
public:
    int countComponents(int n, vector<vector<int>>& edges) {
        vector<int> par(n);
        vector<int> rank(n);
        for (int i = 0; i < n; i++) {
            par[i] = i;
            rank[i] = 1;
        }
        int res = n;
        for (auto& edge : edges) {
            res -= unite(edge[0], edge[1], par, rank);
        }
        return res;
    }
private:
    int find(int n1, vector<int>& par) {
        int res = n1;
        while (res != par[res]) {
            par[res] = par[par[res]];
            res = par[res];
        }
        return res;
    }
    int unite(int n1, int n2, vector<int>& par, vector<int>& rank) {
        int p1 = find(n1, par);
        int p2 = find(n2, par);
        if (p1 == p2) return 0;
        if (rank[p2] > rank[p1]) {
            par[p1] = p2;
            rank[p2] += rank[p1];
        } else {
            par[p2] = p1;
            rank[p1] += rank[p2];
        }
        return 1;
    }
};`
};

export const NumberOfConnectedComponentsVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const s: Step[] = [];
    const stepLines: StepLineNumberMap = {
      typescript: [],
      python: [],
      java: [],
      cpp: []
    };

    const addLines = (ts: number, py: number, java: number, cpp: number) => {
      stepLines.typescript!.push(ts);
      stepLines.python!.push(py);
      stepLines.java!.push(java);
      stepLines.cpp!.push(cpp);
    };

    const par = Array.from({ length: N }, (_, i) => i);
    const rank = new Array(N).fill(1);
    let res = N;

    const makeSnapshot = (
      msg: string, 
      pseudo: string,
      ts: number, 
      py: number, 
      java: number, 
      cpp: number, 
      activeNodes: number[],
      vars: Record<string, any>
    ) => {
      s.push({
        parent: [...par],
        rank: [...rank],
        result: res,
        explanation: msg,
        variables: {
          ...vars,
          parent: `[${par.join(', ')}]`,
          rank: `[${rank.join(', ')}]`,
          res
        },
        activeNodes,
        pseudoStep: pseudo
      });
      addLines(ts, py, java, cpp);
    };

    // Step 1: Start
    makeSnapshot(
      "Start countComponents algorithm on undirected graph.", 
      "START countComponents(n, edges)", 
      1, 1, 2, 3, [], {}
    );

    // Step 2: Init parent
    makeSnapshot(
      "Initialize parent array: each node starts as its own representative root.",
      "SET par = [0..n-1]", 2, 2, 5, 4, [], {}
    );

    // Step 3: Init rank
    makeSnapshot(
      "Initialize rank array: each component starts with a size/rank of 1.",
      "SET rank = [1]*n", 3, 3, 6, 5, [], {}
    );

    // Step 4: Init result
    makeSnapshot(
      "Initially, the number of connected components is equal to the number of nodes.",
      "SET res = n", 25, 22, 9, 10, [], {}
    );

    const findFn = (n1: number): number => {
      let curr = n1;
      while (curr !== par[curr]) {
        const oldPar = par[curr];
        const gPar = par[oldPar];
        
        // Path compression snapshot
        makeSnapshot(
          `Find root of Node ${n1}. Path compression: make Node ${curr} point to grandparent ${gPar}.`,
          `SET par[${curr}] = par[par[${curr}]]`,
          7, 8, 11, 20, [curr, oldPar, gPar], { n1, curr }
        );

        par[curr] = gPar;
        curr = par[curr];
      }
      return curr;
    };

    const unionFn = (n1: number, n2: number): number => {
      makeSnapshot(
        `Union nodes ${n1} and ${n2}. First, find their representatives.`,
        `union(${n1}, ${n2})`,
        12, 10, 15, 25, [n1, n2], { n1, n2 }
      );

      const p1 = findFn(n1);
      const p2 = findFn(n2);

      const alreadyConnected = p1 === p2;
      makeSnapshot(
        `Representatives are p1=${p1}, p2=${p2}. Are they already connected? ${alreadyConnected ? "YES" : "NO"}.`,
        `IF p1 == p2 → ${alreadyConnected ? "YES ✓" : "NO ✗"}`,
        15, 13, 18, 28, [p1, p2], { p1, p2 }
      );

      if (p1 === p2) return 0;

      if (rank[p2] > rank[p1]) {
        par[p1] = p2;
        rank[p2] += rank[p1];
        makeSnapshot(
          `Union: Attach component ${p1} under root ${p2} because ${p2} has a larger rank.`,
          `SET par[${p1}] = ${p2}`,
          18, 16, 20, 30, [p1, p2], { p1, p2 }
        );
      } else {
        par[p2] = p1;
        rank[p1] += rank[p2];
        makeSnapshot(
          `Union: Attach component ${p2} under root ${p1} because ${p1} has a larger or equal rank.`,
          `SET par[${p2}] = ${p1}`,
          21, 19, 23, 33, [p1, p2], { p1, p2 }
        );
      }
      return 1;
    };

    for (const [n1, n2] of EDGES) {
      makeSnapshot(`Process edge [${n1}, ${n2}].`, `FOR edge = [${n1}, ${n2}]`, 26, 23, 10, 11, [n1, n2], { n1, n2 });

      const united = unionFn(n1, n2);
      if (united) {
        res -= 1;
        makeSnapshot(
          `Union successful. Decrement the component count to ${res}.`,
          `SET res = res - 1 → ${res}`,
          27, 24, 11, 12, [], {}
        );
      } else {
        makeSnapshot(
          `Nodes ${n1} and ${n2} are already in the same component. Component count remains ${res}.`,
          `No decrement`,
          15, 13, 18, 28, [], {}
        );
      }
    }

    makeSnapshot(
      `Graph traversal completed. Total connected components: ${res}.`,
      `RETURN res → ${res}`,
      29, 25, 13, 14, [], {}, true
    );

    return { steps: s, stepLineNumbers: stepLines };
  }, []);

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  const step = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  const computePositions = useMemo(() => {
    const children: Record<number, number[]> = {};
    for (let i = 0; i < N; i++) {
      if (step.parent[i] !== i) {
        if (!children[step.parent[i]]) children[step.parent[i]] = [];
        children[step.parent[i]].push(i);
      }
    }

    const rootNodes = Array.from({ length: N }, (_, i) => i).filter(i => step.parent[i] === i);
    const pos: { x: number, y: number }[] = new Array(N).fill(null).map(() => ({ x: 0, y: 0 }));

    const svgW = 500;
    const colW = svgW / (rootNodes.length + 1);

    rootNodes.forEach((root, idx) => {
      const rx = colW * (idx + 1);
      pos[root] = { x: rx, y: 50 };

      const kids = children[root] || [];
      const spread = Math.min(colW * 0.8, 80);
      const startX = kids.length > 1 ? rx - spread / 2 : rx;
      const stepX = kids.length > 1 ? spread / (kids.length - 1) : 0;

      kids.forEach((k, ki) => {
        const kx = startX + stepX * ki;
        pos[k] = { x: kx, y: 140 };

        const grandkids = children[k] || [];
        const gSpread = 50;
        const gStartX = grandkids.length > 1 ? kx - gSpread / 2 : kx;
        const gStepX = grandkids.length > 1 ? gSpread / (grandkids.length - 1) : 0;
        grandkids.forEach((gk, gi) => {
          pos[gk] = { x: gStartX + gStepX * gi, y: 210 };
        });
      });
    });

    return pos;
  }, [step.parent]);

  const getNodeStyle = (i: number) => {
    if (step.activeNodes.includes(i)) return { fill: '#3b82f622', stroke: '#3b82f6', text: '#3b82f6' };
    if (step.parent[i] === i) return { fill: '#10b98111', stroke: '#10b981', text: '#10b981' };
    return { fill: 'transparent', stroke: '#444444', text: '#eeeeee' };
  };

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 relative shadow-sm">
            <h3 className="text-sm font-semibold mb-8 text-foreground font-sans text-center">Connected Components Forest</h3>

            <svg width="100%" height="260" viewBox="0 0 500 260">
              {step.parent.map((p, i) => {
                if (p === i) return null;
                const src = computePositions[i];
                const dst = computePositions[p];
                const active = step.activeNodes.includes(i) || step.activeNodes.includes(p);
                return (
                  <line
                    key={`edge-${i}`}
                    x1={src.x} y1={src.y} x2={dst.x} y2={dst.y}
                    stroke={active ? '#3b82f6' : '#444'}
                    strokeWidth={active ? 3 : 1.5}
                    opacity={active ? 1 : 0.6}
                  />
                );
              })}

              {Array.from({ length: N }, (_, i) => i).map(i => {
                const { x, y } = computePositions[i];
                const s = getNodeStyle(i);
                const isActive = step.activeNodes.includes(i);
                const isRoot = step.parent[i] === i;
                const r = isActive ? 21 : 18;

                return (
                  <g key={`node-${i}`}>
                    {isRoot && <text x={x} y={y - r - 5} textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold">Root</text>}
                    <circle
                      cx={x} cy={y} r={r}
                      fill={s.fill}
                      stroke={s.stroke}
                      strokeWidth="2"
                    />
                    <text x={x} y={y} dy=".3em" textAnchor="middle" fill={s.text} fontSize="11" fontWeight="black">{i}</text>
                  </g>
                );
              })}
            </svg>

            <div className="flex justify-center gap-4 mt-4 text-[10px] text-muted-foreground border-t border-border/30 pt-4">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded border border-[#10b981] bg-[#10b98111]" /> Root</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded border border-[#3b82f6] bg-[#3b82f622]" /> Active</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded border border-[#444]" /> Node</span>
            </div>
          </Card>

          {/* Commentary Panel */}
          <Card className="p-6 bg-card border-border/50 shadow-sm relative overflow-hidden transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75 rounded-full" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                    Algorithm Commentary
                  </span>
                </div>
                <div className="font-mono text-[10px] tracking-tight bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full border border-border/40">
                  Step {currentStepIndex + 1} of {steps.length}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Info className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary/70">
                    Current Action
                  </h4>
                  <div className="text-sm font-medium leading-relaxed text-foreground/90 select-none">
                    {step.explanation}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      }
      rightContent={
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={handleReset}
          />
          <VariablePanel variables={{ ...step.variables, 'Components Count': step.result }} />
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
