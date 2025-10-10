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
  rank: number[];
  mstEdges: Edge[];
  message: string;
  lineNumber: number;
}

export const KruskalsVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function kruskalMST(edges, n) {
  // Sort edges by weight
  edges.sort((a, b) => a.weight - b.weight);
  
  const parent = Array(n).fill(0).map((_, i) => i);
  const rank = Array(n).fill(0);
  const mst = [];
  
  for (const edge of edges) {
    const rootU = find(edge.from, parent);
    const rootV = find(edge.to, parent);
    
    if (rootU !== rootV) {
      mst.push(edge);
      union(rootU, rootV, parent, rank);
    }
  }
  return mst;
}`;

  const generateSteps = () => {
    const nodes = 5;
    const edges: Edge[] = [
      { from: 0, to: 1, weight: 2 },
      { from: 0, to: 3, weight: 6 },
      { from: 1, to: 2, weight: 3 },
      { from: 1, to: 3, weight: 8 },
      { from: 1, to: 4, weight: 5 },
      { from: 2, to: 4, weight: 7 },
      { from: 3, to: 4, weight: 9 }
    ];

    const newSteps: Step[] = [];
    const parent = Array(nodes).fill(0).map((_, i) => i);
    const rank = Array(nodes).fill(0);
    const mstEdges: Edge[] = [];

    const find = (x: number): number => {
      if (parent[x] !== x) parent[x] = find(parent[x]);
      return parent[x];
    };

    const union = (x: number, y: number) => {
      if (rank[x] < rank[y]) {
        parent[x] = y;
      } else if (rank[x] > rank[y]) {
        parent[y] = x;
      } else {
        parent[y] = x;
        rank[x]++;
      }
    };

    newSteps.push({
      edges: edges.map(e => ({ ...e })),
      parent: [...parent],
      rank: [...rank],
      mstEdges: [],
      message: 'Start Kruskal\'s algorithm. Sort edges by weight',
      lineNumber: 2
    });

    edges.sort((a, b) => a.weight - b.weight);

    newSteps.push({
      edges: edges.map(e => ({ ...e })),
      parent: [...parent],
      rank: [...rank],
      mstEdges: [],
      message: 'Edges sorted. Initialize Union-Find',
      lineNumber: 4
    });

    for (const edge of edges) {
      const rootU = find(edge.from);
      const rootV = find(edge.to);

      newSteps.push({
        edges: edges.map(e => ({ ...e, considered: e === edge })),
        parent: [...parent],
        rank: [...rank],
        mstEdges: [...mstEdges],
        message: `Consider edge ${edge.from}-${edge.to} (weight: ${edge.weight})`,
        lineNumber: 9
      });

      if (rootU !== rootV) {
        mstEdges.push({ ...edge, selected: true });
        union(rootU, rootV);
        
        newSteps.push({
          edges: edges.map(e => ({ ...e })),
          parent: [...parent],
          rank: [...rank],
          mstEdges: [...mstEdges],
          message: `Add edge ${edge.from}-${edge.to} to MST`,
          lineNumber: 13
        });
      } else {
        newSteps.push({
          edges: edges.map(e => ({ ...e })),
          parent: [...parent],
          rank: [...rank],
          mstEdges: [...mstEdges],
          message: `Skip edge ${edge.from}-${edge.to} (creates cycle)`,
          lineNumber: 11
        });
      }
    }

    newSteps.push({
      edges: edges.map(e => ({ ...e })),
      parent: [...parent],
      rank: [...rank],
      mstEdges: [...mstEdges],
      message: `MST complete! Total weight: ${mstEdges.reduce((sum, e) => sum + e.weight, 0)}`,
      lineNumber: 17
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
    { x: 100, y: 50 },
    { x: 200, y: 100 },
    { x: 300, y: 50 },
    { x: 150, y: 200 },
    { x: 250, y: 200 }
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
                
                return (
                  <g key={idx}>
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      className={`transition-all duration-300 ${
                        inMST ? 'stroke-green-500' : edge.considered ? 'stroke-primary' : 'stroke-border'
                      }`}
                      strokeWidth={inMST ? 3 : edge.considered ? 3 : 2}
                    />
                    <text
                      x={(from.x + to.x) / 2}
                      y={(from.y + to.y) / 2}
                      className="fill-foreground text-xs font-bold"
                      textAnchor="middle"
                    >
                      {edge.weight}
                    </text>
                  </g>
                );
              })}
              
              {nodePositions.map((pos, idx) => (
                <g key={idx}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="20"
                    className="fill-muted stroke-border"
                    strokeWidth="2"
                  />
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dy=".3em"
                    className="fill-foreground font-bold"
                  >
                    {idx}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>
          <div className="rounded-lg">
            <VariablePanel
            variables={{
              'MST Edges': currentStep.mstEdges.length,
              'Total Weight': currentStep.mstEdges.reduce((sum, e) => sum + e.weight, 0)
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
