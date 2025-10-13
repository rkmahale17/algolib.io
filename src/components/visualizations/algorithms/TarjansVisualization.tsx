import React, { useEffect, useRef, useState } from 'react';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  graph: number[][];
  currentNode: number;
  disc: number[];
  low: number[];
  onStack: boolean[];
  stack: number[];
  sccs: number[][];
  time: number;
  message: string;
  lineNumber: number;
}

export const TarjansVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function tarjanSCC(graph: number[][]): number[][] {
  const n = graph.length;
  const disc = Array(n).fill(-1);
  const low = Array(n).fill(-1);
  const onStack = Array(n).fill(false);
  const stack: number[] = [];
  const sccs: number[][] = [];
  let time = 0;
  
  function dfs(u: number) {
    disc[u] = low[u] = time++;
    stack.push(u);
    onStack[u] = true;
    
    for (const v of graph[u]) {
      if (disc[v] === -1) {
        dfs(v);
        low[u] = Math.min(low[u], low[v]);
      } else if (onStack[v]) {
        low[u] = Math.min(low[u], disc[v]);
      }
    }
    
    if (low[u] === disc[u]) {
      const scc: number[] = [];
      let w: number;
      do {
        w = stack.pop()!;
        onStack[w] = false;
        scc.push(w);
      } while (w !== u);
      sccs.push(scc);
    }
  }
  
  for (let i = 0; i < n; i++) {
    if (disc[i] === -1) {
      dfs(i);
    }
  }
  
  return sccs;
}`;

  const generateSteps = () => {
    const graph = [
      [1],      // 0 -> 1
      [2],      // 1 -> 2
      [0, 3],   // 2 -> 0, 3
      [4],      // 3 -> 4
      [5],      // 4 -> 5
      [3]       // 5 -> 3
    ];

    const n = graph.length;
    const disc = Array(n).fill(-1);
    const low = Array(n).fill(-1);
    const onStack = Array(n).fill(false);
    const stack: number[] = [];
    const sccs: number[][] = [];
    let time = 0;
    const newSteps: Step[] = [];

    newSteps.push({
      graph: graph.map(arr => [...arr]),
      currentNode: -1,
      disc: [...disc],
      low: [...low],
      onStack: [...onStack],
      stack: [...stack],
      sccs: sccs.map(scc => [...scc]),
      time,
      message: 'Initialize: All nodes unvisited',
      lineNumber: 2
    });

    const dfs = (u: number) => {
      disc[u] = low[u] = time++;
      stack.push(u);
      onStack[u] = true;

      newSteps.push({
        graph: graph.map(arr => [...arr]),
        currentNode: u,
        disc: [...disc],
        low: [...low],
        onStack: [...onStack],
        stack: [...stack],
        sccs: sccs.map(scc => [...scc]),
        time,
        message: `Visit node ${u}: disc=${disc[u]}, low=${low[u]}`,
        lineNumber: 11
      });

      for (const v of graph[u]) {
        if (disc[v] === -1) {
          dfs(v);
          low[u] = Math.min(low[u], low[v]);
          
          newSteps.push({
            graph: graph.map(arr => [...arr]),
            currentNode: u,
            disc: [...disc],
            low: [...low],
            onStack: [...onStack],
            stack: [...stack],
            sccs: sccs.map(scc => [...scc]),
            time,
            message: `Backtrack to ${u}: Update low[${u}] = ${low[u]}`,
            lineNumber: 18
          });
        } else if (onStack[v]) {
          low[u] = Math.min(low[u], disc[v]);
          
          newSteps.push({
            graph: graph.map(arr => [...arr]),
            currentNode: u,
            disc: [...disc],
            low: [...low],
            onStack: [...onStack],
            stack: [...stack],
            sccs: sccs.map(scc => [...scc]),
            time,
            message: `Cross edge to ${v}: Update low[${u}] = ${low[u]}`,
            lineNumber: 20
          });
        }
      }

      if (low[u] === disc[u]) {
        const scc: number[] = [];
        let w: number;
        do {
          w = stack.pop()!;
          onStack[w] = false;
          scc.push(w);
        } while (w !== u);
        sccs.push(scc);

        newSteps.push({
          graph: graph.map(arr => [...arr]),
          currentNode: u,
          disc: [...disc],
          low: [...low],
          onStack: [...onStack],
          stack: [...stack],
          sccs: sccs.map(scc => [...scc]),
          time,
          message: `Found SCC: [${scc.join(', ')}]`,
          lineNumber: 32
        });
      }
    };

    for (let i = 0; i < n; i++) {
      if (disc[i] === -1) {
        dfs(i);
      }
    }

    newSteps.push({
      graph: graph.map(arr => [...arr]),
      currentNode: -1,
      disc: [...disc],
      low: [...low],
      onStack: [...onStack],
      stack: [...stack],
      sccs: sccs.map(scc => [...scc]),
      time,
      message: `Complete! Found ${sccs.length} strongly connected components`,
      lineNumber: 41
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
          <h3 className="text-lg font-semibold mb-4">Tarjan's Algorithm (SCC)</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-6 gap-2">
              {currentStep.disc.map((_, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border-2 text-center ${
                    idx === currentStep.currentNode
                      ? 'bg-primary/20 border-primary'
                      : currentStep.onStack[idx]
                      ? 'bg-yellow-500/20 border-yellow-500'
                      : currentStep.disc[idx] !== -1
                      ? 'bg-green-500/20 border-green-500'
                      : 'bg-muted/30 border-border'
                  }`}
                >
                  <div className="font-bold text-lg">{idx}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    d:{currentStep.disc[idx]}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    l:{currentStep.low[idx]}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-xs font-semibold text-muted-foreground mb-2">Stack</div>
                <div className="flex flex-wrap gap-1">
                  {currentStep.stack.length > 0 ? (
                    currentStep.stack.map((node, i) => (
                      <span key={i} className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-mono">
                        {node}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">Empty</span>
                  )}
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-xs font-semibold text-muted-foreground mb-2">SCCs Found</div>
                <div className="space-y-1">
                  {currentStep.sccs.length > 0 ? (
                    currentStep.sccs.map((scc, i) => (
                      <div key={i} className="text-xs font-mono bg-green-500/20 text-green-400 px-2 py-1 rounded">
                        [{scc.join(', ')}]
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">None yet</span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted rounded">
              <p className="text-sm">{currentStep.message}</p>
            </div>
          </div>

          <div className="mt-4">
            <VariablePanel
              variables={{
                current: currentStep.currentNode >= 0 ? currentStep.currentNode : 'N/A',
                time: currentStep.time,
                'stack size': currentStep.stack.length,
                'SCCs found': currentStep.sccs.length
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
