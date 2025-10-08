import { useState, useEffect, useRef } from 'react';
import { VariablePanel } from '../shared/VariablePanel';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';

interface Step {
  distances: number[];
  visited: boolean[];
  currentNode: number | null;
  message: string;
  lineNumber: number;
}

export const DijkstrasVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function dijkstra(graph, start) {
  const dist = Array(n).fill(Infinity);
  const visited = Array(n).fill(false);
  dist[start] = 0;
  
  for (let i = 0; i < n; i++) {
    let u = minDistance(dist, visited);
    visited[u] = true;
    
    for (let v of graph[u]) {
      if (!visited[v.to]) {
        const alt = dist[u] + v.weight;
        if (alt < dist[v.to]) {
          dist[v.to] = alt;
        }
      }
    }
  }
  return dist;
}`;

  const generateSteps = () => {
    const nodes = 5;
    const graph = [
      [{ to: 1, weight: 4 }, { to: 2, weight: 1 }],
      [{ to: 3, weight: 1 }],
      [{ to: 1, weight: 2 }, { to: 3, weight: 5 }],
      [{ to: 4, weight: 3 }],
      []
    ];

    const newSteps: Step[] = [];
    const distances = Array(nodes).fill(Infinity);
    const visited = Array(nodes).fill(false);
    distances[0] = 0;

    newSteps.push({
      distances: [...distances],
      visited: [...visited],
      currentNode: null,
      message: 'Initialize distances. Start from node 0',
      lineNumber: 1
    });

    for (let i = 0; i < nodes; i++) {
      let minDist = Infinity;
      let u = -1;

      for (let j = 0; j < nodes; j++) {
        if (!visited[j] && distances[j] < minDist) {
          minDist = distances[j];
          u = j;
        }
      }

      if (u === -1) break;

      visited[u] = true;

      newSteps.push({
        distances: [...distances],
        visited: [...visited],
        currentNode: u,
        message: `Select node ${u} with distance ${distances[u]}`,
        lineNumber: 7
      });

      for (const edge of graph[u]) {
        if (!visited[edge.to]) {
          const alt = distances[u] + edge.weight;

          newSteps.push({
            distances: [...distances],
            visited: [...visited],
            currentNode: u,
            message: `Check edge ${u}→${edge.to}: ${distances[u]} + ${edge.weight} = ${alt}`,
            lineNumber: 11
          });

          if (alt < distances[edge.to]) {
            distances[edge.to] = alt;
            newSteps.push({
              distances: [...distances],
              visited: [...visited],
              currentNode: u,
              message: `Update distance to node ${edge.to}: ${alt}`,
              lineNumber: 13
            });
          }
        }
      }
    }

    newSteps.push({
      distances: [...distances],
      visited: [...visited],
      currentNode: null,
      message: 'Shortest paths found!',
      lineNumber: 18
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
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6">
            <svg width="400" height="220" className="mx-auto">
              {nodePositions.map((pos, idx) => (
                <g key={idx}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="25"
                    className={`transition-all duration-300 ${
                      currentStep.currentNode === idx
                        ? 'fill-primary stroke-primary'
                        : currentStep.visited[idx]
                        ? 'fill-green-500 stroke-green-500'
                        : 'fill-muted stroke-border'
                    }`}
                    strokeWidth="2"
                  />
                  <text
                    x={pos.x}
                    y={pos.y - 5}
                    textAnchor="middle"
                    className={`font-bold ${
                      currentStep.currentNode === idx || currentStep.visited[idx]
                        ? 'fill-white'
                        : 'fill-foreground'
                    }`}
                  >
                    {idx}
                  </text>
                  <text
                    x={pos.x}
                    y={pos.y + 10}
                    textAnchor="middle"
                    className={`text-xs font-bold ${
                      currentStep.currentNode === idx || currentStep.visited[idx]
                        ? 'fill-white'
                        : 'fill-foreground'
                    }`}
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
        </div>

        <div className="space-y-4">
          <VariablePanel
            variables={{
              distances: currentStep.distances.map(d => d === Infinity ? '∞' : d),
              visited: currentStep.visited.filter(v => v).length
            }}
          />
          <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
        </div>
      </div>
    </div>
  );
};
