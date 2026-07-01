import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  parent: number[];
  rank: number[];
  edges: number[][];
  activeEdge: number[] | null;
  activeNodes: number[];
  redundantEdge: number[] | null;
  phase: 'init' | 'loop' | 'find' | 'union' | 'cycle-detected' | 'done';
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
  dsuEdges: { u: number; v: number; active: boolean }[];
}

interface TestCase {
  id: string;
  name: string;
  edges: number[][];
  expected: number[];
}

const TEST_CASES: TestCase[] = [
  { id: 'ex1', name: 'Simple Triangle', edges: [[1, 2], [1, 3], [2, 3]], expected: [2, 3] },
  { id: 'ex2', name: 'Five Node Cycle', edges: [[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]], expected: [1, 4] },
  { id: 'ex3', name: 'Larger Loop', edges: [[1, 2], [2, 3], [3, 4], [4, 5], [1, 5]], expected: [1, 5] }
];

const languages: VisualizationLanguageMap = {
  typescript: `function findRedundantConnection(edges: number[][]): number[] {
  const n = edges.length;
  const parent: number[] = Array.from({ length: n + 1 }, (_, i) => i);
  const rank: number[] = Array(n + 1).fill(1);
  function find(node: number): number {
    if (node !== parent[node]) {
      parent[node] = find(parent[node]);
    }
    return parent[node];
  }
  function union(n1: number, n2: number): boolean {
    const p1 = find(n1);
    const p2 = find(n2);
    if (p1 === p2) {
      return false;
    }
    if (rank[p1] > rank[p2]) {
      parent[p2] = p1;
      rank[p1] += rank[p2];
    } else {
      parent[p1] = p2;
      rank[p2] += rank[p1];
    }
    return true;
  }
  for (const [u, v] of edges) {
    if (!union(u, v)) {
      return [u, v];
    }
  }
  return [];
}`,
  python: `def findRedundantConnection(edges: list[list[int]]) -> list[int]:
    n = len(edges)
    parent = list(range(n + 1))
    rank = [1] * (n + 1)
    def find(node: int) -> int:
        if parent[node] == node:
            return node
        parent[node] = find(parent[node])
        return parent[node]
    def union(n1: int, n2: int) -> bool:
        p1 = find(n1)
        p2 = find(n2)
        if p1 == p2:
            return False
        if rank[p1] > rank[p2]:
            parent[p2] = p1
            rank[p1] += rank[p2]
        else:
            parent[p1] = p2
            rank[p2] += rank[p1]
        return True
    for u, v in edges:
        if not union(u, v):
            return [u, v]
    return []`,
  java: `public static class Solution {
    private int[] parent;
    private int[] size;
    public int[] findRedundantConnection(int[][] edges) {
        int n = edges.length;
        parent = new int[n + 1];
        size = new int[n + 1];
        for (int i = 0; i <= n; i++) {
            parent[i] = i;
            size[i] = 1;
        }
        for (int[] edge : edges) {
            int u = edge[0];
            int v = edge[1];
            if (!union(u, v)) {
                return edge;
            }
        }
        return new int[0];
    }
    private int find(int i) {
        if (parent[i] == i) {
            return i;
        }
        parent[i] = find(parent[i]);
        return parent[i];
    }
    private boolean union(int i, int j) {
        int rootI = find(i);
        int rootJ = find(j);
        if (rootI == rootJ) {
            return false;
        }
        if (size[rootI] < size[rootJ]) {
            parent[rootI] = rootJ;
            size[rootJ] += size[rootI];
        } else {
            parent[rootJ] = rootI;
            size[rootI] += size[rootJ];
        }
        return true;
    }
}`,
  cpp: `class Solution {
public:
    vector<int> parent;
    vector<int> rank;
    vector<int> findRedundantConnection(vector<vector<int>>& edges) {
        int n = edges.size();
        parent.resize(n + 1);
        for (int i = 1; i <= n; ++i) {
            parent[i] = i;
        }
        rank.assign(n + 1, 1);
        for (const vector<int>& edge : edges) {
            int u = edge[0];
            int v = edge[1];
            if (!unite(u, v)) {
                return edge;
            }
        }
        return {};
    }
    int find(int node) {
        if (node != parent[node]) {
            parent[node] = find(parent[node]);
        }
        return parent[node];
    }
    bool unite(int n1, int n2) {
        int p1 = find(n1);
        int p2 = find(n2);
        if (p1 == p2) {
            return false;
        }
        if (rank[p1] > rank[p2]) {
            parent[p2] = p1;
            rank[p1] += rank[p2];
        } else {
            parent[p1] = p2;
            rank[p2] += rank[p1];
        }
        return true;
    }
};`
};

