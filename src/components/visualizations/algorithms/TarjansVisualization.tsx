import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  disc: number[];
  low: number[];
  onStack: boolean[];
  stack: number[];
  sccs: number[][];
  time: number;
  currentNode: number;
  activeEdge: [number, number] | null;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
  phase: 'init' | 'visit' | 'recurse' | 'backtrack' | 'backedge' | 'scc' | 'done';
}

const GRAPH: number[][] = [
  [1],      // 0 → 1
  [2],      // 1 → 2
  [0, 3],   // 2 → 0, 3
  [4],      // 3 → 4
  [5],      // 4 → 5
  [3],      // 5 → 3
];

const NODE_POSITIONS = [
  { x: 120, y: 60 },
  { x: 250, y: 60 },
  { x: 380, y: 60 },
  { x: 380, y: 180 },
  { x: 250, y: 180 },
  { x: 120, y: 180 },
];

const SCC_PALETTE = [
  { fill: '#7c3aed', stroke: '#6d28d9', text: '#fff' },
  { fill: '#0891b2', stroke: '#0e7490', text: '#fff' },
  { fill: '#059669', stroke: '#047857', text: '#fff' },
  { fill: '#d97706', stroke: '#b45309', text: '#fff' },
];

function sccIndexFor(sccs: number[][], node: number): number {
  return sccs.findIndex(scc => scc.includes(node));
}

const languages: VisualizationLanguageMap = {
  typescript: `function tarjanSCC(graph: number[][]): number[][] {
  const n = graph.length;
  const disc = Array(n).fill(-1);
  const low = Array(n).fill(-1);
  const onStack = Array(n).fill(false);
  const stack: number[] = [];
  const sccs: number[][] = [];
  let time = 0;
  function dfs(u: number) {
    disc[u] = low[u] = time++;
    stack.push(u);
    onStack[u] = true;
    for (const v of graph[u]) {
      if (disc[v] === -1) {
        dfs(v);
        low[u] = Math.min(low[u], low[v]);
      } else if (onStack[v]) {
        low[u] = Math.min(low[u], disc[v]);
      }
    }
    if (low[u] === disc[u]) {
      const scc: number[] = [];
      let w: number;
      do {
        w = stack.pop()!;
        onStack[w] = false;
        scc.push(w);
      } while (w !== u);
      sccs.push(scc);
    }
  }
  for (let i = 0; i < n; i++) {
    if (disc[i] === -1) {
      dfs(i);
    }
  }
  return sccs;
}`,

  python: `def tarjanSCC(graph):
    n = len(graph)
    disc = [-1] * n
    low = [-1] * n
    onStack = [False] * n
    stack = []
    sccs = []
    time = 0
    def dfs(u):
        nonlocal time
        disc[u] = low[u] = time
        time += 1
        stack.append(u)
        onStack[u] = True
        for v in graph[u]:
            if disc[v] == -1:
                dfs(v)
                low[u] = min(low[u], low[v])
            elif onStack[v]:
                low[u] = min(low[u], disc[v])
        if low[u] == disc[u]:
            scc = []
            while True:
                w = stack.pop()
                onStack[w] = False
                scc.append(w)
                if w == u:
                    break
            sccs.append(scc)
    for i in range(n):
        if disc[i] == -1:
            dfs(i)
    return sccs`,

  java: `public static class Solution {
    public List<List<Integer>> tarjanSCC(List<List<Integer>> graph) {
        int n = graph.size();
        int[] disc = new int[n];
        int[] low = new int[n];
        boolean[] onStack = new boolean[n];
        Stack<Integer> stack = new Stack<>();
        List<List<Integer>> sccs = new ArrayList<>();
        int time = 0;
        Arrays.fill(disc, -1);
        Arrays.fill(low, -1);
        for (int i = 0; i < n; i++) {
            if (disc[i] == -1) {
                dfs(graph, i, disc, low, onStack, stack, sccs, time = 0);
            }
        }
        return sccs;
    }
    private void dfs(List<List<Integer>> graph, int u, int[] disc, int[] low, boolean[] onStack, Stack<Integer> stack, List<List<Integer>> sccs, int time) {
        disc[u] = low[u] = time++;
        stack.push(u);
        onStack[u] = true;
        for (int v : graph.get(u)) {
            if (disc[v] == -1) {
                dfs(graph, v, disc, low, onStack, stack, sccs, time);
                low[u] = Math.min(low[u], low[v]);
            } else if (onStack[v]) {
                low[u] = Math.min(low[u], disc[v]);
            }
        }
        if (low[u] == disc[u]) {
            List<Integer> scc = new ArrayList<>();
            int w;
            do {
                w = stack.pop();
                onStack[w] = false;
                scc.add(w);
            } while (w != u);
            sccs.add(scc);
        }
    }
}`,

  cpp: `class Solution {
private:
    int time;
    vector<int> disc, low;
    vector<bool> onStack;
    stack<int> st;
    vector<vector<int>> sccs;
    void dfs(int u, vector<vector<int>>& graph) {
        disc[u] = low[u] = time++;
        st.push(u);
        onStack[u] = true;
        for (int v : graph[u]) {
            if (disc[v] == -1) {
                dfs(v, graph);
                low[u] = min(low[u], low[v]);
            } else if (onStack[v]) {
                low[u] = min(low[u], disc[v]);
            }
        }
        if (low[u] == disc[u]) {
            vector<int> scc;
            int w;
            do {
                w = st.top();
                st.pop();
                onStack[w] = false;
                scc.push_back(w);
            } while (w != u);
            sccs.push_back(scc);
        }
    }
public:
    vector<vector<int>> tarjanSCC(vector<vector<int>>& graph) {
        int n = graph.size();
        time = 0;
        disc.assign(n, -1);
        low.assign(n, -1);
        onStack.assign(n, false);
        for (int i = 0; i < n; i++) {
            if (disc[i] == -1) {
                dfs(i, graph);
            }
        }
        return sccs;
    }
};`,
};

