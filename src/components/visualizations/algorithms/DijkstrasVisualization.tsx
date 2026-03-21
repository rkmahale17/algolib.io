import { useEffect, useRef, useState } from 'react';

import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  distances: Record<number, number>;
  visited: number[];
  minHeap: [number, number][];
  currentNode: number | null;
  maxTime: number;
  message: string;
  lineNumber: number;
}

export const DijkstrasVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function networkDelayTime(times: number[][], n: number, k: number): number {
    const adj: Map<number, [number, number][]> = new Map();
    for (const [u, v, w] of times) {
        if (!adj.has(u)) adj.set(u, []);
        adj.get(u)!.push([v, w])
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

        if (adj.has(n1)) {
            for (const [n2, w2] of adj.get(n1)!) {
                if (!visit.has(n2)) {
                    minHeap.push([w1 + w2, n2]);
                }
            }
        }
    }

    return visit.size === n ? t : -1;
}`;

  const generateSteps = () => {
    const n = 4;
    const k = 2;
    const times = [[2, 1, 1], [2, 3, 1], [3, 4, 1]];

    const newSteps: Step[] = [];
    const edges: Map<number, [number, number][]> = new Map();
    const distances: Record<number, number> = {};
    const visit = new Set<number>();
    let t = 0;

    newSteps.push({
      distances: { ...distances },
      visited: Array.from(visit),
      minHeap: [],
      currentNode: null,
      maxTime: t,
      message: 'Initializing adjacency list...',
      lineNumber: 2
    });

    for (const [u, v, w] of times) {
      if (!edges.has(u)) edges.set(u, []);
      edges.get(u)!.push([v, w]);
    }

    const minHeap: [number, number][] = [[0, k]];
    newSteps.push({
      distances: { ...distances },
      visited: Array.from(visit),
      minHeap: [...minHeap],
      currentNode: null,
      maxTime: t,
      message: `Starting Dijkstra from node ${k} with time 0.`,
      lineNumber: 8
    });

    while (minHeap.length > 0) {
      newSteps.push({
        distances: { ...distances },
        visited: Array.from(visit),
        minHeap: [...minHeap],
        currentNode: null,
        maxTime: t,
        message: 'Sorting minHeap by time.',
        lineNumber: 15
      });
      minHeap.sort((a, b) => a[0] - b[0]);

      const [w1, n1] = minHeap.shift()!;
      newSteps.push({
        distances: { ...distances },
        visited: Array.from(visit),
        minHeap: [...minHeap],
        currentNode: n1,
        maxTime: t,
        message: `Popped node ${n1} with current time ${w1}.`,
        lineNumber: 17
      });

      if (visit.has(n1)) {
        newSteps.push({
          distances: { ...distances },
          visited: Array.from(visit),
          minHeap: [...minHeap],
          currentNode: n1,
          maxTime: t,
          message: `Node ${n1} already visited. Skipping.`,
          lineNumber: 20
        });
        continue;
      }

      visit.add(n1);
      distances[n1] = w1;
      t = Math.max(t, w1);
      newSteps.push({
        distances: { ...distances },
        visited: Array.from(visit),
        minHeap: [...minHeap],
        currentNode: n1,
        maxTime: t,
        message: `Marking node ${n1} as visited. Updated max time t = ${t}.`,
        lineNumber: 24
      });

      const neighbors = edges.get(n1) || [];
      if (neighbors.length > 0) {
        newSteps.push({
          distances: { ...distances },
          visited: Array.from(visit),
          minHeap: [...minHeap],
          currentNode: n1,
          maxTime: t,
          message: `Checking neighbors of node ${n1}.`,
          lineNumber: 27
        });
      }

      for (const [n2, w2] of neighbors) {
        if (!visit.has(n2)) {
          minHeap.push([w1 + w2, n2]);
          newSteps.push({
            distances: { ...distances },
            visited: Array.from(visit),
            minHeap: [...minHeap],
            currentNode: n1,
            maxTime: t,
            message: `Adding node ${n2} to heap with distance ${w1 + w2}.`,
            lineNumber: 29
          });
        }
      }
    }

    newSteps.push({
      distances: { ...distances },
      visited: Array.from(visit),
      minHeap: [...minHeap],
      currentNode: null,
      maxTime: t,
      message: visit.size === n ? `All nodes reachable. Max time: ${t}` : 'Not all nodes reached.',
      lineNumber: 31
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

  // Node positions for a simple graph loop
  const nodePositions = [
    { x: 50, y: 150 },   // 1
    { x: 150, y: 50 },   // 2
    { x: 250, y: 150 },  // 3
    { x: 350, y: 50 }    // 4
  ];

  // Helper to calculate edge line with offset so marker doesn't overlap circle
  const getEdgeLine = (start: { x: number; y: number }, end: { x: number; y: number }, offset = 22) => {
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
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 overflow-hidden flex justify-center w-full">
            <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid meet" className="mx-auto w-full h-auto max-w-[400px]">
              {/* Edges */}
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
                    <line x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-muted-foreground/30 transition-all duration-300" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    <text x={(start.x + end.x) / 2} y={(start.y + end.y) / 2 - 10} className="fill-foreground font-medium text-[10px]">{edge.weight}</text>
                  </g>
                );
              })}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" className="fill-muted-foreground/50" />
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
                      className={`transition-all duration-300 ${isCurrent ? 'fill-primary stroke-primary' : isVisited ? 'fill-green-500 stroke-green-500' : 'fill-muted stroke-border'}`}
                      strokeWidth="2"
                    />
                    <text x={pos.x} y={pos.y} textAnchor="middle" dy=".3em" className={`text-xs font- ${isCurrent || isVisited ? 'fill-white' : 'fill-foreground'}`}>{nodeNum}</text>
                    <text x={pos.x} y={pos.y - 25} textAnchor="middle" className="text-[10px] font-semibold fill-muted-foreground">{currentStep.distances[nodeNum] !== undefined ? `d=${currentStep.distances[nodeNum]}` : 'd=∞'}</text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>

          <VariablePanel
            variables={{
              "Current Max Time (t)": currentStep.maxTime,
              "Visited Set": `{${currentStep.visited.join(', ')}}`,
              "Min Heap": JSON.stringify(currentStep.minHeap)
            }}
          />
        </div>

        <div className="space-y-4">
          <AnimatedCodeEditor code={code} highlightedLines={[currentStep.lineNumber]} language="typescript" />
        </div>
      </div>
    </div>
  );
};
