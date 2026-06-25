import { useEffect, useRef, useState } from 'react';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  distances: Record<number, number>;
  visited: number[];
  minHeap: [number, number][];
  currentNode: number | null;
  maxTime: number;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function networkDelayTime(times: number[][], n: number, k: number): number {
    const edges: Map<number, [number, number][]> = new Map();
    for (const [u, v, w] of times) {
        if (!edges.has(u)) {
            edges.set(u, []);
        }
        edges.get(u)!.push([v, w]);
    }
    const minHeap: [number, number][] = [[0, k]];
    const visit = new Set<number>();
    let t = 0;
    while (minHeap.length > 0) {
        minHeap.sort((a, b) => a[0] - b[0]);
        const [w1, n1] = minHeap.shift()!;
        if (visit.has(n1)) continue;
        visit.add(n1);
        t = Math.max(t, w1);
        const neighbors = edges.get(n1) || [];
        for (const [n2, w2] of neighbors) {
            if (!visit.has(n2)) {
                minHeap.push([w1 + w2, n2]);
            }
        }
    }
    return visit.size === n ? t : -1;
}`,
  python: `def networkDelayTime(times: list[list[int]], n: int, k: int) -> int:
    edges = {}
    for u, v, w in times:
        if u not in edges:
            edges[u] = []
        edges[u].append((v, w))
    minHeap = [(0, k)]
    visit = set()
    t = 0
    while minHeap:
        minHeap.sort()
        w1, n1 = minHeap.pop(0)
        if n1 in visit:
            continue
        visit.add(n1)
        t = max(t, w1)
        if n1 in edges:
            for n2, w2 in edges[n1]:
                if n2 not in visit:
                    minHeap.append((w1 + w2, n2))
    return t if len(visit) == n else -1`,
  java: `public static class Solution {
    public int networkDelayTime(int[][] times, int n, int k) {
        Map<Integer, List<int[]>> edges = new HashMap<>();
        for (int[] time : times) {
            int u = time[0];
            int v = time[1];
            int w = time[2];
            edges.computeIfAbsent(u, key -> new ArrayList<>()).add(new int[]{v, w});
        }
        PriorityQueue<int[]> minHeap = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        minHeap.offer(new int[]{0, k});
        Set<Integer> visit = new HashSet<>();
        int t = 0;
        while (!minHeap.isEmpty()) {
            int[] current = minHeap.poll();
            int w1 = current[0];
            int n1 = current[1];
            if (visit.contains(n1)) continue;
            visit.add(n1);
            t = Math.max(t, w1);
            List<int[]> neighbors = edges.getOrDefault(n1, new ArrayList<>());
            for (int[] neighbor : neighbors) {
                int n2 = neighbor[0];
                int w2 = neighbor[1];
                if (!visit.contains(n2)) {
                    minHeap.offer(new int[]{w1 + w2, n2});
                }
            }
        }
        return visit.size() == n ? t : -1;
    }
}`,
  cpp: `class Solution {
public:
    int networkDelayTime(vector<vector<int>>& times, int n, int k) {
        unordered_map<int, vector<pair<int,int>>> edges;
        for (auto &time : times) {
            int u = time[0];
            int v = time[1];
            int w = time[2];
            edges[u].push_back({v, w});
        }
        priority_queue<
            pair<int,int>,
            vector<pair<int,int>>,
            greater<pair<int,int>>
        > minHeap;
        minHeap.push({0, k});
        set<int> visit;
        int t = 0;
        while (!minHeap.empty()) {
            auto [w1, n1] = minHeap.top();
            minHeap.pop();
            if (visit.count(n1)) continue;
            visit.insert(n1);
            t = max(t, w1);
            for (auto &[n2, w2] : edges[n1]) {
                if (!visit.count(n2)) {
                    minHeap.push({w1 + w2, n2});
                }
            }
        }
        return visit.size() == n ? t : -1;
    }
};`,
};

function generateVisualizationData() {
  const n = 4;
  const k = 2;
  const times = [[2, 1, 1], [2, 3, 1], [3, 4, 1]];

  const steps: Step[] = [];
  const stepLineNumbers: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
  const addLines = (ts: number, py: number, java: number, cpp: number) => {
    stepLineNumbers.typescript!.push(ts);
    stepLineNumbers.python!.push(py);
    stepLineNumbers.java!.push(java);
    stepLineNumbers.cpp!.push(cpp);
  };

  const edges: Map<number, [number, number][]> = new Map();
  const distances: Record<number, number> = {};
  const visit = new Set<number>();
  let t = 0;

  // Initialize
  steps.push({
    distances: { ...distances },
    visited: Array.from(visit),
    minHeap: [],
    currentNode: null,
    maxTime: t,
    explanation: 'Initialize the edges adjacency list.',
    pseudoStep: 'SET edges = empty Map()',
    variables: { t, visited: '{}', minHeap: '[]' }
  });
  addLines(2, 2, 3, 4);

  for (const [u, v, w] of times) {
    if (!edges.has(u)) edges.set(u, []);
    edges.get(u)!.push([v, w]);
  }

  const minHeap: [number, number][] = [[0, k]];
  distances[k] = 0;

  steps.push({
    distances: { ...distances },
    visited: Array.from(visit),
    minHeap: [...minHeap],
    currentNode: null,
    maxTime: t,
    explanation: `Start Dijkstra from source node k=${k} with distance/time 0.`,
    pseudoStep: `SET minHeap = [[0, k]]`,
    variables: { t, visited: '{}', minHeap: `[[0, ${k}]]` }
  });
  addLines(9, 7, 11, 16);

  while (minHeap.length > 0) {
    steps.push({
      distances: { ...distances },
      visited: Array.from(visit),
      minHeap: [...minHeap].sort((a, b) => a[0] - b[0]),
      currentNode: null,
      maxTime: t,
      explanation: 'Sort the min-heap to pick the node with the smallest cumulative delay.',
      pseudoStep: 'minHeap.sort()',
      variables: { t, visited: `{${Array.from(visit).join(', ')}}`, minHeap: `[${minHeap.map(h => `[${h[0]},${h[1]}]`).join(', ')}]` }
    });
    addLines(13, 11, 15, 20);

    minHeap.sort((a, b) => a[0] - b[0]);
    const [w1, n1] = minHeap.shift()!;

    steps.push({
      distances: { ...distances },
      visited: Array.from(visit),
      minHeap: [...minHeap],
      currentNode: n1,
      maxTime: t,
      explanation: `Dequeue node ${n1} with time ${w1} from min-heap.`,
      pseudoStep: `SET [w1, n1] = minHeap.shift()  →  [${w1}, ${n1}]`,
      variables: { t, n1, w1, visited: `{${Array.from(visit).join(', ')}}`, minHeap: `[${minHeap.map(h => `[${h[0]},${h[1]}]`).join(', ')}]` }
    });
    addLines(14, 12, 15, 21);

    steps.push({
      distances: { ...distances },
      visited: Array.from(visit),
      minHeap: [...minHeap],
      currentNode: n1,
      maxTime: t,
      explanation: `Check if node ${n1} has been visited already.`,
      pseudoStep: `IF node ${n1} IN visit  →  ${visit.has(n1) ? 'YES ✓ (skip)' : 'NO ✗'}`,
      variables: { t, n1, visited: `{${Array.from(visit).join(', ')}}` }
    });
    addLines(15, 13, 18, 22);

    if (visit.has(n1)) continue;

    visit.add(n1);
    t = Math.max(t, w1);
    distances[n1] = w1;

    steps.push({
      distances: { ...distances },
      visited: Array.from(visit),
      minHeap: [...minHeap],
      currentNode: n1,
      maxTime: t,
      explanation: `Mark node ${n1} as visited. Update max delay time t = max(${t}, ${w1}) = ${t}.`,
      pseudoStep: `visit.add(${n1}); t = max(t, ${w1})  →  ${t}`,
      variables: { t, n1, visited: `{${Array.from(visit).join(', ')}}` }
    });
    addLines(16, 15, 19, 23);

    const neighbors = edges.get(n1) || [];
    for (const [n2, w2] of neighbors) {
      steps.push({
        distances: { ...distances },
        visited: Array.from(visit),
        minHeap: [...minHeap],
        currentNode: n1,
        explanation: `Inspect neighbor ${n2} of node ${n1} with edge weight ${w2}.`,
        pseudoStep: `FOR [n2, w2] OF neighbors(${n1}): inspect neighbor ${n2}`,
        variables: { t, n1, n2, w2 }
      });
      addLines(19, 18, 22, 25);

      if (!visit.has(n2)) {
        minHeap.push([w1 + w2, n2]);
        if (distances[n2] === undefined || w1 + w2 < distances[n2]) {
          distances[n2] = w1 + w2;
        }

        steps.push({
          distances: { ...distances },
          visited: Array.from(visit),
          minHeap: [...minHeap],
          currentNode: n1,
          explanation: `Neighbor ${n2} not visited. Push updated distance ${w1 + w2} for node ${n2} to min-heap.`,
          pseudoStep: `minHeap.push([${w1 + w2}, ${n2}])`,
          variables: { t, n1, n2, w2, minHeap: `[${minHeap.map(h => `[${h[0]},${h[1]}]`).join(', ')}]` }
        });
        addLines(21, 20, 26, 27);
      }
    }
  }

  steps.push({
    distances: { ...distances },
    visited: Array.from(visit),
    minHeap: [],
    currentNode: null,
    maxTime: t,
    explanation: `Min-heap empty. Check if all ${n} nodes are reachable. Visited count = ${visit.size}.`,
    pseudoStep: `RETURN visit.size == n ? t : -1  →  ${visit.size === n ? t : -1}`,
    variables: { t, visitedCount: visit.size, finalResult: visit.size === n ? t : -1 }
  });
  addLines(25, 21, 30, 31);

  return { steps, stepLineNumbers };
}

const nodePositions = [
  { x: 50, y: 150 },   // 1
  { x: 150, y: 50 },   // 2
  { x: 250, y: 150 },  // 3
  { x: 350, y: 50 }    // 4
];

const getEdgeLine = (start: { x: number; y: number }, end: { x: number; y: number }, offset = 18) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  return {
    x1: start.x + (dx / length) * offset,
    y1: start.y + (dy / length) * offset,
    x2: end.x - (dx / length) * offset,
    y2: end.y - (dy / length) * offset,
  };
};

export const DijkstrasVisualization = () => {
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
            <svg viewBox="0 0 400 240" className="w-full max-w-[400px] h-auto">
              {[
                { from: 2, to: 1, weight: 1 },
                { from: 2, to: 3, weight: 1 },
                { from: 3, to: 4, weight: 1 }
              ].map((edge, i) => {
                const start = nodePositions[edge.from - 1];
                const end = nodePositions[edge.to - 1];
                const { x1, y1, x2, y2 } = getEdgeLine(start, end, 18);
                return (
                  <g key={i}>
                    <line
                      x1={x1} y1={y1} x2={x2} y2={y2}
                      className="stroke-muted-foreground/30 transition-all duration-200"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                    <text
                      x={(start.x + end.x) / 2}
                      y={(start.y + end.y) / 2 - 8}
                      className="fill-foreground font-semibold text-[10px]"
                      textAnchor="middle"
                    >
                      {edge.weight}
                    </text>
                  </g>
                );
              })}
              <defs>
                <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" className="fill-muted-foreground/50" />
                </marker>
              </defs>

              {nodePositions.map((pos, idx) => {
                const nodeNum = idx + 1;
                const isVisited = currentStep.visited.includes(nodeNum);
                const isCurrent = currentStep.currentNode === nodeNum;
                return (
                  <g key={idx}>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="18"
                      className={`transition-all duration-200 ${isCurrent
                        ? 'fill-primary stroke-primary'
                        : isVisited
                          ? 'fill-green-500 stroke-green-500'
                          : 'fill-muted stroke-border'
                        }`}
                      strokeWidth="2"
                    />
                    <text
                      x={pos.x}
                      y={pos.y}
                      textAnchor="middle"
                      dy=".3em"
                      className={`text-xs font-bold ${isCurrent || isVisited ? 'fill-white' : 'fill-foreground'}`}
                    >
                      {nodeNum}
                    </text>
                    <text
                      x={pos.x}
                      y={pos.y - 25}
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-muted-foreground"
                    >
                      {currentStep.distances[nodeNum] !== undefined ? `d=${currentStep.distances[nodeNum]}` : 'd=∞'}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="flex justify-center gap-4 mt-2 text-[10px] text-muted-foreground border-t pt-2 w-full">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-green-500 rounded-sm" /> Visited</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-primary rounded-sm" /> Current</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-muted border rounded-sm" /> Unvisited</span>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm font-medium text-foreground">{currentStep.explanation}</p>
          </div>

          <VariablePanel
            variables={{
              "Current Max Time (t)": currentStep.maxTime,
              "Visited Set": `{${currentStep.visited.join(', ')}}`,
              "Min Heap": `[${currentStep.minHeap.map(h => `[${h[0]},${h[1]}]`).join(', ')}]`,
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
