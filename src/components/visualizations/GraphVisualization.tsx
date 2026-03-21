import { useState, useEffect } from 'react';
import { Play, Pause, StepForward, StepBack, RotateCcw } from 'lucide-react';

interface GraphVisualizationProps {
  algorithmId: string;
}

export const GraphVisualization = ({ algorithmId }: GraphVisualizationProps) => {
  const adjacencyList: number[][] = [
    [1, 2],       // 0
    [0, 3, 4],    // 1
    [0, 5],       // 2
    [1],          // 3
    [1, 5],       // 4
    [2, 4]        // 5
  ];

  const positions = [
    { x: 200, y: 50 },   // 0
    { x: 100, y: 150 },  // 1
    { x: 300, y: 150 },  // 2
    { x: 50, y: 250 },   // 3
    { x: 150, y: 250 },  // 4
    { x: 350, y: 250 }   // 5
  ];

  const [sequence, setSequence] = useState<{ currentNode: number; visited: number[] }[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const getBfsSequence = () => {
      const seq: { currentNode: number; visited: number[] }[] = [];
      const queue = [0];
      const visited = new Set([0]);
      const currentVisited: number[] = [];

      while (queue.length > 0) {
        const node = queue.shift()!;
        currentVisited.push(node);
        seq.push({ currentNode: node, visited: [...currentVisited] });

        for (const neighbor of adjacencyList[node]) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
      return seq;
    };

    const getDfsSequence = () => {
      const seq: { currentNode: number; visited: number[] }[] = [];
      const visited = new Set<number>();
      const currentVisited: number[] = [];

      const dfs = (node: number) => {
        visited.add(node);
        currentVisited.push(node);
        seq.push({ currentNode: node, visited: [...currentVisited] });

        for (const neighbor of adjacencyList[node]) {
          if (!visited.has(neighbor)) {
            dfs(neighbor);
          }
        }
      };

      dfs(0);
      return seq;
    };

    let newSequence: { currentNode: number; visited: number[] }[] = [];
    if (algorithmId === 'graph-bfs') {
      newSequence = getBfsSequence();
    } else {
      newSequence = getDfsSequence();
    }
    setSequence(newSequence);
    setCurrentStepIndex(-1);
    setIsPlaying(false);
  }, [algorithmId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStepIndex < sequence.length - 1) {
      interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= sequence.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
    } else if (currentStepIndex >= sequence.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStepIndex, sequence.length]);

  const handlePlayPause = () => {
    if (currentStepIndex >= sequence.length - 1) {
      setCurrentStepIndex(-1);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    if (currentStepIndex < sequence.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    if (currentStepIndex > -1) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
  };

  const currentStep = currentStepIndex >= 0 && currentStepIndex < sequence.length
    ? sequence[currentStepIndex]
    : { currentNode: null, visited: [] as number[] };

  const { currentNode, visited: visitedNodes } = currentStep;

  const isEdgeHighlighted = (from: number, to: number) => {
    const fromVisited = visitedNodes.includes(from);
    const toVisited = visitedNodes.includes(to);
    return fromVisited && toVisited;
  };

  return (
    <div className="space-y-6">
      {/* 1. Input Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">1. Input Graph</h3>
        <div className="p-8 bg-muted/30 rounded-lg border border-border/50">
          <svg width="400" height="300" className="mx-auto">
            {/* Draw edges */}
            {adjacencyList.map((neighbors, from) =>
              neighbors.map(to => {
                if (from < to) {
                  const highlighted = isEdgeHighlighted(from, to);
                  return (
                    <line
                      key={`\${from}-\${to}`}
                      x1={positions[from].x}
                      y1={positions[from].y}
                      x2={positions[to].x}
                      y2={positions[to].y}
                      className={`transition-all duration-300 \${highlighted ? 'stroke-primary' : 'stroke-border'
                        }`}
                      strokeWidth={highlighted ? '3' : '2'}
                    />
                  );
                }
                return null;
              })
            )}

            {/* Draw nodes */}
            {positions.map((pos, index) => {
              const isVisited = visitedNodes.includes(index);
              const isCurrent = currentNode === index;
              const visitOrder = visitedNodes.indexOf(index);

              return (
                <g key={index}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="28"
                    className={`transition-all duration-300 \${isCurrent
                        ? 'fill-primary stroke-primary shadow-lg'
                        : isVisited
                          ? 'fill-primary/60 stroke-primary'
                          : 'fill-card stroke-border'
                      }`}
                    strokeWidth="2"
                    style={{
                      filter: isCurrent ? 'drop-shadow(0 0 8px hsl(var(--primary)))' : 'none'
                    }}
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 6}
                    textAnchor="middle"
                    className={`text-base font- transition-colors \${isVisited ? 'fill-primary-foreground' : 'fill-foreground'
                      }`}
                  >
                    {index}
                  </text>
                  {isVisited && visitOrder >= 0 && (
                    <text
                      x={pos.x}
                      y={pos.y + 45}
                      textAnchor="middle"
                      className="text-xs fill-primary font-"
                    >
                      {visitOrder + 1}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 justify-center p-3 bg-muted/20 border rounded-lg">
        <button
          onClick={handleStepBackward}
          disabled={currentStepIndex === -1}
          className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 text-foreground transition-all"
          title="Step Backward"
        >
          <StepBack className="w-5 h-5" />
        </button>

        <button
          onClick={handlePlayPause}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
        >
          {isPlaying ? (
            <><Pause className="w-4 h-4" /> Pause</>
          ) : (
            <><Play className="w-4 h-4" /> {currentStepIndex >= sequence.length - 1 ? 'Replay' : 'Play'}</>
          )}
        </button>

        <button
          onClick={handleStepForward}
          disabled={currentStepIndex >= sequence.length - 1}
          className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 text-foreground transition-all"
          title="Step Forward"
        >
          <StepForward className="w-5 h-5" />
        </button>

        <button
          onClick={handleReset}
          disabled={currentStepIndex === -1 && !isPlaying}
          className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 ml-2 text-muted-foreground hover:text-foreground transition-all"
          title="Reset"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Output Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">2. Output Order</h3>
        <div className="p-4 bg-card rounded-lg border border-border/50 min-h-[60px] flex items-center justify-center">
          <p className="font-mono text-sm">
            {visitedNodes.length > 0
              ? visitedNodes.join(' → ')
              : <span className="text-muted-foreground">Press Play or Step Forward to see sequence</span>}
          </p>
        </div>
      </div>
    </div>
  );
};
