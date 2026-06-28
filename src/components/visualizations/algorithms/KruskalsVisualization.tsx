import { useEffect, useRef, useState } from 'react';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Edge {
  from: number;
  to: number;
  weight: number;
  selected?: boolean;
  considered?: boolean;
}

interface Step {
  edges: Edge[];
  parent: number[];
  mstEdges: Edge[];
  currentEdge: Edge | null;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function minCostConnectPoints(points: number[][]): number {
    const n = points.length;
    function manhattanDistance(p1: number[], p2: number[]): number {
        return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
    }
    const edges: number[][] = [];
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            edges.push([i, j, manhattanDistance(points[i], points[j])]);
        }
    }
    edges.sort((a, b) => a[2] - b[2]);
    const parent: number[] = Array(n).fill(0).map((_, i) => i);
    function find(i: number): number {
        if (parent[i] === i) return i;
        return parent[i] = find(parent[i]);
    }
    function union(i: number, j: number): void {
        const rootI = find(i);
        const rootJ = find(j);
        if (rootI !== rootJ) {
            parent[rootI] = rootJ;
        }
    }
    let mstCost = 0;
    let edgesUsed = 0;
    for (const edge of edges) {
        const u = edge[0];
        const v = edge[1];
        const weight = edge[2];
        if (find(u) !== find(v)) {
            union(u, v);
            mstCost += weight;
            edgesUsed++;
            if (edgesUsed === n - 1) break;
        }
    }
    return mstCost;
}`,
  python: `def min_cost_connect_points(points: list[list[int]]) -> int:
    def manhattan_distance(p1, p2):
        return abs(p1[0] - p2[0]) + abs(p1[1] - p2[1])
    n = len(points)
    edges = []
    for i in range(n):
        for j in range(i + 1, n):
            edges.append((manhattan_distance(points[i], points[j]), i, j))
    edges.sort()
    parent = list(range(n))
    def find(i):
        if parent[i] == i:
            return i
        parent[i] = find(parent[i])
        return parent[i]
    def union(i, j):
        root_i = find(i)
        root_j = find(j)
        if root_i != root_j:
            parent[root_i] = root_j
            return True
        return False
    min_cost = 0
    num_edges = 0
    for cost, i, j in edges:
        if union(i, j):
            min_cost += cost
            num_edges += 1
            if num_edges == n - 1:
                break
    return min_cost`,
  java: `class Solution {
    private int find(int i, int[] parent) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i], parent);
    }
    private boolean union(int i, int j, int[] parent) {
        int rootI = find(i, parent);
        int rootJ = find(j, parent);
        if (rootI != rootJ) {
            parent[rootI] = rootJ;
            return true;
        }
        return false;
    }
    public int minCostConnectPoints(int[][] points) {
        int n = points.length;
        List<int[]> edges = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int dist = Math.abs(points[i][0] - points[j][0]) + Math.abs(points[i][1] - points[j][1]);
                edges.add(new int[]{dist, i, j});
            }
        }
        edges.sort((a, b) -> a[0] - b[0]);
        int[] parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        int mstCost = 0;
        int edgesUsed = 0;
        for (int[] edge : edges) {
            if (union(edge[1], edge[2], parent)) {
                mstCost += edge[0];
                edgesUsed++;
                if (edgesUsed == n - 1) break;
            }
        }
        return mstCost;
    }
}`,
  cpp: `class Solution {
private:
    int find(int i, vector<int>& parent) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i], parent);
    }
    bool unite(int i, int j, vector<int>& parent) {
        int rootI = find(i, parent);
        int rootJ = find(j, parent);
        if (rootI != rootJ) {
            parent[rootI] = rootJ;
            return true;
        }
        return false;
    }
