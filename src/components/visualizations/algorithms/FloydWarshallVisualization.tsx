import { useEffect, useRef, useState } from 'react';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  matrix: number[][];
  k: number;
  i: number;
  j: number;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function floydWarshall(n: number, edges: [number, number, number][]): number[][] {
    const dist = Array.from({ length: n }, () => Array(n).fill(Infinity));
    for (let i = 0; i < n; i++) dist[i][i] = 0;
    for (const [u, v, w] of edges) {
        dist[u][v] = Math.min(dist[u][v], w);
    }
    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
            }
        }
    }
    return dist;
}`,
  python: `def floydWarshall(n: int, edges: list[list[int]]) -> list[list[int]]:
    dist = [[float('inf')] * n for _ in range(n)]
    for i in range(n):
        dist[i][i] = 0
    for u, v, w in edges:
        dist[u][v] = min(dist[u][v], w)
    for k in range(n):
        for i in range(n):
            for j in range(n):
                dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
    return dist`,
  java: `class Solution {
    public int[][] floydWarshall(int n, int[][] edges) {
        int[][] dist = new int[n][n];
        for (int i = 0; i < n; i++) {
            Arrays.fill(dist[i], 1000000000);
            dist[i][i] = 0;
        }
        for (int[] edge : edges) {
            int u = edge[0];
            int v = edge[1];
            int w = edge[2];
            dist[u][v] = Math.min(dist[u][v], w);
        }
        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }
        return dist;
    }
}`,
  cpp: `class Solution {
public:
    vector<vector<int>> floydWarshall(int n, vector<vector<int>>& edges) {
        vector<vector<int>> dist(n, vector<int>(n, 1e9));
        for (int i = 0; i < n; i++) dist[i][i] = 0;
        for (auto& edge : edges) {
            int u = edge[0];
            int v = edge[1];
            int w = edge[2];
            dist[u][v] = min(dist[u][v], w);
        }
        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }
        return dist;
    }
};`,
};

function generateVisualizationData() {
  const INF = Infinity;
  const n = 4;
  const edges: [number, number, number][] = [
    [0, 1, 3],
    [0, 3, 7],
    [1, 0, 8],
    [1, 2, 2],
    [2, 0, 5],
    [2, 3, 1],
    [3, 0, 2]
  ];

  const steps: Step[] = [];
  const stepLineNumbers: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
  const addLines = (ts: number, py: number, java: number, cpp: number) => {
    stepLineNumbers.typescript!.push(ts);
    stepLineNumbers.python!.push(py);
    stepLineNumbers.java!.push(java);
    stepLineNumbers.cpp!.push(cpp);
  };

  const dist = Array.from({ length: n }, () => Array(n).fill(INF));

  steps.push({
    matrix: dist.map(row => [...row]),
    k: -1,
    i: -1,
    j: -1,
    explanation: 'Initialize the distance matrix with Infinity for all pairs of vertices.',
    pseudoStep: 'SET dist = 2D Array of Infinity',
    variables: { k: 'N/A', i: 'N/A', j: 'N/A' }
  });
  addLines(2, 2, 3, 4);

  for (let i = 0; i < n; i++) {
    dist[i][i] = 0;
    steps.push({
      matrix: dist.map(row => [...row]),
      k: -1,
      i,
      j: i,
      explanation: `Set the diagonal distance from node ${i} to itself to 0.`,
      pseudoStep: `SET dist[${i}][${i}] = 0`,
      variables: { k: 'N/A', i, j: i }
    });
    addLines(3, 3, 6, 5);
  }

  for (const [u, v, w] of edges) {
    dist[u][v] = Math.min(dist[u][v], w);
    steps.push({
      matrix: dist.map(row => [...row]),
      k: -1,
      i: u,
      j: v,
      explanation: `Populate the distance matrix with the direct edge weight from node ${u} to node ${v} (weight ${w}).`,
      pseudoStep: `SET dist[${u}][${v}] = min(dist[${u}][${v}], ${w})  →  ${dist[u][v]}`,
      variables: { k: 'N/A', i: u, j: v }
    });
    addLines(4, 5, 12, 9);
  }

  // Iterate intermediate nodes
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        // Skip diagonal or unreachable intermediate states
        if (i === j) continue;
        const currentVal = dist[i][j];
        const viaVal = dist[i][k] + dist[k][j];
        const isBetter = viaVal < currentVal;

        steps.push({
          matrix: dist.map(row => [...row]),
          k,
          i,
          j,
          explanation: `Compare path from node ${i} to node ${j} directly vs via intermediate node ${k}. Direct: ${currentVal === INF ? '∞' : currentVal}. Via ${k}: ${dist[i][k] === INF ? '∞' : dist[i][k]} + ${dist[k][j] === INF ? '∞' : dist[k][j]} = ${viaVal === INF ? '∞' : viaVal}.`,
          pseudoStep: `IF dist[${i}][${k}] + dist[${k}][${j}] < dist[${i}][${j}]  →  ${isBetter ? 'YES ✓' : 'NO ✗'}`,
          variables: { k, i, j, current: currentVal === INF ? '∞' : currentVal, via: viaVal === INF ? '∞' : viaVal }
        });
        addLines(10, 10, 17, 17);

        if (isBetter) {
          dist[i][j] = viaVal;
          steps.push({
            matrix: dist.map(row => [...row]),
            k,
            i,
            j,
            explanation: `Found a shorter path! Update dist[${i}][${j}] to ${viaVal}.`,
            pseudoStep: `SET dist[${i}][${j}] = ${viaVal}`,
            variables: { k, i, j }
          });
          addLines(10, 10, 17, 17);
        }
      }
    }
  }

  steps.push({
    matrix: dist.map(row => [...row]),
    k: n - 1,
    i: -1,
    j: -1,
    explanation: 'Floyd-Warshall algorithm complete! Shortest paths for all pairs have been calculated.',
    pseudoStep: 'RETURN dist',
    variables: { k: 'done', i: 'done', j: 'done' }
  });
  addLines(14, 11, 21, 21);

  return { steps, stepLineNumbers };
}

export const FloydWarshallVisualization = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) { setIsPlaying(false); return prev; }
          return prev + 1;
        });
      }, 1000 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(p => p + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(p => p - 1);
  const handleReset = () => { setCurrentStepIndex(0); setIsPlaying(false); };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

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
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 flex flex-col items-center justify-center relative">
            <h4 className="text-sm font-semibold mb-4 text-foreground uppercase tracking-wider text-center">Distance Matrix</h4>
            <div className="overflow-x-auto w-full flex justify-center">
              <table className="border-collapse">
                <tbody>
                  {currentStep.matrix.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => {
                        const isCurrentCell = i === currentStep.i && j === currentStep.j;
                        const isKNode = i === currentStep.k || j === currentStep.k;
                        const isRowOrCol = (i === currentStep.i || j === currentStep.j) && currentStep.i !== -1;

                        return (
                          <td
                            key={j}
                            className={`border border-border w-12 h-12 text-center font-mono text-sm transition-colors duration-200 ${isCurrentCell
                              ? 'bg-primary text-primary-foreground font-bold'
                              : isKNode
                                ? 'bg-amber-500/20 text-amber-500 border-amber-500/50'
                                : isRowOrCol
                                  ? 'bg-accent/40 text-foreground'
                                  : 'bg-card text-foreground'
                              }`}
                          >
                            {cell === Infinity ? '∞' : cell}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center gap-4 mt-4 text-[10px] text-muted-foreground border-t pt-2 w-full">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-primary rounded-sm" /> Current Cell [i][j]</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500/20 border border-amber-500/50 rounded-sm" /> k-Path [i][k] or [k][j]</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-card border rounded-sm" /> Standard</span>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm font-medium text-foreground">{currentStep.explanation}</p>
          </div>

          <VariablePanel
            variables={{
              k: currentStep.k >= 0 ? currentStep.k : 'N/A',
              i: currentStep.i >= 0 ? currentStep.i : 'N/A',
              j: currentStep.j >= 0 ? currentStep.j : 'N/A',
              ...currentStep.variables
            }}
          />
        </div>

        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={handleReset}
        />
      </div>
    </div>
  );
};
