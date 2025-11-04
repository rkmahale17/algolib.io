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
  parent: number | null;
  isValid: boolean | null;
  message: string;
  lineNumber: number;
}

export const GraphValidTreeVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function validTree(n: number, edges: number[][]): boolean {
  // Tree must have exactly n-1 edges
  if (edges.length !== n - 1) return false;
  
  // Build adjacency list
  const graph = new Map<number, number[]>();
  for (let i = 0; i < n; i++) {
    graph.set(i, []);
  }
  for (const [u, v] of edges) {
    graph.get(u)!.push(v);
    graph.get(v)!.push(u);
  }
  
  // DFS to check connectivity
  const visited = new Set<number>();
  
  function dfs(node: number, parent: number): void {
    visited.add(node);
    
    for (const neighbor of graph.get(node)!) {
      if (neighbor === parent) continue;
      if (visited.has(neighbor)) {
        // Cycle detected!
        return;
      }
      dfs(neighbor, node);
    }
  }
  
  dfs(0, -1);
  
  // All nodes must be visited (connected)
  return visited.size === n;
}`;

  const generateSteps = () => {
    const n = 5;
    const edges: [number, number][] = [[0, 1], [0, 2], [0, 3], [1, 4]];
    const newSteps: Step[] = [];

    // Initial
    newSteps.push({
      n,
      edges: [...edges],
      visited: new Set(),
      currentNode: null,
      parent: null,
      isValid: null,
      message: `Check if graph with ${n} nodes and edges ${JSON.stringify(edges)} forms a valid tree.`,
      lineNumber: 0
    });

    // Check edge count
    newSteps.push({
      n,
      edges: [...edges],
      visited: new Set(),
      currentNode: null,
      parent: null,
      isValid: null,
      message: `Tree must have exactly n-1 edges. ${edges.length} === ${n - 1}? Yes! ✓`,
      lineNumber: 2
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
      parent: null,
      isValid: null,
      message: "Build adjacency list from edges.",
      lineNumber: 5
    });

    // DFS traversal
    const visited = new Set<number>();
    const stack: Array<[number, number]> = [[0, -1]]; // [node, parent]

    newSteps.push({
      n,
      edges: [...edges],
      visited: new Set(visited),
      currentNode: 0,
      parent: -1,
      isValid: null,
      message: "Start DFS from node 0 to check connectivity.",
      lineNumber: 16
    });

    while (stack.length > 0) {
      const [node, parent] = stack.pop()!;
      
      if (visited.has(node)) continue;
      
      visited.add(node);
      
      newSteps.push({
        n,
        edges: [...edges],
        visited: new Set(visited),
        currentNode: node,
        parent: parent,
        isValid: null,
        message: `Visit node ${node}. Visited: {${Array.from(visited).join(', ')}}`,
        lineNumber: 18
      });

      for (const neighbor of graph.get(node)!) {
        if (neighbor === parent) continue;
        
        if (visited.has(neighbor)) {
          newSteps.push({
            n,
            edges: [...edges],
            visited: new Set(visited),
            currentNode: node,
            parent: parent,
            isValid: false,
            message: `Cycle detected! Node ${neighbor} already visited.`,
            lineNumber: 23
          });
          break;
        }
        
        stack.push([neighbor, node]);
      }
    }

    // Check if all nodes visited
    const allVisited = visited.size === n;
    newSteps.push({
      n,
      edges: [...edges],
      visited: new Set(visited),
      currentNode: null,
      parent: null,
      isValid: allVisited,
      message: allVisited 
        ? `All ${n} nodes visited! Graph is connected. Valid tree! ✓`
        : `Only ${visited.size}/${n} nodes visited. Not connected. Invalid tree! ✗`,
      lineNumber: 33
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
            <h3 className="text-lg font-semibold mb-4">Graph Valid Tree</h3>
            
            <div className="space-y-4">
              {/* Nodes */}
              <div>
                <div className="text-sm font-semibold mb-2">Nodes (n={currentStep.n}):</div>
                <div className="flex gap-2 flex-wrap">
                  {Array.from({ length: currentStep.n }, (_, i) => (
                    <div
                      key={i}
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        i === currentStep.currentNode
                          ? 'bg-primary text-primary-foreground'
                          : currentStep.visited.has(i)
                          ? 'bg-green-500/20 border-2 border-green-500'
                          : 'bg-muted'
                      }`}
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

              {/* Visited */}
              {currentStep.visited.size > 0 && (
                <div className="p-3 bg-muted/50 rounded">
                  <div className="text-sm font-semibold mb-1">Visited:</div>
                  <div className="text-sm">{`{${Array.from(currentStep.visited).join(', ')}}`}</div>
                </div>
              )}

              {/* Result */}
              {currentStep.isValid !== null && (
                <div className="p-4 bg-muted/50 rounded">
                  <div className="text-sm font-semibold mb-2">Valid Tree?</div>
                  <div className={`text-3xl font-bold ${currentStep.isValid ? 'text-green-500' : 'text-red-500'}`}>
                    {currentStep.isValid ? 'YES ✓' : 'NO ✗'}
                  </div>
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
