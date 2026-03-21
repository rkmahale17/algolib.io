import React, { useEffect, useRef, useState } from 'react';

import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { GraphDiagram } from '../GraphDiagram';

interface Step {
  currentNode: number | null;
  neighbor: number | null;
  visited: number[];
  recursionStack: number[];
  message: string;
  lineNumber: number;
}

export const GraphDFSVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

    const pushStep = (msg: string, line: number, current: number | null, neighbor: number | null = null) => {
      newSteps.push({
        currentNode: current,
        neighbor,
        visited: Array.from(visited),
        recursionStack: [...recursionStack],
        message: msg,
        lineNumber: line
      });
    };

    // Initialize
    pushStep('Initialize visited set and result array.', 2, null);

    const explore = (node: number) => {
      recursionStack.push(node);

      // Line 5: Enter explore
      pushStep(`Entering explore function for node ${node}.`, 5, node);

      // Line 6: visited.add
      visited.add(node);
      pushStep(`Marking node ${node} as visited.`, 6, node);

      // Line 7: result.push
      result.push(node);
      pushStep(`Adding node ${node} to the result traversal.`, 7, node);

      // Line 9: for loop
      const neighbors = graph[node] || [];
      pushStep(`Iterating over neighbors of node ${node}: [${neighbors.join(', ')}].`, 9, node);

      for (const neighbor of neighbors) {
        // Line 10: if (!visited.has)
        pushStep(`Checking if neighbor ${neighbor} is visited.`, 10, node, neighbor);

        if (!visited.has(neighbor)) {
          // Line 11: explore(neighbor)
          pushStep(`Neighbor ${neighbor} not visited. Recursing into explore(${neighbor}).`, 11, node, neighbor);
          explore(neighbor);

          // Line 12: End of if (returned from recursion)
          pushStep(`Returned from explore(${neighbor}) to node ${node}.`, 12, node);
        } else {
          pushStep(`Neighbor ${neighbor} already visited. Skipping.`, 10, node, neighbor);
        }
      }

      // Line 14: End of explore
      pushStep(`Finished exploring node ${node}. Backtracking...`, 14, node);
      recursionStack.pop();
    };

    // Line 16: explore(start)
    pushStep("Starting DFS traversal from initial node 0.", 16, null);
    explore(0);

    // Line 17: return result
    pushStep(`DFS complete! Final visit order: ${result.join(', ')}.`, 17, null);

    setSteps(newSteps);
    setCurrentStepIndex(0);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / (speed / 1000)); // speed is likely mapped differently in StepControls, but I'll maintain responsiveness
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

  return (
    <div className="space-y-6">
      <StepControls
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        speed={speed / 1000}
        onSpeedChange={(s) => setSpeed(s * 1000)}
        currentStep={currentStepIndex}
        totalSteps={steps.length - 1}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 pb-4 overflow-hidden">
            <GraphDiagram
              data={[[1, 2], [0, 3, 4], [0, 5], [1], [1], [2]]}
              currentNode={currentStep.currentNode}
              highlightNodes={new Set(currentStep.visited)}
              className="h-[300px]"
            />

            <div className="flex gap-4 text-xs justify-center pt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary border-2 border-primary"></div>
                <span>Current Node</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500/20 border-2 border-green-500"></div>
                <span>Visited</span>
              </div>
            </div>
          </div>

          <div className={`rounded-lg border p-4 transition-all duration-300 ${currentStep.lineNumber === 17 ? 'bg-green-500/10 border-green-500' : 'bg-accent/50 border-accent'}`}>
            <p className="text-sm text-foreground font-medium italic">"{currentStep.message}"</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Local Variables</h4>
              <VariablePanel
                variables={{
                  node: currentStep.currentNode !== null ? currentStep.currentNode : 'undefined',
                  neighbor: currentStep.neighbor !== null ? currentStep.neighbor : 'none',
                  visited: `{${currentStep.visited.join(', ')}}`,
                }}
              />
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recursion Stack</h4>
              <div className="bg-card rounded-lg border p-2 min-h-[80px]">
                {currentStep.recursionStack.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic p-2 text-center">Stack empty</p>
                ) : (
                  <div className="flex flex-col-reverse gap-1">
                    {currentStep.recursionStack.map((node, i) => (
                      <div key={i} className={`text-xs p-1.5 rounded border transition-colors ${i === currentStep.recursionStack.length - 1 ? 'bg-primary/10 border-primary text-primary font-medium' : 'bg-muted/50 border-border text-muted-foreground opacity-70'}`}>
                        explore({node})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <AnimatedCodeEditor
          code={code}
          highlightedLines={[currentStep.lineNumber]}
          language="typescript"
        />
      </div>
    </div>
  );
};
