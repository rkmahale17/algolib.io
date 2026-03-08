import React, { useEffect, useRef, useState } from 'react';

import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { GraphDiagram } from '../GraphDiagram';

interface Step {
  currentNode: number | null;
  visited: number[];
  recursionStack: number[];
  message: string;
  lineNumber: number;
  type: 'init' | 'enter' | 'visited' | 'neighbor' | 'neighbor-check' | 'recurse' | 'backtrack' | 'done';
}

export const GraphDFSVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function dfs(graph: number[][], start: number): number[] {
  const visited = new Set<number>();
  const result: number[] = [];

  function explore(node: number) {
    visited.add(node);
    result.push(node);

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        explore(neighbor);
      }
    }
  }

  explore(start);
  return result;
}`;

  const generateSteps = () => {
    const graph: number[][] = [
      [1, 2],    // 0
      [0, 3, 4], // 1
      [0, 5],    // 2
      [1],       // 3
      [1],       // 4
      [2]        // 5
    ];

    const newSteps: Step[] = [];
    const visited = new Set<number>();
    const result: number[] = [];
    const recursionStack: number[] = [];

    newSteps.push({
      currentNode: null,
      visited: [],
      recursionStack: [],
      message: 'Initialize DFS: visited set and result array',
      lineNumber: 1,
      type: 'init'
    });

    const explore = (node: number) => {
      recursionStack.push(node);

      newSteps.push({
        currentNode: node,
        visited: Array.from(visited),
        recursionStack: [...recursionStack],
        message: `Enter explore(${node})`,
        lineNumber: 5,
        type: 'enter'
      });

      visited.add(node);
      result.push(node);

      newSteps.push({
        currentNode: node,
        visited: Array.from(visited),
        recursionStack: [...recursionStack],
        message: `Mark node ${node} as visited and add to result`,
        lineNumber: 6,
        type: 'visited'
      });

      const neighbors = graph[node] || [];
      for (const neighbor of neighbors) {
        newSteps.push({
          currentNode: node,
          visited: Array.from(visited),
          recursionStack: [...recursionStack],
          message: `Check neighbor ${neighbor} of node ${node}`,
          lineNumber: 9,
          type: 'neighbor-check'
        });

        if (!visited.has(neighbor)) {
          newSteps.push({
            currentNode: node,
            visited: Array.from(visited),
            recursionStack: [...recursionStack],
            message: `Neighbor ${neighbor} is not visited, recursing...`,
            lineNumber: 10,
            type: 'neighbor'
          });

          explore(neighbor);

          newSteps.push({
            currentNode: node,
            visited: Array.from(visited),
            recursionStack: [...recursionStack],
            message: `Returned from explore(${neighbor}) back to node ${node}`,
            lineNumber: 9,
            type: 'backtrack'
          });
        } else {
          newSteps.push({
            currentNode: node,
            visited: Array.from(visited),
            recursionStack: [...recursionStack],
            message: `Neighbor ${neighbor} is already visited, skipping.`,
            lineNumber: 9,
            type: 'neighbor-check'
          });
        }
      }

      newSteps.push({
        currentNode: node,
        visited: Array.from(visited),
        recursionStack: [...recursionStack],
        message: `Finished exploring all neighbors of node ${node}, backtracking...`,
        lineNumber: 5,
        type: 'backtrack'
      });

      recursionStack.pop();
    };

    explore(0);

    newSteps.push({
      currentNode: null,
      visited: Array.from(visited),
      recursionStack: [],
      message: `DFS complete! Order of visit: ${result.join(', ')}`,
      lineNumber: 17,
      type: 'done'
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
        <div className="bg-card rounded-lg p-6 border border-border shadow-sm space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Graph Visualization</h3>
          <GraphDiagram
            data={[[1, 2], [0, 3, 4], [0, 5], [1], [1], [2]]}
            currentNode={currentStep.currentNode}
            highlightNodes={new Set(currentStep.visited)}
            className="h-[300px]"
          />

          <div className="flex gap-4 text-xs justify-center flex-wrap pt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary/20 border-2 border-primary animate-pulse"></div>
              <span>Current Node</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500/20 border-2 border-green-500"></div>
              <span>Visited</span>
            </div>
          </div>

          <div className="p-3 bg-muted/30 border rounded min-h-[60px] flex items-center">
            <p className="text-sm font-medium leading-relaxed italic">"{currentStep.message}"</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Local Variables</h4>
              <VariablePanel
                variables={{
                  node: currentStep.currentNode !== null ? currentStep.currentNode : 'undefined',
                  visited: Array.from(currentStep.visited).join(', ') || '{}',
                }}
              />
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recursion Stack</h4>
              <div className="bg-muted/30 rounded border p-2 min-h-[80px]">
                {currentStep.recursionStack.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Empty stack</p>
                ) : (
                  <div className="flex flex-col-reverse gap-1">
                    {currentStep.recursionStack.map((node, i) => (
                      <div key={i} className={`text-xs p-1 rounded border ${i === currentStep.recursionStack.length - 1 ? 'bg-primary/20 border-primary font-bold' : 'bg-background border-border text-muted-foreground'}`}>
                        explore({node})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <CodeHighlighter
            code={code}
            highlightedLine={currentStep.lineNumber}
            language="typescript"
          />
        </div>
      </div>
    </div>
  );
};
