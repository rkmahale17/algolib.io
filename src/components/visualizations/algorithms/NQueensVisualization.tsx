import React, { useEffect, useRef, useState } from 'react';

import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  n: number;
  board: string[][];
  row: number;
  col: number;
  colSet: number[];
  posDiagSet: number[];
  negDiagSet: number[];
  allSolutions: string[][];
  message: string;
  lineNumber: number;
}

export const NQueensVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function solveNQueens(n: number): string[][] {
  const col = new Set<number>();
  const posDiag = new Set<number>();
  const negDiag = new Set<number>();
  const res: string[][] = [];
  const board: string[][] = Array.from({ length: n }, () => Array(n).fill('.'));

  function backtrack(r: number): void {
    if (r === n) {
      const copy = board.map(row => row.join(""));
      res.push(copy);
      return;
    }

    for (let c = 0; c < n; c++) {
      if (col.has(c) || posDiag.has(r + c) || negDiag.has(r - c)) {
        continue;
      }

      col.add(c);
      posDiag.add(r + c);
      negDiag.add(r - c);
      board[r][c] = "Q";

      backtrack(r + 1);

      col.delete(c);
      posDiag.delete(r + c);
      negDiag.delete(r - c);
      board[r][c] = ".";
    }
  }

  backtrack(0);
  return res;
}`;

  const generateSteps = () => {
    const n = 4;
    const newSteps: Step[] = [];
    const col = new Set<number>();
    const posDiag = new Set<number>();
    const negDiag = new Set<number>();
    const res: string[][] = [];
    const board: string[][] = Array.from({ length: n }, () => Array(n).fill('.'));

    const addStep = (row: number, c: number, message: string, line: number) => {
      newSteps.push({
        n,
        board: board.map(r => [...r]),
        row,
        col: c,
        colSet: Array.from(col),
        posDiagSet: Array.from(posDiag),
        negDiagSet: Array.from(negDiag),
        allSolutions: [...res],
        message,
        lineNumber: line
      });
    };

    function backtrack(r: number): void {
      addStep(r, -1, `Checking row ${r}`, 9);
      if (r === n) {
        const copy = board.map(row => row.join(""));
        res.push(copy);
        addStep(r, -1, `Found a solution! Total solutions: ${res.length}`, 11);
        return;
      }

      for (let c = 0; c < n; c++) {
        addStep(r, c, `Checking column ${c} in row ${r}`, 15);
        addStep(r, c, `Checking if safety constraints are met at (${r}, ${c})`, 16);
        if (col.has(c) || posDiag.has(r + c) || negDiag.has(r - c)) {
          addStep(r, c, `Position (${r}, ${c}) is unsafe. Skipping column ${c}.`, 17);
          continue;
        }

        col.add(c);
        posDiag.add(r + c);
        negDiag.add(r - c);
        board[r][c] = "Q";
        addStep(r, c, `Placing queen at (${r}, ${c}) and updating sets`, 23);

        addStep(r, c, `Moving to the next row (r=${r + 1})`, 25);
        backtrack(r + 1);

        col.delete(c);
        posDiag.delete(r + c);
        negDiag.delete(r - c);
        board[r][c] = ".";
        addStep(r, c, `Backtracking: Removing queen from (${r}, ${c}) and updating sets`, 30);
      }
    }

    addStep(-1, -1, `Starting N-Queens algorithm for n=${n}`, 1);
    addStep(-1, -1, `Initializing sets and empty board`, 6);
    addStep(0, -1, `Calling backtrack(0)`, 34);
    backtrack(0);
    addStep(-1, -1, `Algorithm complete. Found ${res.length} solutions.`, 35);
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
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) setCurrentStepIndex(currentStepIndex + 1);
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
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
          <h3 className="text-lg font-semibold mb-4">{currentStep.n}-Queens Board</h3>

          <div className="grid gap-1 mb-6" style={{ gridTemplateColumns: `repeat(${currentStep.n}, minmax(0, 1fr))`, maxWidth: '400px' }}>
            {currentStep.board.map((row, r) =>
              row.map((cell, c) => (
                <div
                  key={`${r}-${c}`}
                  className={`aspect-square flex items-center justify-center rounded border-2 text-2xl transition-all ${r === currentStep.row && c === currentStep.col
                    ? 'bg-primary/20 border-primary animate-pulse'
                    : cell === 'Q'
                      ? 'bg-green-500/20 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                      : (r + c) % 2 === 0
                        ? 'bg-muted/30 border-border'
                        : 'bg-card border-border'
                    }`}
                >
                  {cell === 'Q' ? '♛' : ''}
                </div>
              ))
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Occupied Sets</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-2 bg-muted/50 rounded border text-xs">
                  <span className="font-semibold block mb-1">col:</span>
                  <div className="flex flex-wrap gap-1">
                    {currentStep.colSet.length > 0 ? currentStep.colSet.map(v => <span key={v} className="px-1 bg-blue-500/20 rounded border border-blue-500/30">{v}</span>) : '-'}
                  </div>
                </div>
                <div className="p-2 bg-muted/50 rounded border text-xs">
                  <span className="font-semibold block mb-1">posDiag (r+c):</span>
                  <div className="flex flex-wrap gap-1">
                    {currentStep.posDiagSet.length > 0 ? currentStep.posDiagSet.map(v => <span key={v} className="px-1 bg-purple-500/20 rounded border border-purple-500/30">{v}</span>) : '-'}
                  </div>
                </div>
                <div className="p-2 bg-muted/50 rounded border text-xs">
                  <span className="font-semibold block mb-1">negDiag (r-c):</span>
                  <div className="flex flex-wrap gap-1">
                    {currentStep.negDiagSet.length > 0 ? currentStep.negDiagSet.map(v => <span key={v} className="px-1 bg-orange-500/20 rounded border border-orange-500/30">{v}</span>) : '-'}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Solutions Found: {currentStep.allSolutions.length}</h3>
              <div className="flex flex-wrap gap-4 max-h-48 overflow-y-auto p-2 border rounded bg-muted/20">
                {currentStep.allSolutions.length === 0 && <p className="text-sm text-muted-foreground italic">No solutions found yet...</p>}
                {currentStep.allSolutions.map((solution, idx) => (
                  <div key={idx} className="p-2 bg-card rounded border shadow-sm">
                    <div className="text-[10px] mb-1 font-medium">Solution {idx + 1}</div>
                    <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${currentStep.n}, minmax(0, 1fr))`, width: '80px' }}>
                      {solution.map((row, r) =>
                        row.split('').map((cell, c) => (
                          <div
                            key={`${r}-${c}`}
                            className={`aspect-square flex items-center justify-center text-[10px] ${cell === 'Q' ? 'bg-green-500/40' : (r + c) % 2 === 0 ? 'bg-muted' : 'bg-background'
                              }`}
                          >
                            {cell === 'Q' ? '♛' : ''}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-muted/50 border rounded-lg">
            <p className="text-sm font-medium">{currentStep.message}</p>
          </div>
          <div className="mt-4">
            <VariablePanel
              variables={{
                'n': currentStep.n,
                'currentRow': currentStep.row === -1 ? 'N/A' : currentStep.row,
                'currentCol': currentStep.col === -1 ? 'N/A' : currentStep.col,
                'colSetSize': currentStep.colSet.length,
                'solutions': currentStep.allSolutions.length
              }}
            />
          </div>
        </div>
        <AnimatedCodeEditor code={code} highlightedLines={[currentStep.lineNumber]} language="typescript" />
      </div>
    </div>
  );
};
