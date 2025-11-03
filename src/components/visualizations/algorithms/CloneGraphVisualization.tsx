import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface GraphNode {
  val: number;
  neighbors: number[];
}

interface Step {
  currentNode: number | null;
  visited: Set<number>;
  cloned: Set<number>;
  highlightedLine: number;
  description: string;
}

export const CloneGraphVisualization = () => {
  const graph: GraphNode[] = [
    { val: 1, neighbors: [2, 4] },
    { val: 2, neighbors: [1, 3] },
    { val: 3, neighbors: [2, 4] },
    { val: 4, neighbors: [1, 3] }
  ];
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [steps, setSteps] = useState<Step[]>([]);

  const code = `def cloneGraph(node):
    if not node:
        return None
    
    clones = {}  # original -> clone
    
    def dfs(node):
        if node in clones:
            return clones[node]
        
        # Clone current node
        clone = Node(node.val)
        clones[node] = clone
        
        # Clone neighbors
        for neighbor in node.neighbors:
            clone.neighbors.append(dfs(neighbor))
        
        return clone
    
    return dfs(node)`;

  useEffect(() => {
    generateSteps();
  }, []);

  const generateSteps = () => {
    const newSteps: Step[] = [];
    const visited = new Set<number>();
    const cloned = new Set<number>();
    
    newSteps.push({
      currentNode: null,
      visited: new Set(),
      cloned: new Set(),
      highlightedLine: 0,
      description: "Start: Clone graph using DFS"
    });

    const dfs = (nodeVal: number) => {
      if (visited.has(nodeVal)) {
        newSteps.push({
          currentNode: nodeVal,
          visited: new Set(visited),
          cloned: new Set(cloned),
          highlightedLine: 7,
          description: `Node ${nodeVal} already visited, return clone`
        });
        return;
      }

      visited.add(nodeVal);
      newSteps.push({
        currentNode: nodeVal,
        visited: new Set(visited),
        cloned: new Set(cloned),
        highlightedLine: 10,
        description: `Visit node ${nodeVal}, create clone`
      });

      cloned.add(nodeVal);
      newSteps.push({
        currentNode: nodeVal,
        visited: new Set(visited),
        cloned: new Set(cloned),
        highlightedLine: 11,
        description: `Node ${nodeVal} cloned`
      });

      const node = graph.find(n => n.val === nodeVal);
      if (node) {
        for (const neighbor of node.neighbors) {
          newSteps.push({
            currentNode: nodeVal,
            visited: new Set(visited),
            cloned: new Set(cloned),
            highlightedLine: 15,
            description: `Process neighbor ${neighbor} of node ${nodeVal}`
          });
          dfs(neighbor);
        }
      }
    };

    dfs(1);

    newSteps.push({
      currentNode: null,
      visited: new Set(visited),
      cloned: new Set(cloned),
      highlightedLine: 19,
      description: "Graph cloning complete!"
    });

    setSteps(newSteps);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length, speed]);

  if (steps.length === 0) return <div>Loading...</div>;

  const step = steps[currentStep];

  const getNodeColor = (nodeVal: number) => {
    if (step.currentNode === nodeVal) return 'bg-yellow-200 dark:bg-yellow-900 border-yellow-500';
    if (step.cloned.has(nodeVal)) return 'bg-green-100 dark:bg-green-900/20 border-green-500';
    if (step.visited.has(nodeVal)) return 'bg-blue-100 dark:bg-blue-900/20 border-blue-500';
    return 'bg-muted border-border';
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Clone Graph (DFS)</h3>
        
        <div className="space-y-4">
          <div className="relative h-64 flex items-center justify-center">
            <svg width="300" height="250" className="absolute">
              {/* Edges */}
              <line x1="150" y1="50" x2="50" y2="150" stroke="currentColor" strokeWidth="2" />
              <line x1="150" y1="50" x2="250" y2="150" stroke="currentColor" strokeWidth="2" />
              <line x1="50" y1="150" x2="150" y2="200" stroke="currentColor" strokeWidth="2" />
              <line x1="250" y1="150" x2="150" y2="200" stroke="currentColor" strokeWidth="2" />
            </svg>
            
            {/* Nodes */}
            <div className="absolute" style={{ top: '20px', left: '50%', transform: 'translateX(-50%)' }}>
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold ${getNodeColor(1)}`}>
                1
              </div>
            </div>
            <div className="absolute" style={{ top: '120px', left: '20px' }}>
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold ${getNodeColor(2)}`}>
                2
              </div>
            </div>
            <div className="absolute" style={{ top: '120px', right: '20px' }}>
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold ${getNodeColor(4)}`}>
                4
              </div>
            </div>
            <div className="absolute" style={{ bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold ${getNodeColor(3)}`}>
                3
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-200 dark:bg-yellow-900 border-2 border-yellow-500"></div>
              <span className="text-sm">Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-900/20 border-2 border-blue-500"></div>
              <span className="text-sm">Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/20 border-2 border-green-500"></div>
              <span className="text-sm">Cloned</span>
            </div>
          </div>

          <div className="p-3 bg-muted rounded">
            {step.description}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodeHighlighter
          code={code}
          highlightedLine={step.highlightedLine}
          language="Python"
        />
        <VariablePanel
          variables={{
            current: step.currentNode || "null",
            visited: step.visited.size,
            cloned: step.cloned.size
          }}
        />
      </div>

      <StepControls
        currentStep={currentStep}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onStepForward={() => setCurrentStep(Math.min(currentStep + 1, steps.length - 1))}
        onStepBack={() => setCurrentStep(Math.max(currentStep - 1, 0))}
        onReset={() => { setCurrentStep(0); setIsPlaying(false); }}
        speed={speed}
        onSpeedChange={setSpeed}
      />
    </div>
  );
};
