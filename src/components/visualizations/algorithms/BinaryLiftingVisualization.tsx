import React, { useEffect, useRef, useState } from 'react';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  tree: number[][];
  parent: number[][];
  depth: number[];
  currentNode: number;
  targetNode: number;
  k: number;
  operation: string;
  message: string;
  lineNumber: number;
}

export const BinaryLiftingVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `class BinaryLifting {
  parent: number[][];
  depth: number[];
  n: number;
  LOG: number;
  
  constructor(tree: number[][], root: number) {
    this.n = tree.length;
    this.LOG = Math.ceil(Math.log2(this.n));
    this.parent = Array(this.n).fill(0).map(() => Array(this.LOG).fill(-1));
    this.depth = Array(this.n).fill(0);
    
    this.dfs(tree, root, -1);
    this.precompute();
  }
  
  dfs(tree: number[][], u: number, p: number) {
    this.parent[u][0] = p;
    for (const v of tree[u]) {
      if (v !== p) {
        this.depth[v] = this.depth[u] + 1;
        this.dfs(tree, v, u);
      }
    }
  }
  
  precompute() {
    for (let j = 1; j < this.LOG; j++) {
      for (let i = 0; i < this.n; i++) {
        if (this.parent[i][j-1] !== -1) {
          this.parent[i][j] = this.parent[this.parent[i][j-1]][j-1];
        }
      }
    }
  }
  
  kthAncestor(node: number, k: number): number {
    for (let i = 0; i < this.LOG; i++) {
      if ((k & (1 << i)) !== 0) {
        node = this.parent[node][i];
        if (node === -1) break;
      }
    }
    return node;
  }
}`;

  const generateSteps = () => {
    const tree = [
      [1, 2],       // 0
      [0, 3, 4],    // 1
      [0, 5],       // 2
      [1],          // 3
      [1],          // 4
      [2, 6, 7],    // 5
      [5],          // 6
      [5]           // 7
    ];

    const n = tree.length;
    const LOG = Math.ceil(Math.log2(n));
    const parent: number[][] = Array(n).fill(0).map(() => Array(LOG).fill(-1));
    const depth: number[] = Array(n).fill(0);
    const newSteps: Step[] = [];

    newSteps.push({
      tree: tree.map(arr => [...arr]),
      parent: parent.map(arr => [...arr]),
      depth: [...depth],
      currentNode: 0,
      targetNode: -1,
      k: 0,
      operation: 'init',
      message: 'Initialize: Building binary lifting table',
      lineNumber: 7
    });

    // DFS to build tree
    const dfs = (u: number, p: number) => {
      parent[u][0] = p;
      
      newSteps.push({
        tree: tree.map(arr => [...arr]),
        parent: parent.map(arr => [...arr]),
        depth: [...depth],
        currentNode: u,
        targetNode: -1,
        k: 0,
        operation: 'dfs',
        message: `DFS: Visit node ${u}, parent[${u}][0] = ${p}, depth = ${depth[u]}`,
        lineNumber: 17
      });

      for (const v of tree[u]) {
        if (v !== p) {
          depth[v] = depth[u] + 1;
          dfs(v, u);
        }
      }
    };

    dfs(0, -1);

    // Precompute ancestors
    for (let j = 1; j < LOG; j++) {
      for (let i = 0; i < n; i++) {
        if (parent[i][j-1] !== -1) {
          parent[i][j] = parent[parent[i][j-1]][j-1];
          
          newSteps.push({
            tree: tree.map(arr => [...arr]),
            parent: parent.map(arr => [...arr]),
            depth: [...depth],
            currentNode: i,
            targetNode: -1,
            k: 0,
            operation: 'precompute',
            message: `Precompute: parent[${i}][${j}] = parent[${parent[i][j-1]}][${j-1}] = ${parent[i][j]}`,
            lineNumber: 29
          });
        }
      }
    }

    // Query: Find 3rd ancestor of node 7
    const queryNode = 7;
    const k = 3;
    let node = queryNode;

    newSteps.push({
      tree: tree.map(arr => [...arr]),
      parent: parent.map(arr => [...arr]),
      depth: [...depth],
      currentNode: node,
      targetNode: -1,
      k,
      operation: 'query_start',
      message: `Query: Find ${k}th ancestor of node ${queryNode}`,
      lineNumber: 37
    });

    for (let i = 0; i < LOG; i++) {
      if ((k & (1 << i)) !== 0) {
        const prevNode = node;
        node = parent[node][i];
        
        newSteps.push({
          tree: tree.map(arr => [...arr]),
          parent: parent.map(arr => [...arr]),
          depth: [...depth],
          currentNode: node,
          targetNode: prevNode,
          k,
          operation: 'query_step',
          message: `Jump 2^${i} = ${1 << i} steps: ${prevNode} → ${node}`,
          lineNumber: 40
        });

        if (node === -1) break;
      }
    }

    newSteps.push({
      tree: tree.map(arr => [...arr]),
      parent: parent.map(arr => [...arr]),
      depth: [...depth],
      currentNode: node,
      targetNode: -1,
      k,
      operation: 'query_result',
      message: `Result: ${k}th ancestor of ${queryNode} is ${node}`,
      lineNumber: 45
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
          <h3 className="text-lg font-semibold mb-4">Binary Lifting (LCA)</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {currentStep.depth.map((d, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border-2 text-center ${
                    idx === currentStep.currentNode
                      ? 'bg-primary/20 border-primary scale-110'
                      : idx === currentStep.targetNode
                      ? 'bg-yellow-500/20 border-yellow-500'
                      : 'bg-muted/30 border-border'
                  } transition-all`}
                >
                  <div className="font-bold text-lg">{idx}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    depth: {d}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    p[0]: {currentStep.parent[idx][0]}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-muted/30 rounded-lg overflow-x-auto">
              <div className="text-xs font-semibold text-muted-foreground mb-2">
                Binary Lifting Table (parent[i][j] = 2^j ancestor)
              </div>
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr>
                    <th className="border border-border p-1">Node</th>
                    {Array.from({ length: Math.ceil(Math.log2(currentStep.depth.length)) }).map((_, j) => (
                      <th key={j} className="border border-border p-1">2^{j}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentStep.parent.map((row, i) => (
                    <tr key={i} className={i === currentStep.currentNode ? 'bg-primary/20' : ''}>
                      <td className="border border-border p-1 font-bold">{i}</td>
                      {row.map((val, j) => (
                        <td key={j} className="border border-border p-1 text-center">
                          {val === -1 ? '-' : val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-muted rounded">
              <p className="text-sm">{currentStep.message}</p>
            </div>
          </div>

          <div className="mt-4">
            <VariablePanel
              variables={{
                operation: currentStep.operation,
                current: currentStep.currentNode,
                k: currentStep.k || 'N/A'
              }}
            />
          </div>
        </div>

        <CodeHighlighter 
          code={code} 
          highlightedLine={currentStep.lineNumber} 
          language="typescript" 
        />
      </div>
    </div>
  );
};
