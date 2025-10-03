import { useState } from 'react';

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

  const [visitedNodes, setVisitedNodes] = useState<number[]>([]);
  const [currentNode, setCurrentNode] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const positions = [
    { x: 200, y: 50 },   // 0
    { x: 100, y: 150 },  // 1
    { x: 300, y: 150 },  // 2
    { x: 50, y: 250 },   // 3
    { x: 150, y: 250 },  // 4
    { x: 350, y: 250 }   // 5
  ];

  const bfs = async () => {
    setIsAnimating(true);
    const queue = [0];
    const visited = new Set([0]);

    while (queue.length > 0) {
      const node = queue.shift()!;
      setCurrentNode(node);
      setVisitedNodes(prev => [...prev, node]);
      await new Promise(resolve => setTimeout(resolve, 800));

      for (const neighbor of adjacencyList[node]) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    setCurrentNode(null);
    setIsAnimating(false);
  };

  const dfs = async (node: number, visited: Set<number>) => {
    visited.add(node);
    setCurrentNode(node);
    setVisitedNodes(prev => [...prev, node]);
    await new Promise(resolve => setTimeout(resolve, 800));

    for (const neighbor of adjacencyList[node]) {
      if (!visited.has(neighbor)) {
        await dfs(neighbor, visited);
      }
    }
  };

  const startDfs = async () => {
    setIsAnimating(true);
    await dfs(0, new Set());
    setCurrentNode(null);
    setIsAnimating(false);
  };

  const startAnimation = () => {
    if (isAnimating) return;
    setVisitedNodes([]);
    setCurrentNode(null);

    if (algorithmId === 'graph-bfs') {
      bfs();
    } else {
      startDfs();
    }
  };

  const reset = () => {
    setVisitedNodes([]);
    setCurrentNode(null);
    setIsAnimating(false);
  };

  const isEdgeHighlighted = (from: number, to: number) => {
    const fromVisited = visitedNodes.includes(from);
    const toVisited = visitedNodes.includes(to);
    return fromVisited && toVisited;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={startAnimation}
          disabled={isAnimating}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {isAnimating ? 'Animating...' : 'Start Animation'}
        </button>
        <button
          onClick={reset}
          disabled={isAnimating}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 disabled:opacity-50 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="p-8 bg-muted/30 rounded-lg border border-border/50">
        <svg width="400" height="300" className="mx-auto">
          {/* Draw edges */}
          {adjacencyList.map((neighbors, from) =>
            neighbors.map(to => {
              if (from < to) {
                const highlighted = isEdgeHighlighted(from, to);
                return (
                  <line
                    key={`${from}-${to}`}
                    x1={positions[from].x}
                    y1={positions[from].y}
                    x2={positions[to].x}
                    y2={positions[to].y}
                    className={`transition-all duration-300 ${
                      highlighted ? 'stroke-primary' : 'stroke-border'
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
                  className={`transition-all duration-300 ${
                    isCurrent
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
                  className={`text-base font-bold transition-colors ${
                    isVisited ? 'fill-primary-foreground' : 'fill-foreground'
                  }`}
                >
                  {index}
                </text>
                {isVisited && visitOrder >= 0 && (
                  <text
                    x={pos.x}
                    y={pos.y + 45}
                    textAnchor="middle"
                    className="text-xs fill-primary font-bold"
                  >
                    {visitOrder + 1}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="text-sm text-muted-foreground text-center">
        {visitedNodes.length > 0 && (
          <p>Visit order: {visitedNodes.join(' → ')}</p>
        )}
      </div>
    </div>
  );
};
