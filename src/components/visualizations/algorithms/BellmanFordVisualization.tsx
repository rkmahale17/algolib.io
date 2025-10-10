import { useEffect, useRef, useState } from 'react';

import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Edge {
  from: number;
  to: number;
  weight: number;
}

interface Step {
  distances: number[];
  edges: Edge[];
  currentEdge: Edge | null;
  iteration: number;
  message: string;
  lineNumber: number;
}

export const BellmanFordVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function bellmanFord(edges, n, start) {
  const dist = Array(n).fill(Infinity);
  dist[start] = 0;
  
  // Relax edges n-1 times
  for (let i = 0; i < n - 1; i++) {
    for (const edge of edges) {
      if (dist[edge.from] !== Infinity) {
        const alt = dist[edge.from] + edge.weight;
        if (alt < dist[edge.to]) {
          dist[edge.to] = alt;
        }
      }
    }
  }
  return dist;
}`;

  const generateSteps = () => {
    const nodes = 5;
    const edges: Edge[] = [
      { from: 0, to: 1, weight: -1 },
      { from: 0, to: 2, weight: 4 },
      { from: 1, to: 2, weight: 3 },
      { from: 1, to: 3, weight: 2 },
      { from: 1, to: 4, weight: 2 },
      { from: 3, to: 2, weight: 5 },
      { from: 3, to: 1, weight: 1 },
      { from: 4, to: 3, weight: -3 }
    ];

    const newSteps: Step[] = [];
    const distances = Array(nodes).fill(Infinity);
    distances[0] = 0;

    newSteps.push({
      distances: [...distances],
      edges,
      currentEdge: null,
      iteration: 0,
      message: 'Initialize distances. Start from node 0',
      lineNumber: 1
    });

    for (let i = 0; i < nodes - 1; i++) {
      newSteps.push({
        distances: [...distances],
        edges,
        currentEdge: null,
        iteration: i + 1,
        message: `Iteration ${i + 1}: Relax all edges`,
        lineNumber: 6
      });

      for (const edge of edges) {
        if (distances[edge.from] !== Infinity) {
          const alt = distances[edge.from] + edge.weight;

          newSteps.push({
            distances: [...distances],
            edges,
            currentEdge: edge,
            iteration: i + 1,
            message: `Check edge ${edge.from}→${edge.to}: ${distances[edge.from]} + ${edge.weight} = ${alt}`,
            lineNumber: 9
          });

          if (alt < distances[edge.to]) {
            distances[edge.to] = alt;
            newSteps.push({
              distances: [...distances],
              edges,
              currentEdge: edge,
              iteration: i + 1,
              message: `Update distance to ${edge.to}: ${alt}`,
              lineNumber: 11
            });
          }
        }
      }
    }

    newSteps.push({
      distances: [...distances],
      edges,
      currentEdge: null,
      iteration: nodes - 1,
      message: 'Shortest paths found (handles negative weights)!',
      lineNumber: 16
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
    { x: 50, y: 100 },
    { x: 150, y: 50 },
    { x: 150, y: 150 },
    { x: 250, y: 100 },
    { x: 350, y: 100 }
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
            <svg width="400" height="220" className="mx-auto">
              {currentStep.edges.map((edge, idx) => {
                const from = nodePositions[edge.from];
                const to = nodePositions[edge.to];
                const isCurrent = currentStep.currentEdge &&
                  currentStep.currentEdge.from === edge.from &&
                  currentStep.currentEdge.to === edge.to;

                return (
                  <g key={idx}>
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      className={`transition-all duration-300 ${
                        isCurrent ? 'stroke-primary' : 'stroke-border'
                      }`}
                      strokeWidth={isCurrent ? 3 : 2}
                      markerEnd="url(#arrowhead)"
                    />
                    <text
                      x={(from.x + to.x) / 2}
                      y={(from.y + to.y) / 2 - 10}
                      className="fill-foreground text-xs font-bold"
                      textAnchor="middle"
                    >
                      {edge.weight}
                    </text>
                  </g>
                );
              })}

              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3, 0 6" className="fill-border" />
                </marker>
              </defs>

              {nodePositions.map((pos, idx) => (
                <g key={idx}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="25"
                    className="fill-muted stroke-border"
                    strokeWidth="2"
                  />
                  <text
                    x={pos.x}
                    y={pos.y - 5}
                    textAnchor="middle"
                    className="font-bold fill-foreground"
                  >
                    {idx}
                  </text>
                  <text
                    x={pos.x}
                    y={pos.y + 10}
                    textAnchor="middle"
                    className="text-xs font-bold fill-foreground"
                  >
                    {currentStep.distances[idx] === Infinity ? '∞' : currentStep.distances[idx]}
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
          iteration: currentStep.iteration,
          distances: currentStep.distances.map(d => d === Infinity ? '∞' : d)
        }}
      />
          </div>
        </div>

        <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
      </div>

      
    </div>
  );
};