export const RedundantConnectionVisualization = () => {
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string>(TEST_CASES[0].id);
  const selectedTestCase = useMemo(() => TEST_CASES.find(t => t.id === selectedTestCaseId) || TEST_CASES[0], [selectedTestCaseId]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const edges = selectedTestCase.edges;
    const n = edges.length;
    const newSteps: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    
    const parent = Array.from({ length: n + 1 }, (_, i) => i);
    const rank = Array(n + 1).fill(1);
    const dsuEdges: { u: number; v: number; active: boolean }[] = [];

    const getVariables = (extra: Record<string, any> = {}) => {
      return {
        'edges': JSON.stringify(edges),
        'parent': `[${parent.slice(1).join(', ')}]`,
        'rank/size': `[${rank.slice(1).join(', ')}]`,
        ...extra
      };
    };

    const pushStep = (
      explanation: string,
      pseudo: string,
      phase: Step['phase'],
      activeEdge: number[] | null,
      activeNodes: number[],
      redundantEdge: number[] | null,
      variablesExtra: Record<string, any> = {},
      ts: number, py: number, jv: number, cp: number
    ) => {
      newSteps.push({
        parent: [...parent],
        rank: [...rank],
        edges: edges.map(e => [...e]),
        activeEdge,
        activeNodes,
        redundantEdge,
        phase,
        explanation,
        pseudoStep: pseudo,
        variables: getVariables(variablesExtra),
        dsuEdges: dsuEdges.map(e => ({ ...e }))
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    pushStep(
      "Welcome! We want to find the redundant connection. We'll use the Disjoint Set Union (DSU) algorithm.",
      `findRedundantConnection(edges)`,
      'init', null, [], null,
      {},
      1, 1, 4, 5
    );

    pushStep(
      `Initialize parent array of size ${n + 1}. Each node is initially its own parent.`,
      "SET parent = [0, 1, 2, ..., n]",
      'init', null, [], null,
      {},
      3, 3, 8, 7
    );

    pushStep(
      `Initialize rank/size array with 1s to track tree sizes.`,
      "SET rank = [1] * (n + 1)",
      'init', null, [], null,
      {},
      4, 4, 10, 11
    );

    const find = (node: number, activeEdge: number[]): number => {
      pushStep(
        `find(${node}): checking parent of node ${node}.`,
        `find(${node})`,
        'find', activeEdge, [node], null,
        { node, 'parent[node]': parent[node] },
        6, 6, 22, 22
      );

      if (node !== parent[node]) {
        pushStep(
          `find(${node}): node ${node} is not its own parent. Recursively find root of ${parent[node]}.`,
          `find(parent[${node}])`,
          'find', activeEdge, [node, parent[node]], null,
          { node, 'parent[node]': parent[node] },
          7, 8, 25, 23
        );
        
        const root = find(parent[node], activeEdge);
        
        parent[node] = root; // path compression
        pushStep(
          `find(${node}) path compression: update parent[${node}] directly to root ${root}.`,
          `parent[${node}] = root`,
          'find', activeEdge, [node, root], null,
          { node, root, 'parent[node]': root },
          7, 8, 25, 23
        );
        return root;
      }
      
      pushStep(
        `find(${node}) root found: node ${node} is its own parent, so it is the root of this component.`,
        `RETURN ${node}`,
        'find', activeEdge, [node], null,
        { node, root: node },
        9, 7, 23, 25
      );
      return node;
    };

    const union = (n1: number, n2: number, activeEdge: number[]): boolean => {
      pushStep(
        `union(${n1}, ${n2}): find roots of both nodes to see if they belong to the same component.`,
        `union(${n1}, ${n2})`,
        'union', activeEdge, [n1, n2], null,
        { n1, n2 },
        12, 11, 29, 28
      );

      const p1 = find(n1, activeEdge);
      const p2 = find(n2, activeEdge);

      pushStep(
        `union(${n1}, ${n2}) comparison: compare roots. root(${n1}) = ${p1}, root(${n2}) = ${p2}.`,
        `IF p1 == p2  →  ${p1} == ${p2}`,
        'union', activeEdge, [p1, p2], null,
        { n1, n2, p1, p2 },
        14, 13, 31, 30
      );

      if (p1 === p2) {
        pushStep(
          `union(${n1}, ${n2}) cycle detected: nodes ${n1} and ${n2} already have the same root ${p1}! Return false.`,
          "RETURN False",
          'union', activeEdge, [p1], null,
          { n1, n2, p1, p2, 'union': 'false' },
          15, 14, 32, 31
        );
        return false;
      }

      const rankP1 = rank[p1];
      const rankP2 = rank[p2];

      if (rankP1 > rankP2) {
        parent[p2] = p1;
        rank[p1] += rankP2;
        pushStep(
          `union(${n1}, ${n2}) by rank: rank[${p1}] (${rankP1}) > rank[${p2}] (${rankP2}). Attach ${p2} under root ${p1}.`,
          `parent[p2] = p1; rank[p1] += rank[p2]`,
          'union', activeEdge, [p1, p2], null,
          { n1, n2, p1, p2, [`parent[${p2}]`]: p1, [`rank/size[${p1}]`]: rank[p1] },
          18, 16, 35, 34
        );
      } else {
        parent[p1] = p2;
        rank[p2] += rankP1;
        pushStep(
          `union(${n1}, ${n2}) by rank: rank[${p2}] (${rankP2}) >= rank[${p1}] (${rankP1}). Attach ${p1} under root ${p2}.`,
          `parent[p1] = p2; rank[p2] += rank[p1]`,
          'union', activeEdge, [p1, p2], null,
          { n1, n2, p1, p2, [`parent[${p1}]`]: p2, [`rank/size[${p2}]`]: rank[p2] },
          21, 19, 38, 37
        );
      }

      dsuEdges.push({ u: n1, v: n2, active: true });
      pushStep(
        `union(${n1}, ${n2}) success: components merged. Return true.`,
        "RETURN True",
        'union', activeEdge, [p1, p2], null,
        { n1, n2, 'union': 'true' },
        24, 21, 41, 40
      );
      return true;
    };

    pushStep(
      "Iterate through each edge in the input edges array.",
      "FOR u, v IN edges",
      'loop', null, [], null,
      {},
      26, 22, 12, 12
    );

    for (let idx = 0; idx < edges.length; idx++) {
      const [u, v] = edges[idx];
      const activeEdge = [u, v];

      pushStep(
        `Processing edge ${idx + 1}/${edges.length}: [${u}, ${v}].`,
        `// Inspecting [${u}, ${v}]`,
        'loop', activeEdge, [u, v], null,
        { u, v },
        26, 22, 12, 12
      );

      pushStep(
        `Check if union(${u}, ${v}) fails.`,
        `IF NOT union(${u}, ${v})`,
        'loop', activeEdge, [u, v], null,
        { u, v },
        27, 23, 15, 15
      );

      const unionSuccess = union(u, v, activeEdge);

      if (!unionSuccess) {
        pushStep(
          `Cycle found! Edge [${u}, ${v}] connects two vertices that are already connected. Return [${u}, ${v}].`,
          `RETURN [${u}, ${v}]`,
          'cycle-detected', activeEdge, [u, v], activeEdge,
          { 'redundant': `[${u}, ${v}]` },
          28, 24, 16, 16
        );
        break;
      }
    }

    return { steps: newSteps, stepLineNumbers: lines };
  }, [selectedTestCase]);

  const currentStep = steps[currentStepIndex] || steps[0];
  const pseudoSteps = useMemo(() => steps.map((s) => s.pseudoStep), [steps]);
  const n = selectedTestCase.edges.length;

  useEffect(() => {
    if (currentStepIndex === steps.length - 1 && steps.length > 0) {
      const step = steps[currentStepIndex];
      if (step.phase === 'cycle-detected') {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 }
        });
      }
    }
  }, [currentStepIndex, steps]);

  const computeCircularPositions = (nodeCount: number) => {
    const cx = 100;
    const cy = 100;
    const R = 64;
    const pos: Record<number, { x: number; y: number }> = {};
    for (let i = 1; i <= nodeCount; i++) {
      const angle = (2 * Math.PI * (i - 1)) / nodeCount - Math.PI / 2;
      pos[i] = {
        x: cx + R * Math.cos(angle),
        y: cy + R * Math.sin(angle)
      };
    }
    return pos;
  };

  const nodePositions = computeCircularPositions(n);

  const dsuTreePositions = () => {
    const children: Record<number, number[]> = {};
    for (let i = 1; i <= n; i++) {
      if (currentStep.parent[i] !== i) {
        if (!children[currentStep.parent[i]]) children[currentStep.parent[i]] = [];
        children[currentStep.parent[i]].push(i);
      }
    }

    const rootNodes = Array.from({ length: n }, (_, i) => i + 1).filter(i => currentStep.parent[i] === i);
    const pos: Record<number, { x: number; y: number }> = {};

    const svgW = 200;
    const colW = svgW / (rootNodes.length + 1);

    rootNodes.forEach((root, idx) => {
      const rx = colW * (idx + 1);
      pos[root] = { x: rx, y: 30 };

      const kids = children[root] || [];
      const spread = Math.min(colW * 0.8, 50);
      const startX = kids.length > 1 ? rx - spread / 2 : rx;
      const stepX = kids.length > 1 ? spread / (kids.length - 1) : 0;

      kids.forEach((k, ki) => {
        const kx = startX + stepX * ki;
        pos[k] = { x: kx, y: 90 };

        const grandkids = children[k] || [];
        const gSpread = 30;
        const gStartX = grandkids.length > 1 ? kx - gSpread / 2 : kx;
        const gStepX = grandkids.length > 1 ? gSpread / (grandkids.length - 1) : 0;
        grandkids.forEach((gk, gi) => {
          pos[gk] = { x: gStartX + gStepX * gi, y: 150 };
        });
      });
    });

    return pos;
  };

  const dsuPositions = dsuTreePositions();

  const getNodeStyle = (i: number) => {
    if (currentStep.activeNodes.includes(i)) {
      return { fill: '#f59e0b15', stroke: '#f59e0b', text: '#f59e0b' };
    }
    if (currentStep.parent[i] === i) {
      return { fill: '#10b98110', stroke: '#10b981', text: '#10b981' };
    }
    return { fill: '#64748b05', stroke: '#64748b', text: '#475569' };
  };

  return (
    <div className="space-y-6">
      {/* Test Cases Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/30 p-4 rounded-lg border border-border/50">
        <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
          Test Cases
        </h3>
        <div className="flex flex-wrap gap-2 bg-background p-1 rounded-lg border border-border shadow-sm">
          {TEST_CASES.map(tc => (
            <button
              key={tc.id}
              onClick={() => {
                setSelectedTestCaseId(tc.id);
                setCurrentStepIndex(0);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 ${
                selectedTestCaseId === tc.id 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {tc.name}
            </button>
          ))}
        </div>
      </div>

      <VisualizationLayout
        leftContent={
          <div className="space-y-6">
            <Card className="p-3 bg-card border border-border shadow-sm flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center justify-center gap-4 overflow-hidden">
              
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Graph Connectivity
                </span>
                <svg width="200" height="200" className="border border-border/50 rounded-lg bg-slate-50/50 dark:bg-slate-950/20">
                  {selectedTestCase.edges.map(([u, v], idx) => {
                    const src = nodePositions[u];
                    const dst = nodePositions[v];
                    
                    const isActive = currentStep.activeEdge?.[0] === u && currentStep.activeEdge?.[1] === v;
                    const isRedundant = currentStep.redundantEdge?.[0] === u && currentStep.redundantEdge?.[1] === v;
                    
                    const isDSUEdge = currentStep.dsuEdges.some(de => 
                      (de.u === u && de.v === v) || (de.u === v && de.v === u)
                    );

                    let color = '#cbd5e1';
                    let strokeWidth = '1.5';
                    let strokeDash = '4,4';

                    if (isRedundant) {
                      color = '#ef4444';
                      strokeWidth = '3';
                      strokeDash = '0';
                    } else if (isActive) {
                      color = '#f59e0b';
                      strokeWidth = '2.5';
                      strokeDash = '0';
                    } else if (isDSUEdge) {
                      color = '#10b981';
                      strokeWidth = '1.8';
                      strokeDash = '0';
                    }

                    return (
                      <motion.line
                        key={idx}
                        x1={src.x} y1={src.y} x2={dst.x} y2={dst.y}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={strokeDash}
                        animate={isActive ? { opacity: [0.4, 1, 0.4] } : { opacity: 1 }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                      />
                    );
                  })}

                  {Array.from({ length: n }, (_, i) => i + 1).map(nodeVal => {
                    const { x, y } = nodePositions[nodeVal];
                    const active = currentStep.activeNodes.includes(nodeVal) || currentStep.activeEdge?.includes(nodeVal);
                    const isRoot = currentStep.parent[nodeVal] === nodeVal;

                    return (
                      <g key={nodeVal}>
                        <circle
                          cx={x} cy={y} r="14"
                          fill={active ? '#f59e0b10' : isRoot ? '#10b98108' : '#ffffff'}
                          stroke={active ? '#f59e0b' : isRoot ? '#10b981' : '#e2e8f0'}
                          strokeWidth={active || isRoot ? '2' : '1.2'}
                          className="transition-all duration-300 dark:fill-slate-900"
                        />
                        <text x={x} y={y} dy=".3em" textAnchor="middle" fontSize="10" fontWeight="bold" fill={active ? '#f59e0b' : isRoot ? '#10b981' : '#334155'} className="dark:fill-slate-200">
                          {nodeVal}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  DSU Disjoint Forest
                </span>
                <svg width="200" height="200" className="border border-border/50 rounded-lg bg-slate-50/50 dark:bg-slate-950/20">
                  {Array.from({ length: n }, (_, i) => i + 1).map(i => {
                    const p = currentStep.parent[i];
                    if (p === i || !dsuPositions[i] || !dsuPositions[p]) return null;
                    const src = dsuPositions[i];
                    const dst = dsuPositions[p];
                    const isActive = currentStep.activeNodes.includes(i) || currentStep.activeNodes.includes(p);

                    return (
                      <line
                        key={`dsu-edge-${i}`}
                        x1={src.x} y1={src.y} x2={dst.x} y2={dst.y}
                        stroke={isActive ? '#f59e0b' : '#94a3b8'}
                        strokeWidth={isActive ? '2' : '1.2'}
                        markerEnd="url(#arrow)"
                      />
                    );
                  })}

                  {Array.from({ length: n }, (_, i) => i + 1).map(i => {
                    const pos = dsuPositions[i];
                    if (!pos) return null;
                    const { x, y } = pos;
                    const style = getNodeStyle(i);
                    const isRoot = currentStep.parent[i] === i;

                    return (
                      <g key={`dsu-node-${i}`}>
                        <circle
                          cx={x} cy={y} r="12"
                          fill={style.fill}
                          stroke={style.stroke}
                          strokeWidth="1.8"
                          className="transition-all duration-300 dark:fill-slate-900"
                        />
                        <text x={x} y={y} dy=".3em" textAnchor="middle" fill={style.text} fontSize="9" fontWeight="bold">
                          {i}
                        </text>
                        {isRoot && (
                          <text x={x} y={y - 15} textAnchor="middle" fill="#10b981" fontSize="7" fontWeight="black" tracking-wide="true">
                            ROOT
                          </text>
                        )}
                        <text x={x} y={y + 20} textAnchor="middle" fill="#94a3b8" fontSize="7.5">
                          R:{currentStep.rank[i]}
                        </text>
                      </g>
                    );
                  })}

                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="19" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                    </marker>
                  </defs>
                </svg>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 bg-card border-border shadow-sm flex flex-col justify-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3 text-center block">
                  DSU State Table
                </span>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-center text-xs">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground uppercase text-[9px] font-bold">
                        <th className="pb-1.5 font-medium">Node</th>
                        <th className="pb-1.5 font-medium">Parent</th>
                        <th className="pb-1.5 font-medium">Rank/Size</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: n }, (_, i) => i + 1).map(nodeVal => {
                        const isActive = currentStep.activeNodes.includes(nodeVal);
                        const isRoot = currentStep.parent[nodeVal] === nodeVal;

                        return (
                          <tr
                            key={nodeVal}
                            className={`border-b border-border/40 transition-colors ${
                              isActive ? 'bg-amber-500/5 font-semibold text-amber-600' : ''
                            }`}
                          >
                            <td className="py-2">{nodeVal}</td>
                            <td className="py-2">
                              {isRoot ? (
                                <span className="text-green-500 font-bold font-mono">Self ({nodeVal})</span>
                              ) : (
                                <span className="font-mono">{currentStep.parent[nodeVal]}</span>
                              )}
                            </td>
                            <td className="py-2 font-mono">{currentStep.rank[nodeVal]}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card className="p-4 bg-card border-border shadow-sm flex flex-col justify-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-center block">
                  Graph Edge States
                </span>
                
                <div className="flex flex-col gap-2.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-0.5 bg-[#cbd5e1] border-t border-dashed" />
                    <span>Unprocessed (future edges)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-1 bg-amber-500 rounded" />
                    <span>Evaluating current edge</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-1 bg-green-500 rounded" />
                    <span>Successful union (connected component)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-1.5 bg-red-500 rounded" />
                    <span className="text-red-500 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Redundant Connection (Cycle!)
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            <Card className={`p-4 border-l-4 relative overflow-hidden transition-all duration-300 shadow-sm flex items-center ${
              currentStep.phase === 'cycle-detected' 
                ? 'bg-red-500/5 border-red-500' 
                : 'bg-primary/5 border-primary/20'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-xl shrink-0 ${
                  currentStep.phase === 'cycle-detected' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-primary/10 text-primary'
                }`}>
                  {currentStep.phase === 'cycle-detected' ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                </div>
                <div className="space-y-1">
                  <h4 className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary/80">
                    Step Narrative
                  </h4>
                  <p className="text-xs font-medium leading-relaxed text-foreground/90">
                    {currentStep.explanation}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        }
        rightContent={
          <div className="space-y-4 h-full flex flex-col">
            <VisualizationCodePanel
              languages={languages}
              stepLineNumbers={stepLineNumbers}
              pseudoSteps={pseudoSteps}
              activeStepIndex={currentStepIndex}
              onLanguageChange={() => setCurrentStepIndex(0)}
            />
            <VariablePanel variables={currentStep.variables} />
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
    </div>
  );
};
export default RedundantConnectionVisualization;
