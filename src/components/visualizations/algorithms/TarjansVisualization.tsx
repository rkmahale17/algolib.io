import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';

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
  highlightedLines: number[];
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

export const TarjansVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: Step[] = useMemo(() => {
    const s: Step[] = [];
    const graph = GRAPH;
    const n = graph.length;
    const disc = Array(n).fill(-1);
    const low = Array(n).fill(-1);
    const onStack = Array(n).fill(false);
    const stack: number[] = [];
    const sccs: number[][] = [];
    let time = 0;

    const snap = (
      currentNode: number,
      activeEdge: [number, number] | null,
      explanation: string,
      highlightedLines: number[],
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
        highlightedLines,
        variables,
        phase,
      });
    };

    snap(-1, null, 'Initialize: n, disc, low, onStack, stack, sccs, time = 0.', [2, 3, 4, 5, 6, 7, 8], { n }, 'init');

    function dfs(u: number) {
      disc[u] = low[u] = time++;
      snap(u, null, `dfs(${u}): disc[${u}] = low[${u}] = ${disc[u]}, time → ${time}.`, [11], { [`disc[${u}]`]: disc[u], [`low[${u}]`]: low[u], time }, 'visit');

      stack.push(u);
      onStack[u] = true;
      snap(u, null, `Push ${u} onto stack. onStack[${u}] = true.`, [12, 13], { stack: `[${stack.join(',')}]`, [`onStack[${u}]`]: true }, 'visit');

      for (const v of graph[u]) {
        snap(u, [u, v], `Check neighbor v = ${v} of u = ${u}.`, [15], { u, v, [`disc[${v}]`]: disc[v] }, 'recurse');

        if (disc[v] === -1) {
          snap(u, [u, v], `disc[${v}] === -1: recurse dfs(${v}).`, [16, 17], { u, v }, 'recurse');
          dfs(v);
          low[u] = Math.min(low[u], low[v]);
          snap(u, [u, v], `Backtrack to ${u}: low[${u}] = min(low[${u}], low[${v}]) = ${low[u]}.`, [18], { [`low[${u}]`]: low[u], [`low[${v}]`]: low[v] }, 'backtrack');
        } else if (onStack[v]) {
          low[u] = Math.min(low[u], disc[v]);
          snap(u, [u, v], `v = ${v} is on stack (back edge). low[${u}] = min(low[${u}], disc[${v}]) = ${low[u]}.`, [19, 20], { [`low[${u}]`]: low[u], [`disc[${v}]`]: disc[v] }, 'backedge');
        } else {
          snap(u, [u, v], `v = ${v} already visited and not on stack. Skip.`, [19], { v, onStack: false }, 'recurse');
        }
      }

      snap(u, null, `Check if low[${u}](${low[u]}) === disc[${u}](${disc[u]}): ${low[u] === disc[u] ? 'YES — root of SCC!' : 'NO — not root.'}`, [24], { [`low[${u}]`]: low[u], [`disc[${u}]`]: disc[u] }, 'scc');

      if (low[u] === disc[u]) {
        const scc: number[] = [];
        let w: number;
        do {
          w = stack.pop()!;
          onStack[w] = false;
          scc.push(w);
          snap(u, null, `Pop ${w} from stack → add to SCC.`, [28, 29, 30], { w, stack: `[${stack.join(',')}]` }, 'scc');
        } while (w !== u);
        sccs.push(scc);
        snap(u, null, `SCC complete: [${scc.join(', ')}]. Total SCCs: ${sccs.length}.`, [32], { scc: `[${scc.join(',')}]`, totalSCCs: sccs.length }, 'scc');
      }
    }

    snap(-1, null, 'Outer loop: iterate over all vertices.', [36], { i: 0, n }, 'init');

    for (let i = 0; i < n; i++) {
      snap(i, null, `i = ${i}: disc[${i}] === -1? ${disc[i] === -1 ? 'YES — call dfs(' + i + ').' : 'NO — skip.'}`, [36, 37], { i, [`disc[${i}]`]: disc[i] }, 'init');
      if (disc[i] === -1) {
        dfs(i);
      }
    }

    snap(-1, null, `Done! Returning ${sccs.length} SCCs: ${sccs.map(c => '[' + c.join(',') + ']').join(', ')}.`, [42], { sccs: sccs.length }, 'done');

    return s;
  }, []);

  const code = `function tarjanSCC(graph: number[][]): number[][] {
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
}`;

  const step = steps[currentStep];

  const getNodeStyle = (idx: number) => {
    const sccIdx = sccIndexFor(step.sccs, idx);
    if (sccIdx !== -1) return SCC_PALETTE[sccIdx % SCC_PALETTE.length];
    if (idx === step.currentNode) return { fill: '#f59e0b', stroke: '#d97706', text: '#000' };
    if (step.onStack[idx]) return { fill: '#8b5cf6', stroke: '#7c3aed', text: '#fff' };
    if (step.disc[idx] !== -1) return { fill: '#22c55e', stroke: '#16a34a', text: '#fff' };
    return { fill: '#1e293b', stroke: '#475569', text: '#94a3b8' };
  };

  const isActiveEdge = (u: number, v: number) =>
    step.activeEdge && step.activeEdge[0] === u && step.activeEdge[1] === v;

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-4">
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
                      strokeWidth={idx === step.currentNode ? 3 : 1.5}
                    />
                    <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle"
                      fill={style.text} fontSize={14} fontWeight="bold">
                      {idx}
                    </text>
                    {step.disc[idx] !== -1 && (
                      <text x={pos.x} y={pos.y + 30} textAnchor="middle" dominantBaseline="middle"
                        fill="#94a3b8" fontSize={9}>
                        d:{step.disc[idx]} l:{step.low[idx]}
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

          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3 bg-card/60 border-primary/20">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Stack
              </h4>
              <div className="flex flex-wrap gap-1 min-h-[28px]">
                <AnimatePresence>
                  {step.stack.length > 0
                    ? step.stack.map((n, i) => (
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
                  {step.sccs.length > 0
                    ? step.sccs.map((scc, i) => (
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

          <Card className="p-4 border-primary/20 bg-primary/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Step</h4>
            <p className="text-sm font-medium leading-relaxed">{step.explanation}</p>
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