export const TarjansVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const s: Step[] = [];
    const graph = GRAPH;
    const n = graph.length;
    const disc = Array(n).fill(-1);
    const low = Array(n).fill(-1);
    const onStack = Array(n).fill(false);
    const stack: number[] = [];
    const sccs: number[][] = [];
    let time = 0;

    const stepLineNumbers: StepLineNumberMap = {
      typescript: [],
      python: [],
      java: [],
      cpp: []
    };

    const addLines = (ts: number, py: number, java: number, cpp: number) => {
      stepLineNumbers.typescript!.push(ts);
      stepLineNumbers.python!.push(py);
      stepLineNumbers.java!.push(java);
      stepLineNumbers.cpp!.push(cpp);
    };

    const snap = (
      currentNode: number,
      activeEdge: [number, number] | null,
      explanation: string,
      pseudoStep: string,
      ts: number, py: number, java: number, cpp: number,
      variables: Record<string, any>,
      phase: Step['phase']
    ) => {
      s.push({
        disc: [...disc],
        low: [...low],
        onStack: [...onStack],
        stack: [...stack],
        sccs: sccs.map(c => [...c]),
        time,
        currentNode,
        activeEdge,
        explanation,
        pseudoStep,
        variables,
        phase,
      });
      addLines(ts, py, java, cpp);
    };

    snap(
      -1, null,
      'Initialize discovery times, low values, onStack table, stack, sccs list, and global clock time = 0.',
      'SET disc = [-1...], low = [-1...], onStack = [false...], stack = [], sccs = [], time = 0',
      2, 2, 2, 25,
      { n }, 'init'
    );

    function dfs(u: number) {
      disc[u] = low[u] = time++;
      snap(
        u, null,
        `dfs(${u}): Set discovery time and low-link value disc[${u}] = low[${u}] = ${disc[u]}. Increment clock time to ${time}.`,
        `SET disc[${u}] = low[${u}] = time++  →  ${disc[u]}`,
        10, 11, 16, 8,
        { [`disc[${u}]`]: disc[u], [`low[${u}]`]: low[u], time }, 'visit'
      );

      stack.push(u);
      onStack[u] = true;
      snap(
        u, null,
        `Push node ${u} onto stack and mark as onStack[${u}] = true.`,
        `CALL stack.push(${u}); SET onStack[${u}] = true`,
        11, 13, 17, 9,
        { stack: `[${stack.join(',')}]`, [`onStack[${u}]`]: true }, 'visit'
      );

      for (const v of graph[u]) {
        snap(
          u, [u, v],
          `Explore directed edge: ${u} → ${v}. Checking neighbor v = ${v}.`,
          `FOR neighbor v = ${v} of u = ${u}`,
          13, 15, 19, 11,
          { u, v, [`disc[${v}]`]: disc[v] }, 'recurse'
        );

        if (disc[v] === -1) {
          snap(
            u, [u, v],
            `Neighbor ${v} is unvisited (disc[${v}] == -1). Recursively call dfs(${v}).`,
            `IF disc[${v}] == -1: CALL dfs(${v})`,
            14, 16, 20, 12,
            { u, v }, 'recurse'
          );
          dfs(v);
          low[u] = Math.min(low[u], low[v]);
          snap(
            u, [u, v],
            `Backtrack from ${v} to ${u}. Update low[${u}] = min(low[${u}], low[${v}]) = ${low[u]}.`,
            `SET low[${u}] = MIN(low[${u}], low[${v}] (${low[v]}))  →  ${low[u]}`,
            16, 18, 22, 14,
            { [`low[${u}]`]: low[u], [`low[${v}]`]: low[v] }, 'backtrack'
          );
        } else if (onStack[v]) {
          low[u] = Math.min(low[u], disc[v]);
          snap(
            u, [u, v],
            `Neighbor ${v} is on stack. Back edge found! Update low[${u}] = min(low[${u}], disc[${v}] (${disc[v]})) = ${low[u]}.`,
            `ELSE IF onStack[${v}]: SET low[${u}] = MIN(low[${u}], disc[${v}] (${disc[v]}))  →  ${low[u]}`,
            17, 19, 24, 15,
            { [`low[${u}]`]: low[u], [`disc[${v}]`]: disc[v] }, 'backedge'
          );
        } else {
          snap(
            u, [u, v],
            `Neighbor ${v} is already visited and not on the stack. Skip.`,
            `ELSE: skip neighbor ${v}`,
            13, 15, 19, 11,
            { v, onStack: false }, 'recurse'
          );
        }
      }

      snap(
        u, null,
        `Finished exploring neighbors of ${u}. Check if low[${u}] (${low[u]}) == disc[${u}] (${disc[u]}).`,
        `IF low[${u}] (${low[u]}) == disc[${u}] (${disc[u]})`,
        21, 21, 27, 19,
        { [`low[${u}]`]: low[u], [`disc[${u}]`]: disc[u] }, 'scc'
      );

      if (low[u] === disc[u]) {
        const scc: number[] = [];
        let w: number;
        do {
          w = stack.pop()!;
          onStack[w] = false;
          scc.push(w);
          snap(
            u, null,
            `Pop ${w} from stack and add to current Strongly Connected Component.`,
            `POP w from stack  →  w = ${w}; SET onStack[w] = false`,
            24, 23, 29, 21,
            { w, stack: `[${stack.join(',')}]` }, 'scc'
          );
        } while (w !== u);
        sccs.push(scc);
        snap(
          u, null,
          `Strongly Connected Component complete: [${scc.join(', ')}].`,
          `ADD scc [${scc.join(',')}] to sccs list`,
          29, 29, 33, 25,
          { scc: `[${scc.join(',')}]`, totalSCCs: sccs.length }, 'scc'
        );
      }
    }

    snap(
      -1, null,
      'Outer loop: iterate over all vertices to find unvisited roots.',
      'FOR i = 0 to n-1',
      32, 30, 10, 27,
      { i: 0, n }, 'init'
    );

    for (let i = 0; i < n; i++) {
      snap(
        i, null,
        `Check if vertex ${i} is visited: disc[${i}] === -1?`,
        `IF disc[${i}] == -1  →  ${disc[i] === -1 ? 'YES ✓' : 'NO ✗'}`,
        33, 31, 11, 28,
        { i, [`disc[${i}]`]: disc[i] }, 'init'
      );
      if (disc[i] === -1) {
        dfs(i);
      }
    }

    snap(
      -1, null,
      `Finished! Tarjan's algorithm successfully found ${sccs.length} SCCs.`,
      `RETURN sccs  →  size ${sccs.length}`,
      37, 33, 15, 31,
      { sccs: sccs.length }, 'done'
    );

    return { steps: s, stepLineNumbers };
  }, []);

  const currentStep = steps[currentStepIndex] || steps[0];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  const getNodeStyle = (idx: number) => {
    const sccIdx = sccIndexFor(currentStep.sccs, idx);
    if (sccIdx !== -1) return SCC_PALETTE[sccIdx % SCC_PALETTE.length];
    if (idx === currentStep.currentNode) return { fill: '#f59e0b', stroke: '#d97706', text: '#000' };
    if (currentStep.onStack[idx]) return { fill: '#8b5cf6', stroke: '#7c3aed', text: '#fff' };
    if (currentStep.disc[idx] !== -1) return { fill: '#22c55e', stroke: '#16a34a', text: '#fff' };
    return { fill: '#1e293b', stroke: '#475569', text: '#94a3b8' };
  };

  const isActiveEdge = (u: number, v: number) =>
    currentStep.activeEdge && currentStep.activeEdge[0] === u && currentStep.activeEdge[1] === v;

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-4 flex flex-col h-full">
          <div>
            <Card className="p-4 bg-card/60 border-primary/20">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Graph — Tarjan's SCC
              </h3>
              <svg viewBox="0 0 500 240" className="w-full" style={{ minHeight: 200 }}>
                <defs>
                  <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 z" fill="#475569" />
                  </marker>
                  <marker id="arrow-active" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 z" fill="#f59e0b" />
                  </marker>
                </defs>

                {GRAPH.flatMap((neighbors, u) =>
                  neighbors.map(v => {
                    const from = NODE_POSITIONS[u];
                    const to = NODE_POSITIONS[v];
                    const angle = Math.atan2(to.y - from.y, to.x - from.x);
                    const r = 20;
                    const x1 = from.x + Math.cos(angle) * r;
                    const y1 = from.y + Math.sin(angle) * r;
                    const x2 = to.x - Math.cos(angle) * r;
                    const y2 = to.y - Math.sin(angle) * r;
                    const active = isActiveEdge(u, v);
                    return (
                      <line
                        key={`${u}-${v}`}
                        x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke={active ? '#f59e0b' : '#475569'}
                        strokeWidth={active ? 2.5 : 1.5}
                        markerEnd={active ? 'url(#arrow-active)' : 'url(#arrow)'}
                        strokeOpacity={active ? 1 : 0.5}
                      />
                    );
                  })
                )}

                {NODE_POSITIONS.map((pos, idx) => {
                  const style = getNodeStyle(idx);
                  return (
                    <g key={idx}>
                      <circle
                        cx={pos.x} cy={pos.y} r={20}
                        fill={style.fill}
                        stroke={style.stroke}
                        strokeWidth={idx === currentStep.currentNode ? 3 : 1.5}
                      />
                      <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle"
                        fill={style.text} fontSize={14} fontWeight="bold">
                        {idx}
                      </text>
                      {currentStep.disc[idx] !== -1 && (
                        <text x={pos.x} y={pos.y + 30} textAnchor="middle" dominantBaseline="middle"
                          fill="#94a3b8" fontSize={9}>
                          d:{currentStep.disc[idx]} l:{currentStep.low[idx]}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              <div className="flex flex-wrap gap-3 mt-2 text-[10px] font-medium text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-[#1e293b] border border-[#475569] inline-block" />Unvisited
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-[#8b5cf6] inline-block" />On Stack
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-[#f59e0b] inline-block" />Current
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-[#22c55e] inline-block" />Visited
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-[#7c3aed] inline-block" />SCC
                </span>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <Card className="p-3 bg-card/60 border-primary/20">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  Stack
                </h4>
                <div className="flex flex-wrap gap-1 min-h-[28px]">
                  <AnimatePresence>
                    {currentStep.stack.length > 0
                      ? currentStep.stack.map((n, i) => (
                        <motion.span
                          key={n}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="px-2 py-1 rounded-md text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40"
                        >
                          {n}
                        </motion.span>
                      ))
                      : <span className="text-xs text-muted-foreground italic">empty</span>}
                  </AnimatePresence>
                </div>
              </Card>

              <Card className="p-3 bg-card/60 border-primary/20">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  SCCs Found
                </h4>
                <div className="flex flex-col gap-1 min-h-[28px]">
                  <AnimatePresence>
                    {currentStep.sccs.length > 0
                      ? currentStep.sccs.map((scc, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="px-2 py-1 rounded-md text-xs font-bold border"
                          style={{
                            backgroundColor: SCC_PALETTE[i % SCC_PALETTE.length].fill + '33',
                            color: SCC_PALETTE[i % SCC_PALETTE.length].fill,
                            borderColor: SCC_PALETTE[i % SCC_PALETTE.length].fill + '66',
                          }}
                        >
                          [{scc.join(', ')}]
                        </motion.span>
                      ))
                      : <span className="text-xs text-muted-foreground italic">none yet</span>}
                  </AnimatePresence>
                </div>
              </Card>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            <Card className="p-4 border-l-4 border-primary bg-primary/5 relative overflow-hidden">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Step</h4>
              <p className="text-sm font-medium leading-relaxed">{currentStep.explanation}</p>
            </Card>
            <VariablePanel variables={currentStep.variables} />
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
