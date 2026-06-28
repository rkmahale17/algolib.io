import { useEffect, useRef, useState } from 'react';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Edge {
  from: number;
  to: number;
  weight: number;
}

interface Step {
  visited: boolean[];
  edges: Edge[];
  mstEdges: Edge[];
  currentNode: number | null;
  minHeap: [number, number][];
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function minCostConnectPoints(points: number[][]): number {
    const N = points.length;
    const adj: Map<number, [number, number][]> = new Map();
    for (let i = 0; i < N; i++) {
        adj.set(i, []);
    }
    for (let i = 0; i < N; i++) {
        const [x1, y1] = points[i];
        for (let j = i + 1; j < N; j++) {
            const [x2, y2] = points[j];
            const dist = Math.abs(x1 - x2) + Math.abs(y1 - y2);
            adj.get(i)!.push([dist, j]);
            adj.get(j)!.push([dist, i]);
        }
    }
    let result = 0;
    const visit = new Set<number>();
    const minHeap: [number, number][] = [[0, 0]];
    while (visit.size < N) {
        minHeap.sort((a, b) => a[0] - b[0]);
        const [cost, node] = minHeap.shift()!;
        if (visit.has(node)) continue;
        result += cost;
        visit.add(node);
        for (const [neiCost, nei] of adj.get(node)!) {
            if (!visit.has(nei)) {
                minHeap.push([neiCost, nei]);
            }
        }
    }
    return result;
}`,
  python: `def minCostConnectPoints(points):
    N = len(points)
    def manhattan_distance(p1, p2):
        return abs(p1[0] - p2[0]) + abs(p1[1] - p2[1])
    edges = []
    for i in range(N):
        for j in range(i + 1, N):
            dist = manhattan_distance(points[i], points[j])
            edges.append((dist, i, j))
    edges.sort()
    parent = list(range(N))
    rank = [0] * N
    def find(i):
        if parent[i] == i:
            return i
        parent[i] = find(parent[i])
        return parent[i]
    def union(i, j):
        root_i = find(i)
        root_j = find(j)
        if root_i != root_j:
            if rank[root_i] < rank[root_j]:
                parent[root_i] = root_j
            elif rank[root_i] > rank[root_j]:
                parent[root_j] = root_i
            else:
                parent[root_j] = root_i
                rank[root_i] += 1
            return True
        return False
    min_cost = 0
    num_edges = 0
    for cost, u, v in edges:
        if union(u, v):
            min_cost += cost
            num_edges += 1
            if num_edges == N - 1:
                break
    return min_cost`,
  java: `public static class Solution {
    public int minCostConnectPoints(int[][] points) {
        int N = points.length;
        Map<Integer, List<int[]>> adj = new HashMap<>();
        for (int i = 0; i < N; i++) {
            adj.put(i, new ArrayList<>());
        }
        for (int i = 0; i < N; i++) {
            int x1 = points[i][0];
            int y1 = points[i][1];
            for (int j = i + 1; j < N; j++) {
                int x2 = points[j][0];
                int y2 = points[j][1];
                int dist = Math.abs(x1 - x2) + Math.abs(y1 - y2);
                adj.get(i).add(new int[]{dist, j});
                adj.get(j).add(new int[]{dist, i});
            }
        }
        int result = 0;
        Set<Integer> visit = new HashSet<>();
        PriorityQueue<int[]> minHeap = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        minHeap.offer(new int[]{0, 0});
        while (visit.size() < N) {
            int[] curr = minHeap.poll();
            int cost = curr[0];
            int node = curr[1];
            if (visit.contains(node)) continue;
            result += cost;
            visit.add(node);
            for (int[] neighbor : adj.get(node)) {
                int neiCost = neighbor[0];
                int nei = neighbor[1];
                if (!visit.contains(nei)) {
                    minHeap.offer(new int[]{neiCost, nei});
                }
            }
        }
        return result;
    }
}`,
  cpp: `class Solution {
public:
    int minCostConnectPoints(vector<vector<int>>& points) {
        int N = points.size();
        unordered_map<int, vector<pair<int,int>>> adj;
        for (int i = 0; i < N; i++) {
            adj[i] = {};
        }
        for (int i = 0; i < N; i++) {
            int x1 = points[i][0];
            int y1 = points[i][1];
            for (int j = i + 1; j < N; j++) {
                int x2 = points[j][0];
                int y2 = points[j][1];
                int dist = abs(x1 - x2) + abs(y1 - y2);
                adj[i].push_back({dist, j});
                adj[j].push_back({dist, i});
            }
        }
        int result = 0;
        unordered_set<int> visit;
        priority_queue<
            pair<int,int>,
            vector<pair<int,int>>,
            greater<pair<int,int>>
        > minHeap;
        minHeap.push({0, 0});
        while (visit.size() < N) {
            auto [cost, node] = minHeap.top();
            minHeap.pop();
            if (visit.count(node)) continue;
            result += cost;
            visit.insert(node);
            for (auto &[neiCost, nei] : adj[node]) {
                if (!visit.count(nei)) {
                    minHeap.push({neiCost, nei});
                }
            }
        }
        return result;
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
  const N = points.length;
  const steps: Step[] = [];
  const stepLineNumbers: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
  const addLines = (ts: number, py: number, java: number, cpp: number) => {
    stepLineNumbers.typescript!.push(ts);
    stepLineNumbers.python!.push(py);
    stepLineNumbers.java!.push(java);
    stepLineNumbers.cpp!.push(cpp);
  };

  const adj: Map<number, [number, number][]> = new Map();
  for (let i = 0; i < N; i++) {
    adj.set(i, []);
  }

  steps.push({
    visited: Array(N).fill(false),
    edges: [],
    mstEdges: [],
    currentNode: null,
    minHeap: [],
    explanation: "Initialize an empty adjacency list mapping each node to its neighbors.",
    pseudoStep: "SET adj = empty Map()",
    variables: { result: 0, visitedCount: 0 }
  });
  addLines(3, 5, 4, 5);

  const allEdges: Edge[] = [];
  for (let i = 0; i < N; i++) {
    const [x1, y1] = points[i];
    for (let j = i + 1; j < N; j++) {
      const [x2, y2] = points[j];
      const dist = Math.abs(x1 - x2) + Math.abs(y1 - y2);
      adj.get(i)!.push([dist, j]);
      adj.get(j)!.push([dist, i]);
      allEdges.push({ from: i, to: j, weight: dist });
    }
  }

  steps.push({
    visited: Array(N).fill(false),
    edges: [...allEdges],
    mstEdges: [],
    currentNode: null,
    minHeap: [],
    explanation: `Build the graph: compute Manhattan distances between all pairs of nodes. Total edges calculated: ${allEdges.length}.`,
    pseudoStep: "CALL buildGraph()",
    variables: { result: 0, visitedCount: 0 }
  });
  addLines(7, 6, 8, 9);

  let result = 0;
  const visit = new Set<number>();
  const minHeap: [number, number][] = [[0, 0]];
  const mstEdges: Edge[] = [];

  steps.push({
    visited: Array(N).fill(false),
    edges: [...allEdges],
    mstEdges: [],
    currentNode: null,
    minHeap: [...minHeap],
    explanation: "Initialize result to 0, visited set, and insert starting node 0 with cost 0 into the min-heap.",
    pseudoStep: "SET result = 0; visit = {}; minHeap = [[0, 0]]",
    variables: { result, visitedCount: 0, minHeap: "[[0, 0]]" }
  });
  addLines(16, 31, 19, 20);

  const edgeSource: Record<number, number> = {};

  while (visit.size < N) {
    steps.push({
      visited: Array.from({ length: N }, (_, idx) => visit.has(idx)),
      edges: [...allEdges],
      mstEdges: [...mstEdges],
      currentNode: null,
      minHeap: [...minHeap].sort((a, b) => a[0] - b[0]),
      explanation: `Check if visited count (${visit.size}) is less than total nodes (${N}). Sort heap to find min edge.`,
      pseudoStep: "WHILE visit.size < N",
      variables: { result, visitedCount: visit.size, minHeap: `[${minHeap.map(h => `[${h[0]},${h[1]}]`).join(', ')}]` }
    });
    addLines(19, 33, 23, 28);

    minHeap.sort((a, b) => a[0] - b[0]);
    const [cost, node] = minHeap.shift()!;

    steps.push({
      visited: Array.from({ length: N }, (_, idx) => visit.has(idx)),
      edges: [...allEdges],
      mstEdges: [...mstEdges],
      currentNode: node,
      minHeap: [...minHeap],
      explanation: `Extract the edge with minimum cost from heap: node ${node} with cost ${cost}.`,
      pseudoStep: `SET [cost, node] = minHeap.pop()  →  [${cost}, ${node}]`,
      variables: { result, visitedCount: visit.size, cost, node, minHeap: `[${minHeap.map(h => `[${h[0]},${h[1]}]`).join(', ')}]` }
    });
    addLines(21, 33, 24, 30);

    steps.push({
      visited: Array.from({ length: N }, (_, idx) => visit.has(idx)),
      edges: [...allEdges],
      mstEdges: [...mstEdges],
      currentNode: node,
      minHeap: [...minHeap],
      explanation: `Check if node ${node} is already visited.`,
      pseudoStep: `IF node ${node} IN visit  →  ${visit.has(node) ? 'YES ✓' : 'NO ✗'}`,
      variables: { result, visitedCount: visit.size, node, isVisited: String(visit.has(node)) }
    });
    addLines(22, 34, 27, 31);

    if (visit.has(node)) {
      continue;
    }

    if (cost > 0) {
      const fromNode = edgeSource[node];
      mstEdges.push({ from: fromNode, to: node, weight: cost });
    }

    result += cost;
    visit.add(node);

    steps.push({
      visited: Array.from({ length: N }, (_, idx) => visit.has(idx)),
      edges: [...allEdges],
      mstEdges: [...mstEdges],
      currentNode: node,
      minHeap: [...minHeap],
      explanation: `Add cost ${cost} to total cost. Mark node ${node} as visited. result is now ${result}.`,
      pseudoStep: `result += ${cost}; visit.add(${node})`,
      variables: { result, visitedCount: visit.size, node }
    });
    addLines(23, 35, 28, 32);

    const neighbors = adj.get(node) || [];
    for (const [neiCost, nei] of neighbors) {
      steps.push({
        visited: Array.from({ length: N }, (_, idx) => visit.has(idx)),
        edges: [...allEdges],
        mstEdges: [...mstEdges],
        currentNode: node,
        minHeap: [...minHeap],
        explanation: `Inspect neighbor ${nei} of node ${node} (edge cost: ${neiCost}). Check if visited.`,
        pseudoStep: `FOR [neiCost, nei] OF adj[${node}]: check if nei ${nei} in visit`,
        variables: { result, visitedCount: visit.size, node, nei, neiCost }
      });
      addLines(25, 33, 30, 34);

      if (!visit.has(nei)) {
        minHeap.push([neiCost, nei]);
        edgeSource[nei] = node;
        steps.push({
          visited: Array.from({ length: N }, (_, idx) => visit.has(idx)),
          edges: [...allEdges],
          mstEdges: [...mstEdges],
          currentNode: node,
          minHeap: [...minHeap],
          explanation: `Neighbor ${nei} not visited. Push edge to neighbor (${node} - ${nei}) with weight ${neiCost} into min-heap.`,
          pseudoStep: `minHeap.push([${neiCost}, ${nei}])`,
          variables: { result, visitedCount: visit.size, node, nei, neiCost }
        });
        addLines(27, 33, 34, 36);
      }
    }
  }

  steps.push({
    visited: Array(N).fill(true),
    edges: [...allEdges],
    mstEdges: [...mstEdges],
    currentNode: null,
    minHeap: [],
    explanation: `All nodes visited. Prim's algorithm completed. Total MST weight is ${result}.`,
    pseudoStep: `RETURN result  →  ${result}`,
    variables: { result, visitedCount: N }
  });
  addLines(31, 39, 38, 40);

  return { steps, stepLineNumbers };
}

const nodePositions = [
  { x: 50, y: 230 },
  { x: 150, y: 190 },
  { x: 200, y: 30 },
  { x: 300, y: 190 },
  { x: 350, y: 230 },
];

export const PrimsVisualization = () => {
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

                return (
                  <g key={idx}>
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      className={`transition-all duration-200 ${inMST ? 'stroke-green-500 stroke-3' : 'stroke-muted-foreground/30 stroke-1'}`}
                      strokeDasharray={inMST ? '0' : '4'}
                    />
                    {inMST && (
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

              {nodePositions.map((pos, idx) => {
                const isVisited = currentStep.visited[idx];
                const isCurrent = currentStep.currentNode === idx;

                return (
                  <g key={idx}>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="15"
                      className={`transition-all duration-200 ${isVisited
                        ? 'fill-green-500 stroke-green-500'
                        : isCurrent
                          ? 'fill-primary stroke-primary'
                          : 'fill-muted stroke-border'
                        }`}
                      strokeWidth="2"
                    />
                    <text
                      x={pos.x}
                      y={pos.y}
                      textAnchor="middle"
                      dy=".3em"
                      className={`text-[10px] font-bold ${isVisited || isCurrent ? 'fill-white' : 'fill-foreground'}`}
                    >
                      {idx}
                    </text>
                    <text
                      x={pos.x}
                      y={pos.y + 25}
                      textAnchor="middle"
                      className="fill-muted-foreground text-[8px]"
                    >
                      ({[ [0,0], [2,2], [3,10], [5,2], [7,0] ][idx].join(',')})
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="flex justify-center gap-4 mt-2 text-[10px] text-muted-foreground border-t pt-2 w-full">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-green-500 rounded-sm" /> In MST / Visited</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-primary rounded-sm" /> Current Node</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-muted border rounded-sm" /> Unvisited Node</span>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm font-medium text-foreground">{currentStep.explanation}</p>
          </div>

          <VariablePanel
            variables={{
              "Visited Nodes": currentStep.visited.filter(v => v).length,
              "MST Edges": currentStep.mstEdges.length,
              "Total Weight": currentStep.mstEdges.reduce((sum, e) => sum + e.weight, 0),
              "Min Heap": `[${currentStep.minHeap.map(h => `[${h[0]},${h[1]}]`).join(', ')}]`
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
