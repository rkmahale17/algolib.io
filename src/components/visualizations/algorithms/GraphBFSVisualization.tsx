import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { GraphDiagram } from '../GraphDiagram';

interface Step {
  currentNode: number | null;
  activeNeighbor: number | null;
  visited: number[];
  queue: number[];
  result: number[];
  message: string;
  lineNumber: number;
}

export const GraphBFSVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function bfs(graph: number[][], start: number): number[] {
  const visited = new Set<number>();
  const queue: number[] = [start];
  const result: number[] = [];

  visited.add(start);

  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

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
    const queue: number[] = [];
    const result: number[] = [];

    const pushStep = (msg: string, line: number, current: number | null, neighbor: number | null = null) => {
      newSteps.push({
        currentNode: current,
        activeNeighbor: neighbor,
        visited: Array.from(visited),
        queue: [...queue],
        result: [...result],
        message: msg,
        lineNumber: line
      });
    };

    // Initialization steps
    pushStep('Initialize visited set.', 2, null);

    queue.push(0);
    pushStep('Initialize queue with starting node 0.', 3, null);

    pushStep('Initialize empty result array.', 4, null);

    visited.add(0);
    pushStep('Mark start node 0 as visited.', 6, null);

    while (queue.length > 0) {
      pushStep('Check if queue is not empty.', 8, null);

      const node = queue.shift()!;
      pushStep(`Dequeue node ${node} to process.`, 9, node);

      result.push(node);
      pushStep(`Add node ${node} to the traversal result.`, 10, node);

      const neighbors = graph[node] || [];
      pushStep(`Check neighbors of node ${node}: [${neighbors.join(', ')}].`, 12, node);

      for (const neighbor of neighbors) {
        pushStep(`Check if neighbor ${neighbor} has been visited.`, 13, node, neighbor);

        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          pushStep(`Neighbor ${neighbor} not visited. Mark it as visited.`, 14, node, neighbor);

          queue.push(neighbor);
          pushStep(`Enqueue neighbor ${neighbor} for future processing.`, 15, node, neighbor);
        } else {
          pushStep(`Neighbor ${neighbor} already visited. Skipping.`, 13, node, neighbor);
        }
      }
    }

    pushStep('Queue is empty. BFS traversal complete.', 18, null);
    pushStep(`Returning final result: [${result.join(', ')}].`, 20, null);

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
      }, 1200 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
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
        speed={speed}
        onSpeedChange={setSpeed}
        currentStep={currentStepIndex}
        totalSteps={steps.length - 1}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 pb-4 overflow-hidden relative">
            <GraphDiagram
              data={[[1, 2], [0, 3, 4], [0, 5], [1], [1], [2]]}
              currentNode={currentStep.currentNode}
              highlightNodes={new Set(currentStep.visited)}
              className="h-[280px]"
            />

            <div className="flex gap-4 text-xs justify-center pt-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500" />
                <span>Visited</span>
              </div>
              {currentStep.activeNeighbor !== null && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 border border-blue-600 animate-pulse" />
                  <span>Checking Neighbor</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Algorithm Queue</h4>
            <div className="bg-card rounded-lg border p-4 flex items-center gap-3 overflow-x-auto min-h-[72px]">
              <AnimatePresence mode="popLayout">
                {currentStep.queue.length === 0 ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-muted-foreground italic w-full text-center"
                  >
                    Queue is empty
                  </motion.p>
                ) : (
                  currentStep.queue.map((node, i) => (
                    <motion.div
                      key={`${node}-${i}`}
                      initial={{ scale: 0.5, opacity: 0, x: 20 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
                      exit={{ scale: 0.5, opacity: 0, x: -20 }}
                      className={`min-w-[40px] h-10 flex items-center justify-center rounded border-2 shadow-sm font-bold transition-colors ${i === 0 ? 'bg-primary/20 border-primary text-primary' : 'bg-muted border-border'
                        }`}
                    >
                      {node}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className={`rounded-lg border p-4 transition-all duration-300 ${currentStep.lineNumber === 20 ? 'bg-green-500/10 border-green-500 shadow-lg shadow-green-500/10' : 'bg-accent/50 border-accent'}`}>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentStepIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-sm text-foreground font-medium italic leading-relaxed"
              >
                "{currentStep.message}"
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="rounded-lg border bg-card">
            <VariablePanel
              variables={{
                node: currentStep.currentNode !== null ? currentStep.currentNode : 'null',
                neighbor: currentStep.activeNeighbor !== null ? currentStep.activeNeighbor : 'none',
                visitedNodes: `{${currentStep.visited.join(', ')}}`,
                result: `[${currentStep.result.join(', ')}]`
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <AnimatedCodeEditor code={code} highlightedLines={[currentStep.lineNumber]} language="TypeScript" />
        </div>
      </div>
    </div>
  );
};
