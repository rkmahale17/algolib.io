import { useState, useEffect, useRef } from 'react';
import { VariablePanel } from '../shared/VariablePanel';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';

interface Step {
  matrix: number[][];
  k: number;
  i: number;
  j: number;
  message: string;
  lineNumber: number;
}

export const FloydWarshallVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function floydWarshall(graph) {
  const dist = [...graph];
  const n = graph.length;
  
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }
  return dist;
}`;

  const generateSteps = () => {
    const INF = 9999;
    const n = 4;
    const matrix = [
      [0, 3, INF, 7],
      [8, 0, 2, INF],
      [5, INF, 0, 1],
      [2, INF, INF, 0]
    ];

    const newSteps: Step[] = [];
    const dist = matrix.map(row => [...row]);

    newSteps.push({
      matrix: dist.map(row => [...row]),
      k: -1,
      i: -1,
      j: -1,
      message: 'Initialize distance matrix',
      lineNumber: 1
    });

    for (let k = 0; k < n; k++) {
      newSteps.push({
        matrix: dist.map(row => [...row]),
        k,
        i: -1,
        j: -1,
        message: `Using node ${k} as intermediate node`,
        lineNumber: 4
      });

      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          const direct = dist[i][j];
          const throughK = dist[i][k] + dist[k][j];

          newSteps.push({
            matrix: dist.map(row => [...row]),
            k,
            i,
            j,
            message: `Check path ${i}→${k}→${j}: ${dist[i][k]} + ${dist[k][j]} = ${throughK} vs ${direct}`,
            lineNumber: 7
          });

          if (throughK < dist[i][j]) {
            dist[i][j] = throughK;
            newSteps.push({
              matrix: dist.map(row => [...row]),
              k,
              i,
              j,
              message: `Update dist[${i}][${j}] = ${throughK}`,
              lineNumber: 8
            });
          }
        }
      }
    }

    newSteps.push({
      matrix: dist.map(row => [...row]),
      k: n,
      i: -1,
      j: -1,
      message: 'All pairs shortest paths computed!',
      lineNumber: 13
    });

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
      }, 1000 / speed);
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
        speed={speed}
        onSpeedChange={setSpeed}
        currentStep={currentStepIndex}
        totalSteps={steps.length - 1}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6">
            <div className="overflow-x-auto">
              <table className="mx-auto border-collapse">
                <tbody>
                  {currentStep.matrix.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          className={`border border-border p-3 text-center font-mono transition-all duration-300 ${
                            i === currentStep.i && j === currentStep.j
                              ? 'bg-primary text-white'
                              : i === currentStep.i || j === currentStep.j
                              ? 'bg-accent'
                              : 'bg-muted/20'
                          }`}
                        >
                          {cell === 9999 ? '∞' : cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>
        </div>

        <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
      </div>

      <VariablePanel
        variables={{
          k: currentStep.k >= 0 ? currentStep.k : 'N/A',
          i: currentStep.i >= 0 ? currentStep.i : 'N/A',
          j: currentStep.j >= 0 ? currentStep.j : 'N/A'
        }}
      />
    </div>
  );
};