public:
    int minCostConnectPoints(vector<vector<int>>& points) {
        int n = points.size();
        vector<vector<int>> edges;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int dist = abs(points[i][0] - points[j][0]) + abs(points[i][1] - points[j][1]);
                edges.push_back({dist, i, j});
            }
        }
        sort(edges.begin(), edges.end());
        vector<int> parent(n);
        for (int i = 0; i < n; i++) parent[i] = i;
        int mstCost = 0;
        int edgesUsed = 0;
        for (auto& edge : edges) {
            if (unite(edge[1], edge[2], parent)) {
                mstCost += edge[0];
                edgesUsed++;
                if (edgesUsed == n - 1) break;
            }
        }
        return mstCost;
    }
};`,
};

function generateVisualizationData() {
  const points = [
    [0, 0],
    [2, 2],
    [3, 10],
    [5, 2],
    [7, 0],
  ];
  const n = points.length;
  const allEdges: Edge[] = [];

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const cost = Math.abs(points[i][0] - points[j][0]) + Math.abs(points[i][1] - points[j][1]);
      allEdges.push({ from: i, to: j, weight: cost });
    }
  }

  const steps: Step[] = [];
  const stepLineNumbers: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
  const addLines = (ts: number, py: number, java: number, cpp: number) => {
    stepLineNumbers.typescript!.push(ts);
    stepLineNumbers.python!.push(py);
    stepLineNumbers.java!.push(java);
    stepLineNumbers.cpp!.push(cpp);
  };

  steps.push({
    edges: allEdges.map(e => ({ ...e })),
    parent: Array.from({ length: n }, (_, i) => i),
    mstEdges: [],
    currentEdge: null,
    explanation: `Calculate Manhattan distances for all ${allEdges.length} possible edges between the ${n} points.`,
    pseudoStep: 'SET edges = calculate_all_edges(points)',
    variables: { mstCost: 0, edgesUsed: 0, parent: Array.from({ length: n }, (_, i) => i).join(', ') }
  });
  addLines(6, 5, 17, 19);

  const sortedEdges = [...allEdges].sort((a, b) => a.weight - b.weight);

  steps.push({
    edges: sortedEdges.map(e => ({ ...e })),
    parent: Array.from({ length: n }, (_, i) => i),
    mstEdges: [],
    currentEdge: null,
    explanation: 'Sort all edges in ascending order of their weights.',
    pseudoStep: 'edges.sort()',
    variables: { mstCost: 0, edgesUsed: 0 }
  });
  addLines(12, 9, 24, 26);

  const parent = Array.from({ length: n }, (_, i) => i);
  const mstEdges: Edge[] = [];
  let mstCost = 0;
  let edgesUsed = 0;

  const traceFind = (i: number, edge: Edge, idx: number, label: string): number => {
    steps.push({
      edges: sortedEdges.map((e, index) => ({
        ...e,
        considered: index === idx,
        selected: mstEdges.some(me => (me.from === e.from && me.to === e.to))
      })),
      parent: [...parent],
      mstEdges: [...mstEdges],
      currentEdge: { ...edge },
      explanation: `find(${label} Node ${i}): start searching for its root representative.`,
      pseudoStep: `CALL find(${i})`,
      variables: { u: edge.from, v: edge.to, weight: edge.weight, mstCost, edgesUsed, node: i }
    });
    addLines(14, 11, 2, 3);

    if (parent[i] === i) {
      steps.push({
        edges: sortedEdges.map((e, index) => ({
          ...e,
          considered: index === idx,
          selected: mstEdges.some(me => (me.from === e.from && me.to === e.to))
        })),
        parent: [...parent],
        mstEdges: [...mstEdges],
        currentEdge: { ...edge },
        explanation: `Node ${i} is its own parent. Return root = ${i}.`,
        pseudoStep: `RETURN ${i}`,
        variables: { u: edge.from, v: edge.to, weight: edge.weight, mstCost, edgesUsed, node: i, root: i }
      });
      addLines(15, 12, 3, 4);
      return i;
    }

    const oldParent = parent[i];
    steps.push({
      edges: sortedEdges.map((e, index) => ({
        ...e,
        considered: index === idx,
        selected: mstEdges.some(me => (me.from === e.from && me.to === e.to))
      })),
      parent: [...parent],
      mstEdges: [...mstEdges],
      currentEdge: { ...edge },
      explanation: `Node ${i} parent is ${oldParent} (not itself). Recurse to find root of ${oldParent}.`,
      pseudoStep: `find(parent[${i}] = ${oldParent})`,
      variables: { u: edge.from, v: edge.to, weight: edge.weight, mstCost, edgesUsed, node: i, parent: oldParent }
    });
    addLines(16, 14, 4, 5);

    const root = traceFind(oldParent, edge, idx, label);
    parent[i] = root;

    steps.push({
      edges: sortedEdges.map((e, index) => ({
        ...e,
        considered: index === idx,
        selected: mstEdges.some(me => (me.from === e.from && me.to === e.to))
      })),
      parent: [...parent],
      mstEdges: [...mstEdges],
      currentEdge: { ...edge },
      explanation: `Path compression: set parent of node ${i} directly to root ${root}.`,
      pseudoStep: `SET parent[${i}] = ${root}`,
      variables: { u: edge.from, v: edge.to, weight: edge.weight, mstCost, edgesUsed, node: i, parent: root }
    });
    addLines(16, 14, 4, 5);

    return root;
  };

  for (let idx = 0; idx < sortedEdges.length; idx++) {
    const edge = sortedEdges[idx];
    const u = edge.from;
    const v = edge.to;

    steps.push({
      edges: sortedEdges.map((e, index) => ({
        ...e,
        considered: index === idx,
        selected: mstEdges.some(me => (me.from === e.from && me.to === e.to))
      })),
      parent: [...parent],
      mstEdges: [...mstEdges],
      currentEdge: { ...edge },
      explanation: `Inspect edge (${u} - ${v}) with weight ${edge.weight}. Run Union-Find checks.`,
      pseudoStep: `FOR edge IN edges: check if find(${u}) != find(${v})`,
      variables: { u, v, weight: edge.weight, mstCost, edgesUsed }
    });
    addLines(27, 25, 29, 31);

    const rootU = traceFind(u, edge, idx, 'u');
    const rootV = traceFind(v, edge, idx, 'v');

    steps.push({
      edges: sortedEdges.map((e, index) => ({
        ...e,
        considered: index === idx,
        selected: mstEdges.some(me => (me.from === e.from && me.to === e.to))
      })),
      parent: [...parent],
      mstEdges: [...mstEdges],
      currentEdge: { ...edge },
      explanation: `Compare roots: root of ${u} is ${rootU}, root of ${v} is ${rootV}.`,
      pseudoStep: `IF root(${u}) != root(${v})  →  ${rootU !== rootV ? 'True' : 'False'}`,
      variables: { u, v, rootU, rootV, weight: edge.weight, mstCost, edgesUsed }
    });
    addLines(31, 26, 30, 32);

    if (rootU !== rootV) {
      parent[rootU] = rootV;
      mstEdges.push({ ...edge });
      mstCost += edge.weight;
      edgesUsed++;

      steps.push({
        edges: sortedEdges.map((e, index) => ({
          ...e,
          selected: mstEdges.some(me => (me.from === e.from && me.to === e.to))
        })),
        parent: [...parent],
        mstEdges: [...mstEdges],
        currentEdge: { ...edge },
        explanation: `Roots are different. Union sets by attaching root ${rootU} to root ${rootV}.`,
        pseudoStep: `union(${u}, ${v}): SET parent[${rootU}] = ${rootV}`,
        variables: { u, v, weight: edge.weight, mstCost, edgesUsed }
      });
      addLines(32, 26, 30, 32);

      steps.push({
        edges: sortedEdges.map((e, index) => ({
          ...e,
          selected: mstEdges.some(me => (me.from === e.from && me.to === e.to))
        })),
        parent: [...parent],
        mstEdges: [...mstEdges],
        currentEdge: { ...edge },
        explanation: `Add edge (${u} - ${v}) to MST. Current cost is ${mstCost}.`,
        pseudoStep: `SET mstCost += ${edge.weight}  →  ${mstCost}`,
        variables: { u, v, weight: edge.weight, mstCost, edgesUsed }
      });
      addLines(33, 27, 31, 33);

      steps.push({
        edges: sortedEdges.map((e, index) => ({
          ...e,
          selected: mstEdges.some(me => (me.from === e.from && me.to === e.to))
        })),
        parent: [...parent],
        mstEdges: [...mstEdges],
        currentEdge: { ...edge },
        explanation: `Edges in MST is now ${edgesUsed}. Check completion.`,
        pseudoStep: `IF edgesUsed (${edgesUsed}) == n - 1 (${n - 1})`,
        variables: { u, v, weight: edge.weight, mstCost, edgesUsed }
      });
      addLines(35, 29, 33, 35);

      if (edgesUsed === n - 1) {
        steps.push({
          edges: sortedEdges.map((e) => ({
            ...e,
            selected: mstEdges.some(me => (me.from === e.from && me.to === e.to))
          })),
          parent: [...parent],
          mstEdges: [...mstEdges],
          currentEdge: null,
          explanation: `All ${n - 1} edges added. Minimum Spanning Tree is complete!`,
          pseudoStep: 'BREAK',
          variables: { mstCost, edgesUsed }
        });
        addLines(35, 30, 33, 35);
        break;
      }
    } else {
      steps.push({
        edges: sortedEdges.map((e, index) => ({
          ...e,
          selected: mstEdges.some(me => (me.from === e.from && me.to === e.to))
        })),
        parent: [...parent],
        mstEdges: [...mstEdges],
        currentEdge: { ...edge },
        explanation: `Roots are the same (${rootU}). Adding this edge forms a cycle, so skip it.`,
        pseudoStep: 'SKIP edge (Cycle detected)',
        variables: { u, v, weight: edge.weight, mstCost, edgesUsed }
      });
      addLines(31, 26, 30, 32);
    }
  }

  steps.push({
    edges: sortedEdges.map((e) => ({
      ...e,
      selected: mstEdges.some(me => (me.from === e.from && me.to === e.to))
    })),
    parent: [...parent],
    mstEdges: [...mstEdges],
    currentEdge: null,
    explanation: `Kruskal's algorithm finished. Total MST cost is ${mstCost}.`,
    pseudoStep: `RETURN mstCost  →  ${mstCost}`,
    variables: { mstCost, edgesUsed }
  });
  addLines(38, 31, 36, 38);

  return { steps, stepLineNumbers };
}

