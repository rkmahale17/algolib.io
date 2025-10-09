import React, { useEffect, useRef, useState } from 'react';

import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function topologicalSort(graph, numNodes) {
  const inDegree = Array(numNodes).fill(0);
  
  // Calculate in-degrees
  for (let node in graph) {
    for (let neighbor of graph[node]) {
      inDegree[neighbor]++;
    }
  }
  
  // Add nodes with 0 in-degree to queue
  const queue = [];
  for (let i = 0; i < numNodes; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }
  
  const result = [];
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node);
    
    // Reduce in-degree for neighbors
    for (let neighbor of graph[node] || []) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }
  
  return result;
}`;

  const generateSteps = () => {
    const graph: Record<number, number[]> = {
      0: [2, 3],
      1: [3, 4],
      2: [3],
      3: [4],
      4: []
    };
    const numNodes = 5;
    
    const inDegree = Array(numNodes).fill(0);
    for (let node in graph) {
      for (let neighbor of graph[node]) {
        inDegree[neighbor]++;
      }
    }
    
    const newSteps: Step[] = [];
    
    newSteps.push({
      currentNode: null,
      inDegree: [...inDegree],
      queue: [],
      result: [],
      message: `Calculated in-degrees: [${inDegree.join(', ')}]`,
      lineNumber: 4
    });

    const queue: number[] = [];
    for (let i = 0; i < numNodes; i++) {
      if (inDegree[i] === 0) queue.push(i);
    }

    newSteps.push({
      currentNode: null,
      inDegree: [...inDegree],
      queue: [...queue],
      result: [],
      message: `Initial queue (in-degree 0): [${queue.join(', ')}]`,
      lineNumber: 12
    });

    const result: number[] = [];
    while (queue.length > 0) {
      const node = queue.shift()!;
      result.push(node);
      
      newSteps.push({
        currentNode: node,
        inDegree: [...inDegree],
        queue: [...queue],
        result: [...result],
        message: `Process node ${node}`,
        lineNumber: 18
      });

      for (let neighbor of graph[node] || []) {
        inDegree[neighbor]--;
        if (inDegree[neighbor] === 0) {
          queue.push(neighbor);
          newSteps.push({
            currentNode: node,
            inDegree: [...inDegree],
            queue: [...queue],
            result: [...result],
            message: `Node ${neighbor} in-degree became 0, added to queue`,
            lineNumber: 24
          });
        }
      }
    }

    newSteps.push({
      currentNode: null,
      inDegree: [...inDegree],
      queue: [],
      result: [...result],
      message: `Topological order: [${result.join(' → ')}]`,
      lineNumber: 30
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

      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">Topological Sort (Kahn's Algorithm)</h3>
        
        <div className="grid grid-cols-5 gap-4 mb-6">
          {currentStep.inDegree.map((degree, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div
                className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-lg transition-all ${
                  currentStep.currentNode === idx
                    ? 'bg-primary/20 border-primary text-primary scale-110'
                    : currentStep.result.includes(idx)
                    ? 'bg-green-500/20 border-green-500 text-green-500'
                    : currentStep.queue.includes(idx)
                    ? 'bg-blue-500/20 border-blue-500 text-blue-500'
                    : 'bg-card border-border'
                }`}
              >
                {idx}
              </div>
              <div className="text-xs text-muted-foreground">
                In-degree: {degree}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          <div className="p-3 bg-blue-500/10 rounded">
            <span className="text-sm font-semibold">Queue: </span>
            <span className="text-sm">[{currentStep.queue.join(', ')}]</span>
          </div>
          <div className="p-3 bg-green-500/10 rounded">
            <span className="text-sm font-semibold">Result: </span>
            <span className="text-sm">[{currentStep.result.join(' → ')}]</span>
          </div>
        </div>

        <div className="mt-4 p-4 bg-muted rounded">
          <p className="text-sm">{currentStep.message}</p>
        </div>
      <div className="mt-4 p-4 bg-muted rounded">
            <VariablePanel
        variables={{
          currentNode: currentStep.currentNode !== null ? currentStep.currentNode : 'none',
          queueSize: currentStep.queue.length,
          resultLength: currentStep.result.length
        }}
      />
      </div>
      </div>

  
      <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />

</div>


    </div>
  );
};
