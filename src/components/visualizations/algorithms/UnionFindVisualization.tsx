import React, { useState, useEffect, useRef } from 'react';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  parent: number[];
  rank: number[];
  operation: 'union' | 'find' | 'init';
  x: number;
  y?: number;
  result: number | boolean;
  message: string;
  lineNumber: number;
}

export const UnionFindVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `class UnionFind {
  constructor(n) {
    this.parent = Array(n).fill(0).map((_, i) => i);
    this.rank = Array(n).fill(0);
  }
  
  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }
  
  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    
    if (rootX === rootY) return false;
    
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    return true;
  }
}`;

  const generateSteps = () => {
    const n = 6;
    const parent = Array(n).fill(0).map((_, i) => i);
    const rank = Array(n).fill(0);
    const newSteps: Step[] = [];

    newSteps.push({
      parent: [...parent],
      rank: [...rank],
      operation: 'init',
      x: 0,
      result: 0,
      message: 'Initialize: Each element is its own parent',
      lineNumber: 3
    });

    const operations = [
      { op: 'union' as const, x: 0, y: 1 },
      { op: 'union' as const, x: 2, y: 3 },
      { op: 'union' as const, x: 0, y: 2 },
      { op: 'find' as const, x: 3 }
    ];

    const find = (x: number): number => {
      if (parent[x] !== x) {
        parent[x] = find(parent[x]);
      }
      return parent[x];
    };

    const union = (x: number, y: number): boolean => {
      const rootX = find(x);
      const rootY = find(y);
      
      if (rootX === rootY) return false;
      
      if (rank[rootX] < rank[rootY]) {
        parent[rootX] = rootY;
      } else if (rank[rootX] > rank[rootY]) {
        parent[rootY] = rootX;
      } else {
        parent[rootY] = rootX;
        rank[rootX]++;
      }
      return true;
    };

    for (const { op, x, y } of operations) {
      if (op === 'union' && y !== undefined) {
        const result = union(x, y);
        newSteps.push({
          parent: [...parent],
          rank: [...rank],
          operation: 'union',
          x,
          y,
          result,
          message: `Union(${x}, ${y}): ${result ? 'Merged sets' : 'Already in same set'}`,
          lineNumber: 14
        });
      } else if (op === 'find') {
        const result = find(x);
        newSteps.push({
          parent: [...parent],
          rank: [...rank],
          operation: 'find',
          x,
          result,
          message: `Find(${x}): Root is ${result}`,
          lineNumber: 7
        });
      }
    }

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

      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">Union-Find (Disjoint Set)</h3>
        
        <div className="grid grid-cols-6 gap-4 mb-6">
          {currentStep.parent.map((parent, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div
                className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-lg transition-all ${
                  idx === currentStep.x || idx === currentStep.y
                    ? 'bg-primary/20 border-primary text-primary scale-110'
                    : parent === idx
                    ? 'bg-green-500/20 border-green-500 text-green-500'
                    : 'bg-card border-border'
                }`}
              >
                {idx}
              </div>
              <div className="text-xs text-muted-foreground">
                Parent: {parent}
              </div>
              <div className="text-xs text-muted-foreground">
                Rank: {currentStep.rank[idx]}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-muted rounded">
          <p className="text-sm">{currentStep.message}</p>
        </div>
      </div>

      <VariablePanel
        variables={{
          operation: currentStep.operation,
          x: currentStep.x,
          y: currentStep.y !== undefined ? currentStep.y : 'N/A',
          result: String(currentStep.result)
        }}
      />

      <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
    </div>
  );
};
