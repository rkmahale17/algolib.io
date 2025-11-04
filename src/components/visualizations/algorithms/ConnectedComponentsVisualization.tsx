import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  n: number;
  edges: [number, number][];
  visited: Set<number>;
  currentNode: number | null;
  componentCount: number;
  currentComponent: Set<number>;
  message: string;
  lineNumber: number;
}

export const ConnectedComponentsVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function countComponents(n: number, edges: number[][]): number {
  // Build adjacency list
  const graph = new Map<number, number[]>();
  for (let i = 0; i < n; i++) {
    graph.set(i, []);
  }
  for (const [u, v] of edges) {
    graph.get(u)!.push(v);
    graph.get(v)!.push(u);
  }
  
  // DFS to find all components
  const visited = new Set<number>();
  let count = 0;
  
  function dfs(node: number): void {
    visited.add(node);
    
    for (const neighbor of graph.get(node)!) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    }
  }
  
  for (let i = 0; i < n; i++) {
    if (!visited.has(i)) {
      dfs(i);
      count++;
    }
  }
  
  return count;
}`;

  const generateSteps = () => {
    const n = 5;
    const edges: [number, number][] = [[0, 1], [1, 2], [3, 4]];
    const newSteps: Step[] = [];

    // Initial
    newSteps.push({
      n,
      edges: [...edges],
      visited: new Set(),
      currentNode: null,
      componentCount: 0,
      currentComponent: new Set(),
      message: `Count connected components in graph with ${n} nodes and edges ${JSON.stringify(edges)}.`,
      lineNumber: 0
    });

    // Build graph
    const graph = new Map<number, number[]>();
    for (let i = 0; i < n; i++) {
      graph.set(i, []);
    }
    for (const [u, v] of edges) {
      graph.get(u)!.push(v);
      graph.get(v)!.push(u);
    }

    newSteps.push({
      n,
      edges: [...edges],
      visited: new Set(),
      currentNode: null,
      componentCount: 0,
      currentComponent: new Set(),
      message: "Build adjacency list from edges.",
      lineNumber: 2
    });

    const visited = new Set<number>();
    let count = 0;

    // DFS for each unvisited node
    for (let i = 0; i < n; i++) {
      if (!visited.has(i)) {
        newSteps.push({
          n,
          edges: [...edges],
          visited: new Set(visited),
          currentNode: i,
          componentCount: count,
          currentComponent: new Set(),
          message: `Node ${i} not visited. Start new component ${count + 1}.`,
          lineNumber: 26
        });

        // DFS to explore component
        const stack = [i];
        const component = new Set<number>();

        while (stack.length > 0) {
          const node = stack.pop()!;
          
          if (visited.has(node)) continue;
          
          visited.add(node);
          component.add(node);

          newSteps.push({
            n,
            edges: [...edges],
            visited: new Set(visited),
            currentNode: node,
            componentCount: count,
            currentComponent: new Set(component),
            message: `Visit node ${node}. Component ${count + 1}: {${Array.from(component).join(', ')}}`,
            lineNumber: 17
          });

          for (const neighbor of graph.get(node)!) {
            if (!visited.has(neighbor)) {
              stack.push(neighbor);
            }
          }
        }

        count++;
        
        newSteps.push({
          n,
          edges: [...edges],
          visited: new Set(visited),
          currentNode: null,
          componentCount: count,
          currentComponent: new Set(component),
          message: `Component ${count} complete: {${Array.from(component).join(', ')}}. Total components: ${count}`,
          lineNumber: 28
        });
      }
    }

    // Final
    newSteps.push({
      n,
      edges: [...edges],
      visited: new Set(visited),
      currentNode: null,
      componentCount: count,
      currentComponent: new Set(),
      message: `All nodes visited! Total connected components: ${count}. Time: O(V+E), Space: O(V)`,
      lineNumber: 32
    });

    setSteps(newSteps);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0) {
    return <div>Loading...</div>;
  }

  const currentStep = steps[currentStepIndex];

  const getNodeColor = (nodeIdx: number) => {
    if (nodeIdx === currentStep.currentNode) {
      return 'bg-primary text-primary-foreground';
    }
    if (currentStep.currentComponent.has(nodeIdx)) {
      return 'bg-accent text-accent-foreground border-2 border-accent';
    }
    if (currentStep.visited.has(nodeIdx)) {
      return 'bg-green-500/20 border-2 border-green-500';
    }
    return 'bg-muted';
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      {/* Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              disabled={currentStepIndex === 0}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleStepBack}
              disabled={currentStepIndex === 0}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={isPlaying ? handlePause : handlePlay}
              disabled={currentStepIndex === steps.length - 1}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleStepForward}
              disabled={currentStepIndex === steps.length - 1}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Speed:</span>
            <Button
              variant={speed === 2000 ? "default" : "outline"}
              size="sm"
              onClick={() => setSpeed(2000)}
            >
              0.5x
            </Button>
            <Button
              variant={speed === 1000 ? "default" : "outline"}
              size="sm"
              onClick={() => setSpeed(1000)}
            >
              1x
            </Button>
            <Button
              variant={speed === 500 ? "default" : "outline"}
              size="sm"
              onClick={() => setSpeed(500)}
            >
              2x
            </Button>
          </div>
          <div className="text-sm font-medium">
            Step {currentStepIndex + 1} / {steps.length}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Visualization */}
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Connected Components</h3>
            
            <div className="space-y-4">
              {/* Nodes */}
              <div>
                <div className="text-sm font-semibold mb-2">Nodes (n={currentStep.n}):</div>
                <div className="flex gap-2 flex-wrap">
                  {Array.from({ length: currentStep.n }, (_, i) => (
                    <div
                      key={i}
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getNodeColor(i)}`}
                    >
                      {i}
                    </div>
                  ))}
                </div>
              </div>

              {/* Edges */}
              <div>
                <div className="text-sm font-semibold mb-2">Edges:</div>
                <div className="space-y-1 text-sm font-mono">
                  {currentStep.edges.map(([u, v], idx) => (
                    <div key={idx}>
                      {u} ↔ {v}
                    </div>
                  ))}
                </div>
              </div>

              {/* Component Count */}
              <div className="p-4 bg-muted/50 rounded">
                <div className="text-sm font-semibold mb-2">Components Found:</div>
                <div className="text-3xl font-bold text-primary">
                  {currentStep.componentCount}
                </div>
              </div>

              {/* Current Component */}
              {currentStep.currentComponent.size > 0 && (
                <div className="p-3 bg-accent/20 rounded border border-accent">
                  <div className="text-sm font-semibold mb-1">Current Component:</div>
                  <div className="text-sm">{`{${Array.from(currentStep.currentComponent).join(', ')}}`}</div>
                </div>
              )}
            </div>

            <div className="mt-4 p-4 bg-muted/50 rounded text-sm">
              {currentStep.message}
            </div>
          </Card>
        </div>

        {/* Code */}
        <Card className="p-6 overflow-hidden flex flex-col">
          <h3 className="text-lg font-semibold mb-4">TypeScript Code</h3>
          <div className="flex-1 overflow-auto">
            <SyntaxHighlighter
              language="typescript"
              style={vscDarkPlus}
              showLineNumbers
              wrapLines
              lineProps={(lineNumber) => ({
                style: {
                  backgroundColor: lineNumber === currentStep.lineNumber ? 'rgba(255, 255, 0, 0.2)' : 'transparent',
                  display: 'block',
                  width: '100%'
                }
              })}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </Card>
      </div>
    </div>
  );
};
