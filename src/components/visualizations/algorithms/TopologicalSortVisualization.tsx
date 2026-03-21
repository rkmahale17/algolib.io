import React, { useEffect, useState, useMemo } from 'react';

import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface Step {
  currentNode: number | null;
  inDegree: number[];
  queue: number[];
  result: number[];
  message: string;
  lineNumber: number;
}

export const TopologicalSortVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);


  const code = `function topologicalSort(graph: Map<number, number[]>): number[] {
  const indegrees: number[] = new Array(graph.size).fill(0);

  for (const node of graph.keys()) {
    for (const neighbor of graph.get(node) || []) {
      indegrees[neighbor]++;
    }
  }

  const queue: number[] = [];

  for (let i = 0; i < graph.size; i++) {
    if (indegrees[i] === 0) {
      queue.push(i);
    }
  }

  const result: number[] = [];

  while (queue.length > 0) {
    const node: number = queue.shift()!;
    result.push(node);

    for (const neighbor of graph.get(node) || []) {
      indegrees[neighbor]--;

      if (indegrees[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  if (result.length !== graph.size) {
    return [];
  }

  return result;
}`;

  const generateSteps = () => {
    const graphValues: Record<number, number[]> = {
      0: [2, 3],
      1: [3, 4],
      2: [3],
      3: [4],
      4: []
    };
    const numNodes = 5;
    const graph = new Map<number, number[]>();
    for (const key in graphValues) {
      graph.set(Number(key), graphValues[key]);
    }

    const newSteps: Step[] = [];

    const indegrees: number[] = new Array(numNodes).fill(0);
    newSteps.push({
      currentNode: null,
      inDegree: [...indegrees],
      queue: [],
      result: [],
      message: "Initialize in-degrees to 0",
      lineNumber: 2
    });

    for (const [node, neighbors] of graph.entries()) {
      for (const neighbor of neighbors) {
        indegrees[neighbor]++;
      }
    }

    newSteps.push({
      currentNode: null,
      inDegree: [...indegrees],
      queue: [],
      result: [],
      message: `Calculated in-degrees: [${indegrees.join(', ')}]`,
      lineNumber: 4
    });

    const queue: number[] = [];
    newSteps.push({
      currentNode: null,
      inDegree: [...indegrees],
      queue: [...queue],
      result: [],
      message: "Initialize empty queue",
      lineNumber: 10
    });

    for (let i = 0; i < numNodes; i++) {
      if (indegrees[i] === 0) {
        queue.push(i);
        newSteps.push({
          currentNode: null,
          inDegree: [...indegrees],
          queue: [...queue],
          result: [],
          message: `Node ${i} has in-degree 0, adding to queue`,
          lineNumber: 14
        });
      }
    }

    const result: number[] = [];
    newSteps.push({
      currentNode: null,
      inDegree: [...indegrees],
      queue: [...queue],
      result: [...result],
      message: "Initialize empty result list",
      lineNumber: 18
    });

    while (queue.length > 0) {
      const node = queue.shift()!;
      newSteps.push({
        currentNode: node,
        inDegree: [...indegrees],
        queue: [...queue],
        result: [...result],
        message: `Dequeued node ${node}`,
        lineNumber: 21
      });

      result.push(node);
      newSteps.push({
        currentNode: node,
        inDegree: [...indegrees],
        queue: [...queue],
        result: [...result],
        message: `Added node ${node} to result`,
        lineNumber: 22
      });

      for (const neighbor of graph.get(node) || []) {
        indegrees[neighbor]--;
        newSteps.push({
          currentNode: node,
          inDegree: [...indegrees],
          queue: [...queue],
          result: [...result],
          message: `Decremented in-degree of neighbor ${neighbor} to ${indegrees[neighbor]}`,
          lineNumber: 25
        });

        if (indegrees[neighbor] === 0) {
          queue.push(neighbor);
          newSteps.push({
            currentNode: node,
            inDegree: [...indegrees],
            queue: [...queue],
            result: [...result],
            message: `Neighbor ${neighbor} in-degree reached 0, adding to queue`,
            lineNumber: 28
          });
        }
      }
    }

    newSteps.push({
      currentNode: null,
      inDegree: [...indegrees],
      queue: [...queue],
      result: [...result],
      message: "Final topological order computed",
      lineNumber: 37
    });

    setSteps(newSteps);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  const currentStep = steps[currentStepIndex];
  if (!currentStep) return null;

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-xs font-semibold mb-6 text-muted-foreground uppercase tracking-widest">
              Topological Sort Visualization
            </h3>

            <div className="grid grid-cols-5 gap-4 mb-6">
              {currentStep.inDegree.map((degree, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <motion.div
                    animate={{ scale: currentStep.currentNode === idx ? 1.1 : 1 }}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-medium text-base transition-all ${currentStep.currentNode === idx
                      ? 'bg-primary/20 border-primary text-primary'
                      : currentStep.result.includes(idx)
                        ? 'bg-green-500/20 border-green-500 text-green-500'
                        : currentStep.queue.includes(idx)
                          ? 'bg-blue-500/20 border-blue-500 text-blue-500'
                          : 'bg-card border-border'
                      }`}
                  >
                    {idx}
                  </motion.div>
                  <div className="text-[10px] text-muted-foreground font-mono">
                    IN:{degree}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-blue-500/10 rounded-md border border-blue-500/20">
                <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Queue: </span>
                <span className="text-sm font-mono">[{currentStep.queue.join(', ')}]</span>
              </div>
              <div className="p-3 bg-green-500/10 rounded-md border border-green-500/20">
                <span className="text-xs font-semibold text-green-500 uppercase tracking-wider">Result: </span>
                <span className="text-sm font-mono">[{currentStep.result.join(' → ')}]</span>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Step Explanation</h4>
            <p className="text-sm font-medium leading-relaxed">{currentStep.message}</p>
          </Card>
        </div>
      }
      rightContent={
        <div className="space-y-4">
          <AnimatedCodeEditor
            code={code}
            language="typescript"
            highlightedLines={[currentStep.lineNumber]}
          />
          <VariablePanel
            variables={{
              currentNode: currentStep.currentNode !== null ? currentStep.currentNode : 'none',
              queueSize: currentStep.queue.length,
              resultLength: currentStep.result.length
            }}
          />
        </div>
      }
      controls={
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
      }
    />
  );
};
