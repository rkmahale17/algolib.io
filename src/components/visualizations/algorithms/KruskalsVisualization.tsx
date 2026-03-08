import { useEffect, useRef, useState } from 'react';

import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

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
  message: string;
  lineNumber: number;
}

export const KruskalsVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function minCostConnectPoints(points: number[][]): number {
  const n = points.length;
  const edges: [number, number, number][] = [];

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const cost = Math.abs(points[i][0] - points[j][0]) +
                   Math.abs(points[i][1] - points[j][1]);
      edges.push([cost, i, j]);
    }
  }

  edges.sort((a, b) => a[0] - b[0]);

  const parent = new Array(n).fill(0).map((_, i) => i);

  function find(x: number) {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function union(x, y) {
    const rootX = find(x);
    const rootY = find(y);
    if (rootX === rootY) return false;
    parent[rootX] = rootY;
    return true;
  }

  let totalCost = 0, edgesUsed = 0;
  for (const [cost, u, v] of edges) {
    if (union(u, v)) {
      totalCost += cost;
      edgesUsed++;
      if (edgesUsed === n - 1) break;
    }
  }
  return totalCost;
}`;

  const generateSteps = () => {
    const points = [[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]];
    const n = points.length;
    const allEdges: Edge[] = [];

    // All possible edges
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const cost = Math.abs(points[i][0] - points[j][0]) +
          Math.abs(points[i][1] - points[j][1]);
        allEdges.push({ from: i, to: j, weight: cost });
      }
    }

    const newSteps: Step[] = [];
    let parent = Array(n).fill(0).map((_, i) => i);
    let mstEdges: Edge[] = [];

    newSteps.push({
      edges: allEdges.map(e => ({ ...e })),
      parent: [...parent],
      mstEdges: [],
      currentEdge: null,
      message: 'Create all possible edges using Manhattan distance',
      lineNumber: 5
    });

    const sortedEdges = [...allEdges].sort((a, b) => a.weight - b.weight);

    newSteps.push({
      edges: sortedEdges.map(e => ({ ...e })),
      parent: [...parent],
      mstEdges: [],
      currentEdge: null,
      message: 'Sort edges by weight (ascending)',
      lineNumber: 13
    });

    const find = (x: number, p: number[]): number => {
      if (p[x] !== x) p[x] = find(p[x], p);
      return p[x];
    };

    let totalCost = 0, edgesUsed = 0;

    for (const edge of sortedEdges) {
      const pCopy = [...parent];
      const rootU = find(edge.from, pCopy);
      const rootV = find(edge.to, pCopy);

      newSteps.push({
        edges: sortedEdges.map(e => ({ ...e, considered: e === edge })),
        parent: [...parent],
        mstEdges: [...mstEdges],
        currentEdge: edge,
        message: `Consider edge ${edge.from}-${edge.to} (weight: ${edge.weight})`,
        lineNumber: 31
      });

      if (rootU !== rootV) {
        parent[rootU] = rootV;
        mstEdges.push({ ...edge, selected: true });
        totalCost += edge.weight;
        edgesUsed++;

        newSteps.push({
          edges: sortedEdges.map(e => ({ ...e })),
          parent: [...parent],
          mstEdges: [...mstEdges],
          currentEdge: edge,
          message: `Union: root ${rootU} connected to ${rootV}. Add to MST. (Total: ${totalCost})`,
          lineNumber: 35
        });

        if (edgesUsed === n - 1) break;
      } else {
        newSteps.push({
          edges: sortedEdges.map(e => ({ ...e })),
          parent: [...parent],
          mstEdges: [...mstEdges],
          currentEdge: edge,
          message: `Roots match (${rootU}), skip edge ${edge.from}-${edge.to} to avoid cycle`,
          lineNumber: 33
        });
      }
    }

    newSteps.push({
      edges: sortedEdges.map(e => ({ ...e })),
      parent: [...parent],
      mstEdges: [...mstEdges],
      currentEdge: null,
      message: `MST complete! Total cost: ${totalCost}`,
      lineNumber: 39
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
        setCurrentStepIndex(prev => {
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
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(prev => prev + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(prev => prev - 1);
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    generateSteps();
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

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
                const inMST = currentStep.mstEdges.some(e =>
                  (e.from === edge.from && e.to === edge.to) ||
                  (e.from === edge.to && e.to === edge.from)
                );
                const isCurrent = currentStep.currentEdge &&
                  ((currentStep.currentEdge.from === edge.from && currentStep.currentEdge.to === edge.to) ||
                    (currentStep.currentEdge.from === edge.to && currentStep.currentEdge.to === edge.from));

                return (
                  <g key={idx}>
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      className={`transition-all duration-300 ${inMST ? 'stroke-green-500' : isCurrent ? 'stroke-primary' : 'stroke-border/10'
                        }`}
                      strokeWidth={inMST ? 3 : isCurrent ? 3 : 1}
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
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4 min-h-[60px]">
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>
          <div className="rounded-lg">
            <VariablePanel
              variables={{
                'MST Edges': currentStep.mstEdges.length,
                'Total Cost': currentStep.mstEdges.reduce((sum, e) => sum + e.weight, 0),
                'Union-Find (Parent)': currentStep.parent.join(', ')
              }}
            />
          </div>
        </div>

        <div className="space-y-4">

          <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
        </div>
      </div>
    </div>
  );
};
