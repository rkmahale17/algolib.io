import { useEffect, useRef, useState } from "react";

import { CodeHighlighter } from "../shared/CodeHighlighter";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";

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
  message: string;
  lineNumber: number;
}

export const PrimsVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function minCostConnectPoints(points: number[][]): number {
  const N = points.length;
  const adj: Map<number, [number, number][]> = new Map();
  for (let i = 0; i < N; i++) adj.set(i, []);

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
  const mst = [];
  const visit = new Set<number>();
  const minHeap: [number, number, number | null][] = [[0, 0, null]]; // [cost, node, parent]

  while (visit.size < N) {
    minHeap.sort((a, b) => a[0] - b[0]);
    const [cost, node, parent] = minHeap.shift()!;

    if (visit.has(node)) continue;

    result += cost;
    visit.add(node);
    if (parent !== null) mst.push({ from: parent, to: node, weight: cost });

    for (const [neiCost, nei] of adj.get(node)!) {
      if (!visit.has(nei)) {
        minHeap.push([neiCost, nei, node]);
      }
    }
  }
  return result;
}`;

  const generateSteps = () => {
    const points = [[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]];
    const N = points.length;
    const newSteps: Step[] = [];

    // Adjacency list: node -> [cost, neighbor]
    const adj: Map<number, [number, number][]> = new Map();
    for (let i = 0; i < N; i++) adj.set(i, []);

    newSteps.push({
      visited: Array(N).fill(false),
      edges: [],
      mstEdges: [],
      currentNode: null,
      message: "Initialize adjacency list",
      lineNumber: 3
    });

    // Build graph (Manhattan distance)
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

    newSteps.push({
      visited: Array(N).fill(false),
      edges: [...allEdges],
      mstEdges: [],
      currentNode: null,
      message: "Graph built with Manhattan distances",
      lineNumber: 6
    });

    let result = 0;
    const visit = new Set<number>();
    const minHeap: [number, number, number | null][] = [[0, 0, null]]; // [cost, node, parent]
    const mstEdges: Edge[] = [];

    newSteps.push({
      visited: Array(N).fill(false),
      edges: [...allEdges],
      mstEdges: [],
      currentNode: 0,
      message: "Start Prim's from node 0 (cost 0)",
      lineNumber: 19
    });

    while (visit.size < N && minHeap.length > 0) {
      minHeap.sort((a, b) => a[0] - b[0]);
      const [cost, node, parent] = minHeap.shift()!;

      newSteps.push({
        visited: Array(N).fill(false).map((_, i) => visit.has(i)),
        edges: [...allEdges],
        mstEdges: [...mstEdges],
        currentNode: node,
        message: `Extract minimum: node ${node} with cost ${cost} from parent ${parent ?? 'none'}`,
        lineNumber: 22
      });

      if (visit.has(node)) {
        newSteps.push({
          visited: Array(N).fill(false).map((_, i) => visit.has(i)),
          edges: [...allEdges],
          mstEdges: [...mstEdges],
          currentNode: node,
          message: `Node ${node} already visited, skipping`,
          lineNumber: 25
        });
        continue;
      }

      result += cost;
      if (parent !== null) {
        mstEdges.push({ from: parent, to: node, weight: cost });
      }
      visit.add(node);

      newSteps.push({
        visited: Array(N).fill(false).map((_, i) => visit.has(i)),
        edges: [...allEdges],
        mstEdges: [...mstEdges],
        currentNode: node,
        message: `Add node ${node} to MST (total cost: ${result})`,
        lineNumber: 27
      });

      for (const [neiCost, nei] of adj.get(node)!) {
        if (!visit.has(nei)) {
          minHeap.push([neiCost, nei, node]);
          newSteps.push({
            visited: Array(N).fill(false).map((_, i) => visit.has(i)),
            edges: [...allEdges],
            mstEdges: [...mstEdges],
            currentNode: nei,
            message: `Push neighbor ${nei} with cost ${neiCost} to min-heap`,
            lineNumber: 33
          });
        }
      }
    }

    newSteps.push({
      visited: Array(N).fill(false).map((_, i) => visit.has(i)),
      edges: [...allEdges],
      mstEdges: [...mstEdges],
      currentNode: null,
      message: `Minimum Spanning Tree complete! Total cost: ${result}`,
      lineNumber: 37
    });

    setSteps(newSteps);
    setCurrentStepIndex(0);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () =>
    currentStepIndex < steps.length - 1 &&
    setCurrentStepIndex((prev) => prev + 1);
  const handleStepBack = () =>
    currentStepIndex > 0 && setCurrentStepIndex((prev) => prev - 1);
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    generateSteps();
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

  // Points mapped to SVG coordinates for visualization
  // points = [[0,0], [2,2], [3,10], [5,2], [7,0]]
  const nodePositions = [
    { x: 50, y: 230 },   // [0,0]
    { x: 150, y: 190 },  // [2,2]
    { x: 200, y: 30 },   // [3,10]
    { x: 300, y: 190 },  // [5,2]
    { x: 350, y: 230 },  // [7,0]
  ];

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
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 overflow-x-auto">
            <svg width="400" height="280" className="mx-auto">
              {currentStep.edges.map((edge, idx) => {
                const from = nodePositions[edge.from];
                const to = nodePositions[edge.to];
                const inMST = currentStep.mstEdges.some(
                  (e) =>
                    (e.from === edge.from && e.to === edge.to) ||
                    (e.from === edge.to && e.to === edge.from)
                );

                return (
                  <g key={idx}>
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      className={`transition-all duration-300 ${inMST ? "stroke-green-500" : "stroke-border/30"
                        }`}
                      strokeWidth={inMST ? 3 : 1}
                      strokeDasharray={inMST ? "0" : "4"}
                    />
                    {inMST && (
                      <text
                        x={(from.x + to.x) / 2}
                        y={(from.y + to.y) / 2}
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
                    className={`transition-all duration-300 ${currentStep.visited[idx]
                      ? "fill-green-500 stroke-green-500"
                      : currentStep.currentNode === idx
                        ? "fill-primary stroke-primary"
                        : "fill-muted stroke-border"
                      }`}
                    strokeWidth="2"
                  />
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dy=".3em"
                    className={`text-[10px] font-bold ${currentStep.visited[idx] ||
                      currentStep.currentNode === idx
                      ? "fill-white"
                      : "fill-foreground"
                      }`}
                  >
                    {idx}
                  </text>
                  <text
                    x={pos.x}
                    y={pos.y + 25}
                    textAnchor="middle"
                    className="fill-muted-foreground text-[8px]"
                  >
                    ({[[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]][idx].join(",")})
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">
              {currentStep.message}
            </p>
          </div>
          <div className="rounded-lg">
            <VariablePanel
              variables={{
                "Visited Nodes": currentStep.visited.filter((v) => v).length,
                "MST Edges": currentStep.mstEdges.length,
                "Total Weight": currentStep.mstEdges.reduce(
                  (sum, e) => sum + e.weight,
                  0
                ),
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <CodeHighlighter
            code={code}
            highlightedLine={currentStep.lineNumber}
            language="typescript"
          />
        </div>
      </div>
    </div>

  );
};