const nodePositions = [
  { x: 50, y: 230 },
  { x: 130, y: 190 },
  { x: 170, y: 50 },
  { x: 250, y: 190 },
  { x: 350, y: 230 },
];

export const KruskalsVisualization = () => {
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
            <svg viewBox="0 0 400 280" className="w-full max-w-[400px] h-auto">
              {currentStep.edges.map((edge, idx) => {
                const from = nodePositions[edge.from];
                const to = nodePositions[edge.to];
                const inMST = currentStep.mstEdges.some(
                  (e) => (e.from === edge.from && e.to === edge.to) || (e.from === edge.to && e.to === edge.from)
                );
                const isCurrent =
                  currentStep.currentEdge &&
                  ((currentStep.currentEdge.from === edge.from && currentStep.currentEdge.to === edge.to) ||
                    (currentStep.currentEdge.from === edge.to && currentStep.currentEdge.to === edge.from));

                return (
                  <g key={idx}>
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      className={`transition-all duration-200 ${inMST
                        ? 'stroke-green-500'
                        : isCurrent
                          ? 'stroke-primary stroke-2'
                          : 'stroke-muted-foreground/30'
                        }`}
                      strokeWidth={inMST ? 3 : isCurrent ? 3 : 1}
                      strokeDasharray={inMST ? '0' : '4'}
                    />
                    {(inMST || isCurrent) && (
                      <text
                        x={(from.x + to.x) / 2}
                        y={(from.y + to.y) / 2 - 4}
                        className="fill-foreground text-[10px] font-bold"
                        textAnchor="middle"
                      >
                        {edge.weight}
                      </text>
                    )}
                  </g>
                );
              })}

              {nodePositions.map((pos, idx) => (
                <g key={idx}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="15"
                    className="fill-muted stroke-border"
                    strokeWidth="2"
                  />
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dy=".3em"
                    className="fill-foreground text-[10px] font-bold"
                  >
                    {idx}
                  </text>
                  <text
                    x={pos.x}
                    y={pos.y + 25}
                    textAnchor="middle"
                    className="fill-muted-foreground text-[8px]"
                  >
                    P: {currentStep.parent[idx]}
                  </text>
                </g>
              ))}
            </svg>

            <div className="flex justify-center gap-4 mt-2 text-[10px] text-muted-foreground border-t pt-2 w-full">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-green-500 rounded-sm" /> MST Edge</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-primary rounded-sm" /> Current Check</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-muted border rounded-sm" /> Vertex</span>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm font-medium text-foreground">{currentStep.explanation}</p>
          </div>

          <VariablePanel
            variables={{
              "MST Edges": currentStep.mstEdges.length,
              "Total Cost": currentStep.mstEdges.reduce((sum, e) => sum + e.weight, 0),
              "Union-Find": currentStep.parent.join(', '),
              ...currentStep.variables
            }}
          />
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
