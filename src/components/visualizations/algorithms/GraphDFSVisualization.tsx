import React, { useState, useEffect, useRef } from 'react';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  currentNode: number | null;
  visited: number[];
  stack: number[];
  message: string;
  lineNumber: number;
}

export const GraphDFSVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function dfs(graph, start) {
  const visited = new Set();
  const stack = [start];
  
  while (stack.length > 0) {
    const node = stack.pop();
    
    if (!visited.has(node)) {
      visited.add(node);
      console.log(node);
      
      // Add neighbors to stack
      for (let neighbor of graph[node]) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
        }
      }
    }
  }
  
  return visited;
}`;

  const generateSteps = () => {
    const graph: Record<number, number[]> = {
      0: [1, 2],
      1: [0, 3, 4],
      2: [0, 5],
      3: [1],
      4: [1],
      5: [2]
    };
    
    const newSteps: Step[] = [];
    const visited = new Set<number>();
    const stack = [0];

    newSteps.push({
      currentNode: null,
      visited: [],
      stack: [...stack],
      message: 'Initialize: Start with node 0 in stack',
      lineNumber: 3
    });

    while (stack.length > 0) {
      const node = stack.pop()!;
      
      newSteps.push({
        currentNode: node,
        visited: Array.from(visited),
        stack: [...stack],
        message: `Pop node ${node} from stack`,
        lineNumber: 6
      });

      if (!visited.has(node)) {
        visited.add(node);
        
        newSteps.push({
          currentNode: node,
          visited: Array.from(visited),
          stack: [...stack],
          message: `Visit node ${node}`,
          lineNumber: 9
        });

        for (let neighbor of graph[node] || []) {
          if (!visited.has(neighbor)) {
            stack.push(neighbor);
          }
        }

        newSteps.push({
          currentNode: node,
          visited: Array.from(visited),
          stack: [...stack],
          message: `Added unvisited neighbors of ${node} to stack`,
          lineNumber: 13
        });
      }
    }

    newSteps.push({
      currentNode: null,
      visited: Array.from(visited),
      stack: [],
      message: 'DFS complete! All reachable nodes visited',
      lineNumber: 19
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
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
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
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="space-y-6">
      <StepControls
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        isPlaying={isPlaying}
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 border space-y-4">
          <h3 className="text-lg font-semibold">Graph Nodes</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            {[0, 1, 2, 3, 4, 5].map(node => (
              <div
                key={node}
                className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all ${
                  currentStep.currentNode === node
                    ? 'bg-primary/20 border-primary text-primary scale-110 animate-pulse'
                    : currentStep.visited.includes(node)
                    ? 'bg-green-500/20 border-green-500 text-green-500'
                    : currentStep.stack.includes(node)
                    ? 'bg-blue-500/20 border-blue-500 text-blue-500'
                    : 'bg-card border-border text-muted-foreground'
                }`}
              >
                {node}
              </div>
            ))}
          </div>
          
          <div className="flex gap-4 text-sm justify-center flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-primary/20 border-2 border-primary"></div>
              <span>Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500/20 border-2 border-green-500"></div>
              <span>Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500/20 border-2 border-blue-500"></div>
              <span>In Stack</span>
            </div>
          </div>

          <div className="p-4 bg-muted rounded">
            <p className="text-sm">{currentStep.message}</p>
          </div>
        </div>

        <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
      </div>

      <VariablePanel
        variables={{
          currentNode: currentStep.currentNode !== null ? currentStep.currentNode : 'none',
          visitedCount: currentStep.visited.length,
          stackSize: currentStep.stack.length,
          stack: currentStep.stack.join(', ') || 'empty'
        }}
      />
    </div>
  );
};
